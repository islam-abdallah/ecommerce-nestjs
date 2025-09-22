import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put ,Req, Res} from '@nestjs/common';
import express from 'express';
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
    @Post("product-with-express")
    public createProductWithExpress(@Req() req: express.Request, @Res() res:express.Response) {
        const newItem = {
            id: this.products.length + 1,
            name: req.body.name,
            price: req.body.price
        }
        this.products.push(newItem);
        res.status(201).json(newItem);
    }
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

    @Get("products/:id", )
    public getProductById(@Param("id",ParseIntPipe) id: number){
        return this.getProductObjectById(id)
    }
    @Put("products/:id")
    public UpdateProductById(@Param("id",ParseIntPipe) id: number){
        let selectProduct = this.getProductObjectById(id);
        return {message:'product updated successfully with id: '+id}
    }
    @Delete("products/:id")
    public DeleteProductById(@Param("id",ParseIntPipe) id: number){
        this.getProductObjectById(id);
        return {message:'product is Delete successfully with id: '+id}
    }

    getProductObjectById(id:number):ProductType{
        let product = this.products.find(product => product.id == id);
        if(!product) throw new NotFoundException("Product not found");
        return product
    }
}
