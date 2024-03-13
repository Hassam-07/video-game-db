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
  details: DetailsState;
}

export const initialState: GameState = {
  games: [],
  loading: false,
  error: null,
  sortOrder: '',
  gameRating: 0,
  details: {
    game: null,
    loading: false,
    error: null,
  },
};

export const gameReducer = createReducer(
  initialState,
  on(GamePageActions.loadGames, (state) => ({
    ...state,
    loading: true,
  })),
  on(GameApiActions.gamesLoadedSuccess, (state, { games }) => ({
    ...state,
    games,
    loading: false,
    error: null,
  })),
  on(GameApiActions.loadGameFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(GamePageActions.searchGames, (state) => ({
    ...state,
    loading: true,
  })),
  on(GameApiActions.searchGamesSuccess, (state, { games }) => ({
    ...state,
    games,
    loading: false,
    error: null,
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
  on(GameApiActions.sortGamesSuccess, (state, { games }) => ({
    ...state,
    games,
    loading: false,
    error: null,
  })),
  on(GameApiActions.sortGamesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(GamePageActions.loadGameDetails, (state) => ({
    ...state,
    loading: true,
    details: {
      ...state.details,
      loading: true,
      error: null,
    },
  })),
  on(GameApiActions.gameDetailsLoadedSuccess, (state, { game }) => ({
    ...state,
    details: {
      ...state.details,
      game,
      loading: false,
    },
  })),
  on(GameApiActions.gameDetailsLoadFailed, (state, { error }) => ({
    ...state,
    details: {
      ...state.details,
      error,
      loading: false,
    },
  }))
);
