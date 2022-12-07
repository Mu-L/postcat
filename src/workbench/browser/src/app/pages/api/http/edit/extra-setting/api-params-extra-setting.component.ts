import { Component, OnInit, Input } from '@angular/core';
import { ColumnItem } from 'eo/workbench/browser/src/app/modules/eo-ui/table-pro/table-pro.model';
import { isNil } from 'ng-zorro-antd/core/util';
import {
  ApiParamsTypeJsonOrXml,
  ParamsEnum,
  REQURIED_ENUMS,
  ApiEditBody,
} from '../../../../../shared/services/storage/index.model';

@Component({
  selector: 'eo-api-edit-params-extra-setting',
  templateUrl: './api-params-extra-setting.component.html',
})
export class ApiParamsExtraSettingComponent implements OnInit {
  @Input() model: { type: string | ApiParamsTypeJsonOrXml } & ApiEditBody;
  @Input() isEdit = true;
  @Input() in: 'body' | 'header' | 'query' | 'rest';
  showValueTable = false;
  showLengthTable = false;
  listConfBasicInfo;
  listConfLenthInterval: ColumnItem[] = [
    {
      title: $localize`Minimum length`,
      type: 'inputNumber',
      key: 'minLength',
    },
    {
      title: $localize`Maximum Length`,
      type: 'inputNumber',
      key: 'maxLength',
    },
  ];
  listConfValueInterval: ColumnItem[] = [
    {
      title: $localize`Minimum`,
      type: 'inputNumber',
      key: 'minimum',
    },
    {
      title: $localize`Maximum`,
      type: 'inputNumber',
      key: 'maximum',
    },
  ];

  itemStructureEnums: ParamsEnum = {
    value: '',
    description: '',
  };
  listConfEnums: ColumnItem[] = [
    {
      title: $localize`Value Enum`,
      type: 'input',
      key: 'value',
      placeholder: $localize`enum`,
    },
    {
      title: $localize`Description`,
      type: 'input',
      key: 'description',
      placeholder: $localize`Description`,
    },
    {
      type: 'btnList',
      width: 100,
      btns: [
        {
          action: 'delete',
        },
      ],
    },
  ];

  constructor() {}
  initBasicListConf() {
    this.listConfBasicInfo = [
      {
        title: $localize`Param Name`,
        key: 'name',
      },
      ...(this.in === 'body'
        ? [
            {
              title: $localize`Type`,
              key: 'type',
            },
          ]
        : []),
      {
        title: $localize`Required`,
        key: 'required',
        enums: REQURIED_ENUMS,
      },
      {
        title: $localize`:@@Description:Description`,
        key: 'description',
      },
    ];
  }
  transferPreviewTable() {
    ['listConfValueInterval', 'listConfEnums', 'listConfValueInterval'].forEach((configName) => {
      this[configName].forEach((column, index) => {
        //Change edit to preview
        if (['inputNumber', 'input'].includes(column.type)) {
          column.type = 'text';
        }
        const hiddenOperate = !this.isEdit && column.type === 'btnlist';
        if (hiddenOperate) {
          this[configName].splice(index, 1);
        }
      });
    });
  }
  ngOnInit(): void {
    this.initBasicListConf();
    if (!this.isEdit) {
      this.transferPreviewTable();
    }
    //Init Enum List
    if (this.isEdit && this.model[0] && !this.model[0]?.enum?.length) {
      this.model[0].enum = this.model[0].enum || [];
    }
    //Set Table preview
    if (this.isEdit) {
      this.showLengthTable = ['string'].includes(this.model[0].type);
      this.showValueTable = ['int', 'float', 'double', 'short', 'long', 'number'].includes(this.model[0].type);
    } else {
      this.showLengthTable = !isNil(this.model[0].minLength || this.model[0].maxLength);
      this.showValueTable = !isNil(this.model[0].minimum || this.model[0].maximum);
    }
  }
}
