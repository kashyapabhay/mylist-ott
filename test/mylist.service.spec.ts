import { skip } from "node:test";
import { DatabaseException } from "src/exceptions/database.exception";
import { InvaldMovieIdException } from "src/movie/exceptions/invalid.movie.id.exception";
import { InvalidContentIdException } from "src/mylist/exceptions/invalid.content.id.exception";
import { InvalidPageNumberException } from "src/mylist/exceptions/invalid.page.no.exception";
import { CreateMyListDto } from "src/mylist/mylist.dto";
import { ContentType } from "src/mylist/mylist.enum";
import { MyListService } from "src/mylist/mylist.service";
import { UserNotFoundException } from "src/user/exceptions/user-not-found-exception";


describe('MyListService', () => {

  // Successfully add new item to empty MyList for valid user and content
  it('should add new movie item to empty MyList when user and content are valid', async () => {
    
    
    const mockNewList = {
      userId: 'user123',
      items: [],
      save: jest.fn().mockResolvedValue(true)
    };
    const mockMyListModel = {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockReturnValue(mockNewList),
    };

    const mockUser = { id: 'user123', name: 'Test User' };
    const mockMovie = { id: 'movie123', title: 'Test Movie' };

    const mockUserService = {
      getUser: jest.fn().mockResolvedValue(mockUser),
    };

    const mockMovieService = {
      getMovie: jest.fn().mockResolvedValue(mockMovie),
    };

    const mockTVShowService = {
      getTVShow: jest.fn(),
    };

    const mockRedisCacheService = {
      get: jest.fn(),
      put: jest.fn(),
    };

    const service = new MyListService(
      mockMyListModel as any,
      mockUserService as any,
      mockMovieService as any,
      mockTVShowService as any,
      mockRedisCacheService as any
    );

    const createMyListDto = new CreateMyListDto(mockUser.id, mockMovie.id, ContentType.Movie);

    

   
    const result = await service.addToMyList(createMyListDto);

    expect(mockUserService.getUser).toHaveBeenCalledWith('user123');
    expect(mockMovieService.getMovie).toHaveBeenCalledWith('movie123');
    expect(mockMyListModel.findOne).toHaveBeenCalledWith({ userId: 'user123' });
    expect(result).toBeDefined();
    expect(result.userId).toBe('user123');
  });

  // Handle invalid user ID during add/remove/list operations
  it('should throw UserNotFoundException when adding item with invalid userId', async () => {
    const mockMyListModel = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    const mockUserService = {
      getUser: jest.fn().mockRejectedValue(new UserNotFoundException('User not found')),
    };

    const mockMovieService = {
      getMovie: jest.fn(),
    };

    const mockTVShowService = {
      getTVShow: jest.fn(),
    };

    const mockRedisCacheService = {
      get: jest.fn(),
      put: jest.fn(),
    };

    const service = new MyListService(
      mockMyListModel as any,
      mockUserService as any,
      mockMovieService as any,
      mockTVShowService as any,
      mockRedisCacheService as any
    );

    const createMyListDto = new CreateMyListDto('invalid-user', 'movie123', ContentType.Movie);

    await expect(service.addToMyList(createMyListDto))
      .rejects
      .toThrow(UserNotFoundException);

    expect(mockUserService.getUser).toHaveBeenCalledWith('invalid-user');
    expect(mockMyListModel.findOne).not.toHaveBeenCalled();
    expect(mockMovieService.getMovie).not.toHaveBeenCalled();
  });

  // Successfully list paginated items with cache enabled and hit
  it('should return cached items when cache is enabled and hit occurs', async () => {
    const mockUser = { id: 'user123', name: 'Test User' };
    const mockCachedItems = [{ contentId: 'content123', contentType: 'Movie' }];
    const mockCacheKey = 'mylist:user123:1:10';
    const mockMyListModel = {
      findOne: jest.fn().mockResolvedValue({ userId: 'user123', items: [] }),
      find: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockCachedItems),
      
    };


    const mockUserService = {
      getUser: jest.fn().mockResolvedValue(mockUser),
    };

    const mockRedisCacheService = {
      get: jest.fn().mockResolvedValue(mockCachedItems),
      put: jest.fn(),
    };

    const service = new MyListService(
      mockMyListModel as any,
      mockUserService as any,
      {} as any, // Mocking MovieService
      {} as any, // Mocking TVShowService
      mockRedisCacheService as any
    );

    const result = await service.listMyItems('user123', 1);

    expect(result).toEqual(mockCachedItems);

  });

  // Successfully remove existing item from MyList
  it('should remove existing item from MyList when user and content are valid', async () => {
    const mockMyListModel = {
      findOneAndUpdate: jest.fn().mockResolvedValue({
        userId: 'user123',
        items: [{ contentId: 'content123' }]
      }),
    };

    const mockUser = { id: 'user123', name: 'Test User' };
    const mockMovie = { id: 'content123', title: 'Test Movie' };

    const mockUserService = {
      getUser: jest.fn().mockResolvedValue(mockUser),
    };

    const mockMovieService = {
      getMovie: jest.fn().mockResolvedValue(mockMovie),
    };

    const mockTVShowService = {
      getTVShow: jest.fn(),
    };

    const mockRedisCacheService = {
      get: jest.fn(),
      put: jest.fn(),
    };

    const service = new MyListService(
      mockMyListModel as any,
      mockUserService as any,
      mockMovieService as any,
      mockTVShowService as any,
      mockRedisCacheService as any
    );

    const result = await service.removeFromMyList('user123', 'content123');

    expect(mockUserService.getUser).toHaveBeenCalledWith('user123');
    expect(mockMovieService.getMovie).toHaveBeenCalledWith('content123');
    expect(mockMyListModel.findOneAndUpdate).toHaveBeenCalledWith(
      { userId: 'user123' },
      { $pull: { items: { contentId: 'content123' } } },
      { new: true }
    );
    expect(result).toBeDefined();
    expect(result.userId).toBe('user123');
  });

  // Successfully list paginated items with cache disabled
  it('should list paginated items from database when cache is disabled', async () => {
    const mockCachedItems = [{ contentId: 'content123', contentType: 'Movie' }];

    const mockMyListModel = {
      findOne: jest.fn().mockResolvedValue({ userId: 'user123', items: [] }),
      find: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockCachedItems),
    };

    const mockUserService = {
      getUser: jest.fn().mockResolvedValue({ id: 'user123', name: 'Test User' }),
    };

    const mockMovieService = {
      getMovie: jest.fn(),
    };

    const mockTVShowService = {
      getTVShow: jest.fn(),
    };

    const mockRedisCacheService = {
      get: jest.fn(),
      put: jest.fn(),
    };

    const service = new MyListService(
      mockMyListModel as any,
      mockUserService as any,
      mockMovieService as any,
      mockTVShowService as any,
      mockRedisCacheService as any
    );

    process.env.ENABLE_REDIS_CACHE = 'false';

    const result = await service.listMyItems('user123', 1);

    expect(mockUserService.getUser).toHaveBeenCalledWith('user123');
    expect(mockMyListModel.findOne).toHaveBeenCalledWith({ userId: 'user123' });
    expect(mockMyListModel.find).toHaveBeenCalledWith({ userId: 'user123' });
    expect(result).toBeDefined();
  });

  // Create new MyList when adding first item for user
  it('should create a new MyList when adding the first item for a user', async () => {
    const mockCachedItems = [{ contentId: 'content123', contentType: 'Movie' }];

    class MockMyListModel {
      findOne = jest.fn().mockResolvedValue(null);
      create = jest.fn().mockImplementation(() => ({
        userId: 'user123',
        items: [],
        save: jest.fn().mockResolvedValue(true)
      }));
      skip = jest.fn().mockReturnThis();
      find = jest.fn().mockReturnThis();
      limit = jest.fn().mockResolvedValue(mockCachedItems);
    }
    const mockMyListModel = {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation(() => ({
        userId: 'user123',
        items: [],
        save: jest.fn().mockResolvedValue(true)
      })),
      skip: jest.fn().mockReturnThis(),
      find: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockCachedItems),
    };

    const mockUser = { id: 'user123', name: 'Test User' };
    const mockMovie = { id: 'movie123', title: 'Test Movie' };

    const mockUserService = {
      getUser: jest.fn().mockResolvedValue(mockUser),
    };

    const mockMovieService = {
      getMovie: jest.fn().mockResolvedValue(mockMovie),
    };

    const mockTVShowService = {
      getTVShow: jest.fn(),
    };

    const mockRedisCacheService = {
      get: jest.fn(),
      put: jest.fn(),
    };

    const service = new MyListService(
      mockMyListModel as any,
      mockUserService as any,
      mockMovieService as any,
      mockTVShowService as any,
      mockRedisCacheService as any
    );

    const createMyListDto = new CreateMyListDto('user123', 'movie123', ContentType.Movie);

    const mockNewList = {
      userId: 'user123',
      items: [],
      save: jest.fn().mockResolvedValue(true)
    };

    

    const result = await service.addToMyList(createMyListDto);

    expect(mockUserService.getUser).toHaveBeenCalledWith('user123');
    expect(mockMovieService.getMovie).toHaveBeenCalledWith('movie123');
    expect(mockMyListModel.findOne).toHaveBeenCalledWith({ userId: 'user123' });
    expect(result).toBeDefined();
    expect(result.userId).toBe('user123');
  });

  // Successfully validate user and content before operations
  it('should validate user and content before adding to MyList', async () => {
    const mockMyListModel = {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation(() => ({
        userId: 'user123',
        items: [],
        save: jest.fn().mockResolvedValue(true)
      })),
    };

    const mockUser = { id: 'user123', name: 'Test User' };
    const mockMovie = { id: 'movie123', title: 'Test Movie' };

    const mockUserService = {
      getUser: jest.fn().mockResolvedValue(mockUser),
    };

    const mockMovieService = {
      getMovie: jest.fn().mockResolvedValue(mockMovie),
    };

    const mockTVShowService = {
      getTVShow: jest.fn(),
    };

    const mockRedisCacheService = {
      get: jest.fn(),
      put: jest.fn(),
    };

    const service = new MyListService(
      mockMyListModel as any,
      mockUserService as any,
      mockMovieService as any,
      mockTVShowService as any,
      mockRedisCacheService as any
    );

    const createMyListDto = new CreateMyListDto('user123', 'movie123', ContentType.Movie);

    const mockNewList = {
      userId: 'user123',
      items: [],
      save: jest.fn().mockResolvedValue(true)
    };

    // jest.spyOn(mockMyListModel, 'create').mockReturnValue(mockNewList);

    const result = await service.addToMyList(createMyListDto);

    expect(mockUserService.getUser).toHaveBeenCalledWith('user123');
    expect(mockMovieService.getMovie).toHaveBeenCalledWith('movie123');
    expect(mockMyListModel.findOne).toHaveBeenCalledWith({ userId: 'user123' });
    expect(result).toBeDefined();
    expect(result.userId).toBe('user123');
  });

  // Handle invalid content ID for movies and TV shows
  it('should throw InvalidContentIdException when content ID is invalid for movie', async () => {
    const mockMyListModel = {
      findOne: jest.fn().mockResolvedValue({ userId: 'user123', items: [] }),
    };

    const mockUser = { id: 'user123', name: 'Test User' };

    const mockUserService = {
      getUser: jest.fn().mockResolvedValue(mockUser),
    };

    const mockMovieService = {
      getMovie: jest.fn().mockRejectedValue(new InvalidContentIdException('ContentId cannot be null or undefined',new Error())),
    };

    const mockTVShowService = {
      getTVShow: jest.fn(),
    };

    const mockRedisCacheService = {
      get: jest.fn(),
      put: jest.fn(),
    };

    const service = new MyListService(
      mockMyListModel as any,
      mockUserService as any,
      mockMovieService as any,
      mockTVShowService as any,
      mockRedisCacheService as any
    );

    const createMyListDto = new CreateMyListDto('user123', 'invalidMovieId', ContentType.Movie);

    await expect(service.addToMyList(createMyListDto)).rejects.toThrow(InvalidContentIdException);

    expect(mockUserService.getUser).toHaveBeenCalledWith('user123');
    expect(mockMovieService.getMovie).toHaveBeenCalledWith('invalidMovieId');
  });

  // Handle Redis cache misses and failures gracefully
  it('should handle cache miss and fallback to database when listing items', async () => {
    const mockMyListModel = {
      findOne: jest.fn().mockResolvedValue({ userId: 'user123', items: [] }),
      find: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([{ userId: 'user123', items: [] }]),
    };

    const mockUserService = {
      getUser: jest.fn().mockResolvedValue({ id: 'user123', name: 'Test User' }),
    };

    const mockMovieService = {
      getMovie: jest.fn(),
    };

    const mockTVShowService = {
      getTVShow: jest.fn(),
    };

    const mockRedisCacheService = {
      get: jest.fn().mockResolvedValue(null), // Simulate cache miss
      put: jest.fn(),
    };

    const service = new MyListService(
      mockMyListModel as any,
      mockUserService as any,
      mockMovieService as any,
      mockTVShowService as any,
      mockRedisCacheService as any
    );

    const result = await service.listMyItems('user123', 1);
    
    expect(mockMyListModel.findOne).toHaveBeenCalledWith({ userId: 'user123' });
    expect(mockMyListModel.find).toHaveBeenCalledWith({ userId: 'user123' });
    expect(result).toBeDefined();
  });

  // Handle pagination edge cases (invalid page numbers, empty results)
  it('should throw InvalidPageNoException list when page number is less 1', async () => {
    const mockMyListModel = {
      findOne: jest.fn().mockResolvedValue({ userId: 'user123', items: [] }),
      find: jest.fn().mockResolvedValue([]),
      skip: jest.fn().mockReturnThis(),
    };

    const mockUserService = {
      getUser: jest.fn().mockResolvedValue({ id: 'user123', name: 'Test User' }),
    };

    const mockMovieService = {
      getMovie: jest.fn(),
    };

    const mockTVShowService = {
      getTVShow: jest.fn(),
    };

    const mockRedisCacheService = {
      get: jest.fn(),
      put: jest.fn(),
    };

    const service = new MyListService(
      mockMyListModel as any,
      mockUserService as any,
      mockMovieService as any,
      mockTVShowService as any,
      mockRedisCacheService as any
    );

    await expect(service.listMyItems('user123', -1)).rejects.toThrow(InvalidPageNumberException);

  });

  // Handle database errors during CRUD operations
  it('should throw DatabaseException when fetching MyList fails', async () => {
    const mockMyListModel = {
      findOne: jest.fn().mockRejectedValue(new Error('Database error')),
    };

    const mockUserService = {
      getUser: jest.fn().mockResolvedValue({ id: 'user123', name: 'Test User' }),
    };

    const mockMovieService = {
      getMovie: jest.fn(),
    };

    const mockTVShowService = {
      getTVShow: jest.fn(),
    };

    const mockRedisCacheService = {
      get: jest.fn(),
      put: jest.fn(),
    };

    const service = new MyListService(
      mockMyListModel as any,
      mockUserService as any,
      mockMovieService as any,
      mockTVShowService as any,
      mockRedisCacheService as any
    );

    const createMyListDto = new CreateMyListDto('user123', 'content123', ContentType.Movie);

    await expect(service.addToMyList(createMyListDto)).rejects.toThrow(DatabaseException);
    expect(mockMyListModel.findOne).toHaveBeenCalledWith({ userId: 'user123' });
  });

  // Handle invalid content types
  it('should throw InvalidContentIdException when content type is invalid', async () => {
    const mockMyListModel = {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
    };

    const mockUser = { id: 'user123', name: 'Test User' };

    const mockUserService = {
      getUser: jest.fn().mockResolvedValue(mockUser),
    };

    const mockMovieService = {
      getMovie: jest.fn(),
    };

    const mockTVShowService = {
      getTVShow: jest.fn(),
    };

    const mockRedisCacheService = {
      get: jest.fn(),
      put: jest.fn(),
    };

    const service = new MyListService(
      mockMyListModel as any,
      mockUserService as any,
      mockMovieService as any,
      mockTVShowService as any,
      mockRedisCacheService as any
    );

    const createMyListDto = new CreateMyListDto('user123', 'invalidContentId', 'InvalidType' as any);

    await expect(service.addToMyList(createMyListDto)).rejects.toThrow(InvalidContentIdException);
  });

  // Cache expiration and refresh behavior
  it('should fetch items from cache when cache is enabled and data is present', async () => {
    const mockMyListModel = {
      findOne: jest.fn(),
      find: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([{ userId: 'user123', items: [] }]),
    };

    const mockUserService = {
      getUser: jest.fn().mockResolvedValue({ id: 'user123', name: 'Test User' }),
    };

    const mockMovieService = {
      getMovie: jest.fn(),
    };

    const mockTVShowService = {
      getTVShow: jest.fn(),
    };

    const mockRedisCacheService = {
      get: jest.fn().mockResolvedValue([{ userId: 'user123', items: [] }]),
      put: jest.fn(),
    };

    const service = new MyListService(
      mockMyListModel as any,
      mockUserService as any,
      mockMovieService as any,
      mockTVShowService as any,
      mockRedisCacheService as any
    );

    process.env.ENABLE_REDIS_CACHE = 'true';

    const cacheKey = 'mylist:user123:1:10';
    mockRedisCacheService.get.mockResolvedValue([{ userId: 'user123', items: [] }]);

    const result = await service.listMyItems('user123', 1);

    expect(result).toEqual([{ userId: 'user123', items: [] }]);
  });

  // Environment variable configuration fallbacks
  it('should use default values for environment variables when not set', async () => {
    const mockMyListModel = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    const mockUserService = {
      getUser: jest.fn(),
    };

    const mockMovieService = {
      getMovie: jest.fn(),
    };

    const mockTVShowService = {
      getTVShow: jest.fn(),
    };

    const mockRedisCacheService = {
      get: jest.fn(),
      put: jest.fn(),
    };

    process.env.ENABLE_REDIS_CACHE = undefined;
    process.env.CACHE_EXPIRATION_MINUTES = undefined;

    const service = new MyListService(
      mockMyListModel as any,
      mockUserService as any,
      mockMovieService as any,
      mockTVShowService as any,
      mockRedisCacheService as any
    );

    expect(await service.getEnableRedisCache()).toBe(false);
    expect(await service.getCacheExpirationMinutes()).toBe(720);
  });

  // Concurrent access to same user's list
  it('should handle concurrent access to the same user\'s list correctly', async () => {
    const mockMyListModel = {
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
    };

    const mockUser = { id: 'user123', name: 'Test User' };
    const mockMovie = { id: 'movie123', title: 'Test Movie' };

    const mockUserService = {
      getUser: jest.fn().mockResolvedValue(mockUser),
    };

    const mockMovieService = {
      getMovie: jest.fn().mockResolvedValue(mockMovie),
    };

    const mockTVShowService = {
      getTVShow: jest.fn(),
    };

    const mockRedisCacheService = {
      get: jest.fn(),
      put: jest.fn(),
    };

    const service = new MyListService(
      mockMyListModel as any,
      mockUserService as any,
      mockMovieService as any,
      mockTVShowService as any,
      mockRedisCacheService as any
    );

    const createMyListDto1 = new CreateMyListDto('user123', 'movie123', ContentType.Movie);
    const createMyListDto2 = new CreateMyListDto('user123', 'movie456', ContentType.Movie);

    const mockExistingList = {
      userId: 'user123',
      items: [{ contentId: 'movie123', contentType: ContentType.Movie, dateAdded: new Date() }],
      save: jest.fn().mockResolvedValue(true)
    };

    mockMyListModel.findOne.mockResolvedValue(mockExistingList);

    await Promise.all([
      service.addToMyList(createMyListDto1),
      service.addToMyList(createMyListDto2)
    ]);

    expect(mockUserService.getUser).toHaveBeenCalledWith('user123');
    expect(mockMovieService.getMovie).toHaveBeenCalledWith('movie123');
    expect(mockMovieService.getMovie).toHaveBeenCalledWith('movie456');
    expect(mockMyListModel.findOne).toHaveBeenCalledWith({ userId: 'user123' });
    expect(mockExistingList.save).toHaveBeenCalledTimes(2);
  });

  // Redis enabled/disabled mode switching
  it('should fetch items from cache when Redis is enabled and cache hit occurs', async () => {
    const mockMyListModel = {
      findOne: jest.fn(),
      find: jest.fn(),
    };

    const mockUserService = {
      getUser: jest.fn().mockResolvedValue({ id: 'user123', name: 'Test User' }),
    };

    const mockMovieService = {
      getMovie: jest.fn(),
    };

    const mockTVShowService = {
      getTVShow: jest.fn(),
    };

    const mockRedisCacheService = {
      get: jest.fn().mockResolvedValue([{ userId: 'user123', items: [] }]),
      put: jest.fn(),
    };

    process.env.ENABLE_REDIS_CACHE = 'true';

    const service = new MyListService(
      mockMyListModel as any,
      mockUserService as any,
      mockMovieService as any,
      mockTVShowService as any,
      mockRedisCacheService as any
    );

    const result = await service.listMyItems('user123', 1);

    expect(mockRedisCacheService.get).toHaveBeenCalledWith('mylist:user123:1:10');
    expect(result).toEqual([{ userId: 'user123', items: [] }]);
  });
});
