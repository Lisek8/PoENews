import { registerInteractionCreateEventHandler } from './events/interaction-create.event.js';
import { registerReadyEventHandler } from './events/ready.event.js';

export function registerClientEventHandlers(): void {
  registerReadyEventHandler();
  registerInteractionCreateEventHandler();
}
