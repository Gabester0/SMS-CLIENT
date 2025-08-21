import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss'],
})
export class NewMessageComponent {
  @Output() messageSent = new EventEmitter<void>();
  messageForm: FormGroup;
  loading = false;
  error: string | null = null;
  readonly TWILIO_NUMBER = '+18777804236';

  constructor(private fb: FormBuilder, private messageService: MessageService) {
    this.messageForm = this.fb.group({
      to_phone_number: [{ value: this.TWILIO_NUMBER, disabled: true }],
      content: ['', [Validators.required, Validators.maxLength(250)]],
    });
  }

  onSubmit() {
    if (this.messageForm.invalid) return;

    this.loading = true;
    this.error = null;

    this.messageService
      .sendMessage({
        to_phone_number: this.TWILIO_NUMBER,
        content: this.messageForm.get('content')?.value,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.messageForm.get('content')?.reset();
          this.messageSent.emit();
        },
        error: (err) => {
          this.error = err.error?.errors?.[0] || 'Failed to send message';
          this.loading = false;
        },
      });
  }
}
