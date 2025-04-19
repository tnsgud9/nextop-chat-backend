import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // static 배열로 임시 사용자 데이터 관리
  private readonly users = [
    { id: '1', name: 'John Doe', age: 30 },
    { id: '2', name: 'Jane Doe', age: 25 },
  ];

  // 모든 사용자 가져오기 (Read)
  getAllUsers() {
    return this.users;
  }

  // 사용자 추가하기 (Create)
  createUser(userDto: { name: string; age: number }) {
    const newUser = {
      id: (this.users.length + 1).toString(),
      ...userDto,
    };
    this.users.push(newUser);
    return newUser;
  }

  // 특정 사용자 가져오기 (Read by ID)
  getUser(id: string) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      return { message: 'User not found' };
    }
    return user;
  }

  // 사용자 업데이트하기 (Update)
  updateUser(id: string, userDto: { name: string; age: number }) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return { message: 'User not found' };
    }
    this.users[userIndex] = { id, ...userDto };
    return this.users[userIndex];
  }

  // 사용자 삭제하기 (Delete)
  deleteUser(id: string) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return { message: 'User not found' };
    }
    this.users.splice(userIndex, 1);
    return { message: 'User deleted' };
  }
}
