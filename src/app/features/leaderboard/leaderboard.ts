import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthFacade } from '../../core/auth/auth.facade';
import { ScoreFacade } from '../../core/score/score.facade';

@Component({
  selector: 'app-leaderboard',
  imports: [RouterLink],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.scss',
})
export class Leaderboard implements OnInit {
  readonly scores = inject(ScoreFacade);
  readonly auth = inject(AuthFacade);

  ngOnInit(): void {
    void this.scores.loadLeaderboard();
  }

  retry(): void {
    void this.scores.loadLeaderboard();
  }
}
