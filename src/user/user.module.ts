import { Module, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSchema } from './user.schema';
import { LoggerModule } from '../logger/logger.module';
import { LoggerService } from 'src/logger/logger.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    LoggerModule,
  ],
  controllers: [UserController],
  providers: [UserService,LoggerService],
  exports: [UserService],
})
export class UserModule implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(UserModule.name);

  onModuleInit() {
    this.logger.log('UserModule has been initialized.');
  }

  onModuleDestroy() {
    this.logger.log('UserModule is being destroyed.');
  }
}
