import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoDashboardPageComponent } from './todo-dashboard.component';


describe('TodoDashboardComponent', () => {
  let component: TodoDashboardPageComponent;
  let fixture: ComponentFixture<TodoDashboardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoDashboardPageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TodoDashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
