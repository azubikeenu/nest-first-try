import { Injectable, BadRequestException, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UnauthorizedException } from '@nestjs/common/exceptions';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}


  async signUp(payload: CreateUserDto) {
    const { email, password } = payload;

    const users = await this.userService.find(email);
    if (users.length) throw new BadRequestException(`${email} already in use`);

    const salt = randomBytes(8).toString('hex');
    const buffer  = (await scrypt(password, salt, 32)) as Buffer;
    const hashedPassword = `${salt}.${buffer.toString('hex')}`;

    const user = await this.userService.create({
      email,
      password: hashedPassword,
    });
    return user;
  }

  async signIn(email: string, password: string): Promise<User> {
    const [user] = await this.userService.find(email);

    const MESSAGE = 'Invalid email or password';

    if (!user) throw new UnauthorizedException(MESSAGE);
    const [salt, userPassword] = user.password.split('.');

    const buffer = (await scrypt(password, salt, 32)) as Buffer;

    if (buffer.toString('hex') !== userPassword)
      throw new UnauthorizedException(MESSAGE);

    return user;
  }
}
