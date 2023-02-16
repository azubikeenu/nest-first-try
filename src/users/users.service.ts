import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(newUser: CreateUserDto): Promise<User> {
    const user = this.repo.create(newUser);
    return await this.repo.save(user);
  }

  async findOne(id: number): Promise<User> {
    if(!id) return null;
    // i didnt check for NotFoundException because the findOneMethod is used in global interceptor which would throw an error if user isnt found
    const found = await this.repo.findOneBy({ id });
    return found;
  }

  async find(email: string): Promise<User[]> {
    return await this.repo.findBy({ email });
  }

  async update(id: number, attrs: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
     if (!user) throw new NotFoundException(`user with id ${id} not found`);
    const updatedUser = { ...user, ...attrs };
    return await this.repo.save(updatedUser);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`User with id ${id} not found`);
  }
}
