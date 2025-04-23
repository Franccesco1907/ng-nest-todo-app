import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TodoCreateRequestBody {
  @ApiProperty({
    description: 'Title of the to-do item',
    example: 'Buy milk',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: 'Detailed description of the task',
    example: 'Buy lactose-free milk from the nearest supermarket',
    maxLength: 500,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiPropertyOptional({
    description: 'Specifies if the task is already completed',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isCompleted: boolean;
}
