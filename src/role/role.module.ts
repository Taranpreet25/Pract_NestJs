import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { rolerepository } from './role.repository';
import { RoleService } from './role.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([rolerepository])],

  controllers: [RoleController],

  providers: [RoleService]
})
export class RoleModule {}
