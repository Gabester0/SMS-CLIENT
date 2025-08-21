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
  private isConnected = false;

  messageStatusUpdates$ = this.messageStatusUpdates.asObservable();

  constructor() {}

  connect() {
    console.log('WebSocket Service: Initiating connection...');

    // Disconnect if already connected
    if (this.isConnected) {
      this.disconnect();
    }

    // Get JWT token from localStorage
    const token = localStorage.getItem('token');
    const cableUrl = token
      ? `${environment.apiUrl}/cable?token=${encodeURIComponent(token)}`
      : `${environment.apiUrl}/cable`;

    this.cable = ActionCable.createConsumer(cableUrl);
    console.log('WebSocket Service: Consumer created', cableUrl);

    this.subscription = this.cable.subscriptions.create(
      'MessageStatusChannel',
      {
        connected: () => {
          console.log(
            'WebSocket Service: Successfully connected to MessageStatusChannel'
          );
          this.isConnected = true;
        },
        disconnected: () => {
          console.log(
            'WebSocket Service: Disconnected from MessageStatusChannel'
          );
          this.isConnected = false;
        },
        received: (data: MessageStatusUpdate) => {
          console.log(
            'WebSocket Service: Received message status update:',
            data
          );
          if (data && data.twilio_sid) {
            this.messageStatusUpdates.next(data);
          } else {
            console.error(
              'WebSocket Service: Received invalid message format:',
              data
            );
          }
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
