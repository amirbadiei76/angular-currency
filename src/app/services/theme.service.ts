import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private renderer: Renderer2;
  private currentTheme: 'light' | 'dark';
  private isDark = false;
  private themeKey = 'user-theme';

  constructor(private rendererFactory: RendererFactory2, @Inject(DOCUMENT) private document: Document) {
    this.renderer = rendererFactory.createRenderer(null, null)
    this.isDark = this.document.documentElement.classList.contains('dark');
    this.currentTheme = this.document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  }

  private setTheme (theme: 'light' | 'dark') {
    if (theme === this.currentTheme) return;
    this.isDark = theme === 'dark' ? true : false
    this.currentTheme = theme;
    if (theme === 'dark') this.renderer.addClass(this.document.documentElement, 'dark')
    else this.renderer.removeClass(this.document.documentElement, 'dark')

    this.setCookie(this.themeKey, theme, 365 * 10);
  }

  getTheme() {
    return this.isDark;
  }

  getStringTheme () {
    return this.currentTheme
  }

  toggleTheme () {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light'
    this.setTheme(newTheme)
  }

  setCookie(name: string, value: string, days: number) {
    let expires = ""
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
      expires = "; expires=" + date.toUTCString();
    }
    this.document.cookie = (name + "=" + ((value) || "") + expires + "; path=/; SameSite=Lax")
  }


  
  inputMouseLeave(event: Event) {
    (event.target as HTMLInputElement).classList.remove('border-light-text2');
    (event.target as HTMLInputElement).classList.remove('dark:border-dark-text2');
    (event.target as HTMLInputElement).classList.add('border-green-btn');
  }
  
  inputMouseEnter(event: Event) {
    (event.target as HTMLInputElement).classList.remove('border-green-btn');
    (event.target as HTMLInputElement).classList.add('border-light-text2');
    (event.target as HTMLInputElement).classList.add('dark:border-dark-text2');
  }
}
