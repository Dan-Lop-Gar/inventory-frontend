import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAlertsComponent } from './stock-alerts';

describe('StockAlertsComponent', () => {
  let component: StockAlertsComponent;
  let fixture: ComponentFixture<StockAlertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockAlertsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StockAlertsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
