import { LoginResponse } from "@modules/auth/infrastructure";
import { UserRepository } from "@modules/auth/infrastructure/repositories";
import { Inject } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

export class LoginUseCase {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) { }

  async execute(email: string): Promise<LoginResponse> {
    let user = await this.userRepository.findByEmail(email);
    if (!user) {
      user = await this.userRepository.create({ email });
    }

    const payload = { email: user.email, userId: user.id };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}