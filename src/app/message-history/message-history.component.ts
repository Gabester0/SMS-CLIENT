import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService, Message } from '../services/message.service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { WebsocketService } from '../services/websocket.service';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-message-history',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
  ],
  templateUrl: './message-history.component.html',
  styleUrls: ['./message-history.component.scss'],
})
export class MessageHistoryComponent implements OnInit, OnDestroy {
  messages$!: Observable<Message[]>;
  loading = true;
  error: string | null = null;

  constructor(
    private messageService: MessageService,
    private websocketService: WebsocketService
  ) {
    this.messages$ = this.messageService.messages$;
  }

  ngOnInit() {
    console.log('MessageHistoryComponent: Initializing...');
    this.websocketService.connect();
    console.log('MessageHistoryComponent: WebSocket connection initiated');

    // Load initial messages
    this.messageService.getMessages().subscribe({
      next: () => {
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load messages.';
        this.loading = false;
      },
    });
  }

  ngOnDestroy() {
    this.websocketService.disconnect();
  }

  formatPhoneNumber(phone: string): string {
    // Remove any non-digit characters (including the +)
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 1)}-${cleaned.slice(1, 4)}-${cleaned.slice(
        4,
        7
      )}-${cleaned.slice(7)}`;
    }
    return cleaned;
  }
}
