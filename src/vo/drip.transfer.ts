import { ApiProperty } from "@nestjs/swagger";

export class DripTransfer{
  @ApiProperty()
  sender:string;

  @ApiProperty()
  recipient:string;

  @ApiProperty()
  amount:number;
}