import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, of, map, mergeMap } from 'rxjs';
import { GameApiActions, GamePageActions } from './media-list.actions';
import { HttpService } from '../../services/http.service';
import { APIResponse, Game } from '../../models';

@Injectable()
export class MediaListEffects {
  constructor(private actions$: Actions, private httpService: HttpService) {}

  loadGames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamePageActions.loadGames),
      mergeMap(() =>
        this.httpService
          .getGameList('metacrit')
          .pipe(
            map((games: APIResponse<Game>) =>
              GameApiActions.gamesLoaded({ games: games.results })
            )
          )
      ),
      catchError((error) => {
        console.error('Error', error);
        return of(GameApiActions.loadGameFailure({ error }));
      })
    )
  );

  searchGames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamePageActions.searchGames),
      mergeMap(({ sort, search }) =>
        this.httpService.getGameList(sort, search).pipe(
          map((response: APIResponse<Game>) =>
            GameApiActions.searchGamesSuccess({ games: response.results })
          ),
          catchError((error) =>
            of(GameApiActions.searchGamesFailure({ error }))
          )
        )
      )
    )
  );
}
