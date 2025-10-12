import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';
import { UploadsModule } from './uploads/uploads.module';
@Module({
  imports: [
    UsersModule,
    ProductsModule,
    ReviewsModule,
    
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local'
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   username: 'islamabdallah',
    //   database: 'postgres',
    //   password: '',
    //   port: 5432,
    //   host: 'localhost',
    //   synchronize: true,
    //   entities: [Product],
    // }),
    UploadsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
        type: 'postgres',
        host: config.get<string>('DB_HOST') ?? '127.0.0.1',
        port: Number(config.get<string>('DB_PORT') ?? '5432'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD') || undefined, // allow empty
        database: config.get<string>('DB_DATABASE'),
        synchronize: true,                    // dev only!
        autoLoadEntities: true,               // no need to list entities manually
        // entities: [Product],               // remove if using autoLoadEntities
        }
      }

    }

    ),
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide:APP_INTERCEPTOR,
      useClass:ClassSerializerInterceptor
    },
  ],
})
export class AppModule {}
