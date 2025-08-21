import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessagesComponent } from './messages.component';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../services/auth.service';
import { Router, provideRouter, Routes } from '@angular/router';
import { MessageHistoryComponent } from '../message-history/message-history.component';
import { NewMessageComponent } from '../new-message/new-message.component';
import { MessageService, Message } from '../services/message.service';
import { of, throwError } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  let messageService: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['logout']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    messageService = jasmine.createSpyObj('MessageService', [
      'getMessages',
      'sendMessage',
    ]);
    messageService.getMessages.and.returnValue(of([]));

    const routes: Routes = [
      { path: '', redirectTo: 'messages', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'messages', component: MessagesComponent },
      { path: '**', redirectTo: 'messages' },
    ];

    await TestBed.configureTestingModule({
      imports: [
        MessagesComponent,
        MessageHistoryComponent,
        NewMessageComponent,
        MatButtonModule,
      ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MessageService, useValue: messageService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('logout', () => {
    beforeEach(() => {
      localStorage.setItem('token', 'fake-token');
    });

    afterEach(() => {
      localStorage.removeItem('token');
    });

    it('should clear token and navigate to login on successful logout', () => {
      authService.logout.and.returnValue(of(void 0));

      component.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should clear token and navigate to login on logout error', () => {
      authService.logout.and.returnValue(throwError(() => new Error()));

      component.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('onMessageSent', () => {
    it('should reconnect websocket when a message is sent', () => {
      const mockMessage: Message = {
        _id: '1',
        content: 'Test message',
        created_at: new Date().toISOString(),
        from_phone_number: '+1234567890',
        to_phone_number: '+19876543210',
        status: 'delivered',
        twilio_sid: 'SM123',
        updated_at: new Date().toISOString(),
        user_id: 'user1',
      };
      const websocketService = (component as any).websocketService;
      spyOn(websocketService, 'connect');

      component.onMessageSent(mockMessage);

      expect(websocketService.connect).toHaveBeenCalled();
    });
  });
});
