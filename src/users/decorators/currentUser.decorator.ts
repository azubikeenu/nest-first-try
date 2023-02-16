import { createParamDecorator , ExecutionContext } from "@nestjs/common";

/**
 * ParamDecorator exists outside the DI scope so
 * to pass the user object to the session
 * we need the userService which is managed by the DI container and
 *  which also has the repository tied as a dependency
 * this is why we employed the currentUserInterceptor which is in the DI scope
 */
export const CurrentUser = createParamDecorator(
    ( _ : never , context : ExecutionContext )=> {  // --- the first param is the argument passed to the decorator , the second param is the execution context
        const request = context.switchToHttp().getRequest()
         return request.currentUser
})