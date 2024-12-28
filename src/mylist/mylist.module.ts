import { Module, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MyListService } from './mylist.service';
import { MyListController } from './mylist.controller';
import { MyListSchema } from './mylist.schema';
import { LoggerService } from '../logger/logger.service';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'MyList', schema: MyListSchema }]),
    LoggerModule,
  ],
  controllers: [MyListController],
  providers: [MyListService],
})
export class MyListModule implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MyListModule.name);

  onModuleInit() {
    this.logger.log('MyListModule has been initialized.');
  }

  onModuleDestroy() {
    this.logger.log('MyListModule is being destroyed.');
  }
}
