import { TodoRepository } from '@modules/todo/infrastructure/repositories';
import { Inject } from '@nestjs/common';

export class DeleteTodoUseCase {
  constructor(@Inject(TodoRepository) private readonly repository: TodoRepository) { }
  async execute(id: string, userId: string) {
    return this.repository.softDeleteTodo(id, userId);
  }
}
