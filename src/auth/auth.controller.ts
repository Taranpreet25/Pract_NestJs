import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { SiteUrl } from 'src/site-url.decorator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { ForgetPasswordDto } from './dto/forget-paasword.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

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

  @Post("/forget-password")
	async forgetPassword(
		@Body() forgetPasswordDto: ForgetPasswordDto,
	) {
		return await this.authService.forgetPassword(forgetPasswordDto);
	}

    
	@Post("/reset-password")
	async updatePassword(
		@Query() updatePasswordDto: UpdatePasswordDto,
		@Body() newPasswordDto: NewPasswordDto
	) {
		return this.authService.updatePassword(updatePasswordDto, newPasswordDto);
	}
}
