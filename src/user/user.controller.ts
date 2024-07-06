import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from './schemas/user.schema';
import { Request } from 'express';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getUser(@Req() req: Request & { user: User }) {
    const userObject = req.user;
    return userObject;
  }

  @Post()
  async createUser(@Body() userData: CreateUserDto) {
    return this.userService.createUser(userData);
  }

  @Put()
  @UseGuards(AuthGuard)
  async updateUser(@Req() req: Request, @Body() userData: UpdateUserDto) {
    return await this.userService.updateUser(req, userData);
  }
}
