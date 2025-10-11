import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CURRENT_USER_KEY } from 'src/utils/constants';
import { UsersService } from '../services/users/users.service';

// Extend Express Request to include user property
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}



@Injectable()
export class AuthRolesGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly reflector : Reflector,
        private readonly usersService : UsersService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const roles = this.reflector.getAllAndOverride('roles',[context.getHandler(), context.getClass()])
        if(!roles || roles.length === 0 ) return false;

        const request: Request = context.switchToHttp().getRequest();

        // Extract token from Authorization header
        const [type, token] = request.headers.authorization?.split(' ') ?? [];

        // Check if Bearer token exists
        if (!token || type !== 'Bearer') {
            throw new UnauthorizedException(
                'Invalid or missing authentication token',
            );
        }

        try {
            // Verify JWT token
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });
            const user = await this.usersService.getCurrentUser(payload.id)
            if(!user) return false;
            if(roles.includes(user.userType)){
                // Attach user payload to request object
                request[CURRENT_USER_KEY] = payload;
                return true
            }
            return false;
        } catch {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
