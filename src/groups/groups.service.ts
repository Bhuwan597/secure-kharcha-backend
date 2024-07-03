import { Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from './schemas/group.schema';
import mongoose from 'mongoose';
import { CreateGroupDto } from './dtos/create-group.dto';
import { User } from 'src/user/schemas/user.schema';
import { Request } from 'express';
import { generate } from 'rand-token';
import { UpdateGroupDto } from './dtos/update-group.dto';

declare module 'express' {
  interface Request {
    user?: User;
  }
}

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group.name) private groupModel: mongoose.Model<Group>,
  ) {}

  async getAllGroups(@Req() req: Request) {
    return await this.groupModel
      .find({
        owner: req.user._id,
        members: { $in: [req.user._id] },
      })
      .sort({
        createdAt: 'desc',
      });
  }

  async getGroup(slug: string) {
    return await this.groupModel
      .findOne({
        _id: slug,
      })
      .populate('owner')
      .populate('members')
      .populate({
        path: 'transactions',
        populate: {
          path: 'transactionBy',
          model: 'User',
          select: "displayName firstName lastName photo _id email"
        },
      });
  }

  async createGroup(formData: CreateGroupDto, req: Request): Promise<Group> {
    const group = await this.groupModel.create({
      ...formData,
      owner: req.user._id,
      members: [req.user._id],
      token: generate(64),
    });
    return group;
  }

  async updateGroup(formData: UpdateGroupDto, slug: string) {
    return await this.groupModel.findOneAndUpdate({ _id: slug }, formData, {
      new: true,
    });
  }
}
