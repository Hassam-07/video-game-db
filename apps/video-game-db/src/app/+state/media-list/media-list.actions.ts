import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Game } from '../../models';

export const GamePageActions = createActionGroup({
  source: 'Game Page',
  events: {
    Enter: emptyProps(),
    // 'Load Games': props<{ sort: string; search?: string }>(),
    'Load Games': emptyProps(),
    'Search Games': props<{ sort: string; search?: string }>(),
    'Sort Games': props<{ sort: string; search?: string }>(),
    'load Game Details': props<{ id: string }>(),
  },
});

export const GameApiActions = createActionGroup({
  source: 'Game/API',
  events: {
    'Games Loaded Success': props<{ games: Game[] }>(),
    'Load Game Failure': props<{ error: any }>(),
    'search games Success': props<{ games: Game[] }>(),
    'search games Failure': props<{ error: any }>(),
    'sort games Success': props<{ games: Game[] }>(),
    'sort games Failure': props<{ error: any }>(),
    'Game Details Loaded Success': props<{ game: Game }>(),
    'Game Details Load Failed': props<{ error: any }>(),
  },
});
