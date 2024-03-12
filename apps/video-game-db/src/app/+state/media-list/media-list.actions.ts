import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Game } from '../../models';

export const GamePageActions = createActionGroup({
  source: 'Game Page',
  events: {
    Enter: emptyProps(),
    'Load Games': props<{ sort: string; search?: string }>(),
  },
});

export const GameApiActions = createActionGroup({
  source: 'Game/API',
  events: {
    'Games Loaded': props<{ games: Game[] }>(),
    'Load Game Failure': props<{ error: any }>(),
  },
});
