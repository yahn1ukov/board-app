import { SectionType } from "@board/shared";

export interface CreateTaskPayload {
  title: string;
  description: string;
  section: SectionType;
  assigneeId: string;
}

export type UpdateTaskPayload = Partial<
  CreateTaskPayload & {
    position: number;
  }
>;
