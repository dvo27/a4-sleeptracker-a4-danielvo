import { Injectable } from '@angular/core';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Injectable({
  providedIn: 'root'
})
export class SleepService {
  public static AllSleepData: SleepData[] = [];
  public static AllOvernightData: OvernightSleepData[] = [];
  public static AllSleepinessData: StanfordSleepinessData[] = [];

  constructor() {}

  /* Save Overnight Sleep Data (Locally) */
  public logOvernightData(sleepData: OvernightSleepData) {
    SleepService.AllSleepData.push(sleepData);
    SleepService.AllOvernightData.push(sleepData);
  }

  /* Save Sleepiness Data (Locally) */
  public logSleepinessData(sleepData: StanfordSleepinessData) {
    SleepService.AllSleepData.push(sleepData);
    SleepService.AllSleepinessData.push(sleepData);
  }

  /* Retrieve All Stored Data */
  public getAllSleepData(): SleepData[] {
    return SleepService.AllSleepData;
  }

  public getAllOvernightData(): OvernightSleepData[] {
    return SleepService.AllOvernightData;
  }

  public getAllSleepinessData(): StanfordSleepinessData[] {
    return SleepService.AllSleepinessData;
  }
}
