import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'postgres',
      host:'localhost',
      port:5432,
      username:'postgres',
      password:'postgres',
      database:'pract',
      autoLoadEntities:true,
      synchronize:true,
  
    }),
  
    
    
    
   AuthModule, UserModule, RoleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}




