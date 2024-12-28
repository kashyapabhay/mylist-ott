import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { TVShowService } from './tvshow.service';
import { CreateTVShowDto, UpdateTVShowDto } from './tvshow.dto';
import { TVShow } from './tvshow.interface';
import { LoggerService } from 'src/logger/logger.service';

@Controller('tvshows')
class TVShowController {
  constructor(
    private readonly tvShowService: TVShowService,
    private readonly logger: LoggerService, // Inject LoggerService
  ) {}

  @Post()
  async createTVShow(@Body() createTVShowDto: CreateTVShowDto): Promise<TVShow> {
    this.logger.log('createTVShow method called');
    try {
      return await this.tvShowService.createTVShow(createTVShowDto);
    } catch (error) {
      this.logger.error(`Error creating TV show: ${error.message}`, error.stack);
      throw new HttpException('Error creating TV show', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

 

  @Get(':id')
  async getTVShow(@Param('id') id: string): Promise<TVShow> {
    this.logger.log(`getTVShow method called with id: ${id}`);
    try {
      const tvShow = await this.tvShowService.getTVShow(id);
      if (!tvShow) {
        this.logger.error(`TVShow with ID ${id} not found`,"");
        throw new HttpException(`TVShow with ID ${id} not found`, HttpStatus.NOT_FOUND);
      }
      return tvShow;
    } catch (error) { 
      this.logger.error(`Error fetching TV show: ${error.message}`, error.stack);
      throw new HttpException('Error fetching TV show', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async updateTVShow(@Param('id') id: string, @Body() updateTVShowDto: UpdateTVShowDto): Promise<TVShow> {
    this.logger.log(`updateTVShow method called with id: ${id}`);
    try {
      const updatedTVShow = await this.tvShowService.updateTVShow(id, updateTVShowDto);
      if (!updatedTVShow) {
        this.logger.error(`TVShow with ID ${id} not found`,"");
        throw new HttpException(`TVShow with ID ${id} not found`, HttpStatus.NOT_FOUND);
      }
      return updatedTVShow;
    } catch (error) {
      this.logger.error(`Error updating TV show: ${error.message}`, error.stack);
      throw new HttpException('Error updating TV show', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async removeTVShow(@Param('id') id: string): Promise<void> {
    this.logger.log(`removeTVShow method called with id: ${id}`);
    try {
     await this.tvShowService.removeTVShow(id);
      
    } catch (error) {
      this.logger.error(`Error removing TV show: ${error.message}`, error.stack);
      throw new HttpException('Error removing TV show', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

export { TVShowController };