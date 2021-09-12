import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreateTaskDTO } from './DTO/create-task.dto';
import { UpdateTaskStatusDTO } from './DTO/update-task-status.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async getTasks(): Promise<Task[]> {
    return await this.tasksService.getAllTasks();
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: string): Promise<Task> {
    return await this.tasksService.getTaskById(id);
  }

  @Post()
  @UseGuards(AuthGuard())
  async createTask(@Body() createTaskDTO: CreateTaskDTO): Promise<Task> {
    return await this.tasksService.createTask(createTaskDTO);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard())
  async deleteTask(@Param('id') id: string): Promise<void> {
    await this.tasksService.deleteTask(id);
  }

  @Patch('/:id/status')
  @UseGuards(AuthGuard())
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDTO: UpdateTaskStatusDTO,
  ): Promise<Task> {
    return await this.tasksService.updateTask(id, updateTaskDTO);
  }
}
