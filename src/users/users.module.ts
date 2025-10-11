import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService ,UsersService} from './services';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthService],
  imports: [TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      inject:[ConfigService],
      useFactory:(config:ConfigService)=>{
        return {
          global:true,
          secret:config.get<string>('JWT_SECRET'),
          signOptions:{
            expiresIn: config.get<string>('JWT_EXPIRES_IN')
          }
        }
      }
    })
  ],
  exports:[UsersService, AuthService, JwtModule],
})
export class UsersModule {}
