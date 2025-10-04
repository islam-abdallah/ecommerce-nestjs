import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { CreateReviewDto, UpdateReviewDto } from './dtos';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewsRepository: Repository<Review>,
    ) {}

    public create(dto: CreateReviewDto) {
        const newItem = this.reviewsRepository.create(dto);
        return this.reviewsRepository.save(newItem);
    }

    public getAll() {
        return this.reviewsRepository.find();
    }

    public async getReview(id: number) {
        const review = await this.reviewsRepository.findOne({ where: { id } });
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
