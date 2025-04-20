export interface ITodo {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}