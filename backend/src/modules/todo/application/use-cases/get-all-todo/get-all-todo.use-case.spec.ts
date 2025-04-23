import { Test, TestingModule } from '@nestjs/testing';
import { TodoRepository } from '@modules/todo/infrastructure/repositories';
import { GetAllTodoUseCase } from './get-all-todo.use-case';
import { TodoModel } from '@modules/todo/domain/models';

describe('GetAllTodoUseCase', () => {
  let getAllTodoUseCase: GetAllTodoUseCase;
  let todoRepository: TodoRepository;

  const mockTodoRepository = {
    findTodos: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllTodoUseCase,
        {
          provide: TodoRepository,
          useValue: mockTodoRepository,
        },
      ],
    }).compile();

    getAllTodoUseCase = module.get<GetAllTodoUseCase>(GetAllTodoUseCase);
    todoRepository = module.get<TodoRepository>(TodoRepository);
  });

  it('should be defined', () => {
    expect(getAllTodoUseCase).toBeDefined();
  });

  describe('execute', () => {
    const mockUserId = 'someUserId';
    const mockFilter: Partial<TodoModel> = { isCompleted: false };
    const mockTodos: TodoModel[] = [
      { id: '1', title: 'Task 1', isCompleted: false, userId: mockUserId, description: 'Description 1', createdAt: new Date() },
      { id: '2', title: 'Task 2', isCompleted: false, userId: mockUserId, description: 'Description 2', createdAt: new Date() },
    ];

    it('should call the todoRepository.findTodos method with the correct userId and filter', async () => {
      mockTodoRepository.findTodos.mockResolvedValue(mockTodos);
      await getAllTodoUseCase.execute(mockUserId, mockFilter);
      expect(todoRepository.findTodos).toHaveBeenCalledWith(mockUserId, mockFilter);
    });

    it('should return the todos fetched by the todoRepository', async () => {
      mockTodoRepository.findTodos.mockResolvedValue(mockTodos);
      const result = await getAllTodoUseCase.execute(mockUserId, mockFilter);
      expect(result).toEqual(mockTodos);
    });

    it('should handle the case where the todoRepository returns an empty array', async () => {
      mockTodoRepository.findTodos.mockResolvedValue([]);
      const result = await getAllTodoUseCase.execute(mockUserId, mockFilter);
      expect(result).toEqual([]);
    });

    it('should handle errors if todoRepository.findTodos throws an error', async () => {
      const errorMessage = 'Failed to fetch todos';
      mockTodoRepository.findTodos.mockRejectedValue(new Error(errorMessage));

      await expect(getAllTodoUseCase.execute(mockUserId, mockFilter)).rejects.toThrow(errorMessage);
    });
  });
});