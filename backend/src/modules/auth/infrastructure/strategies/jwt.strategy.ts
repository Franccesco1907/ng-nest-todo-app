import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../repositories';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @Inject(UserRepository) private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: any) {
    if (!payload.email) {
      return null;
    }
    const user = await this.userRepository.findByEmail(payload.email);
    if (!user) {
      return null;
    }
    return user;
  }
}