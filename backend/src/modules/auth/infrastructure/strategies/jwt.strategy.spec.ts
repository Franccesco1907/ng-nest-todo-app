import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../repositories';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository: UserRepository;
  const mockUserRepository = {
    findByEmail: jest.fn(),
  };
  const mockConfigService = {
    get: jest.fn().mockReturnValue('mockSecret'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return null if email is not present in the payload', async () => {
      const payload = { id: 'userId' };
      const result = await jwtStrategy.validate(payload);
      expect(result).toBeNull();
    });

    it('should return user if email is found in the payload and user exists', async () => {
      const payload = { email: 'user@example.com', id: 'userId' };
      const user = { email: 'user@example.com', id: 'userId' };
      mockUserRepository.findByEmail.mockResolvedValue(user);

      const result = await jwtStrategy.validate(payload);
      expect(result).toEqual(user);
    });

    it('should return null if user is not found by email', async () => {
      const payload = { email: 'user@example.com', id: 'userId' };
      mockUserRepository.findByEmail.mockResolvedValue(null);

      const result = await jwtStrategy.validate(payload);
      expect(result).toBeNull();
    });
  });
});
