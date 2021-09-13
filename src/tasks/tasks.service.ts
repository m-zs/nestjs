import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/auth/user.entity';
import { CreateTaskDTO } from './DTO/create-task.dto';
import { UpdateTaskStatusDTO } from './DTO/update-task-status.dto';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
  ) {}

  getAllTasks(user: User): Promise<Task[]> {
    return this.tasksRepository.findTasks(user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findTask(id, user);

    if (!task) {
      throw new NotFoundException();
    }

    return task;
  }

  createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDTO, user);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const hasBeenFoundAndDeleted = await this.tasksRepository.deleteTask(
      id,
      user,
    );

    if (!hasBeenFoundAndDeleted) {
      throw new NotFoundException();
    }
  }

  async updateTask(
    id: string,
    { status }: UpdateTaskStatusDTO,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;

    await this.tasksRepository.saveTask(task);

    return task;
  }
}
