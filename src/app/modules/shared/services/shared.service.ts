import { Injectable, ComponentRef, ComponentFactoryResolver, ApplicationRef, Injector } from '@angular/core';
import { NotificationComponent } from '../components/modals/notification/notification.component';
import { ExpiringSessionCountdownComponent } from '../components/modals/expiring-session-countdown/expiring-session-countdown.component';

@Injectable({ providedIn: 'root' })
export class SharedService {
  private notificationRef?: ComponentRef<NotificationComponent>;
  private sessionRef?: ComponentRef<ExpiringSessionCountdownComponent>;
  public displayingExpiringSessionModal = false;

  constructor(
    private resolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  showNotification(isSuccess: boolean, title: string, message: string) {
    if (this.notificationRef) this.closeNotification();
    
    const factory = this.resolver.resolveComponentFactory(NotificationComponent);
    this.notificationRef = factory.create(this.injector);

    Object.assign(this.notificationRef.instance, { isSuccess, title, message });

    document.body.appendChild(this.notificationRef.location.nativeElement);
    this.appRef.attachView(this.notificationRef.hostView);
  }

  closeNotification() {
    if (this.notificationRef) {
      this.appRef.detachView(this.notificationRef.hostView);
      this.notificationRef.destroy();
      this.notificationRef = undefined;
    }
  }

  openExpiringSessionCountdown(targetTime: number) {
    if (this.sessionRef) return;

    const factory = this.resolver.resolveComponentFactory(ExpiringSessionCountdownComponent);
    this.sessionRef = factory.create(this.injector);
    
    Object.assign(this.sessionRef.instance, { targetTime });

    document.body.appendChild(this.sessionRef.location.nativeElement);
    this.appRef.attachView(this.sessionRef.hostView);

    this.displayingExpiringSessionModal = true;
  }

  closeSessionCountdown() {
    if (this.sessionRef) {
      this.appRef.detachView(this.sessionRef.hostView);
      this.sessionRef.destroy();
      this.sessionRef = undefined;
    }
    this.displayingExpiringSessionModal = false;
  }
}