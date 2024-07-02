import { Controller, Get, Req, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './user/schemas/user.schema';
import { AuthGuard } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(AuthGuard)
  getHello(@Req() req : Request & {user: User}): string {
    const {emailVerified} = req.user as User;
    console.log(emailVerified)
    return this.appService.getHello();
  };
}
