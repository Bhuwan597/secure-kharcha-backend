import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Request } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: mongoose.Model<User>,
  ) {}
  async getUser() {
    return 1;
  }

  async createUser(formData: CreateUserDto): Promise<User> {
    const user = await this.userModel.findOne({ email: formData.email });
    if (user && user.provider === 'password')
      throw new BadRequestException('User already exists.');
    if (!user) {
      const createdUser = await this.userModel.create({
        displayName: !formData.displayName
          ? formData.firstName + ' ' + formData.lastName
          : formData.displayName,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        eSewa: formData.eSewa,
        photo: formData.photo,
        provider: formData.provider,
      });
      return await this.userModel.findById(createdUser.id);
    } else {
      return user;
    }
  }

  async updateUser(req: Request, userData: UpdateUserDto){
    const user =  await this.userModel.findByIdAndUpdate(req.user._id, userData, {new: true});
    if(!user){
      throw new InternalServerErrorException("Some error occured.")
    }
    return user;
  }
}
