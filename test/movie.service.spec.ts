import { DatabaseException } from "src/exceptions/database.exception";
import { InvaldMovieIdException } from "src/movie/exceptions/invalid.movie.id.exception";
import { MovieNotFoundException } from "src/movie/exceptions/movie.not.found.exception";
import { MovieService } from "src/movie/movie.service";


describe('MovieService', () => {

    // Successfully retrieve an existing movie by ID
    it('should return movie when valid ID is provided', async () => {
      const mockMovie = {
        id: '123',
        title: 'Test Movie',
        description: 'Test Description',
        genres: [],
        releaseDate: new Date(),
        director: 'Test Director',
        actors: []
      };

      const mockMovieModel = {
        findById: jest.fn().mockReturnValue(mockMovie)
      };

      const movieService = new MovieService(mockMovieModel as any);

      const result = await movieService.getMovie('123');

      expect(mockMovieModel.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockMovie);
    });

    // Throw InvaldMovieIdException when movie ID is null or undefined
    it('should throw InvaldMovieIdException when movie ID is undefined', async () => {
      const mockMovieModel = {
        findById: jest.fn()
      };

      const movieService = new MovieService(mockMovieModel as any);

      await expect(movieService.getMovie(undefined)).rejects.toThrow(InvaldMovieIdException);
      await expect(movieService.getMovie(undefined)).rejects.toThrow('Movie id cannot be null or undefined');
      expect(mockMovieModel.findById).not.toHaveBeenCalled();
    });

    // Successfully create a new movie with valid CreateMovieDto
    it('should create a new movie when valid CreateMovieDto is provided', async () => {
      const mockCreateMovieDto = {
        title: 'New Movie',
        description: 'A new movie description',
        genres: [],
        releaseDate: new Date(),
        director: 'New Director',
        actors: ['Actor 1', 'Actor 2']
      };

      const mockCreatedMovie = {
        id: '123',
        ...mockCreateMovieDto
      };

      const mockMovieModel = {
        create: jest.fn().mockResolvedValue(mockCreatedMovie)
      };

      const movieService = new MovieService(mockMovieModel as any);

      const result = await movieService.addMovie(mockCreateMovieDto);

      expect(mockMovieModel.create).toHaveBeenCalledWith(mockCreateMovieDto);
      expect(result).toEqual(mockCreatedMovie);
    });

    // Successfully update an existing movie with valid UpdateMovieDto
    it('should update and return the movie when valid ID and UpdateMovieDto are provided', async () => {
      const mockUpdatedMovie = {
        id: '123',
        title: 'Updated Movie',
        description: 'Updated Description',
        genres: [],
        releaseDate: new Date(),
        director: 'Updated Director',
        actors: []
      };

      const mockUpdateMovieDto = {
        title: 'Updated Movie',
        description: 'Updated Description'
      };

      const mockMovieModel = {
        findByIdAndUpdate: jest.fn().mockReturnValue(mockUpdatedMovie)
      };

      const movieService = new MovieService(mockMovieModel as any);

      const result = await movieService.updateMovie('123', mockUpdateMovieDto);

      expect(mockMovieModel.findByIdAndUpdate).toHaveBeenCalledWith('123', mockUpdateMovieDto, { new: true });
      expect(result).toEqual(mockUpdatedMovie);
    });

    // Successfully delete an existing movie by ID
    it('should delete movie when valid ID is provided', async () => {
      const mockMovieId = '123';
      const mockMovieModel = {
        findByIdAndDelete: jest.fn().mockResolvedValue(true)
      };

      const movieService = new MovieService(mockMovieModel as any);

      await movieService.deleteMovie(mockMovieId);

      expect(mockMovieModel.findByIdAndDelete).toHaveBeenCalledWith(mockMovieId);
    });

    // Throw MovieNotFoundException when movie is not found for get/update operations
    it('should throw MovieNotFoundException when movie is not found for get operation', async () => {
      const mockMovieModel = {
        findById: jest.fn().mockReturnValue(null)
      };

      const movieService = new MovieService(mockMovieModel as any);

      await expect(movieService.getMovie('nonexistent-id')).rejects.toThrow(MovieNotFoundException);
      expect(mockMovieModel.findById).toHaveBeenCalledWith('nonexistent-id');
    });

    // Handle empty or partial UpdateMovieDto when updating movie
    it('should update movie with partial UpdateMovieDto', async () => {
      const mockMovie = {
        id: '123',
        title: 'Updated Title',
        description: 'Updated Description',
        genres: [],
        releaseDate: new Date(),
        director: 'Updated Director',
        actors: []
      };

      const mockUpdateMovieDto = {
        title: 'Updated Title'
      };

      const mockMovieModel = {
        findByIdAndUpdate: jest.fn().mockReturnValue(mockMovie)
      };

      const movieService = new MovieService(mockMovieModel as any);

      const result = await movieService.updateMovie('123', mockUpdateMovieDto);

      expect(mockMovieModel.findByIdAndUpdate).toHaveBeenCalledWith('123', mockUpdateMovieDto, { new: true });
      expect(result).toEqual(mockMovie);
    });

    // Throw DatabaseException when database operations fail
    it('should throw DatabaseException when getMovie database operation fails', async () => {
      const mockError = new Error('Database error');
      const mockMovieModel = {
        findById: jest.fn().mockImplementation(() => {
          throw mockError;
        })
      };

      const movieService = new MovieService(mockMovieModel as any);

      await expect(movieService.getMovie('123')).rejects.toThrow(DatabaseException);
      expect(mockMovieModel.findById).toHaveBeenCalledWith('123');
    });

    // Handle invalid movie IDs that are valid strings but don't exist
    it('should throw MovieNotFoundException when movie ID does not exist', async () => {
      const mockMovieModel = {
        findById: jest.fn().mockReturnValue(null)
      };

      const movieService = new MovieService(mockMovieModel as any);

      await expect(movieService.getMovie('nonexistent-id')).rejects.toThrow(MovieNotFoundException);
      expect(mockMovieModel.findById).toHaveBeenCalledWith('nonexistent-id');
    });

    // Database operations properly propagate mongoose errors
    it('should throw DatabaseException when mongoose throws an error during getMovie', async () => {
      const mockError = new Error('Mongoose error');
      const mockMovieModel = {
        findById: jest.fn().mockImplementation(() => {
          throw mockError;
        })
      };
      const movieService = new MovieService(mockMovieModel as any);

      await expect(movieService.getMovie('123')).rejects.toThrow(DatabaseException);
      expect(mockMovieModel.findById).toHaveBeenCalledWith('123');
    });

    // Handle movie deletion when movie already deleted
    it('should throw an error when trying to delete a movie that does not exist', async () => {
      const mockMovieModel = {
        findByIdAndDelete: jest.fn().mockResolvedValue(null)
      };

      const movieService = new MovieService(mockMovieModel as any);

      await expect(movieService.deleteMovie('nonexistent-id')).rejects.toThrow('Movie not found');
      expect(mockMovieModel.findByIdAndDelete).toHaveBeenCalledWith('nonexistent-id');
    });

    // true} option on updates
    it('should update movie and return updated movie when valid ID and update data are provided', async () => {
      const mockUpdatedMovie = {
        id: '123',
        title: 'Updated Movie',
        description: 'Updated Description',
        genres: [],
        releaseDate: new Date(),
        director: 'Updated Director',
        actors: []
      };

      const mockUpdateMovieDto = {
        title: 'Updated Movie',
        description: 'Updated Description'
      };

      const mockMovieModel = {
        findByIdAndUpdate: jest.fn().mockReturnValue(mockUpdatedMovie)
      };

      const movieService = new MovieService(mockMovieModel as any);

      const result = await movieService.updateMovie('123', mockUpdateMovieDto);

      expect(mockMovieModel.findByIdAndUpdate).toHaveBeenCalledWith('123', mockUpdateMovieDto, { new: true });
      expect(result).toEqual(mockUpdatedMovie);
    });
});
