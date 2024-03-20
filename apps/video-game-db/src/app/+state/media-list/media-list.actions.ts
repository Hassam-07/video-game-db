import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Game } from '../../models';

export const GamePageActions = createActionGroup({
  source: 'Game Page',
  events: {
    Enter: emptyProps(),
    // 'Load Games': props<{ sort: string; search?: string }>(),

    'Load Games': props<{ ordering: string }>(),
    'Search Games': props<{ sort: string; search?: string }>(),
    'Sort Games': props<{ sort: string; search?: string }>(),
    // 'load Game Details': props<{ id: string }>(),
    'Set Page Index': props<{ pageIndex: number }>(),
    'Set Page Size': props<{ pageSize: number }>(),
    'Page changing': props<{
      ordering: string;
      page: number;
      pageSize: number;
      search?: string;
    }>(),
    'set count': props<{ count: number }>(),
  },
});

export const GameApiActions = createActionGroup({
  source: 'Game/API',
  events: {
    'Games Loaded Success': props<{ games: Game[]; count: number }>(),
    'Load Game Failure': props<{ error: any }>(),
    'search games Success': props<{ games: Game[]; count: number }>(),
    'search games Failure': props<{ error: any }>(),
    'sort games Success': props<{ games: Game[]; count: number }>(),
    'sort games Failure': props<{ error: any }>(),
    // 'Game Details Loaded Success': props<{ game: Game }>(),
    // 'Game Details Load Failed': props<{ error: any }>(),
    'Page changing Success': props<{ games: Game[]; count: number }>(),
    'Page changing Failure': props<{ error: any }>(),
    'Set Count Success': props<{ count: number }>(),
    'Set Count Failure': props<{ error: any }>(),
  },
});
