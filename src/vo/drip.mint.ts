import { ApiProperty } from "@nestjs/swagger";

export class DripMint{

  @ApiProperty()
  recipient:string;

  @ApiProperty()
  amount:number;
}