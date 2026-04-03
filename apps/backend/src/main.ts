import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AppConfigService } from "./config/config.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(AppConfigService);

  app.enableCors({
    origin: config.app.frontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  });

  await app.listen(config.app.port);
}

bootstrap();
