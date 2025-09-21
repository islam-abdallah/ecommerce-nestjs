import { Controller, Get } from '@nestjs/common';

@Controller('api/users')
export class UsersController {
    @Get("")
    public getAllUsers() {
        return [
            {
                id: 1,
                name: 'Islam Abdallah',
                email: 'islam@example.com',
            },
            {
                id: 2,
                name: 'Sara Ali',
                email: 'sara@example.com',
            },
            {
                id: 3,
                name: 'Omar Khaled',
                email: 'omar@example.com',
            },
            {
                id: 4,
                name: 'Mona Hassan',
                email: 'mona@example.com',
            },
            {
                id: 5,
                name: 'Ahmed Mostafa',
                email: 'ahmed@example.com',
            },
        ];
    }
}
