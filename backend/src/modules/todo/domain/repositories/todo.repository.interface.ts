import { TodoModel } from "../models";

export interface TodoRepositoryInterface {
  getTodoById(id: string, userId: string): Promise<TodoModel | null>;
  findTodos(userId: string, filter: Partial<TodoModel>): Promise<TodoModel[]>;
  createTodo(payload: Partial<TodoModel>): Promise<TodoModel>;
  updateTodo(id: string, userId: string, data: Partial<TodoModel>): Promise<TodoModel>;
  softDeleteTodo(id: string, userId: string): Promise<void>;
  markAsCompleted(ids: string[], userId: string): Promise<void>;
}
