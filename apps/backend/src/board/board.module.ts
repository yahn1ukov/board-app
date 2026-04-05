import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { TaskModule } from "../task/task.module";
import { UserModule } from "../user/user.module";
import { BoardGateway } from "./board.gateway";

@Module({
  imports: [AuthModule, UserModule, TaskModule],
  providers: [BoardGateway],
})
export class BoardModule {}
