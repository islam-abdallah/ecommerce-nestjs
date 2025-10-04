import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dtos';
import { ProductsService } from './products.service';
@Controller('api/')
export class ProductsController {
    constructor(private readonly service: ProductsService) { }
    @Post("product")
    public createProduct(@Body() body: CreateProductDto) {
        return this.service.create(body)
    }

    @Get("products")
    public getAllProducts() {
        return this.service.getAll()
    }

    @Get("products/:id",)
    public getProductById(@Param("id", ParseIntPipe) id: number) {
        return this.service.getProduct(id)
    }
    @Put("products/:id")
    public UpdateProductById(
        @Body() body: UpdateProductDto,
        @Param("id", ParseIntPipe) id: number) {
        return this.service.update(id, body)
    }
    @Delete("products/:id")
    public DeleteProductById(
        @Param("id", ParseIntPipe) id: number) {
        return this.service.delete(id)
    }


}
