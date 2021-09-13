import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDTO } from './DTO/create-task.dto';

import { User } from 'src/auth/user.entity';
import { Task } from './task.entity';
import { TaskStatus } from './task.model';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async findTask(id: string, user: User): Promise<Task> {
    return await this.createQueryBuilder('task')
      .leftJoin('task.user', 'user')
      .addSelect('user.id')
      .addSelect('user.username')
      .where({ id, user })
      .getOne();
  }

  async findTasks(user: User): Promise<Task[]> {
    return await this.createQueryBuilder('task')
      .leftJoin('task.user', 'user')
      .addSelect('user.id')
      .addSelect('user.username')
      .where({ user })
      .getMany();
  }

  async createTask(createTaskDto: CreateTaskDTO, user: User) {
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
  }

  async deleteTask(id: string, user: User): Promise<boolean> {
    const { affected } = await this.delete({ id, user });

    return !!affected;
  }

  async saveTask(task: Task): Promise<void> {
    await this.save(task);
  }
}
