import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
type ProductType = { id: number, name: string, price: number }
@Controller('api/')
export class ProductsController {
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
    @Post("product")
    public createProduct(@Body() body: CreateProductDto) {
        const newItem = {
            id: this.products.length + 1,
            name: body.name,
            price: body.price
        }
        this.products.push(newItem)
        return newItem
    }

    @Get("products")
    public getAllProducts() {
        return this.products
    }

    @Get("products/:id")
    public getProductById(@Param("id") id: string){
        return this.getProductObjectById(id)
    }
    @Put("products/:id")
    public UpdateProductById(@Param("id") id: string){
        let selectProduct = this.getProductObjectById(id);
        return {message:'product updated successfully with id: '+id}
    }
    @Delete("products/:id")
    public DeleteProductById(@Param("id") id: string){
        this.getProductObjectById(id);
        return {message:'product is Delete successfully with id: '+id}
    }

    getProductObjectById(id:string):ProductType{
        let product = this.products.find(product => product.id == parseInt(id));
        if(!product) throw new NotFoundException("Product not found");
        return product
    }
}
