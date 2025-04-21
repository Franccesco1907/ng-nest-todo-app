import { DatabaseModule } from "@database/database.module";
import { LoginUseCase } from "@modules/auth/application/use-cases/login.use-case";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserRepository } from "../repositories";
import { JwtStrategy } from "../strategies";
import { AuthController } from "./auth.controller";

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION'),
        },
      }),
    })
  ],
  controllers: [AuthController],
  providers: [
    UserRepository,
    LoginUseCase,
    JwtStrategy,
  ],
  exports: [
    JwtStrategy,
    PassportModule,
    JwtModule,
  ]
})
export class AuthModule { }