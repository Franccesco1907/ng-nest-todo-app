import { FirestoreBaseRepository } from "@database/firestore";
import { CollectionReference } from "@google-cloud/firestore";
import { UserDocument } from "@modules/auth/domain/documents";
import { UserModel } from "@modules/auth/domain/models";
import { UserRepositoryInterface } from "@modules/auth/domain/repositories";
import { Inject } from "@nestjs/common";
import { UserMapper } from "../mappers";

export class UserRepository implements UserRepositoryInterface {
  private readonly firestoreRepository: FirestoreBaseRepository<UserDocument>;

  constructor(
    @Inject(UserDocument.collectionName)
    protected readonly collection: CollectionReference<UserDocument>,
  ) {
    this.firestoreRepository = new FirestoreBaseRepository(collection);
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const documents = await this.firestoreRepository.find({ email });
    if (documents.length > 0) {
      return UserMapper.toUserModel(documents[0]);
    }

    return null;
  }

  async create(user: Partial<UserModel>): Promise<UserModel> {
    const documentToCreate = UserMapper.toUserDocument(user as UserModel);
    const createdDocument = await this.firestoreRepository.create(documentToCreate);
    return UserMapper.toUserModel(createdDocument);
  }
}