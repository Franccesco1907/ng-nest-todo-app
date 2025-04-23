import { LoginUseCase } from "@modules/auth/application/use-cases";
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { LoginApiResponseDto, LoginRequest } from "../dto";
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Auth')
@ApiInternalServerErrorResponse({ description: 'To Do\'s Server Error' })
@ApiBadRequestResponse({ description: 'Bad Request' })
@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
  ) { }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginApiResponseDto, description: 'Login' })
  async login(@Body() body: LoginRequest) {
    const token = await this.loginUseCase.execute(body.email);
    return token;
  }
}