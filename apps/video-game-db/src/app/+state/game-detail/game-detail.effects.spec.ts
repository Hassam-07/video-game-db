import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { GameDetailEffects } from './game-detail.effects';

describe('GameDetailEffects', () => {
  let actions$: Observable<any>;
  let effects: GameDetailEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GameDetailEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(GameDetailEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
