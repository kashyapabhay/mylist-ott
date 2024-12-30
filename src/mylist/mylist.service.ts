import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MyList } from './mylist.interface';
import { CreateMyListDto } from './mylist.dto';
import { LoggerService } from '../logger/logger.service';
import { ListNotFoundException } from './exceptions/list-not-found.exception';
import { UserService } from '../user/user.service';
import { MovieService } from '../movie/movie.service';
import { TVShowService } from '../tvshow/tvshow.service';
import { InternalServerErrorException } from '@nestjs/common';
import { InvalidContentIdException } from './exceptions/invalid.content.id.exception';
import { UserNotFoundException } from 'src/user/exceptions/user-not-found-exception';
import { RedisCacheService } from 'src/rediscache/redis-cache-service';
import { DatabaseException } from 'src/exceptions/database.exception';
import { ContentType } from './mylist.enum';
import { InvaldMovieIdException } from 'src/movie/exceptions/invalid.movie.id.exception';
import { InvalidTVShowIdException } from 'src/tvshow/exceptions/invalid.tvshow.id.exception';
import { InvalidPageNumberException } from './exceptions/invalid.page.no.exception';

@Injectable()
export class MyListService {
  private readonly enableRedisCache: boolean;
  private readonly cacheExpirationMinutes: number;
  private readonly logger = new LoggerService(MyListService.name);
  constructor(
    @InjectModel('MyList') private readonly myListModel: Model<MyList>,
    private readonly userService: UserService,
    private readonly movieService: MovieService,
    private readonly tvShowService: TVShowService,
    private readonly redisCacheService: RedisCacheService,

  ) {
    this.enableRedisCache = process.env.ENABLE_REDIS_CACHE === 'true' || false; // Default to false if not set
    this.cacheExpirationMinutes = parseInt(process.env.CACHE_EXPIRATION_MINUTES, 10) || 720; // Default to 720 minutes (12 hours) if not set

  }

  async getEnableRedisCache(): Promise<boolean> {
    return this.enableRedisCache;
  }

  async getCacheExpirationMinutes(): Promise<number> {
    return this.cacheExpirationMinutes;
  }

  async addToMyList(createMyListDto: CreateMyListDto): Promise<MyList> {
    this.logger.log('Adding item to MyList for user with id: ' + createMyListDto.userId + 'and contentId: ' + createMyListDto.contentId);

    const userId = createMyListDto.userId
    // Check from user service if user exists
    await this.validateUser(userId);

    // Find the user's list or create a new one if it doesn't exist
    let myList;
    try {
      this.logger.debug('Fetching MyList for user with id: ' + userId);
      myList = await this.myListModel.findOne({ userId });
      if (!myList) {
        this.logger.debug('MyList not found for user with id: ' + userId + '. Creating a new one');
        myList = await this.myListModel.create({ userId, items: [] });
        this.logger.debug(`MyList created with id ${myList._id}for user with id: ${userId}  `);
      }else{
        this.logger.debug(`MyList found with id ${myList._id}for user with id: ${userId}  `);
      }
    } catch (error) {
      this.logger.error('Error fetching MyList for user with id: ' + userId, error.stack);
      throw new DatabaseException(`Error while adding item to MyList for userId: ${userId}`, error);
    }

    this.logger.debug('Validating contentId: ' + createMyListDto.contentId);
    // Validate contentId based on contentType
    if (createMyListDto.contentType === 'Movie') {
      try {
        const movie = await this.movieService.getMovie(createMyListDto.contentId);
        if (!movie) {
          this.logger.error('Movie not found.Invalid content Id: ' + createMyListDto.contentId, "");
          throw new InvalidContentIdException('Invalid content Id', null);
        }
      } catch (error) {
        this.logger.error('Error validating contentId from Movie Service: ' + createMyListDto.contentId, error.stack);
        throw new InvalidContentIdException('Invalid content Id', error.stack);
      }
    } else if (createMyListDto.contentType === 'TVShow') {
      const tvShow = await this.tvShowService.getTVShow(createMyListDto.contentId);
      try {
        if (!tvShow) {
          this.logger.error('Movie not found.Invalid content Id: ' + createMyListDto.contentId, "");
          throw new InvalidContentIdException('Invalid Content Id', null);
        }
      } catch (error) {
        this.logger.error('Error validating contentId from TVShow Service: ' + createMyListDto.contentId, error.stack);
        throw new InvalidContentIdException('Invalid content Id', error.stack);
      }
    }
    else {
      throw new InvalidContentIdException('Invalid content type', null);
    }
    
    this.logger.log('ContentId validated successfully: ' + createMyListDto.contentId +'. Going to add item to Mylist');

    // Add the item to the user's list
    myList.items.push({ ...createMyListDto, dateAdded: new Date() });
    try {
      
      await myList.save();
      this.logger.debug(`Item added to list with Id ${myList._id} for userId: ${userId}` );
    } catch (error) {
      this.logger.error('Error saving MyList for user with id: ' + userId, error.stack);
      throw new DatabaseException(`Error while updateing MyList for user : ${userId}`, error);
    }
    return myList;
  }

