import { LoginUseCase } from '@modules/auth/application/use-cases';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginRequest } from '../dto';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let authController: AuthController;
  let loginUseCase: LoginUseCase;

  const mockLoginUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: LoginUseCase,
          useValue: mockLoginUseCase,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    loginUseCase = module.get<LoginUseCase>(LoginUseCase);

    mockLoginUseCase.execute.mockReset();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    const mockEmail = 'test@example.com';
    const mockResponse = { token: 'mockedToken' };

    it('should return a token if the email is valid', async () => {
      const loginRequest: LoginRequest = { email: mockEmail };
      mockLoginUseCase.execute.mockResolvedValue(mockResponse);

      const result = await authController.login(loginRequest);

      expect(result).toEqual(mockResponse);
      expect(loginUseCase.execute).toHaveBeenCalledWith(mockEmail);
      expect(loginUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should handle errors gracefully', async () => {
      const loginRequest: LoginRequest = { email: mockEmail };
      const error = new Error('Login error');
      mockLoginUseCase.execute.mockRejectedValue(error);

      await expect(authController.login(loginRequest)).rejects.toThrow(error);
      expect(loginUseCase.execute).toHaveBeenCalledWith(mockEmail);
      expect(loginUseCase.execute).toHaveBeenCalledTimes(1);
    });
  });
});
