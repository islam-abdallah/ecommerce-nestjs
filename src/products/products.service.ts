import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
type ProductType = { id: number, name: string, price: number }

@Injectable()
export class ProductsService {
    private products: ProductType[] = [
        {
            id: 1,
            name: 'Laptop',
            price: 1200.5,
        },
        {
            id: 2,
            name: 'Smartphone',
            price: 750.0,
        },
        {
            id: 3,
            name: 'Headphones',
            price: 99.99,
        },
        {
            id: 4,
            name: 'Smartwatch',
            price: 199.99,
        },
        {
            id: 5,
            name: 'Tablet',
            price: 450.0,
        },
    ];

    /**
     * 
     * Create New Product 
     *  
     */
    public create({ name, price }: CreateProductDto) {
        const newItem = {
            id: this.products.length + 1,
            name,
            price
        }
        this.products.push(newItem)
        return newItem
    }
    public getAll() {
        return this.products
    }


    public getProduct(id: number) {
        return this.getProductObjectById(id)
    }

    public update(id: number, body : UpdateProductDto) {
        let selectProduct = this.getProductObjectById(id,body );
        return { message: 'product updated successfully with id: ' + id }
    }

    public delete(id: number) {
        this.getProductObjectById(id);
        return { message: 'product is Delete successfully with id: ' + id }
    }

    getProductObjectById(id: number, body?: any): ProductType {
        let product = this.products.find(product => product.id == id);
        if (!product) throw new NotFoundException("Product not found");
        if (body) {
            product.name = body.name;
            product.price = body.price;
        };
        return product
    }
}
