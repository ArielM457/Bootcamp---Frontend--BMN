import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthFacade } from '../../core/auth/auth.facade';
import { Room } from '../../core/rooms/room.models';
import { RoomFacade } from '../../core/rooms/room.facade';

@Component({
  selector: 'app-room-list',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './room-list.html',
  styleUrl: './rooms.scss',
})
export class RoomList implements OnInit {
  readonly rooms = inject(RoomFacade);
  readonly auth = inject(AuthFacade);
  readonly showCreate = signal(false);
  private readonly router = inject(Router);

  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(60)],
    }),
    maxPlayers: new FormControl(4, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(2), Validators.max(8)],
    }),
  });

  ngOnInit(): void {
    this.rooms.clearError();
    void this.rooms.loadRooms();
  }

  toggleCreate(): void {
    this.showCreate.update((visible) => !visible);
    this.rooms.clearError();
  }

  async create(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const room = await this.rooms.create(this.form.getRawValue());
    if (room) await this.router.navigate(['/salas', room.id]);
  }

  async join(room: Room): Promise<void> {
    if (this.isMember(room)) {
      await this.router.navigate(['/salas', room.id]);
      return;
    }
    const joined = await this.rooms.join(room.id);
    if (joined) await this.router.navigate(['/salas', joined.id]);
  }

  isMember(room: Room): boolean {
    const playerId = this.auth.player()?.id;
    return room.participants.some((participant) => participant.id === playerId);
  }
}
