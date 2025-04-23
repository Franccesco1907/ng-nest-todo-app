import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './auth.guard';

describe('JwtAuthGuard', () => {
  it('should be defined', () => {
    const guard = new JwtAuthGuard();
    expect(guard).toBeDefined();
  });

  it('should extend AuthGuard with "jwt" strategy', () => {
    const guard = new JwtAuthGuard();
    expect(guard instanceof (AuthGuard('jwt') as any)).toBe(true);
  });
});
