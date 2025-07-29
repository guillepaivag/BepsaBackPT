import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, Prisma, TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const taskData: Prisma.TaskCreateInput = {
      titulo: createTaskDto.titulo,
      descripcion: createTaskDto.descripcion,
      fechaVencimiento: createTaskDto.fechaVencimiento 
        ? new Date(createTaskDto.fechaVencimiento) 
        : null,
    };

    return this.prisma.task.create({ data: taskData });
  }

  async findAll(filters?: FilterTaskDto): Promise<Task[]> {
    const where: Prisma.TaskWhereInput = {};

    // Filtro por estado
    if (filters?.estado) {
      where.estado = filters.estado;
    }

    // Filtro por rango de fechas (fecha de creación)
    if (filters?.fechaDesde || filters?.fechaHasta) {
      where.fechaCreacion = {};
      if (filters.fechaDesde) {
        where.fechaCreacion.gte = new Date(filters.fechaDesde);
      }
      if (filters.fechaHasta) {
        where.fechaCreacion.lte = new Date(filters.fechaHasta);
      }
    }

    // Filtro por rango de fechas de vencimiento
    if (filters?.fechaVencimientoDesde || filters?.fechaVencimientoHasta) {
      where.fechaVencimiento = {};
      if (filters.fechaVencimientoDesde) {
        where.fechaVencimiento.gte = new Date(filters.fechaVencimientoDesde);
      }
      if (filters.fechaVencimientoHasta) {
        where.fechaVencimiento.lte = new Date(filters.fechaVencimientoHasta);
      }
    }

    // Búsqueda por título o descripción
    if (filters?.buscar) {
      where.OR = [
        {
          titulo: {
            contains: filters.buscar,
            mode: 'insensitive',
          },
        },
        {
          descripcion: {
            contains: filters.buscar,
            mode: 'insensitive',
          },
        },
      ];
    }

    return this.prisma.task.findMany({
      where,
      orderBy: {
        fechaCreacion: 'desc',
      },
    });
  }

  async findOneByID(id: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }

    return task;
  }

  async updateByID(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    // Verificar que la tarea existe
    await this.findOneByID(id);

    const updateData: Prisma.TaskUpdateInput = {};

    if (updateTaskDto.titulo !== undefined) {
      updateData.titulo = updateTaskDto.titulo;
    }
    if (updateTaskDto.descripcion !== undefined) {
      updateData.descripcion = updateTaskDto.descripcion;
    }
    if (updateTaskDto.estado !== undefined) {
      updateData.estado = updateTaskDto.estado;
    }
    if (updateTaskDto.fechaVencimiento !== undefined) {
      updateData.fechaVencimiento = updateTaskDto.fechaVencimiento 
        ? new Date(updateTaskDto.fechaVencimiento) 
        : null;
    }

    return this.prisma.task.update({
      where: { id },
      data: updateData,
    });
  }

  async updateStatusByID(id: number, estado: TaskStatus): Promise<Task> {
    // Verificar que la tarea existe
    await this.findOneByID(id);

    return this.prisma.task.update({
      where: { id },
      data: { estado },
    });
  }

  async removeByID(id: number): Promise<Task> {
    // Verificar que la tarea existe
    await this.findOneByID(id);

    return this.prisma.task.delete({ where: { id } });
  }
}