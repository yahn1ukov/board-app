import { type UpdateTaskResponseDto, WS_EVENT } from "@board/shared";
import { UseGuards } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { JwtService } from "@nestjs/jwt";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import type { Request } from "express";
import { Server, Socket } from "socket.io";
import type { JwtPayload } from "src/auth/types/auth.type";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { EVENT } from "../common/constants/event.constant";
import { CreateTaskRequestDto } from "../task/dto/task.dto";
import { TaskService } from "../task/task.service";
import { UserService } from "../user/user.service";

@WebSocketGateway()
export class BoardGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly taskService: TaskService,
  ) {}

  async handleConnection(@ConnectedSocket() client: Socket): Promise<void> {
    const request = client.request as Request;

    const token = client.handshake.headers.authorization?.split(" ")[1];
    if (!token) {
      client.disconnect(true);
      return;
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token);

      request.user = payload;

      const result = await this.userService.addOnline(payload.id);
      if (!result) {
        client.disconnect(true);
        return;
      }

      await client.join(payload.id);

      if (result.isNew) {
        this.server.emit(WS_EVENT.SYSTEM.JOINED, result.onlineUser);
      }
    } catch (error: unknown) {
      client.disconnect(true);
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket): Promise<void> {
    const request = client.request as Request;

    const userId = request.user?.id;
    if (!userId) {
      return;
    }

    const sockets = await this.server.in(userId).fetchSockets();
    if (!sockets.length) {
      await this.userService.removeOnline(userId);
    }
  }

  @OnEvent(EVENT.TASK.UPDATED)
  handleTaskUpdated(dto: UpdateTaskResponseDto): void {
    this.server.emit(WS_EVENT.TASK.UPDATED, dto);
  }

  @OnEvent(EVENT.TASK.DELETED)
  handleTaskDeleted(taskId: string): void {
    this.server.emit(WS_EVENT.TASK.DELETED, taskId);
  }

  @OnEvent(EVENT.USER.LOGOUT)
  handleUserLogout(userId: string): void {
    this.server.to(userId).emit(WS_EVENT.SYSTEM.LOGOUT);
    this.server.in(userId).disconnectSockets(true);
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage(WS_EVENT.TASK.CREATED)
  async handleMessage(@CurrentUser("id") authorId: string, @MessageBody() dto: CreateTaskRequestDto): Promise<void> {
    const task = await this.taskService.create(authorId, dto);

    this.server.emit(WS_EVENT.TASK.CREATED, task);
  }
}
