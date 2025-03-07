import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
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
	sleepTime: string = '';
	wakeTime: string = '';
  
	constructor(private modalCtrl: ModalController) {}
  
	ngOnInit() {
	  this.updateDateTime();
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

	saveSleepData() {
		console.log(`Sleep Time: ${this.sleepTime}`);
		console.log(`Wake-Up Time: ${this.wakeTime}`);
		this.closeModal();
	}
	
	closeModal() {
		this.modalCtrl.dismiss();
	}

	/* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
	get allSleepData() {
		return SleepService.AllSleepData;
	}
}