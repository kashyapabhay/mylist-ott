import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './user.interface';
import { LoggerService } from 'src/logger/logger.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly logger: LoggerService
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.addUser(createUserDto);
  }


  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userService.updateUser(id, updateUserDto);
    if (!updatedUser) {
      throw new HttpException(`User with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return updatedUser;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
     await this.userService.deleteUser(id);
    
  }
}
