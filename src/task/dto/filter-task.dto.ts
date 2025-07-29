import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class FilterTaskDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  estado?: TaskStatus;

  @IsOptional()
  @IsDateString()
  fechaDesde?: string;

  @IsOptional()
  @IsDateString()
  fechaHasta?: string;

  @IsOptional()
  @IsString()
  buscar?: string;

  @IsOptional()
  @IsDateString()
  fechaVencimientoDesde?: string;

  @IsOptional()
  @IsDateString()
  fechaVencimientoHasta?: string;
}