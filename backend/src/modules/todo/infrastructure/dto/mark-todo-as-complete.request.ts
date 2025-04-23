import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class MarkTodosAsCompletedRequestBody {
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  @ApiProperty({
    description: 'Array of todo IDs to mark as completed',
    example: ['41bc0cd3-e711-4120-a5df-ef6fe837d742', '124013ba-579f-4e2b-9799-1c4ef17338f1'],
    type: [String],
    isArray: true,
  })
  ids: string[];
}