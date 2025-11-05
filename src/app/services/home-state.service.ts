import { Injectable } from '@angular/core';
import { currency_title } from '../constants/Values';

@Injectable({
  providedIn: 'root'
})
export class HomeStateService {

  currentCategory: string = currency_title;
  categoryScrollValue: number = 0;
  currentSubCategory: string = currency_title;
  subCategoryScrollValue: number = 0;

  setCategory(category: string) {
    this.currentCategory = category;
  }

  setCategoryScrollValue (value: number) {
    this.categoryScrollValue = value;
  }
  
  setSubCategoryScrollValue (value: number) {
    this.subCategoryScrollValue = value;
  }

  setSubCategory(subCategory: string) {
    this.currentSubCategory = subCategory;
  }
}
