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
	// Create empty strings for current dates
	currentWeekDay: string = '';
	currentDate: string = '';

	// Default page segment is home
	selectedSegment = 'home';

	// Default sleep and wake time to current date
	sleepTime: string = new Date().toISOString();
	wakeTime: string = new Date().toISOString();

	// Default empty string for sleep summary
	sleepSummary: string = '';

	// Checks for whether modals should be open
	isModalOpen = false;
	isSleepinessModalOpen = false;

	// Default for sleepiness level
	sleepinessLevel: number = 1;

	// Stores previous sleep data in an array
	pastSleepLogs: any[] = [];
	pastSleepinessLogs: any[] = [];

	// Data section
	weekDays: any[] = [];
	selectedDate: string = ''
	selectedLog: any = null;
	selectedSleepinessLog: any = null;


	constructor(private alertCtrl: AlertController, private sleepService: SleepService) { }

	ngOnInit() {
		this.updateDateTime();
		this.generateWeekDays();
	}

	generateWeekDays() {
		const today = new Date();
		this.weekDays = Array.from({ length: 7 }, (_, i) => {
		  const date = new Date(today);
		  date.setDate(today.getDate() - i);
		  
		  // Adjust to local time zone by manually formatting
		  const localDateString = date.getFullYear() + '-' +
			String(date.getMonth() + 1).padStart(2, '0') + '-' +
			String(date.getDate()).padStart(2, '0');
	  
		  return {
			date: localDateString,
			label: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
		  };
		}).reverse();
	  }
	  

	  selectDate(dateString: string) {
		console.log("Raw Selected Date:", dateString);
	
		this.selectedDate = dateString;
	
		this.updateSelectedDate();
	}
	


	updateSelectedDate() {
		const selectedDateStr = this.selectedDate;
	
		this.selectedLog = this.pastSleepLogs.find(log => {
			const logDate = new Date(log.sleepStart);
			const logDateStr = logDate.getFullYear() + '-' +
							  String(logDate.getMonth() + 1).padStart(2, '0') + '-' +
							  String(logDate.getDate()).padStart(2, '0');
			
			console.log("Comparing Log Date:", logDateStr, "with Selected Date:", selectedDateStr);
			return logDateStr === selectedDateStr;
		}) || null;
	
		this.selectedSleepinessLog = this.pastSleepinessLogs.find(log => {
			const logDate = new Date(log.loggedAt);
			const logDateStr = logDate.getFullYear() + '-' +
							  String(logDate.getMonth() + 1).padStart(2, '0') + '-' +
							  String(logDate.getDate()).padStart(2, '0');
	
			console.log("Comparing Sleepiness Log Date:", logDateStr, "with Selected Date:", selectedDateStr);
			return logDateStr === selectedDateStr;
		}) || null;
	
		console.log("Final Selected Sleep Log:", this.selectedLog);
		console.log("Final Selected Sleepiness Log:", this.selectedSleepinessLog);
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
		console.log('sleepTime ' + this.sleepTime)
		console.log('wakeTime ' + this.wakeTime)
		if (this.checkValidSleepTime()) {
			const sleepDate = new Date(this.sleepTime);
			const wakeDate = new Date(this.wakeTime);
			const sleepLog = new OvernightSleepData(sleepDate, wakeDate);

			this.sleepService.logOvernightData(sleepLog);
			this.loadSavedData();
			this.setOpen('sleep', false);
		} else {
			this.showInvalidTimeAlert();
		}
	}


	saveSleepinessData() {
		const sleepinessLog = new StanfordSleepinessData(this.sleepinessLevel);
		this.sleepService.logSleepinessData(sleepinessLog);
		this.loadSavedData();
		this.setOpen('sleepiness', false);
	}


	loadSavedData() {
		this.pastSleepLogs = this.sleepService.getAllOvernightData();
		this.pastSleepinessLogs = this.sleepService.getAllSleepinessData();
		console.log("Loaded Sleep Logs:", this.pastSleepLogs);
		console.log("Loaded Sleepiness Logs:", this.pastSleepinessLogs);
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


	getSleepinessDescription(): string {
		return new StanfordSleepinessData(this.sleepinessLevel).summaryString();
	}


	/* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
	get allSleepData() {
		return SleepService.AllSleepData;
	}
}