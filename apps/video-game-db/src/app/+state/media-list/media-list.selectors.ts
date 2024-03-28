import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GameState, GAME_FEATURE_KEY } from './media-list.reducer';
import { Game } from '../../models';

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

export const selectSortOrder = createSelector(
  selectGameState,
  (state: GameState) => state.sortOrder
);

export const selectError = createSelector(
  selectGameState,
  (state: GameState) => state.error
);

export const selectPageSize = createSelector(
  selectGameState,
  (state) => state.pageSize
);
export const selectPageIndex = createSelector(selectGameState, (state) => {
  console.log('selector page index', state.pageIndex);
  return state.pageIndex;
});

export const selectCount = createSelector(
  selectGameState,
  (state: GameState) => state.count
);

export const selectGameView = createSelector(
  selectGames,
  selectLoading,
  selectSortOrder,
  selectError,
  selectPageSize,
  selectPageIndex,
  selectCount,
  (games, loading, sortOrder, error, pageSize, pageIndex, count) => ({
    games,
    loading,
    sortOrder,
    error,
    pageSize,
    pageIndex,
    count,
  })
);
