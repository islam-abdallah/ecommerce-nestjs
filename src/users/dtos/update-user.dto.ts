import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(2,150)
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsNotEmpty()
    @IsOptional()
    email?: string;
}


