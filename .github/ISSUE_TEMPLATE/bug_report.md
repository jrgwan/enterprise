---
name: M3-Odin-2.1 ... expand a row in a datagrid
about: datagrid expand a row

---

<!-- Please be aware that this is a publicly visible bug report. Do not post any credentials, screenshots with proprietary information, or anything you think shouldn't be visible to the world. If private information is required to be shared for a quality bug report, please email one of the [code owners](https://github.com/infor-design/enterprise/blob/master/.github/CODEOWNERS) directly. -->

**Describe the bug**
I want to expand a datagrid-row and I get no Information about the row I click.
below the code: (args.length is not defined ???????)
   onExpandrow(args: any[], isSingleSelect?: boolean) {
      const newCount = args.length;
      const expandrow = args && newCount === 1 ? args[0].data : null;
      this.hasExpandrow = !!expandrow;
      if (this.hasExpandrow) {
         ///   20200120 this.getDetails(selected);
         this.getDetailsHistory(expandrow);
      }
   }
   
When I select a row in the same datagrid, I get these informations.
below the perfect working code: (args.length is defined !!!)
   onSelected(args: any[], isSingleSelect?: boolean) {
      const newCount = args.length;
      const selected = args && newCount === 1 ? args[0].data : null;
      this.hasSelected = !!selected;
      if (this.hasSelected) {
         ///   20200120 this.getDetails(selected);
         this.getDetailsHistory(selected);
      }
   }

**To Reproduce**
Steps to reproduce the behavior: 
1. unfortunately only on my local maschine

**Expected behavior**
I want to get the row-information I want to expand.
f.e. I've a mashine 4711 and I want to know which details this have ...

**Version**
<!-- You can find this by inspecting the document html tag or sohoxi.js script header -->
- ids-enterprise-ng: [v5.0.0]

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Platform**
  - OS Version: [e.g. Windows 10 ]
 - Browser Name [e.g. chrome]
 




**Additional context**
Add any other context about the problem here.
import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreBase, IMIRequest, IMIResponse, MIRecord } from '@infor-up/m3-odin';
import { MIService, UserService, M3OdinModule } from '@infor-up/m3-odin-angular';
import { SohoDataGridComponent, SohoMessageService, SohoAngularEditorAdapter, SohoDataGridModule } from 'ids-enterprise-ng';
import { NumberFormatStyle } from '@angular/common';

@Component({
   templateUrl: './datagrid-christ20191218.component.html'
})
export class DatagridChrist20191218Component extends CoreBase implements OnInit {
   @ViewChild('pricesDatagrid2') datagrid: SohoDataGridComponent;
  // @ViewChild('pricesDatagrid3') datagridh: SohoDataGridComponent;

   datagridOptions: SohoDataGridOptions;
   datagridOptionsh: SohoDataGridOptions;
   items: any[] = [];
   detailItem: any;
   hasDisplayed: boolean;
   hasSelected: boolean;
   hasExpandrow: boolean;
   isBusy = false;
   isDetailBusy = false;
   ODITNO: string;                                             // 20191213
   ITNO: string;                                               // 20191217
   editor?: SohoDataGridColumnEditorFunction | string;         // 20191219

   private maxRecords = 100;
   private pageSize = 10;

   constructor(private miService: MIService, private userService: UserService, private messageService: SohoMessageService) {
      super('Datagrid-christ20191218Component');
      this.initGrid();
   }

   ngOnInit() {
      this.ITNO = '';
      this.listItems(this.ITNO);
   }

