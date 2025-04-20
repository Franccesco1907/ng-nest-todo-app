import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import {
  CreateTodoUseCase,
  DeleteTodoUseCase,
  GetAllTodoUseCase,
  GetTodoUseCase,
  UpdateTodoUseCase,
} from '@modules/todo/application/use-cases';
import { TodoFilter, TodoCreateRequestBody, TodoUpdateRequestBody } from '../dto';
import { TodoModel } from '@modules/todo/domain/models';

@Controller('v1/todos')
export class TodoController {
  constructor(
    private readonly createTodoUseCase: CreateTodoUseCase,
    private readonly getAllTodoUseCase: GetAllTodoUseCase,
    private readonly getTodoUseCase: GetTodoUseCase,
    private readonly updateTodoUseCase: UpdateTodoUseCase,
    private readonly deleteTodoUseCase: DeleteTodoUseCase,
  ) { }

  @Get('/')
  async getAll(@Query() query: TodoFilter): Promise<TodoModel[]> {
    console.log(query);
    const response = await this.getAllTodoUseCase.execute(query);

    return response;
  }

  @Get('/:id')
  async get(@Param('id') id: string): Promise<TodoModel> {
    const response = await this.getTodoUseCase.execute(id);

    if (!response) {
      throw new NotFoundException('Todo does not exist');
    }

    return response;
  }

  @Post('/')
  async create(@Body() body: TodoCreateRequestBody): Promise<TodoModel> {
    return this.createTodoUseCase.execute(body);
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() body: TodoUpdateRequestBody): Promise<TodoModel> {
    const updatedDocument = await this.updateTodoUseCase.execute(id, body);
    if (!updatedDocument) {
      throw new NotFoundException('Todo does not exist');
    }
    return updatedDocument;
  }

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.deleteTodoUseCase.execute(id);
    return { message: `Todo with id = ${id} deleted sucessfully` };
  }
}
