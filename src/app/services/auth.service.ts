import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl + '/users';

  constructor(private http: HttpClient) {}

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/sign_in`,
      { user: data },
      { observe: 'response' }
    );
  }

  signup(data: {
    email: string;
    password: string;
    password_confirmation: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, { user: data });
  }

  logout(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/sign_out`);
  }
}
