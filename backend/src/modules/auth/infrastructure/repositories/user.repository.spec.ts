import { UserRepository } from './user.repository';
import { FirestoreBaseRepository } from '@database/firestore';
import { UserDocument } from '@modules/auth/domain/documents';
import { UserModel } from '@modules/auth/domain/models';
import { UserMapper } from '../mappers';
import { CollectionReference } from '@google-cloud/firestore';

jest.mock('@database/firestore', () => {
  const original = jest.requireActual('@database/firestore');
  return {
    ...original,
    FirestoreBaseRepository: jest.fn(),
  };
});
jest.mock('../mappers');

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let firestoreRepositoryMock: jest.Mocked<FirestoreBaseRepository<UserDocument>>;

  const mockCollection = {} as CollectionReference<UserDocument>;

  beforeEach(() => {
    firestoreRepositoryMock = {
      find: jest.fn(),
      create: jest.fn(),
    } as any;

    (FirestoreBaseRepository as jest.Mock).mockImplementation(() => firestoreRepositoryMock);

    userRepository = new UserRepository(mockCollection);
  });

  describe('findByEmail', () => {
    it('should return a user model if found', async () => {
      const mockDoc: UserDocument = { id: '1', email: 'test@example.com', createdAt: null, updatedAt: null, deletedAt: null };
      const expectedModel: UserModel = { id: '1', email: 'test@example.com' } as UserModel;

      firestoreRepositoryMock.find.mockResolvedValue([mockDoc]);
      (UserMapper.toUserModel as jest.Mock).mockReturnValue(expectedModel);

      const result = await userRepository.findByEmail('test@example.com');

      expect(firestoreRepositoryMock.find).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(UserMapper.toUserModel).toHaveBeenCalledWith(mockDoc);
      expect(result).toEqual(expectedModel);
    });

    it('should return null if no user found', async () => {
      firestoreRepositoryMock.find.mockResolvedValue([]);

      const result = await userRepository.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new user and return model', async () => {
      const userModel: UserModel = { id: '1', email: 'create@example.com' } as UserModel;
      const userDoc: UserDocument = { id: '1', email: 'create@example.com', createdAt: null, updatedAt: null, deletedAt: null };
      const createdDoc = { ...userDoc };

      (UserMapper.toUserDocument as jest.Mock).mockReturnValue(userDoc);
      firestoreRepositoryMock.create.mockResolvedValue(createdDoc);
      (UserMapper.toUserModel as jest.Mock).mockReturnValue(userModel);

      const result = await userRepository.create(userModel);

      expect(UserMapper.toUserDocument).toHaveBeenCalledWith(userModel);
      expect(firestoreRepositoryMock.create).toHaveBeenCalledWith(userDoc);
      expect(UserMapper.toUserModel).toHaveBeenCalledWith(createdDoc);
      expect(result).toEqual(userModel);
    });
  });
});
