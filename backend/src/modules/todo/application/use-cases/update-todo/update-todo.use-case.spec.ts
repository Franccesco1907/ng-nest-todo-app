import { Test, TestingModule } from '@nestjs/testing';
import { TodoRepository } from '@modules/todo/infrastructure/repositories';
import { UpdateTodoUseCase } from './update-todo.use-case';
import { TodoUpdateRequestBody } from '@modules/todo/infrastructure/dto';
import { TodoModel } from '@modules/todo/domain/models';

describe('UpdateTodoUseCase', () => {
  let updateTodoUseCase: UpdateTodoUseCase;
  let todoRepository: TodoRepository;

  const mockTodoRepository = {
    updateTodo: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateTodoUseCase,
        {
          provide: TodoRepository,
          useValue: mockTodoRepository,
        },
      ],
    }).compile();

    updateTodoUseCase = module.get<UpdateTodoUseCase>(UpdateTodoUseCase);
    todoRepository = module.get<TodoRepository>(TodoRepository);
  });

  it('should be defined', () => {
    expect(updateTodoUseCase).toBeDefined();
  });

  describe('execute', () => {
    const mockTodoId = 'someTodoId';
    const mockUserId = 'someUserId';
    const mockPayload: TodoUpdateRequestBody = {
      title: 'Updated Task',
      isCompleted: true,
      description: 'Updated description',
    };
    const mockUpdatedTodo: TodoModel = {
      id: mockTodoId,
      title: 'Updated Task',
      isCompleted: true,
      userId: mockUserId,
      description: 'Updated description',
      createdAt: new Date(),
    };

    it('should call the todoRepository.updateTodo method with the correct id, userId, and payload', async () => {
      mockTodoRepository.updateTodo.mockResolvedValue(mockUpdatedTodo);
      await updateTodoUseCase.execute(mockTodoId, mockUserId, mockPayload);
      expect(todoRepository.updateTodo).toHaveBeenCalledWith(mockTodoId, mockUserId, mockPayload);
    });

    it('should return the updated todo from the todoRepository', async () => {
      mockTodoRepository.updateTodo.mockResolvedValue(mockUpdatedTodo);
      const result = await updateTodoUseCase.execute(mockTodoId, mockUserId, mockPayload);
      expect(result).toEqual(mockUpdatedTodo);
    });

    it('should return null if the todoRepository returns null', async () => {
      mockTodoRepository.updateTodo.mockResolvedValue(null);
      const result = await updateTodoUseCase.execute(mockTodoId, mockUserId, mockPayload);
      expect(result).toBeNull();
    });

    it('should handle errors if todoRepository.updateTodo throws an error', async () => {
      const errorMessage = 'Failed to update todo';
      mockTodoRepository.updateTodo.mockRejectedValue(new Error(errorMessage));

      await expect(updateTodoUseCase.execute(mockTodoId, mockUserId, mockPayload)).rejects.toThrow(
        errorMessage,
      );
    });
  });
});