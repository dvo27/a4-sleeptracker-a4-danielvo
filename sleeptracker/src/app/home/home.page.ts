import { Component } from '@angular/core';
import { 
	IonHeader, 
	IonToolbar, 
	IonTitle, 
	IonContent,
	IonTab,
	IonTabBar,
	IonTabButton,
	IonTabs,
	IonIcon,
 } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, analytics } from 'ionicons/icons';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
	IonHeader, 
	IonToolbar, 
	IonTitle, 
	IonContent,
	IonTab,
	IonTabBar,
	IonTabButton,
	IonTabs,
	IonIcon,
],
})
export class HomePage {
  constructor(public sleepService:SleepService) {
		addIcons({home, analytics});
	}

	ngOnInit() {
		console.log(this.allSleepData);
	}

	/* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
	get allSleepData() {
		return SleepService.AllSleepData;
	}
}
