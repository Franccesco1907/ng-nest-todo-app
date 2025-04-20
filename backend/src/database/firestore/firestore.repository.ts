import { getUniqueId } from '@common/utils';
import { CollectionReference, Query, Timestamp } from '@google-cloud/firestore';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BaseDocument } from './';

export class FirestoreBaseRepository<T extends BaseDocument<T>> {
  constructor(protected readonly collection: CollectionReference<T>) { }

  async getDataByDocumentId(id: string): Promise<T | null> {
    const snapshot = await this.collection.doc(id).get();

    if (!snapshot.exists) return null;

    const data = snapshot.data()!;
    if (data.deletedAt) return null;

    return data;
  }

  protected buildQuery(filter: Partial<T>): Query<T> {
    let query: Query<T> = this.collection;

    query = query.where('deletedAt', '==', null) as Query<T>;

    console.log('Filter:', filter, query);

    for (const key in filter) {
      const value = filter[key];
      if (value !== undefined) {
        query = query.where(key, '==', value) as Query<T>;
      }
    }

    return query;
  }

  async find(filter: Partial<T> = {}): Promise<T[]> {
    console.log('Filter:', filter);
    const query = this.buildQuery(filter);
    const snapshot = await query.get();

    return snapshot.docs.map((doc) => doc.data());
  }

  async create(payload: Partial<T>): Promise<T> {
    if (!payload.id) {
      payload.id = getUniqueId();
    }
    payload.createdAt = Timestamp.now();
    payload.updatedAt = null;
    payload.deletedAt = null;

    const document = this.collection.doc(payload.id);
    await document.set({ ...payload }, { merge: true });
    return payload as T;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const { docRef, data: currentData } = await this.getExistingDocumentById(id);
    if (currentData.deletedAt) {
      throw new BadRequestException('Cannot update a deleted document');
    }

    const updates: Partial<T> = {};

    for (const key of Object.keys(data)) {
      const newValue = data[key];
      const currentValue = currentData[key];

      if (newValue !== currentValue) {
        updates[key] = newValue;
      }
    }
    if (Object.keys(updates).length > 0) {
      updates.updatedAt = Timestamp.now();
      await docRef.update(updates);
    }

    return { ...currentData, ...updates, id } as T;
  }

  async softDelete(id: string): Promise<void> {
    const { docRef, data } = await this.getExistingDocumentById(id);
    this.validateNotDeleted(data);

    await docRef.update({
      deletedAt: Timestamp.now(),
    } as Partial<T>);
  }

  private validateNotDeleted(doc: T): void {
    if (doc.deletedAt) {
      throw new BadRequestException('Cannot operate on a deleted document');
    }
  }

  protected async getExistingDocumentById(
    id: string,
  ): Promise<{ docRef: FirebaseFirestore.DocumentReference<T>; data: T }> {
    const docRef = this.collection.doc(id);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }

    const data = snapshot.data()!;
    return { docRef, data };
  }
}
