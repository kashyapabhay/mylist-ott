
import { DatabaseException } from "src/exceptions/database.exception";
import { InvaldUserIdException } from "src/user/exceptions/invalid.user.id.exception";
import { UserNotFoundException } from "src/user/exceptions/user-not-found-exception";
import { CreateUserDto, UpdateUserDto } from "src/user/user.dto";
import { User } from "src/user/user.interface";
import { UserService } from "src/user/user.service";

describe('UserService', () => {

    // Successfully create new user with valid CreateUserDto
    it('should create new user when valid CreateUserDto is provided', async () => {
      const mockUserModel = {
        create: jest.fn()
      };

      const createUserDto: CreateUserDto = {
        username: 'testUser',
        preferences: {
          favoriteGenres: [],
          dislikedGenres: []
        },
        watchHistory: []
      };

      const expectedUser: User = {
        id: '123',
        ...createUserDto
      };

      mockUserModel.create.mockResolvedValue(expectedUser);

      const userService = new UserService(mockUserModel as any);

      const result = await userService.addUser(createUserDto);

      expect(mockUserModel.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedUser);
    });

    // Handle null/undefined user ID for get/update/delete operations
    it('should throw InvaldUserIdException when getting user with undefined ID', async () => {
      const mockUserModel = {
        findById: jest.fn()
      };

      const userService = new UserService(mockUserModel as any);

      await expect(userService.getUser(undefined)).rejects.toThrow(InvaldUserIdException);
      await expect(userService.getUser(undefined)).rejects.toThrow('id cannot be null or undefined');

      expect(mockUserModel.findById).not.toHaveBeenCalled();
    });

    // Successfully delete existing user by ID
    it('should delete user when valid ID is provided', async () => {
      const mockUserModel = {
        findByIdAndDelete: jest.fn()
      };

      const userId = '123';

      mockUserModel.findByIdAndDelete.mockResolvedValue(null);

      const userService = new UserService(mockUserModel as any);

      await userService.deleteUser(userId);

      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith(userId);
    });

    // Successfully retrieve existing user by valid ID
    it('should return user when valid ID is provided', async () => {
      const mockUserModel = {
        findById: jest.fn()
      };

      const expectedUser: User = {
        id: '123',
        username: 'testUser',
        preferences: {
          favoriteGenres: [],
          dislikedGenres: []
        },
        watchHistory: []
      };

      mockUserModel.findById.mockResolvedValue(expectedUser);

      const userService = new UserService(mockUserModel as any);

      const result = await userService.getUser('123');

      expect(mockUserModel.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(expectedUser);
    });

    // Successfully update user with valid UpdateUserDto
    it('should update user when valid UpdateUserDto is provided', async () => {
      const mockUserModel = {
        findByIdAndUpdate: jest.fn()
      };

      const updateUserDto: UpdateUserDto = {
        username: 'updatedUser',
        preferences: {
          favoriteGenres: ['Action'],
          dislikedGenres: ['Horror']
        },
        watchHistory: [
          { contentId: '456', watchedOn: new Date(), rating: 5 }
        ]
      };

      const expectedUser: User = {
        id: '123',
        username: 'updatedUser',
        preferences: {
          favoriteGenres: ['Action'],
          dislikedGenres: ['Horror']
        },
        watchHistory: [
          { contentId: '456', watchedOn: new Date(), rating: 5 }
        ]
      };

      mockUserModel.findByIdAndUpdate.mockResolvedValue(expectedUser);

      const userService = new UserService(mockUserModel as any);

      const result = await userService.updateUser('123', updateUserDto);

      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith('123', updateUserDto, { new: true });
      console.log(result);
      expect(result).toEqual(expectedUser);
    });

    // Handle database errors during CRUD operations
    it('should throw DatabaseException when database error occurs during addUser', async () => {
      const mockUserModel = {
        create: jest.fn()
      };

      const createUserDto: CreateUserDto = {
        username: 'testUser',
        preferences: {
          favoriteGenres: [],
          dislikedGenres: []
        },
        watchHistory: []
      };

      const mockError = new Error('Database error');
      mockUserModel.create.mockRejectedValue(mockError);

      const userService = new UserService(mockUserModel as any);

      await expect(userService.addUser(createUserDto)).rejects.toThrow(DatabaseException);
      expect(mockUserModel.create).toHaveBeenCalledWith(createUserDto);
    });

    // Handle non-existent user ID for get/update operations
    it('should throw UserNotFoundException when user ID does not exist for getUser', async () => {
      const mockUserModel = {
        findById: jest.fn()
      };

      const nonExistentUserId = 'nonExistentId';

      mockUserModel.findById.mockResolvedValue(null);

      const userService = new UserService(mockUserModel as any);

      await expect(userService.getUser(nonExistentUserId)).rejects.toThrow(UserNotFoundException);
      expect(mockUserModel.findById).toHaveBeenCalledWith(nonExistentUserId);
    });

  

    // Handle invalid user data format in create/update operations
    it('should throw DatabaseException when invalid CreateUserDto is provided', async () => {
      const mockUserModel = {
        create: jest.fn()
      };

      const invalidCreateUserDto: any = {
        username: '', // Invalid as it's empty
        preferences: {
          favoriteGenres: [],
          dislikedGenres: []
        },
        watchHistory: []
      };

      mockUserModel.create.mockRejectedValue(new Error('Validation failed'));

      const userService = new UserService(mockUserModel as any);

      await expect(userService.addUser(invalidCreateUserDto)).rejects.toThrow(DatabaseException);
      expect(mockUserModel.create).toHaveBeenCalledWith(invalidCreateUserDto);
    });

    // Return null when user not found in get operation
    it('should return null when user is not found', async () => {
      const mockUserModel = {
        findById: jest.fn()
      };

      const userId = 'nonexistentId';

      mockUserModel.findById.mockResolvedValue(null);

      const userService = new UserService(mockUserModel as any);

      await expect(userService.getUser(userId)).rejects.toThrow(UserNotFoundException);
      expect(mockUserModel.findById).toHaveBeenCalledWith(userId);
    });

    // Throw UserNotFoundException when user not found in update
    it('should throw UserNotFoundException when user not found during update', async () => {
      const mockUserModel = {
        findByIdAndUpdate: jest.fn().mockResolvedValue(null)
      };

      const updateUserDto: UpdateUserDto = {
        username: 'updatedUser',
        preferences: {
          favoriteGenres: [],
          dislikedGenres: []
        },
        watchHistory: []
      };

      const userService = new UserService(mockUserModel as any);

      await expect(userService.updateUser('nonexistentId', updateUserDto))
        .rejects
        .toThrow(UserNotFoundException);

      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith('nonexistentId', updateUserDto, { new: true });
    });

    // Validate user preferences and watch history format
    it('should validate user preferences and watch history format when creating a new user', async () => {
      const mockUserModel = {
        create: jest.fn()
      };

      const createUserDto: CreateUserDto = {
        username: 'testUser',
        preferences: {
          favoriteGenres: ['Action', 'Comedy'],
          dislikedGenres: ['Horror']
        },
        watchHistory: [
          {
            contentId: 'content123',
            watchedOn: new Date(),
            rating: 5
          }
        ]
      };

      const expectedUser: User = {
        id: '123',
        ...createUserDto
      };

      mockUserModel.create.mockResolvedValue(expectedUser);

      const userService = new UserService(mockUserModel as any);

      const result = await userService.addUser(createUserDto);

      expect(mockUserModel.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedUser);
    });

  
});
