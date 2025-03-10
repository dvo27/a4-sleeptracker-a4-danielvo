import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
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
	sleepTime: string = new Date().toISOString();
	wakeTime: string = new Date().toISOString();
	sleepSummary: string = '';
	isModalOpen = false;
	isSleepinessModalOpen = false;
	sleepinessLevel: number = 1;

  
	constructor(private alertCtrl: AlertController) {
	}
  
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

	async saveSleepData() {
		// First we check if the sleep range is valid
		if (this.checkValidSleepTime()) {
			// Convert selected sleep times to date objects
			const sleepDate = new Date(this.sleepTime);
			const wakeDate = new Date(this.wakeTime);
	
			// Create OvernightSleepData object and get sleep summary
			const sleepData = new OvernightSleepData(sleepDate, wakeDate);
			this.sleepSummary = sleepData.summaryString();
	
			console.log(`Summary: ${this.sleepSummary}`);
			console.log('Sleep Date: ' + sleepDate)
			console.log('Wake Date: ' + wakeDate)
	
			// Sleep data was valid so we can close modal
			this.setOpen('sleep', false);
		} else {
			// Otherwise, alert user that date selection is invalid
			await this.showInvalidTimeAlert();
		}
	}
	

	checkValidSleepTime(): boolean {
		// Check if there is no sleep time
		if (!this.sleepTime || !this.wakeTime) {
			return false;
		}
	
		// Convert datetime strings to Date objects
		const sleepDate = new Date(this.sleepTime);
		const wakeDate = new Date(this.wakeTime);
	
		// If the wake time was before the sleep time then range is invalid
		if (wakeDate <= sleepDate) {
			return false; // Sleep time must be before wake-up time
		}
	
		// Otherwise, we can save data
		return true;
	}
	
	async showInvalidTimeAlert() {
		const alert = await this.alertCtrl.create({
			header: 'Invalid Time Selection',
			message: 'Sleep time must be before wake-up time. Please select a valid time.',
			buttons: ['OK'],
		});
		await alert.present();
	}
	
	setOpen(modal: 'sleep' | 'sleepiness', isOpen: boolean) {
		if (modal === 'sleep') {
			this.isModalOpen = isOpen;
		} else if (modal === 'sleepiness') {
			this.isSleepinessModalOpen = isOpen;
		}
	}

	saveSleepinessData() {
		const sleepinessData = new StanfordSleepinessData(this.sleepinessLevel);
		console.log(`Sleepiness Level: ${this.sleepinessLevel}`);
		console.log(`Sleepiness Description: ${sleepinessData.summaryString()}`);
		this.setOpen('sleepiness', false);
	}
	
	getSleepinessDescription(): string {
	return new StanfordSleepinessData(this.sleepinessLevel).summaryString();
	}	

	/* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
	get allSleepData() {
		return SleepService.AllSleepData;
	}
}