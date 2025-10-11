import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './dtos';
import { Product } from './product.entity';
import { UsersService } from 'src/users/services';
type ProductType = { id: number, title: string, price: number, description: string }

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>,
        private readonly usersService: UsersService
    ) {

    }
    /**
     * 
     * Create New Product 
     *  
     */
    public async create(dto: CreateProductDto, userId) {
        const user = await this.usersService.getCurrentUser(userId)
        const newItem = this.productsRepository.create({
            ...dto,
            title:dto.title.toLowerCase(),
            user:user
        });
        return this.productsRepository.save(newItem)
    }
public getAll(params?: object) {
    if (!params || Object.keys(params).length === 0) {
        return this.productsRepository.find(); // Return all if params is empty
    }

    // Prepare the 'where' clause dynamically
    const where: FindOptionsWhere<Product> = {};
    for (const key in params) {
        // Ensure the key belongs to the object
        if (Object.prototype.hasOwnProperty.call(params, key)) {
            const value = params[key];

            if (typeof value === 'string') {
                // If the value is a string, use the LIKE operator
                where[key] = Like(`%${value}%`);
            } else {
                // Otherwise, use an exact match
                where[key] = value;
            }
        }
    }

    return this.productsRepository.find({ where });
}

    public async getProduct(id: number) {
        const product =  await this.productsRepository.findOne({ where: { id } })
        if (!product)  throw new NotFoundException("Product not found");
        return product
    }

    public async update(id: number, dto: UpdateProductDto) {
        const product = await this.getProduct(id);
        if (product) {
            product.title = dto.title ?? product.title;
            product.description = dto?.description ?? product.description;
            product.price = dto.price ?? product.price;
            return this.productsRepository.save(product);
        }
    }

    public async delete(id: number) {
        const product = await this.getProduct(id);
        if (product) {
            await this.productsRepository.remove(product);
            return { message: 'product deleted successfully' }
        }
    }


}
