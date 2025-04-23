import {
  CreateTodoUseCase,
  DeleteTodoUseCase,
  GetAllTodoUseCase,
  GetTodoUseCase,
  MarkTodosAsCompleteUseCase,
  UpdateTodoUseCase,
} from '@modules/todo/application/use-cases';
import { TodoModel } from '@modules/todo/domain/models';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MarkTodosAsCompletedRequestBody, TodoCreateRequestBody, TodoFilter, TodoUpdateRequestBody } from '../dto';
import { TodoController } from './todo.controller';

const mockCreateTodoUseCase = { execute: jest.fn() };
const mockGetAllTodoUseCase = { execute: jest.fn() };
const mockGetTodoUseCase = { execute: jest.fn() };
const mockUpdateTodoUseCase = { execute: jest.fn() };
const mockDeleteTodoUseCase = { execute: jest.fn() };
const mockMarkTodosAsCompleteUseCase = { execute: jest.fn() };

describe('TodoController', () => {
  let controller: TodoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        { provide: CreateTodoUseCase, useValue: mockCreateTodoUseCase },
        { provide: GetAllTodoUseCase, useValue: mockGetAllTodoUseCase },
        { provide: GetTodoUseCase, useValue: mockGetTodoUseCase },
        { provide: UpdateTodoUseCase, useValue: mockUpdateTodoUseCase },
        { provide: DeleteTodoUseCase, useValue: mockDeleteTodoUseCase },
        { provide: MarkTodosAsCompleteUseCase, useValue: mockMarkTodosAsCompleteUseCase },
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    const mockUserId = 'someUserId';
    const mockQuery: TodoFilter = { isCompleted: true };
    const mockTodos: TodoModel[] = [{ id: '1', title: 'Todo 1', isCompleted: true, userId: mockUserId }] as TodoModel[];

    it('should call getAllTodoUseCase.execute with userId and query', async () => {
      mockGetAllTodoUseCase.execute.mockResolvedValue(mockTodos);
      await controller.getAll(mockUserId, mockQuery);
      expect(mockGetAllTodoUseCase.execute).toHaveBeenCalledWith(mockUserId, mockQuery);
    });

    it('should return the result of getAllTodoUseCase.execute', async () => {
      mockGetAllTodoUseCase.execute.mockResolvedValue(mockTodos);
      const result = await controller.getAll(mockUserId, mockQuery);
      expect(result).toEqual(mockTodos);
    });
  });

  describe('get', () => {
    const mockId = 'someId';
    const mockUserId = 'someUserId';
    const mockTodo: TodoModel = { id: mockId, title: 'Test Todo', isCompleted: false, userId: mockUserId } as TodoModel;

    it('should call getTodoUseCase.execute with id and userId', async () => {
      mockGetTodoUseCase.execute.mockResolvedValue(mockTodo);
      await controller.get(mockId, mockUserId);
      expect(mockGetTodoUseCase.execute).toHaveBeenCalledWith(mockId, mockUserId);
    });

    it('should return the result of getTodoUseCase.execute if found', async () => {
      mockGetTodoUseCase.execute.mockResolvedValue(mockTodo);
      const result = await controller.get(mockId, mockUserId);
      expect(result).toEqual(mockTodo);
    });

    it('should throw NotFoundException if getTodoUseCase.execute returns null', async () => {
      mockGetTodoUseCase.execute.mockResolvedValue(null);
      await expect(controller.get(mockId, mockUserId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const mockUserId = 'someUserId';
    const mockBody: TodoCreateRequestBody = { title: 'New Todo', isCompleted: false, description: 'New Todo Description' };
    const mockCreatedTodo: TodoModel = { id: 'newId', title: 'New Todo', isCompleted: false, userId: mockUserId } as TodoModel;

    it('should call createTodoUseCase.execute with userId and body', async () => {
      mockCreateTodoUseCase.execute.mockResolvedValue(mockCreatedTodo);
      await controller.create(mockUserId, mockBody);
      expect(mockCreateTodoUseCase.execute).toHaveBeenCalledWith(mockUserId, mockBody);
    });

    it('should return the result of createTodoUseCase.execute', async () => {
      mockCreateTodoUseCase.execute.mockResolvedValue(mockCreatedTodo);
      const result = await controller.create(mockUserId, mockBody);
      expect(result).toEqual(mockCreatedTodo);
    });
  });

  describe('markAsCompleteMany', () => {
    const mockUserId = 'someUserId';
    const mockBody: MarkTodosAsCompletedRequestBody = { ids: ['id1', 'id2'] };
    const expectedResponse = { message: 'Todos marked as completed successfully' };

    it('should call markTodosAsCompleteUseCase.execute with body.ids and userId', async () => {
      mockMarkTodosAsCompleteUseCase.execute.mockResolvedValue(undefined);
      await controller.markAsCompleteMany(mockUserId, mockBody);
      expect(mockMarkTodosAsCompleteUseCase.execute).toHaveBeenCalledWith(mockBody.ids, mockUserId);
    });

    it('should return the success message', async () => {
      mockMarkTodosAsCompleteUseCase.execute.mockResolvedValue(undefined);
      const result = await controller.markAsCompleteMany(mockUserId, mockBody);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('update', () => {
    const mockId = 'someId';
    const mockUserId = 'someUserId';
    const mockBody: TodoUpdateRequestBody = { title: 'Updated Todo', isCompleted: true, description: 'Updated description' };
    const mockUpdatedTodo: TodoModel = { id: mockId, title: 'Updated Todo', isCompleted: true, userId: mockUserId } as TodoModel;

    it('should call updateTodoUseCase.execute with id, userId, and body', async () => {
      mockUpdateTodoUseCase.execute.mockResolvedValue(mockUpdatedTodo);
      await controller.update(mockId, mockUserId, mockBody);
      expect(mockUpdateTodoUseCase.execute).toHaveBeenCalledWith(mockId, mockUserId, mockBody);
    });

    it('should return the result of updateTodoUseCase.execute if found', async () => {
      mockUpdateTodoUseCase.execute.mockResolvedValue(mockUpdatedTodo);
      const result = await controller.update(mockId, mockUserId, mockBody);
      expect(result).toEqual(mockUpdatedTodo);
    });

    it('should throw NotFoundException if updateTodoUseCase.execute returns null', async () => {
      mockUpdateTodoUseCase.execute.mockResolvedValue(null);
      await expect(controller.update(mockId, mockUserId, mockBody)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    const mockId = 'someId';
    const mockUserId = 'someUserId';
    const expectedResponse = { message: `Todo with id = ${mockId} deleted sucessfully` };

    it('should call deleteTodoUseCase.execute with id and userId', async () => {
      mockDeleteTodoUseCase.execute.mockResolvedValue(undefined);
      await controller.delete(mockId, mockUserId);
      expect(mockDeleteTodoUseCase.execute).toHaveBeenCalledWith(mockId, mockUserId);
    });

    it('should return the success message', async () => {
      mockDeleteTodoUseCase.execute.mockResolvedValue(undefined);
      const result = await controller.delete(mockId, mockUserId);
      expect(result).toEqual(expectedResponse);
    });
  });
});