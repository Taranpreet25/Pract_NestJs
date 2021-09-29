import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStratergy } from './jwt.strategy';
import { UserRepository } from 'src/user/user.repository';
import { ForgetPassWordRepository } from './forget-password.repository';


@Module({           
  imports: [

    
    PassportModule.register({ defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: 'topSecret51',
      signOptions:{
        expiresIn: 3600,
      }
    }),
    TypeOrmModule.forFeature([UserRepository,ForgetPassWordRepository])],                   
  providers: [AuthService, JwtStratergy],
  controllers: [AuthController],

  exports:[JwtStratergy, PassportModule],
}) 
export class AuthModule {}
