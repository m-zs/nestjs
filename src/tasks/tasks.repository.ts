import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDTO } from './DTO/create-task.dto';

import { Task } from './task.entity';
import { TaskStatus } from './task.model';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async findTask(id: string): Promise<Task> {
    return await this.findOne(id);
  }

  async findTasks(): Promise<Task[]> {
    return await this.createQueryBuilder('tasks').getMany();
  }

  async createTask(createTaskDto: CreateTaskDTO) {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.saveTask(task);

    return task;
  }

  async deleteTask(id: string): Promise<boolean> {
    const { affected } = await this.delete(id);

    return !!affected;
  }

  async saveTask(task: Task): Promise<void> {
    await this.save(task);
  }
}
