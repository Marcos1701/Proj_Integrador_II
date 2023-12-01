import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('FinnApp API')
    .setDescription('The FinnApp API description')
    .setVersion('1.0')
    .addTag('finnapp')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  // await app.listen(3000);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(
    {
      origin: '*', // libera o acesso para qualquer origem
      methods: '*', // libera o acesso para qualquer método

    } // libera o acesso para qualquer origem e qualquer método
  );
  await app.listen(3300);
}
bootstrap();
