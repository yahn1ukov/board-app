import { SectionType } from "../types/section.type";
import { User } from "./user.dto";

interface Task {
  id: string;
  title: string;
  description: string;
  section: SectionType;
  position: number;
  author: Omit<User, "id">;
  assignee: Omit<User, "id">;
  createdAt: Date;
}

export type CreateTaskRequestDto = Pick<Task, "title" | "description" | "section"> & {
  assigneeId: string;
};

export type CreateTaskResponseDto = Omit<Task, "description">;

export type GetTaskDetailResponseDto = Omit<Task, "position">;

export type GetTaskPreviewResponseDto = Omit<Task, "description">;

export type UpdateTaskRequestDto = Partial<
  CreateTaskRequestDto & {
    position: number;
  }
>;
