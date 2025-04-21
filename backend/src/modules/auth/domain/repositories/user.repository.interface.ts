import { UserModel } from "../models";

export interface UserRepositoryInterface {
  findByEmail(email: string): Promise<UserModel | null>;
  create(user: Partial<UserModel>): Promise<UserModel>;
}
