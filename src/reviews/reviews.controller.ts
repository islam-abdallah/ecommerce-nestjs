import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthRolesGuard } from 'src/users/Guard/auth-roles.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { Roles } from 'src/users/decorators/roles-user.decorator';
import { UserType } from 'src/utils/enums';
import type { JWTPayloadType } from 'src/utils/typesPayload';
import { CreateReviewDto, UpdateReviewDto } from './dtos';
import { ReviewsService } from './reviews.service';

@Controller('api/')
export class ReviewsController {
    constructor(private readonly service: ReviewsService) { }

    @Post('reviews/:productId')
    @Roles(UserType.ADMIN, UserType.Normal_USER)
    @UseGuards(AuthRolesGuard)

    public createReview(@Body() body: CreateReviewDto,
    @Param('productId', ParseIntPipe) productId:number,
    @CurrentUser() user :JWTPayloadType
) {
        return this.service.create(
            productId,
            user.id,
            body
        );
    }

    @Get('reviews')
    public getAllReviews(
        @Query('pageNumber', ParseIntPipe) pageNumber :number,
        @Query('perPage', ParseIntPipe) perPage :number 
    ) {
        console.log('pageNumber', pageNumber)
        console.log('perPage', perPage)
        return this.service.getAll(
            pageNumber,perPage
        );
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