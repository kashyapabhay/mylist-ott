import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MyList } from './mylist.interface';
import { CreateMyListDto } from './create-mylist.dto';
import { LoggerService } from '../logger/logger.service';
import { ListNotFoundException } from './exceptions/list-not-found.exception';
import { UserService } from '../user/user.service';
import { MovieService } from '../movie/movie.service';
import { TVShowService } from '../tvshow/tvshow.service';
import { InternalServerErrorException } from '@nestjs/common';
import { InvalidContentIdException } from './exceptions/invalid.content.id.exception';
import { UserNotFoundException } from 'src/user/exceptions/user-not-found-exception';

@Injectable()
export class MyListService {
  constructor(
    @InjectModel('MyList') private readonly myListModel: Model<MyList>,
    private readonly logger: LoggerService,
    private readonly userService: UserService,
    private readonly movieService: MovieService,
    private readonly tvShowService: TVShowService,
  ) { }

  async addToMyList(userId: string, createMyListDto: CreateMyListDto): Promise<MyList> {
    this.logger.log('Adding item to MyList for user with id: ' + userId + 'and contentId: ' + createMyListDto.contentId); 

    // Check from user service if user exists
    await this.validateUser(userId);
   
    // Find the user's list or create a new one if it doesn't exist
    let myList;
    try {
      myList = await this.myListModel.findOne({ userId });
      if (!myList) {
        myList = new this.myListModel({ userId, items: [] });
      }
    } catch (error) {
      this.logger.error('Error fetching MyList for user with id: ' + userId, error.stack);
      throw new InternalServerErrorException('Error fetching MyList');
    }

    // Validate contentId based on contentType
    if (createMyListDto.contentType === 'Movie') {
      const movie = await this.movieService.getMovie(createMyListDto.contentId);
      if (!movie) {
        throw new InvalidContentIdException('Invalid content Id');
      }
    } else if (createMyListDto.contentType === 'TVShow') {
      const tvShow = await this.tvShowService.getTVShow(createMyListDto.contentId);
      if (!tvShow) {
        throw new InvalidContentIdException('Invalid Content Id');
      }
    }else{
      throw new InvalidContentIdException('Invalid content type');
    }

    // validate contentId and contentType
    myList.items.push({ ...createMyListDto, dateAdded: new Date() });
    await myList.save();

    return myList;
  }

  async removeFromMyList(userId: string, contentId: string): Promise<MyList> {
    this.logger.log(`Removing item with contentId: ${contentId} from MyList for user with id: ${userId}`);

    // Check from user service if user exists
    
    await this.validateUser(userId);

    // Validate contentId 
    const movie = await this.movieService.getMovie(contentId);
    if (!movie) {
      const tvShow = await this.tvShowService.getTVShow(contentId);
      if (!tvShow) {
        throw new ListNotFoundException('ContentId not found');
      }
    }

    let myList;
    try {
      myList = await this.myListModel.findOneAndUpdate(
        { userId },
        { $pull: { items: { contentId } } },
        { new: true }
      );
    } catch (error) {
      this.logger.error('Error updating MyList for user with id: ' + userId, error.stack);
      throw new InternalServerErrorException('Error updating MyList');
    }
    if (!myList) {
      throw new ListNotFoundException('MyList not found');
    }
    return myList;
  }

  async listMyItems(userId: string, page: number, limit: number): Promise<MyList[]> {
    this.logger.log(`Listing items for user with id: ${userId}`);

    // Check from user service if user exists
    this.validateUser(userId);
    // Check if the user's list exists
    let myList;
    try {
      myList = await this.myListModel.findOne({ userId });
    } catch (error) {
      this.logger.error('Error fetching MyList for user with id: ' + userId, error.stack);
      throw new InternalServerErrorException('Error fetching MyList');
    }
    if (!myList) {
      throw new ListNotFoundException('MyList not found');
    }

    const skip = (page - 1) * limit;
    return this.myListModel.find({ userId }).skip(skip).limit(limit).exec();
  }
  private async validateUser(userId: string): Promise<void> {
    try {
      const userExists = await this.userService.getUser(userId);
      if (!userExists) {
        throw new UserNotFoundException("User not found");
      }
    } catch (error) {
      this.logger.error('Error fetching user with id: ' + userId, error.stack);
      if (error instanceof UserNotFoundException) {
        throw error;
      }
      throw new Error('An unexpected error occurred while validating the user');
    }
  }
}
