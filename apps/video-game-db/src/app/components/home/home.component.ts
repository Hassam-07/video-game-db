import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {
  Observable,
  Subscription,
  distinctUntilChanged,
  map,
  take,
} from 'rxjs';
import { Game, APIResponse } from '../../models';
import { HttpService } from '../../services/http.service';
import { GamePageActions } from '../../+state/media-list/media-list.actions';
import { Store, select } from '@ngrx/store';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {
  selectCount,
  selectGameView,
  selectGames,
  selectLoading,
  selectPageIndex,
  selectPageSize,
  selectSortOrder,
} from '../../+state/media-list/media-list.selectors';

@Component({
  selector: 'video-game-db-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public sort = '';
  // public games!: Array<Game>;
  public games!: Array<Game>;
  private routeSub!: Subscription;
  private gameSub!: Subscription;
  private sortSub!: Subscription;
  gameViewState$!: Observable<any>;
  constructor(
    private httpService: HttpService,
    private store: Store,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.gameViewState$ = this.store.select(selectGameView);
    // this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
    //   if (params['game-search']) {
    //     this.searchGames('metacrit', params['game-search']);
    //   } else {
    //     this.store.dispatch(
    //       GamePageActions.loadGames({
    //         ordering: 'metacrit',
    //       })
    //     );
    //   }
    // });
  }

  onPageChange(event: PageEvent): void {
    const pageIndex = event.pageIndex;
    // this.pageIndex = pageIndex;
    // this.gameViewState$.subscribe((gameState) => {
    //   gameState.pageIndex = pageIndex;
    //   console.log('component pageIndex', pageIndex);
    // });
    const pageSize = event.pageSize;
    this.store.dispatch(
      GamePageActions.pageChanging({
        ordering: 'metacrit',
        pageIndex: pageIndex,
        pageSize: pageSize,
      })
    );
  }

  searchGames(sort: string, search?: string): void {
    this.store.dispatch(GamePageActions.searchGames({ sort, search }));
  }
  sortGames(sort: string, search?: string): void {
    this.store.dispatch(GamePageActions.sortGames({ sort, search }));
  }

  openGameDetails(id: string): void {
    this.router.navigate(['details', id]);
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
