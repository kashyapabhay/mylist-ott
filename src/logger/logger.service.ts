import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables

@Injectable()
export class LoggerService {
  private logger: winston.Logger;
  private context?: string;


  constructor(context?: string) {
    this.context = context;
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info', // Use log level from environment variable
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]${this.context ? ` [${this.context}]` : ''}: ${message}`;
        })
      ),
      transports: [
        new winston.transports.Console(),
        // Add other transports like File if needed
      ],
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error(`${message} - ${trace}`);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}