import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import { GameApiActions, GamePageActions } from './media-list.actions';
import { Game } from '../../models';
import { DetailsState } from './media-list.models';

export const GAME_FEATURE_KEY = 'video-game';

export interface GameState {
  games: Game[];
  loading: boolean;
  error: any;
  sortOrder: string;
  gameRating: number;
  pageIndex: number;
  nextPageUrl: string | null;
  previousPageUrl: string | null;
  count: number;
  pageSize: number;
}

export const initialState: GameState = {
  games: [],
  loading: false,
  error: null,
  sortOrder: '',
  gameRating: 0,
  pageIndex: 0,
  nextPageUrl: null,
  previousPageUrl: null,
  count: 0,
  pageSize: 20,
};

export const gameReducer = createReducer(
  initialState,
  on(GamePageActions.loadGames, (state) => ({
    ...state,
    loading: true,
  })),
  on(GameApiActions.gamesLoadedSuccess, (state, { games, count }) => ({
    ...state,
    games,
    loading: false,
    error: null,
    count,
  })),
  on(GameApiActions.loadGameFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(GamePageActions.setPageIndex, (state, { pageIndex }) => ({
    ...state,
    pageIndex: pageIndex,
  })),
  on(GamePageActions.setPageSize, (state, { pageSize }) => ({
    ...state,
    pageSize,
  })),
  on(GamePageActions.searchGames, (state) => ({
    ...state,
    loading: true,
  })),
  on(GameApiActions.searchGamesSuccess, (state, { games, count }) => ({
    ...state,
    games,
    loading: false,
    error: null,
    count,
  })),
  on(GameApiActions.searchGamesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(GamePageActions.sortGames, (state) => ({
    ...state,
    loading: true,
  })),
  on(GameApiActions.sortGamesSuccess, (state, { games, count }) => ({
    ...state,
    games,
    loading: false,
    error: null,
    count: count,
  })),
  on(GameApiActions.sortGamesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  // on(GamePageActions.loadGameDetails, (state) => ({
  //   ...state,
  //   loading: true,
  //   details: {
  //     ...state.details,
  //     loading: true,
  //     error: null,
  //   },
  // })),
  // on(GameApiActions.gameDetailsLoadedSuccess, (state, { game }) => ({
  //   ...state,
  //   details: {
  //     ...state.details,
  //     game,
  //     loading: false,
  //   },
  //   gameRating: game.metacritic,
  // })),
  // on(GameApiActions.gameDetailsLoadFailed, (state, { error }) => ({
  //   ...state,
  //   details: {
  //     ...state.details,
  //     error,
  //     loading: false,
  //   },
  // })),
  on(GamePageActions.setCount, (state) => ({
    ...state,
  })),
  on(GameApiActions.setCountSuccess, (state, { count }) => ({
    ...state,
    count,
  })),
  on(GamePageActions.pageChanging, (state, { page, pageSize }) => ({
    ...state,
    loading: true,
    page: page,
    pageSize: pageSize,
  })),
  on(GameApiActions.pageChangingSuccess, (state, { games, count }) => ({
    ...state,
    games,
    count,
    loading: false,
  })),
  on(GameApiActions.pageChangingFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);
