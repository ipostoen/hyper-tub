import { Injectable, Injector, ElementRef } from '@angular/core';
import { Overlay, ConnectionPositionPair, PositionStrategy, OverlayConfig } from '@angular/cdk/overlay';
import { PortalInjector, ComponentPortal } from '@angular/cdk/portal';
import { PopupRef, PopupContent } from './popup/popup-ref';
import { PopupComponent } from './popup/popup.component';

export type PopupParams<T> = {
  width?: string | number;
  height?: string | number;
  panelClass?: string;
  origin: HTMLElement | ElementRef;
  content: PopupContent;
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class Popup {
  constructor(private overlay: Overlay, private injector: Injector) { }

  open<T>({ origin, content, data, width, height, panelClass }: PopupParams<T>): PopupRef<T> {
    const overlayRef = this.overlay.create(this.getOverlayConfig({ origin, width, height, panelClass }));
    const popupRef = new PopupRef<T>(overlayRef, content, data);

    const injector = this.createInjector(popupRef, this.injector);
    overlayRef.attach(new ComponentPortal(PopupComponent, null, injector));

    return popupRef;
  }

  private getOverlayConfig({ origin, width, height, panelClass }): OverlayConfig {
    let ss, bc;
    if (panelClass === 'fullpage-panel') {
      ss = this.overlay.scrollStrategies.block();
      bc = 'fullpage-backdrop';
    } else if (panelClass === 'centered-panel') {
      ss = this.overlay.scrollStrategies.block();
      bc = ['fullpage-backdrop', 'transparent-backdrop'];
    } else {
      ss = this.overlay.scrollStrategies.reposition();
      bc = 'popup-backdrop';
    }
    return new OverlayConfig({
      hasBackdrop: true,
      width,
      height,
      backdropClass: bc,
      panelClass: panelClass,
      positionStrategy: this.getOverlayPosition(origin, panelClass),
      scrollStrategy: ss
    });
  }

  private getOverlayPosition(origin: HTMLElement, panelClass): PositionStrategy {
    if (panelClass === 'fullpage-panel' || panelClass === 'centered-panel') {
      const positionStrategy = this.overlay.position().global()
        .centerHorizontally().centerVertically();
      return positionStrategy;
    } else {
      const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(origin)
      .withPositions(this.getPositions())
      .withFlexibleDimensions()
      .withViewportMargin(5)
      // .withScrollableContainers()
      .withPush(true);

      return positionStrategy;

    }
  }

  createInjector(popupRef: PopupRef, injector: Injector) {
    const tokens = new WeakMap([[PopupRef, popupRef]]);
    return new PortalInjector(injector, tokens);
  }

  private getPositions(): ConnectionPositionPair[] {
    return [
      {
        originX : 'start',
        originY : 'bottom',
        overlayX: 'start',
        overlayY: 'top',
      },
      {
        originX : 'center',
        originY : 'bottom',
        overlayX: 'center',
        overlayY: 'top',
      },
      {
        originX : 'end',
        originY : 'bottom',
        overlayX: 'end',
        overlayY: 'top',
      },
      // {
      //   originX : 'start',
      //   originY : 'bottom',
      //   overlayX: 'center',
      //   overlayY: 'top',
      // },
    ]
  }

}
