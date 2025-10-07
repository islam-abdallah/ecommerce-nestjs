import { validate } from 'class-validator';
import { UpdateProductDto } from './index';

describe('UpdateProductDto', () => {
  let dto: UpdateProductDto;

  beforeEach(() => {
    dto = new UpdateProductDto();
  });

  describe('title', () => {
    it('should pass validation with valid title', async () => {
      dto.title = 'Valid Product Title';

      const errors = await validate(dto);
      const titleErrors = errors.filter(error => error.property === 'title');
      
      expect(titleErrors).toHaveLength(0);
    });

    it('should pass validation when title is undefined (optional field)', async () => {
      dto.title = undefined;

      const errors = await validate(dto);
      const titleErrors = errors.filter(error => error.property === 'title');
      
      expect(titleErrors).toHaveLength(0);
    });

    it('should fail validation when title is empty string', async () => {
      dto.title = '';

      const errors = await validate(dto);
      const titleErrors = errors.filter(error => error.property === 'title');
      
      expect(titleErrors).toHaveLength(1);
      expect(titleErrors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation when title is too short', async () => {
      dto.title = 'A';

      const errors = await validate(dto);
      const titleErrors = errors.filter(error => error.property === 'title');
      
      expect(titleErrors).toHaveLength(1);
      expect(titleErrors[0].constraints).toHaveProperty('isLength');
    });

    it('should fail validation when title is too long', async () => {
      dto.title = 'A'.repeat(151);

      const errors = await validate(dto);
      const titleErrors = errors.filter(error => error.property === 'title');
      
      expect(titleErrors).toHaveLength(1);
      expect(titleErrors[0].constraints).toHaveProperty('isLength');
    });

    it('should fail validation when title is not a string', async () => {
      dto.title = 123 as any;

      const errors = await validate(dto);
      const titleErrors = errors.filter(error => error.property === 'title');
      
      expect(titleErrors).toHaveLength(1);
      expect(titleErrors[0].constraints).toHaveProperty('isString');
    });
  });

  describe('description', () => {
    it('should pass validation with valid description', async () => {
      dto.description = 'Valid description';

      const errors = await validate(dto);
      const descriptionErrors = errors.filter(error => error.property === 'description');
      
      expect(descriptionErrors).toHaveLength(0);
    });

    it('should pass validation when description is undefined (optional field)', async () => {
      dto.description = undefined;

      const errors = await validate(dto);
      const descriptionErrors = errors.filter(error => error.property === 'description');
      
      expect(descriptionErrors).toHaveLength(0);
    });

    it('should fail validation when description is empty string', async () => {
      dto.description = '';

      const errors = await validate(dto);
      const descriptionErrors = errors.filter(error => error.property === 'description');
      
      expect(descriptionErrors).toHaveLength(1);
      expect(descriptionErrors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation when description is too short', async () => {
      dto.description = 'A';

      const errors = await validate(dto);
      const descriptionErrors = errors.filter(error => error.property === 'description');
      
      expect(descriptionErrors).toHaveLength(1);
      expect(descriptionErrors[0].constraints).toHaveProperty('isLength');
    });

    it('should fail validation when description is too long', async () => {
      dto.description = 'A'.repeat(251);

      const errors = await validate(dto);
      const descriptionErrors = errors.filter(error => error.property === 'description');
      
      expect(descriptionErrors).toHaveLength(1);
      expect(descriptionErrors[0].constraints).toHaveProperty('isLength');
    });

    it('should fail validation when description is not a string', async () => {
      dto.description = 123 as any;

      const errors = await validate(dto);
      const descriptionErrors = errors.filter(error => error.property === 'description');
      
      expect(descriptionErrors).toHaveLength(1);
      expect(descriptionErrors[0].constraints).toHaveProperty('isString');
    });
  });

  describe('price', () => {
    it('should pass validation with valid price', async () => {
      dto.price = 99.99;

      const errors = await validate(dto);
      const priceErrors = errors.filter(error => error.property === 'price');
      
      expect(priceErrors).toHaveLength(0);
    });

    it('should pass validation when price is undefined (optional field)', async () => {
      dto.price = undefined;

      const errors = await validate(dto);
      const priceErrors = errors.filter(error => error.property === 'price');
      
      expect(priceErrors).toHaveLength(0);
    });

    it('should fail validation when price is negative', async () => {
      dto.price = -10;

      const errors = await validate(dto);
      const priceErrors = errors.filter(error => error.property === 'price');
      
      expect(priceErrors).toHaveLength(1);
      expect(priceErrors[0].constraints).toHaveProperty('min');
    });

    it('should pass validation when price is zero', async () => {
      dto.price = 0;

      const errors = await validate(dto);
      const priceErrors = errors.filter(error => error.property === 'price');
      
      expect(priceErrors).toHaveLength(0);
    });

    it('should fail validation when price is not a number', async () => {
      dto.price = 'invalid' as any;

      const errors = await validate(dto);
      const priceErrors = errors.filter(error => error.property === 'price');
      
      expect(priceErrors).toHaveLength(1);
      expect(priceErrors[0].constraints).toHaveProperty('isNumber');
    });

    it('should fail validation when price is empty string', async () => {
      dto.price = '' as any;

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

    it('should pass validation with no fields (all optional)', async () => {
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with partial fields', async () => {
      dto.title = 'Valid Product Title';

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

    it('should fail validation with mixed valid and invalid fields', async () => {
      dto.title = 'Valid Product Title';
      dto.description = '';
      dto.price = -10;

      const errors = await validate(dto);
      
      expect(errors).toHaveLength(2);
      expect(errors.some(error => error.property === 'title')).toBe(false);
      expect(errors.some(error => error.property === 'description')).toBe(true);
      expect(errors.some(error => error.property === 'price')).toBe(true);
    });
  });
});
