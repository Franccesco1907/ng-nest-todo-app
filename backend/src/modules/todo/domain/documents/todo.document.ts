import { BaseDocument } from '@database/firestore';

export class TodoDocument extends BaseDocument<TodoDocument> {
  static collectionName = 'todo';

  title: string;
  description: string;
  isCompleted: boolean;
}
