import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesListComponent } from './sales-list.component';

describe('SalesListComponent', () => {
  let component: SalesListComponent;
  let fixture: ComponentFixture<SalesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
