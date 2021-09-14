import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException, Logger } from '@nestjs/common';

import { CreateTaskDTO } from './DTO/create-task.dto';
import { User } from 'src/auth/user.entity';
import { Task } from './task.entity';
import { TaskStatus } from './task.model';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  private logger = new Logger('TasksRepository');

  async findTask(id: string, user: User): Promise<Task> {
    try {
      return await this.createQueryBuilder('task')
        .leftJoin('task.user', 'user')
        .addSelect('user.id')
        .addSelect('user.username')
        .where({ id, user })
        .getOne();
    } catch (error) {
      this.logger.error(
        `Failed to find task with id: ${id}, user: ${user.username}`,
        error,
      );
      throw new InternalServerErrorException();
    }
  }

  async findTasks(user: User): Promise<Task[]> {
    try {
      return await this.createQueryBuilder('task')
        .leftJoin('task.user', 'user')
        .addSelect('user.id')
        .addSelect('user.username')
        .where({ user })
        .getMany();
    } catch (error) {
      this.logger.error(
        `Failed to find tasks for user: ${user.username}`,
        error,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(createTaskDto: CreateTaskDTO, user: User) {
    try {
      const { title, description } = createTaskDto;

      const task = this.create({
        title,
        description,
        status: TaskStatus.OPEN,
        user,
      });

      await this.saveTask(task);
      delete task.user;

      return task;
    } catch (error) {
      this.logger.error(
        `Failed to create task with data: ${JSON.stringify(
          createTaskDto,
        )}, user: ${user.username}`,
        error,
      );
      throw new InternalServerErrorException();
    }
  }

  async deleteTask(id: string, user: User): Promise<boolean> {
    try {
      const { affected } = await this.delete({ id, user });

      return !!affected;
    } catch (error) {
      this.logger.error(
        `Failed to delete task with id:${id}, user: ${user.username}`,
        error,
      );
      throw new InternalServerErrorException();
    }
  }

  async saveTask(task: Task): Promise<void> {
    await this.save(task);
  }
}
