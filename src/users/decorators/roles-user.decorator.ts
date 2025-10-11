//  Roles Method Decorator 
import { SetMetadata } from "@nestjs/common";
import { UserType } from "src/utils/enums";

/*
 * check Roles for Api Access   
 * 
 */
export const Roles = (...roles: UserType[]) => SetMetadata('roles', roles)
