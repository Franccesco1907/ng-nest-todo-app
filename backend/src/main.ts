import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as admin from 'firebase-admin';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );

  const config = new DocumentBuilder()
    .setTitle('To Do\'s API')
    .setDescription(
      `To Do's API
  <br>Created by: <b>Franccesco Jaimes Agreda</b>
  <br>GitHub: <a href="https://github.com/Franccesco1907" target="_blank">Franccesco1907</a>
  <br>Linkedin: <a href="https://www.linkedin.com/in/franccesco-michael-jaimes-agreda-7a00511a8/" target="_blank">Franccesco Michael Jaimes Agreda</a>
  <br>Gmail: <a href="mailto:franccescojaimesagreda@gmail.com">franccescojaimesagreda@gmail.com</a>
  `)
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('To Do\'s API')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

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


  const firestoreProjectId = configService.get<string>('FIRESTORE_PROJECT_ID')!;
  const firestorePrivateKey = configService.get<string>('FIRESTORE_PRIVATE_KEY')!.replace(/\\n/g, '\n');
  const firestoreClientEmail = configService.get<string>('FIRESTORE_CLIENT_EMAIL')!;

  console.log('firestorePrivateKey', firestorePrivateKey)
  const adminConfig: admin.ServiceAccount = {
    projectId: firestoreProjectId,
    privateKey: firestorePrivateKey,
    clientEmail: firestoreClientEmail,
  };

  console.log('adminConfig', adminConfig)

  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    databaseURL: `https://${adminConfig.projectId}.firebaseio.com`,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
