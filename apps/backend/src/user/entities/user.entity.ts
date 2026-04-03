import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { UserProviderEntity } from "./user-provider.entity";

@Entity("users")
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ name: "first_name" })
  firstName: string;

  @Column("varchar", { name: "last_name", nullable: true })
  lastName: string | null;

  @Column("text", { name: "avatar_url", nullable: true })
  avatarUrl: string | null;

  @OneToMany(() => UserProviderEntity, (provider) => provider.user)
  providers: UserProviderEntity[];
}
