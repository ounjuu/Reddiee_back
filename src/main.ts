import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // 프론트엔드 주소
    credentials: true, // 쿠키/인증 정보 허용
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
