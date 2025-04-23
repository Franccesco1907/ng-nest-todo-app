import { ResponseDto } from "@common/utils";
import { TodoModel } from "@modules/todo/domain/models";
import { ApiProperty } from "@nestjs/swagger";

class MessageResponseDto {
  @ApiProperty({ type: String, description: 'Message' })
  message: string;
}

export class GetAllTodosApiResponseDto extends ResponseDto<TodoModel[]> {
  @ApiProperty({ type: [TodoModel] })
  declare data: TodoModel[];
}

export class GetTodoApiResponseDto extends ResponseDto<TodoModel> {
  @ApiProperty({ type: TodoModel })
  declare data: TodoModel;
}

export class CreateTodoApiResponseDto extends ResponseDto<TodoModel> {
  @ApiProperty({ type: TodoModel })
  declare data: TodoModel;
}

export class MarkAsCompleteApiResponseDto extends ResponseDto<MessageResponseDto> {
  @ApiProperty({ type: MessageResponseDto })
  declare data: MessageResponseDto;
}

export class UpdateApiResponseDto extends ResponseDto<TodoModel> {
  @ApiProperty({ type: TodoModel })
  declare data: TodoModel;
}

export class DeleteApiResponseDto extends ResponseDto<MessageResponseDto> {
  @ApiProperty({ type: MessageResponseDto })
  declare data: MessageResponseDto;
}