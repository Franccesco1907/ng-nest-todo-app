import { ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { UserPayload } from '../interfaces';
import { getUserFactory } from './get-user.decorator';

describe('GetUser Factory', () => {
  let mockExecutionContext: ExecutionContext;
  const mockUserPayload: UserPayload = {
    id: 'someId',
    email: 'test@example.com',
  };

  beforeEach(() => {
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: mockUserPayload,
        }),
      }),
      getType: jest.fn().mockReturnValue('http'),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
  });

  it('should return the full user payload if no data key is provided', () => {
    const result = getUserFactory(undefined, mockExecutionContext);
    expect(result).toEqual(mockUserPayload);
  });

  it('should return a specific property of the user payload if a data key is provided', () => {
    const result = getUserFactory('email', mockExecutionContext);
    expect(result).toEqual(mockUserPayload.email);
  });

  it('should throw InternalServerErrorException if user is not found in the request', () => {
    const mockExecutionContextWithoutUser = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({}),
      }),
      getType: jest.fn().mockReturnValue('http'),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;

    expect(() => getUserFactory(undefined, mockExecutionContextWithoutUser)).toThrow(
      InternalServerErrorException,
    );
    expect(() => getUserFactory('email', mockExecutionContextWithoutUser)).toThrow(
      InternalServerErrorException,
    );
  });
});