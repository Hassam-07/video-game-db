import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import { GameApiActions, GamePageActions } from './media-list.actions';
import { Game } from '../../models';

export const GAME_FEATURE_KEY = 'video-game';

export interface GameState {
  games: Game[];
  loading: boolean;
  error: any;
}

export const initialState: GameState = {
  games: [],
  loading: false,
  error: null,
};

export const gameReducer = createReducer(
  initialState,
  on(GamePageActions.loadGames, (state) => ({
    ...state,
    loading: true,
  })),
  on(GameApiActions.gamesLoaded, (state, { games }) => ({
    ...state,
    games,
    loading: false,
    error: null,
  })),
  on(GameApiActions.loadGameFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
