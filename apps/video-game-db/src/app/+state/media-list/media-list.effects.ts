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
        this.httpService.getGameList(ordering).pipe(
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

  // loadGames$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(GamePageActions.loadGames),
  //     switchMap(({ offset, pageSize }) =>
  //       this.httpService.getGameList('metacrit', offset, pageSize).pipe(
  //         map((response: APIResponse<Game>) =>
  //           GameApiActions.gamesLoadedSuccess({ games: response.results })
  //         ),
  //         catchError((error) => of(GameApiActions.loadGameFailure({ error })))
  //       )
  //     )
  //   )
  // );
  // loadNextPage$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(GamePageActions.loadNextPage),
  //     mergeMap(() =>
  //       this.httpService.getGameList('metacrit', 2).pipe(
  //         map((response) =>
  //           GameApiActions.loadNextPageSuccess({ games: response.results })
  //         ),
  //         catchError((error) =>
  //           of(GameApiActions.loadNextPageFailure({ error }))
  //         )
  //       )
  //     )
  //   )
  // );

  // loadPreviousPage$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(GamePageActions.loadPreviousPage),
  //     mergeMap(() =>
  //       this.httpService.getGameList('metacrit', 1).pipe(
  //         map((response) =>
  //           GameApiActions.loadPreviousPageSuccess({ games: response.results })
  //         ),
  //         catchError((error) =>
  //           of(GameApiActions.loadPreviousPageFailure({ error }))
  //         )
  //       )
  //     )
  //   )
  // );
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
      switchMap(({ page, pageSize }) =>
        this.httpService.getGamePagination(page, pageSize).pipe(
          map((response) => {
            // concatLatestFrom(() => this.store.pipe(select(selectCount))),
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
  // loadGamesByPage$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(GamePageActions.pageChanging),
  //     switchMap(({ page }) =>
  //       this.httpService.getGamePagination(page).pipe(
  //         map((response) =>
  //           GameApiActions.pageChangingSuccess({ games: response.results })
  //         ),
  //         catchError((error) =>
  //           of(GameApiActions.pageChangingFailure({ error }))
  //         )
  //       )
  //     )
  //   )
  // );

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
            GameApiActions.sortGamesSuccess({ games: response.results })
          ),
          catchError((error) => of(GameApiActions.sortGamesFailure({ error })))
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
