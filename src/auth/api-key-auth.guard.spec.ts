import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyAuthGuard } from './api-key-auth.guard';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

const mockConfigService = {
  get: jest.fn((key: string) => {
    if (key === 'API_KEY') return 'test-key';
    if (key === 'VALIDATE_APIKEY_IN_DB') return 'false';
    return undefined;
  }),
};

const mockPrismaService = {
  apikey: {
    findFirst: jest.fn().mockResolvedValue({ id: 1, valor: 'test-key', activo: true }),
  },
};

describe('ApiKeyAuthGuard', () => {
  let guard: ApiKeyAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyAuthGuard,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();
    guard = module.get<ApiKeyAuthGuard>(ApiKeyAuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow valid API key from env', async () => {
    const context: any = {
      switchToHttp: () => ({ getRequest: () => ({ headers: { 'x-api-key': 'test-key' } }) }),
    };
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('should throw if API key is missing', async () => {
    const context: any = {
      switchToHttp: () => ({ getRequest: () => ({ headers: {} }) }),
    };
    await expect(guard.canActivate(context)).rejects.toThrow();
  });
});
