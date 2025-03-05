import { Component } from '@angular/core';
import 
{ IonApp, 
  IonRouterOutlet, 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, analytics } from 'ionicons/icons';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    IonApp, 
    IonRouterOutlet,
  ],
})
export class AppComponent {
  constructor() {

    addIcons({ home, analytics });
  }
}
