import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State, gameDetailFeatureKey } from './game-detail.reducer';
import { Game } from '../../models';
import { GameState } from '../media-list/media-list.reducer';

export const selectGameState =
  createFeatureSelector<State>(gameDetailFeatureKey);

export const selectGames = createSelector(selectGameState, (state: State) => {
  console.log(state.games);
  return state.games;
});

export const selectDetailLoading = createSelector(
  selectGameState,
  (state: State) => state.details.loading
);

export const selectGameDetails = createSelector(
  selectGameState,
  (state: State) => {
    console.log(state.details);
    return state.details.game;
  }
);
export const selectGameRating = createSelector(
  selectGameState,
  (state: State) => state.gameRating
);
