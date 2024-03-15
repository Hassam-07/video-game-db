import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription, distinctUntilChanged, take } from 'rxjs';
import { Game, APIResponse } from '../../models';
import { HttpService } from '../../services/http.service';
import { GamePageActions } from '../../+state/media-list/media-list.actions';
import { Store, select } from '@ngrx/store';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {
  selectCount,
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
  games$!: Observable<Game[]>;
  isLoading$!: Observable<boolean>;
  public sortOrder$!: Observable<string>;
  public pageIndex = 0;
  public pageSize = 20;

  pageIndex$!: Observable<number>;
  public pageSize$!: Observable<number>;
  public nextPageUrl$!: Observable<string | null>;
  public previousPageUrl$!: Observable<string | null>;
  count$!: Observable<number>;

  constructor(
    private httpService: HttpService,
    private store: Store,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.games$ = this.store.select(selectGames);
    this.isLoading$ = this.store.select(selectLoading);
    this.sortOrder$ = this.store.pipe(select(selectSortOrder));
    this.pageIndex$ = this.store.select(selectPageIndex);
    this.pageSize$ = this.store.select(selectPageSize);
    // this.nextPageUrl$ = this.store.select(selectNextPageUrl);
    // this.previousPageUrl$ = this.store.select(selectPreviousPageUrl);
    this.count$ = this.store.select(selectCount);
    this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
      if (params['game-search']) {
        this.searchGames('metacrit', params['game-search']);
      } else {
        // this.searchGames('metacrit');
        this.store.dispatch(
          GamePageActions.loadGames({
            ordering: 'metacrit',
          })
        );
        // this.sortGames(this.sort);
      }
    });
    // this.store.dispatch(GamePageActions.setCount({ count: this.count$ }));
    console.log('games', this.games$);
  }
  onPageChange(event: PageEvent): void {
    const pageIndex = event.pageIndex + 1;
    const pageSize = event.pageSize;
    this.store.dispatch(
      GamePageActions.pageChanging({ page: pageIndex, pageSize: pageSize })
    );
    console.log('page', pageIndex);
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
