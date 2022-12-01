import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  ElementRef,
} from '@angular/core';

import { Observable, Observer, Subject } from 'rxjs';
import { pairwise, takeUntil, debounceTime } from 'rxjs/operators';

import {
  ApiTestBody,
  ApiTestBodyType,
  ContentType,
  CONTENT_TYPE_BY_ABRIDGE,
} from '../../../service/api-test/api-test.model';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { transferFileToDataUrl } from 'eo/workbench/browser/src/app/utils/index.utils';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { EoMonacoEditorComponent } from 'eo/workbench/browser/src/app/modules/eo-ui/monaco-editor/monaco-editor.component';
import { EditorOptions } from 'ng-zorro-antd/code-editor';
import { ApiTableService } from 'eo/workbench/browser/src/app/modules/api-shared/api-table.service';

@Component({
  selector: 'eo-api-test-body',
  templateUrl: './api-test-body.component.html',
  styleUrls: ['./api-test-body.component.scss'],
})
export class ApiTestBodyComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() model: string | object[] | any;
  @Input() supportType: string[];
  @Input() contentType: ContentType;
  @Input() bodyType: ApiTestBodyType | string;
  @Output() bodyTypeChange: EventEmitter<any> = new EventEmitter();
  @Output() modelChange: EventEmitter<any> = new EventEmitter();
  @Output() contentTypeChange: EventEmitter<ContentType> = new EventEmitter();
  @ViewChild(EoMonacoEditorComponent, { static: false }) eoMonacoEditor?: EoMonacoEditorComponent;
  isReload = true;
  listConf: any = {
    column: [],
    setting: {},
  };
  binaryFiles: NzUploadFile[] = [];
  CONST: any = {
    CONTENT_TYPE: CONTENT_TYPE_BY_ABRIDGE,
  };
  cache: any = {};
  editorConfig: EditorOptions = {
    language: 'json',
  };
  itemStructure: ApiTestBody = {
    required: true,
    name: '',
    type: 'string',
    value: '',
  };
  private resizeObserver: ResizeObserver;
  private readonly el: HTMLElement;
  private bodyType$: Subject<string> = new Subject<string>();
  private destroy$: Subject<void> = new Subject<void>();
  private rawChange$: Subject<string> = new Subject<string>();
  get editorType() {
    return this.contentType.replace(/.*\//, '');
  }
  constructor(private apiTable: ApiTableService, elementRef: ElementRef, private message: EoNgFeedbackMessageService) {
    this.el = elementRef.nativeElement;
    this.bodyType$.pipe(pairwise(), takeUntil(this.destroy$)).subscribe((val) => {
      this.beforeChangeBodyByType(val[0]);
    });
    this.initListConf();
    this.rawChange$.pipe(debounceTime(400), takeUntil(this.destroy$)).subscribe((code) => {
      //! Must set value by data,because this.model has delay
      this.modelChange.emit(code);
    });
  }

  ngAfterViewInit(): void {}
  beforeChangeBodyByType(type) {
    switch (type) {
      case ApiTestBodyType.Binary:
      case ApiTestBodyType.Raw: {
        this.cache[type] = this.model;
        break;
      }
      default: {
        this.cache[type] = [...this.model];
        break;
      }
    }
  }
  changeContentType(contentType) {
    this.contentTypeChange.emit(contentType);
  }
  changeBodyType(type?) {
    this.bodyType$.next(this.bodyType);
    this.bodyTypeChange.emit(this.bodyType);
    this.initListConf();
    this.setModel();
    if (type === 'init') {
      return;
    }
    this.modelChange.emit(this.model);
  }

  ngOnInit(): void {
    this.CONST.API_BODY_TYPE = Object.keys(ApiTestBodyType)
      .filter((val) => this.supportType.includes(ApiTestBodyType[val]))
      .map((val) => ({ key: val, value: ApiTestBodyType[val] }));
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.resizeObserver?.disconnect();
  }
  ngOnChanges(changes) {
    if (
      changes.model &&
      ((!changes.model.previousValue && changes.model.currentValue) || changes.model.currentValue?.length === 0)
    ) {
      this.beforeChangeBodyByType(this.bodyType);
      this.changeBodyType('init');
    }
  }
  uploadBinary = (file) =>
    new Observable((observer: Observer<boolean>) => {
      this.model = {};
      this.binaryFiles = [];
      if (file.size >= 5 * 1024 * 1024) {
        this.message.error($localize`The file is too large and needs to be less than 5 MB`);
        observer.complete();
        return;
      }
      transferFileToDataUrl(file).then((result: { name: string; content: string }) => {
        this.model = {
          name: file.name,
          dataUrl: result.content,
        };
        this.binaryFiles = [
          {
            uid: '1',
            name: file.name,
            status: 'done',
          },
        ];
        this.modelChange.emit(this.model);
      });
      observer.complete();
    });
  emitModelChange() {
    this.modelChange.emit(this.model);
  }
  handleParamsImport(data) {
    this.model = data;
    this.modelChange.emit(data);
  }

  rawDataChange(code: string) {
    this.rawChange$.next(code);
  }
  /**
   * Set model after change bodyType
   *
   * Add last row| RestoreData From cache
   */
  private setModel() {
    switch (this.bodyType) {
      case ApiTestBodyType.Binary:
      case ApiTestBodyType.Raw: {
        this.model = this.cache[this.bodyType] || '';
        break;
      }
      default: {
        this.model = this.cache[this.bodyType] || [];
        break;
      }
    }
  }
  private initListConf() {
    const config = this.apiTable.initTestTable({
      in: 'body',
    });
    this.listConf.columns = config.columns;
    this.listConf.setting = config.setting;
  }
}
