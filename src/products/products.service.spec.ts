import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './dtos';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  };

  const mockCreateProductDto: CreateProductDto = {
    title: 'Test Product',
    description: 'Test Description',
    price: 99.99,
  };

  const mockUpdateProductDto: UpdateProductDto = {
    title: 'Updated Product',
    description: 'Updated Description',
    price: 149.99,
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
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      mockRepository.create.mockReturnValue(mockProduct);
      mockRepository.save.mockResolvedValue(mockProduct);

      const result = await service.create(mockCreateProductDto);

      expect(mockRepository.create).toHaveBeenCalledWith(mockCreateProductDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockProduct);
      expect(result).toEqual(mockProduct);
    });

    it('should handle repository errors during creation', async () => {
      const error = new Error('Database error');
      mockRepository.create.mockReturnValue(mockProduct);
      mockRepository.save.mockRejectedValue(error);

      await expect(service.create(mockCreateProductDto)).rejects.toThrow(error);
      expect(mockRepository.create).toHaveBeenCalledWith(mockCreateProductDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockProduct);
    });
  });

  describe('getAll', () => {
    it('should return all products', async () => {
      const mockProducts = [mockProduct];
      mockRepository.find.mockResolvedValue(mockProducts);

      const result = await service.getAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });

    it('should return empty array when no products exist', async () => {
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

  describe('getProduct', () => {
    it('should return a product by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockProduct);

      const result = await service.getProduct(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException when product not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getProduct(999)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });

    it('should handle repository errors during getProduct', async () => {
      const error = new Error('Database error');
      mockRepository.findOne.mockRejectedValue(error);

      await expect(service.getProduct(1)).rejects.toThrow(error);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('update', () => {
    it('should update a product with all fields', async () => {
      const updatedProduct = { ...mockProduct, ...mockUpdateProductDto };
      jest.spyOn(service, 'getProduct').mockResolvedValue(mockProduct);
      mockRepository.save.mockResolvedValue(updatedProduct);

      const result = await service.update(1, mockUpdateProductDto);

      expect(service.getProduct).toHaveBeenCalledWith(1);
      expect(mockRepository.save).toHaveBeenCalledWith(updatedProduct);
      expect(result).toEqual(updatedProduct);
    });

    it('should update a product with partial fields', async () => {
      const partialUpdateDto = { title: 'Updated Title' };
      const updatedProduct = { ...mockProduct, title: 'Updated Title' };
      jest.spyOn(service, 'getProduct').mockResolvedValue(mockProduct);
      mockRepository.save.mockResolvedValue(updatedProduct);

      const result = await service.update(1, partialUpdateDto);

      expect(service.getProduct).toHaveBeenCalledWith(1);
      expect(mockRepository.save).toHaveBeenCalledWith(updatedProduct);
      expect(result).toEqual(updatedProduct);
    });

    it('should preserve existing values when optional fields are not provided', async () => {
      const partialUpdateDto = { title: 'Updated Title' };
      const updatedProduct = { 
        ...mockProduct, 
        title: 'Updated Title',
        description: mockProduct.description, // Should remain unchanged
        price: mockProduct.price // Should remain unchanged
      };
      jest.spyOn(service, 'getProduct').mockResolvedValue(mockProduct);
      mockRepository.save.mockResolvedValue(updatedProduct);

      const result = await service.update(1, partialUpdateDto);

      expect(service.getProduct).toHaveBeenCalledWith(1);
      expect(mockRepository.save).toHaveBeenCalledWith(updatedProduct);
      expect(result).toEqual(updatedProduct);
    });

    it('should throw NotFoundException when product not found during update', async () => {
      const notFoundError = new NotFoundException('Product not found');
      jest.spyOn(service, 'getProduct').mockRejectedValue(notFoundError);

      await expect(service.update(999, mockUpdateProductDto)).rejects.toThrow(NotFoundException);
      expect(service.getProduct).toHaveBeenCalledWith(999);
    });

    it('should handle repository errors during update', async () => {
      const error = new Error('Database error');
      jest.spyOn(service, 'getProduct').mockResolvedValue(mockProduct);
      mockRepository.save.mockRejectedValue(error);

      await expect(service.update(1, mockUpdateProductDto)).rejects.toThrow(error);
      expect(service.getProduct).toHaveBeenCalledWith(1);
    });
  });

  describe('delete', () => {
    it('should delete a product by id', async () => {
      const deleteResult = { message: 'product deleted successfully' };
      jest.spyOn(service, 'getProduct').mockResolvedValue(mockProduct);
      mockRepository.remove.mockResolvedValue(mockProduct);

      const result = await service.delete(1);

      expect(service.getProduct).toHaveBeenCalledWith(1);
      expect(mockRepository.remove).toHaveBeenCalledWith(mockProduct);
      expect(result).toEqual(deleteResult);
    });

    it('should throw NotFoundException when product not found during delete', async () => {
      const notFoundError = new NotFoundException('Product not found');
      jest.spyOn(service, 'getProduct').mockRejectedValue(notFoundError);

      await expect(service.delete(999)).rejects.toThrow(NotFoundException);
      expect(service.getProduct).toHaveBeenCalledWith(999);
    });

    it('should handle repository errors during delete', async () => {
      const error = new Error('Database error');
      jest.spyOn(service, 'getProduct').mockResolvedValue(mockProduct);
      mockRepository.remove.mockRejectedValue(error);

      await expect(service.delete(1)).rejects.toThrow(error);
      expect(service.getProduct).toHaveBeenCalledWith(1);
    });
  });
});
