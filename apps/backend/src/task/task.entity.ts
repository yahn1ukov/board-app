import { SECTION_TYPE, type SectionType } from "@board/shared";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../common/base.entity";
import { UserEntity } from "../user/entities/user.entity";

@Entity("tasks")
export class TaskEntity extends BaseEntity {
  @Column()
  title: string;

  @Column("text")
  description: string;

  @Column("double precision", { default: 1000 })
  position: number;

  @Column("enum", { enum: Object.values(SECTION_TYPE), default: SECTION_TYPE.TODO })
  section: SectionType;

  @ManyToOne(() => UserEntity, (user) => user.createdTasks)
  @JoinColumn({ name: "author_id" })
  author: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.assignedTasks)
  @JoinColumn({ name: "assignee_id" })
  assignee: UserEntity;
}
