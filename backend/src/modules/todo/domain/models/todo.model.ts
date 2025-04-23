import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class TodoModel {
  @ApiProperty({
    description: 'Unique identifier of the ToDo item',
    example: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
  })
  id: string;

  @ApiProperty({
    description: 'ID of the user who owns this ToDo',
    example: '41bc0cd3-e711-4120-a5df-ef6fe837d742',
  })
  userId: string;

  @ApiProperty({
    description: 'Title or short name of the task',
    example: 'Buy groceries',
  })
  title: string;

  @ApiProperty({
    description: 'Detailed description of the task',
    example: 'Milk, eggs, and bread from the supermarket',
  })
  description: string;

  @ApiProperty({
    description: 'Whether the task is completed or not',
    example: false,
  })
  isCompleted: boolean;

  @ApiProperty({
    description: 'Creation date of the task',
    example: '2024-04-01T10:00:00.000Z',
    nullable: true,
  })
  createdAt: Date | null;

  @ApiPropertyOptional({
    description: 'Last update date of the task, if any',
    example: '2024-04-02T15:30:00.000Z',
    nullable: true,
  })
  updatedAt?: Date | null;

  @ApiPropertyOptional({
    description: 'Deletion date of the task if it has been soft-deleted',
    example: null,
    nullable: true,
  })
  deletedAt?: Date | null;

  constructor(data: Partial<TodoModel>) {
    Object.assign(this, data);
  }
}
