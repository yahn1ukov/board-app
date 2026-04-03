import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserProviderEntity } from "../entities/user-provider.entity";
import { CreateUserProviderPayload } from "../types/user-provider.type";

@Injectable()
export class UserProviderRepository {
  constructor(@InjectRepository(UserProviderEntity) private readonly repository: Repository<UserProviderEntity>) {}

  async findByAccountId(accountId: string): Promise<UserProviderEntity | null> {
    return this.repository.findOne({
      where: { accountId },
      relations: { user: true },
    });
  }

  async create(userId: string, payload: CreateUserProviderPayload): Promise<void> {
    const provider = this.repository.create({ ...payload, user: { id: userId } });
    await this.repository.save(provider);
  }
}
