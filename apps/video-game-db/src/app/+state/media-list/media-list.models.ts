import { Game } from '../../models';

/**
 * Interface for the 'MediaList' data
 */
export interface MediaListEntity {
  id: string | number; // Primary ID
  name: string;
}
export interface DetailsState {
  game: null | Game;
  loading: boolean;
  error: string | null;
}
