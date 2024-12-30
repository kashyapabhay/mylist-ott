import { Controller, Post, Delete, Get, Body, Param, Query, UseGuards, UseFilters } from '@nestjs/common';
import { MyListService } from './mylist.service';
import { CreateMyListDto } from './mylist.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MyListServiceExceptionFilter } from './exceptions/mylist.service.exception.filter';

@Controller('mylist')
@UseGuards(JwtAuthGuard)
@UseFilters(MyListServiceExceptionFilter)
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
  async listMyItems(@Query('userId') userId: string, @Query('page') page: number) {
    return this.myListService.listMyItems(userId, page);
  }
}
