import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.interface';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { LoggerService } from '../logger/logger.service';
import { UserNotFoundException } from './exceptions/user-not-found-exception';

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

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log('Going to create a new user for userName: ' + createUserDto.username);
    
    const newUser = await this.userModel.create(createUserDto);
    this.logger.log(`Successfully created user with userName: ${createUserDto.username}`);
    return newUser;
  }

  async findAll(): Promise<User[]> {
    this.logger.log('Finding all users');
    const users = await this.userModel.find().exec();
    this.logger.log('Successfully found all users');
    return users;
  }

  async exist(id: string): Promise<User | null> {
    this.logger.log(`Finding user with id: ${id}`);
    const user = await this.userModel.findById(id).exec();
    if (user) {
      this.logger.log(`Successfully found user with id: ${id}`);
    } else {
      throw new UserNotFoundException(`User with id: ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    this.logger.log(`Updating user with id: ${id}`);
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    if (updatedUser) {
      this.logger.log(`Successfully updated user with id: ${id}`);
    } else {
      this.logger.log(`Failed to update user with id: ${id}`);
    }
    return updatedUser;
  }

  async delete(id: string): Promise<User | null> {
    this.logger.log(`Deleting user with id: ${id}`);
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (deletedUser) {
      this.logger.log(`Successfully deleted user with id: ${id}`);
    } else {
      this.logger.log(`Failed to delete user with id: ${id}`);
    }
    return deletedUser;
  }
}
