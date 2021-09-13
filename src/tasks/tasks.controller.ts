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

import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDTO } from './DTO/create-task.dto';
import { UpdateTaskStatusDTO } from './DTO/update-task-status.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @UseGuards(AuthGuard())
  async getTasks(@GetUser() user: User): Promise<Task[]> {
    return await this.tasksService.getAllTasks(user);
  }

  @Get('/:id')
  @UseGuards(AuthGuard())
  async getTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Task> {
    return await this.tasksService.getTaskById(id, user);
  }

  @Post()
  @UseGuards(AuthGuard())
  async createTask(
    @Body() createTaskDTO: CreateTaskDTO,
    @GetUser() user: User,
  ): Promise<Task> {
    return await this.tasksService.createTask(createTaskDTO, user);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard())
  async deleteTask(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<void> {
    await this.tasksService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  @UseGuards(AuthGuard())
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDTO: UpdateTaskStatusDTO,
    @GetUser() user: User,
  ): Promise<Task> {
    return await this.tasksService.updateTask(id, updateTaskDTO, user);
  }
}
