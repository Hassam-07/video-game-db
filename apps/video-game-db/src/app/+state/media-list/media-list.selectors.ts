import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GameState, GAME_FEATURE_KEY } from './media-list.reducer';

export const selectGameState =
  createFeatureSelector<GameState>(GAME_FEATURE_KEY);

export const selectGames = createSelector(
  selectGameState,
  (state: GameState) => {
    console.log(state.games);
    return state.games;
  }
);

export const selectLoading = createSelector(
  selectGameState,
  (state: GameState) => state.loading
);

export const selectError = createSelector(
  selectGameState,
  (state: GameState) => state.error
);
