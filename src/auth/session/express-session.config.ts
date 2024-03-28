import { EnvVariable } from '@app/enum/env-variable.enum';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';

export const configureSession = (app: INestApplication<any>) => {
  const configService = app.get(ConfigService);
  const secret = configService.get<string>(EnvVariable.SESSION_SECRET);

  app.use(
    session({
      secret,
      resave: false,
      saveUninitialized: false,
    }),
  );
};
