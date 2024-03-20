import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Game } from '../../models';

export const GameDetailPageActions = createActionGroup({
  source: 'Game Detail Page',
  events: {
    Enter: emptyProps(),
    // 'Load Games': props<{ sort: string; search?: string }>(),

    'load Game Details': props<{ id: string }>(),
  },
});

export const GameDetailApiActions = createActionGroup({
  source: 'Game Detail/API',
  events: {
    'Game Details Loaded Success': props<{ game: Game }>(),
    'Game Details Load Failure': props<{ error: any }>(),
  },
});
