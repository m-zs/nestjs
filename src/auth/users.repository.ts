import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AuthCredentialsDTO } from './DTO/auth-credentials.dto';
import { User } from './user.entity';

export enum USER_ERRORS {
  DUPLICATE_USERNAME = '23505',
}

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(authCredentials: AuthCredentialsDTO): Promise<void> {
    const { username, password } = authCredentials;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.create({
      username,
      password: hashedPassword,
    });

    await this.save(user);
  }

  async findUserByUsername(username: string): Promise<User> {
    return await this.findOne({ username });
  }
}
