import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller('users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 사용자 목록 가져오기 (Read)
  @Get()
  getAllUsers() {
    return this.appService.getAllUsers();
  }

  // 사용자 추가하기 (Create)
  @Post()
  createUser(@Body() userDto: { name: string; age: number }) {
    return this.appService.createUser(userDto);
  }

  // 특정 사용자 정보 가져오기 (Read by ID)
  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.appService.getUser(id);
  }

  // 사용자 업데이트하기 (Update)
  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() userDto: { name: string; age: number },
  ) {
    return this.appService.updateUser(id, userDto);
  }

  // 사용자 삭제하기 (Delete)
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.appService.deleteUser(id);
  }
}
