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
// export const selectDetailLoading = createSelector(
//   selectGameState,
//   (state: GameState) => state.details.loading
// );
export const selectSortOrder = createSelector(
  selectGameState,
  (state: GameState) => state.sortOrder
);

export const selectError = createSelector(
  selectGameState,
  (state: GameState) => state.error
);
// export const selectGameRating = createSelector(
//   selectGameState,
//   (state: GameState) => state.gameRating
// );
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

// export const selectGameDetails = createSelector(
//   selectGameState,
//   (state: GameState) => {
//     console.log(state.details);
//     return state.details.game;
//   }
// );

// export const selectGameRatingColor = createSelector(
//   selectGameRating,
//   (rating) => {
//     if (rating > 75) {
//       return '#5ee432';
//     } else if (rating > 50) {
//       return '#fffa50';
//     } else if (rating > 30) {
//       return '#f7aa38';
//     } else {
//       return '#ef4655';
//     }
//   }
// );

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
