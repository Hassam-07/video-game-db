import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Game } from '../../models';
import { HttpService } from '../../services/http.service';
import { GamePageActions } from '../../+state/media-list/media-list.actions';
import { Store, select } from '@ngrx/store';
import {
  selectDetailLoading,
  selectGameDetails,
  selectGameRating,
  selectGameRatingColor,
  selectLoading,
} from '../../+state/media-list/media-list.selectors';

@Component({
  selector: 'video-game-db-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  gameRating = 0;
  gameId!: string;
  game!: Game;
  routeSub!: Subscription;
  gameSub!: Subscription;
  public gameRating$!: Observable<any>;
  public gameRatingColor$!: Observable<any>;
  gameDetails$!: Observable<any>;
  isLoading$!: Observable<boolean>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpService: HttpService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
      this.gameId = params['id'];
      // this.getGameDetails(this.gameId);
      this.store.dispatch(GamePageActions.loadGameDetails({ id: this.gameId }));
    });
    this.isLoading$ = this.store.select(selectDetailLoading);
    this.gameRating$ = this.store.select(selectGameRating);
    this.gameDetails$ = this.store.select(selectGameDetails);
    this.gameRatingColor$ = this.store.select(selectGameRatingColor);
  }

  // getGameDetails(id: string): void {

  //   this.store.dispatch(GamePageActions.loadGameDetails({ id }));

  // }

  getColor(value: number): string {
    console.log('color', value);
    if (value > 75) {
      return '#5ee432';
    } else if (value > 50) {
      return '#fffa50';
    } else if (value > 30) {
      return '#f7aa38';
    } else {
      return '#ef4655';
    }
  }

  ngOnDestroy(): void {
    if (this.gameSub) {
      this.gameSub.unsubscribe();
    }

    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
