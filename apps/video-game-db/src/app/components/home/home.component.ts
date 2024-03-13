import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription, distinctUntilChanged, take } from 'rxjs';
import { Game, APIResponse } from '../../models';
import { HttpService } from '../../services/http.service';
import { GamePageActions } from '../../+state/media-list/media-list.actions';
import { Store, select } from '@ngrx/store';
import {
  selectGames,
  selectLoading,
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
  games$!: Observable<any>;
  isLoading$!: Observable<boolean>;
  public sortOrder$!: Observable<string>;

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
    this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
      if (params['game-search']) {
        this.searchGames('metacrit', params['game-search']);
      } else {
        // this.searchGames('metacrit');
        this.store.dispatch(GamePageActions.loadGames());
        // this.sortGames(this.sort);
      }
    });
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
