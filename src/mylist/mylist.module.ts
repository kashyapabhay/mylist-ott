import { Module, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MyListService } from './mylist.service';
import { MyListController } from './mylist.controller';
import { MyListSchema } from './mylist.schema';
import { LoggerService } from '../logger/logger.service';
import { LoggerModule } from '../logger/logger.module';
import { MovieModule } from 'src/movie/movie.module';
import { TVShowModel } from 'src/tvshow/tvshow.schema';
import { TVShowModule } from 'src/tvshow/tvshow.module';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { MovieService } from 'src/movie/movie.service';
import { TVShowService } from 'src/tvshow/tvshow.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { RedisCacheModule } from 'src/rediscache/redis.cache.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'MyList', schema: MyListSchema }]),
    LoggerModule,MovieModule,TVShowModule,UserModule,AuthModule,RedisCacheModule,
  ],
  controllers: [MyListController],
  providers: [MyListService,LoggerService,],
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
