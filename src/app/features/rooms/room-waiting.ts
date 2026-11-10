import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthFacade } from '../../core/auth/auth.facade';
import { RoomFacade } from '../../core/rooms/room.facade';

@Component({
  selector: 'app-room-waiting',
  imports: [RouterLink],
  templateUrl: './room-waiting.html',
  styleUrl: './rooms.scss',
})
export class RoomWaiting implements OnInit, OnDestroy {
  readonly rooms = inject(RoomFacade);
  readonly auth = inject(AuthFacade);
  readonly slots = computed(() =>
    Array.from({ length: this.rooms.currentRoom()?.maxPlayers ?? 0 }, (_, index) => index),
  );
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;
  private navigatingToGame = false;
  private destroyed = false;

  ngOnInit(): void {
    this.rooms.clearError();
    void this.load();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    if (this.refreshTimer) clearTimeout(this.refreshTimer);
  }

  async start(): Promise<void> {
    const gameId = await this.rooms.start();
    if (gameId) await this.router.navigate(['/juego'], { queryParams: { gameId } });
  }

  async toggleReady(): Promise<void> {
    await this.rooms.setReady(!this.rooms.currentParticipant()?.isReady);
  }

  private async load(): Promise<void> {
    const roomId = this.route.snapshot.paramMap.get('roomId') ?? '';
    const loaded = await this.rooms.loadRoom(roomId);
    if (!loaded) {
      this.scheduleRefresh();
      return;
    }
    const playerId = this.auth.player()?.id;
    const isMember = this.rooms
      .currentRoom()
      ?.participants.some((player) => player.id === playerId);
    if (!isMember) {
      await this.router.navigate(['/salas']);
      return;
    }

    const room = this.rooms.currentRoom();
    if (room?.status === 'playing' && room.gameId && !this.navigatingToGame) {
      this.navigatingToGame = true;
      await this.router.navigate(['/juego'], { queryParams: { gameId: room.gameId } });
      return;
    }

    this.scheduleRefresh();
  }

  private scheduleRefresh(): void {
    if (this.destroyed) return;
    this.refreshTimer = setTimeout(() => void this.load(), 1000);
  }
}
