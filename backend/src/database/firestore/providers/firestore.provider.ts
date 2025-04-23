import { UserDocument } from '@modules/auth/domain/documents';
import { TodoDocument } from '@modules/todo/domain/documents';

export const FirestoreDatabaseProvider = 'firestoredb';
export const FirestoreOptionsProvider = 'firestoreOptions';
export const FirestoreCollectionProviders: string[] = [TodoDocument.collectionName, UserDocument.collectionName];
