import {
  Body,
  Controller,
  Patch,
  Post,
  HttpCode,
  Session,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { Delete, Get, Param, Query } from '@nestjs/common/decorators';
import { UpdateUserDto } from './dto/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/currentUser.decorator';
import { AuthGuard } from  '../guards/auth.gaurd'


@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private service: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/sign-up')
  @HttpCode(201)
  async createUser(
    @Body() payload: CreateUserDto,
    @Session() session: any,
  ): Promise<User> {

    const user = await this.authService.signUp(payload);
    session.userId = user.id;
    return user;
  }

  @Post('/sign-in')
  async signIn(
    @Body() payload: CreateUserDto,
    @Session() session: any,
  ): Promise<User> {
    const { email, password } = payload;
    const user = await this.authService.signIn(email, password);
    session.userId = user.id;
    return user;
  }

  @Get('/sign-out')
  async signOut(@Session() session: any) {
    console.log("Here")
    session.userId = null;
  }
  @UseGuards(AuthGuard)
  @Get('/whoAmI')
  async getCurrentUser(@CurrentUser() user : User) {
    return user ;
  }

  @Get('/:id')
  getUser(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    this.service.remove(parseInt(id));
  }
  @Get()
  async getUsers(@Query('email') email :string){
   return  this.service.find(email)
  }

  @Patch('/:id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserPayload: UpdateUserDto,
  ) {
    return this.service.update(parseInt(id), updateUserPayload);
  }
}