   private initGrid() {
      const options: SohoDataGridOptions = {
         selectable: 'single' as SohoDataGridSelectable,
         disableRowDeactivation: true,
         clickToSelect: false,
         alternateRowShading: true,
         cellNavigation: false,
         idProperty: 'col-odtx40',
         paging: true,
         pagesize: this.pageSize,
         indeterminate: false,
         filterable: true,                               //  added by JW
         editable: true,                                 //  added by JW
         toolbar: {title: 'gefundene Preislisten',
         results: true, personalize: true, actions: true, rowHeight: true,
         keywordFilter: true,  collapsibleFilter: true},    //  added by JW

         columns: [
            {
               width: 50, id: 'selectionCheckbox', field: '', name: '', sortable: false,
               resizable: false, align: 'center', formatter: Soho.Formatters.SelectionCheckbox
            },
            {
               width: 'auto', id: 'col-oditno', field: 'ODITNO', name: 'Artikel',
               formatter: Soho.Formatters.Expander, filterType: 'text', textOverflow: 'ellipsis'
            },
            {
               width: 'auto', id: 'col-odprrf', field: 'ODPRRF', name: 'Preisliste',
               resizable: true, filterType: 'text', sortable: true
            },
            {
               width: 'auto', id: 'col-odtx40', field: 'MSTX40', name: 'Beschreibung',
               resizable: true, filterType: 'text', sortable: true
            },
            {
               width: 'auto', id: 'col-odcuno', field: 'ODCUNO', name: 'Kunde',
               resizable: true, filterType: 'text', sortable: true
            },
            {
              width: 'auto', id: 'col-odsapr', field: 'ODSAPR', name: 'Verk.-Preis',
              resizable: true, filterType: 'text', sortable: true
           },
           {
            width: 'auto', id: 'col-v_sapn', field: 'V_SAPN', name: 'Neuer Verk.-Preis',
            resizable: false, align: 'center',
            formatter: Soho.Formatters.Decimal,
            editor: Soho.Editors.Input,
            numberFormat: {minimumFractionDigits: 3, maximumFractionDigits: 5
            }
         },
           {
            width: 'auto', id: 'col-odcucd', field: 'ODCUCD', name: 'Währung',
            resizable: true, filterType: 'text', sortable: true
         },
         {
          width: 'auto', id: 'col-dsappr', field: 'DSAPPR', name: 'Durch.-Preis',
          resizable: true, filterType: 'text', sortable: true
       },
       {
        width: 'auto', id: 'col-v_marg', field: 'V_MARG', name: 'Deck.-Beitrag',
        resizable: true, filterType: 'text', sortable: true
      },
      {
         width: 'auto', id: 'col-odfvdt', field: 'ODFVDT', name: 'gültig ab',
         resizable: true, filterType: 'text', sortable: true
       },
       {
         width: 'auto', id: 'col-odlvdt', field: 'ODLVDT', name: 'gültig bis',
         resizable: true, filterType: 'text', sortable: true,
       }
         ],
         dataset: [],
         emptyMessage: {
            title: 'No prices available',
            icon: 'icon-empty-no-data'
         }
      }
      this.datagridOptions = options;
   }

   private initGridHistory() {
      const optionsh: SohoDataGridOptions = {
         selectable: 'single' as SohoDataGridSelectable,
         disableRowDeactivation: true,
         clickToSelect: false,
         alternateRowShading: true,
         cellNavigation: false,
         idProperty: 'col-osap',
         paging: true,
         pagesize: 3,
         indeterminate: false,
         filterable: false,                               //  added by JW
         editable: false,                                 //  added by JW
         toolbar: {title: 'gefundene History-Daten',
         results: true, personalize: true, actions: true, rowHeight: true,
         keywordFilter: true,  collapsibleFilter: true},    //  added by JW

         columns: [
            {
               width: 'auto', id: 'col-osap', field: 'OSAP', name: 'Osap',
               resizable: true, filterType: 'text', sortable: true
            },
            {
               width: 'auto', id: 'col-sapr', field: 'SAPR', name: 'Sapr',
               resizable: true, filterType: 'text', sortable: true
            },
            {
               width: 'auto', id: 'col-sacd', field: 'SACD', name: 'Sacd',
               resizable: true, filterType: 'text', sortable: true
            },
            {
               width: 'auto', id: 'col-cucd', field: 'CUCD', name: 'Cucd',
               resizable: true, filterType: 'text', sortable: true
            },
            {
              width: 'auto', id: 'col-frd2', field: 'FRD2', name: 'Frd2',
              resizable: true, filterType: 'text', sortable: true
            },
            {
               width: 'auto', id: 'col-lvdt', field: 'LVDT', name: 'Lvdt',
               resizable: true, filterType: 'text', sortable: true
       }
         ],
         dataset: [],
         emptyMessage: {
            title: 'No history available',
            icon: 'icon-empty-no-data'
         }
      }
      this.datagridOptionsh = optionsh;
   }


