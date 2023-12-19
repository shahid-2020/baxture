import { NextFunction, Request, Response, Router } from 'express';

import { isValidUUID } from '../../common/utils';
import { BadRequest, NotFound } from '../../http/exception';
import { Created, NoContent, Ok } from '../../http/response';
import { createUserCommand, updateUserCommand } from './user.schema';
import { UserService } from './user.service';

export class UserController {
  private router: Router;
  constructor(private readonly userService: UserService) {
    this.router = Router();
    this.findOne = this.findOne.bind(this);
    this.find = this.find.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!isValidUUID(id)) throw new BadRequest('Invalid uuid');
      const user = await this.userService.findOne(id);
      const response = user
        ? new Ok({ user })
        : new NotFound(`User does not exist: ${id}`);
      return res.status(response.statusCode).send(response);
    } catch (error: unknown) {
      return next(error);
    }
  }

  async find(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.find();
      const response = new Ok({ users });
      return res.status(response.statusCode).send(response);
    } catch (error: unknown) {
      return next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const command = createUserCommand.parse(req.body);
      const user = await this.userService.create(command);
      const response = new Created({ user });
      return res.status(response.statusCode).send(response);
    } catch (error: unknown) {
      return next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!isValidUUID(id)) throw new BadRequest('Invalid uuid');
      const command = updateUserCommand.parse(req.body);
      const user = await this.userService.update(id, command);
      const response = user
        ? new Ok({ user })
        : new NotFound(`User does not exist: ${id}`);
      return res.status(response.statusCode).send(response);
    } catch (error: unknown) {
      return next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!isValidUUID(id)) throw new BadRequest('Invalid uuid');
      const isDeleted = await this.userService.delete(id);
      const response = isDeleted
        ? new NoContent()
        : new NotFound(`User does not exist: ${id}`);
      return res.status(response.statusCode).send(response);
    } catch (error: unknown) {
      return next(error);
    }
  }

  public routes(): Router {
    this.router.route('/').get(this.find).post(this.create);

    this.router
      .route('/:id')
      .get(this.findOne)
      .put(this.update)
      .delete(this.delete);

    return this.router;
  }
}
