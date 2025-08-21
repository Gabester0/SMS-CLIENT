import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageHistoryComponent } from './message-history.component';
import { MessageService, Message } from '../services/message.service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

describe('MessageHistoryComponent', () => {
  let component: MessageHistoryComponent;
  let fixture: ComponentFixture<MessageHistoryComponent>;
  let messageService: jasmine.SpyObj<MessageService>;

  const mockMessages: Message[] = [
    {
      _id: '1',
      content: 'Test message 1',
      created_at: '2025-08-21T10:00:00Z',
      from_phone_number: '+12345678901',
      to_phone_number: '+19876543210',
      status: 'delivered',
      twilio_sid: 'SM123',
      updated_at: '2025-08-21T10:00:00Z',
      user_id: 'user1',
    },
    {
      _id: '2',
      content: 'Test message 2',
      created_at: '2025-08-21T09:00:00Z',
      from_phone_number: '+19876543210',
      to_phone_number: '+12345678901',
      status: 'delivered',
      twilio_sid: 'SM124',
      updated_at: '2025-08-21T09:00:00Z',
      user_id: 'user1',
    },
  ];

  beforeEach(async () => {
    messageService = jasmine.createSpyObj('MessageService', ['getMessages']);

    await TestBed.configureTestingModule({
      imports: [
        MessageHistoryComponent,
        MatCardModule,
        MatProgressSpinnerModule,
      ],
      providers: [
        { provide: MessageService, useValue: messageService },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageHistoryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load messages successfully', () => {
      messageService.getMessages.and.returnValue(of(mockMessages));

      fixture.detectChanges();

      expect(component.messages).toEqual(mockMessages);
      expect(component.loading).toBeFalse();
      expect(component.error).toBeNull();
    });

    it('should handle error when loading messages', () => {
      messageService.getMessages.and.returnValue(throwError(() => new Error()));

      fixture.detectChanges();

      expect(component.messages).toEqual([]);
      expect(component.loading).toBeFalse();
      expect(component.error).toBe('Failed to load messages.');
    });
  });

  describe('addMessage', () => {
    it('should add new message to the beginning of the list', () => {
      messageService.getMessages.and.returnValue(of(mockMessages));
      fixture.detectChanges();

      const newMessage: Message = {
        _id: '3',
        content: 'New test message',
        created_at: '2025-08-21T11:00:00Z',
        from_phone_number: '+13334445555',
        to_phone_number: '+12345678901',
        status: 'delivered',
        twilio_sid: 'SM125',
        updated_at: '2025-08-21T11:00:00Z',
        user_id: 'user1',
      };

      component.addMessage(newMessage);

      expect(component.messages.length).toBe(3);
      expect(component.messages[0]).toEqual(newMessage);
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format US phone numbers correctly', () => {
      const phoneNumber = '+12345678901';
      const formatted = component.formatPhoneNumber(phoneNumber);
      expect(formatted).toBe('1-234-567-8901');
    });

    it('should handle non-US phone numbers by removing non-digits', () => {
      const phoneNumber = '+44 20 7123 4567';
      const formatted = component.formatPhoneNumber(phoneNumber);
      expect(formatted).toBe('442071234567');
    });
  });
});
