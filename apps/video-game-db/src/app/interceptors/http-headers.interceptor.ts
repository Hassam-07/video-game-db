import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class HttpHeadersInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    req = req.clone({
      // setHeaders: {
      //   'x-rapidapi-key': 'c312e5a5b8mshf85513d287e4a15p1e728fjsnb5d0f2050bd9',
      //   'x-rapidapi-host': 'rawg-video-games-database.p.rapidapi.com',
      // },
      setParams: {
        key: 'e40e743af2c94b0c916a8aa618fb4473',
        // key: 'c312e5a5b8mshf85513d287e4a15p1e728fjsnb5d0f2050bd9',
      },
    });
    return next.handle(req);
  }
}
