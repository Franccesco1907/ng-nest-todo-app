import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";
import { UserPayload } from "../interfaces";

export const GetUser = createParamDecorator(
  (data: keyof UserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user?: UserPayload }>();
    const user = request.user;
    if (!user) {
      throw new InternalServerErrorException('User not found in request');
    }

    return data ? user[data] : user;
  }
)