import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GameDetailState, gameDetailFeatureKey } from './game-detail.reducer';

export const selectGameState =
  createFeatureSelector<GameDetailState>(gameDetailFeatureKey);

export const selectDetailLoading = createSelector(
  selectGameState,
  (state: GameDetailState) => state.loading
);

export const selectGameDetails = createSelector(
  selectGameState,
  (state: GameDetailState) => {
    return state.game;
  }
);
export const selectGameRating = createSelector(
  selectGameState,
  (state: GameDetailState) => state.gameRating
);

export const selectGameDetailView = createSelector(
  selectGameDetails,
  selectDetailLoading,
  selectGameRating,
  (gameDetail, gameDetailLoading, gameRating) => ({
    gameDetail,
    gameDetailLoading,
    gameRating,
  })
);
