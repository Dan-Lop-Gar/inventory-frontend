import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderDetailComponent } from './order-detail';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../services/order';           // <-- Agregar
import { AuthStore } from '../../../core/store/auth';         // <-- Agregar
import { of } from 'rxjs';

// Mocks de dependencias
const mockOrderService = {
  findById: jest.fn().mockReturnValue(of({})),
  approve: jest.fn().mockReturnValue(of({})),
  receive: jest.fn().mockReturnValue(of({})),
  cancel: jest.fn().mockReturnValue(of({})),
};

const mockAuthStore = {
  user: jest.fn().mockReturnValue(null),
  hasRole: jest.fn().mockReturnValue(false),
};

describe('OrderDetailComponent', () => {
  let component: OrderDetailComponent;
  let fixture: ComponentFixture<OrderDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '123',
              },
            },
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: jest.fn(),
          },
        },
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
        {
          provide: AuthStore,
          useValue: mockAuthStore,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
