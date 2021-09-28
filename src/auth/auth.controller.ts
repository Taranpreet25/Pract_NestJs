import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.authService.signUp(createUserDto);
  }

  @Post('/signin')
  signin(
    @Body() authCredentialdto: AuthCredentialDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialdto);
  }

  @Get()
  getUser(): Promise<User[]> {
    return this.authService.getUser();
  }
}
