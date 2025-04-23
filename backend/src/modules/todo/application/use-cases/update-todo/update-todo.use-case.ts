import { TodoUpdateRequestBody } from '@modules/todo/infrastructure/dto';
import { TodoRepository } from '@modules/todo/infrastructure/repositories';
import { Inject } from '@nestjs/common';

export class UpdateTodoUseCase {
  constructor(@Inject(TodoRepository) private readonly repository: TodoRepository) { }

  async execute(id: string, userId: string, payload: TodoUpdateRequestBody) {
    return this.repository.updateTodo(id, userId, payload);
  }
}
