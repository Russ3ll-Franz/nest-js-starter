import { ApiModelProperty } from '@nestjs/swagger';

export class TodoVM {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  description: string;

  @ApiModelProperty()
  isComplete: boolean;

  @ApiModelProperty({ type: String, format: 'date-time' })
  createdAt: string;

  @ApiModelProperty({ type: String, format: 'date-time' })
  updatedAt: string;
}
