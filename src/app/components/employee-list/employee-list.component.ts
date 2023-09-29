import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../service/api.service';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})

export class EmployeeListComponent implements OnInit {

  ColumnMode = ColumnMode;

  Employee: any = [];

  rows: any = [];
  loadingIndicator = true;
  reorderable = true;

  columns = [
    // { prop: '_id' },
    { prop: 'name' },
    { prop: 'email' },
    { prop: 'designation' },
    { prop: 'phoneNumber' },
    // { name: "Actions", prop: 'Actions' }
  ];

  page = {
    totalElements: 0,
    pageNumber: 0,
    size: 0,
    totalPages: 0,
  }

  sort = {
    column: '_id',
    order: 'asc'
  }

  constructor(private apiService: ApiService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.setPage({ offset: 0 });
  }

  readEmployee() {
    this.apiService.getEmployees({ ...this.page, ...this.sort }).subscribe((result) => {
      this.page = result['page'];
      this.rows = result['data'];
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1500);
    });
  }

  removeEmployee(employee) {
    if (window.confirm('Are you sure?')) {
      this.apiService.deleteEmployee(employee).subscribe((data) => {
        this.readEmployee()
      });
    }
  }

  setPage(e) {
    this.page.pageNumber = e.offset;
    this.readEmployee()
  }

  onSort(e) {
    this.sort = {
      column: e.column.prop,
      order: e.newValue
    }
    this.readEmployee()
  }
}
