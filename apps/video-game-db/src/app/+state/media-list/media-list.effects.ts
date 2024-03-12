import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, of, map, mergeMap, tap } from 'rxjs';
import { GameApiActions, GamePageActions } from './media-list.actions';
import { HttpService } from '../../services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class MediaListEffects {
  constructor(
    private actions$: Actions,
    private httpService: HttpService,
    private snackbar: MatSnackBar
  ) {}

  loadGames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamePageActions.loadGames),
      mergeMap(({ sort, search }) =>
        this.httpService
          .getGameList(sort, search)
          .pipe(
            map((games) => GameApiActions.gamesLoaded({ games: games.results }))
          )
      ),
      catchError((error) => {
        console.error('Error', error);
        return of(GameApiActions.loadGameFailure({ error }));
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
