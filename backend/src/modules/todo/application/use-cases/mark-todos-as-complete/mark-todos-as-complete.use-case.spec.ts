import { TodoRepository } from '@modules/todo/infrastructure/repositories';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MarkTodosAsCompleteUseCase } from './mark-todos-as-complete.use-case';

describe('MarkTodosAsCompleteUseCase', () => {
  let markTodosAsCompleteUseCase: MarkTodosAsCompleteUseCase;
  let todoRepository: TodoRepository;

  const mockTodoRepository = {
    markAsCompleted: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarkTodosAsCompleteUseCase,
        {
          provide: TodoRepository,
          useValue: mockTodoRepository,
        },
      ],
    }).compile();

    markTodosAsCompleteUseCase = module.get<MarkTodosAsCompleteUseCase>(MarkTodosAsCompleteUseCase);
    todoRepository = module.get<TodoRepository>(TodoRepository);
  });

  it('should be defined', () => {
    expect(markTodosAsCompleteUseCase).toBeDefined();
  });

  describe('execute', () => {
    const mockUserId = 'someUserId';
    const mockIds = ['todoId1', 'todoId2'];

    it('should call markAsCompleted with correct parameters', async () => {
      await markTodosAsCompleteUseCase.execute(mockIds, mockUserId);
      expect(todoRepository.markAsCompleted).toHaveBeenCalledWith(mockIds, mockUserId);
    });

    it('should call markAsCompleted even if no ids are provided (as per the current repository logic)', async () => {
      const emptyIds: string[] = [];
      await markTodosAsCompleteUseCase.execute(emptyIds, mockUserId);
      expect(todoRepository.markAsCompleted).toHaveBeenCalledWith(emptyIds, mockUserId);
    });

    it('should handle BadRequestException if the repository throws it for empty IDs', async () => {
      const emptyIds: string[] = [];
      mockTodoRepository.markAsCompleted.mockRejectedValue(new BadRequestException('No IDs provided for marking as completed'));

      await expect(markTodosAsCompleteUseCase.execute(emptyIds, mockUserId)).rejects.toThrow(BadRequestException);
      expect(todoRepository.markAsCompleted).toHaveBeenCalledWith(emptyIds, mockUserId);
    });
  });
});