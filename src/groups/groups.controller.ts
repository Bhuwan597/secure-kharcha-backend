import { Body, Controller, Get, Param, Post, Req, UseGuards, Put, BadRequestException, Query } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dtos/create-group.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { UpdateGroupDto } from './dtos/update-group.dto';
import { JoinGroupDto } from './dtos/join-group.dto';

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
  async getGroup(@Param('slug') slug : string, @Req() req: Request, @Query("token") token?: string) {
    return this.groupService.getGroup(slug, req, token);
  }
  @Post()
  @UseGuards(AuthGuard)
  async createGroup(@Req() req: Request, @Body() groupData: CreateGroupDto) {
    return this.groupService.createGroup(groupData, req);
  }
  @Put(':slug')
  @UseGuards(AuthGuard)
  async updateGroup(@Req() req: Request, @Param('slug') slug : string, @Body() groupData: UpdateGroupDto) {
    return this.groupService.updateGroup(req, groupData, slug);
  }

  @Post('/join/:slug')
  @UseGuards(AuthGuard)
  async joinGroup(@Param('slug') slug : string, @Body() joinData: JoinGroupDto, @Req() req: Request){
    return await this.groupService.joinGroup(slug, joinData, req);
  }
}
