import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ICurrentUser } from './current-user.interface.js';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const currentUser: ICurrentUser = {
      id: 'default1',
      name: 'default user',
      email: 'default-user@example.com',
    };
    request['user'] = currentUser;

    // return validateRequest(request);
    return true;
  }
}
