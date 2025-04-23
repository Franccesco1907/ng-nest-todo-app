import { Timestamp } from '@google-cloud/firestore';
import { BaseDocument } from './base.document';

class TestDocument extends BaseDocument<TestDocument> {
  name?: string;

  constructor(partial: Partial<TestDocument>) {
    super(partial);
    this.name = partial.name;
  }
}

describe('BaseDocument', () => {
  it('should assign properties from partial entity', () => {
    const now = Timestamp.now();
    const input = {
      id: 'abc123',
      name: 'Test Name',
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    const doc = new TestDocument(input);

    expect(doc.id).toBe('abc123');
    expect(doc.name).toBe('Test Name');
    expect(doc.createdAt).toBe(now);
    expect(doc.updatedAt).toBe(now);
    expect(doc.deletedAt).toBeNull();
  });

  it('should assign undefined if field is not passed', () => {
    const doc = new TestDocument({ id: 'xyz789' });

    expect(doc.id).toBe('xyz789');
    expect(doc.createdAt).toBeUndefined();
    expect(doc.updatedAt).toBeUndefined();
    expect(doc.deletedAt).toBeUndefined();
  });
});
