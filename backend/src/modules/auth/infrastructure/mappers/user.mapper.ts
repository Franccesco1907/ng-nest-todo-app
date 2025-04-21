import { Timestamp } from "@google-cloud/firestore";
import { UserDocument } from "@modules/auth/domain/documents";
import { UserModel } from "@modules/auth/domain/models";

export class UserMapper {
  static toUserModel(document: UserDocument): UserModel {
    return new UserModel({
      id: document.id,
      email: document.email,
      createdAt: document.createdAt instanceof Timestamp ? document.createdAt.toDate() : document.createdAt,
      updatedAt: document.updatedAt instanceof Timestamp ? document.updatedAt.toDate() : document.updatedAt,
      deletedAt: document.deletedAt instanceof Timestamp ? document.deletedAt.toDate() : document.deletedAt,
    });
  }

  static toUserDocument(model: UserModel): UserDocument {
    return {
      id: model.id,
      email: model.email,
      createdAt: model.createdAt ? Timestamp.fromDate(model.createdAt) : null,
      updatedAt: model.updatedAt ? Timestamp.fromDate(model.updatedAt) : null,
      deletedAt: model.deletedAt ? Timestamp.fromDate(model.deletedAt) : null,
    };
  }
}