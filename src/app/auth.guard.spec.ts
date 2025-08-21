import { TestBed } from '@angular/core/testing';
import {
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  provideRouter,
  Routes,
} from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './login/login.component';
import { MessagesComponent } from './messages/messages.component';

describe('authGuard', () => {
  let router: jasmine.SpyObj<Router>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    authService = jasmine.createSpyObj('AuthService', ['isAuthenticated']);

    const routes: Routes = [
      { path: '', redirectTo: 'messages', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'messages', component: MessagesComponent },
      { path: '**', redirectTo: 'messages' },
    ];

    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: authService },
      ],
    });
  });

  it('should allow access when user is logged in', () => {
    localStorage.setItem('token', 'fake-token');
    const mockRoute = {} as ActivatedRouteSnapshot;
    const mockState = {} as RouterStateSnapshot;
    const result = TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState)
    );
    expect(result).toBe(true);
    localStorage.removeItem('token');
  });

  it('should redirect to login when user is not logged in', () => {
    localStorage.removeItem('token');
    const mockRoute = {} as ActivatedRouteSnapshot;
    const mockState = {} as RouterStateSnapshot;
    const result = TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState)
    );
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
