import { Injectable } from '@nestjs/common';
type ReviewsType = { id: number, name: string, comment: string, rate: number }

@Injectable()
export class ReviewsService {
    private data: ReviewsType[] = [
        {
            id: 1,
            name: 'Islam Abdallah',
            comment: 'Great product, very high quality!',
            rate: 5,
        },
        {
            id: 2,
            name: 'Sara Ali',
            comment: 'Good value for the price, but delivery was a bit late.',
            rate: 4,
        },
        {
            id: 3,
            name: 'Omar Khaled',
            comment: 'Average experience, item didn’t match description fully.',
            rate: 3,
        },
        {
            id: 4,
            name: 'Mona Hassan',
            comment: 'Not satisfied, product stopped working after a week.',
            rate: 2,
        },
        {
            id: 5,
            name: 'Ahmed Mostafa',
            comment: 'Terrible quality, waste of money.',
            rate: 1,
        },
    ];


    public getAll() {
        return this.data
    }

}
