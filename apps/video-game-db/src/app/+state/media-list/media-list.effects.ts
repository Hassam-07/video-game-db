import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects';
import {
  switchMap,
  catchError,
  of,
  map,
  mergeMap,
  tap,
  filter,
  withLatestFrom,
} from 'rxjs';
import { GameApiActions, GamePageActions } from './media-list.actions';
import { HttpService } from '../../services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { APIResponse, Game } from '../../models';
import {
  selectCount,
  selectPageIndex,
  selectPageSize,
} from './media-list.selectors';
import { Store, select } from '@ngrx/store';
import { selectRouteParams } from '../router/router.selectors';
import { ROUTER_NAVIGATION, RouterNavigatedAction } from '@ngrx/router-store';

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

  searchRouter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter((action: RouterNavigatedAction) => {
        return action.payload.routerState.url.startsWith('/search');
      }),
      concatLatestFrom(() => this.store.select(selectRouteParams)),
      tap(([action, routeParams]) => {
        console.log('Route Params:', routeParams);
      }),
      filter(
        ([action, routeParams]) => routeParams['game-search'] !== undefined
      ),
      mergeMap(([action, routeParams]) => {
        return of(
          GamePageActions.searchGames({
            sort: 'metacrit',
            search: routeParams['game-search'],
          })
        );
      })
    )
  );

  loadRouter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter((action: RouterNavigatedAction) => {
        return action.payload.routerState.url.startsWith('/');
      }),
      concatLatestFrom(() => this.store.select(selectRouteParams)),
      tap(([action, routeParams]) => {
        console.log('Route Params:', routeParams);
      }),
      filter(
        ([action, routeParams]) => routeParams['game-search'] === undefined
      ),
      filter(
        ([action, routeParams]) =>
          !action.payload.routerState.url.includes('/details')
      ),
      mergeMap(([action, routeParams]) => {
        return of(GamePageActions.loadGames({ ordering: 'metacrit' }));
      })
    )
  );
  routerPageChangingBySearch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter((action: RouterNavigatedAction) => {
        return action.payload.routerState.url.startsWith('/search');
      }),
      withLatestFrom(
        this.store.select(selectRouteParams),
        this.store.pipe(select(selectPageIndex)),
        this.store.pipe(select(selectPageSize))
      ),
      tap(([action, routeParams, pageIndex, pageSize]) => {
        console.log('Route Params:', routeParams);
        console.log('PageIndex:', pageIndex);
        console.log('PageSize:', pageSize);
      }),
      mergeMap(([action, routeParams, pageIndex, pageSize]) => {
        const searchParam = routeParams['game-search'] as string;
        return of(
          GamePageActions.pageChanging({
            ordering: 'metacrit',
            page: pageIndex + 1,
            pageSize: pageSize,
            search: searchParam,
          })
        );
      })
    )
  );

  routerPageChanging$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter((action: RouterNavigatedAction) => {
        return action.payload.routerState.url.startsWith('/');
      }),
      withLatestFrom(
        this.store.select(selectRouteParams),
        this.store.pipe(select(selectPageIndex)),
        this.store.pipe(select(selectPageSize))
      ),
      tap(([action, routeParams, pageIndex, pageSize]) => {
        console.log('Route Params:', routeParams);
        console.log('PageIndex:', pageIndex);
        console.log('PageSize:', pageSize);
      }),
      mergeMap(([action, routeParams, pageIndex, pageSize]) => {
        return of(
          GamePageActions.pageChanging({
            ordering: 'metacrit',
            page: pageIndex + 1,
            pageSize: pageSize,
          })
        );
      })
    )
  );

  handleError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(GameApiActions.loadGameFailure),
        tap((action) => {
          const errorMessages: { [key: string]: string } = {
            [GameApiActions.loadGameFailure.type]: 'Load Game Failure',
            [GameApiActions.sortGamesFailure.type]: 'Sort Game Failure',
            [GameApiActions.searchGamesFailure.type]: 'Search Game Failure',
            [GameApiActions.pageChangingFailure.type]:
              'Game Page changine Failure',
            [GameApiActions.setCountFailure.type]: 'Set count Failure',
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
