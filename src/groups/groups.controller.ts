import { Body, Controller, Get, Param, Post, Req, UseGuards, Put } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dtos/create-group.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { UpdateGroupDto } from './dtos/update-group.dto';

@Controller('groups')
export class GroupsController {
  constructor(private groupService: GroupsService) {}
  @Get()
  @UseGuards(AuthGuard)
  async getAllGroups(@Req() req: Request) {
    return this.groupService.getAllGroups(req);
  }

  @Get(':slug')
  @UseGuards(AuthGuard)
  async getGroup(@Param('slug') slug : string) {
    return this.groupService.getGroup(slug);
  }
  @Post()
  @UseGuards(AuthGuard)
  async createGroup(@Req() req: Request, @Body() groupData: CreateGroupDto) {
    console.log(groupData);
    return this.groupService.createGroup(groupData, req);
  }
  @Put(':slug')
  @UseGuards(AuthGuard)
  async updateGroup(@Param('slug') slug : string, @Body() groupData: UpdateGroupDto) {
    return this.groupService.updateGroup(groupData, slug);
  }
}
