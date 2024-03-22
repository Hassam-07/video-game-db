import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Game } from '../../models';
import { HttpService } from '../../services/http.service';
import { GamePageActions } from '../../+state/media-list/media-list.actions';
import { Store, select } from '@ngrx/store';
import {
  selectGameDetailView,
  selectGameRating,
} from '../../+state/game-detail/game-detail.selectors';
import {
  selectDetailLoading,
  selectGameDetails,
} from '../../+state/game-detail/game-detail.selectors';
import { GameDetailPageActions } from '../../+state/game-detail/game-detail.actions';
import {
  selectRouteParam,
  selectRouteParams,
} from '../../+state/router/router.selectors';

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
  gameDetailsView$!: Observable<any>;
  params$!: Observable<any>;

  constructor(private activatedRoute: ActivatedRoute, private store: Store) {}

  ngOnInit(): void {
    // this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
    //   this.gameId = params['id'];
    //   this.store.dispatch(
    //     GameDetailPageActions.loadGameDetails({ id: this.gameId })
    //   );
    // });
    this.gameDetailsView$ = this.store.select(selectGameDetailView);
  }

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
