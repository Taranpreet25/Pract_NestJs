import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
// import * as jwt_decode from "jwt-decode";
import jwt_decode from 'jwt-decode';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import * as crypto from 'crypto';

import { JwtPayload } from './jwt-payload.interface';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserRepository } from 'src/user/user.repository';
import { User } from 'src/entity/user.entity';
import { ForgetPasswordDto } from './dto/forget-paasword.dto';
import { forgetPass } from './forget-Pass.interface';
import { forget_password } from 'src/entity/forget-password.entity';

import { ForgetPassWordRepository } from './forget-password.repository';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { NewPasswordDto } from './dto/new-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private forgetPasswordRepository: ForgetPassWordRepository,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<void> {
    return this.userRepository.createUser(createUserDto);
  }

  //why we not comparemhere hashed password mean where is salt
  async signIn(
    authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialDto;

    const user = await this.userRepository.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      // return 'success'; // we use the jwt right after the sight in if user sight in first time a token is genrated for sign in next time;

      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('please check your login credentials');
    }
  }

  getUser(): Promise<User[]> {
    return this.userRepository.getUser();
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    const { email } = forgetPasswordDto;
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new NotFoundException(
        `Email is not registered with us. Please check the email.`,
      );
    }
    var unixTimestamp = Math.round(new Date().getTime() / 1000);

    const tokenhash = crypto
      .createHmac('sha256', unixTimestamp.toString())
      .digest('hex');

    const payload: forgetPass = {
      email,
      tokenhash,
    };

    const forgetPassToken = this.jwtService.sign(payload);
    const resetLink = `http://localhost:3000/auth/reset-password?token=${forgetPassToken}`;

    const row = new forget_password();
    row.email = email;
    row.token = tokenhash;
    row.createTime = new Date();
    row.updateTime = new Date();

    try {
      await row.save();
      console.log(resetLink);
    } catch (error) {
      // console.log(error)
      throw new InternalServerErrorException(
        `Oops. Something went wrong. Please try again.`,
      );
    }
    const token = { message: `Link sent to your email address successfully.` };
    return token;
  }

  async updatePassword(
    updatePasswordDto: UpdatePasswordDto,
    newPasswordDto: NewPasswordDto,
  ) {
    const { token } = updatePasswordDto;
    const { new_password } = newPasswordDto;
    var decoded: any;
    decoded = jwt_decode(token);
    const { email, tokenhash, iat } = decoded;
    const unixTimestamp = Math.round(new Date().getTime() / 1000);
    const time = unixTimestamp - iat;
    if (time >= 900) {
      throw new BadRequestException(
        `Token Is Expired. Please Try Again.&&&token&&&`,
      );
    }
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new NotFoundException(
        `Email is not registered with us. Please check the email.&&&email`,
      );
    }

    const validToken = await this.forgetPasswordRepository.findOne({
      where: { email: email, is_used: 0, token: tokenhash },
    });
    if (validToken && validToken.validateToken(tokenhash)) {
      const salt = await bcrypt.genSalt();
      user.salt = salt;
      user.password = await bcrypt.hash(new_password, salt);
      validToken.is_used = 1;
      validToken.updateTime = new Date();
      try {
        await user.save();
        await validToken.save();
        const res = { message: `Your Password has been succesfully updated` };
        return res;
      } catch (error) {
        throw new InternalServerErrorException(`${error.sqlMessage}&&& &&&`);
      }
    } else {
      throw new BadRequestException(`Token Can not be validate.&&&token&&&`);
    }
  }

  async createUser(createUserDto: CreateUserDto, user:User): Promise<void> {
    return this.userRepository.createNewUser(createUserDto, user);
  }
}
