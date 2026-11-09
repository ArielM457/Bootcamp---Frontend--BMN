import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthFacade } from '../../core/auth/auth.facade';
import { PlayerAvatarId } from '../../core/auth/auth.models';
import { RoomFacade } from '../../core/rooms/room.facade';
import { ScoreFacade } from '../../core/score/score.facade';
import { BomberConsolePreview } from '../../shared/bomber-console-preview/bomber-console-preview';

type MenuView = 'main' | 'profile' | 'create';
type MatchMode = 'local' | 'online';

@Component({
  selector: 'app-lobby',
  imports: [BomberConsolePreview, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './lobby.html',
  styleUrl: './lobby.scss',
})
export class Lobby implements OnInit {
  readonly auth = inject(AuthFacade);
  readonly rooms = inject(RoomFacade);
  readonly scores = inject(ScoreFacade);
  readonly view = signal<MenuView>('main');
  readonly joinOpen = signal(false);
  readonly editingRoomId = signal<string | null>(null);
  readonly isEditingRoom = computed(() => this.editingRoomId() !== null);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly profileForm = new FormGroup({
    fullName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(60)],
    }),
    nickname: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(20)],
    }),
    avatarId: new FormControl<PlayerAvatarId>('azure', { nonNullable: true }),
  });

  readonly roomForm = new FormGroup({
    mode: new FormControl<MatchMode>('local', { nonNullable: true }),
    name: new FormControl('Sala de batalla', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(60)],
    }),
    maxPlayers: new FormControl(4, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(2), Validators.max(8)],
    }),
    arenaId: new FormControl<'open' | 'fortress'>('open', { nonNullable: true }),
  });

  readonly joinCode = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  });

  readonly playerScore = computed(() => {
    const playerId = this.auth.player()?.id;
    return this.scores.leaderboard().find((entry) => entry.playerId === playerId)?.points ?? 0;
  });

  ngOnInit(): void {
    this.resetProfileForm();
    void this.scores.loadLeaderboard();
    void this.initializeRoomState();
  }

  openView(view: Exclude<MenuView, 'main'>): void {
    if (view === 'profile') this.resetProfileForm();
    this.rooms.clearError();
    this.view.set(view);
  }

  backToMenu(): void {
    this.rooms.clearError();
    this.auth.clearError();
    this.view.set('main');
  }

  async openRoomOrCreate(): Promise<void> {
    const room = this.rooms.currentRoom();
    if (room) {
      await this.router.navigate(['/salas', room.id]);
      return;
    }
    this.editingRoomId.set(null);
    this.resetRoomForm();
    this.openView('create');
  }

  async cancelRoomConfiguration(): Promise<void> {
    const roomId = this.editingRoomId();
    if (roomId) {
      await this.router.navigate(['/salas', roomId]);
      return;
    }
    this.backToMenu();
  }

  async saveProfile(): Promise<void> {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    if (await this.auth.updateProfile(this.profileForm.getRawValue())) this.view.set('main');
  }

  async saveRoom(): Promise<void> {
    if (this.roomForm.invalid) {
      this.roomForm.markAllAsTouched();
      return;
    }
    const value = this.roomForm.getRawValue();
    const request = {
      name: value.name,
      maxPlayers: value.maxPlayers,
      arenaId: value.arenaId,
      mode: value.mode,
    };
    const room = this.isEditingRoom()
      ? await this.rooms.update(request)
      : await this.rooms.create(request);
    if (room) await this.router.navigate(['/salas', room.id]);
  }

  openJoin(): void {
    this.joinCode.reset('');
    this.rooms.clearError();
    this.joinOpen.set(true);
  }

  closeJoin(): void {
    this.joinOpen.set(false);
    this.rooms.clearError();
  }

  async joinRoom(): Promise<void> {
    if (this.joinCode.invalid) {
      this.joinCode.markAsTouched();
      return;
    }
    const room = await this.rooms.join(this.joinCode.value.trim());
    if (room) {
      this.joinOpen.set(false);
      await this.router.navigate(['/salas', room.id]);
    }
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigate(['/']);
  }

  private resetProfileForm(): void {
    const player = this.auth.player();
    this.profileForm.reset({
      fullName: player?.fullName ?? player?.displayName ?? '',
      nickname: player?.nickname ?? player?.displayName ?? '',
      avatarId: player?.avatarId ?? 'azure',
    });
  }

  private resetRoomForm(): void {
    this.roomForm.reset({
      mode: 'local',
      name: 'Sala de batalla',
      maxPlayers: 4,
      arenaId: 'open',
    });
  }

  private async initializeRoomState(): Promise<void> {
    await this.rooms.restoreCurrentRoom();
    const roomId = this.route.snapshot.queryParamMap.get('configurarSala');
    if (!roomId || !(await this.rooms.loadRoom(roomId))) return;
    const room = this.rooms.currentRoom();
    const playerId = this.auth.player()?.id;
    if (
      !room ||
      !this.rooms.isHost() ||
      !room.participants.some((participant) => participant.id === playerId)
    ) {
      await this.rooms.restoreCurrentRoom();
      return;
    }
    this.editingRoomId.set(room.id);
    this.roomForm.reset({
      mode: room.mode,
      name: room.name,
      maxPlayers: room.maxPlayers,
      arenaId: room.arenaId,
    });
    this.view.set('create');
  }
}
