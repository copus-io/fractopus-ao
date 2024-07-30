import { ApiProperty } from "@nestjs/swagger";

export class DripBurn{

  @ApiProperty()
  targetUser:string;

  @ApiProperty()
  amount:number;
}