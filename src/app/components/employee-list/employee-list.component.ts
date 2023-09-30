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
    { prop: 'name' },
    { prop: 'email' },
    { prop: 'designation' },
    { prop: 'phoneNumber' },
  ];

  page = {
    totalElements: 0,
    pageNumber: 0,
    size: 0,
    totalPages: 0,
  }

  sort = {
    prop: 'name',
    dir: 'asc'
  }

  search = "";

  loading = false;

  constructor(private apiService: ApiService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.setPage({ page: 1 });
  }

  readEmployee() {
    this.loading = true;

    this.apiService.getEmployees({ ...this.page, ...this.sort, search: this.search }).subscribe((result) => {
      this.page = result['page'];
      this.rows = result['data'];
      setTimeout(() => {
        this.loadingIndicator = false;
        this.loading = false;
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
    this.page.pageNumber = (e.page - 1);
    this.readEmployee()
  }

  onSort(e) {
    this.sort = {
      prop: e.column.prop,
      dir: e.newValue
    }
    this.readEmployee()
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.search = val.trim()

    if (event.key === "Enter" && event.keyCode === 13) {
      this.setPage({ page: 1 });
    }
  }

  onLimitChange(e) {
    this.page.size = Number(e)
    this.setPage({ page: 1 });
  }
}
