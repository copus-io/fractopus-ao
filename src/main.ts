import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('FractOpus API')
    .setDescription('The NestJS API description')
    .setVersion('1.0')
    .addTag('Fractopus')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  
  // http://localhost:3000/doc.html
  SwaggerModule.setup('doc.html', app, document);

  await app.listen(3000);
}
bootstrap();
