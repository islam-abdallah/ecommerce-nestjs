import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from './review.entity';
import { CreateReviewDto, UpdateReviewDto } from './dtos';

describe('ReviewsService', () => {
  let service: ReviewsService;

  const mockReview: Review = {
    id: 1,
    name: 'John Doe',
    comment: 'Great product! Highly recommended.',
    rate: 5,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  };

  const mockCreateReviewDto: CreateReviewDto = {
    name: 'John Doe',
    comment: 'Great product! Highly recommended.',
    rate: 5,
  };

  const mockUpdateReviewDto: UpdateReviewDto = {
    name: 'Jane Doe',
    comment: 'Updated review comment.',
    rate: 4,
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
        ReviewsService,
        {
          provide: getRepositoryToken(Review),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new review', async () => {
      mockRepository.create.mockReturnValue(mockReview);
      mockRepository.save.mockResolvedValue(mockReview);

      const result = await service.create(mockCreateReviewDto);

      expect(mockRepository.create).toHaveBeenCalledWith(mockCreateReviewDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockReview);
      expect(result).toEqual(mockReview);
    });

    it('should handle repository errors during creation', async () => {
      const error = new Error('Database error');
      mockRepository.create.mockReturnValue(mockReview);
      mockRepository.save.mockRejectedValue(error);

      await expect(service.create(mockCreateReviewDto)).rejects.toThrow(error);
      expect(mockRepository.create).toHaveBeenCalledWith(mockCreateReviewDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockReview);
    });
  });

  describe('getAll', () => {
    it('should return all reviews', async () => {
      const mockReviews = [mockReview];
      mockRepository.find.mockResolvedValue(mockReviews);

      const result = await service.getAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockReviews);
    });

    it('should return empty array when no reviews exist', async () => {
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

  describe('getReview', () => {
    it('should return a review by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockReview);

      const result = await service.getReview(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockReview);
    });

    it('should throw NotFoundException when review not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getReview(999)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });

    it('should handle repository errors during getReview', async () => {
      const error = new Error('Database error');
      mockRepository.findOne.mockRejectedValue(error);

      await expect(service.getReview(1)).rejects.toThrow(error);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('update', () => {
    it('should update a review with all fields', async () => {
      const updatedReview = { ...mockReview, ...mockUpdateReviewDto };
      jest.spyOn(service, 'getReview').mockResolvedValue(mockReview);
      mockRepository.save.mockResolvedValue(updatedReview);

      const result = await service.update(1, mockUpdateReviewDto);

      expect(service.getReview).toHaveBeenCalledWith(1);
      expect(mockRepository.save).toHaveBeenCalledWith(updatedReview);
      expect(result).toEqual(updatedReview);
    });

    it('should update a review with partial fields', async () => {
      const partialUpdateDto = { name: 'Updated Name' };
      const updatedReview = { ...mockReview, name: 'Updated Name' };
      jest.spyOn(service, 'getReview').mockResolvedValue(mockReview);
      mockRepository.save.mockResolvedValue(updatedReview);

      const result = await service.update(1, partialUpdateDto);

      expect(service.getReview).toHaveBeenCalledWith(1);
      expect(mockRepository.save).toHaveBeenCalledWith(updatedReview);
      expect(result).toEqual(updatedReview);
    });

    it('should preserve existing values when optional fields are not provided', async () => {
      const partialUpdateDto = { name: 'Updated Name' };
      const updatedReview = { 
        ...mockReview, 
        name: 'Updated Name',
        comment: mockReview.comment, // Should remain unchanged
        rate: mockReview.rate // Should remain unchanged
      };
      jest.spyOn(service, 'getReview').mockResolvedValue(mockReview);
      mockRepository.save.mockResolvedValue(updatedReview);

      const result = await service.update(1, partialUpdateDto);

      expect(service.getReview).toHaveBeenCalledWith(1);
      expect(mockRepository.save).toHaveBeenCalledWith(updatedReview);
      expect(result).toEqual(updatedReview);
    });

    it('should throw NotFoundException when review not found during update', async () => {
      const notFoundError = new NotFoundException('Review not found');
      jest.spyOn(service, 'getReview').mockRejectedValue(notFoundError);

      await expect(service.update(999, mockUpdateReviewDto)).rejects.toThrow(NotFoundException);
      expect(service.getReview).toHaveBeenCalledWith(999);
    });

    it('should handle repository errors during update', async () => {
      const error = new Error('Database error');
      jest.spyOn(service, 'getReview').mockResolvedValue(mockReview);
      mockRepository.save.mockRejectedValue(error);

      await expect(service.update(1, mockUpdateReviewDto)).rejects.toThrow(error);
      expect(service.getReview).toHaveBeenCalledWith(1);
    });
  });

  describe('delete', () => {
    it('should delete a review by id', async () => {
      const deleteResult = { message: 'review deleted successfully' };
      jest.spyOn(service, 'getReview').mockResolvedValue(mockReview);
      mockRepository.remove.mockResolvedValue(mockReview);

      const result = await service.delete(1);

      expect(service.getReview).toHaveBeenCalledWith(1);
      expect(mockRepository.remove).toHaveBeenCalledWith(mockReview);
      expect(result).toEqual(deleteResult);
    });

    it('should throw NotFoundException when review not found during delete', async () => {
      const notFoundError = new NotFoundException('Review not found');
      jest.spyOn(service, 'getReview').mockRejectedValue(notFoundError);

      await expect(service.delete(999)).rejects.toThrow(NotFoundException);
      expect(service.getReview).toHaveBeenCalledWith(999);
    });

    it('should handle repository errors during delete', async () => {
      const error = new Error('Database error');
      jest.spyOn(service, 'getReview').mockResolvedValue(mockReview);
      mockRepository.remove.mockRejectedValue(error);

      await expect(service.delete(1)).rejects.toThrow(error);
      expect(service.getReview).toHaveBeenCalledWith(1);
    });
  });
});
