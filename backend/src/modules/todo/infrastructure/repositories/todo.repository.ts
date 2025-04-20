import { FirestoreBaseRepository } from '@database/firestore';
import { CollectionReference } from '@google-cloud/firestore';
import { TodoDocument } from '@modules/todo/domain/documents';
import { TodoModel } from '@modules/todo/domain/models';
import { TodoRepositoryInterface } from '@modules/todo/domain/repositories';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TodoMapper } from '../mappers';

@Injectable()
export class TodoRepository implements TodoRepositoryInterface {
  private readonly firestoreRepository: FirestoreBaseRepository<TodoDocument>;

  constructor(
    @Inject(TodoDocument.collectionName)
    protected readonly collection: CollectionReference<TodoDocument>,
  ) {
    this.firestoreRepository = new FirestoreBaseRepository(collection);
  }

  async getTodoById(id: string): Promise<TodoModel | null> {
    const document = await this.firestoreRepository.getDataByDocumentId(id);
    return document ? TodoMapper.toTodoModel(document) : null;
  }

  async findTodos(filter: Partial<TodoModel> = {}): Promise<TodoModel[]> {
    const firestoreFilter: Partial<TodoDocument> = {};
    if (filter) {
      for (const key in filter) {
        const value = filter[key];
        if (value !== undefined) {
          firestoreFilter[key] = value;
        }
      }
    }
    const documents = await this.firestoreRepository.find(firestoreFilter);
    return documents.map(TodoMapper.toTodoModel);
  }

  async createTodo(payload: Partial<TodoModel>): Promise<TodoModel> {
    const documentToCreate = TodoMapper.toTodoDocument(payload as TodoModel);
    const createdDocument = await this.firestoreRepository.create(documentToCreate);
    return TodoMapper.toTodoModel(createdDocument);
  }

  async updateTodo(id: string, data: Partial<TodoModel>): Promise<TodoModel> {
    const existingDocument = await this.firestoreRepository.getDataByDocumentId(id);

    if (!existingDocument) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    const existingTodoModel = TodoMapper.toTodoModel(existingDocument);

    const updatedTodoModel: TodoModel = {
      ...existingTodoModel,
      ...data,
      id: id,
    };

    const updatedTodoDocument = TodoMapper.toTodoDocument(updatedTodoModel);
    const updatedDocumentData = await this.firestoreRepository.update(id, updatedTodoDocument);
    return TodoMapper.toTodoModel(updatedDocumentData);
  }

  async softDeleteTodo(id: string): Promise<void> {
    await this.firestoreRepository.softDelete(id);
  }
}
