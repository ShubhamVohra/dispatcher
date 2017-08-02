import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedboardComponent } from './schedboard.component';

describe('SchedboardComponent', () => {
  let component: SchedboardComponent;
  let fixture: ComponentFixture<SchedboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
