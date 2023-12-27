import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';

// custom validatio error object
const CustomValidationErrorObject = (
  validationErrors: ValidationError[] = [],
) => {
  const result = validationErrors.reduce((acc, error) => {
    acc[error.property] = Object.values(error.constraints).join(', ');
    return acc;
  }, {});

  return new BadRequestException(result);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: CustomValidationErrorObject,
      stopAtFirstError: true,
      transform: true,
      whitelist: true,
    }),
  );

  await app.listen(4000);
}
bootstrap();
