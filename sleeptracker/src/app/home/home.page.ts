import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
	standalone: true,
	imports: [
	  IonicModule,
	  CommonModule,
	  FormsModule
	],
  })
  export class HomePage implements OnInit {
	currentWeekDay: string = '';
	currentDate: string = '';
	selectedSegment = 'home';
  
	constructor() {}
  
	ngOnInit() {
	  this.updateDateTime();
	  setInterval(() => {
		this.updateDateTime();	
	  }, 1000000);
	}
  
	updateDateTime() {
	  const now = new Date();
	  this.currentWeekDay = now.toLocaleString('en-US', {
		weekday: 'long',
	  });
	  this.currentDate = now.toLocaleString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	  });
	}

	/* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
	get allSleepData() {
		return SleepService.AllSleepData;
	}
}