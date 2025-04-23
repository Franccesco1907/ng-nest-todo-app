import { Test, TestingModule } from '@nestjs/testing';
import { TodoRepository } from '@modules/todo/infrastructure/repositories';
import { DeleteTodoUseCase } from './delete-todo.use-case';

describe('DeleteTodoUseCase', () => {
  let deleteTodoUseCase: DeleteTodoUseCase;
  let todoRepository: TodoRepository;

  const mockTodoRepository = {
    softDeleteTodo: jest.fn().mockResolvedValue(true), // Simulate successful deletion
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteTodoUseCase,
        {
          provide: TodoRepository,
          useValue: mockTodoRepository,
        },
      ],
    }).compile();

    deleteTodoUseCase = module.get<DeleteTodoUseCase>(DeleteTodoUseCase);
    todoRepository = module.get<TodoRepository>(TodoRepository);
  });

  it('should be defined', () => {
    expect(deleteTodoUseCase).toBeDefined();
  });

  describe('execute', () => {
    const mockTodoId = 'someTodoId';
    const mockUserId = 'someUserId';

    it('should call the todoRepository.softDeleteTodo method with the correct id and userId', async () => {
      await deleteTodoUseCase.execute(mockTodoId, mockUserId);
      expect(todoRepository.softDeleteTodo).toHaveBeenCalledWith(mockTodoId, mockUserId);
    });

    it('should return the result of the todoRepository.softDeleteTodo method', async () => {
      const deletionResult = await deleteTodoUseCase.execute(mockTodoId, mockUserId);
      expect(deletionResult).toBe(true); // Based on our mock
    });

    it('should handle errors if todoRepository.softDeleteTodo throws an error', async () => {
      const errorMessage = 'Failed to delete todo';
      mockTodoRepository.softDeleteTodo.mockRejectedValue(new Error(errorMessage));

      await expect(deleteTodoUseCase.execute(mockTodoId, mockUserId)).rejects.toThrow(errorMessage);
    });
  });
});