import { createFeature, createReducer, on } from '@ngrx/store';
import {
  GameDetailApiActions,
  GameDetailPageActions,
} from './game-detail.actions';
import { Game } from '../../models';

export const gameDetailFeatureKey = 'gameDetail';

export interface State {
  games: Game[];
  details: {
    game: null | Game;
    loading: boolean;
    error: string | null;
  };
  gameRating: number;
}

export const initialState: State = {
  games: [],
  details: {
    game: null,
    loading: false,
    error: null,
  },
  gameRating: 0,
};

export const reducer = createReducer(
  initialState,
  on(GameDetailPageActions.loadGameDetails, (state) => ({
    ...state,
    details: {
      ...state.details,
      loading: true,
      error: null,
    },
  })),
  on(GameDetailApiActions.gameDetailsLoadedSuccess, (state, { game }) => ({
    ...state,
    details: {
      ...state.details,
      game,
      loading: false,
    },
    gameRating: game.metacritic,
  })),
  on(GameDetailApiActions.gameDetailsLoadFailed, (state, { error }) => ({
    ...state,
    details: {
      ...state.details,
      error,
      loading: false,
    },
  }))
);
