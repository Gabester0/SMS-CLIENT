import { Component, ViewChild } from '@angular/core';
import { MessageHistoryComponent } from '../message-history/message-history.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
// import { NewMessageComponent } from '../new-message/new-message.component'; // To be added

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [MessageHistoryComponent, MatButtonModule], // Add NewMessageComponent when ready
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent {
  @ViewChild(MessageHistoryComponent) messageHistory?: MessageHistoryComponent;

  constructor(private auth: AuthService, private router: Router) {}

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

  refreshMessages() {
    this.messageHistory?.ngOnInit(); // crude, but works for now
  }
}