   onClickOpen(): void {
      this.logDebug('open: ' + this.ITNO);
      this.listItems(this.ITNO);
      // this.listItemsHistory(this.ITNO);
   }

   listItems(ITNO) {

      if (this.isBusy) { return; }
      this.setBusy(true);

      this.userService.getUserContext().subscribe((context) => {
        const record = { ODITNO: this.ITNO};

         const request: IMIRequest = {
              program:      'CMS100MI',
              transaction:  'LstPriceTool',
                record: record,
                outputFields: ['ODITNO', 'ODPRRF', 'MSTX40', 'ODCUNO', 'ODSAPR',
                               'ODCUCD', 'DSAPPR', 'V_MARG', 'V_SAPN', 'ODFVDT', 'ODLVDT'],
                maxReturnedRecords: this.maxRecords
         };

         this.miService.execute(request).subscribe((response: IMIResponse) => { 
            if (!response.hasError()) {
               this.items = response.items;
               this.updateGridData();
            } else {
               this.handleError('Failed to list items');
            }
            this.setBusy(false);
         }, (error) => {
            this.setBusy(false);
            this.handleError('Failed to list items', error);
         });
      }, (error) => {
         this.setBusy(false);
         this.handleError('Failed to get user context', error);
      });
   }

   onCollapserow(args: any[], isSingleSelect?: boolean) {
      console.log('!!!onCollapserow');  //  JW
      if (this.isBusy) { return; }

      const newCount = args.length;
      const expandrow = args && newCount === 1 ? args[0].data : null;
      this.hasSelected = !!this.onExpandrow;
      if (this.hasSelected) {
         ///   20200120 this.getDetails(selected);
         this.getDetailsHistory(expandrow);
      }
   }

   onExpandrow(args: any[], isSingleSelect?: boolean) {
      console.log('!!!onExpandrow');  //  JW
      if (this.isBusy) { return; }

      const newCount = args.length;
      const expandrow = args && newCount === 1 ? args[0].data : null;
      this.hasExpandrow = !!expandrow;
      if (this.hasExpandrow) {
         ///   20200120 this.getDetails(selected);
         this.getDetailsHistory(expandrow);
      }
   }

   onSelected(args: any[], isSingleSelect?: boolean) {
      console.log('!!!onSelected');  //  JW
      if (this.isBusy) { return; }

      const newCount = args.length;
      const selected = args && newCount === 1 ? args[0].data : null;
      this.hasSelected = !!selected;
      if (this.hasSelected) {
         ///   20200120 this.getDetails(selected);
         this.getDetailsHistory(selected);
      }
   }

   onUpdate() {
      const detailItem = this.detailItem;
      this.setBusy(false, true);
      const today = new Date();

      for (let i = 0; i < this.items.length; i++) {
         const newSAPR: number = parseInt(this.items[i].V_SAPN, 10);
         if (newSAPR !== 0) {
            if (this.items[i].ODCUNO === '') {
                  const record1 = {
                  PRRF: this.items[i].ODPRRF,
                  CUCD: this.items[i].ODCUCD,
                  FVDT: this.items[i].ODFVDT,
                  ITNO: this.items[i].ODITNO,
                  SAPR: this.items[i].V_SAPN };
                  const request: IMIRequest = {
                     program: 'OIS017MI',
                     transaction: 'UpdBasePrice',
                     record: record1,
                     };
                     this.setBusy(true, true);
                     this.miService.execute(request).subscribe((response: IMIResponse) => {
                        if (!response.hasError()) {
                           this.getDetailsHistory(response.item);
                           this.refreshGridItem(detailItem);
                        } else {
                           this.setBusy(false, true);
                           this.handleError('Failed to update item');
                        }
                     }, (error) => {
                        this.setBusy(false, true);
                        this.handleError('Failed to update item', error);
                     });
                  } else   {
                  const record2 = {
                  PRRF: this.items[i].ODPRRF,
                  CUCD: this.items[i].ODCUCD,
                  CUNO: this.items[i].ODCUNO,
                  FVDT: this.items[i].ODFVDT,
                  ITNO: this.items[i].ODITNO,
                  SAPR: this.items[i].V_SAPN };
                  const request: IMIRequest = {
                  program: 'OIS017MI',
                  transaction: 'UpdBasePrice',
                  record: record2,
                  };
                  this.setBusy(true, true);
                  this.miService.execute(request).subscribe((response: IMIResponse) => {
                     if (!response.hasError()) {
                        this.getDetailsHistory(response.item);
                        this.refreshGridItem(detailItem);
                     } else {
                        this.setBusy(false, true);
                        this.handleError('Failed to update item');
                     }
                  }, (error) => {
                     this.setBusy(false, true);
                     this.handleError('Failed to update item', error);
                  });
            }  // if (this.items[i].ODCUNO === '' else ...
         }  // if (newSAPR...
      }  // for...
      this.listItems(this.ITNO);
   }  // onUpdate...

