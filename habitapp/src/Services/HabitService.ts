import AsyncStorage from "@react-native-async-storage/async-storage"
import { lastDateType } from "../types/Types"

export const isFirstTime =async () => {
    const isFirstTime = await AsyncStorage.getItem("@firstTime")
    if (isFirstTime === null) {
      console.log('First Time')
        const lastReset: lastDateType = {
            daily: new Date(),
            weekly: new Date(),
            monthly: new Date()
        }
        await AsyncStorage.setItem("@lastReset", JSON.stringify(lastReset))
        await AsyncStorage.setItem('@firstTime','no')
    }else{

    }
}

export const isTimeToReset = (period: string, lastReset: Date): boolean => {
  const now = new Date();
  if (period === 'daily') {
    return (
      now.getFullYear() > lastReset.getFullYear() &&
      now.getMonth() > lastReset.getMonth() ||
      now.getDate() > lastReset.getDate()
    );
  } else if (period === 'weekly') {
    const toStartOfWeek = (date: Date): Date => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - d.getDay());
      return d;
    };
    const lastWeek = toStartOfWeek(new Date(lastReset));
    const thisWeek = toStartOfWeek(new Date(now));
    return thisWeek.getTime() > lastWeek.getTime();
  } else if (period === 'monthly') {
    return (
      now.getFullYear() > lastReset.getFullYear() ||
      now.getMonth() > lastReset.getMonth()
    );
  }
  return false;
};