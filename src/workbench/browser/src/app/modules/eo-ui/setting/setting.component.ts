import { Component, ComponentRef, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

export interface SettingItem {
  title: string;
  id?: string;
  ifShow?: () => boolean;
  comp?: any;
  disabled?: boolean;
  configuration?: any[];
}

@Component({
  selector: 'eo-setting',
  template: `<section class="flex flex-col">
    <eo-ng-tabset class="mx-[5px]" [nzSelectedIndex]="selectedTabIndex">
      <div *ngFor="let tab of nzData">
        <eo-ng-tab [nzTitle]="tab.title" *ngIf="checkItemShow(tab)" (nzClick)="this.selectModule(tab.id)"> </eo-ng-tab>
      </div>
    </eo-ng-tabset>
    <div class="px-[15px] mt-[15px]">
      <ng-template #options></ng-template>
    </div>
  </section> `,
  styles: [
    `
      ::ng-deep {
        .eo-setting-modal {
          width: 600px !important;

          .ant-modal-body {
            padding: 0 0 15px;
            min-height: 300px;
            border-radius: var(--DEFAULT_BORDER_RADIUS);
          }
        }
      }
    `
  ]
})
export class EoSettingComponent implements OnInit, OnDestroy {
  @Input() selectedModule: string;
  @Input() nzData: SettingItem[];
  @ViewChild('options', { read: ViewContainerRef, static: true }) options: ViewContainerRef;
  private componentRefs: Array<ComponentRef<any>> = [];
  selectedTabIndex;

  /** local configure */

  constructor() {}

  ngOnInit(): void {
    this.init();
  }
  updateView() {
    let selectModule = this.nzData.find(val => val.id === this.selectedModule);
    this.componentRefs.forEach(item => item.destroy());
    const componentRef = this.options.createComponent<any>(selectModule.comp as any);
    componentRef.location.nativeElement.id = selectModule.id;
    this.componentRefs.push(componentRef);
    console.log(this.componentRefs, this.selectedModule, this.options);
  }
  selectModule(id) {
    this.selectedModule = id;
    this.selectedTabIndex = this.nzData.filter(node => this.checkItemShow(node)).findIndex(node => node.id === id);
    this.updateView();
  }
  checkItemShow(node) {
    return !node.ifShow || node.ifShow();
  }
  /**
   * Parse the configuration information of all modules
   */
  private init() {
    // The first item is selected by default
    let node = this.nzData.find(node => node.id === this.selectedModule && this.checkItemShow(node));
    if (this.selectedModule && !node) {
      eoConsole.error(`[eo-setting]: The selected module [${this.selectModule}] does not exist`);
    }
    node = node || this.nzData.find(node => this.checkItemShow(node));
    this.selectModule(node.id);
  }

  ngOnDestroy(): void {
    this.componentRefs.forEach(item => item.destroy());
  }
}
