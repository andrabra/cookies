import { Component, HostListener } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { productsData } from './data/productsData';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  currency = '$';
  productsData: any;

  mainImgStyle: any;
  orderImgStyle: any;

  loader = true;
  loaderShowed = true;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: any) {
    this.mainImgStyle = {
      transform:
        'translate(' +
        (e.clientX * 0.3) / 8 +
        'px, ' +
        (e.clientY * 0.3) / 8 +
        'px)',
    };
    this.orderImgStyle = {
      transform:
        'translate(-' +
        (e.clientX * 0.3) / 8 +
        'px, -' +
        (e.clientY * 0.3) / 8 +
        'px)',
    };
  }

  form = this.fb.group({
    product: ['', Validators.required],
    name: ['', Validators.required],
    phone: ['', Validators.required],
  });

  constructor(private fb: FormBuilder, private http: HttpClient) {}


  ngOnInit() {

    setTimeout(() => {
      this.loaderShowed = false;
    }, 2);

    setTimeout(() => {

      this.loader = false;

    }, 3);

    this.http.get('https://testologia.ru/cookies').subscribe((data: any) => {
      this.productsData = data;
    });
  }

  scrollTo(target: HTMLElement, product?: any) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (product) {
      this.form.patchValue({
        product:
          product.title + ' (' + product.price + ' ' + this.currency + ')',
      });
    }
  }

  switchSugarFree(e: any) {
    this.http
      .get(
        'https://testologia.ru/cookies' +
          (e.currentTarget.checked ? '?sugarfree' : '')
      )
      .subscribe((data) => (this.productsData = data));
  }

  changeCurrency() {
    let newCurrency = '$';
    let coefficient = 1;
    if (this.currency === '$') {
      newCurrency = '₽';
      coefficient = 90;
    } else if (this.currency === '₽') {
      newCurrency = 'BYN';
      coefficient = 3;
    } else if (this.currency === 'BYN') {
      newCurrency = '€';
      coefficient = 0.9;
    } else if (this.currency === '€') {
      newCurrency = '¥';
      coefficient = 6.9;
    }
    this.currency = newCurrency;

    this.productsData.forEach((product: any) => {
      // product.price = Math.round(product.basePrice * coefficient);
      product.price = +(product.basePrice * coefficient).toFixed(2);
    });
  }

  confirmOrder() {
    if (this.form.valid) {
      this.http
        .post('https://testologia.ru/cookies-order', this.form.value)
        .subscribe({
          next: (response: any) => {
            alert(response.message);
            this.form.reset();
          },
          error: (response: any) => {
            alert(response.error.message);
          },
        });
    }
  }
}
