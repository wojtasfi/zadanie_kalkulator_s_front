import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {SalaryRequestDto} from '../shared/SalaryRequestDto.model';
import {Observable} from 'rxjs/Observable';
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {

  countryCodes: String[];
  calculatorUrl = 'http://localhost:8080/calculator/';
  salary = 0;
  errorMessage = '';
  currencyCode = '';

  constructor(private http: HttpClient) {

  }

  ngOnInit() {
    this.fillCountryCombobox();
  }

  calculateSalary(dailySalary: HTMLInputElement, selectedCountry: HTMLInputElement) {
    this.errorMessage = '';

    if (!this.isDailySalaryFormatValid(dailySalary.value)) {
      this.errorMessage = 'Daily Gross Salary format is invalid';
      return;
    }
    const salaryRequestDto = new SalaryRequestDto(
      selectedCountry.value,
      dailySalary.value
    );
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const observable: Observable<number> =
      this.http.post<number>(this.calculatorUrl + 'calculateSalary',
        salaryRequestDto, httpOptions).pipe(
        catchError(this.handleError('calculateSalary', 0))
      );

    observable.subscribe(value => this.salary = value);

  }

  private isDailySalaryFormatValid(value) {
    const regexp = new RegExp('((\\d+)(\\.\\d{1,2}))|\\d+');
    return regexp.test(value);
  }

  private fillCountryCombobox() {
    const observable: Observable<String[]> =
      this.http.get<String[]>(this.calculatorUrl + 'countries').pipe(
        catchError(this.handleError('countries', []))
      );

    observable.subscribe(value => this.countryCodes = value);
  }

  updateCurrencyCode(countryCode: HTMLInputElement) {
    const params = new HttpParams().set('countryCode', countryCode.value);

    this.http.get(this.calculatorUrl + 'currencyCode', {
      responseType: 'text', params: params
    })
      .pipe(
        catchError(this.handleError('currencyCode', ''))
      ).subscribe(value => this.currencyCode = value);
  }

  private handleError<T>(operationType, safeResult: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.setErrorMessage(operationType);
      return of(safeResult as T);
    };
  }

  private setErrorMessage(operationType: string) {
    if (operationType === 'calculateSalary') {
      this.errorMessage = 'Could not calculate salary.';
    } else if (operationType === 'countries') {
      this.errorMessage = 'Could not get countries codes.';
    } else if (operationType === 'currencyCode') {
      this.errorMessage = 'Could not get currency code.';
    }
  }

  private checkIfErrorOccured(): boolean {
    if (this.errorMessage !== '') {
      return true;
    }
    return false;
  }


}
