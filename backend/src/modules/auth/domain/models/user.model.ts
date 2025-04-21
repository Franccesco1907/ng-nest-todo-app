export class UserModel {
  id: string;
  email: string;
  createdAt: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;

  constructor(data: Partial<UserModel>) {
    Object.assign(this, data);
  }
}