import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '@base/base.service';
import { Todo } from '@entities/todo.entity';

@Injectable()
export class TodoService extends BaseService<Todo> {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {
    super(todoRepository);
  }
}
