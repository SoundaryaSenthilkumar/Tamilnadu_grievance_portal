# TN Grievance Portal

Frontend web app for a Tamil Nadu public grievance system.

## Overview

This project is built with React + Vite and supports:
- Home page with service highlights and announcements
- Raise Complaint flow
- Track Complaint flow with timeline/status steps
- Admin Login page
- English/Tamil language switching using context + translation keys

## Tech Stack

- React 19
- Vite 7
- React Router DOM 7
- Tailwind CSS 4
- ESLint 9

## Routes

- `/` - Home
- `/raise-complaint` - Raise a complaint
- `/track-complaint` - Track grievance status
- `/admin-login` - Admin login

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: latest LTS)
- npm

### Install

```bash
npm install
```

### Run (development)

```bash
npm run dev
```

### Build (production)

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```text
src/
  components/
    home/
    HomeAnnouncements.jsx
    HomeDashboardStats.jsx
    HomeDepartments.jsx
    HomeFeedBack.jsx
    HomeHero.jsx
    HomeHowItWorks.jsx
    HomeQuickServices.jsx
    HomeStatsBar.jsx
AnnouncementBar.jsx
 StatusTracker.jsx
CitizenProfile.jsx
GrievanceStatus.jsx
FeedbackForm.jsx
ProofViewer.jsx
Header.jsx
Footer.jsx
Navbar.jsx
  context/
    LanguageContext.jsx
  pages/
    Home.jsx
    RaiseComplaint.jsx
    TrackComplaint.jsx
    AdminLogin.jsx
  translations.js
  App.jsx
  main.jsx
```

## Language Support

- `LanguageProvider` wraps the app in `src/main.jsx`
- Translation keys are defined in `src/translations.js`
- Use `useLanguage()` in components for `language`, `setLanguage`, and `t(key)`

## Notes

- Complaint tracking currently uses demo grievance IDs and mock status data for UI flow.
- Static assets are stored in `src/assets`.
