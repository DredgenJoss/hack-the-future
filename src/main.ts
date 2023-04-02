import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express';
import { ResponseInterceptor } from './utils/response.interceptor';
import { AllExceptionFilter } from './utils/http-exception.filter';


async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  // validation Filter
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.enableCors()

  await app.listen(3000)
}
bootstrap()
