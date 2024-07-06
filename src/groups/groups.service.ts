import { BadRequestException, Injectable, Req, Type } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from './schemas/group.schema';
import mongoose, { Types } from 'mongoose';
import { CreateGroupDto } from './dtos/create-group.dto';
import { User } from 'src/user/schemas/user.schema';
import { Request } from 'express';
import { generate } from 'rand-token';
import { UpdateGroupDto } from './dtos/update-group.dto';
import { JoinGroupDto } from './dtos/join-group.dto';

declare module 'express' {
  interface Request {
    user?: User;
  }
}
interface GroupMemberInterface {
  user: Types.ObjectId;
  joinedAt: string;
}

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group.name) private groupModel: mongoose.Model<Group>,
  ) {}

  async getAllGroups(@Req() req: Request) {
    return await this.groupModel
      .find({
        $or: [
          { owner: req.user._id },
          { members: { $elemMatch: { user: req.user._id } } },
        ],
      })
      .sort({
        createdAt: 'desc',
      })
      .populate('owner')
      .populate({
        path: 'members',
        populate: {
          path: 'user',
          model: 'User',
        },
      })
      .populate('transactions', 'amount split');
  }

  async getGroup(slug: string, req: Request, token?: string) {
    const groupDetails = await this.groupModel
      .findOne({
        _id: slug,
        $or: [
          { owner: req.user._id },
          { members: { $elemMatch: { user: req.user._id } } },
          { token: token },
        ],
      })
      .populate('owner')
      .populate({
        path: 'members',
        populate: {
          path: 'user',
          model: 'User',
        },
      })
      .populate({
        path: 'transactions',
        populate: [
          {
            path: 'transactionBy',
            model: 'User',
            select: 'displayName firstName lastName photo _id email',
          },
          {
            path: 'exclude',
            model: 'User',
          },
        ],
      });
    return groupDetails;
  }

  async createGroup(formData: CreateGroupDto, req: Request): Promise<Group> {
    const group = await this.groupModel.create({
      ...formData,
      owner: req.user._id,
      members: [{ user: req.user._id }],
      token: generate(64),
      activities: [
        { displayName: req.user.displayName, content: 'created the group' },
      ],
    });
    return group;
  }

  async updateGroup(req: Request, formData: UpdateGroupDto, slug: string) {
    return await this.groupModel.findOneAndUpdate(
      { _id: slug },
      {
        ...formData,
        $push: {
          activities: {
            displayName: req.user.displayName,
            content: 'updated the group',
          },
        },
      },
      {
        new: true,
      },
    );
  }

  async joinGroup(group: string, joinData: JoinGroupDto, req: Request) {
    const dbGroup = await this.groupModel.findOne({
      _id: group,
      token: joinData.token,
    });
    if (!dbGroup) {
      throw new BadRequestException("Link is invalid or group doesn't exists.");
    }
    if (
      dbGroup.members.some((member) =>
        member.user.equals(req.user._id as Types.ObjectId),
      )
    ) {
      throw new BadRequestException('You are already in this group.');
    }
    const updateGroup = await this.groupModel.findOneAndUpdate(
      {
        _id: group,
        token: joinData.token,
      },
      {
        $push: {
          members: {
            user: req.user._id,
          },
          activities: {
            displayName: req.user._id,
            content: 'joined the group',
          },
        },
      },
    );
    return updateGroup;
  }
}
