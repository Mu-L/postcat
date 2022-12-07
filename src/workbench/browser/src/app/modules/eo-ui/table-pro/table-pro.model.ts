import { TemplateRef } from '@angular/core';
import { NzTSType } from 'ng-zorro-antd/core/types';

export interface TableProSetting {
  /**
   * Storage ID，Use to save table settings,such as column width,sort,filter status
   */
  id?: string;
  /**
   * Editable table, default generate by columns[type='select'|'input'...]
   */
  isEdit?: boolean;
  /**
   * Tree Table
   */
  isLevel?: boolean;
  /**
   * Tree Table
   */
  primaryKey?: string;
  rowSortable?: boolean;
  /**
   * Manually add row
   */
  manualAdd?: boolean;
  toolButton?: {
    columnVisible?: boolean;
    fullScreen?: boolean;
  };
}
export interface ColumnItem {
  /**
   * Table header title
   */
  title?: string | TemplateRef<HTMLElement>;
  /**
   * Primary key,for show/mark column
   */
  key?: string;
  type?: 'input' | 'text' | 'select' | 'checkbox' | 'btnList' | 'autoComplete' | 'inputNumber' | 'sort';
  placeholder?: string;
  /**
   * Column init visible,default true
   */
  columnVisible?: 'fixed' | boolean;
  slot?: TemplateRef<HTMLElement>;
  errorTip?: string;
  right?: boolean;
  left?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  resizeable?: boolean;
  width?: number;
  /**
   * Button List
   * [type='btnList']
   */
  btns?: ColumnBtn[];
  showFn?: (item, index, apis) => boolean;
  filterFn?: boolean | ((item, index, apis) => boolean);
  disabledFn?: (item, index, apis) => boolean;
  enums?: any[];
}
interface ColumnBtn {
  title?: string;
  icon?: string;
  action?: 'edit' | 'delete' | 'add' | 'insert' | 'addChild';
  click?: (item, index, apis) => void;
  showFn?: (item, index, apis) => boolean;
  confirm?: boolean;
  confirmFn?: (item, index, apis) => boolean;
  confirmTitle?: NzTSType;
  type?: 'dropdown';
  menus?: {
    title: string;
    click: (item) => void;
  };
}
export interface IconBtn extends ColumnBtn {
  fnName?: string;
}
