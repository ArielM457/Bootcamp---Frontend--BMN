import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthFacade } from '../../core/auth/auth.facade';
import { RoomFacade } from '../../core/rooms/room.facade';

@Component({
  selector: 'app-room-waiting',
  imports: [RouterLink],
  templateUrl: './room-waiting.html',
  styleUrl: './rooms.scss',
})
export class RoomWaiting implements OnInit {
  readonly rooms = inject(RoomFacade);
  readonly auth = inject(AuthFacade);
  readonly slots = computed(() =>
    Array.from({ length: this.rooms.currentRoom()?.maxPlayers ?? 0 }, (_, index) => index),
  );
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.rooms.clearError();
    void this.load();
  }

  async leave(): Promise<void> {
    if (await this.rooms.leave()) await this.router.navigate(['/salas']);
  }

  async addBot(): Promise<void> {
    await this.rooms.addBot();
  }

  async start(): Promise<void> {
    if (await this.rooms.start()) {
      await this.router.navigate(['/juego']);
    }
  }

  private async load(): Promise<void> {
    const loaded = await this.rooms.loadRoom(this.route.snapshot.paramMap.get('roomId') ?? '');
    if (!loaded) return;
    const playerId = this.auth.player()?.id;
    const isMember = this.rooms
      .currentRoom()
      ?.participants.some((player) => player.id === playerId);
    if (!isMember) await this.router.navigate(['/salas']);
  }
}
