import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class TodoUpdateRequestBody {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  isCompleted: boolean;
}
