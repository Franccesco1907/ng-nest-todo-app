import { TodoRepository } from "@modules/todo/infrastructure/repositories";
import { Inject } from "@nestjs/common";

export class MarkTodosAsCompleteUseCase {
  constructor(
    @Inject(TodoRepository) private readonly todoRepository: TodoRepository,
  ) { }

  async execute(ids: string[], userId: string): Promise<void> {
    await this.todoRepository.markAsCompleted(ids, userId);
  }
}