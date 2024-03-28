import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import { EnvVariable } from './enum/env-variable.enum';
import { configureSession } from './auth/session/express-session.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>(EnvVariable.PORT);
  configureSession(app);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(port);
}
bootstrap();
