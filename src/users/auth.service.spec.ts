import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthService Test', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      create: (payload: CreateUserDto) => {
        const { email, password } = payload;
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  describe('SignUp', () => {
    it('can create an instance of AuthService', async () => {
      expect(service).toBeDefined();
    });

    it(`Should create a new user with a salted and hashed password`, async () => {
      const payload: CreateUserDto = {
        email: 'enuazubike88@gmail.com',
        password: 'userpass',
      };
      const user = await service.signUp(payload);
      expect(user.password).not.toEqual(payload.password);
      const [salt, hash] = user.password.split('.');
      expect(salt).toBeDefined();
      expect(hash).toBeDefined();
    });
    it(`Should throw an BadRequestException when a user with email exists`, async () => {
      const payload: CreateUserDto = {
        email: 'test@gmail.com',
        password: 'password',
      };
      await service.signUp(payload);
      const user = service.signUp(payload);
      expect(user).rejects.toThrow(
        new BadRequestException(`${payload.email} already in use`),
      );
    });
  });

  describe('SigIn', () => {
    it(`Should throw an UnauthorizedException when the an invalid email is supplied`, async () => {
      const payload: CreateUserDto = {
        email: 'test@gmail.com',
        password: 'password',
      };

      await service.signUp(payload);

      const user = service.signIn('wrongemail@gmail.com', payload.password);
      expect(user).rejects.toThrow(
        new UnauthorizedException(`Invalid email or password`),
      );
    });

    it(`Should throw an UnauthorizedException when the an invalid password is supplied`, async () => {
      const payload: CreateUserDto = {
        email: 'test@gmail.com',
        password: 'password',
      };

      await service.signUp(payload);
      const user = service.signIn(payload.email, 'wrongpwasword');
      expect(user).rejects.toThrow(
        new UnauthorizedException(`Invalid email or password`),
      );
    });

    it(`Should throw a user if correct credentials are supplied`, async () => {
      const email = 'test@gmail.com';
      const password = 'password';
      await service.signUp({ email, password });
      const user = await service.signIn(email, password);
      expect(user).toBeDefined();
      expect(user.password).not.toEqual(password);
    });
  });
});
