import { Controller, Post, Delete, Get, Body, Param, Query } from '@nestjs/common';
import { MyListService } from './mylist.service';
import { CreateMyListDto } from './create-mylist.dto';

@Controller('mylist')
export class MyListController {
  constructor(private readonly myListService: MyListService) {}

  @Post()
  async addToMyList( @Body() createMyListDto: CreateMyListDto) {
    return this.myListService.addToMyList( createMyListDto);
  }

  @Delete(':id')
  async removeFromMyList(@Query('userId') userId: string, @Param('id') contentId: string) {
    return this.myListService.removeFromMyList(userId, contentId);
  }

  @Get()
  async listMyItems(@Query('userId') userId: string, @Query('page') page: number, @Query('limit') limit: number) {
    return this.myListService.listMyItems(userId, page, limit);
  }
}
