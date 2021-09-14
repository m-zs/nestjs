import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { configService } from './config/config.service';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform-interceptor';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(configService.getPort());
  logger.log(`Listening at port ${configService.getPort()}`);
}
bootstrap();
