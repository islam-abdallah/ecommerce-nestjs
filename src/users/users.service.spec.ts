import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './dtos';

describe('UsersService', () => {
  let service: UsersService;

  const mockUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  };

  const mockCreateUserDto: CreateUserDto = {
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  const mockUpdateUserDto: UpdateUserDto = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(mockCreateUserDto);

      expect(mockRepository.create).toHaveBeenCalledWith(mockCreateUserDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should handle repository errors during creation', async () => {
      const error = new Error('Database error');
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockRejectedValue(error);

      await expect(service.create(mockCreateUserDto)).rejects.toThrow(error);
      expect(mockRepository.create).toHaveBeenCalledWith(mockCreateUserDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      const mockUsers = [mockUser];
      mockRepository.find.mockResolvedValue(mockUsers);

      const result = await service.getAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });

    it('should return empty array when no users exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.getAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should handle repository errors during getAll', async () => {
      const error = new Error('Database error');
      mockRepository.find.mockRejectedValue(error);

      await expect(service.getAll()).rejects.toThrow(error);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('getUser', () => {
    it('should return a user by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getUser(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getUser(999)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });

    it('should handle repository errors during getUser', async () => {
      const error = new Error('Database error');
      mockRepository.findOne.mockRejectedValue(error);

      await expect(service.getUser(1)).rejects.toThrow(error);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('update', () => {
    it('should update a user with all fields', async () => {
      const updatedUser = { ...mockUser, ...mockUpdateUserDto };
      jest.spyOn(service, 'getUser').mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update(1, mockUpdateUserDto);

      expect(service.getUser).toHaveBeenCalledWith(1);
      expect(mockRepository.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual(updatedUser);
    });

    it('should update a user with partial fields', async () => {
      const partialUpdateDto = { name: 'Updated Name' };
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      jest.spyOn(service, 'getUser').mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update(1, partialUpdateDto);

      expect(service.getUser).toHaveBeenCalledWith(1);
      expect(mockRepository.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual(updatedUser);
    });

    it('should preserve existing values when optional fields are not provided', async () => {
      const partialUpdateDto = { name: 'Updated Name' };
      const updatedUser = { 
        ...mockUser, 
        name: 'Updated Name',
        email: mockUser.email // Should remain unchanged
      };
      jest.spyOn(service, 'getUser').mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update(1, partialUpdateDto);

      expect(service.getUser).toHaveBeenCalledWith(1);
      expect(mockRepository.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException when user not found during update', async () => {
      const notFoundError = new NotFoundException('User not found');
      jest.spyOn(service, 'getUser').mockRejectedValue(notFoundError);

      await expect(service.update(999, mockUpdateUserDto)).rejects.toThrow(NotFoundException);
      expect(service.getUser).toHaveBeenCalledWith(999);
    });

    it('should handle repository errors during update', async () => {
      const error = new Error('Database error');
      jest.spyOn(service, 'getUser').mockResolvedValue(mockUser);
      mockRepository.save.mockRejectedValue(error);

      await expect(service.update(1, mockUpdateUserDto)).rejects.toThrow(error);
      expect(service.getUser).toHaveBeenCalledWith(1);
    });
  });

  describe('delete', () => {
    it('should delete a user by id', async () => {
      const deleteResult = { message: 'user deleted successfully' };
      jest.spyOn(service, 'getUser').mockResolvedValue(mockUser);
      mockRepository.remove.mockResolvedValue(mockUser);

      const result = await service.delete(1);

      expect(service.getUser).toHaveBeenCalledWith(1);
      expect(mockRepository.remove).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(deleteResult);
    });

    it('should throw NotFoundException when user not found during delete', async () => {
      const notFoundError = new NotFoundException('User not found');
      jest.spyOn(service, 'getUser').mockRejectedValue(notFoundError);

      await expect(service.delete(999)).rejects.toThrow(NotFoundException);
      expect(service.getUser).toHaveBeenCalledWith(999);
    });

    it('should handle repository errors during delete', async () => {
      const error = new Error('Database error');
      jest.spyOn(service, 'getUser').mockResolvedValue(mockUser);
      mockRepository.remove.mockRejectedValue(error);

      await expect(service.delete(1)).rejects.toThrow(error);
      expect(service.getUser).toHaveBeenCalledWith(1);
    });
  });
});


