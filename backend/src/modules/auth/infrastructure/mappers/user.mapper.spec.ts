import { Timestamp } from '@google-cloud/firestore';
import { UserMapper } from './user.mapper';
import { UserDocument } from '@modules/auth/domain/documents';
import { UserModel } from '@modules/auth/domain/models';

describe('UserMapper', () => {
  describe('toUserModel', () => {
    it('should map UserDocument with Timestamp fields to UserModel with Date fields', () => {
      const now = new Date();
      const document: UserDocument = {
        id: '123',
        email: 'test@example.com',
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
        deletedAt: Timestamp.fromDate(now),
      };

      const model = UserMapper.toUserModel(document);

      expect(model).toBeInstanceOf(UserModel);
      expect(model.id).toBe(document.id);
      expect(model.email).toBe(document.email);
      expect(model.createdAt).toEqual(now);
      expect(model.updatedAt).toEqual(now);
      expect(model.deletedAt).toEqual(now);
    });

    it('should handle already converted Date fields', () => {
      const now = new Date();
      const document: UserDocument = {
        id: '123',
        email: 'test@example.com',
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
        deletedAt: Timestamp.fromDate(now),
      };

      const model = UserMapper.toUserModel(document);

      expect(model.createdAt).toStrictEqual(now);
      expect(model.updatedAt).toStrictEqual(now);
      expect(model.deletedAt).toStrictEqual(now);
    });

    it('should handle null Timestamp fields', () => {
      const document: UserDocument = {
        id: '123',
        email: 'test@example.com',
        createdAt: null,
        updatedAt: null,
        deletedAt: null,
      };

      const model = UserMapper.toUserModel(document);

      expect(model.createdAt).toBeNull();
      expect(model.updatedAt).toBeNull();
      expect(model.deletedAt).toBeNull();
    });

    it('should handle undefined Timestamp fields', () => {
      const document: UserDocument = {
        id: '123',
        email: 'test@example.com',
        createdAt: undefined,
        updatedAt: undefined,
        deletedAt: undefined,
      } as any; // Use 'any' to allow undefined

      const model = UserMapper.toUserModel(document);

      expect(model.createdAt).toBeUndefined();
      expect(model.updatedAt).toBeUndefined();
      expect(model.deletedAt).toBeUndefined();
    });
  });

  describe('toUserDocument', () => {
    it('should map UserModel with Date fields to UserDocument with Timestamps', () => {
      const now = new Date();
      const model = new UserModel({
        id: '123',
        email: 'test@example.com',
        createdAt: now,
        updatedAt: now,
        deletedAt: now,
      });

      const document = UserMapper.toUserDocument(model);

      expect(document.id).toBe(model.id);
      expect(document.email).toBe(model.email);
      expect(document.createdAt).toEqual(Timestamp.fromDate(now));
      expect(document.updatedAt).toEqual(Timestamp.fromDate(now));
      expect(document.deletedAt).toEqual(Timestamp.fromDate(now));
    });

    it('should handle null dates in UserModel', () => {
      const model = new UserModel({
        id: '123',
        email: 'test@example.com',
        createdAt: null,
        updatedAt: null,
        deletedAt: null,
      });

      const document = UserMapper.toUserDocument(model);

      expect(document.createdAt).toBeNull();
      expect(document.updatedAt).toBeNull();
      expect(document.deletedAt).toBeNull();
    });

    it('should handle undefined dates in UserModel', () => {
      const model = new UserModel({
        id: '123',
        email: 'test@example.com',
        createdAt: undefined,
        updatedAt: undefined,
        deletedAt: undefined,
      }) as any; // Use 'any' to allow undefined

      const document = UserMapper.toUserDocument(model);

      expect(document.createdAt).toBeNull(); // undefined will be treated as null
      expect(document.updatedAt).toBeNull(); // undefined will be treated as null
      expect(document.deletedAt).toBeNull(); // undefined will be treated as null
    });
  });
});