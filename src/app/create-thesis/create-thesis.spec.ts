import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateThesis } from './create-thesis';

describe('CreateThesis', () => {
  let component: CreateThesis;
  let fixture: ComponentFixture<CreateThesis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateThesis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateThesis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
