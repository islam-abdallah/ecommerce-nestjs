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

    public async create(dto: CreateReviewDto) {
        // Find the product and user by their IDs
        const product = await this.productsRepository.findOne({ where: { id: dto.productId } });
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const user = await this.usersRepository.findOne({ where: { id: dto.userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Create the review with relationships
        const newReview = this.reviewsRepository.create({
            name: dto.name,
            comment: dto.comment,
            rate: dto.rate,
            product: product,
            user: user,
        });

        return this.reviewsRepository.save(newReview);
    }

    public getAll() {
        return this.reviewsRepository.find({
            relations: ['product', 'user']
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
            review.name = dto.name ?? review.name;
            review.comment = dto.comment ?? review.comment;
            review.rate = dto.rate ?? review.rate;
            return this.reviewsRepository.save(review);
        }
    }

    public async delete(id: number) {
        const review = await this.getReview(id);
        if (review) {
            await this.reviewsRepository.remove(review);
            return { message: 'review deleted successfully' };
        }
    }
}
