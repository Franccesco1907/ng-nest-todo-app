import { LoginUseCase } from "@modules/auth/application/use-cases/login.use-case";
import { Body, Controller, Post } from "@nestjs/common";
import { LoginRequest } from "../dto";

@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
  ) { }

  @Post('/login')
  async login(@Body() body: LoginRequest) {
    const token = await this.loginUseCase.execute(body.email);
    return token;
  }
}