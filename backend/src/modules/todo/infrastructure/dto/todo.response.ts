import { Timestamp } from '@google-cloud/firestore';

export class TodoResponseItem {
  id: string;
  title: string;
  text?: string | null;
  isPublished: boolean;
  createdAt: Timestamp | null;
  updatedAt?: Timestamp | null;
  deletedAt?: Timestamp | null;
}
