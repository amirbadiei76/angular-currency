import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CurrencyItemDetailsComponent } from './currency-item-details/currency-item-details.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: ':title', component: CurrencyItemDetailsComponent }
];
