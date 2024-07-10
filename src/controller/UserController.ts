import { Body, Controller, Get, Path, Post, Route } from "tsoa";

interface User {
  id: number;
  username: string;
  email: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

@Route("users")
export class UserController extends Controller {


  @Post("login")
  public async login(@Body() requestBody: LoginCredentials): Promise<{ message: string; token: string }> {
    return { message: "登录成功", token: "fake-jwt-token" };
  }

  @Get("{userId}")
  public async getUser(@Path() userId: number): Promise<User> {
    return { id: userId, username: "user1", email: "user1@example.com" };
  }
}