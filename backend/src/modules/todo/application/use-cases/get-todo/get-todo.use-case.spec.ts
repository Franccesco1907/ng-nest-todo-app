import { Test, TestingModule } from '@nestjs/testing';
import { TodoRepository } from '@modules/todo/infrastructure/repositories';
import { GetTodoUseCase } from './get-todo.use-case';
import { TodoModel } from '@modules/todo/domain/models';

describe('GetTodoUseCase', () => {
  let getTodoUseCase: GetTodoUseCase;
  let todoRepository: TodoRepository;

  const mockTodoRepository = {
    getTodoById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTodoUseCase,
        {
          provide: TodoRepository,
          useValue: mockTodoRepository,
        },
      ],
    }).compile();

    getTodoUseCase = module.get<GetTodoUseCase>(GetTodoUseCase);
    todoRepository = module.get<TodoRepository>(TodoRepository);
  });

  it('should be defined', () => {
    expect(getTodoUseCase).toBeDefined();
  });

  describe('execute', () => {
    const mockTodoId = 'someTodoId';
    const mockUserId = 'someUserId';
    const mockTodo: TodoModel = {
      id: mockTodoId,
      title: 'Test Todo',
      isCompleted: false,
      userId: mockUserId,
      description: 'Test description',
      createdAt: new Date(),
    };

    it('should call the todoRepository.getTodoById method with the correct id and userId', async () => {
      mockTodoRepository.getTodoById.mockResolvedValue(mockTodo);
      await getTodoUseCase.execute(mockTodoId, mockUserId);
      expect(todoRepository.getTodoById).toHaveBeenCalledWith(mockTodoId, mockUserId);
    });

    it('should return the todo fetched by the todoRepository', async () => {
      mockTodoRepository.getTodoById.mockResolvedValue(mockTodo);
      const result = await getTodoUseCase.execute(mockTodoId, mockUserId);
      expect(result).toEqual(mockTodo);
    });

    it('should return null if the todoRepository returns null', async () => {
      mockTodoRepository.getTodoById.mockResolvedValue(null);
      const result = await getTodoUseCase.execute(mockTodoId, mockUserId);
      expect(result).toBeNull();
    });

    it('should handle errors if todoRepository.getTodoById throws an error', async () => {
      const errorMessage = 'Failed to fetch todo';
      mockTodoRepository.getTodoById.mockRejectedValue(new Error(errorMessage));

      await expect(getTodoUseCase.execute(mockTodoId, mockUserId)).rejects.toThrow(errorMessage);
    });
  });
});