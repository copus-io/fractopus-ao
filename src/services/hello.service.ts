import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloService {
  getHello(name?: string): string {
    return 'Hello World!' + name;
  }
}
