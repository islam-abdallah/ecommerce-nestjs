import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto} from '../../dtos';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AccessTokenType, JWTPayloadType } from '../../../utils/typesPayload';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

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
}
