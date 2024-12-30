import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './logger/logger.module';
import { MovieModule } from './movie/movie.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { UserModule } from './user/user.module';
import { TVShowModule } from './tvshow/tvshow.module';
import { MyListModule } from './mylist/mylist.module';
import { AuthModule } from './auth/auth.module';
import { RedisCacheModule } from './rediscache/redis.cache.module';
import { WebSocketAPIModule } from './websocket/websocket.api.module';

dotenv.config();

@Module({
  imports: [
    LoggerModule,
    MovieModule,
    UserModule,
    TVShowModule,
    MyListModule,
    AuthModule,
    RedisCacheModule,
    WebSocketAPIModule,
    MongooseModule.forRoot(process.env.MONGODB_URI),
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule { }
