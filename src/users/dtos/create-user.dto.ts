import { IsEmail, IsNotEmpty, IsString, Length, IsOptional, IsBoolean, IsEnum } from "class-validator";
import { UserType } from "src/utils/enums";
export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(2,150)
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(6,150)
    password: string;

    @IsOptional()
    @IsEnum(UserType)
    userType?: UserType;

    @IsOptional()
    @IsBoolean()
    accountVerified?: boolean;

    @IsOptional()
    @IsBoolean()
    accountActive?: boolean;
}


