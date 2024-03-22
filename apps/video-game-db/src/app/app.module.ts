import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { RouterState } from '@ngrx/router-store';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NxWelcomeComponent } from './nx-welcome.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { GaugeModule } from 'angular-gauge';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { HomeComponent } from './components/home/home.component';
import { HttpErrorsInterceptor } from './interceptors/http-errors.interceptor';
import { HttpHeadersInterceptor } from './interceptors/http-headers.interceptor';
import { DetailsComponent } from './components/details/details.component';
import { GameTabsComponent } from './components/game-tabs/game-tabs.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as videoGame from './+state/media-list/media-list.reducer';
import { MediaListEffects } from './+state/media-list/media-list.effects';
import { LoadingSpinnerModule } from '@video-game-db/loading-spinner';
import {
  GAME_FEATURE_KEY,
  gameReducer,
} from './+state/media-list/media-list.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MatPaginatorModule } from '@angular/material/paginator';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import * as fromGameDetail from './+state/game-detail/game-detail.reducer';
import { GameDetailEffects } from './+state/game-detail/game-detail.effects';
import { CustomSerializer } from './+state/router/custom-serializer';

@NgModule({
  declarations: [
    AppComponent,
    SearchBarComponent,
    HomeComponent,
    DetailsComponent,
    GameTabsComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    GaugeModule.forRoot(),
    MatIconModule,
    LoadingSpinnerModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    StoreModule,
    StoreModule.forRoot({ router: routerReducer }),
    StoreModule.forFeature(videoGame.GAME_FEATURE_KEY, videoGame.gameReducer),
    EffectsModule.forFeature([MediaListEffects, GameDetailEffects]),
    EffectsModule.forRoot([MediaListEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
    StoreRouterConnectingModule.forRoot({
      routerState: RouterState.Minimal,
      // serializer: CustomSerializer,
    }),
    StoreModule.forFeature(
      fromGameDetail.gameDetailFeatureKey,
      fromGameDetail.reducer
    ),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpHeadersInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorsInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
