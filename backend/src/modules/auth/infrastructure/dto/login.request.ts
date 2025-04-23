import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class LoginRequest {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(100)
  @ApiProperty({
    description: 'User email',
    example: 'test@example.com',
    required: true,
  })
  email: string;
}