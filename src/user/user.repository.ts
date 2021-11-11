import {
  BadGatewayException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuid } from 'uuid';
import { ProfilePicDto } from 'src/auth/dto/profile-pic.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
 
    async createUser(createUserDto: CreateUserDto): Promise<void> {
    const {
      first_name,
      last_name,
      username,
      email,
      password,
      phone_no,
      role_id,
    } = createUserDto;

    //hash the password
    const salt = bcrypt.genSalt();
    console.log(salt);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      userId: uuid(),
      firstName: first_name,
      lastName: last_name,
      email: email,
      username: username,
      password: hashedPassword,
      salt: salt,
      phoneNo: phone_no,
      role_id: role_id,
    });

    //imp for unique user name we genrate a rendom message
    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
      // console.log(error.code);
    }
  }

  async getUser(): Promise<User[]> {
    const query = this.createQueryBuilder('user');
    query.leftJoinAndSelect('user.role', 'role');
    try {
      const user = await query.getMany();
      return user;
    } catch (error) {
      if (error) {
        throw new BadGatewayException('Not able to fetch data plese try again');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async createNewUser(createUserDto: CreateUserDto, user:User): Promise<void> {
    
    // user.userId

    const {
      first_name,
      last_name,
      username,
      email,
      password,
      phone_no,
      role_id,
    //   created_by=user.userId,
    } = createUserDto;

    
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const profile_pic = user.profilePic;

    const userac = this.create({
      userId: uuid(),
      firstName: first_name,
      lastName: last_name,
      email: email,
      username: username,
      password: hashedPassword,
      salt: salt,
      phoneNo: phone_no,
      role_id: role_id,
      createdBy:user.userId,
      createdDate: new Date(),
      profilePic: profile_pic,
    });
    try {
      await this.save(userac);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }
































}
