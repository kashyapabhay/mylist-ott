import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.interface';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { LoggerService } from '../logger/logger.service';
import { UserNotFoundException } from './exceptions/user-not-found-exception';
import { DatabaseException } from 'src/exceptions/database.exception';
import { InvaldUserIdException } from './exceptions/invalid.user.id.exception';

@Injectable()
export class UserService {
  private readonly userModel: Model<User>;
  private readonly logger: LoggerService;

  constructor(
    @InjectModel('User') userModel: Model<User>,
    logger: LoggerService
  ) {
    this.userModel = userModel;
    this.logger = logger;
  }

  async addUser(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log('Going to create a new user for userName: ' + createUserDto.username);

    try {
      const newUser = await this.userModel.create(createUserDto);
      this.logger.log(`Successfully created user with userName: ${createUserDto.username}`);
      return newUser;
    } catch (error) {
      this.logger.error(`Error creating user with userName: ${createUserDto.username}`, error.stack);
      throw new DatabaseException('Error while creating user',error);
    }
  }



  async getUser(id: string): Promise<User | null> {
    this.logger.log(`Finding user with id: ${id}`);
    if(id === undefined || id === null){
      throw new InvaldUserIdException('id cannot be null or undefined');
    }
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new UserNotFoundException('User not found');
      }
      return user;
    } catch (error) {
      this.logger.error(`Error fetching user: ${error.message}`, error.stack);
      throw new DatabaseException(`Error while fetching user: ${id}`, error);
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    this.logger.log(`Updating user with id: ${id}`);
    if(id === undefined || id === null){
      throw new InvaldUserIdException('id cannot be null or undefined');
    }
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
      if (updatedUser) {
        this.logger.log(`Successfully updated user with id: ${id}`);
      } else {
        this.logger.error(`Failed to update user with id: ${id}`, "");
        throw new UserNotFoundException('User not found');
      }
      return updatedUser;
    } catch (error) {
      this.logger.error(`Error updating user: ${error.message}`, error.stack);
      throw new DatabaseException(`Error while updating user: ${id}`, error);
    }
  }

  async deleteUser(id: string): Promise<void> {
    this.logger.log(`Deleting user with id: ${id}`);
    if(id === undefined || id === null){
      throw new InvaldUserIdException('id cannot be null or undefined');
    }
    try {
      await this.userModel.findByIdAndDelete(id).exec();
      this.logger.log(`Successfully deleted user with id: ${id}`);
    } catch (error) {
      this.logger.error(`Error deleting user: ${error.message}`, error.stack);
      throw new DatabaseException(`Error while deleting user: ${id}`, error);
    }

  }
}
