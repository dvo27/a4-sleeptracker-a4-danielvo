import { Component } from '@angular/core';
import { 
	IonHeader, 
	IonToolbar, 
	IonTitle, 
	IonContent,
	IonDatetime,
	IonModal,
	IonDatetimeButton
 } from '@ionic/angular/standalone';
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
	IonDatetime,
	IonDatetimeButton,
	IonModal,
],
})
export class HomePage {
	currentDateTime: string='';
  	constructor(public sleepService:SleepService) {}

	ngOnInit() {
		console.log(this.allSleepData);
		this.updateDateTime();
		setInterval(() => {
			this.updateDateTime();	
		}, 1000); // Update every second
	}
	
	updateDateTime() {
		const now = new Date();
		this.currentDateTime = now.toLocaleString('en-US', {
		  weekday: 'long',
		  month: 'short',
		  day: 'numeric',
		  year: 'numeric',
		  hour: '2-digit',
		  minute: '2-digit',
		  second: '2-digit',
		  hour12: true
		});
	  }

	/* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
	get allSleepData() {
		return SleepService.AllSleepData;
	}
}
