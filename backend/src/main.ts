import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as admin from 'firebase-admin';
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
  const firestoreProjectId = configService.get<string>('FIRESTORE_PROJECT_ID')!;
  const firestorePrivateKey = configService.get<string>('FIRESTORE_PRIVATE_KEY')!.replace(/\\n/g, '\n');
  const firestoreClientEmail = configService.get<string>('FIRESTORE_CLIENT_EMAIL')!;

  console.log('firestorePrivateKey', firestorePrivateKey)
  const adminConfig: admin.ServiceAccount = {
    projectId: firestoreProjectId,
    privateKey: firestorePrivateKey,
    clientEmail: firestoreClientEmail,
  };

  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    databaseURL: `https://${adminConfig.projectId}.firebaseio.com`,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
