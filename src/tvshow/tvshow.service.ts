import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTVShowDto, UpdateTVShowDto } from './tvshow.dto';
import { TVShow } from './tvshow.interface';
import { LoggerService } from '../logger/logger.service'; // Add this import
import {  TVShowNotFoundException } from './exceptions/tvshow.not.found.exception';

@Injectable()
export class TVShowService {
  constructor(
    @InjectModel('TVShow') private readonly tvShowModel: Model<TVShow>,
    private readonly logger: LoggerService, // Inject LoggerService
  ) {}

  async createTVShow(createTVShowDto: CreateTVShowDto): Promise<TVShow> {
  
    this.logger.log('Creating a new TV show');
    try {
      const createdTVShow = new this.tvShowModel(createTVShowDto);
      return await createdTVShow.save();
    } catch (error) {
      this.logger.error(`Error creating TV show: ${error.message}`, error.stack);
      throw error;
    }
  }
 


  async getTVShow(tvShowId: string): Promise<TVShow> {
    this.logger.log(`Fetching TV show with id: ${tvShowId}`);
    try {
      const tvShow = await this.tvShowModel.findById(tvShowId).exec();
      if (!tvShow) {
        throw new TVShowNotFoundException('TV Show not found');
      }
      return tvShow;
    } catch (error) {
      this.logger.error(`Error fetching TV show: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateTVShow(tvShowId: string, updateTVShowDto: UpdateTVShowDto): Promise<TVShow> {
    this.logger.log(`Updating TV show with id: ${tvShowId}`);
    try {
      const updatedTVShow = await this.tvShowModel.findByIdAndUpdate(tvShowId, updateTVShowDto, { new: true }).exec();
      if (!updatedTVShow) {
        throw new TVShowNotFoundException('TV Show not found');
      }
      return updatedTVShow;
    } catch (error) {
      this.logger.error(`Error updating TV show: ${error.message}`, error.stack);
      throw error;
    }
  }

  async removeTVShow(tvShowId: string): Promise<void> {
    this.logger.log(`Removing TV show with id: ${tvShowId}`);
    try {
      const result = await this.tvShowModel.findByIdAndDelete(tvShowId);
      if (!result) {
        throw new TVShowNotFoundException('TV Show not found');
      }
    } catch (error) {
      this.logger.error(`Error removing TV show: ${error.message}`, error.stack);
      throw error;
    }
  }

}
