import { Module, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { WebSocketAPIGateway } from './webstocket.api.gateway';
import { LoggerModule } from 'src/logger/logger.module';
import { MyListModule } from 'src/mylist/mylist.module';
import { UserModule } from 'src/user/user.module';
import { MovieModule } from 'src/movie/movie.module';
import { TVShowModule } from 'src/tvshow/tvshow.module';

@Module({
  imports: [LoggerModule,MyListModule, UserModule, MovieModule,TVShowModule ],
  providers: [WebSocketAPIGateway],
})
export class WebSocketAPIModule implements OnModuleInit, OnModuleDestroy {
  onModuleInit() {
    console.log('WebSocketAPIModule has been initialized.');
  }

  onModuleDestroy() {
    console.log('WebSocketAPIModule is being destroyed.');
  }
}