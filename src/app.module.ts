import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import {TypeOrmModule} from '@nestjs/typeorm'
import { Product } from './products/product.entity';
@Module({
  imports: [UsersModule, ProductsModule, ReviewsModule,
    TypeOrmModule.forRoot(
    {
      type:'postgres',
      username:'islamabdallah',
      database:'postgres',
      password:'',
      port:5432,
      host:'localhost',
      synchronize:true,
      entities:[Product]
    }
  )
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
