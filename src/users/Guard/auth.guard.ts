import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

// Extend Express Request to include user property
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

// Key to store current user in request object
export const CURRENT_USER_KEY = 'user';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
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

            // Attach user payload to request object
            request[CURRENT_USER_KEY] = payload;

            return true;
        } catch {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
