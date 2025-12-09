import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CurrencyItemDetailsComponent } from './pages/currency-item-details/currency-item-details.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, title: 'قیمت ارز و طلا' },
    { path: ':title', component: CurrencyItemDetailsComponent }
];
