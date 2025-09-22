import { IsNotEmpty, IsNumber, IsOptional, IsString, Length, MaxLength, Min, MinLength } from "class-validator";

export class UpdateProductDto {
    @IsString()
    @IsNotEmpty()
    // @MinLength(2)
    // @MaxLength(120)
    @Length(2,150)
    @IsOptional()
    name?: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0, {message:'Price not Less than 0 '})
    @IsOptional()
    price?: number;
    
}