import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThesisDetail } from './thesis-detail';

describe('ThesisDetail', () => {
  let component: ThesisDetail;
  let fixture: ComponentFixture<ThesisDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThesisDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThesisDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
