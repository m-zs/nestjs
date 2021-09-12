import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { AuthCredentialsDTO } from './DTO/auth-credentials.dto';
import { UsersRepository, USER_ERRORS } from './users.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentials: AuthCredentialsDTO): Promise<void> {
    try {
      return await this.usersRepository.createUser(authCredentials);
    } catch (error) {
      if (error.code === USER_ERRORS.DUPLICATE_USERNAME) {
        throw new ConflictException(
          `Username ${authCredentials.username} already exist`,
        );
      } else {
        throw new InternalServerErrorException('a');
      }
    }
  }

  async signIn(
    authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDTO;

    const user = await this.usersRepository.findUserByUsername(username);

    if (!(user && (await bcrypt.compare(password, user.password)))) {
      throw new UnauthorizedException();
    }

    return { accessToken: this.jwtService.sign({ username }) };
  }
}
