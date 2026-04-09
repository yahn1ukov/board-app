import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TaskEntity } from "./entities/task.entity";
import { CreateTaskPayload, UpdateTaskPayload } from "./types/task.type";

@Injectable()
export class TaskRepository {
  constructor(@InjectRepository(TaskEntity) private readonly repository: Repository<TaskEntity>) {}

  async create(authorId: string, payload: CreateTaskPayload): Promise<TaskEntity> {
    const step = 1000;
    const { assigneeId, section, ...data } = payload;

    const lastTask = await this.repository.findOne({
      where: { section },
      order: { position: "DESC" },
    });

    const position = lastTask ? lastTask.position + step : step;

    const task = await this.repository.create({
      ...data,
      position,
      section,
      author: { id: authorId },
      assignee: { id: assigneeId },
    });

    const savedTask = await this.repository.save(task);

    return this.repository.findOneOrFail({
      where: { id: savedTask.id },
      relations: { assignee: true },
    });
  }

  async getAll(): Promise<TaskEntity[]> {
    return this.repository.find({
      relations: {
        author: true,
        assignee: true,
      },
      order: { position: "ASC" },
    });
  }

  async getById(id: string): Promise<TaskEntity> {
    return this.repository.findOneOrFail({
      where: { id },
      relations: {
        author: true,
        assignee: true,
      },
    });
  }

  async updateById(id: string, authorId: string, payload: UpdateTaskPayload): Promise<TaskEntity | null> {
    const { assigneeId, ...data } = payload;

    const result = await this.repository.update(
      { id, author: { id: authorId } },
      {
        ...data,
        ...(assigneeId && { assignee: { id: assigneeId } }),
      },
    );
    if (!result.affected) {
      throw new NotFoundException("Task not found");
    }

    if (assigneeId) {
      return this.repository.findOneOrFail({
        where: { id },
        relations: { assignee: true },
      });
    }

    return null;
  }

  async deleteById(id: string, authorId: string): Promise<void> {
    const result = await this.repository.delete({ id, author: { id: authorId } });
    if (!result.affected) {
      throw new NotFoundException("Task not found");
    }
  }
}
