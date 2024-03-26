import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  map,
  concatMap,
  switchMap,
  tap,
  filter,
} from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import {
  ROUTER_NAVIGATED,
  ROUTER_NAVIGATION,
  RouterNavigatedAction,
} from '@ngrx/router-store';
import {
  GameDetailApiActions,
  GameDetailPageActions,
} from './game-detail.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store, select } from '@ngrx/store';
import { Game } from '../../models';
import { HttpService } from '../../services/http.service';
import { GameApiActions } from '../media-list/media-list.actions';
import { selectRouteParams } from '../router/router.selectors';

@Injectable()
export class GameDetailEffects {
  constructor(
    private actions$: Actions,
    private httpService: HttpService,
    private snackbar: MatSnackBar,
    private store: Store
  ) {}

  loadGameDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameDetailPageActions.loadGameDetails),
      switchMap(({ id }) =>
        this.httpService.getGameDetails(id).pipe(
          map((game: Game) =>
            GameDetailApiActions.gameDetailsLoadedSuccess({ game })
          ),
          catchError((error: any) =>
            of(GameDetailApiActions.gameDetailsLoadFailure({ error }))
          )
        )
      )
    )
  );

  handleError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(GameDetailApiActions.gameDetailsLoadFailure),
        tap(() => {
          const errormessage = 'Load Game Detail Failure';
          this.snackbar.open(errormessage, 'Error');
        })
      ),
    { dispatch: false }
  );

  getGameDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter((action: RouterNavigatedAction) => {
        return action.payload.routerState.url.startsWith('/details');
      }),
      concatLatestFrom(() => this.store.select(selectRouteParams)),
      tap(([action, params]) => {
        console.log('Route Params:', params);
      }),
      map(([action, params]) => ({
        action,
        gameId: params['id'],
      })),
      switchMap(({ action, gameId }) => {
        return of(GameDetailPageActions.loadGameDetails({ id: gameId }));
      })
    )
  );
}
