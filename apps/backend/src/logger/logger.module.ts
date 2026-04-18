import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    WinstonModule.forRoot({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        process.env.NODE_ENV === 'production'
          ? winston.format.json()
          : winston.format.combine(winston.format.colorize(), winston.format.simple()),
      ),
      transports: (() => {
        const t = new winston.transports.Console();
        t.setMaxListeners(0);
        return [t];
      })(),
    }),
  ],
})
export class LoggerModule {}
