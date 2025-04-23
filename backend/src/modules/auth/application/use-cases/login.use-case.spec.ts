import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '@modules/auth/infrastructure/repositories';
import { LoginUseCase } from './login.use-case';
import { UserDocument } from '@modules/auth/domain/documents';

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let userRepository: UserRepository;
  let jwtService: JwtService;

  const mockUserRepository = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mockedToken'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    loginUseCase = module.get<LoginUseCase>(LoginUseCase);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(loginUseCase).toBeDefined();
  });

  describe('execute', () => {
    const mockEmail = 'test@example.com';
    const mockUserDocument: UserDocument = {
      id: 'someId',
      email: mockEmail,
    } as UserDocument;

    it('should find an existing user by email and return a token', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUserDocument);

      const result = await loginUseCase.execute(mockEmail);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(userRepository.create).not.toHaveBeenCalled();
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUserDocument.email,
        userId: mockUserDocument.id,
      });
      expect(result).toEqual({ token: 'mockedToken' });
    });

    it('should create a new user if one does not exist and return a token', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(mockUserDocument);

      const result = await loginUseCase.execute(mockEmail);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(userRepository.create).toHaveBeenCalledWith({ email: mockEmail });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUserDocument.email,
        userId: mockUserDocument.id,
      });
      expect(result).toEqual({ token: 'mockedToken' });
    });

    it('should handle errors during user retrieval', async () => {
      const errorMessage = 'Database error';
      mockUserRepository.findByEmail.mockRejectedValue(new Error(errorMessage));

      await expect(loginUseCase.execute(mockEmail)).rejects.toThrow(errorMessage);
      expect(userRepository.create).not.toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should handle errors during user creation', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      const errorMessage = 'Creation error';
      mockUserRepository.create.mockRejectedValue(new Error(errorMessage));

      await expect(loginUseCase.execute(mockEmail)).rejects.toThrow(errorMessage);
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });
});