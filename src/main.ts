import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // 프론트엔드 주소
    credentials: true, // 쿠키/인증 정보 허용
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // 이 경로로 접근 가능 (예: http://localhost:5000/uploads/파일이름)
  });

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
