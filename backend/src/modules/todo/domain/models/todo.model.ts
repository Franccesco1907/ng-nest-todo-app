export class TodoModel {
  id: string;
  userId: string;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;

  constructor(data: Partial<TodoModel>) {
    Object.assign(this, data);
  }
}