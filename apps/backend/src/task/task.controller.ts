import { GetTaskDetailResponseDto, GetTaskPreviewResponseDto } from "@board/shared";
import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { UpdateTaskRequestDto } from "./task.dto";
import { TaskService } from "./task.service";

@UseGuards(JwtAuthGuard)
@Controller("tasks")
export class TaskController {
  constructor(private readonly service: TaskService) {}

  @Get()
  async getAll(): Promise<GetTaskPreviewResponseDto[]> {
    return this.service.getAll();
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<GetTaskDetailResponseDto> {
    return this.service.getById(id);
  }

  @Patch(":id")
  async updateById(
    @Param("id") id: string,
    @CurrentUser("id") authorId: string,
    @Body() dto: UpdateTaskRequestDto,
  ): Promise<void> {
    return this.service.updateById(id, authorId, dto);
  }

  @Delete(":id")
  async deleteById(@Param("id") id: string, @CurrentUser("id") authorId: string): Promise<void> {
    return this.service.deleteById(id, authorId);
  }
}
