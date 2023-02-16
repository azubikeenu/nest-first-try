import {NestInterceptor ,ExecutionContext ,CallHandler , Injectable} from '@nestjs/common'
import { UsersService } from '../users.service'
import { Observable } from 'rxjs'

// the interceptor uses dependency injections
// it is passed to the usersModule to create an app level interceptor
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor{
    constructor(private userService : UsersService){}
    intercept( context: ExecutionContext,  next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
           const request = context.switchToHttp().getRequest();
           const {userId} = request.session || {} // get the userId from the session object
           if(userId){
            const user =  this.userService.findOne(parseInt(userId));
            request.currentUser = user
           }
        return next.handle();
    }
}