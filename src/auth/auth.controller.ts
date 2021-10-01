import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/entity/role.entity';
import { User } from 'src/entity/user.entity';
import { UserRole } from 'src/enum/user-role.enum';
import { Roles } from 'src/guard/role.decorator';
import { RolesGuard } from 'src/guard/role.guard';
import { SiteUrl } from 'src/site-url.decorator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { ForgetPasswordDto } from './dto/forget-paasword.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { GetUser } from './get-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Sign-up new account of admin' })
  @ApiResponse({ status: 200, description: 'Api success' })
  @ApiResponse({ status: 422, description: 'Bad Request or API error message' })
  @ApiResponse({ status: 404, description: 'Not found!' })
  @ApiResponse({ status: 409, description: 'User Already Exist' })
  @ApiResponse({ status: 500, description: 'Internal server error!' })
  @HttpCode(200)
  signUp(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.authService.signUp(createUserDto);
  }

  @Post('/signin')
  @ApiOperation({ summary: 'Sign-in to your account of Admin/user' })
  @ApiResponse({ status: 200, description: 'Api success' })
  @ApiResponse({ status: 422, description: 'Bad Request or API error message' })
  @ApiResponse({ status: 404, description: 'Not found!' })
  @ApiResponse({ status: 409, description: 'User Already Exist' })
  @ApiResponse({ status: 500, description: 'Internal server error!' })
  @HttpCode(200)
  signin(
    @Body() authCredentialdto: AuthCredentialDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialdto);
  }

  @Get()
  @UseGuards(AuthGuard(),RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all accounts of user' })
  @ApiResponse({ status: 200, description: 'Api success' })
  @ApiResponse({ status: 422, description: 'Bad Request or API error message' })
  @ApiResponse({ status: 404, description: 'Not found!' })
  @ApiResponse({ status: 409, description: 'User Already Exist' })
  @ApiResponse({ status: 500, description: 'Internal server error!' })
  @HttpCode(200)
  getUser(): Promise<User[]> {
    return this.authService.getUser();
  }

  @Post('/forget-password')
  @ApiOperation({ summary: 'Forget password of your account' })
  @ApiResponse({ status: 200, description: 'Api success' })
  @ApiResponse({ status: 422, description: 'Bad Request or API error message' })
  @ApiResponse({ status: 404, description: 'Not found!' })
  @ApiResponse({ status: 409, description: 'User Already Exist' })
  @ApiResponse({ status: 500, description: 'Internal server error!' })
  @HttpCode(200)
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return await this.authService.forgetPassword(forgetPasswordDto);
  }

  @Post('/reset-password')
  @ApiOperation({ summary: 'Reset password of yhour account' })
  @ApiResponse({ status: 200, description: 'Api success' })
  @ApiResponse({ status: 422, description: 'Bad Request or API error message' })
  @ApiResponse({ status: 404, description: 'Not found!' })
  @ApiResponse({ status: 409, description: 'User Already Exist' })
  @ApiResponse({ status: 500, description: 'Internal server error!' })
  @HttpCode(200)
  async updatePassword(
    @Query() updatePasswordDto: UpdatePasswordDto,
    @Body() newPasswordDto: NewPasswordDto,
  ) {
    return this.authService.updatePassword(updatePasswordDto, newPasswordDto);
  }

  @Post('/create-user')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'create new account for user' })
  @ApiResponse({ status: 200, description: 'Api success' })
  @ApiResponse({ status: 422, description: 'Bad Request or API error message' })
  @ApiResponse({ status: 404, description: 'Not found!' })
  @ApiResponse({ status: 409, description: 'User Already Exist' })
  @ApiResponse({ status: 500, description: 'Internal server error!' })
  @HttpCode(200)
  createUser(
    @Body() createUserDto: CreateUserDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.authService.createUser(createUserDto, user);
  }
}
