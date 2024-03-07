import { Component, Input } from '@angular/core';
import { Game } from '../../models';

@Component({
  selector: 'video-game-db-game-tabs',
  templateUrl: './game-tabs.component.html',
  styleUrls: ['./game-tabs.component.scss'],
})
export class GameTabsComponent {
  @Input() game!: Game;
}
