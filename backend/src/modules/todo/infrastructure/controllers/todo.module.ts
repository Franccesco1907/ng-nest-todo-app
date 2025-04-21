import { DatabaseModule } from '@database/database.module';
import {
  CreateTodoUseCase,
  DeleteTodoUseCase,
  GetAllTodoUseCase,
  GetTodoUseCase,
  MarkTodosAsCompleteUseCase,
  UpdateTodoUseCase,
} from '@modules/todo/application/use-cases';
import { Module } from '@nestjs/common';
import { TodoRepository } from '../repositories';
import { TodoController } from './todo.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [TodoController],
  providers: [
    TodoRepository,
    CreateTodoUseCase,
    UpdateTodoUseCase,
    GetAllTodoUseCase,
    GetTodoUseCase,
    DeleteTodoUseCase,
    MarkTodosAsCompleteUseCase,
  ],
})
export class TodoModule { }
