import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Headers, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, LoginDto, RegisterDto, UpdateUserDto } from './dtos';
import { AuthGuard } from './Guard/auth.guard';

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

    @Post('users/auth/register')
    public registerUser(@Body() body: RegisterDto) {
        return this.service.register(body);
    }

    @Post('users/auth/login')
    @HttpCode(HttpStatus.OK)
    public login(@Body()body :LoginDto){
        return this.service.login(body)
    }

    @Get('current-user')
    @UseGuards(AuthGuard)
    public getCurrentUser(@Headers() headers:any){
        return this.service.getCurrentUser(headers.authorization)
    }
}
