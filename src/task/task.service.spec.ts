import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  task: {
    create: jest.fn().mockResolvedValue({ id: 1, titulo: 'Test', descripcion: '', estado: 'PENDIENTE' }),
    findMany: jest.fn().mockResolvedValue([]),
    findUnique: jest.fn().mockResolvedValue({ id: 1, titulo: 'Test', descripcion: '', estado: 'PENDIENTE' }),
    update: jest.fn().mockResolvedValue({ id: 1, titulo: 'Test', descripcion: '', estado: 'PENDIENTE' }),
    delete: jest.fn().mockResolvedValue({ id: 1 }),
  },
};

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();
    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a task', async () => {
    const dto = { titulo: 'Test', descripcion: '', fechaVencimiento: null };
    const result = await service.create(dto as any);
    expect(result).toHaveProperty('id');
    expect(mockPrismaService.task.create).toHaveBeenCalled();
  });

  it('should find all tasks', async () => {
    const result = await service.findAll();
    expect(Array.isArray(result)).toBe(true);
    expect(mockPrismaService.task.findMany).toHaveBeenCalled();
  });

  it('should find one task by ID', async () => {
    const result = await service.findOneByID(1);
    expect(result).toHaveProperty('id', 1);
    expect(mockPrismaService.task.findUnique).toHaveBeenCalled();
  });
});
