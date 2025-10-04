import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  imports: [TypeOrmModule.forFeature([Review, Product, User])]
})
export class ReviewsModule {}
