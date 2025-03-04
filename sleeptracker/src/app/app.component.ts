import { Component } from '@angular/core';
import 
{ IonApp, 
  IonRouterOutlet, 
	IonTabBar,
	IonTabButton,
	IonTabs,
	IonIcon,
  IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, analytics } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    IonApp, 
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonIcon,
    IonLabel
  ],
})
export class AppComponent {
  constructor() {
    addIcons({home, analytics});
  }
}
