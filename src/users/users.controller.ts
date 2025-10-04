import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dtos';

@Controller('api/')
export class UsersController {
    constructor(private readonly service: UsersService) {}

    @Post('user')
    public createUser(@Body() body: CreateUserDto) {
        return this.service.create(body);
    }

    @Get('users')
    public getAllUsers() {
        return this.service.getAll();
    }

    @Get('users/:id')
    public getUserById(@Param('id', ParseIntPipe) id: number) {
        return this.service.getUser(id);
    }

    @Put('users/:id')
    public updateUserById(
        @Body() body: UpdateUserDto,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.service.update(id, body);
    }

    @Delete('users/:id')
    public deleteUserById(@Param('id', ParseIntPipe) id: number) {
        return this.service.delete(id);
    }
}
