import { IsInt, IsNotEmpty, IsOptional, IsString, Length, Max, Min } from "class-validator";

export class UpdateReviewDto {
    @IsString()
    @IsNotEmpty()
    @Length(2,150)
    @IsOptional()
    name?: string;

    @IsString()
    @IsNotEmpty()
    @Length(2,300)
    @IsOptional()
    comment?: string;

    @IsInt()
    @Min(1)
    @Max(5)
    @IsOptional()
    rate?: number;
}


