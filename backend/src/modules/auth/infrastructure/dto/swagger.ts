import { ResponseDto } from "@common/utils";
import { ApiProperty } from "@nestjs/swagger";

class TokenResponseDto {
  @ApiProperty({
    type: String,
    description: 'Token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZyYW5jY2VzY28uamFpbWVzQGdtYWlsLmNvbSIsInVzZXJJZCI6IjQ4MWFhNGRmLTkzYjYtNDg4NS1hYTMxLTIzODZhOWNlMjdiYyIsImlhdCI6MTc0NTE4NTcwOSwiZXhwIjoxNzQ1MTg5MzA5fQ.rbcjxsw5s453jwkHVDkr1Zs0y3ouMaW1cLo2Mu-6Nng',
  })
  token: string;
}

export class LoginApiResponseDto extends ResponseDto<TokenResponseDto> {
  @ApiProperty({ type: TokenResponseDto })
  declare data: TokenResponseDto;
}