import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AuthCredentialsDTO } from './DTO/auth-credentials.dto';
import { User } from './user.entity';

export enum USER_ERRORS {
  DUPLICATE_USERNAME = '23505',
}

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  private logger = new Logger();

  async createUser(authCredentials: AuthCredentialsDTO): Promise<void> {
    try {
      const { username, password } = authCredentials;

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = this.create({
        username,
        password: hashedPassword,
      });

      await this.save(user);
    } catch (error) {
      this.logger.error(
        `Failed to create user ${authCredentials.username}`,
        error,
      );
      throw new InternalServerErrorException();
    }
  }

  async findUserByUsername(username: string): Promise<User> {
    try {
      return await this.findOne({ username });
    } catch (error) {
      this.logger.error(`Failed to find user: ${username}`, error);
      throw new InternalServerErrorException();
    }
  }
}
