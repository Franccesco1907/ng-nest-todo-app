import { Timestamp } from '@google-cloud/firestore';
import { TodoDocument } from '../../domain/documents/todo.document';
import { TodoModel } from '@modules/todo/domain/models';

export class TodoMapper {
  static toTodoModel(document: TodoDocument): TodoModel {
    return new TodoModel({
      id: document.id,
      title: document.title,
      description: document.description,
      isCompleted: document.isCompleted ?? false,
      createdAt: document.createdAt instanceof Timestamp ? document.createdAt.toDate() : document.createdAt,
      updatedAt: document.updatedAt instanceof Timestamp ? document.updatedAt.toDate() : document.updatedAt,
      deletedAt: document.deletedAt instanceof Timestamp ? document.deletedAt.toDate() : document.deletedAt,
    });
  }

  static toTodoDocument(model: TodoModel): TodoDocument {
    return {
      id: model.id,
      title: model.title,
      description: model.description,
      isCompleted: model.isCompleted ?? false,
      createdAt: model.createdAt ? Timestamp.fromDate(model.createdAt) : null,
      updatedAt: model.updatedAt ? Timestamp.fromDate(model.updatedAt) : null,
      deletedAt: model.deletedAt ? Timestamp.fromDate(model.deletedAt) : null,
    };
  }
}