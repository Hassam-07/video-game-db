import { createFeature, createReducer, on } from '@ngrx/store';
import {
  GameDetailApiActions,
  GameDetailPageActions,
} from './game-detail.actions';
import { Game } from '../../models';

export const gameDetailFeatureKey = 'gameDetail';

export interface GameDetailState {
  game: null | Game;
  loading: boolean;
  error: string | null;
  gameRating: number;
}

export const initialState: GameDetailState = {
  game: null,
  loading: false,
  error: null,
  gameRating: 0,
};

export const reducer = createReducer(
  initialState,
  on(GameDetailPageActions.loadGameDetails, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(GameDetailApiActions.gameDetailsLoadedSuccess, (state, { game }) => ({
    ...state,
    game,
    loading: false,
    gameRating: game.metacritic,
  })),
  on(GameDetailApiActions.gameDetailsLoadFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);
