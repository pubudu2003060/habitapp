# 🌱 GoHabit – Build Good Habits, Break Bad Ones!

A beautifully designed and practical mobile app built with **React Native** and **Firebase**, helping users stay on track with their goals and routines through habit tracking.

---

## 🚀 Features

### ✅ Core Features

- **User Authentication**
  - Firebase Auth-based Sign Up / Login
  - Auto-login with saved credentials

- **Habit Management**
  - Add new habits with:
    - Name  
    - Description  
    - Goal duration   
    - Repeat type: Daily, Weekly, Monthly  
    - Reminder (via Date Picker)
  - Edit, delete, and manually mark habits as finished
  - Habits automatically reset:
    - Daily habits reset every day
    - Weekly habits reset weekly
    - Monthly habits reset monthly

- **Habit Tracking**
  - Track completion status per habit
  - Automatically marks a habit as finished when the goal period ends
  - Users can manually complete or delete habits anytime

- **Progress Overview**
  - Stat page with:
    - Completion percentage
    - Daily / weekly / monthly progress
    - Visual feedback with animated components

- **Calendar View**
  - View habit streaks and completion history by date

---

### 🌟 Bonus Features

- **Animations**
  - Smooth animations for:
    - Loading screens
    - Completion check-ins

- **Dark Mode Support**
  - Toggle based on user preference 

- **User Profile**
  - Update profile info and upload a profile picture
  - Images securely stored using Firebase Storage

- **Offline Support (Partial)**
  - Local caching via AsyncStorage for faster load and limited offline use

---

## 🛠 Tech Stack

| Tool             | Purpose                          |
|------------------|----------------------------------|
| React Native CLI | App development environment      |
| TypeScript       | Type safety                      |
| Firebase Auth    | User authentication              |
| Firestore DB     | Real-time data storage           |
| AsyncStorage     | Local caching                    |
| Zustand          | Lightweight state management     |
| React Navigation | Navigation (Stack + Tabs)        |

---

## 📲 Installation & Setup (React Native CLI)

### 📦 Prerequisites

- Node.js & npm/yarn  
- Android Studio (for Android build)  
- Xcode (for iOS build, macOS only)  
- React Native CLI  
- Firebase project setup (Auth + Firestore)

---

### 🔧 Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/pubudu2003060/habitapp.git
cd habitapp/habitapp

# 2. Install dependencies
npm install

# 3. Install pods (iOS only, on macOS)
cd ios
pod install
cd ..

# For Android
npx react-native run-android

# For iOS (macOS only)
npx react-native run-ios
```
