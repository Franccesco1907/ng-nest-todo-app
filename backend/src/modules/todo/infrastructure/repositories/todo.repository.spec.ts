import { FirestoreBaseRepository } from '@database/firestore';
import { CollectionReference, Query } from '@google-cloud/firestore';
import { TodoDocument } from '@modules/todo/domain/documents';
import { TodoModel } from '@modules/todo/domain/models';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TodoMapper } from '../mappers';
import { TodoRepository } from './todo.repository';

describe('TodoRepository', () => {
  let todoRepository: TodoRepository;
  let firestoreBaseRepository: FirestoreBaseRepository<TodoDocument>;
  let mockCollection: CollectionReference<TodoDocument>;
  let mockQuery: Query<TodoDocument>;

  const mockTodo = { id: '1', userId: 'user1', title: 'Test Todo', isCompleted: false, description: 'Test Description', createdAt: new Date(), updatedAt: null, deletedAt: null } as TodoModel;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockQuery = {
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({
        docs: [{ data: jest.fn().mockReturnValue(mockTodo) }],
      }),
    } as any;

    mockCollection = {
      where: jest.fn().mockReturnValue(mockQuery),
      get: jest.fn().mockResolvedValue({
        docs: [{ data: jest.fn().mockReturnValue(mockTodo) }],
      }),
      doc: jest.fn().mockReturnValue({
        set: jest.fn().mockResolvedValue(undefined),
        get: jest.fn().mockResolvedValue({
          exists: true,
          data: jest.fn().mockReturnValue(mockTodo),
        }),
        update: jest.fn().mockResolvedValue(mockTodo),
      }),
    } as any;

    const mockFirestoreBaseRepository = {
      findOneBy: jest.fn().mockResolvedValue(mockTodo),
      find: jest.fn().mockResolvedValue([mockTodo]),
      create: jest.fn().mockResolvedValue(mockTodo),
      update: jest.fn().mockResolvedValue(mockTodo),
      softDelete: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoRepository,
        {
          provide: FirestoreBaseRepository,
          useValue: mockFirestoreBaseRepository,
        },
        {
          provide: TodoDocument.collectionName,
          useValue: mockCollection,
        },
      ],
    }).compile();

    todoRepository = module.get<TodoRepository>(TodoRepository);
    firestoreBaseRepository = module.get<FirestoreBaseRepository<TodoDocument>>(
      FirestoreBaseRepository,
    );
  });

  it('should be defined', () => {
    expect(todoRepository).toBeDefined();
  });

  describe('getTodoById', () => {
    it('should return a todo if found', async () => {
      const todo = await todoRepository.getTodoById('1', 'user1');
      expect(todo).toEqual(mockTodo);
    });
  });

  describe('findTodos', () => {
    it('should return a list of todos for a user', async () => {
      const todos = await todoRepository.findTodos('user1');
      expect(todos).toEqual([mockTodo]);
    });
  });

  describe('updateTodo', () => {
    it('should update and return a todo', async () => {
      const updatedTodo = await todoRepository.updateTodo('1', 'user1', {
        title: 'Updated Todo',
      });
      expect(updatedTodo.title).toEqual('Updated Todo');
    });
  });

  describe('markAsCompleted', () => {

    it('should throw BadRequestException if no ids are provided', async () => {
      await expect(todoRepository.markAsCompleted([], 'user1')).rejects.toThrowError(BadRequestException);
    });

    it('should not mark already completed todos again', async () => {
      const completedTodo = { ...mockTodo, isCompleted: true };
      jest.spyOn(firestoreBaseRepository, 'findOneBy').mockResolvedValueOnce(TodoMapper.toTodoDocument(completedTodo));
      await todoRepository.markAsCompleted(['1'], 'user1');
      expect(firestoreBaseRepository.update).not.toHaveBeenCalled();
    });


    it('should skip marking todos that do not exist', async () => {
      jest.spyOn(firestoreBaseRepository, 'findOneBy').mockResolvedValueOnce(null);
      await todoRepository.markAsCompleted(['nonexistent-id'], 'user1');
      expect(firestoreBaseRepository.update).not.toHaveBeenCalled();
    });
  });
});
