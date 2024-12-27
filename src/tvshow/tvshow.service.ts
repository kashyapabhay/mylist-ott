import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTVShowDto, UpdateTVShowDto } from './tvshow.dto';
import { TVShow } from './tvshow.interface';
import { LoggerService } from '../logger/logger.service'; // Add this import

@Injectable()
export class TVShowService {
  constructor(
    @InjectModel('TVShow') private readonly tvShowModel: Model<TVShow>,
    private readonly logger: LoggerService, // Inject LoggerService
  ) {}

  async createTVShow(createTVShowDto: CreateTVShowDto): Promise<TVShow> {
  
    this.logger.log('Creating a new TV show'); // Log message
    const createdTVShow = this.tvShowModel.create(createTVShowDto);
    return createdTVShow;
  }
 


  async getTVShow(tvShowId: string): Promise<TVShow> {
    this.logger.log(`Fetching TV show with id: ${tvShowId}`);
    const tvShow = await this.tvShowModel.findById(tvShowId).exec();
    if (!tvShow) {
      throw new Error('TV Show not found');
    }
    return tvShow;
  }

  async updateTVShow(tvShowId: string, updateTVShowDto: UpdateTVShowDto): Promise<TVShow> {
    this.logger.log(`Updating TV show with id: ${tvShowId}`);
    const updatedTVShow = await this.tvShowModel.findByIdAndUpdate(tvShowId, updateTVShowDto, { new: true }).exec();
    if (!updatedTVShow) {
      throw new Error('TV Show not found');
    }
    return updatedTVShow;
  }

  async removeTVShow(tvShowId: string): Promise<TVShow> {
    this.logger.log(`Removing TV show with id: ${tvShowId}`);
    const result = await this.tvShowModel.findByIdAndDelete(tvShowId);
    if (!result) {
      throw new Error('TV Show not found');
    }
    return result;
  }

}
