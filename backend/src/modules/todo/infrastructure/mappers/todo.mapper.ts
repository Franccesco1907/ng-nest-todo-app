import { Timestamp } from '@google-cloud/firestore';
import { TodoDocument } from '../../domain/documents/todo.document';
import { TodoModel } from '@modules/todo/domain/models';

export class TodoMapper {
  static toTodoModel(document: TodoDocument): TodoModel {
    return new TodoModel({
      id: document.id,
      userId: document.userId,
      title: document.title,
      description: document.description,
      isCompleted: document.isCompleted,
      createdAt: document.createdAt instanceof Timestamp ? document.createdAt.toDate() : document.createdAt,
      updatedAt: document.updatedAt instanceof Timestamp ? document.updatedAt.toDate() : document.updatedAt,
      deletedAt: document.deletedAt instanceof Timestamp ? document.deletedAt.toDate() : document.deletedAt,
    });
  }

  static toTodoDocument(model: TodoModel): TodoDocument {
    return {
      id: model.id,
      userId: model.userId,
      title: model.title,
      description: model.description,
      isCompleted: model.isCompleted,
      createdAt: model.createdAt ? Timestamp.fromDate(model.createdAt) : null,
      updatedAt: model.updatedAt ? Timestamp.fromDate(model.updatedAt) : null,
      deletedAt: model.deletedAt ? Timestamp.fromDate(model.deletedAt) : null,
    };
  }
}