import { validate } from 'class-validator';
import { CreateProductDto } from './index';

describe('CreateProductDto', () => {
  let dto: CreateProductDto;

  beforeEach(() => {
    dto = new CreateProductDto();
  });

  describe('title', () => {
    it('should pass validation with valid title', async () => {
      dto.title = 'Valid Product Title';
      dto.description = 'Valid description';
      dto.price = 99.99;

      const errors = await validate(dto);
      const titleErrors = errors.filter(error => error.property === 'title');
      
      expect(titleErrors).toHaveLength(0);
    });

    it('should fail validation when title is empty', async () => {
      dto.title = '';
      dto.description = 'Valid description';
      dto.price = 99.99;

      const errors = await validate(dto);
      const titleErrors = errors.filter(error => error.property === 'title');
      
      expect(titleErrors).toHaveLength(1);
      expect(titleErrors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation when title is too short', async () => {
      dto.title = 'A';
      dto.description = 'Valid description';
      dto.price = 99.99;

      const errors = await validate(dto);
      const titleErrors = errors.filter(error => error.property === 'title');
      
      expect(titleErrors).toHaveLength(1);
      expect(titleErrors[0].constraints).toHaveProperty('isLength');
    });

    it('should fail validation when title is too long', async () => {
      dto.title = 'A'.repeat(151);
      dto.description = 'Valid description';
      dto.price = 99.99;

      const errors = await validate(dto);
      const titleErrors = errors.filter(error => error.property === 'title');
      
      expect(titleErrors).toHaveLength(1);
      expect(titleErrors[0].constraints).toHaveProperty('isLength');
    });

    it('should fail validation when title is not a string', async () => {
      dto.title = 123 as any;
      dto.description = 'Valid description';
      dto.price = 99.99;

      const errors = await validate(dto);
      const titleErrors = errors.filter(error => error.property === 'title');
      
      expect(titleErrors).toHaveLength(1);
      expect(titleErrors[0].constraints).toHaveProperty('isString');
    });
  });

  describe('description', () => {
    it('should pass validation with valid description', async () => {
      dto.title = 'Valid Product Title';
      dto.description = 'Valid description';
      dto.price = 99.99;

      const errors = await validate(dto);
      const descriptionErrors = errors.filter(error => error.property === 'description');
      
      expect(descriptionErrors).toHaveLength(0);
    });

    it('should fail validation when description is empty', async () => {
      dto.title = 'Valid Product Title';
      dto.description = '';
      dto.price = 99.99;

      const errors = await validate(dto);
      const descriptionErrors = errors.filter(error => error.property === 'description');
      
      expect(descriptionErrors).toHaveLength(1);
      expect(descriptionErrors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation when description is too short', async () => {
      dto.title = 'Valid Product Title';
      dto.description = 'A';
      dto.price = 99.99;

      const errors = await validate(dto);
      const descriptionErrors = errors.filter(error => error.property === 'description');
      
      expect(descriptionErrors).toHaveLength(1);
      expect(descriptionErrors[0].constraints).toHaveProperty('isLength');
    });

    it('should fail validation when description is too long', async () => {
      dto.title = 'Valid Product Title';
      dto.description = 'A'.repeat(251);
      dto.price = 99.99;

      const errors = await validate(dto);
      const descriptionErrors = errors.filter(error => error.property === 'description');
      
      expect(descriptionErrors).toHaveLength(1);
      expect(descriptionErrors[0].constraints).toHaveProperty('isLength');
    });

    it('should fail validation when description is not a string', async () => {
      dto.title = 'Valid Product Title';
      dto.description = 123 as any;
      dto.price = 99.99;

      const errors = await validate(dto);
      const descriptionErrors = errors.filter(error => error.property === 'description');
      
      expect(descriptionErrors).toHaveLength(1);
      expect(descriptionErrors[0].constraints).toHaveProperty('isString');
    });
  });

  describe('price', () => {
    it('should pass validation with valid price', async () => {
      dto.title = 'Valid Product Title';
      dto.description = 'Valid description';
      dto.price = 99.99;

      const errors = await validate(dto);
      const priceErrors = errors.filter(error => error.property === 'price');
      
      expect(priceErrors).toHaveLength(0);
    });

    it('should fail validation when price is negative', async () => {
      dto.title = 'Valid Product Title';
      dto.description = 'Valid description';
      dto.price = -10;

      const errors = await validate(dto);
      const priceErrors = errors.filter(error => error.property === 'price');
      
      expect(priceErrors).toHaveLength(1);
      expect(priceErrors[0].constraints).toHaveProperty('min');
    });

    it('should pass validation when price is zero', async () => {
      dto.title = 'Valid Product Title';
      dto.description = 'Valid description';
      dto.price = 0;

      const errors = await validate(dto);
      const priceErrors = errors.filter(error => error.property === 'price');
      
      expect(priceErrors).toHaveLength(0);
    });

    it('should fail validation when price is not a number', async () => {
      dto.title = 'Valid Product Title';
      dto.description = 'Valid description';
      dto.price = 'invalid' as any;

      const errors = await validate(dto);
      const priceErrors = errors.filter(error => error.property === 'price');
      
      expect(priceErrors).toHaveLength(1);
      expect(priceErrors[0].constraints).toHaveProperty('isNumber');
    });

    it('should fail validation when price is empty', async () => {
      dto.title = 'Valid Product Title';
      dto.description = 'Valid description';
      dto.price = undefined as any;

      const errors = await validate(dto);
      const priceErrors = errors.filter(error => error.property === 'price');
      
      expect(priceErrors).toHaveLength(1);
      expect(priceErrors[0].constraints).toHaveProperty('isNotEmpty');
    });
  });

  describe('complete validation', () => {
    it('should pass validation with all valid fields', async () => {
      dto.title = 'Valid Product Title';
      dto.description = 'Valid description';
      dto.price = 99.99;

      const errors = await validate(dto);
      
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with all invalid fields', async () => {
      dto.title = '';
      dto.description = '';
      dto.price = -10;

      const errors = await validate(dto);
      
      expect(errors).toHaveLength(3);
      expect(errors.some(error => error.property === 'title')).toBe(true);
      expect(errors.some(error => error.property === 'description')).toBe(true);
      expect(errors.some(error => error.property === 'price')).toBe(true);
    });
  });
});
