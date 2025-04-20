import { TodoModel } from "../models";

export interface TodoRepositoryInterface {
  getTodoById(id: string): Promise<TodoModel | null>;
  findTodos(filter: Partial<TodoModel>): Promise<TodoModel[]>;
  createTodo(payload: Partial<TodoModel>): Promise<TodoModel>;
  updateTodo(id: string, data: Partial<TodoModel>): Promise<TodoModel>;
  softDeleteTodo(id: string): Promise<void>;
}
