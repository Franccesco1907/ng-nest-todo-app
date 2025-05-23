import { TodoModel } from '@modules/todo/domain/models';
import { TodoRepository } from '@modules/todo/infrastructure/repositories';
import { Inject } from '@nestjs/common';

export class GetAllTodoUseCase {
  constructor(@Inject(TodoRepository) private readonly repository: TodoRepository) { }

  async execute(userId: string, filter: Partial<TodoModel>) {
    return this.repository.findTodos(userId, filter);
  }
}
