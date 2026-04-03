import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1775222266709 implements MigrationInterface {
    name = 'Init1775222266709'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "email" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying, "avatar_url" text, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_providers_type_enum" AS ENUM('google')`);
        await queryRunner.query(`CREATE TABLE "user_providers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "account_id" character varying NOT NULL, "type" "public"."user_providers_type_enum" NOT NULL, "user_id" uuid, CONSTRAINT "UQ_b3771dce9dae5b702efc7d07f1f" UNIQUE ("account_id"), CONSTRAINT "PK_7c253db00c7cac2a44f1f5a5c58" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_providers" ADD CONSTRAINT "FK_66144f0536826f644ce18baac3a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_providers" DROP CONSTRAINT "FK_66144f0536826f644ce18baac3a"`);
        await queryRunner.query(`DROP TABLE "user_providers"`);
        await queryRunner.query(`DROP TYPE "public"."user_providers_type_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
