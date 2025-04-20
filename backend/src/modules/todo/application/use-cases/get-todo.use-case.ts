import { TodoRepository } from '@modules/todo/infrastructure/repositories';
import { Inject } from '@nestjs/common';

export class GetTodoUseCase {
  constructor(@Inject(TodoRepository) private readonly repository: TodoRepository) { }

  async execute(id: string) {
    return this.repository.getTodoById(id);
  }
}
