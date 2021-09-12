import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateTaskDTO } from './DTO/create-task.dto';
import { UpdateTaskStatusDTO } from './DTO/update-task-status.dto';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
  ) {}

  getAllTasks(): Promise<Task[]> {
    return this.tasksRepository.findTasks();
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.tasksRepository.findTask(id);

    if (!task) {
      throw new NotFoundException();
    }

    return task;
  }

  createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDTO);
  }

  async deleteTask(id: string): Promise<void> {
    const hasBeenFoundAndDeleted = await this.tasksRepository.deleteTask(id);

    if (!hasBeenFoundAndDeleted) {
      throw new NotFoundException();
    }
  }

  async updateTask(id: string, { status }: UpdateTaskStatusDTO): Promise<Task> {
    const task = await this.getTaskById(id);

    task.status = status;

    await this.tasksRepository.saveTask(task);

    return task;
  }
}
