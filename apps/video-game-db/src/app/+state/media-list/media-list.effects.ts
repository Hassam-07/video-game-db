import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, of, map, mergeMap, tap } from 'rxjs';
import { GameApiActions, GamePageActions } from './media-list.actions';
import { HttpService } from '../../services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { APIResponse, Game } from '../../models';

@Injectable()
export class MediaListEffects {
  constructor(
    private actions$: Actions,
    private httpService: HttpService,
    private snackbar: MatSnackBar
  ) {}

  // loadGames$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(GamePageActions.loadGames),
  //     mergeMap(() =>
  //       this.httpService
  //         .getGameList()
  //         .pipe(
  //           map((games) =>
  //             GameApiActions.gamesLoadedSuccess({ games: games.results })
  //           )
  //         )
  //     ),
  //     catchError((error) => {
  //       console.error('Error', error);
  //       return of(GameApiActions.loadGameFailure({ error }));
  //     })
  //   )
  // );

  loadGames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamePageActions.loadGames),
      mergeMap(() =>
        this.httpService.getGameList('metacrit').pipe(
          map((response: APIResponse<Game>) =>
            GameApiActions.gamesLoadedSuccess({ games: response.results })
          ),
          catchError((error) => of(GameApiActions.loadGameFailure({ error })))
        )
      )
    )
  );
  searchGames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamePageActions.searchGames),
      switchMap(({ sort, search }) =>
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

  sortGames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamePageActions.sortGames),
      switchMap(({ sort, search }) =>
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

  loadGameDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamePageActions.loadGameDetails),
      switchMap(({ id }) =>
        this.httpService.getGameDetails(id).pipe(
          map((game: Game) =>
            GameApiActions.gameDetailsLoadedSuccess({ game })
          ),
          catchError((error: any) =>
            of(GameApiActions.gameDetailsLoadFailed({ error }))
          )
        )
      )
    )
  );

  handleError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(GameApiActions.loadGameFailure),
        tap((action) => {
          const errorMessages: { [key: string]: string } = {
            [GameApiActions.loadGameFailure.type]: 'Load Game Failure',
          };
          const errormessage =
            errorMessages[action.type] ||
            'Something went wrong please try later';
          this.snackbar.open(errormessage, 'Error');
        })
      ),
    { dispatch: false }
  );
}
