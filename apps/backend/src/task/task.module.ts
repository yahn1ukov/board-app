import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CacheModule } from "../cache/cache.module";
import { TaskController } from "./task.controller";
import { TaskEntity } from "./task.entity";
import { TaskRepository } from "./task.repository";
import { TaskService } from "./task.service";

@Module({
  imports: [CacheModule, TypeOrmModule.forFeature([TaskEntity])],
  controllers: [TaskController],
  providers: [TaskRepository, TaskService],
  exports: [TaskService],
})
export class TaskModule {}
 