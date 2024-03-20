import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap, tap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import {
  GameDetailApiActions,
  GameDetailPageActions,
} from './game-detail.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Game } from '../../models';
import { HttpService } from '../../services/http.service';
import { GameApiActions } from '../media-list/media-list.actions';

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
}
