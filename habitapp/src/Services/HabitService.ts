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