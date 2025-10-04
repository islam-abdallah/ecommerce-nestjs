import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto } from './dtos';

@Controller('api/')
export class ReviewsController {
    constructor(private readonly service: ReviewsService) { }

    @Post('review')
    public createReview(@Body() body: CreateReviewDto) {
        return this.service.create(body);
    }

    @Get('reviews')
    public getAllReviews() {
        return this.service.getAll();
    }

    @Get('reviews/:id')
    public getReviewById(@Param('id', ParseIntPipe) id: number) {
        return this.service.getReview(id);
    }

    @Put('reviews/:id')
    public updateReviewById(
        @Body() body: UpdateReviewDto,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.service.update(id, body);
    }

    @Delete('reviews/:id')
    public deleteReviewById(@Param('id', ParseIntPipe) id: number) {
        return this.service.delete(id);
    }
}