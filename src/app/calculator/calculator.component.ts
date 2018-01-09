import {Component, OnInit} from '@angular/core';
import {SalaryRequestDto} from '../shared/SalaryRequestDto.model';
import {isUndefined} from 'util';
import {RestService} from '../rest/rest.service';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {

  countryCodes: String[];
  salary = 0;
  errorMessage = '';
  currencyCode = '';

  constructor(private restService: RestService) {

  }

  ngOnInit() {
    this.fillCountryCombobox();
  }

  calculateSalary(dailySalary: HTMLInputElement, selectedCountry: HTMLInputElement) {
    this.errorMessage = '';

    if (!this.validateInput(dailySalary, selectedCountry)) {
      return;
    }

    const salaryRequestDto = new SalaryRequestDto(
      selectedCountry.value,
      dailySalary.value
    );

    this.restService.calculateSalary(salaryRequestDto)
      .subscribe(
        value => {
          this.salary = value;
        },
        error => {
          this.setErrorMessage('calculateSalary');
        }
      );

  }

  private validateInput(dailySalary: HTMLInputElement, selectedCountry: HTMLInputElement) {
    if (!this.isDailySalaryFormatValid(dailySalary.value)) {
      this.errorMessage = 'Daily Gross Salary format is invalid';
      return false;
    }
    if (this.countryCodes === undefined) {
      this.errorMessage = 'Pick the country';
      return false;
    }
    const cmbValue = this.countryCodes.find(value => value === selectedCountry.value);
    console.log(selectedCountry);
    if (isUndefined(cmbValue) || cmbValue === null) {
      this.errorMessage = 'Pick the country';
      return false;
    }
    return true;
  }

  private isDailySalaryFormatValid(value) {
    const regexp = new RegExp('^(((\\d+)(\\.\\d{1,2}))|\\d+)$');
    return regexp.test(value);
  }

  private fillCountryCombobox() {

    this.restService.getCountryCodes()
      .subscribe(value => {
          this.countryCodes = value;
        },
        error => {
          this.setErrorMessage('countries');
        });
  }

  updateCurrencyCode(countryCode: HTMLInputElement) {
    this.restService.getCurrencyCode(countryCode.value)
      .subscribe(value => {
          this.currencyCode = value;
        },
        error => {
          this.setErrorMessage('currencyCode');
        });
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
