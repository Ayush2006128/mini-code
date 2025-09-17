import { TestBed } from '@angular/core/testing';

import { CodeExecution } from './code-execution';

describe('CodeExecution', () => {
  let service: CodeExecution;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodeExecution);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
