import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  console.log('process.env', process.env);
  const configService: ConfigService = app.get(ConfigService);

  const allowedOrigins = configService.get<string>('ALLOWED_ORIGINS');
  const originsArray = allowedOrigins ? allowedOrigins.split(',') : [];


  app.enableCors({
    origin: originsArray.length > 0 ? originsArray : '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });


  // Retrieve the service file name from the env file
  const accountPath = configService.get<string>('SA_KEY')!;
  console.log('accountPath', accountPath);
  // You can refine the type definitions for the service file; as you can see, I haven't focused on that yet
  const serviceAccount: any = JSON.parse(fs.readFileSync(accountPath, 'utf8'));

  const adminConfig: admin.ServiceAccount = {
    projectId: serviceAccount.project_id,
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email,
  };

  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    databaseURL: `https://${adminConfig.projectId}.firebaseio.com`,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
