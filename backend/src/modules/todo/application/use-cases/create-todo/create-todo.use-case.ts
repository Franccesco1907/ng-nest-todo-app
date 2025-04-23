import { Inject } from '@nestjs/common';
import { TodoCreateRequestBody } from '@modules/todo/infrastructure/dto';
import { TodoRepository } from '@modules/todo/infrastructure/repositories';

export class CreateTodoUseCase {
  constructor(@Inject(TodoRepository) private readonly repository: TodoRepository) { }

  async execute(userId: string, payload: TodoCreateRequestBody) {
    return this.repository.createTodo({ ...payload, userId });
  }
}

