import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { CreateReviewDto, UpdateReviewDto } from './dtos';
import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewsRepository: Repository<Review>,
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    public async create(productId:any, userId:any, dto: CreateReviewDto) {
        // Find the product and user by their IDs
        const product = await this.productsRepository.findOne({ where: { id: productId } });
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Create the review with relationships
        const newReview = this.reviewsRepository.create({
            ...dto,
            user,
            product,
        });
        const result = await this.reviewsRepository.save(newReview);
        return {
            id:result.id,
            comment:result.comment,
            rate:result.rate,
            createdAt:result.createdAt,
            productId:product.id,
            userId:user.id,
        }
    }

    public getAll(
        pageNumber:number = 0,perPage:number = 3
    ) {
        console.log('getAll -- pageNumber', pageNumber)
        console.log('getAll -- perPage', perPage)
        return this.reviewsRepository.find({
            relations: ['product', 'user'],
            order:{createdAt:"DESC"},
            skip:perPage * (pageNumber - 1),
            take:perPage,
        });
    }

    public async getReview(id: number) {
        const review = await this.reviewsRepository.findOne({ 
            where: { id },
            relations: ['product', 'user']
        });
        if (!review) throw new NotFoundException('Review not found');
        return review;
    }

    public async update(id: number, dto: UpdateReviewDto) {
        const review = await this.getReview(id);
        if (review) {
            review.comment = dto.comment ?? review.comment;
            review.rate = dto.rate ?? review.rate;
            return this.reviewsRepository.save(review);
        }
        throw new NotFoundException('review not found') 
    }

    public async delete(id: number) {
        const review = await this.getReview(id);
        if (review) {
            await this.reviewsRepository.remove(review);
            return { message: 'review deleted successfully' };
        }
    }
}
