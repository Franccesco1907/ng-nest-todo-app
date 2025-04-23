import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class TodoUpdateRequestBody {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty({
    description: 'Title of the to-do item',
    example: 'Buy milk',
    maxLength: 100,
  })
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  @ApiProperty({
    description: 'Detailed description of the task',
    example: 'Buy lactose-free milk from the nearest supermarket',
    maxLength: 500,
  })
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: 'Specifies if the task is already completed',
    example: false,
  })
  isCompleted: boolean;
}
