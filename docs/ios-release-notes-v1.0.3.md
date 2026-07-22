# iOS Release Notes v1.0.3

## What's New

###  Major Content Update
This is a complete overhaul of the phrasebook content with accurate, verified translations from the book «Русско-Китайский разговорник» (2013).

**Content Changes:**
- **Phrases**: Updated from 293 phrases to **2,174 phrases** (7.4x more content!)
- **Categories**: Restructured from 22 categories to **13 main categories** with ~60 subcategories
- **Languages**: 
  - ✅ Chinese - Fully ready (2,174 phrases)
  - ✅ Russian - Fully ready (2,174 phrases)
  - 🔄 Turkmen - In progress (translation underway)

**New Content Structure:**
1. Greetings (Salamlaşmak)
2. Food & Restaurants (Iýmit we restoranlar)
3. Hotel (Myhmanhana)
4. Transport (Ulag)
5. Health (Saglyk)
6. Shopping (Söwda)
7. Business (Işewürlik)
8. Emergency Situations (Gyssagly ýagdaýlar)
9. Numbers & Time (Sanlar we wagt)
10. Weather (Howa)
11. Family (Maşgala)
12. Travel (Syýahat)
13. Communication (Aragatnaşyk)

### 🔧 Technical Updates
- **Expo SDK**: Upgraded to v54
- **React Native**: v0.81.5
- **TypeScript**: v5.9.2
- **Architecture**: New Architecture enabled

###  Bug Fixes
- Fixed SearchEngine null checks to prevent crashes
- Fixed Favorites sync issues across screens
- Fixed MainHub navigation to Additional Features
- Improved data consistency with unified useFavorites hook

### ✨ New Features
- **Advanced Search**: Fuzzy matching across all 2,174 phrases
- **Favorites Hub**: Organized tabs for phrases, translations, and words
- **Stats Tracking**: Monitor your learning progress
- **Offline Mode**: Core phrasebook works without internet

### ️ Known Issues
- Audio pronunciation is temporarily disabled (will return in future update)
- Visual Translator (OCR) coming in v1.5
- AI Translator coming in v2.0

---

## Upgrade from v1.0.0

This is a **major content update**. Users will see a completely restructured phrasebook with significantly more phrases and better organization.

**Important Note**: Turkmen translations are still in progress. Most phrases currently show empty Turkmen text. The app will be fully ready for publication once Category 1 (Basic phrases) Turkmen translations are completed.

---

## Build Information
- **Version**: 1.0.3
- **Build Number**: 5
- **Platform**: iOS
- **Bundle ID**: com.shapak.translator
- **Minimum iOS**: 13.0