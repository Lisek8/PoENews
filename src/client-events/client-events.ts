import { registerInteractionCreateEventHandler } from './events/interaction-create.event.js';
import { registerMessageCreateEventHandler } from './events/message-create.event.js';
import { registerReadyEventHandler } from './events/ready.event.js';

export function registerClientEventHandlers(): void {
  registerReadyEventHandler();
  registerMessageCreateEventHandler();
  registerInteractionCreateEventHandler();
}
