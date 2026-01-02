import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2, signal, WritableSignal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private renderer: Renderer2;
  private themeKey = 'user-theme';
  public currentMode: WritableSignal<ThemeMode>;

  constructor(private rendererFactory: RendererFactory2, @Inject(DOCUMENT) private document: Document) {
    this.renderer = rendererFactory.createRenderer(null, null)
    const initialMode = this.document.documentElement.getAttribute('data-mode') as ThemeMode || 'system';
    this.currentMode = signal<ThemeMode>(initialMode);
    
    if (typeof window !== 'undefined') {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (this.currentMode() === 'system') {
          this.updateDarkClass(e.matches);
        }
      });
    }
  }

  private setMode(mode: ThemeMode): void {
    this.currentMode.set(mode);
    this.renderer.setAttribute(this.document.documentElement, 'data-mode', mode);
    this.setCookie(this.themeKey, mode, 365);

    if (mode === 'system') {
      this.updateDarkClass(window.matchMedia('(prefers-color-scheme: dark)').matches);
    } else {
      this.updateDarkClass(mode === 'dark');
    }
  }

  private updateDarkClass(isDark: boolean): void {
    if (isDark) {
      this.renderer.addClass(this.document.documentElement, 'dark');
    } else {
      this.renderer.removeClass(this.document.documentElement, 'dark');
    }
  }

  getStringTheme () {
    return this.currentMode
  }

  public cycleTheme(): void {
    const current = this.currentMode();
    let next: ThemeMode;

    if (current === 'light') {
      next = 'dark';
    } else if (current === 'dark') {
      next = 'system';
    } else {
      next = 'light';
    }

    this.setMode(next);
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
