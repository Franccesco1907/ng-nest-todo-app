import { Timestamp } from '@google-cloud/firestore';

export abstract class BaseDocument<T> {
  id: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  deletedAt: Timestamp | null;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
