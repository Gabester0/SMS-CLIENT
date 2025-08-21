import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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

  constructor(private http: HttpClient) {}

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(this.apiUrl, { withCredentials: true });
  }

  sendMessage(data: { to: string; body: string }): Observable<Message> {
    return this.http.post<Message>(this.apiUrl, data, {
      withCredentials: true,
    });
  }
}
