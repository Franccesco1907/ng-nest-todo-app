import { Timestamp } from '@google-cloud/firestore';
import { TodoModel } from '@modules/todo/domain/models';
import { TodoDocument } from '../../domain/documents/todo.document';
import { TodoMapper } from './todo.mapper';

describe('TodoMapper', () => {
  const mockTimestampSeconds = 1620298372;
  const mockTimestampMilliseconds = mockTimestampSeconds * 1000;
  const anotherMockTimestampMilliseconds = 1654789012000;

  describe('toTodoModel', () => {
    it('should map TodoDocument with Timestamp fields to TodoModel with Date fields', () => {
      const now = new Date();
      const mockTodoDocument: TodoDocument = {
        id: '123',
        userId: 'user_1',
        title: 'Test Todo',
        description: 'Test description',
        isCompleted: true,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
        deletedAt: Timestamp.fromDate(now),
      };

      const todoModel = TodoMapper.toTodoModel(mockTodoDocument);

      expect(todoModel).toBeInstanceOf(TodoModel);
      expect(todoModel.id).toBe(mockTodoDocument.id);
      expect(todoModel.userId).toBe(mockTodoDocument.userId);
      expect(todoModel.title).toBe(mockTodoDocument.title);
      expect(todoModel.description).toBe(mockTodoDocument.description);
      expect(todoModel.isCompleted).toBe(mockTodoDocument.isCompleted);
      expect(todoModel.createdAt).toEqual(now);
      expect(todoModel.updatedAt).toEqual(now);
      expect(todoModel.deletedAt).toEqual(now);
    });

    it('should handle null Timestamp fields', () => {
      const mockTodoDocument: TodoDocument = {
        id: '123',
        userId: 'user_1',
        title: 'Test Todo',
        description: 'Test description',
        isCompleted: true,
        createdAt: new Timestamp(mockTimestampSeconds, 0),
        updatedAt: new Timestamp(mockTimestampSeconds, 0),
        deletedAt: null,
      };

      const todoModel = TodoMapper.toTodoModel(mockTodoDocument);

      expect(todoModel.deletedAt).toBeNull();
    });

    it('should handle undefined Timestamp fields', () => {
      const mockTodoDocument: TodoDocument = {
        id: '123',
        userId: 'user_1',
        title: 'Test Todo',
        description: 'Test description',
        isCompleted: true,
        createdAt: new Timestamp(mockTimestampSeconds, 0),
        updatedAt: new Timestamp(mockTimestampSeconds, 0),
        deletedAt: undefined,
      } as any;

      const todoModel = TodoMapper.toTodoModel(mockTodoDocument);

      expect(todoModel.deletedAt).toBeUndefined();
    });

    it('should handle Date fields directly', () => {
      const now = new Date();
      const mockTodoDocument: TodoDocument = {
        id: '123',
        userId: 'user_1',
        title: 'Test Todo',
        description: 'Test description',
        isCompleted: true,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
        deletedAt: Timestamp.fromDate(now),
      };

      const todoModel = TodoMapper.toTodoModel(mockTodoDocument);

      expect(todoModel.createdAt).toEqual(now);
      expect(todoModel.updatedAt).toEqual(now);
      expect(todoModel.deletedAt).toEqual(now);
    });
  });

  describe('toTodoDocument', () => {
    it('should map UserModel with Date fields to TodoDocument with Timestamps', () => {
      const now = new Date();
      const mockTodoModel: TodoModel = new TodoModel({
        id: '123',
        userId: 'user_1',
        title: 'Test Todo',
        description: 'Test description',
        isCompleted: true,
        createdAt: now,
        updatedAt: now,
        deletedAt: now,
      });

      const todoDocument = TodoMapper.toTodoDocument(mockTodoModel);

      expect(todoDocument.id).toBe(mockTodoModel.id);
      expect(todoDocument.userId).toBe(mockTodoModel.userId);
      expect(todoDocument.title).toBe(mockTodoModel.title);
      expect(todoDocument.description).toBe(mockTodoModel.description);
      expect(todoDocument.isCompleted).toBe(mockTodoModel.isCompleted);
      expect(todoDocument.createdAt).toEqual(Timestamp.fromDate(mockTodoModel.createdAt!));
      expect(todoDocument.updatedAt).toEqual(Timestamp.fromDate(mockTodoModel.updatedAt!));
      expect(todoDocument.deletedAt).toEqual(Timestamp.fromDate(mockTodoModel.deletedAt!));
    });

    it('should map null values for dates correctly', () => {
      const mockTodoModel: TodoModel = new TodoModel({
        id: '123',
        userId: 'user_1',
        title: 'Test Todo',
        description: 'Test description',
        isCompleted: true,
        createdAt: new Date(mockTimestampMilliseconds),
        updatedAt: null,
        deletedAt: null,
      });

      const todoDocument = TodoMapper.toTodoDocument(mockTodoModel);

      expect(todoDocument.updatedAt).toBeNull();
      expect(todoDocument.deletedAt).toBeNull();
    });

    it('should handle null deletedAt in UserModel', () => {
      const mockTodoModel: TodoModel = new TodoModel({
        id: '123',
        userId: 'user_1',
        title: 'Test Todo',
        description: 'Test description',
        isCompleted: true,
        createdAt: new Date(mockTimestampMilliseconds),
        updatedAt: new Date(mockTimestampMilliseconds),
        deletedAt: null,
      });

      const todoDocument = TodoMapper.toTodoDocument(mockTodoModel);

      expect(todoDocument.deletedAt).toBeNull();
    });

    it('should handle undefined deletedAt in UserModel', () => {
      const mockTodoModel: TodoModel = new TodoModel({
        id: '123',
        userId: 'user_1',
        title: 'Test Todo',
        description: 'Test description',
        isCompleted: true,
        createdAt: new Date(mockTimestampMilliseconds),
        updatedAt: new Date(mockTimestampMilliseconds),
        deletedAt: undefined,
      }) as any;

      const todoDocument = TodoMapper.toTodoDocument(mockTodoModel);

      expect(todoDocument.deletedAt).toBeNull();
    });

    it('should use a different mock timestamp value', () => {
      const mockTodoModel: TodoModel = new TodoModel({
        id: '456',
        userId: 'user_2',
        title: 'Another Todo',
        description: 'Another description',
        isCompleted: false,
        createdAt: new Date(anotherMockTimestampMilliseconds),
        updatedAt: new Date(anotherMockTimestampMilliseconds),
        deletedAt: new Date(anotherMockTimestampMilliseconds),
      });

      const todoDocument = TodoMapper.toTodoDocument(mockTodoModel);

      expect(todoDocument.createdAt).toEqual(Timestamp.fromDate(new Date(anotherMockTimestampMilliseconds)));
      expect(todoDocument.updatedAt).toEqual(Timestamp.fromDate(new Date(anotherMockTimestampMilliseconds)));
      expect(todoDocument.deletedAt).toEqual(Timestamp.fromDate(new Date(anotherMockTimestampMilliseconds)));
    });
  });
});