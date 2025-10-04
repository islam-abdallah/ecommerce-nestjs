import { IsEmail, IsString, Length, IsOptional, IsBoolean, IsEnum } from "class-validator";
import { UserType } from "src/utils/enums";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @Length(2,150)
    username?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @Length(6,150)
    password?: string;

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
