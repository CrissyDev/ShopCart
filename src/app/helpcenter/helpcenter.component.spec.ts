import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpcenterComponent } from './helpcenter.component';

describe('HelpcenterComponent', () => {
  let component: HelpcenterComponent;
  let fixture: ComponentFixture<HelpcenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpcenterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpcenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
