import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SocketIoAdapter } from "./auth/adapters/socket-io.adapter";
import { ConfigService } from "./config/config.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  app.enableCors({
    origin: config.app.frontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  });

  app.useWebSocketAdapter(new SocketIoAdapter(app, config.app.frontendUrl));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.listen(config.app.port);
}

bootstrap();
