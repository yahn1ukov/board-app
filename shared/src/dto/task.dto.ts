import { SectionType } from "../types/section.type";
import { User, UserBase } from "./user.dto";

interface Task {
  id: string;
  title: string;
  description: string;
  section: SectionType;
  position: number;
  author: User;
  assignee: UserBase;
  createdAt: Date;
}

export type CreateTaskRequestDto = Pick<Task, "title" | "description" | "section"> & {
  assigneeId: string;
};

export type CreateTaskResponseDto = Omit<Task, "description">;

export type GetTaskDetailResponseDto = Omit<Task, "position">;

export type GetTaskPreviewResponseDto = Omit<Task, "description">;

export type UpdateTaskRequestDto = Partial<Pick<Task, "title" | "description" | "section" | "position">> & {
  assigneeId?: string;
};

export type UpdateTaskResponseDto = Pick<Task, "id"> & Partial<Omit<Task, "id" | "author" | "createdAt">>;
