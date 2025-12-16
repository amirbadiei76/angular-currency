import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CurrencyItemDetailsComponent } from './pages/currency-item-details/currency-item-details.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ConverterComponent } from './pages/converter/converter.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, title: 'ارزیاب | قیمت ارز و طلا' },
    { path: 'converter', component: ConverterComponent, title: 'مبدل ارز' },
    { path: ':title', component: CurrencyItemDetailsComponent },
    { path: '**', component: NotFoundComponent, title: 'صفحه مورد نظر یافت نشد' },
];
