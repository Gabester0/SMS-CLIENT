import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MessageHistoryComponent } from '../message-history/message-history.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { NewMessageComponent } from '../new-message/new-message.component';
import { Message } from '../services/message.service';
import { WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [MessageHistoryComponent, MatButtonModule, NewMessageComponent],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, OnDestroy {
  @ViewChild(MessageHistoryComponent) messageHistory?: MessageHistoryComponent;

  constructor(
    private auth: AuthService,
    private router: Router,
    private websocketService: WebsocketService
  ) {}

  ngOnInit() {
    this.websocketService.connect();
  }

  ngOnDestroy() {
    this.websocketService.disconnect();
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      },
      error: () => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      },
    });
  }

  onMessageSent(message: Message) {
    if (this.messageHistory) {
      this.messageHistory.addMessage(message);
    }
  }
}
