import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import * as ActionCable from '@rails/actioncable';

interface MessageStatusUpdate {
  message_id: string;
  status: string;
  twilio_sid: string;
}

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private cable: any;
  private subscription: any;
  private messageStatusUpdates =
    new BehaviorSubject<MessageStatusUpdate | null>(null);

  messageStatusUpdates$ = this.messageStatusUpdates.asObservable();

  constructor() {}

  connect() {
    this.cable = ActionCable.createConsumer(`${environment.apiUrl}/cable`);

    this.subscription = this.cable.subscriptions.create(
      'MessageStatusChannel',
      {
        received: (data: MessageStatusUpdate) => {
          this.messageStatusUpdates.next(data);
        },
      }
    );
  }

  disconnect() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.cable) {
      this.cable.disconnect();
    }
  }
}
