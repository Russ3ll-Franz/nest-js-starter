import { Controller, Post, Body, HttpException, HttpStatus, Get } from '@nestjs/common';
import {
  ApiImplicitBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { baseControllerFactory } from '@modules/base/base.controller';
import { User } from '@modules/user/user.entity';
import { UserService } from '@modules/user/user.service';
import { getOperationId } from '@utils/get-operation-id';
import {
  UserCreateVM,
  UserUpdateVM,
  UserFindVM,
  UserLogedVM,
  UserCredentialsVM,
} from '@modules/user/user.view-model';
import { ApiException } from '@models/api-exception.model';

const BaseController = baseControllerFactory<User>(User, UserCreateVM, UserUpdateVM, UserFindVM);

@Controller('user')
export class UserController extends BaseController {
  constructor(
    private readonly userService: UserService,
  ) {
    super(userService);
  }

  @Post('register')
  @ApiImplicitBody({
    name: UserCreateVM.name,
    type: UserCreateVM,
    description: 'Register data',
    required: true,
    isArray: false,
  })
  @ApiCreatedResponse({ type: UserFindVM })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation(getOperationId(UserCreateVM.name, 'Create'))
  public async create(@Body() vm: UserCreateVM): Promise<UserFindVM | any> {
    const {
      username,
      password,
    } = vm;

    if (!username) {
      throw new HttpException('Username is required', HttpStatus.BAD_REQUEST);
    }

    if (!password) {
      throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
    }

    let exist;

    try {
      exist = await this.userService.findOne({
        username: username.toLowerCase(),
      });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (exist.length) {
      throw new HttpException(`${username} exists`, HttpStatus.BAD_REQUEST);
    }

    const newUser = await this.userService.register(vm);

    return this.userService.map<UserFindVM>(newUser);
  }

  @Post('login')
  @ApiImplicitBody({
    name: UserCredentialsVM.name,
    type: UserCredentialsVM,
    description: 'Login credentials',
    required: true,
    isArray: false,
  })
  @ApiCreatedResponse({ type: UserLogedVM })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation(getOperationId(UserCredentialsVM.name, 'Create'))
  public login(@Body() vm: UserCredentialsVM): Promise<UserLogedVM> {
    return this.userService.login(vm);
  }
}
