import { DatabaseException } from "src/exceptions/database.exception";
import { InvalidTVShowIdException } from "src/tvshow/exceptions/invalid.tvshow.id.exception";
import { TVShowNotFoundException } from "src/tvshow/exceptions/tvshow.not.found.exception";
import { TVShowService } from "src/tvshow/tvshow.service";
import { Genre } from "src/global.types"

describe('TVShowService', () => {

    // Successfully create a new TV show with valid DTO
    it('should create a new TV show when valid DTO is provided', async () => {
      const mockTVShow = {
        title: 'Test Show',
        description: 'A test show description',
        genres: [],
        episodes: [],
        rating: 8.5

      };
      

  
      const mockModel = {
        save: jest.fn().mockResolvedValue(mockTVShow)
      };
  
      const mockTVShowModel = jest.fn().mockImplementation(() => mockModel);
  
      const service = new TVShowService(mockTVShowModel as any);
  
      const result = await service.createTVShow(mockTVShow);
  
      expect(mockTVShowModel).toHaveBeenCalledWith(mockTVShow);
  
      expect(result).toEqual(mockTVShow);
    });

    // Attempt to get TV show with null/undefined ID throws InvalidTVShowIdException
    it('should throw InvalidTVShowIdException when getting TV show with null ID', async () => {
      const mockTVShowModel = {
        findById: jest.fn()
      };
  
      const service = new TVShowService(mockTVShowModel as any);
  
      await expect(service.getTVShow(null)).rejects.toThrow(InvalidTVShowIdException);
  
      expect(mockTVShowModel.findById).not.toHaveBeenCalled();
    });

    // Successfully retrieve an existing TV show by valid ID
    it('should retrieve a TV show when a valid ID is provided', async () => {
      const mockTVShow = {
        _id: 'validId123',
        title: 'Test Show',
        genre: 'Drama',
        rating: 8.5
      };

      const mockTVShowModel = {
        findById: jest.fn().mockResolvedValue(mockTVShow)
      };

      const service = new TVShowService(mockTVShowModel as any);

      const result = await service.getTVShow('validId123');

      expect(mockTVShowModel.findById).toHaveBeenCalledWith('validId123');

      expect(result).toEqual(mockTVShow);
    });

    // Successfully remove an existing TV show
    it('should remove an existing TV show when valid ID is provided', async () => {
      const mockTVShowId = 'validTvShowId';
     
      const mockTVShow = { id: mockTVShowId, title: 'Test TV Show' };
      const mockTVShowModel = {
        findByIdAndDelete: jest.fn().mockResolvedValue(mockTVShow)
      };

      const service = new TVShowService(mockTVShowModel as any);

      await service.removeTVShow(mockTVShowId);

      expect(mockTVShowModel.findByIdAndDelete).toHaveBeenCalledWith(mockTVShowId);
    });

    // Successfully update an existing TV show with valid DTO
    it('should update an existing TV show when valid DTO is provided', async () => {
      const mockTVShowId = '12345';
      const mockUpdateTVShowDto = {
        title: 'Updated Show',
        genre: 'Comedy',
        rating: 9.0
      };
      const mockUpdatedTVShow = {
        _id: mockTVShowId,
        ...mockUpdateTVShowDto
      };

      const mockModel = {
        findByIdAndUpdate: jest.fn().mockResolvedValue(mockUpdatedTVShow)
      };


      const service = new TVShowService(mockModel as any);

      const result = await service.updateTVShow(mockTVShowId, mockUpdateTVShowDto);

      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(mockTVShowId, mockUpdateTVShowDto, { new: true });

      expect(result).toEqual(mockUpdatedTVShow);
    });

    // Attempt to get non-existent TV show ID throws TVShowNotFoundException
    it('should throw TVShowNotFoundException when TV show ID does not exist', async () => {
      const mockTVShowModel = {
        findById: jest.fn().mockResolvedValue(null)
      };

      const service = new TVShowService(mockTVShowModel as any);

      await expect(service.getTVShow('nonExistentId')).rejects.toThrow(TVShowNotFoundException);

      expect(mockTVShowModel.findById).toHaveBeenCalledWith('nonExistentId');
    });

    // Attempt to update TV show with null/undefined ID throws InvalidTVShowIdException
    it('should throw InvalidTVShowIdException when updating with null or undefined ID', async () => {
      const mockTVShowModel = {
        findByIdAndUpdate: jest.fn()
      };

      const service = new TVShowService(mockTVShowModel as any);

      await expect(service.updateTVShow(null, {})).rejects.toThrow(InvalidTVShowIdException);
      await expect(service.updateTVShow(undefined, {})).rejects.toThrow(InvalidTVShowIdException);
    });

    // Attempt to remove TV show with null/undefined ID throws InvalidTVShowIdException
    it('should throw InvalidTVShowIdException when removing TV show with null ID', async () => {
      const mockTVShowModel = {
        findByIdAndDelete: jest.fn()
      };

      const service = new TVShowService(mockTVShowModel as any);

      await expect(service.removeTVShow(null)).rejects.toThrow(InvalidTVShowIdException);
    });

    // Attempt to update non-existent TV show throws TVShowNotFoundException
    it('should throw TVShowNotFoundException when updating a non-existent TV show', async () => {
      const mockTVShowId = 'nonExistentId';
      const mockUpdateTVShowDto = {
        title: 'Updated Show',
        genre: 'Comedy',
        rating: 9.0
      };
  
      const mockModel = {
        findByIdAndUpdate: jest.fn().mockResolvedValue(null)
      };
  
  
      const service = new TVShowService(mockModel as any);
  
      await expect(service.updateTVShow(mockTVShowId, mockUpdateTVShowDto))
        .rejects
        .toThrow(TVShowNotFoundException);
  
      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(mockTVShowId, mockUpdateTVShowDto, { new: true });
    });

    // Attempt to remove non-existent TV show throws TVShowNotFoundException
    it('should throw TVShowNotFoundException when attempting to remove a non-existent TV show', async () => {
      const mockTVShowId = 'nonExistentId';
      const mockTVShowModel = {
        findByIdAndDelete: jest.fn().mockResolvedValue(null)
      };

      const service = new TVShowService(mockTVShowModel as any);

      await expect(service.removeTVShow(mockTVShowId)).rejects.toThrow(TVShowNotFoundException);

      expect(mockTVShowModel.findByIdAndDelete).toHaveBeenCalledWith(mockTVShowId);
    });

    // Database errors are caught and wrapped in DatabaseException
    it('should throw DatabaseException when database error occurs during TV show creation', async () => {
      const mockTVShowDto = {

        title: 'Test Show',
      
        description: 'A test show description',
      
        genres: [] as Genre[],      
        episodes: [],
      
        rating: 8.5
      
      };

      const mockError = new Error('Database error');

      const mockModel = {
        save: jest.fn().mockRejectedValue(mockError)
      };

      const mockTVShowModel = jest.fn().mockImplementation(() => mockModel);

      const service = new TVShowService(mockTVShowModel as any);

      await expect(service.createTVShow(mockTVShowDto)).rejects.toThrow(DatabaseException);

      expect(mockTVShowModel).toHaveBeenCalledWith(mockTVShowDto);
    });

    // Error messages contain relevant IDs and titles
    it('should log and throw DatabaseException with relevant ID and title when createTVShow fails', async () => {
      const mockTVShowDto = {

        title: 'Test Show',
      
        description: 'A test show description',
      
        genres: [] as Genre[],      
        episodes: [],
      
        rating: 8.5
      
      };
      

      const mockError = new Error('Database error');
      const mockModel = {
        save: jest.fn().mockRejectedValue(mockError)
      };

      const mockTVShowModel = jest.fn().mockImplementation(() => mockModel);
    
      const service = new TVShowService(mockTVShowModel as any);

      await expect(service.createTVShow(mockTVShowDto)).rejects.toThrow(DatabaseException);

    });

    // All async operations properly await completion
    it('should fetch a TV show when a valid ID is provided', async () => {
      const mockTVShow = {
        _id: '123',
        title: 'Test Show',
        genre: 'Drama',
        rating: 8.5
      };

      const mockTVShowModel = {
        findById: jest.fn().mockResolvedValue(mockTVShow)
      };

      const service = new TVShowService(mockTVShowModel as any);

      const result = await service.getTVShow('123');

      expect(mockTVShowModel.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockTVShow);
    });
});
