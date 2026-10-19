import { Injectable } from '@angular/core';
import { GameCommand } from './game.models';

@Injectable({ providedIn: 'root' })
export class GameInputController {
  fromKey(event: KeyboardEvent): GameCommand | null {
    const key = event.key.toLowerCase();
    const directions: Record<string, GameCommand> = {
      arrowup: { type: 'move', direction: 'up' },
      w: { type: 'move', direction: 'up' },
      arrowdown: { type: 'move', direction: 'down' },
      s: { type: 'move', direction: 'down' },
      arrowleft: { type: 'move', direction: 'left' },
      a: { type: 'move', direction: 'left' },
      arrowright: { type: 'move', direction: 'right' },
      d: { type: 'move', direction: 'right' },
    };
    if (directions[key]) return directions[key];
    if ((key === ' ' || key === 'enter') && !event.repeat) return { type: 'place-bomb' };
    return null;
  }
}
