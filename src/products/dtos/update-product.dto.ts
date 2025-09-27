import { IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min } from "class-validator";

export class UpdateProductDto {
    @IsString()
    @IsNotEmpty()
    // @MinLength(2)
    // @MaxLength(120)
    @Length(2,150)
    @IsOptional()
    title?: string;

    @IsString()
    @IsNotEmpty()
    @Length(2,250)
    @IsOptional()
    description?: string;
    
    @IsNumber()
    @IsNotEmpty()
    @Min(0, {message:'Price not Less than 0 '})
    @IsOptional()
    price?: number;
    
}