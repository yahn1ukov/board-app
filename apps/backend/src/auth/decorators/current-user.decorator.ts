import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { Request } from "express";
import type { Socket } from "socket.io";
import { JwtPayload } from "../types/auth.type";

export const CurrentUser = createParamDecorator((data: keyof JwtPayload, ctx: ExecutionContext) => {
  let request: Request;
  const type = ctx.getType();

  if (type === "ws") {
    const client = ctx.switchToWs().getClient<Socket>();
    request = client.request as Request;
  } else {
    request = ctx.switchToHttp().getRequest() as Request;
  }

  const user = request.user!;

  return data ? user[data] : user;
});
