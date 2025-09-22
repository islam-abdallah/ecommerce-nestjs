import { Controller, Get } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('api/')
export class ReviewsController {
    constructor(private service: ReviewsService) { }
    @Get("reviews")
    public getAllReviews() {
        return this.service.getAll()
    }
}