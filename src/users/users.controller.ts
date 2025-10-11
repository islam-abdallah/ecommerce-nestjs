import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { UserType } from 'src/utils/enums';
import type { JWTPayloadType } from 'src/utils/typesPayload';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/roles-user.decorator';
import { LoginDto, RegisterDto, UpdateUserDto } from './dtos';
import { AuthRolesGuard } from './Guard/auth-roles.guard';
import { AuthGuard } from './Guard/auth.guard';
import { AuthService,UsersService } from './services';

@Controller('api/users/')
export class UsersController {
    constructor(private readonly service: UsersService, private readonly authService: AuthService) {}

    // @Post('user')
    // public createUser(@Body() body: CreateUserDto) {
    //     return this.service.create(body);
    // }

    @Get('')
    @Roles(UserType.ADMIN)
    @UseGuards(AuthRolesGuard)
    public getAllUsers() {
        return this.service.getAll();
    }

    @Get('current-user')
    @UseGuards(AuthGuard)
    public getCurrentUser(@CurrentUser() payload:JWTPayloadType){
        console.log('Test LoggerInterceptor')
        return this.service.getCurrentUser(payload.id)
    }
    
    @Get(':id')
    public getUserById(@Param('id', ParseIntPipe) id: number) {
        return this.service.getUser(id);
    }

    @Put(':id')
    public updateUserById(
        @Body() body: UpdateUserDto,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.service.update(id, body);
    }

    @Delete(':id')
    public deleteUserById(@Param('id', ParseIntPipe) id: number) {
        return this.service.delete(id);
    }

    @Post('auth/register')
    public registerUser(@Body() body: RegisterDto) {
        return this.authService.register(body);
    }

    @Post('auth/login')
    @HttpCode(HttpStatus.OK)
    public login(@Body()body :LoginDto){
        return this.authService.login(body)
    }

}
