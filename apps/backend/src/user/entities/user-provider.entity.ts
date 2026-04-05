import { PROVIDER_TYPE, type ProviderType } from "@board/shared";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../../common/base.entity";
import { UserEntity } from "./user.entity";

@Entity("user_providers")
export class UserProviderEntity extends BaseEntity {
  @Column({ name: "account_id", unique: true })
  accountId: string;

  @Column("enum", { enum: Object.values(PROVIDER_TYPE) })
  type: ProviderType;

  @ManyToOne(() => UserEntity, (user) => user.providers, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;
}
