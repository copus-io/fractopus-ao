import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { CommonController } from './controllers/commonController';
import { AppService } from './services/app.service';

@Module({
  imports: [],
  controllers: [AppController,CommonController],
  providers: [AppService],
})
export class AppModule {}
