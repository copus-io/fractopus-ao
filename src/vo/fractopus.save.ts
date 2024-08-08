import { ApiProperty } from "@nestjs/swagger";

export class FractopusSave{

  @ApiProperty()
  uri:string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        uri: { type: 'string' },
        shr: { type: 'number' }
      }
    }
  })
  src:Array<UpstreamItem>;
}

export class UpstreamItem{

  @ApiProperty()
  uri:string;

  @ApiProperty()
  shr:number;
}
