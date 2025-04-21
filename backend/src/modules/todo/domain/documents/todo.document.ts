import { BaseDocument } from '@database/firestore';

export class TodoDocument extends BaseDocument<TodoDocument> {
  static collectionName = 'todos';

  userId: string;
  title: string;
  description: string;
  isCompleted: boolean;
}
