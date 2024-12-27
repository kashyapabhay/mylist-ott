import { Controller, Get, Post, Body, Delete, Put, Param } from '@nestjs/common';
import { TVShowService } from './tvshow.service';
import { CreateTVShowDto, UpdateTVShowDto } from './tvshow.dto';
import { TVShow } from './tvshow.interface';
import { LoggerService } from 'src/logger/logger.service';
@Controller('tvshows')
class TVShowController {
  constructor(private readonly tvShowService: TVShowService,
    private readonly logger: LoggerService, // Inject LoggerService
  ) { }

  @Post()
  async createTVShow(@Body() createTVShowDto: CreateTVShowDto): Promise<TVShow> {
    return this.tvShowService.createTVShow(createTVShowDto);
  }



  @Get(':id')
  async getTVShow(@Param('id') id: string): Promise<TVShow> {
    this.logger.log(`findOne method called with id: ${id}`);
    const tvShow = await this.tvShowService.getTVShow(id);
    if (!tvShow) {
      this.logger.error(`TVShow with ID ${id} not found`, "");
    }
    return tvShow;
  }

  @Put(':id')
  async updateTVShow(@Param('id') id: string, @Body() updateTVShowDto: UpdateTVShowDto): Promise<TVShow> {



    this.logger.log(`update method called with id: ${id}`);
    const updatedTVShow = await this.tvShowService.updateTVShow(id, updateTVShowDto);
    if (!updatedTVShow) {
      this.logger.error(`TVShow with ID ${id} not found`,"");
    }
    return updatedTVShow;
  }

  @Delete(':id')
  async removeTVShow(@Param('id') id: string): Promise<TVShow> {

    this.logger.log(`remove method called with id: ${id}`);
    const result = await this.tvShowService.removeTVShow(id);
    if (!result) {
      this.logger.error(`TVShow with ID ${id} not found`,"");
    }
    return result;
  }
}

export { TVShowController };