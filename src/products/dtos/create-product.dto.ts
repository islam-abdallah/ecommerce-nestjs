import { isNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, Length, MaxLength, Min, MinLength } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    // @MinLength(2)
    // @MaxLength(120)
    @Length(2,150)
    title: string;

    @IsString()
    @IsNotEmpty()
    @Length(2,250)
    description: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0, {message:'Price not Less than 0 '})
    price: number;
    
}