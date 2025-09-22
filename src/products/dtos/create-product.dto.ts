import { isNotEmpty, IsNotEmpty, IsNumber, IsString, Length, MaxLength, Min, MinLength } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    // @MinLength(2)
    // @MaxLength(120)
    @Length(2,150)
    name: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0, {message:'Price not Less than 0 '})
    price: number;
    
}