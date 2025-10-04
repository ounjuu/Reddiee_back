import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ CORS 설정 (Next.js 3000포트와 연결)
  app.enableCors({
    origin: ['http://localhost:3000'], // 필요시 여러 도메인 허용 가능
    credentials: true,
  });

  // ✅ 업로드 폴더 정적 제공 설정
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/', // 요청 경로 prefix
  });

  // ✅ 서버 시작
  const port = process.env.PORT ?? 5000;
  await app.listen(port);

  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`📁 Static files served from http://localhost:${port}/uploads/`);
}
bootstrap();
