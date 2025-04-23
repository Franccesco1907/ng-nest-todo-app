import { FirestoreBaseRepository } from '@database/firestore';
import { CollectionReference } from '@google-cloud/firestore';
import { TodoDocument } from '@modules/todo/domain/documents';
import { TodoModel } from '@modules/todo/domain/models';
import { TodoRepositoryInterface } from '@modules/todo/domain/repositories';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
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

  async getTodoById(id: string, userId: string): Promise<TodoModel | null> {
    const document = await this.firestoreRepository.findOneBy(id, { userId });
    return document ? TodoMapper.toTodoModel(document) : null;
  }

  async findTodos(userId: string, filter: Partial<TodoModel> = {}): Promise<TodoModel[]> {
    const todoFilter = TodoMapper.toTodoDocument({ ...filter, userId } as TodoModel);
    console.log('Todo filter:', todoFilter);
    const documents = await this.firestoreRepository.find(todoFilter);

    return documents.map(TodoMapper.toTodoModel);
  }

  async createTodo(payload: Partial<TodoModel>): Promise<TodoModel> {
    const documentToCreate = TodoMapper.toTodoDocument(payload as TodoModel);
    const createdDocument = await this.firestoreRepository.create(documentToCreate);
    return TodoMapper.toTodoModel(createdDocument);
  }

  async updateTodo(id: string, userId: string, data: Partial<TodoModel>): Promise<TodoModel> {
    const existingDocument = await this.firestoreRepository.findOneBy(id, { userId });

    if (!existingDocument) {
      throw new NotFoundException(`Todo with ID ${id} not found for user ${userId}`);
    }
    const existingTodoModel = TodoMapper.toTodoModel(existingDocument);

    const updatedTodoModel: TodoModel = {
      ...existingTodoModel,
      ...data,
      id,
      userId,
    };

    const updatedTodoDocument = TodoMapper.toTodoDocument(updatedTodoModel);
    const updatedDocumentData = await this.firestoreRepository.update(id, updatedTodoDocument);
    return TodoMapper.toTodoModel(updatedDocumentData);
  }

  async softDeleteTodo(id: string, userId: string): Promise<void> {
    const existingDocument = await this.firestoreRepository.findOneBy(id, { userId });
    if (!existingDocument) {
      throw new NotFoundException(`Todo with ID ${id} not found for user ${userId}`);
    }
    await this.firestoreRepository.softDelete(id);
  }

  async markAsCompleted(ids: string[], userId: string): Promise<void> {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('No IDs provided for marking as completed');
    }
    await Promise.all(
      ids.map(async (id) => {
        const existingDocument = await this.firestoreRepository.findOneBy(id, { userId });
        if (existingDocument && !existingDocument.isCompleted) {
          await this.firestoreRepository.update(id, { isCompleted: true });
        }
      }),
    );
  }
}
