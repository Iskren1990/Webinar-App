import { Injectable } from '@angular/core';
import {
    HttpHandler, HttpRequest,
    HttpResponse, HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user/user.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(private toster: ToastrService, private router: Router, private userService: UserService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
        
        return next.handle(req)
            .pipe(catchError((error: HttpResponse<any>) => {
                if (error.status === 404) {
                    this.router.navigateByUrl("/page/not/found");
                    return of(error);
                }

                if (error instanceof HttpErrorResponse) {
                    try {                        
                        if (error.status === 401) {
                            this.userService.reset();
                            this.router.navigateByUrl("/user/login");
                        }
                        error["error"].message.forEach((message: string) => {
                            this.toster.error(message, "", { timeOut: 3000 });
                        });
                    } catch (e) {
                        this.toster.error('An error occurred');
                    }
                }
                return of(error);
            }));
    }
}