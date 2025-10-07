import { AccessTokenType, JWTPayloadType } from './../utils/typesPayload';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto ,RegisterDto, LoginDto} from './dtos';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly config: ConfigService
    ) {}

    public create(dto: CreateUserDto) {
        const newItem = this.usersRepository.create(dto);
        return this.usersRepository.save(newItem);
    }

    public getAll() {
        return this.usersRepository.find();
    }

    public async getUser(id: number) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    public async update(id: number, dto: UpdateUserDto) {
        const user = await this.getUser(id);
        if (user) {
            user.username = dto.username ?? user.username;
            user.email = dto.email ?? user.email;
            return this.usersRepository.save(user);
        }
    }

    public async delete(id: number) {
        const user = await this.getUser(id);
        if (user) {
            await this.usersRepository.remove(user);
            return { message: 'user deleted successfully' };
        }
    }

    public async register(dto: RegisterDto) {
        const {email, password, username} = dto;
        const findEmailDb = await this.usersRepository.findOne({where: {email}})
        if (findEmailDb)   throw new BadRequestException('Email already exists');

        // hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        dto.password = hashedPassword;
        let user =  this.usersRepository.create({
            email,
            username,
            password: hashedPassword,

        });
        user = await this.usersRepository.save(user);
        return this.generateToken(user);
    } 

    public async login(loginDto: LoginDto) {
        const {email, password} = loginDto;
        const user = await this.usersRepository.findOne({where: {email}})
        if (!user) throw new BadRequestException('invalid email or password');
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) throw new BadRequestException('invalid email or password');
        return this.generateToken(user)
    }

    private async generateToken(user):Promise<AccessTokenType>{
        const {id, userType} = user
        let payload : JWTPayloadType =   {id, userType};
        const accessToken = await this.jwtService.signAsync(payload);
        return {accessToken}
    }

    public async getCurrentUser(bearsToken:string) {
        const [, token] = bearsToken.split(' ');
        const payload = await this.jwtService.verifyAsync(token, {
            secret:this.config.get<string>('JWT_SECRET')
        })
        console.log('user payload',payload)
        const user = await this.usersRepository.findOne({where:{id: payload.id}});
        console.log('re user', user)
        if(!user) throw new NotFoundException("User Not Found");
         // Remove password before returning
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    // public async changePassword(id: number, dto: ChangePasswordDto) {
    //     const user = await this.getUser(id);
    //     if (user) {
    //         user.password = dto.password;
    //         return this.usersRepository.save(user);
    //     }
    // }
}


