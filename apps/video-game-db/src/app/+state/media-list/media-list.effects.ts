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
  distinctUntilChanged,
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
import {
  selectQueryParams,
  selectRouteParams,
  selectUrl,
} from '../router/router.selectors';
import {
  ROUTER_NAVIGATED,
  ROUTER_NAVIGATION,
  RouterNavigatedAction,
} from '@ngrx/router-store';

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
        ([action, routeParams]) =>
          routeParams['game-search'] === undefined &&
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
      concatLatestFrom(() => [
        this.store.pipe(select(selectRouteParams)),
        this.store.select(selectPageIndex),
        this.store.select(selectPageSize),
      ]),
      filter(([action, routeParams]) => {
        return !!routeParams['page'];
      }),
      distinctUntilChanged(([, prevRouteParams], [, currRouteParams]) => {
        return prevRouteParams['page'] === currRouteParams['page'];
      }),
      mergeMap(([action, routeParams, page_size]) => {
        const currentPage = routeParams['page'] ? +routeParams['page'] : 1;
        const searchParam = routeParams['game-search'];
        console.log('router search', searchParam);
        if (searchParam) {
          return of(
            GamePageActions.pageChanging({
              ordering: 'metacrit',
              pageIndex: currentPage,
              pageSize: page_size,
              search: searchParam,
            })
          );
        } else {
          return of(
            GamePageActions.pageChanging({
              ordering: 'metacrit',
              pageIndex: currentPage,
              pageSize: page_size,
            })
          );
        }
      })
    )
  );

  // routerPageChanging$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(ROUTER_NAVIGATION),
  //     filter((action: RouterNavigatedAction) => {
  //       return action.payload.routerState.url.startsWith('/');
  //     }),
  //     concatLatestFrom(() => [
  //       this.store.pipe(select(selectRouteParams)),
  //       // this.store.select(selectPageIndex),
  //       this.store.select(selectPageSize),
  //     ]),
  //     filter(([action, routeParams]) => {
  //       return !!routeParams['page'];
  //     }),
  //     distinctUntilChanged(([, prevRouteParams], [, currRouteParams]) => {
  //       return prevRouteParams['page'] === currRouteParams['page'];
  //     }),
  //     mergeMap(([action, routeParams, page_size]) => {
  //       const currentPage = routeParams['page'] ? +routeParams['page'] : 1;
  //       return of(
  //         GamePageActions.pageChanging({
  //           ordering: 'metacrit',
  //           pageIndex: currentPage,
  //           pageSize: page_size,
  //         })
  //       );
  //     })
  //   )
  // );

  loadGamesOnSearchPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED, GamePageActions.pageChanging),
      concatLatestFrom(() => [
        this.store.pipe(select(selectUrl)),
        this.store.pipe(select(selectRouteParams)),
        this.store.pipe(select(selectPageIndex)),
        this.store.pipe(select(selectPageSize)),
      ]),
      filter(
        ([, url, params, pageIndex, pageSize]) =>
          url.includes('search') && params['game-search'] !== undefined
      ),
      switchMap(([, , params, page, pageSize]) => {
        const search = params['game-search'];
        const ordering = 'metacrit';
        return this.httpService
          .getGameList(ordering, page, pageSize, search)
          .pipe(
            map((response) => {
              return GameApiActions.pageChangingSuccess({
                games: response.results,
                count: response.count,
              });
            }),
            catchError((error) =>
              of(GameApiActions.pageChangingFailure({ error }))
            )
          );
      })
    )
  );

  loadGamesByPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamePageActions.pageChanging),
      //     filter((action: RouterNavigatedAction) => {
      //       return action.payload.routerState.url.startsWith('/');
      //     }),
      concatLatestFrom(() => [
        this.store.pipe(select(selectPageIndex)),
        this.store.pipe(select(selectPageSize)),
      ]),
      switchMap(([, page, pageSize]) => {
        const ordering = 'metacrit';
        return this.httpService.getGameList(ordering, page, pageSize).pipe(
          map((response) => {
            return GameApiActions.pageChangingSuccess({
              games: response.results,
              count: response.count,
            });
          }),
          catchError((error) =>
            of(GameApiActions.pageChangingFailure({ error }))
          )
        );
      })
    )
  );
  // navigateToPage$ = createEffect(
  //   () =>
  //     this.actions$.pipe(
  //       ofType(ROUTER_NAVIGATED),
  //       tap((action: RouterNavigatedAction) => {
  //         const { search } = action.payload.routerState.root.params;
  //         if (search) {
  //           return GamePageActions.pageChanging({
  //             ordering: 'metacrit',
  //             page: 1,
  //             pageSize: 20,
  //             search,
  //           });
  //         } else {
  //           return GamePageActions.pageChanging({
  //             ordering: 'metacrit',
  //             page: 1,
  //             pageSize: 20,
  //           });
  //         }
  //       })
  //     ),
  //   { dispatch: true }
  // );

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
