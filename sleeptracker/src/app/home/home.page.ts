import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Share } from '@capacitor/share'
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
	selectedSleepinessDate: string = this.getLocalDateString(); 
	sleepinessLevel: number = 1;

	// Stores previous sleep data in an array
	pastSleepLogs: any[] = [];
	pastSleepinessLogs: any[] = [];

	// Data section
	weekDays: any[] = [];
	selectedDate: string = ''
	selectedLog: any = null;
	selectedSleepinessLog: any = null;
	selectedLogSleepAmount: string = '';
	selectedSleepinessLogRating: number = 0;	// Give it a default of 0

	// Numerical Analysis
	sleepData: any;
	sleepinessData: any;
	highestSleep: number = 0;
	lowestSleep: number = 0;
	averageSleep: number = 0.0;
	highestSleepiness: number = 0;
	lowestSleepiness: number = 0;
	averageSleepiness: number = 0.0;

	constructor(private alertCtrl: AlertController, private sleepService: SleepService) { }

	// Get current date and generate the week days based from current day
	ngOnInit() {
		this.updateDateTime();
		this.generateWeekDays();
	}

	// Load our data from the week
	ngAfterViewInit() {
		this.loadWeeklyData();
	}

	// Sharing weekly insights to others
	async shareInsights() {
		const message = 
		`📊 Sleep Tracker Weekly Insights:
		- 💤 Highest Sleep: ${this.highestSleep.toFixed(2)} hrs
		- 😴 Lowest Sleep: ${this.lowestSleep.toFixed(2)} hrs
		- 🏆 Average Sleep: ${this.averageSleep} hrs
		- 🔝 Highest Sleepiness: ${this.highestSleepiness}
		- 🔻 Lowest Sleepiness: ${this.lowestSleepiness}
		- 📉 Average Sleepiness: ${this.averageSleepiness}`;

		await Share.share({
			title: "My Weekly Sleep Insights",
			text: message,
			dialogTitle: "Share your weekly sleep stats",
		});
	}

	loadWeeklyData() {
		// Load previous logs
		this.pastSleepLogs = this.sleepService.getAllOvernightData();
		this.pastSleepinessLogs = this.sleepService.getAllSleepinessData();
	
		// Get the past 7 days data
		const lastWeekDates = this.weekDays.map(day => day.date);
	
		// Extract Sleep Data from last 7 days
		this.sleepData = this.pastSleepLogs
			.filter(log => lastWeekDates.includes(new Date(log.getStartTime()).toISOString().split('T')[0]))
			.map(log => ({
				date: log.getStartTime().toISOString().split('T')[0],
				sleepHours: Math.floor((log.getEndTime().getTime() - log.getStartTime().getTime()) / (1000 * 60 * 60)), 
				sleepMinutes: Math.floor((log.getEndTime().getTime() - log.getStartTime().getTime()) / (1000 * 60)) % 60,
			}));
	
		// Extract Sleepiness Data from last 7 days
		this.sleepinessData = this.pastSleepinessLogs
			.filter(log => lastWeekDates.includes(new Date(log.loggedAt).toISOString().split('T')[0]))
			.map(log => ({
				date: log.loggedAt.toISOString().split('T')[0],
				level: log.getSleepinessLevel(),
			}));
	
		console.log("Filtered Weekly Sleep Data:", this.sleepData);
		console.log("Filtered Weekly Sleepiness Data:", this.sleepinessData);
	
		// Calculate Weekly Trends
		this.calculateWeeklyTrends();
	}
	
	
	calculateWeeklyTrends() {
		// Handle no sleep data case
		if (!this.sleepData || this.sleepData.length === 0) {
			this.highestSleep = 0;
			this.lowestSleep = 0;
			this.averageSleep = 0.0;
		} else {
			// Extract sleep durations (convert to hours)
			const sleepDurations: number[] = this.sleepData.map((log: { sleepHours: number; sleepMinutes: number }) => 
				log.sleepHours + log.sleepMinutes / 60
			);
	
			this.highestSleep = parseFloat(Math.max(...sleepDurations).toFixed(2));
			this.lowestSleep = parseFloat(Math.min(...sleepDurations).toFixed(2));
			this.averageSleep = parseFloat((sleepDurations.reduce((a, b) => a + b, 0) / sleepDurations.length).toFixed(2));
		}
	
		// Handle no sleepiness data case
		if (!this.sleepinessData || this.sleepinessData.length === 0) {
			this.highestSleepiness = 0;
			this.lowestSleepiness = 0;
			this.averageSleepiness = 0.0;
		} else {
			// Extract sleepiness levels
			const sleepinessLevels: number[] = this.sleepinessData.map((log: { level: number }) => log.level);
	
			this.highestSleepiness = parseFloat(Math.max(...sleepinessLevels).toFixed(2));
			this.lowestSleepiness = parseFloat(Math.min(...sleepinessLevels).toFixed(2));
			this.averageSleepiness = parseFloat((sleepinessLevels.reduce((a, b) => a + b, 0) / sleepinessLevels.length).toFixed(2));
		}

	}
	
	
	generateWeekDays() {
		// Get the 7 days of the week from today's date
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
		// Get the selected date from the week date picker and update
		this.selectedDate = dateString;
		this.updateSelectedDate();
	}
	

	updateSelectedDate() {
		// Basically checks for matching logs based on selected dates
		const selectedDateStr = this.selectedDate;
	
		this.selectedLog = this.pastSleepLogs.find(log => {
			const logDate = new Date(log.sleepStart);
			const logDateStr = logDate.getFullYear() + '-' +
							  String(logDate.getMonth() + 1).padStart(2, '0') + '-' +
							  String(logDate.getDate()).padStart(2, '0');
			
			return logDateStr === selectedDateStr;
		}) || null;
	
		this.selectedSleepinessLog = this.pastSleepinessLogs.find(log => {
			const logDate = new Date(log.loggedAt);
			const logDateStr = logDate.getFullYear() + '-' +
							  String(logDate.getMonth() + 1).padStart(2, '0') + '-' +
							  String(logDate.getDate()).padStart(2, '0');
	
			return logDateStr === selectedDateStr;
		}) || null;

		// Present default strings where there is no data
		this.selectedLogSleepAmount = this.selectedLog ? this.selectedLog.sleepSummary : 'No data';
		this.selectedSleepinessLogRating = this.selectedSleepinessLog ? this.selectedSleepinessLog.getSleepinessLevel() : 'No data';
	}
	

	updateDateTime() {
		// Format our current date into smt ledgible
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
		// Check if our time range is valid before we save
		if (this.checkValidSleepTime()) {
			const sleepDate = new Date(this.sleepTime);
			const wakeDate = new Date(this.wakeTime);
			const sleepLog = new OvernightSleepData(sleepDate, wakeDate);

			this.sleepService.logOvernightData(sleepLog);
			this.loadSavedData();
			this.setOpen('sleep', false);
		} else {
			// Otherwise, warn the user that the date range is wrong
			this.showInvalidTimeAlert();
		}
	}


	saveSleepinessData() {
		// Convert selected date to a Date object in local time
		const selectedDateTime = new Date(this.selectedSleepinessDate + 'T00:00:00');
	
		// Create new StanfordSleepinessData object
		const sleepinessLog = new StanfordSleepinessData(this.sleepinessLevel, selectedDateTime);
	
		// Save the log
		this.sleepService.logSleepinessData(sleepinessLog);
	
		console.log("Saved Sleepiness Data:", sleepinessLog);
	
		this.loadSavedData();
		this.setOpen('sleepiness', false);
	}


	loadSavedData() {
		// Load all old saved logs and populate sleepData and sleepinessData with existing data
		this.pastSleepLogs = this.sleepService.getAllOvernightData();
		this.pastSleepinessLogs = this.sleepService.getAllSleepinessData();
	
		this.sleepData = this.pastSleepLogs.map((log: OvernightSleepData) => {
			return {
				date: log.getStartTime().toISOString().split('T')[0],
				sleepHours: Math.floor((log.getEndTime().getTime() - log.getStartTime().getTime()) / (1000 * 60 * 60)), 
				sleepMinutes: Math.floor((log.getEndTime().getTime() - log.getStartTime().getTime()) / (1000 * 60)) % 60,
			};
		});
		
		this.sleepinessData = this.pastSleepinessLogs.map((log: StanfordSleepinessData) => {
			return {
				date: log.loggedAt.toISOString().split('T')[0],
				level: log.getSleepinessLevel(),
			};
		});
	
		this.calculateWeeklyTrends();
	}
	
	getLocalDateString(): string {
		const today = new Date();
		today.setMinutes(today.getMinutes() - today.getTimezoneOffset()); // Adjust for timezone
		return today.toISOString().split('T')[0]; // get date in YYYY-MM-DD format
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
		// Opens corresponding modal based on selection
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