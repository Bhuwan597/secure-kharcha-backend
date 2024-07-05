import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    @InjectModel(User.name) private userModel: mongoose.Model<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authorization.split(' ')[1];

    try {
      const decodedToken = await this.authService.verifyToken(token);
      const { email, email_verified } = decodedToken;
      let user = await this.userModel.findOne({
        email,
      });
      if(!user){
        throw new UnauthorizedException("Unauthorized user.")
      }
      if (email_verified && !user.emailVerified) {
        user = await this.userModel.findByIdAndUpdate(
          user._id,
          {
            emailVerified: true,
          },
          { new: true },
        );
      }
      if (!email_verified) {
        throw new UnauthorizedException('Email not verified.');
      }
      request.user = user;
      return true;
    } catch (err) {
      console.log(err)
      throw new UnauthorizedException('Invalid token');
    }
  }
}
