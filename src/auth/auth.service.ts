import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credentials.dto';

import * as bcrypt from 'bcrypt'; 
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from "uuid";

import { JwtPayload } from './jwt-payload.interface';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserRepository } from 'src/user/user.repository';
import { User } from 'src/entity/user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository:UserRepository,
        private jwtService: JwtService,    
    ){}

    async signUp(createUserDto:CreateUserDto): Promise<void>{
        return this.userRepository.createUser(createUserDto);
    }


    //why we not comparemhere hashed password mean where is salt 
    async signIn(authCredentialDto:AuthCredentialDto): Promise<{accessToken: string}>{
        const { username , password} = authCredentialDto;

        const user = await this.userRepository.findOne({ username});

        if( user && (await bcrypt.compare(password, user.password) )){
            // return 'success'; // we use the jwt right after the sight in if user sight in first time a token is genrated for sign in next time;
        
            const payload:JwtPayload = { username };
            const accessToken: string = await this.jwtService.sign(payload);
            return { accessToken };
        
        
        
        } else{
            throw new UnauthorizedException('please check your login credentials');
        }
    
    }

    getUser():Promise<User[]>{
        return this.userRepository.getUser();
    }


}

    
