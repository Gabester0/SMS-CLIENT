import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService, Message } from '../services/message.service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';

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
export class MessageHistoryComponent implements OnInit {
  messages: Message[] = [];
  loading = true;
  error: string | null = null;

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.messageService.getMessages().subscribe({
      next: (msgs) => {
        this.messages = msgs;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load messages.';
        this.loading = false;
      },
    });
  }

  formatPhoneNumber(phone: string): string {
    // Remove any non-digit characters (including the +)
    const cleaned = phone.replace(/\D/g, '');

    // Only handle formatting US nums for now
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 1)}-${cleaned.slice(1, 4)}-${cleaned.slice(
        4,
        7
      )}-${cleaned.slice(7)}`;
    }

    // For any other length, return the cleaned number without formatting
    return cleaned;
  }
}
