import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { WebsocketService } from './websocket.service';
import { tap } from 'rxjs/operators';

export interface Message {
  _id: string;
  content: string;
  created_at: string;
  from_phone_number: string;
  status: string;
  to_phone_number: string;
  twilio_sid: string;
  updated_at: string;
  user_id: string;
}

@Injectable({ providedIn: 'root' })
export class MessageService {
  private apiUrl = environment.apiUrl + '/messages';
  private messages = new BehaviorSubject<Message[]>([]);
  messages$ = this.messages.asObservable();

  constructor(
    private http: HttpClient,
    private websocketService: WebsocketService
  ) {
    // Subscribe to real-time status updates
    this.websocketService.messageStatusUpdates$.subscribe((update) => {
      if (update) {
        const currentMessages = this.messages.getValue();
        const updatedMessages = currentMessages.map((message) =>
          message._id === update.message_id
            ? { ...message, status: update.status }
            : message
        );
        this.messages.next(updatedMessages);
      }
    });
  }

  getMessages(): Observable<Message[]> {
    this.http
      .get<Message[]>(this.apiUrl, { withCredentials: true })
      .subscribe((messages) => this.messages.next(messages));
    return this.messages$;
  }

  sendMessage(data: {
    to_phone_number: string;
    content: string;
  }): Observable<Message> {
    return this.http
      .post<Message>(this.apiUrl, { message: data }, { withCredentials: true })
      .pipe(
        tap((newMessage) => {
          // Add the new message to the top of the list
          const currentMessages = this.messages.getValue();
          this.messages.next([newMessage, ...currentMessages]);
        })
      );
  }
}
