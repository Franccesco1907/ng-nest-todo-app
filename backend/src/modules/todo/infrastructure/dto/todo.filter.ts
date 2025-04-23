import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class TodoFilter {
  @ApiPropertyOptional({ description: 'Filter by title', example: 'Buy milk' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Filter by description', example: 'Only lactose-free products' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Filter by completion status', example: true })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isCompleted?: boolean;

  @ApiPropertyOptional({ description: 'Filter by creation date (ISO format)', example: '2024-06-10T00:00:00Z' })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Filter by update date (ISO format)', example: '2024-06-11T00:00:00Z' })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  updatedAt?: Date;
}
