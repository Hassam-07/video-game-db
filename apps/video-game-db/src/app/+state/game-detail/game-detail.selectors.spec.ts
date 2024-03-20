import * as fromGameDetail from './game-detail.reducer';
import { selectGameDetailState } from './game-detail.selectors';

describe('GameDetail Selectors', () => {
  it('should select the feature state', () => {
    const result = selectGameDetailState({
      [fromGameDetail.gameDetailFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
