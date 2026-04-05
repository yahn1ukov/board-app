import {
  SECTION_TYPE,
  type CreateTaskRequestDto as ICreateTaskRequestDto,
  type UpdateTaskRequestDto as IUpdateTaskRequestDto,
  type SectionType,
} from "@board/shared";
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateTaskRequestDto implements ICreateTaskRequestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsIn(Object.values(SECTION_TYPE))
  @IsNotEmpty()
  section: SectionType;

  @IsUUID()
  @IsNotEmpty()
  assigneeId: string;
}

export class UpdateTaskRequestDto implements IUpdateTaskRequestDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsIn(Object.values(SECTION_TYPE))
  @IsOptional()
  section?: SectionType;

  @IsNumber()
  @IsOptional()
  position?: number;

  @IsUUID()
  @IsOptional()
  assigneeId?: string;
}
