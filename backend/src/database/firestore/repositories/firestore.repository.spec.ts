import { Timestamp } from '@google-cloud/firestore';
import { BadRequestException } from '@nestjs/common';
import { FirestoreBaseRepository } from './firestore.repository';

class MockDocument {
  id = '123';
  name = '';
  createdAt = null;
  updatedAt = null;
  deletedAt = null;
}

const mockCollection = {
  doc: jest.fn(),
  where: jest.fn(),
};

const createMockQuery = (docs: FirebaseFirestore.QueryDocumentSnapshot<MockDocument>[] = []) => ({
  where: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  get: jest.fn().mockResolvedValue({ empty: docs.length === 0, docs }),
});

describe('FirestoreBaseRepository', () => {
  let repo: FirestoreBaseRepository<MockDocument>;

  beforeEach(() => {
    jest.clearAllMocks();
    repo = new FirestoreBaseRepository<MockDocument>(mockCollection as any);
  });

  describe('findOneBy', () => {
    it('should return a document if found and not deleted', async () => {
      const mockDoc: FirebaseFirestore.QueryDocumentSnapshot<MockDocument> = {
        data: () => ({ id: '123', deletedAt: null }) as MockDocument,
      } as any;
      const query = createMockQuery([mockDoc]);
      jest.spyOn(repo as any, 'buildQuery').mockReturnValue(query);

      const result = await repo.findOneBy('123');
      expect(result).toEqual({ id: '123', deletedAt: null });
    });

    it('should return null if document is deleted', async () => {
      const mockDoc: any = {
        data: () => ({ id: '123', deletedAt: Timestamp.now() }) as any,
      };
      const query = createMockQuery([mockDoc]);
      jest.spyOn(repo as any, 'buildQuery').mockReturnValue(query);

      const result = await repo.findOneBy('123');
      expect(result).toBeNull();
    });

    it('should return null if no document is found', async () => {
      const query = createMockQuery([]);
      jest.spyOn(repo as any, 'buildQuery').mockReturnValue(query);

      const result = await repo.findOneBy('123');
      expect(result).toBeNull();
    });
  });

  describe('softDelete', () => {
    it('should throw if document is already deleted', async () => {
      const docRef = { update: jest.fn() };
      const data = { id: '123', deletedAt: Timestamp.now() };
      jest.spyOn(repo as any, 'getExistingDocumentById').mockResolvedValue({ docRef, data });

      await expect(repo.softDelete('123')).rejects.toThrow(BadRequestException);
    });

    it('should soft delete a valid document', async () => {
      const docRef = { update: jest.fn() };
      const data = { id: '123', deletedAt: null };
      jest.spyOn(repo as any, 'getExistingDocumentById').mockResolvedValue({ docRef, data });

      await repo.softDelete('123');
      expect(docRef.update).toHaveBeenCalledWith(expect.objectContaining({ deletedAt: expect.any(Timestamp) }));
    });
  });

  describe('update', () => {
    it('should update only changed fields', async () => {
      const docRef = { update: jest.fn() };
      const currentData = { id: '123', name: 'old', deletedAt: null };
      const updates = { name: 'new' };
      jest.spyOn(repo as any, 'getExistingDocumentById').mockResolvedValue({ docRef, data: currentData });

      const result = await repo.update('123', updates);
      expect(docRef.update).toHaveBeenCalledWith(expect.objectContaining({ name: 'new', updatedAt: expect.any(Timestamp) }));
      expect(result.name).toBe('new');
    });

    it('should not update if values are the same', async () => {
      const docRef = { update: jest.fn() };
      const currentData = { id: '123', name: 'same', deletedAt: null };
      jest.spyOn(repo as any, 'getExistingDocumentById').mockResolvedValue({ docRef, data: currentData });

      const result = await repo.update('123', { name: 'same' });
      expect(docRef.update).not.toHaveBeenCalled();
      expect(result.name).toBe('same');
    });

    it('should throw if document is deleted', async () => {
      const docRef = { update: jest.fn() };
      const data = { id: '123', deletedAt: Timestamp.now() };
      jest.spyOn(repo as any, 'getExistingDocumentById').mockResolvedValue({ docRef, data });

      await expect(repo.update('123', { name: 'new' })).rejects.toThrow(BadRequestException);
    });
  });

  describe('create', () => {
    it('should create a new document with timestamps and ID', async () => {
      const docSetMock = jest.fn();
      mockCollection.doc = jest.fn(() => ({ set: docSetMock }));
      const result = await repo.create({ name: 'test' });

      expect(mockCollection.doc).toHaveBeenCalledWith(expect.any(String));
      expect(docSetMock).toHaveBeenCalledWith(expect.objectContaining({ createdAt: expect.any(Timestamp) }), { merge: true });
      expect(result).toHaveProperty('id');
    });
  });
});
