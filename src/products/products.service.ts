import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Product } from './product.entity';
type ProductType = { id: number, title: string, price: number, description: string }

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>) {

    }
    /**
     * 
     * Create New Product 
     *  
     */
    public create(dto: CreateProductDto) {
        const newItem = this.productsRepository.create(dto);
        return this.productsRepository.save(newItem)
    }
    public getAll() {
        return this.productsRepository.find();
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
