import { GetUser, JwtAuthGuard } from '@modules/auth/infrastructure';
import {
  CreateTodoUseCase,
  DeleteTodoUseCase,
  GetAllTodoUseCase,
  GetTodoUseCase,
  MarkTodosAsCompleteUseCase,
  UpdateTodoUseCase
} from '@modules/todo/application/use-cases';
import { TodoModel } from '@modules/todo/domain/models';
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
  UseGuards
} from '@nestjs/common';
import { MarkTodosAsCompletedRequestBody, TodoCreateRequestBody, TodoFilter, TodoUpdateRequestBody } from '../dto';

@UseGuards(JwtAuthGuard)
@Controller('v1/todos')
export class TodoController {
  constructor(
    private readonly createTodoUseCase: CreateTodoUseCase,
    private readonly getAllTodoUseCase: GetAllTodoUseCase,
    private readonly getTodoUseCase: GetTodoUseCase,
    private readonly updateTodoUseCase: UpdateTodoUseCase,
    private readonly deleteTodoUseCase: DeleteTodoUseCase,
    private readonly markTodosAsCompleteUseCase: MarkTodosAsCompleteUseCase,
  ) { }

  @Get('/')
  async getAll(@GetUser('id') userId: string, @Query() query: TodoFilter): Promise<TodoModel[]> {
    console.log('query', query);
    const response = await this.getAllTodoUseCase.execute(userId, query);

    return response;
  }

  @Get('/:id')
  async get(@Param('id') id: string, @GetUser('id') userId: string): Promise<TodoModel> {
    const response = await this.getTodoUseCase.execute(id, userId);

    if (!response) {
      throw new NotFoundException('Todo does not exist');
    }

    return response;
  }

  @Post('/')
  async create(@GetUser('id') userId: string, @Body() body: TodoCreateRequestBody): Promise<TodoModel> {
    return this.createTodoUseCase.execute(userId, body);
  }

  @Patch('/mark-as-completed')
  async markAsCompleteMany(
    @GetUser('id') userId: string,
    @Body() body: MarkTodosAsCompletedRequestBody,
  ): Promise<{ message: string }> {
    await this.markTodosAsCompleteUseCase.execute(body.ids, userId);
    return { message: 'Todos marked as completed successfully' };
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @GetUser('id') userId: string, @Body() body: TodoUpdateRequestBody): Promise<TodoModel> {
    const updatedDocument = await this.updateTodoUseCase.execute(id, userId, body);
    if (!updatedDocument) {
      throw new NotFoundException('Todo does not exist');
    }
    return updatedDocument;
  }

  @Delete('/:id')
  async delete(@Param('id') id: string, @GetUser('id') userId: string): Promise<{ message: string }> {
    await this.deleteTodoUseCase.execute(id, userId);
    return { message: `Todo with id = ${id} deleted sucessfully` };
  }
}
