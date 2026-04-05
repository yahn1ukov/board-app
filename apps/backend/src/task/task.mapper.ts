import { GetTaskDetailResponseDto, GetTaskPreviewResponseDto } from "@board/shared";
import { TaskEntity } from "./task.entity";

export class TaskMapper {
  static toDetailDto(task: TaskEntity): GetTaskDetailResponseDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      section: task.section,
      author: {
        email: task.author.email,
        firstName: task.author.firstName,
        lastName: task.author.lastName,
        avatarUrl: task.author.avatarUrl,
      },
      assignee: {
        email: task.author.email,
        firstName: task.author.firstName,
        lastName: task.author.lastName,
        avatarUrl: task.author.avatarUrl,
      },
      createdAt: task.createdAt,
    };
  }

  static toPreviewDto(task: TaskEntity, cachedUser?: string): GetTaskPreviewResponseDto {
    const { description: _, author, ...data } = this.toDetailDto(task);

    const user = cachedUser ? JSON.parse(cachedUser) : author;

    return {
      ...data,
      position: task.position,
      author: user,
    };
  }
}
