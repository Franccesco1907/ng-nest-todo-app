import { TodoCreateRequestBody } from '@modules/todo/infrastructure/dto';
import { TodoRepository } from '@modules/todo/infrastructure/repositories';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateTodoUseCase } from './create-todo.use-case';

describe('CreateTodoUseCase', () => {
  let createTodoUseCase: CreateTodoUseCase;
  let todoRepository: TodoRepository;

  const mockTodoRepository = {
    createTodo: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTodoUseCase,
        {
          provide: TodoRepository,
          useValue: mockTodoRepository,
        },
      ],
    }).compile();

    createTodoUseCase = module.get<CreateTodoUseCase>(CreateTodoUseCase);
    todoRepository = module.get<TodoRepository>(TodoRepository);
  });

  it('should be defined', () => {
    expect(createTodoUseCase).toBeDefined();
  });

  describe('execute', () => {
    const userId = 'test-user-id';
    const payload: TodoCreateRequestBody = {
      title: 'Test Todo',
      description: 'Test Todo Description',
      isCompleted: false, // Optional field
    };
    const mockCreatedTodo = { ...payload, userId, id: 'some-id' };

    it('should create a new todo and return the created todo', async () => {
      mockTodoRepository.createTodo.mockResolvedValue(mockCreatedTodo);

      const result = await createTodoUseCase.execute(userId, payload);

      expect(todoRepository.createTodo).toHaveBeenCalledWith({
        ...payload,
        userId,
      });
      expect(todoRepository.createTodo).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCreatedTodo);
    });

    it('should handle errors if the todo creation fails', async () => {
      const error = new Error('Error creating todo');
      mockTodoRepository.createTodo.mockRejectedValue(error);

      await expect(createTodoUseCase.execute(userId, payload)).rejects.toThrow(error);
      expect(todoRepository.createTodo).toHaveBeenCalledWith({
        ...payload,
        userId,
      });
      expect(todoRepository.createTodo).toHaveBeenCalledTimes(1);
    });
  });
});
