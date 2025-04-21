import { BaseDocument } from "@database/firestore";

export class UserDocument extends BaseDocument<UserDocument> {
  static collectionName = "users";

  email: string;
}