  async removeFromMyList(userId: string, contentId: string): Promise<MyList> {
    this.logger.log(`Removing item with contentId: ${contentId} from MyList for user with id: ${userId}`);

    // Check from user service if user exists

    await this.validateUser(userId);

    // Validate contentId
    try {
      const movie = await this.movieService.getMovie(contentId);
    } catch (error) {
      if (error instanceof InvaldMovieIdException) {
        this.logger.debug('ContentId not found for movie. Now checking for TVShow');
        try {
          await this.tvShowService.getTVShow(contentId);
        } catch (error) {
          if (error instanceof InvalidTVShowIdException) {
            this.logger.debug('TV show not found for contentId: ' + contentId);
            throw new InvalidContentIdException('ContentId not found', error);
          }
          this.logger.error('Error validating contentId: ' + contentId, error.stack);
          throw new InvalidContentIdException('ContentId not found for Id: ' + contentId, error);
        }

      } else {
        this.logger.error('Error validating contentId: ' + contentId, error.stack);
        throw new InvalidContentIdException('ContentId not found for Id: ' + contentId, error);
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
      throw new DatabaseException('Error updating MyList for userId: ' + userId, error);
    }

    return myList;
  }


  private getCacheKey(userId: string, page: number, limit: number): string {
    return `mylist:${userId}:${page}:${limit}`;
  }
  async listMyItems(userId: string, page: number): Promise<MyList> {
    this.logger.log(`Listing items for user with id: ${userId}`);

    if (page < 1) {
      throw new InvalidPageNumberException('Invalid page number');
    }

    const cacheKey = this.getCacheKey(userId, page, 10);

    if (this.enableRedisCache) {
      try {
        const cachedItems = await this.redisCacheService.get(cacheKey);
        if (cachedItems) {
          this.logger.log(`Cache hit for user with id: ${userId}, page: ${page}, limit: 10`);
          return cachedItems;
        } else {
          this.logger.log(`Cache miss for user with id: ${userId}, page: ${page}, limit: 10. Fetching from database`);
        }
      } catch (error) {
        this.logger.error('Error fetching from cache for user with id: ' + userId, error.stack);
      }
    }


    // Check from user service if user exists
    this.validateUser(userId);
    this.logger.debug('User validated successfully for userId: ' + userId);
    // Check if the user's list exists
    this.logger.debug('Fetching MyList for user with id: ' + userId);
    let myList;
    try {
      myList = await this.myListModel.findOne({ userId });
      this.logger.debug('MyList found for user with id: ' + userId);
    } catch (error) {
      this.logger.error('Error fetching MyList for user with id: ' + userId, error.stack);
      throw new DatabaseException('Error fetching MyList for userId: ' + userId, error);
    }

    const skip = (page - 1) * 10;
    this.logger.debug(`Fetching items for user with id: ${userId}, page: ${page}`);
    let items;
    try {
      items = await this.myListModel.find({ userId }).skip(skip).limit(10);
      this.logger.debug('Items fetched successfully for user with id: ' + userId);
    } catch (error) {
      this.logger.error('Error fetching items for user with id: ' + userId, error.stack);
      throw new DatabaseException('Error fetching items from database for userId: ' + userId, error);
    }

    if (this.enableRedisCache) {
      try {

        await this.redisCacheService.put(cacheKey, items, 60 * this.cacheExpirationMinutes); // Cache the result for the configured time
        this.logger.log(`Saved to cache for user with id: ${userId}, page: ${page}`);
      } catch (error) {
        this.logger.error('Error saving to cache for user with id: ' + userId, error.stack);
      }
    }
    return items;
  }
  private async validateUser(userId: string): Promise<void> {
    try {
      await this.userService.getUser(userId);

    } catch (error) {
      this.logger.error('Error fetching user with id: ' + userId, error.stack);
      if (error instanceof UserNotFoundException) {
        throw error;
      }
      throw new Error('An unexpected error occurred while validating the user');
    }
  }
}
