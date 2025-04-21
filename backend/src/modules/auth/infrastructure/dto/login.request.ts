import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class LoginRequest {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(100)
  email: string;
}