import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';

import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';


describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;
  let validUser: Partial<User>;

  beforeEach(async () => {
    validUser = { id: 1, email: 'test@gmail.com', password: 'userpass' };
    fakeAuthService = {
      signIn: (email: string, password: string) =>
        Promise.resolve(validUser as User),
      signUp: (payload: CreateUserDto) => Promise.resolve(validUser as User),
    };

    fakeUsersService = {
      findOne: (id: number) => Promise.resolve({ id ,...validUser} as User),
      find: (email: string) => Promise.resolve([{email ,...validUser} as User]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  it(`Should return a user when a valid id is passed` , async()=>{
       const user = await controller.getUser(1);
        expect(user).toBeDefined()
        expect(user.id).toBe(1)

  })
  it(`Should return a user when a valid email is sent` , async () => {
      const [user] = await controller.getUsers("test@gmail.com");
      expect(user).toBeDefined()
      expect(user.email).toBe("test@gmail.com")

  })
});
