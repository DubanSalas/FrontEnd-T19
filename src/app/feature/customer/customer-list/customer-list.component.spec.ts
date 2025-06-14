import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerListHtmlComponent } from './customer-list.component';  // Asegúrate de usar el nombre correcto

describe('CustomerListHtmlComponent', () => {  // Cambié el nombre aquí también
  let component: CustomerListHtmlComponent;
  let fixture: ComponentFixture<CustomerListHtmlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerListHtmlComponent]  // Asegúrate de usar el nombre correcto
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerListHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
