import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(2,150)
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}


