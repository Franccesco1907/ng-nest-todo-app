describe('Environment Utils', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('should return true for development environment', () => {
    process.env.NODE_ENV = 'development';
    const envUtils = require('./env');
    expect(envUtils.isDevelop).toBe(true);
    expect(envUtils.isProduction).toBe(false);
    expect(envUtils.getEnvFile()).toBe('.env.dev');
  });

  it('should return true for production environment', () => {
    process.env.NODE_ENV = 'production';
    const envUtils = require('./env');
    expect(envUtils.isProduction).toBe(true);
    expect(envUtils.isDevelop).toBe(false);
    expect(envUtils.getEnvFile()).toBe('.env');
  });

  it('should return .env as default if not development', () => {
    process.env.NODE_ENV = 'test';
    const envUtils = require('./env');
    expect(envUtils.getEnvFile()).toBe('.env');
  });
});