   private updateGridData() {
      this.datagrid ? this.datagrid.dataset = this.items : this.datagridOptions.dataset = this.items;
   }

   private updateGridDatah() {
      this.datagrid ? this.datagrid.dataset = this.items : this.datagridOptionsh.dataset = this.items;
   }

   private getDetails(selectedCustomer: MIRecord) {
      this.setBusy(true, true);
      const record = { CUNO: '150' };  //  testjw
      const request: IMIRequest = {
         program: 'CRS610MI',
         transaction: 'GetBasicData',
         // record: selectedCustomer,   //  testjw
         record: record,
         outputFields: ['CUNM', 'CUNO', 'TOWN', 'CSCD', 'CUA1', 'CUA2', 'CUA3', 'CUA4']
      };
      this.miService.execute(request).subscribe((response: IMIResponse) => {
         this.setBusy(false, true);
         if (!response.hasError()) {
            this.detailItem = response.item;
         } else {
            this.detailItem = undefined;
            this.handleError('Failed to get details');
         }
      }, (error) => {
         this.setBusy(false, true);
         this.detailItem = undefined;
         this.handleError('Failed to get details', error);
      });
   }

   private getDetailsHistory(selectedCustomer: MIRecord) {
       this.initGridHistory();
       //   this.listItemsHistory();   //   ?jw
 }

 listItemsHistory() {
   if (this.isBusy) { return; }
   this.setBusy(true);
 
   this.userService.getUserContext().subscribe((context) => {
 
     const record = { ITNO: '87000095x'};
 
     const request: IMIRequest = {
           program:      'MDBREADMI',
           transaction:  'SelZCTSPHU1D1',
             record: record,
             outputFields: ['OSAP', 'SAPR', 'SACD', 'CUCD', 'FRD2', 'LVDT', 'CHID'],
             maxReturnedRecords: this.maxRecords
      };
 
      this.miService.execute(request).subscribe((response: IMIResponse) => {
         if (!response.hasError()) {
            this.items = response.items;
            this.updateGridDatah();
         } else {
            this.handleError('Failed to list history');
         }
         this.setBusy(false);
      }, (error) => {
         this.setBusy(false);
         this.handleError('Failed to list items', error);
      });
   }, (error) => {
      this.setBusy(false);
      this.handleError('Failed to get user context', error);
   });
 }

   private refreshGridItem(detailItem: any) {
      const selected = this.datagrid.selectedRows()[0];
      const clone = Object.assign(selected.data, detailItem);
      this.datagrid.updateRow(selected.idx, clone);
   }

   private setBusy(isBusy: boolean, isDetail?: boolean) {
      isDetail ? this.isDetailBusy = isBusy : this.isBusy = isBusy;
   }

   private handleError(message: string, error?: any) {
      this.logError(message, error ? '- Error: ' + JSON.stringify(error) : '');
      const buttons = [{ text: 'Ok', click: (e, modal) => { modal.close(); } }];
      this.messageService.error()
         .title('An error occured')
         .message(message + '. More details might be available in the browser console.')
         .buttons(buttons)
         .open();
   }
}

