import { Controller, Get } from '@nestjs/common';

@Controller('api/products')
export class ProductsController {

    @Get("")
    public getAllProducts() {
        return [
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
    }
}
