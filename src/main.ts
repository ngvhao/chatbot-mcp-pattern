import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exceptions/global.exception';
import { ValidationPipe } from './pipes/validation.pipe';
import { API_PREFIX_PATH } from './shared/utils/constants';

export function setupMiddlewares(app: INestApplication) {
  const expressApp = app as NestExpressApplication;

  dotenv.config();
  expressApp.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          connectSrc: [
            "'self'",
            'https://*.google-analytics.com',
            'https://*.analytics.google.com',
            'https://*.googletagmanager.com',
          ],
          scriptSrc: [
            "'self'",
            'https://www.googletagmanager.com',
            `'unsafe-inline'`,
          ],
          styleSrc: [
            "'self'",
            'https://fonts.googleapis.com',
            `'unsafe-inline'`,
          ],
          imgSrc: [
            "'self'",
            'data:',
            'https://*.google-analytics.com',
            'https://ssl.gstatic.com',
            'https://www.gstatic.com',
            'validator.swagger.io',
          ],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
    }),
  );

  const apiPath = `${API_PREFIX_PATH}/docs`;
  app.setGlobalPrefix(API_PREFIX_PATH);

  const config = new DocumentBuilder()
    .setTitle('Chat BE')
    .setDescription('Chat BE project')
    .setVersion('1.0')
    .addServer(process.env.BE_URL, 'Development')
    .addBearerAuth({ type: 'http', scheme: 'bearer', in: 'header' }, 'token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(apiPath, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.use(bodyParser.json());
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  return expressApp;
}

async function createAppInstance() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  setupMiddlewares(app);

  return app;
}

async function bootstrap() {
  const app = await createAppInstance();
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Server is running on PORT: ${port}`);
  console.log(`Swagger docs: ${`${API_PREFIX_PATH}/docs`}`);
}

bootstrap();
