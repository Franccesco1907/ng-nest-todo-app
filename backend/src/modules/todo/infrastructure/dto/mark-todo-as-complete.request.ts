import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class MarkTodosAsCompletedRequestBody {
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  ids: string[];
}