import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects';
import { switchMap, catchError, of, map, mergeMap, tap } from 'rxjs';
import { GameApiActions, GamePageActions } from './media-list.actions';
import { HttpService } from '../../services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { APIResponse, Game } from '../../models';
import { selectCount } from './media-list.selectors';
import { Store, select } from '@ngrx/store';

@Injectable()
export class MediaListEffects {
  constructor(
    private actions$: Actions,
    private httpService: HttpService,
    private snackbar: MatSnackBar,
    private store: Store
  ) {}

  loadGames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamePageActions.loadGames),
      mergeMap(({ ordering }) =>
        this.httpService.getGameList(ordering, 1, 20).pipe(
          map((response: APIResponse<Game>) =>
            GameApiActions.gamesLoadedSuccess({
              games: response.results,
              count: response.count,
            })
          ),
          catchError((error) => of(GameApiActions.loadGameFailure({ error })))
        )
      )
    )
  );

  setCount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamePageActions.setCount),
      map(({ count }) => GameApiActions.setCountSuccess({ count })),
      catchError((error) => of(GameApiActions.setCountFailure({ error })))
    )
  );
  loadGamesByPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamePageActions.pageChanging),
      switchMap(({ ordering, page, pageSize, search }) =>
        this.httpService.getGameList(ordering, page, pageSize, search).pipe(
          map((response) => {
            return GameApiActions.pageChangingSuccess({
              games: response.results,
              count: response.count,
            });
          }),
          catchError((error) =>
            of(GameApiActions.pageChangingFailure({ error }))
          )
        )
      )
    )
  );

  searchGames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamePageActions.searchGames),
      switchMap(({ sort, search }) =>
        this.httpService.getGameList(sort, 1, 20, search).pipe(
          map((response: APIResponse<Game>) =>
            GameApiActions.searchGamesSuccess({
              games: response.results,
              count: response.count,
            })
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
        this.httpService.getGameList(sort, 1, 20, search).pipe(
          map((response: APIResponse<Game>) =>
            GameApiActions.sortGamesSuccess({
              games: response.results,
              count: response.count,
            })
          ),
          catchError((error) => of(GameApiActions.sortGamesFailure({ error })))
        )
      )
    )
  );

  // loadGameDetails$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(GamePageActions.loadGameDetails),
  //     switchMap(({ id }) =>
  //       this.httpService.getGameDetails(id).pipe(
  //         map((game: Game) =>
  //           GameApiActions.gameDetailsLoadedSuccess({ game })
  //         ),
  //         catchError((error: any) =>
  //           of(GameApiActions.gameDetailsLoadFailed({ error }))
  //         )
  //       )
  //     )
  //   )
  // );

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
