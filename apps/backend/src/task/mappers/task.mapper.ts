import { GetTaskDetailResponseDto, GetTaskPreviewResponseDto } from "@board/shared";
import { TaskEntity } from "../entities/task.entity";

export class TaskMapper {
  static toDetailDto(task: TaskEntity): GetTaskDetailResponseDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      section: task.section,
      author: {
        id: task.author.id,
        email: task.author.email,
        firstName: task.author.firstName,
        lastName: task.author.lastName,
        avatarUrl: task.author.avatarUrl,
      },
      assignee: {
        email: task.assignee.email,
        firstName: task.assignee.firstName,
        lastName: task.assignee.lastName,
        avatarUrl: task.assignee.avatarUrl,
      },
      createdAt: task.createdAt,
    };
  }

  static toPreviewDto(task: TaskEntity, cachedUser?: string): GetTaskPreviewResponseDto {
    if (cachedUser) {
      return {
        id: task.id,
        title: task.title,
        section: task.section,
        position: task.position,
        createdAt: task.createdAt,
        author: JSON.parse(cachedUser),
        assignee: {
          email: task.assignee.email,
          firstName: task.assignee.firstName,
          lastName: task.assignee.lastName,
          avatarUrl: task.assignee.avatarUrl,
        },
      };
    }

    const { description: _, author, ...data } = this.toDetailDto(task);

    return {
      ...data,
      position: task.position,
      author,
    };
  }
}
