import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Request } from "express";
import type { Socket } from "socket.io";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  getRequest(ctx: ExecutionContext): Request {
    let request: Request;
    const type = ctx.getType();

    if (type === "ws") {
      const client = ctx.switchToWs().getClient<Socket>();
      request = client.request as Request;

      request.headers.authorization = client.handshake.headers.authorization;
    } else {
      request = ctx.switchToHttp().getRequest() as Request;
    }

    return request;
  }
}
