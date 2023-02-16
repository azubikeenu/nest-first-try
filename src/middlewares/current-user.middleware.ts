import { NestMiddleware, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}
  async use(req: Request, _: Response, next: NextFunction) {
    // from jwtoken if i was using a tba system
    const { userId } = req.session || {};
    if (userId) {
      const user = await this.usersService.findOne(parseInt(userId));
      req.currentUser = user;
    }
    next();
  }
}
