import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { App } from './app';
import { LoadingService } from './core/services/loading';
import { AuthStore } from './core/store/auth';

// Mocks
const mockLoadingService = {
  isLoading: jest.fn().mockReturnValue(false),
};

const mockAuthStore = {
  isAuthenticated: jest.fn().mockReturnValue(true),
  user: jest.fn().mockReturnValue(null),
};

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App,
        RouterTestingModule.withRoutes([]), // <-- Provee ActivatedRoute y Router
      ],
      providers: [
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: AuthStore, useValue: mockAuthStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render layout when authenticated', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-navbar')).toBeTruthy();
    expect(compiled.querySelector('app-sidebar')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should show progress bar when loading', () => {
    mockLoadingService.isLoading.mockReturnValue(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-progress-bar')).toBeTruthy();
  });
});
