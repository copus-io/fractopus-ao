import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BasicStrategy } from './config/basicStrategy';
import { WhitelistMiddleware } from './config/config';
import { AOController } from './controllers/ao.controller';
import { AOService } from './services/ao.service';
import { DripService } from './services/drip.service';

@Module({
  imports: [PassportModule],
  controllers: [
    AOController
  ],
  providers: [
    DripService,
    AOService,
    BasicStrategy
  ],
})

// export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(WhitelistMiddleware)
      .forRoutes('*'); // 应用于所有路由
  }
}
