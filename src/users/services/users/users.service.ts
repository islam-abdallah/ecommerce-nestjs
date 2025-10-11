import {  Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user.entity';
import { CreateUserDto, UpdateUserDto} from '../../dtos';
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
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

    public async getCurrentUser(id:number) {
        const user = await this.usersRepository.findOne({where:{id}});
        if(!user) throw new NotFoundException("User Not Found");
         // Remove password before returning
        return user;
    }
}


