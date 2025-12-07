import { computed, Injectable, signal } from '@angular/core';

export interface NotificationItem {
  id: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private isVisible = signal(false);
  private queue = signal<NotificationItem[]>([]);
  private visible = signal<boolean>(false);
  styleClasses = signal<string[]>([]);

  readonly queue$ = computed(() => this.queue());
  readonly isVisible$ = computed(() => this.visible());

  
  notificationQueue: string[] = [];
  isNotifying: boolean = false;
  currentNotification: string | null = null;
  notificationState: 'visible' | 'hidden' = 'hidden';

  constructor () {
    this.addClass('translate-y-[-15rem]');
    this.addClass('translate-x-0');
  }

  show(message: string) {
    const id = crypto.randomUUID();
    this.queue.update(q => [...q, { id, message }]);
    this.processQueue();
  }

  private processQueue() {
    if (this.visible()) return;

    this.visible.set(true);
    this.removeClass('translate-y-[-15rem]')
    this.addClass('enter-animation')

    setTimeout(() => {
          this.removeCurrent()
    }, 4000);
    
    setTimeout(() => {
      this.visible.set(false);
    }, 5000);
  }

  hide() {
    this.visible.set(false);
    this.queue.update(q => {
      const [, ...rest] = q;
      return rest;
    });
    if (this.queue().length > 0) this.processQueue();
  }

  removeCurrent () {
    this.removeClass('enter-animation')
    this.addClass('leave-animation')
    this.removeClass('translate-x-0')

    setTimeout(() => {
      this.removeClass('leave-animation')
      this.addClass('translate-x-0')
      this.addClass('translate-y-[-15rem]')
      
      if (!this.visible()) this.hide()
    }, 1000);
  }

  addClass(cls: string) {
    this.styleClasses.update(list => [...list, cls]);
  }
  
  removeClass(cls: string) {
    this.styleClasses.update(list => list.filter(c => c !== cls));
  }
  
  clearClasses() {
    this.styleClasses.set([]);
  }

  getQueue = computed(() => this.queue());
  getVisibility = computed(() => this.isVisible());



  // showAnimation (type: string) {
  //   this.notificationQueue.push(type)
  // }

  // processQueue (element: ElementRef<HTMLDivElement>) {
  //   if (this.isNotifying || this.notificationQueue.length === 0) return;

  //   this.isNotifying = true;

  //   this.currentNotification = this.notificationQueue.shift()!;
  //   this.notificationState = 'visible';

  //   element?.nativeElement.classList.remove('translate-y-[-15rem]')
  //   element?.nativeElement.classList.add('enter-animation')
    

  //   setTimeout(() => {
  //     element?.nativeElement.classList.remove('enter-animation')
  //     element?.nativeElement.classList.add('leave-animation')

  //     setTimeout(() => {
  //       element?.nativeElement.classList.remove('leave-animation')
  //       element?.nativeElement.classList.add('translate-x-0')
  //       element?.nativeElement.classList.add('translate-y-[-15rem]')

  //       if (this.notificationState === 'hidden') {
  //         this.currentNotification = null;
  //         this.isNotifying = false;
  //         this.processQueue(element)
  //       }
  //     }, 1000);
  //   }, 4000);

  //   setTimeout(() => {
  //       this.notificationState = 'hidden'
  //   }, 5000);

  // }
  
  // removeNotification () {    
  //   element?.nativeElement.classList.remove('enter-animation')
  //   element?.nativeElement.classList.add('leave-animation')

  //   setTimeout(() => {
  //     element?.nativeElement.classList.remove('leave-animation')
  //     element?.nativeElement.classList.add('translate-x-0')
  //     element?.nativeElement.classList.add('translate-y-[-15rem]')

  //     if (this.notificationState === 'hidden') {
  //       this.currentNotification = null;
  //       this.isNotifying = false;
  //       this.processQueue(element)
  //     }
  //   }, 1000);
  // }
}
