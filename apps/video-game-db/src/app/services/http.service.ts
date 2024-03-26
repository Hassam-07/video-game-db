import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '../../environments/environment';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { APIResponse, Game } from '../models';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  getGameList(
    ordering: string,
    page: number,
    page_size: number,
    search?: string
  ): Observable<APIResponse<Game>> {
    let params = new HttpParams()
      .set('ordering', ordering)
      .set('page', page.toString())
      .set('page_size', page_size.toString());

    if (search) {
      params = new HttpParams()
        .set('ordering', ordering)
        .set('page', page.toString())
        .set('search', search);
    }
    console.log('service', page);

    return this.http.get<APIResponse<Game>>(`${env.BASE_URL}/games`, {
      params: params,
    });
  }
  getGamePagination(page: number): Observable<APIResponse<Game>> {
    const params = new HttpParams().set('page', page.toString());

    return this.http.get<APIResponse<Game>>(`${env.BASE_URL}/games`, {
      params,
    });
  }

  getGameDetails(id: string): Observable<Game> {
    const gameInfoRequest = this.http.get(`${env.BASE_URL}/games/${id}`).pipe(
      catchError((error) => {
        console.error('Error fetching game info:', error);
        return of(null);
      })
    );
    const gameTrailersRequest = this.http
      .get(`${env.BASE_URL}/games/${id}/movies`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching game trailers:', error);
          return of(null);
        })
      );
    const gameScreenshotsRequest = this.http
      .get(`${env.BASE_URL}/games/${id}/screenshots`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching game screenshots:', error);
          return of(null);
        })
      );

    return forkJoin({
      gameInfoRequest,
      gameScreenshotsRequest,
      gameTrailersRequest,
    }).pipe(
      map((resp: any) => {
        return {
          ...resp['gameInfoRequest'],
          screenshots: resp['gameScreenshotsRequest']?.results || [],
          trailers: resp['gameTrailersRequest']?.results || [],
        };
      })
    );
  }
}
