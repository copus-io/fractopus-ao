import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';


@Injectable()
export class WhitelistMiddleware implements NestMiddleware {
  private whitelist: string[] = ['127.0.0.1', '::1']; // 添加允许访问的 IP 地址

  use(req: Request, res: Response, next: NextFunction) {
    const clientIp = req.ip;
    console.info(clientIp);
    if (this.whitelist.includes(clientIp)) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied' });
    }
  }
}