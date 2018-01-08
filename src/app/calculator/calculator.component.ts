import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SalaryRequestDto} from '../shared/SalaryRequestDto.model';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html'
})
export class CalculatorComponent implements OnInit {

  countryCodes: String[] = ['US', 'DE'];
  calculatorUrl = 'http://localhost:8080/calculator/';
  salary = 0;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
  }

  calculateSalary(dailySalary: HTMLInputElement, selectedCountry: HTMLInputElement) {

    const salaryRequestDto = new SalaryRequestDto(
      selectedCountry.value,
      dailySalary.value
    );
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:8080'
      })
    };
    const observable: Observable<number> =
      this.http.post<number>(this.calculatorUrl + 'calculateSalary',
        salaryRequestDto, httpOptions);

    observable.subscribe(value => this.salary = value);

  }

}
