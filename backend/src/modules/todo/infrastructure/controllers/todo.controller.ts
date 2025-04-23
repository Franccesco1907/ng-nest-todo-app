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
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateTodoApiResponseDto, DeleteApiResponseDto, GetAllTodosApiResponseDto, GetTodoApiResponseDto, MarkAsCompleteApiResponseDto, MarkTodosAsCompletedRequestBody, TodoCreateRequestBody, TodoFilter, TodoUpdateRequestBody, UpdateApiResponseDto } from '../dto';

@ApiTags('To Do\'s')
@ApiBearerAuth()
@ApiInternalServerErrorResponse({ description: 'To Do\'s Server Error' })
@ApiBadRequestResponse({ description: 'Bad Request' })
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
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: GetAllTodosApiResponseDto, description: 'Get To Do\'s by userId' })
  async getAll(@GetUser('id') userId: string, @Query() query: TodoFilter): Promise<TodoModel[]> {
    console.log('query', query);
    const response = await this.getAllTodoUseCase.execute(userId, query);

    return response;
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: GetTodoApiResponseDto, description: 'Get To Do by userId' })
  async get(@Param('id') id: string, @GetUser('id') userId: string): Promise<TodoModel> {
    const response = await this.getTodoUseCase.execute(id, userId);

    if (!response) {
      throw new NotFoundException('Todo does not exist');
    }

    return response;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: CreateTodoApiResponseDto, description: 'Create To Do' })
  async create(@GetUser('id') userId: string, @Body() body: TodoCreateRequestBody): Promise<TodoModel> {
    return this.createTodoUseCase.execute(userId, body);
  }

  @Patch('/mark-as-completed')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: MarkAsCompleteApiResponseDto, description: 'Mark As Complete To Do\'s by userId' })
  async markAsCompleteMany(
    @GetUser('id') userId: string,
    @Body() body: MarkTodosAsCompletedRequestBody,
  ): Promise<{ message: string }> {
    await this.markTodosAsCompleteUseCase.execute(body.ids, userId);
    return { message: 'Todos marked as completed successfully' };
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UpdateApiResponseDto, description: 'Update To Do by userId' })
  async update(@Param('id') id: string, @GetUser('id') userId: string, @Body() body: TodoUpdateRequestBody): Promise<TodoModel> {
    const updatedDocument = await this.updateTodoUseCase.execute(id, userId, body);
    if (!updatedDocument) {
      throw new NotFoundException('Todo does not exist');
    }
    return updatedDocument;
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: DeleteApiResponseDto, description: 'Delete To Do by userId' })
  async delete(@Param('id') id: string, @GetUser('id') userId: string): Promise<{ message: string }> {
    await this.deleteTodoUseCase.execute(id, userId);
    return { message: `Todo with id = ${id} deleted sucessfully` };
  }
}
