import { Body, Controller, Post } from '@nestjs/common';
import { Role } from 'src/entity/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
    constructor(private roleService: RoleService, ) {}

    @Post('/role')
    createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
        return this.roleService.createRole(createRoleDto);
      }
    
}
