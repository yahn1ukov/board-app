import {
  CreateTaskRequestDto,
  CreateTaskResponseDto,
  GetTaskDetailResponseDto,
  GetTaskPreviewResponseDto,
  UpdateTaskRequestDto,
} from "@board/shared";
import { Inject, Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { WsException } from "@nestjs/websockets";
import type { RedisClientType } from "redis";
import { REDIS_TOKEN } from "../cache/cache.module";
import { EVENT } from "../common/event.constant";
import { ONLINE_USERS_KEY } from "../user/user.service";
import { TaskMapper } from "./task.mapper";
import { TaskRepository } from "./task.repository";

@Injectable()
export class TaskService {
  constructor(
    private readonly event: EventEmitter2,
    @Inject(REDIS_TOKEN) private readonly redis: RedisClientType,
    private readonly repository: TaskRepository,
  ) {}

  async create(authorId: string, dto: CreateTaskRequestDto): Promise<CreateTaskResponseDto> {
    const cachedUser = await this.redis.hGet(ONLINE_USERS_KEY, authorId);
    if (!cachedUser) {
      throw new WsException("User not found");
    }

    const task = await this.repository.create(authorId, dto);

    return TaskMapper.toPreviewDto(task, cachedUser);
  }

  async getAll(): Promise<GetTaskPreviewResponseDto[]> {
    const tasks = await this.repository.getAll();

    return tasks.map((task) => TaskMapper.toPreviewDto(task));
  }

  async getById(id: string): Promise<GetTaskDetailResponseDto> {
    const task = await this.repository.getById(id);

    return TaskMapper.toDetailDto(task);
  }

  async updateById(id: string, authorId: string, dto: UpdateTaskRequestDto): Promise<void> {
    await this.repository.updateById(id, authorId, dto);

    this.event.emit(EVENT.TASK.UPDATED, id, dto);
  }

  async deleteById(id: string, authorId: string): Promise<void> {
    await this.repository.deleteById(id, authorId);

    this.event.emit(EVENT.TASK.DELETED, id);
  }
}
