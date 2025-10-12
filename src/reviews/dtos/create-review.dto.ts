import { IsInt, IsNotEmpty, IsString, Length, Max, Min } from "class-validator";

export class CreateReviewDto {

    @IsString()
    @IsNotEmpty()
    @Length(2,300)
    comment: string;

    @IsInt()
    @Min(1)
    @Max(5)
    rate: number;
}


