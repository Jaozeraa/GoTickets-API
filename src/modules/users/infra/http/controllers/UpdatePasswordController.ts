import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdatePasswordService from '@modules/users/services/UpdatePasswordService';

export default class UpdatePasswordController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { old_password, password } = request.body;

    const user_id = request.user.id;

    const updatePassword = container.resolve(UpdatePasswordService);

    const user = await updatePassword.execute({
      user_id,
      old_password,
      password,
    });

    return response.json(classToClass(user));
  }
}
