import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { ModalService } from '../../../../shared/services/modal.service';
import { ApiEditService } from '../api-edit.service';

import { ApiEditHeaderComponent } from './api-edit-header.component';

describe('ApiEditHeaderComponent', () => {
  let component: ApiEditHeaderComponent;
  let fixture: ComponentFixture<ApiEditHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NzModalModule],
      providers: [ApiEditService, ModalService, NzModalService],
      declarations: [ApiEditHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiEditHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
