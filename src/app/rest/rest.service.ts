import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {SalaryRequestDto} from '../shared/SalaryRequestDto.model';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class RestService {

  calculatorUrl = 'http://localhost:8080/calculator/';

  constructor(private http: HttpClient) {
  }

  calculateSalary(salaryRequestDto: SalaryRequestDto): Observable<number> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<number>(this.calculatorUrl + 'calculateSalary',
      salaryRequestDto, httpOptions);
  }

  getCountryCodes(): Observable<String[]> {
    return this.http.get<String[]>(this.calculatorUrl + 'countries');
  }

  getCurrencyCode(countryCode: string): Observable<string> {
    const params = new HttpParams().set('countryCode', countryCode);

    return this.http.get(this.calculatorUrl + 'currencyCode', {
      responseType: 'text', params: params
    });
  }

}
