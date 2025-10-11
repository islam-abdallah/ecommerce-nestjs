import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dtos';
import { ProductsService } from './products.service';
import { AuthRolesGuard } from 'src/users/Guard/auth-roles.guard';
import { Roles } from 'src/users/decorators/roles-user.decorator';
import { UserType } from 'src/utils/enums';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import type { JWTPayloadType } from 'src/utils/typesPayload';
@Controller('api/')
export class ProductsController {
    constructor(private readonly service: ProductsService) { }
    @Post("product")
    @Roles(UserType.ADMIN)
    @UseGuards(AuthRolesGuard)

    public createProduct(@Body() body: CreateProductDto,@CurrentUser() payload: JWTPayloadType) {
        return this.service.create(body, payload.id)
    }

    @Get("products")
    public getAllProducts(@Query() params:any) {
        return this.service.getAll(params)
    }

    @Get("products/:id",)
    public getProductById(@Param("id", ParseIntPipe) id: number) {
        return this.service.getProduct(id)
    }
    @Put("products/:id")
    @Roles(UserType.ADMIN)
    @UseGuards(AuthRolesGuard)
    public UpdateProductById(
        @Body() body: UpdateProductDto,
        @Param("id", ParseIntPipe) id: number) {
        return this.service.update(id, body)
    }
    @Delete("products/:id")
    @Roles(UserType.ADMIN)
    @UseGuards(AuthRolesGuard)
    public DeleteProductById(
        @Param("id", ParseIntPipe) id: number) {
        return this.service.delete(id)
    }


}
