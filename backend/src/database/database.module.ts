import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirestoreModule } from './firestore';

@Module({
  imports: [
    FirestoreModule.forRoot({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        projectId: configService.get<string>('FIRESTORE_PROJECT_ID'),
        credentials: {
          client_email: configService.get<string>('FIRESTORE_CLIENT_EMAIL'),
          private_key: configService.get<string>('FIRESTORE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [FirestoreModule],
})
export class DatabaseModule { }
