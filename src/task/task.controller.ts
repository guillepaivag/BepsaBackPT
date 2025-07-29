import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiQuery, ApiParam, ApiUnauthorizedResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { ApiKeyAuthGuard } from '../auth/api-key-auth.guard';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { TaskStatus } from '@prisma/client';

@ApiTags('Tareas')
@Controller('task')
@UseGuards(ApiKeyAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  /**
   * Endpoint 1: Crear una nueva tarea
   * POST /task
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva tarea' })
  @ApiBody({
    type: CreateTaskDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de creación',
        value: {
          titulo: 'Tarea ejemplo',
          descripcion: 'Descripción opcional',
          fechaVencimiento: '2025-08-01T23:59:59.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Tarea creada exitosamente', schema: { example: { id: 1, titulo: 'Tarea ejemplo', descripcion: 'Descripción opcional', fechaCreacion: '2025-07-28T15:00:00.000Z', fechaVencimiento: '2025-08-01T23:59:59.000Z', estado: 'PENDIENTE', createdAt: '2025-07-28T15:00:00.000Z', updatedAt: '2025-07-28T15:00:00.000Z' } } })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing API key' })
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  /**
   * Endpoint 2: Listar tareas con filtros opcionales
   * GET /task?estado=PENDIENTE&fechaDesde=2024-01-01&fechaHasta=2024-12-31&buscar=importante
   */
  @Get()
  @ApiOperation({ summary: 'Listar tareas con filtros opcionales' })
  @ApiQuery({ name: 'estado', required: false, enum: ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA'] })
  @ApiQuery({ name: 'fechaDesde', required: false, type: String })
  @ApiQuery({ name: 'fechaHasta', required: false, type: String })
  @ApiQuery({ name: 'buscar', required: false, type: String })
  @ApiQuery({ name: 'fechaVencimientoDesde', required: false, type: String })
  @ApiQuery({ name: 'fechaVencimientoHasta', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Lista de tareas', schema: { example: [{ id: 1, titulo: 'Tarea ejemplo', descripcion: 'Descripción opcional', fechaCreacion: '2025-07-28T15:00:00.000Z', fechaVencimiento: '2025-08-01T23:59:59.000Z', estado: 'PENDIENTE', createdAt: '2025-07-28T15:00:00.000Z', updatedAt: '2025-07-28T15:00:00.000Z' }] } })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing API key' })
  async findAll(@Query() filters: FilterTaskDto) {
    return this.taskService.findAll(filters);
  }

  /**
   * Obtener una tarea específica por ID
   * GET /task/:id
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tarea específica por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Tarea encontrada', schema: { example: { id: 1, titulo: 'Tarea ejemplo', descripcion: 'Descripción opcional', fechaCreacion: '2025-07-28T15:00:00.000Z', fechaVencimiento: '2025-08-01T23:59:59.000Z', estado: 'PENDIENTE', createdAt: '2025-07-28T15:00:00.000Z', updatedAt: '2025-07-28T15:00:00.000Z' } } })
  @ApiNotFoundResponse({ description: 'Tarea con ID {id} no encontrada' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing API key' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.findOneByID(id);
  }

  /**
   * Endpoint 3: Actualizar el estado de una tarea
   * PATCH /task/:id/status
   */
  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar el estado de una tarea' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({
    schema: { example: { estado: 'COMPLETADA' } },
    examples: {
      ejemplo: {
        summary: 'Ejemplo de actualización de estado',
        value: { estado: 'COMPLETADA' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Tarea actualizada', schema: { example: { id: 1, titulo: 'Tarea ejemplo', descripcion: 'Descripción opcional', fechaCreacion: '2025-07-28T15:00:00.000Z', fechaVencimiento: '2025-08-01T23:59:59.000Z', estado: 'COMPLETADA', createdAt: '2025-07-28T15:00:00.000Z', updatedAt: '2025-07-28T15:10:00.000Z' } } })
  @ApiNotFoundResponse({ description: 'Tarea con ID {id} no encontrada' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing API key' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('estado') estado: TaskStatus,
  ) {
    return this.taskService.updateStatusByID(id, estado);
  }

  /**
   * Actualizar una tarea completa
   * PATCH /task/:id
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una tarea completa' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({
    type: UpdateTaskDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de actualización',
        value: {
          titulo: 'Nuevo título',
          descripcion: 'Nueva descripción',
          fechaVencimiento: '2025-08-10T23:59:59.000Z',
          estado: 'EN_PROGRESO',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Tarea actualizada', schema: { example: { id: 1, titulo: 'Nuevo título', descripcion: 'Nueva descripción', fechaCreacion: '2025-07-28T15:00:00.000Z', fechaVencimiento: '2025-08-10T23:59:59.000Z', estado: 'EN_PROGRESO', createdAt: '2025-07-28T15:00:00.000Z', updatedAt: '2025-07-28T15:20:00.000Z' } } })
  @ApiNotFoundResponse({ description: 'Tarea con ID {id} no encontrada' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing API key' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.updateByID(id, updateTaskDto);
  }

  /**
   * Eliminar una tarea
   * DELETE /task/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una tarea' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Tarea eliminada' })
  @ApiNotFoundResponse({ description: 'Tarea con ID {id} no encontrada' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing API key' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.taskService.removeByID(id);
  }
}