import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductsService } from './products.service';
@Controller('api/')
export class ProductsController {
    constructor(private service: ProductsService) {}
    @Post("product")
    public createProduct(@Body() body: CreateProductDto) {
        this.service.create(body)
    }

    @Get("products")
    public getAllProducts() {
        this.service.getAll()
    }

    @Get("products/:id",)
    public getProductById(@Param("id", ParseIntPipe) id: number) {
        this.service.getProduct(id)
    }
    @Put("products/:id")
    public UpdateProductById(
        @Body() body: UpdateProductDto,
        @Param("id", ParseIntPipe) id: number) {
        this.service.update(id,body)
    }
    @Delete("products/:id")
    public DeleteProductById(
        @Param("id", ParseIntPipe) id: number) {
        this.service.delete(id)
    }


}
