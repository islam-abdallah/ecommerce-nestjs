import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dtos';
import { Product } from './product.entity';

describe('ProductsController', () => {
  let controller: ProductsController;
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

  beforeEach(async () => {
    const mockProductsService = {
      create: jest.fn(),
      getAll: jest.fn(),
      getProduct: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockProduct);

      const result = await controller.createProduct(mockCreateProductDto);

      expect(service.create).toHaveBeenCalledWith(mockCreateProductDto);
      expect(result).toEqual(mockProduct);
    });

    it('should handle service errors during creation', async () => {
      const error = new Error('Database error');
      jest.spyOn(service, 'create').mockRejectedValue(error);

      await expect(controller.createProduct(mockCreateProductDto)).rejects.toThrow(error);
      expect(service.create).toHaveBeenCalledWith(mockCreateProductDto);
    });
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const mockProducts = [mockProduct];
      jest.spyOn(service, 'getAll').mockResolvedValue(mockProducts);

      const result = await controller.getAllProducts();

      expect(service.getAll).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });

    it('should return empty array when no products exist', async () => {
      jest.spyOn(service, 'getAll').mockResolvedValue([]);

      const result = await controller.getAllProducts();

      expect(service.getAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should handle service errors during getAll', async () => {
      const error = new Error('Database error');
      jest.spyOn(service, 'getAll').mockRejectedValue(error);

      await expect(controller.getAllProducts()).rejects.toThrow(error);
      expect(service.getAll).toHaveBeenCalled();
    });
  });

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      jest.spyOn(service, 'getProduct').mockResolvedValue(mockProduct);

      const result = await controller.getProductById(1);

      expect(service.getProduct).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException when product not found', async () => {
      const notFoundError = new NotFoundException('Product not found');
      jest.spyOn(service, 'getProduct').mockRejectedValue(notFoundError);

      await expect(controller.getProductById(999)).rejects.toThrow(NotFoundException);
      expect(service.getProduct).toHaveBeenCalledWith(999);
    });

    it('should handle service errors during getProduct', async () => {
      const error = new Error('Database error');
      jest.spyOn(service, 'getProduct').mockRejectedValue(error);

      await expect(controller.getProductById(1)).rejects.toThrow(error);
      expect(service.getProduct).toHaveBeenCalledWith(1);
    });
  });

  describe('UpdateProductById', () => {
    it('should update a product by id', async () => {
      const updatedProduct = { ...mockProduct, ...mockUpdateProductDto };
      jest.spyOn(service, 'update').mockResolvedValue(updatedProduct);

      const result = await controller.UpdateProductById(mockUpdateProductDto, 1);

      expect(service.update).toHaveBeenCalledWith(1, mockUpdateProductDto);
      expect(result).toEqual(updatedProduct);
    });

    it('should throw NotFoundException when product not found during update', async () => {
      const notFoundError = new NotFoundException('Product not found');
      jest.spyOn(service, 'update').mockRejectedValue(notFoundError);

      await expect(controller.UpdateProductById(mockUpdateProductDto, 999)).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(999, mockUpdateProductDto);
    });

    it('should handle service errors during update', async () => {
      const error = new Error('Database error');
      jest.spyOn(service, 'update').mockRejectedValue(error);

      await expect(controller.UpdateProductById(mockUpdateProductDto, 1)).rejects.toThrow(error);
      expect(service.update).toHaveBeenCalledWith(1, mockUpdateProductDto);
    });
  });

  describe('DeleteProductById', () => {
    it('should delete a product by id', async () => {
      const deleteResult = { message: 'product deleted successfully' };
      jest.spyOn(service, 'delete').mockResolvedValue(deleteResult);

      const result = await controller.DeleteProductById(1);

      expect(service.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(deleteResult);
    });

    it('should throw NotFoundException when product not found during delete', async () => {
      const notFoundError = new NotFoundException('Product not found');
      jest.spyOn(service, 'delete').mockRejectedValue(notFoundError);

      await expect(controller.DeleteProductById(999)).rejects.toThrow(NotFoundException);
      expect(service.delete).toHaveBeenCalledWith(999);
    });

    it('should handle service errors during delete', async () => {
      const error = new Error('Database error');
      jest.spyOn(service, 'delete').mockRejectedValue(error);

      await expect(controller.DeleteProductById(1)).rejects.toThrow(error);
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });
});