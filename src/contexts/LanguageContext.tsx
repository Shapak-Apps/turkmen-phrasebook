// src/contexts/LanguageContext.tsx - ИСПРАВЛЕНО с правильными заголовками

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const APP_LANGUAGE_KEY = 'shapak_app_language';
const LANGUAGE_VERSION = '1.0';

export type AppLanguageMode = 'tk' | 'zh' | 'ru' | 'en' | 'tr' | 'de' | 'fr' | 'es' | 'it' | 'pt' | 'nl' | 'pl' | 'uk' | 'ja' | 'ko' | 'th' | 'vi' | 'id' | 'ms' | 'hi' | 'ur' | 'fa' | 'ps' | 'uz' | 'kk' | 'az' | 'ky' | 'tg' | 'hy' | 'ka' | 'ar';

export interface AppLanguageConfig {
  mode: AppLanguageMode;
  primaryLanguage: 'tk' | 'zh';
  learningLanguage: 'zh' | 'tk';
  helperLanguage: 'ru';
  version: string;
}

export interface InterfaceTexts {
  // Общие
  home: string;
  search: string;
  favorites: string;
  settings: string;
  additionalFeatures: string;
  statistics: string;

  // Главный экран
  appTitle: string;
  appSubtitle: string; // ✅ ДОБАВЛЕНО: подзаголовок с языками
  selectCategory: string;
  recentlyStudied: string;
  study: string;

  // Main Hub Modules
  phrasebookTitle: string;
  phrasebookSubtitle: string;
  visualTranslatorTitle: string;
  visualTranslatorSubtitle: string;
  textTranslatorTitle: string;
  textTranslatorSubtitle: string;
  voiceTranslatorTitle: string;
  voiceTranslatorSubtitle: string;
  dictionaryTitle: string;
  dictionarySubtitle: string;
  aiAssistantsTitle: string;
  aiAssistantsSubtitle: string;
  myFavoritesTitle: string;
  myFavoritesSubtitle: string;
  
  // Детальный экран
  pronunciation: string;
  addToFavorites: string;
  inFavorites: string;
  share: string;
  
  // Настройки
  settingsTitle: string;
  languageInterface: string;
  switchLanguage: string;
  audio: string;
  soundEffects: string;
  data: string;
  clearHistory: string;
  offlineMode: string;
  about: string;
  feedback: string;
  // Дополнительные для SettingsScreen (optional - не все языки имеют эти переводы)
  audioSettings?: string;
  interfaceSettings?: string;
  dataSettings?: string;
  appInfo?: string;
  currentLanguage?: string;
  phrasebookLanguage?: string;
  languageChangeHint?: string;
  fontSize?: string;
  fontSizePreview?: string;
  currentFontSize?: string;
  hapticFeedback?: string;
  hapticFeedbackDesc?: string;
  testVoice?: string;
  testVoiceDesc?: string;
  testVoiceError?: string;
  voiceGender?: string;
  voiceFemale?: string;
  voiceMale?: string;
  voicesAvailable?: string;
  clearHistoryConfirm?: string;
  historyCleared?: string;
  versionAndInfo?: string;
  phrases?: string;
  views?: string;
  pronunciationPlayback?: string;
  
  // Поиск
  searchPlaceholder: string;
  noResults: string;
  searchHistory: string;
  
  // Общие действия
  cancel: string;
  save: string;
  delete: string;
  confirm: string;
  loading: string;
  error: string;
  success: string;

  // Visual Translator - Home Screen
  vtTranslateWithAI: string;
  vtCameraSubtitle: string;
  vtTakePhoto: string;
  vtChooseGallery: string;
  vtProcessing: string;
  vtProcessingSubtext: string;
  vtOcrEngine: string;
  vtOcrEngineDesc: string;
  vtOcrSpaceNote: string;
  vtFeatures: string;
  vtFeatureOcrTitle: string;
  vtFeatureOcrDesc: string;
  vtFeatureAiTitle: string;
  vtFeatureAiDesc: string;
  vtFeatureSmartTitle: string;
  vtFeatureSmartDesc: string;
  vtFeatureSaveTitle: string;
  vtFeatureSaveDesc: string;
  vtPermissionsText: string;
  vtGrantPermissions: string;
  vtRequestingPermissions: string;
  vtAutoFallback: string;

  // Visual Translator - Result Screen
  vtResult: string;
  vtRecognizedText: string;
  vtLanguageLabel: string;
  vtAiAnalysis: string;
  vtTranslation: string;
  vtTargetLabel: string;
  vtPlay: string;
  vtStop: string;
  vtCopy: string;
  vtTranslateAnother: string;
  vtCopied: string;
  vtCopiedMessage: string;

  // Text Translator
  ttHeaderTitle: string;
  ttHeroTitle: string;
  ttHeroSubtitle: string;
  ttSelectLanguage: string;
  ttPlaceholder: string;
  ttClear: string;
  ttTranslate: string;
  ttTranslating: string;
  ttPlay: string;
  ttStop: string;
  ttCopy: string;
  ttEmptyOutput: string;
  ttSourceLanguage: string;
  ttTargetLanguage: string;
  ttErrorTitle: string;
  ttErrorEmptyText: string;
  ttErrorTranslationFailed: string;
  ttErrorNoInternet: string;
  ttErrorTextTooLong: string;
  ttCopiedTitle: string;
  ttCopiedMessage: string;
  ttInfoTitle: string;
  ttInfoCannotSwap: string;

  // AI Assistants - Home Screen
  aiHomeTitle: string;
  aiHomeSubtitle: string;
  aiInfoText: string;

  // AI Assistant Names (5)
  aiContextualTipsName: string;
  aiConversationTrainerName: string;
  aiGrammarHelperName: string;
  aiCulturalAdvisorName: string;
  aiGeneralAssistantName: string;

  // AI Assistant Descriptions (5)
  aiContextualTipsDesc: string;
  aiConversationTrainerDesc: string;
  aiGrammarHelperDesc: string;
  aiCulturalAdvisorDesc: string;
  aiGeneralAssistantDesc: string;

  // Welcome Messages (5)
  aiContextualTipsWelcome: string;
  aiConversationTrainerWelcome: string;
  aiGrammarHelperWelcome: string;
  aiCulturalAdvisorWelcome: string;
  aiGeneralAssistantWelcome: string;

  // ChatScreen UI
  aiInputPlaceholder: string;
  aiThinking: string;
  aiErrorMessage: string;
  aiClearHistory: string;

  // Voice Translator (reuses vtProcessing and vtTranslation from Visual Translator)
  vtHeaderTitle: string;
  vtHeroTitle: string;
  vtHeroSubtitle: string;
  vtTapToSpeak: string;
  vtListening: string;
  vtRecognized: string;
  vtPlayOriginal: string;
  vtPlayTranslation: string;
  vtCopyTranslation: string;
  vtClear: string;
  vtSwapLanguages: string;
  vtSelectSourceLanguage: string;
  vtSelectTargetLanguage: string;
  vtErrorNoPermission: string;
  vtErrorNoInternet: string;
  vtErrorRecognitionFailed: string;
  vtErrorTranslationFailed: string;
  vtPermissionTitle: string;
  vtPermissionMessage: string;
  vtGrantPermission: string;
  vtComingSoon: string;

  // Voice Translator Coming Soon (v2.0)
  voiceComingSoonTitle: string;
  voiceComingSoonDesc: string;
  voiceComingSoonFeature1: string;
  voiceComingSoonFeature2: string;
  voiceComingSoonFeature3: string;
  voiceComingSoonButton: string;

  // Visual Translator Coming Soon (v1.5)
  visualComingSoonTitle: string;
  visualComingSoonDesc: string;
  visualComingSoonFeature1: string;
  visualComingSoonFeature2: string;
  visualComingSoonFeature3: string;

  // Coming Soon version badge
  comingSoonInVersion: string;

  // AI Chat Screen - Additional UI elements
  aiBalancedMode?: string;
  aiClear?: string;
  aiClearHistoryMessage: string;
  aiClearHistoryTitle: string;
  aiCopied?: string;
  aiCopyAll: string;
  aiCreativeMode: string;
  aiError?: string;
  aiExportChat: string;
  aiNoMessages?: string;
  aiPreciseMode: string;
  aiResponseLanguage: string;
  aiResponseLanguageMessage: string;
  aiResponseSettings: string;
  aiResponseSettingsMessage: string;
  aiSelectModel: string;
  aiSelectModelMessage: string;

  // Onboarding Screen
  onboardingSkip: string;
  onboardingNext: string;

  // Slide 1: Welcome
  onboardingWelcomeTitle: string;
  onboardingWelcomeSubtitle: string;

  // Slide 2: Phrasebook
  onboardingPhrasebookTitle: string;
  onboardingPhrasebookSubtitle: string;
  onboardingPhrasebookDemo: string;
  onboardingPlayAudio: string;
  onboardingPlaying: string;

  // Slide 2: Phrasebook - Features
  onboardingFeatureAudio: string;
  onboardingFeatureOffline: string;

  // Slide 3: Translation
  onboardingTranslationTitle: string;
  onboardingTranslationSubtitle: string;
  onboardingTextTranslator: string;
  onboardingTranslate: string;
  onboardingTryAgain: string;
  onboardingVisualTranslator: string;
  onboardingVoiceTranslator: string;
  onboardingAIAssistant: string;
  onboardingAIPowered: string;
  onboardingComingSoon: string;

  // Slide 4: Ready
  onboardingReadyTitle: string;
  onboardingReadySubtitle: string;
  onboardingGetStarted: string;

  // Slide 4: Ready - Feature Tags
  onboardingTagPhrasebook: string;
  onboardingTagAudio: string;
  onboardingTagOffline: string;
  onboardingTagTranslator: string;
  onboardingTagAI: string;
  onboardingTagVisual: string;
  onboardingTagVoice: string;

  // Settings Screen - Additional translations (Task 1)
  settingsInstalledVoices?: string;
  settingsInstalledVoicesDesc?: string;
  settingsLoading?: string;
  settingsDarkMode?: string;
  settingsDarkModeDesc?: string;
  settingsSpeechRate?: string;
  settingsSpeechRateDesc?: string;
  settingsResetAll?: string;
  settingsResetAllDesc?: string;
  settingsResetConfirm?: string;
  settingsClearSearchHistory?: string;
  settingsClearSearchHistoryDesc?: string;
  settingsRateApp?: string;
  settingsSendFeedback?: string;
  settingsAppearance?: string;
  settingsDataStorage?: string;
}

// ✅ ИСПРАВЛЕНО: Правильные заголовки согласно требованиям
const INTERFACE_TEXTS: Record<AppLanguageMode, InterfaceTexts> = {
  tk: {
    // Туркменский режим: туркмен изучает китайский
    home: 'Baş sahypa',
    search: 'Gözleg',
    favorites: 'Halanýanlar',
    settings: 'Sazlamalar',
    additionalFeatures: 'Goşmaça mümkinçilikler',
    statistics: 'Statistika',
    
    // ✅ ИСПРАВЛЕНО: Правильный заголовок для туркменского интерфейса
    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: 'Dil öwrenmek üçin ähli gurallary',
    selectCategory: 'Kategoriýa saýlaň',
    recentlyStudied: 'Soňky öwrenilen',
    study: 'Okuw',

    // Main Hub Modules
    phrasebookTitle: 'Gepleşik kitaby',
    phrasebookSubtitle: '22 kategoriýada 305 söz düzümi',
    visualTranslatorTitle: 'Wizual terjimeçi',
    visualTranslatorSubtitle: 'Kamera bilen teksti skanirleme',
    textTranslatorTitle: 'Tekst terjimeçi',
    textTranslatorSubtitle: 'Teksti ýazmak we terjime etmek',
    voiceTranslatorTitle: 'Ses terjimeçi',
    voiceTranslatorSubtitle: 'Sesli terjime (v2.0)',
    dictionaryTitle: 'Sözlük',
    dictionarySubtitle: 'v2.0-de çykar',
    aiAssistantsTitle: 'Emeli Aň kömekçiler',
    aiAssistantsSubtitle: 'Akylly maslahatlar we goldaw',
    myFavoritesTitle: 'Halanýanlarym',
    myFavoritesSubtitle: 'Saklan maglumatlar',
    
    pronunciation: 'Aýdylyş',
    addToFavorites: 'Halanýanlara goş',
    inFavorites: 'Halanýanlarda',
    share: 'Paýlaş',
    
    settingsTitle: '⚙️ Sazlamalar',
    languageInterface: 'Interfeýs dili',
    switchLanguage: 'Dil çalyş',
    audio: 'Audio',
    soundEffects: 'Ses effektleri',
    data: 'Maglumatlar',
    clearHistory: 'Taryhy arassala',
    offlineMode: 'Oflaýn režim',
    about: 'Programma hakda',
    feedback: 'Pikir alyşmak',
    // Дополнительные для SettingsScreen
    audioSettings: 'Audio sazlamalar',
    interfaceSettings: 'Interfeýs sazlamalary',
    dataSettings: 'Maglumat sazlamalary',
    appInfo: 'Programma maglumatlar',
    currentLanguage: 'Häzirki: ',
    phrasebookLanguage: 'Gepleşik kitaby dili',
    languageChangeHint: 'Siz dili islendik wagt sazlamalarda üýtgedip bilersiňiz',
    fontSize: 'Harpyň ululygy',
    fontSizePreview: 'Mysal tekst - Şapak Gepleşik Kitaby',
    currentFontSize: 'Häzirki: ',
    hapticFeedback: 'Yrgyldy',
    hapticFeedbackDesc: 'Düwme basylanda yrgyldy',
    testVoice: 'Ses synag',
    testVoiceDesc: 'Mysal sözlemi aýt',
    testVoiceError: 'Ses aýdyp bolmady. Internet baglanyşygyny barlap görüň.',
    voiceGender: 'Ses görnüşi',
    voiceFemale: 'Zenan',
    voiceMale: 'Erkek',
    voicesAvailable: 'ses elýeterli',
    clearHistoryConfirm: 'Taryhy arassalaňyzmy?',
    historyCleared: 'Taryh arassalandy',
    versionAndInfo: 'Wersiýa we maglumat',
    phrases: 'sözlem',
    views: 'görkeziş',
    pronunciationPlayback: 'Aýdylyş çalgysy',
    
    searchPlaceholder: 'Islendik dilde sözlem giriziň...',
    noResults: 'Hiç zat tapylmady',
    searchHistory: 'Gözleg taryhy',
    
    cancel: 'Ýatyr',
    save: 'Ýatda sakla',
    delete: 'Arassala',
    confirm: 'Tassykla',
    loading: 'Ýüklenýär...',
    error: 'Ýalňyş',
    success: 'Üstünlik',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'AI bilen terjime et',
    vtCameraSubtitle: 'Kamerany islendik tekste gönükdiriň we dessine terjimesini alyň',
    vtTakePhoto: 'Surat çek',
    vtChooseGallery: 'Galereýadan saýla',
    vtProcessing: 'Surat işlenýär...',
    vtProcessingSubtext: 'Tekst tanalyp we terjime edilýär',
    vtOcrEngine: 'OCR hereketlendirijisi',
    vtOcrEngineDesc: 'Suratlardan teksti nädip tanamaly saýlaň.',
    vtOcrSpaceNote: 'Mugt, aýda 25K haýyş',
    vtFeatures: 'Mümkinçilikler',
    vtFeatureOcrTitle: 'OCR Tekst tanama',
    vtFeatureOcrDesc: '30+ dilde teksti ýokary takyklyk bilen tanaýar',
    vtFeatureAiTitle: 'AI Obýekt düşündirişi',
    vtFeatureAiDesc: 'Tekst tapylmadyk halatynda obýektleri düşündirýär',
    vtFeatureSmartTitle: 'Akylly terjime',
    vtFeatureSmartDesc: 'AI tarapyndan goldanýan kontekste esasly terjime',
    vtFeatureSaveTitle: 'Sakla we paýlaş',
    vtFeatureSaveDesc: 'Terjimeleri halanýanlara saklaň we beýlekiler bilen paýlaşyň',
    vtPermissionsText: 'Bu aýratynlygy ulanmak üçin kamera we surat galereýasy rugsatlary gerek',
    vtGrantPermissions: 'Rugsat ber',
    vtRequestingPermissions: 'Rugsat soralyýar...',
    vtAutoFallback: 'Saýlanan hereketlendiriji şowsuz bolan halatynda awto-yza gaýtma işjeňleşdirildi',

    // Visual Translator - Result Screen
    vtResult: 'Netije',
    vtRecognizedText: 'Tanalyan tekst',
    vtLanguageLabel: 'Dil: ',
    vtAiAnalysis: 'AI derňewi',
    vtTranslation: 'Terjime',
    vtTargetLabel: 'Niýetlenen: ',
    vtPlay: 'Diňle',
    vtStop: 'Dur',
    vtCopy: 'Göçür',
    vtTranslateAnother: 'Başga terjime et',
    vtCopied: 'Göçürildi',
    vtCopiedMessage: 'Terjime alyş-çalyş paneline göçürildi',

    // Text Translator
    ttHeaderTitle: 'Tekst terjimeçi',
    ttHeroTitle: 'Dessine terjime',
    ttHeroSubtitle: 'Islendik teksti ýazyň we 100+ diliň arasynda terjime ediň',
    ttSelectLanguage: 'Saýla',
    ttPlaceholder: 'Terjime etmek üçin tekst giriziň...',
    ttClear: 'Arassala',
    ttTranslate: 'Terjime et',
    ttTranslating: 'Terjime edilýär...',
    ttPlay: 'Diňle',
    ttStop: 'Dur',
    ttCopy: 'Göçür',
    ttEmptyOutput: 'Terjime şu ýerde görkeziler',
    ttSourceLanguage: 'Çeşme dili',
    ttTargetLanguage: 'Niýetlenen dili',
    ttErrorTitle: 'Ýalňyş',
    ttErrorEmptyText: 'Terjime etmek üçin tekst giriziň',
    ttErrorTranslationFailed: 'Terjime şowsuz boldy. Gaýtadan synanyşyň.',
    ttErrorNoInternet: 'Internet baglanyşygy ýok. Baglanyşygyňyzy barlap gaýtadan synanyşyň.',
    ttErrorTextTooLong: 'Tekst gaty uzyn. Iň köp 5000 simwol.',
    ttCopiedTitle: '✅ Göçürildi',
    ttCopiedMessage: 'Terjime alyş-çalyş paneline göçürildi',
    ttInfoTitle: 'Maglumat',
    ttInfoCannotSwap: 'Awto Anykla saýlanda çalyş mümkin däl',

    // AI Assistants
    aiHomeTitle: 'Emeli Aň kömekçiler',
    aiHomeSubtitle: 'Türkmen dilini öwrenmek üçin Emeli Aň kömekçi çat bot saýlaň',
    aiInfoText: 'Emeli Aň kömekçi çat botlar ösen dil modellerini ulanýar. Jogaplar birnäçe sekunt alyp biler.',

    // AI Assistant Names
    aiContextualTipsName: 'Kontekstual Maslahatlar',
    aiConversationTrainerName: 'Söhbetdeşlik Tälimçisi',
    aiGrammarHelperName: 'Grammatika Kömekçisi',
    aiCulturalAdvisorName: 'Medeni Geňeşçi',
    aiGeneralAssistantName: 'Umumy Kömekçi',

    // AI Assistant Descriptions
    aiContextualTipsDesc: 'Häzirki okuw kontekstiňize esaslanýan akylly maslahatlar alyň',
    aiConversationTrainerDesc: 'Hakyky söhbetdeşlikleri öwreniň we geplemek ukybyny kämilleşdiriň',
    aiGrammarHelperDesc: 'Türkmen grammatika düzgünleri we gurluşlary bilen derrew kömek alyň',
    aiCulturalAdvisorDesc: 'Türkmen medeniýeti, adatlary we edebi terbiýesi hakda biliň',
    aiGeneralAssistantDesc: 'Türkmen dilini öwrenmek barada islendik sorag beriň',

    // Welcome Messages
    aiContextualTipsWelcome: 'Salam! Men size Türkmen dilini öwrenmek üçin peýdaly maslahatlar we düşünjeler bererin. Islendik zat soraň!',
    aiConversationTrainerWelcome: 'Salam! Geliň, Türkmen dilinde söhbetdeşlik öwreneliň. Men siziň geplemek ukybyny gowulandyrmaga kömek ederin!',
    aiGrammarHelperWelcome: 'Hoş geldiňiz! Men siziň grammatika kömekçiňiz. Türkmen grammatika düzgünleri ýa-da gurluşlary barada soraň.',
    aiCulturalAdvisorWelcome: 'Salam! Geliň, Türkmen medeniýeti, adatlary we däp-dessurlar hakda düşüneli.',
    aiGeneralAssistantWelcome: 'Salam! Men siziň AI kömekçiňiz. Terjimeler, sözlemler we dürli dillerde aragatnaşyk bilen kömek ederin.',

    // ChatScreen UI
    aiInputPlaceholder: 'Hatyňyzy ýazyň...',
    aiThinking: 'Pikir edýärin...',
    aiErrorMessage: 'Bagyşlaň, ýalňyşlyk ýüze çykdy. Gaýtadan synanyşyň.',
    aiClearHistory: 'Taryhy arassala',
    aiClearHistoryTitle: 'Taryhy arassalamak',
    aiClearHistoryMessage: 'Ähli habarlary arassalamak isleýärsiňizmi?',
    aiSelectModel: 'AI modelini saýla',
    aiSelectModelMessage: 'Ulanmak üçin AI modelini saýlaň',
    aiExportChat: 'Söhbetdeşligi eksport et',
    aiCopyAll: 'Ählisini göçür',
    aiResponseSettings: 'Jogap sazlamalary',
    aiResponseSettingsMessage: 'AI-nyň nähili jogap bermegini sazlaň',
    aiResponseLanguage: 'Jogap dili',
    aiResponseLanguageMessage: 'AI haýsy dilde jogap bermeli',
    aiCreativeMode: 'Döredijilik re re mode',
    aiBalancedMode: 'Deňagramly re mode',
    aiPreciseMode: 'Takyk režim',

    // Voice Translator
    vtHeaderTitle: 'Ses terjimeçi',
    vtHeroTitle: 'Geple we terjime et',
    vtHeroSubtitle: 'Diliňizde gürläň we dessine terjimesini alyň',
    vtTapToSpeak: 'Gürlemek üçin basyň',
    vtListening: 'Diňleýärin...',
    vtRecognized: 'Tanalan',
    vtPlayOriginal: 'Asyl teksti diňle',
    vtPlayTranslation: 'Terjimäni diňle',
    vtCopyTranslation: 'Terjimäni göçür',
    vtClear: 'Arassala',
    vtSwapLanguages: 'Dilleri çalyş',
    vtSelectSourceLanguage: 'Çeşme dilini saýla',
    vtSelectTargetLanguage: 'Niýetlenen dilini saýla',
    vtErrorNoPermission: 'Mikrofon rugsady ýok. Sazlamalarda rugsat beriň.',
    vtErrorNoInternet: 'Internet baglanyşygy ýok. Baglanyşygy barlap gaýtadan synanyşyň.',
    vtErrorRecognitionFailed: 'Ses tanamak şowsuz boldy. Gaýtadan synanyşyň.',
    vtErrorTranslationFailed: 'Terjime şowsuz boldy. Gaýtadan synanyşyň.',
    vtPermissionTitle: 'Mikrofon rugsady',
    vtPermissionMessage: 'Bu aýratynlygy ulanmak üçin mikrofon rugsady gerek',
    vtGrantPermission: 'Rugsat ber',
    vtComingSoon: 'Ýakynda',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: 'Ses terjimeçi ýakynda!',
    voiceComingSoonDesc: 'Biz hakyky wagt ses terjimesi üstünde işleýäris. Ýakynda gürläp dessine terjime alyp bilersiňiz!',
    voiceComingSoonFeature1: 'Hakyky wagt ses tanama',
    voiceComingSoonFeature2: 'Dessine terjime',
    voiceComingSoonFeature3: 'Terjimäni sesli diňle',
    voiceComingSoonButton: 'Baş sahypa',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: 'Ýakynda!',
    visualComingSoonDesc: 'Biz kameradan tekst tanama üstünde işleýäris. Ýakynda ýazgylary, menýulary we resminamalary terjime edip bilersiňiz!',
    visualComingSoonFeature1: 'Kameradan tekst tanama',
    visualComingSoonFeature2: 'AI tekst tanama',
    visualComingSoonFeature3: 'Galereýa we kamera goldawy',

    // Coming Soon version badge
    comingSoonInVersion: 'v{version} çykar',

    // Onboarding - Navigation
    onboardingSkip: 'Geç',
    onboardingNext: 'Indiki',
    // Slide 1: Welcome
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: 'Türkmençä we türkmençeden — çalt hem aňsat terjime!',
    // Slide 2: Phrasebook
    onboardingPhrasebookTitle: '30 dil jübütligi',
    onboardingPhrasebookSubtitle: 'Sesli aýdylyş bilen gepleşik kitaby, oflaýn işleýär',
    onboardingPhrasebookDemo: 'Salam',
    onboardingPlayAudio: 'Sesi diňle',
    onboardingPlaying: 'Oýnadylýar...',
    onboardingFeatureAudio: 'Türkmençe sesli aýdylyş',
    onboardingFeatureOffline: 'Internetsiz işleýär',
    // Slide 3: Translation
    onboardingTranslationTitle: 'Akylly terjime',
    onboardingTranslationSubtitle: 'Tekst terjimeçi we AI kömekçi',
    onboardingTextTranslator: 'Tekst terjimeçi',
    onboardingTranslate: 'Terjime et',
    onboardingTryAgain: 'Gaýtadan synap gör',
    onboardingVisualTranslator: 'Wizual terjimeçi',
    onboardingVoiceTranslator: 'Ses terjimeçi',
    onboardingAIAssistant: 'AI kömekçi',
    onboardingAIPowered: 'AI bilen işleýär',
    onboardingComingSoon: 'Ýakynda',
    // Slide 4: Ready
    onboardingReadyTitle: 'Hemme zat taýýar!',
    onboardingReadySubtitle: 'Türkmen dilini häzir öwrenmäge başla',
    onboardingGetStarted: 'Başla',
    // Slide 4: Ready - Feature Tags
    onboardingTagPhrasebook: 'Gepleşik kitaby',
    onboardingTagAudio: 'Sesli aýdylyş',
    onboardingTagOffline: 'Oflaýn',
    onboardingTagTranslator: 'Terjimeçi',
    onboardingTagAI: 'AI kömekçi',
    onboardingTagVisual: 'Wizual terjime',
    onboardingTagVoice: 'Ses terjime',

    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: 'Gurlan sesler',
    settingsInstalledVoicesDesc: 'Ähli TTS seslerini görüň',
    settingsLoading: 'Sazlamalar ýüklenýär...',
    settingsDarkMode: 'Garaňky režim',
    settingsDarkModeDesc: 'Garaňky temany açyň',
    settingsSpeechRate: 'Gürleýiş tizligi',
    settingsSpeechRateDesc: 'Aýdylyş tizligini sazlaň',
    settingsResetAll: 'Ähli sazlamalary täzeden',
    settingsResetAllDesc: 'Başlangyç sazlamalary dikelt',
    settingsResetConfirm: 'Hakykatdanam täzeden başlatmak isleýärsiňizmi?',
    settingsClearSearchHistory: 'Gözleg taryhyny arassala',
    settingsClearSearchHistoryDesc: 'Ähli gözleg ýazgylaryny poz',
    settingsRateApp: 'Programma baha ber',
    settingsSendFeedback: 'Pikir iber',
    settingsAppearance: 'Görnüş',
    settingsDataStorage: 'Maglumatlar',
  },

  zh: {
    // Китайский режим: китаец изучает туркменский
    home: '主页',
    search: '搜索',
    favorites: '收藏',
    settings: '设置',
    additionalFeatures: '其他功能',
    statistics: '统计',
    
    // ✅ ИСПРАВЛЕНО: Правильный заголовок для китайского интерфейса
    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: '语言学习的所有工具',
    selectCategory: '选择类别',
    recentlyStudied: '最近学习',
    study: '学习',

    // Main Hub Modules
    phrasebookTitle: '常用语手册',
    phrasebookSubtitle: '22个类别中的305个短语',
    visualTranslatorTitle: '图像翻译',
    visualTranslatorSubtitle: '用相机扫描文本',
    textTranslatorTitle: '文本翻译',
    textTranslatorSubtitle: '输入并翻译文本',
    voiceTranslatorTitle: '语音翻译',
    voiceTranslatorSubtitle: '语音翻译 (v2.0)',
    dictionaryTitle: '词典',
    dictionarySubtitle: 'v2.0推出',
    aiAssistantsTitle: 'AI助手',
    aiAssistantsSubtitle: '智能提示和支持',
    myFavoritesTitle: '我的收藏',
    myFavoritesSubtitle: '保存的内容',
    
    pronunciation: '发音',
    addToFavorites: '添加到收藏',
    inFavorites: '在收藏中',
    share: '分享',
    
    settingsTitle: '⚙️ 设置',
    languageInterface: '界面语言',
    switchLanguage: '切换语言',
    audio: '音频',
    soundEffects: '音效',
    data: '数据',
    clearHistory: '清除历史',
    offlineMode: '离线模式',
    about: '关于应用',
    feedback: '反馈',
    // Дополнительные для SettingsScreen
    audioSettings: '音频设置',
    interfaceSettings: '界面设置',
    dataSettings: '数据设置',
    appInfo: '应用信息',
    currentLanguage: '当前: ',
    phrasebookLanguage: '会话手册语言',
    languageChangeHint: '您可以随时在设置中更改语言',
    fontSize: '字体大小',
    fontSizePreview: '示例文本 - Shapak会话手册',
    currentFontSize: '当前: ',
    hapticFeedback: '触觉反馈',
    hapticFeedbackDesc: '按钮按下时振动',
    testVoice: '语音测试',
    testVoiceDesc: '播放示例短语',
    testVoiceError: '无法播放音频。请检查网络连接。',
    voiceGender: '语音类型',
    voiceFemale: '女声',
    voiceMale: '男声',
    voicesAvailable: '种声音可用',
    clearHistoryConfirm: '清除历史记录？',
    historyCleared: '历史已清除',
    versionAndInfo: '版本和信息',
    phrases: '短语',
    views: '次查看',
    pronunciationPlayback: '发音播放',
    
    searchPlaceholder: '输入任何语言的短语搜索...',
    noResults: '未找到结果',
    searchHistory: '搜索历史',

    cancel: '取消',
    save: '保存',
    delete: '删除',
    confirm: '确认',
    loading: '加载中...',
    error: '错误',
    success: '成功',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'AI智能翻译',
    vtCameraSubtitle: '将相机对准任何文本即可获得即时翻译',
    vtTakePhoto: '拍照',
    vtChooseGallery: '从图库选择',
    vtProcessing: '处理图像中...',
    vtProcessingSubtext: '识别文本并翻译',
    vtOcrEngine: 'OCR引擎',
    vtOcrEngineDesc: '选择如何从图像中识别文本。',
    vtOcrSpaceNote: '免费，每月25K请求',
    vtFeatures: '功能',
    vtFeatureOcrTitle: 'OCR文字识别',
    vtFeatureOcrDesc: '高精度识别30+种语言的文本',
    vtFeatureAiTitle: 'AI物体描述',
    vtFeatureAiDesc: '未找到文本时描述物体',
    vtFeatureSmartTitle: '智能翻译',
    vtFeatureSmartDesc: 'AI驱动的上下文感知翻译',
    vtFeatureSaveTitle: '保存和分享',
    vtFeatureSaveDesc: '将翻译保存到收藏并与他人分享',
    vtPermissionsText: '使用此功能需要相机和照片库权限',
    vtGrantPermissions: '授予权限',
    vtRequestingPermissions: '请求权限中...',
    vtAutoFallback: '如果所选引擎失败，自动回退已启用',

    // Visual Translator - Result Screen
    vtResult: '结果',
    vtRecognizedText: '识别的文本',
    vtLanguageLabel: '语言: ',
    vtAiAnalysis: 'AI分析',
    vtTranslation: '翻译',
    vtTargetLabel: '目标: ',
    vtPlay: '播放',
    vtStop: '停止',
    vtCopy: '复制',
    vtTranslateAnother: '翻译另一个',
    vtCopied: '已复制',
    vtCopiedMessage: '翻译已复制到剪贴板',

    // Text Translator
    ttHeaderTitle: '文本翻译',
    ttHeroTitle: '即时翻译',
    ttHeroSubtitle: '输入任何文本，在100多种语言之间进行翻译',
    ttSelectLanguage: '选择',
    ttPlaceholder: '输入要翻译的文本...',
    ttClear: '清除',
    ttTranslate: '翻译',
    ttTranslating: '翻译中...',
    ttPlay: '播放',
    ttStop: '停止',
    ttCopy: '复制',
    ttEmptyOutput: '翻译将显示在这里',
    ttSourceLanguage: '源语言',
    ttTargetLanguage: '目标语言',
    ttErrorTitle: '错误',
    ttErrorEmptyText: '请输入要翻译的文本',
    ttErrorTranslationFailed: '翻译失败。请重试。',
    ttErrorNoInternet: '无网络连接。请检查连接后重试。',
    ttErrorTextTooLong: '文本太长。最多5000个字符。',
    ttCopiedTitle: '✅ 已复制',
    ttCopiedMessage: '翻译已复制到剪贴板',
    ttInfoTitle: '信息',
    ttInfoCannotSwap: '选择自动检测时无法交换',

    // AI Assistants
    aiHomeTitle: 'AI助手',
    aiHomeSubtitle: '选择AI助手帮您学习土库曼语',
    aiInfoText: 'AI助手使用先进的语言模型提供个性化帮助。响应可能需要几秒钟。',

    // AI Assistant Names
    aiContextualTipsName: '情境提示',
    aiConversationTrainerName: '对话训练师',
    aiGrammarHelperName: '语法助手',
    aiCulturalAdvisorName: '文化顾问',
    aiGeneralAssistantName: '通用助手',

    // AI Assistant Descriptions
    aiContextualTipsDesc: '根据您当前的学习情境获得智能提示',
    aiConversationTrainerDesc: '练习真实对话，提高您的口语能力',
    aiGrammarHelperDesc: '立即获得土库曼语语法规则和结构的帮助',
    aiCulturalAdvisorDesc: '了解土库曼文化、习俗和礼仪',
    aiGeneralAssistantDesc: '询问有关学习土库曼语的任何问题',

    // Welcome Messages
    aiContextualTipsWelcome: '您好！我会为您提供学习土库曼语的有用提示和见解。请随便问！',
    aiConversationTrainerWelcome: '您好！让我们练习土库曼语对话吧。我会帮您提高口语能力！',
    aiGrammarHelperWelcome: '欢迎！我是您的语法助手。问我任何土库曼语语法规则或结构的问题。',
    aiCulturalAdvisorWelcome: '您好！让我帮您了解土库曼文化、习俗和传统。',
    aiGeneralAssistantWelcome: '您好！我是您的AI助手。我可以帮助您进行翻译、短语和多语言交流。',

    // ChatScreen UI
    aiInputPlaceholder: '输入您的消息...',
    aiThinking: '思考中...',
    aiErrorMessage: '抱歉，出现错误。请重试。',
    aiClearHistory: '清除历史记录',
    aiClearHistoryTitle: '清除历史记录',
    aiClearHistoryMessage: '确定要清除所有消息吗？',
    aiSelectModel: '选择AI模型',
    aiSelectModelMessage: '选择要使用的AI模型',
    aiExportChat: '导出聊天记录',
    aiCopyAll: '全部复制',
    aiResponseSettings: '回复设置',
    aiResponseSettingsMessage: '调整AI回复方式',
    aiResponseLanguage: '回复语言',
    aiResponseLanguageMessage: 'AI应该用哪种语言回复',
    aiCreativeMode: '创意模式',
    aiBalancedMode: '平衡模式',
    aiPreciseMode: '精确模式',

    // Voice Translator
    vtHeaderTitle: '语音翻译',
    vtHeroTitle: '说话并翻译',
    vtHeroSubtitle: '用您的语言说话并立即获得翻译',
    vtTapToSpeak: '点击说话',
    vtListening: '正在听...',
    vtRecognized: '识别的文本',
    vtPlayOriginal: '播放原文',
    vtPlayTranslation: '播放翻译',
    vtCopyTranslation: '复制翻译',
    vtClear: '清除',
    vtSwapLanguages: '交换语言',
    vtSelectSourceLanguage: '选择源语言',
    vtSelectTargetLanguage: '选择目标语言',
    vtErrorNoPermission: '没有麦克风权限。请在设置中授予权限。',
    vtErrorNoInternet: '没有网络连接。请检查连接并重试。',
    vtErrorRecognitionFailed: '语音识别失败。请重试。',
    vtErrorTranslationFailed: '翻译失败。请重试。',
    vtPermissionTitle: '麦克风权限',
    vtPermissionMessage: '需要麦克风权限才能使用此功能',
    vtGrantPermission: '授予权限',
    vtComingSoon: '即将推出',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: '语音翻译即将推出！',
    voiceComingSoonDesc: '我们正在开发实时语音翻译功能。您很快就可以说话并获得即时翻译！',
    voiceComingSoonFeature1: '实时语音识别',
    voiceComingSoonFeature2: '即时翻译',
    voiceComingSoonFeature3: '语音播放翻译',
    voiceComingSoonButton: '返回首页',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: '即将推出!',
    visualComingSoonDesc: '我们正在开发相机文字识别功能。您很快就可以翻译标志、菜单和文档！',
    visualComingSoonFeature1: '相机文字识别',
    visualComingSoonFeature2: 'AI 文字识别',
    visualComingSoonFeature3: '相册和相机支持',

    // Coming Soon version badge
    comingSoonInVersion: 'v{version}即将推出',

    // Onboarding - Navigation
    onboardingSkip: '跳过',
    onboardingNext: '下一步',
    // Slide 1: Welcome
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: '土库曼语翻译 — 快速便捷！',
    // Slide 2: Phrasebook
    onboardingPhrasebookTitle: '30种语言对',
    onboardingPhrasebookSubtitle: '带语音发音的短语手册，支持离线',
    onboardingPhrasebookDemo: '你好',
    onboardingPlayAudio: '播放音频',
    onboardingPlaying: '正在播放...',
    onboardingFeatureAudio: '土库曼语语音发音',
    onboardingFeatureOffline: '无需网络',
    // Slide 3: Translation
    onboardingTranslationTitle: '智能翻译',
    onboardingTranslationSubtitle: '文本翻译器和AI助手',
    onboardingTextTranslator: '文本翻译器',
    onboardingTranslate: '翻译',
    onboardingTryAgain: '重试',
    onboardingVisualTranslator: '视觉翻译器',
    onboardingVoiceTranslator: '语音翻译器',
    onboardingAIAssistant: 'AI助手',
    onboardingAIPowered: '由AI驱动',
    onboardingComingSoon: '即将推出',
    // Slide 4: Ready
    onboardingReadyTitle: '一切就绪！',
    onboardingReadySubtitle: '立即开始学习土库曼语',
    onboardingGetStarted: '开始使用',
    // Slide 4: Ready - Feature Tags
    onboardingTagPhrasebook: '短语手册',
    onboardingTagAudio: '语音发音',
    onboardingTagOffline: '离线',
    onboardingTagTranslator: '翻译器',
    onboardingTagAI: 'AI助手',
    onboardingTagVisual: '视觉翻译',
    onboardingTagVoice: '语音翻译',

    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: '已安装语音',
    settingsInstalledVoicesDesc: '查看所有TTS语音',
    settingsLoading: '加载设置...',
    settingsDarkMode: '深色模式',
    settingsDarkModeDesc: '切换到深色主题',
    settingsSpeechRate: '语速',
    settingsSpeechRateDesc: '调整发音速度',
    settingsResetAll: '重置所有设置',
    settingsResetAllDesc: '恢复默认设置',
    settingsResetConfirm: '确定要重置吗？',
    settingsClearSearchHistory: '清除搜索历史',
    settingsClearSearchHistoryDesc: '删除所有搜索记录',
    settingsRateApp: '评价应用',
    settingsSendFeedback: '发送反馈',
    settingsAppearance: '外观',
    settingsDataStorage: '数据与存储',
  },

  ru: {
    // Русский режим: русский изучает туркменский
    home: 'Главная',
    search: 'Поиск',
    favorites: 'Избранное',
    settings: 'Настройки',
    additionalFeatures: 'Дополнительно',
    statistics: 'Статистика',

    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: 'Все инструменты для изучения языка',
    selectCategory: 'Выберите категорию',
    recentlyStudied: 'Недавно изученное',
    study: 'Изучать',

    // Main Hub Modules
    phrasebookTitle: 'Разговорник',
    phrasebookSubtitle: '305 фраз в 22 категориях',
    visualTranslatorTitle: 'Визуальный переводчик',
    visualTranslatorSubtitle: 'Сканирование текста камерой',
    textTranslatorTitle: 'Текстовый переводчик',
    textTranslatorSubtitle: 'Ввод и перевод текста',
    voiceTranslatorTitle: 'Голосовой переводчик',
    voiceTranslatorSubtitle: 'Голосовой перевод (v2.0)',
    dictionaryTitle: 'Словарь',
    dictionarySubtitle: 'Выйдет в v2.0',
    aiAssistantsTitle: 'AI помощники',
    aiAssistantsSubtitle: 'Умные подсказки и поддержка',
    myFavoritesTitle: 'Моё избранное',
    myFavoritesSubtitle: 'Сохранённое',

    pronunciation: 'Произношение',
    addToFavorites: 'Добавить в избранное',
    inFavorites: 'В избранном',
    share: 'Поделиться',

    settingsTitle: '⚙️ Настройки',
    languageInterface: 'Язык интерфейса',
    switchLanguage: 'Сменить язык',
    audio: 'Аудио',
    soundEffects: 'Звуковые эффекты',
    data: 'Данные',
    clearHistory: 'Очистить историю',
    offlineMode: 'Офлайн режим',
    about: 'О приложении',
    feedback: 'Обратная связь',
    // Дополнительные для SettingsScreen
    audioSettings: 'Настройки аудио',
    interfaceSettings: 'Настройки интерфейса',
    dataSettings: 'Настройки данных',
    appInfo: 'Информация о приложении',
    currentLanguage: 'Текущий: ',
    phrasebookLanguage: 'Язык разговорника',
    languageChangeHint: 'Вы можете изменить язык в любое время в настройках',
    fontSize: 'Размер шрифта',
    fontSizePreview: 'Пример текста - Shapak Разговорник',
    currentFontSize: 'Текущий: ',
    hapticFeedback: 'Тактильная отдача',
    hapticFeedbackDesc: 'Вибрация при нажатии кнопок',
    testVoice: 'Тест голоса',
    testVoiceDesc: 'Воспроизвести пример',
    testVoiceError: 'Не удалось воспроизвести. Проверьте подключение к интернету.',
    voiceGender: 'Тип голоса',
    voiceFemale: 'Женский',
    voiceMale: 'Мужской',
    voicesAvailable: 'голосов доступно',
    clearHistoryConfirm: 'Очистить историю?',
    historyCleared: 'История очищена',
    versionAndInfo: 'Версия и информация',
    phrases: 'фраз',
    views: 'просмотров',
    pronunciationPlayback: 'Воспроизведение произношения',

    searchPlaceholder: 'Введите фразу на любом языке...',
    noResults: 'Ничего не найдено',
    searchHistory: 'История поиска',

    cancel: 'Отмена',
    save: 'Сохранить',
    delete: 'Удалить',
    confirm: 'Подтвердить',
    loading: 'Загрузка...',
    error: 'Ошибка',
    success: 'Успешно',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'Перевод с AI',
    vtCameraSubtitle: 'Наведите камеру на любой текст и получите мгновенный перевод',
    vtTakePhoto: 'Сделать фото',
    vtChooseGallery: 'Выбрать из галереи',
    vtProcessing: 'Обработка изображения...',
    vtProcessingSubtext: 'Распознавание текста и перевод',
    vtOcrEngine: 'Движок OCR',
    vtOcrEngineDesc: 'Выберите способ распознавания текста с изображений.',
    vtOcrSpaceNote: 'Бесплатно, 25K запросов/месяц',
    vtFeatures: 'Возможности',
    vtFeatureOcrTitle: 'OCR Распознавание текста',
    vtFeatureOcrDesc: 'Распознаёт текст на 30+ языках с высокой точностью',
    vtFeatureAiTitle: 'AI Описание объектов',
    vtFeatureAiDesc: 'Описывает объекты когда текст не найден',
    vtFeatureSmartTitle: 'Умный перевод',
    vtFeatureSmartDesc: 'Контекстный перевод на основе AI',
    vtFeatureSaveTitle: 'Сохранение и отправка',
    vtFeatureSaveDesc: 'Сохраняйте переводы в избранное и делитесь с другими',
    vtPermissionsText: 'Для использования этой функции требуются разрешения камеры и фотогалереи',
    vtGrantPermissions: 'Предоставить разрешения',
    vtRequestingPermissions: 'Запрос разрешений...',
    vtAutoFallback: 'Автоматический откат включён в случае сбоя выбранного движка',

    // Visual Translator - Result Screen
    vtResult: 'Результат',
    vtRecognizedText: 'Распознанный текст',
    vtLanguageLabel: 'Язык: ',
    vtAiAnalysis: 'AI анализ',
    vtTranslation: 'Перевод',
    vtTargetLabel: 'Целевой: ',
    vtPlay: 'Воспроизвести',
    vtStop: 'Стоп',
    vtCopy: 'Копировать',
    vtTranslateAnother: 'Перевести ещё',
    vtCopied: 'Скопировано',
    vtCopiedMessage: 'Перевод скопирован в буфер обмена',

    // Text Translator
    ttHeaderTitle: 'Текстовый переводчик',
    ttHeroTitle: 'Мгновенный перевод',
    ttHeroSubtitle: 'Введите любой текст и переведите между 100+ языками',
    ttSelectLanguage: 'Выбрать',
    ttPlaceholder: 'Введите текст для перевода...',
    ttClear: 'Очистить',
    ttTranslate: 'Перевести',
    ttTranslating: 'Перевод...',
    ttPlay: 'Воспроизвести',
    ttStop: 'Стоп',
    ttCopy: 'Копировать',
    ttEmptyOutput: 'Перевод появится здесь',
    ttSourceLanguage: 'Исходный язык',
    ttTargetLanguage: 'Целевой язык',
    ttErrorTitle: 'Ошибка',
    ttErrorEmptyText: 'Пожалуйста, введите текст для перевода',
    ttErrorTranslationFailed: 'Перевод не удался. Попробуйте снова.',
    ttErrorNoInternet: 'Нет интернет-соединения. Проверьте подключение и попробуйте снова.',
    ttErrorTextTooLong: 'Текст слишком длинный. Максимум 5000 символов.',
    ttCopiedTitle: '✅ Скопировано',
    ttCopiedMessage: 'Перевод скопирован в буфер обмена',
    ttInfoTitle: 'Информация',
    ttInfoCannotSwap: 'Невозможно поменять местами когда выбрано Авто Определение',

    // AI Assistants
    aiHomeTitle: 'AI Ассистенты',
    aiHomeSubtitle: 'Выберите AI ассистента для изучения туркменского языка',
    aiInfoText: 'AI ассистенты используют продвинутые языковые модели для персонализированной помощи. Ответы могут занять несколько секунд.',

    // AI Assistant Names
    aiContextualTipsName: 'Контекстные Подсказки',
    aiConversationTrainerName: 'Тренер Разговоров',
    aiGrammarHelperName: 'Помощник по Грамматике',
    aiCulturalAdvisorName: 'Культурный Советник',
    aiGeneralAssistantName: 'Общий Ассистент',

    // AI Assistant Descriptions
    aiContextualTipsDesc: 'Получайте умные подсказки на основе вашего текущего контекста обучения',
    aiConversationTrainerDesc: 'Практикуйте реальные разговоры и улучшайте навыки речи',
    aiGrammarHelperDesc: 'Получите мгновенную помощь с правилами и структурами туркменской грамматики',
    aiCulturalAdvisorDesc: 'Узнайте о туркменской культуре, обычаях и этикете',
    aiGeneralAssistantDesc: 'Задавайте любые вопросы об изучении туркменского языка',

    // Welcome Messages
    aiContextualTipsWelcome: 'Привет! Я предоставлю вам полезные советы и идеи для изучения туркменского языка. Спрашивайте что угодно!',
    aiConversationTrainerWelcome: 'Привет! Давайте попрактикуем разговоры на туркменском. Я помогу улучшить ваши разговорные навыки!',
    aiGrammarHelperWelcome: 'Добро пожаловать! Я ваш помощник по грамматике. Спрашивайте меня о любых правилах или структурах туркменской грамматики.',
    aiCulturalAdvisorWelcome: 'Салам! Позвольте мне помочь вам понять туркменскую культуру, обычаи и традиции.',
    aiGeneralAssistantWelcome: 'Привет! Я ваш AI помощник. Помогу с переводами, фразами и общением на разных языках.',

    // ChatScreen UI
    aiInputPlaceholder: 'Введите ваше сообщение...',
    aiThinking: 'Думаю...',
    aiErrorMessage: 'Извините, произошла ошибка. Попробуйте снова.',
    aiClearHistory: 'Очистить историю',
    aiClearHistoryTitle: 'Очистить историю',
    aiClearHistoryMessage: 'Вы уверены, что хотите удалить все сообщения?',
    aiSelectModel: 'Выбрать модель ИИ',
    aiSelectModelMessage: 'Выберите модель ИИ для использования',
    aiExportChat: 'Экспортировать чат',
    aiCopyAll: 'Скопировать всё',
    aiResponseSettings: 'Настройки ответов',
    aiResponseSettingsMessage: 'Настройте, как ИИ отвечает',
    aiResponseLanguage: 'Язык ответов',
    aiResponseLanguageMessage: 'На каком языке должен отвечать ИИ',
    aiCreativeMode: 'Творческий режим',
    aiBalancedMode: 'Сбалансированный режим',
    aiPreciseMode: 'Точный режим',

    // Voice Translator
    vtHeaderTitle: 'Голосовой переводчик',
    vtHeroTitle: 'Говорите и переводите',
    vtHeroSubtitle: 'Говорите на своем языке и получите мгновенный перевод',
    vtTapToSpeak: 'Нажмите, чтобы говорить',
    vtListening: 'Слушаю...',
    vtRecognized: 'Распознанный текст',
    vtPlayOriginal: 'Воспроизвести оригинал',
    vtPlayTranslation: 'Воспроизвести перевод',
    vtCopyTranslation: 'Скопировать перевод',
    vtClear: 'Очистить',
    vtSwapLanguages: 'Поменять языки',
    vtSelectSourceLanguage: 'Выберите исходный язык',
    vtSelectTargetLanguage: 'Выберите целевой язык',
    vtErrorNoPermission: 'Нет доступа к микрофону. Предоставьте разрешение в настройках.',
    vtErrorNoInternet: 'Нет подключения к интернету. Проверьте соединение и попробуйте снова.',
    vtErrorRecognitionFailed: 'Распознавание речи не удалось. Попробуйте еще раз.',
    vtErrorTranslationFailed: 'Перевод не удался. Попробуйте еще раз.',
    vtPermissionTitle: 'Разрешение микрофона',
    vtPermissionMessage: 'Для использования этой функции требуется доступ к микрофону',
    vtGrantPermission: 'Предоставить разрешение',
    vtComingSoon: 'Скоро',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: 'Голосовой переводчик скоро!',
    voiceComingSoonDesc: 'Мы работаем над голосовым переводом в реальном времени. Скоро вы сможете говорить и получать мгновенный перевод!',
    voiceComingSoonFeature1: 'Распознавание речи в реальном времени',
    voiceComingSoonFeature2: 'Мгновенный перевод',
    voiceComingSoonFeature3: 'Озвучивание перевода',
    voiceComingSoonButton: 'На главную',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: 'Скоро!',
    visualComingSoonDesc: 'Мы работаем над распознаванием текста с камеры. Скоро вы сможете переводить надписи, меню и документы!',
    visualComingSoonFeature1: 'Распознавание текста с камеры',
    visualComingSoonFeature2: 'AI распознавание текста',
    visualComingSoonFeature3: 'Поддержка галереи и камеры',

    // Coming Soon version badge
    comingSoonInVersion: 'Выйдет в v{version}',

    // Onboarding - Navigation
    onboardingSkip: 'Пропустить',
    onboardingNext: 'Далее',
    // Slide 1: Welcome
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: 'Переводи на туркменский и с туркменского — быстро и удобно!',
    // Slide 2: Phrasebook
    onboardingPhrasebookTitle: '30 языковых пар',
    onboardingPhrasebookSubtitle: 'Разговорник с озвучкой, работает офлайн',
    onboardingPhrasebookDemo: 'Привет',
    onboardingPlayAudio: 'Воспроизвести',
    onboardingPlaying: 'Воспроизведение...',
    onboardingFeatureAudio: 'Озвучка на туркменском',
    onboardingFeatureOffline: 'Работает без интернета',
    // Slide 3: Translation
    onboardingTranslationTitle: 'Умный перевод',
    onboardingTranslationSubtitle: 'Текстовый переводчик и AI помощник',
    onboardingTextTranslator: 'Текстовый переводчик',
    onboardingTranslate: 'Перевести',
    onboardingTryAgain: 'Ещё раз',
    onboardingVisualTranslator: 'Визуальный переводчик',
    onboardingVoiceTranslator: 'Голосовой переводчик',
    onboardingAIAssistant: 'AI помощник',
    onboardingAIPowered: 'На базе AI',
    onboardingComingSoon: 'Скоро',
    // Slide 4: Ready
    onboardingReadyTitle: 'Всё готово!',
    onboardingReadySubtitle: 'Начни изучение туркменского прямо сейчас',
    onboardingGetStarted: 'Начать',
    // Slide 4: Ready - Feature Tags
    onboardingTagPhrasebook: '📖 Разговорник',
    onboardingTagAudio: '🔊 Озвучка',
    onboardingTagOffline: '✈️ Офлайн',
    onboardingTagTranslator: '📝 Переводчик',
    onboardingTagAI: '🤖 AI помощник',
    onboardingTagVisual: '📷 Визуальный',
    onboardingTagVoice: '🎤 Голосовой',

    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: 'Установленные голоса',
    settingsInstalledVoicesDesc: 'Просмотр всех TTS голосов',
    settingsLoading: 'Загрузка настроек...',
    settingsDarkMode: 'Тёмная тема',
    settingsDarkModeDesc: 'Переключить на тёмную тему',
    settingsSpeechRate: 'Скорость речи',
    settingsSpeechRateDesc: 'Настройка скорости произношения',
    settingsResetAll: 'Сбросить все настройки',
    settingsResetAllDesc: 'Восстановить настройки по умолчанию',
    settingsResetConfirm: 'Вы уверены, что хотите сбросить?',
    settingsClearSearchHistory: 'Очистить историю поиска',
    settingsClearSearchHistoryDesc: 'Удалить все записи поиска',
    settingsRateApp: 'Оценить приложение',
    settingsSendFeedback: 'Отправить отзыв',
    settingsAppearance: 'Оформление',
    settingsDataStorage: 'Данные и хранение',
  },

  en: {
    // English mode: English speaker learning Turkmen
    home: 'Home',
    search: 'Search',
    favorites: 'Favorites',
    settings: 'Settings',
    additionalFeatures: 'More Features',
    statistics: 'Statistics',

    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: 'All tools for language learning',
    selectCategory: 'Select a category',
    recentlyStudied: 'Recently studied',
    study: 'Study',

    // Main Hub Modules
    phrasebookTitle: 'Phrasebook',
    phrasebookSubtitle: '305 phrases in 22 categories',
    visualTranslatorTitle: 'Visual Translator',
    visualTranslatorSubtitle: 'Scan text with camera',
    textTranslatorTitle: 'Text Translator',
    textTranslatorSubtitle: 'Type and translate text',
    voiceTranslatorTitle: 'Voice Translator',
    voiceTranslatorSubtitle: 'Voice translation (v2.0)',
    dictionaryTitle: 'Dictionary',
    dictionarySubtitle: 'Coming in v2.0',
    aiAssistantsTitle: 'AI Assistants',
    aiAssistantsSubtitle: 'Smart tips and support',
    myFavoritesTitle: 'My Favorites',
    myFavoritesSubtitle: 'Saved items',

    pronunciation: 'Pronunciation',
    addToFavorites: 'Add to favorites',
    inFavorites: 'In favorites',
    share: 'Share',

    settingsTitle: '⚙️ Settings',
    languageInterface: 'Interface language',
    switchLanguage: 'Switch language',
    audio: 'Audio',
    soundEffects: 'Sound effects',
    data: 'Data',
    clearHistory: 'Clear history',
    offlineMode: 'Offline mode',
    about: 'About app',
    feedback: 'Feedback',
    // Additional for SettingsScreen
    audioSettings: 'Audio settings',
    interfaceSettings: 'Interface settings',
    dataSettings: 'Data settings',
    appInfo: 'App information',
    currentLanguage: 'Current: ',
    phrasebookLanguage: 'Phrasebook language',
    languageChangeHint: 'You can change the language anytime in settings',
    fontSize: 'Font size',
    fontSizePreview: 'Sample text - Shapak Phrasebook',
    currentFontSize: 'Current: ',
    hapticFeedback: 'Haptic feedback',
    hapticFeedbackDesc: 'Vibration on button press',
    testVoice: 'Test voice',
    testVoiceDesc: 'Play a sample phrase',
    testVoiceError: 'Could not play audio. Check your internet connection.',
    voiceGender: 'Voice type',
    voiceFemale: 'Female',
    voiceMale: 'Male',
    voicesAvailable: 'voices available',
    clearHistoryConfirm: 'Clear history?',
    historyCleared: 'History cleared',
    versionAndInfo: 'Version and info',
    phrases: 'phrases',
    views: 'views',
    pronunciationPlayback: 'Pronunciation playback',

    searchPlaceholder: 'Enter phrase in any language...',
    noResults: 'No results found',
    searchHistory: 'Search history',

    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    confirm: 'Confirm',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'Translate with AI',
    vtCameraSubtitle: 'Point your camera at any text and get instant translation',
    vtTakePhoto: 'Take Photo',
    vtChooseGallery: 'Choose from Gallery',
    vtProcessing: 'Processing image...',
    vtProcessingSubtext: 'Recognizing text and translating',
    vtOcrEngine: 'OCR Engine',
    vtOcrEngineDesc: 'Choose how to recognize text from images.',
    vtOcrSpaceNote: 'Free, 25K requests/month',
    vtFeatures: 'Features',
    vtFeatureOcrTitle: 'OCR Text Recognition',
    vtFeatureOcrDesc: 'Recognizes text in 30+ languages with high accuracy',
    vtFeatureAiTitle: 'AI Object Description',
    vtFeatureAiDesc: 'Describes objects when no text is found',
    vtFeatureSmartTitle: 'Smart Translation',
    vtFeatureSmartDesc: 'Context-aware translation powered by AI',
    vtFeatureSaveTitle: 'Save & Share',
    vtFeatureSaveDesc: 'Save translations to favorites and share with others',
    vtPermissionsText: 'Camera and photo library permissions are required to use this feature',
    vtGrantPermissions: 'Grant Permissions',
    vtRequestingPermissions: 'Requesting permissions...',
    vtAutoFallback: 'Auto-fallback enabled if selected engine fails',

    // Visual Translator - Result Screen
    vtResult: 'Result',
    vtRecognizedText: 'Recognized Text',
    vtLanguageLabel: 'Language: ',
    vtAiAnalysis: 'AI Analysis',
    vtTranslation: 'Translation',
    vtTargetLabel: 'Target: ',
    vtPlay: 'Play',
    vtStop: 'Stop',
    vtCopy: 'Copy',
    vtTranslateAnother: 'Translate Another',
    vtCopied: 'Copied',
    vtCopiedMessage: 'Translation copied to clipboard',

    // Text Translator
    ttHeaderTitle: 'Text Translator',
    ttHeroTitle: 'Instant Translation',
    ttHeroSubtitle: 'Type any text and translate between 100+ languages',
    ttSelectLanguage: 'Select',
    ttPlaceholder: 'Enter text to translate...',
    ttClear: 'Clear',
    ttTranslate: 'Translate',
    ttTranslating: 'Translating...',
    ttPlay: 'Play',
    ttStop: 'Stop',
    ttCopy: 'Copy',
    ttEmptyOutput: 'Translation will appear here',
    ttSourceLanguage: 'Source Language',
    ttTargetLanguage: 'Target Language',
    ttErrorTitle: 'Error',
    ttErrorEmptyText: 'Please enter text to translate',
    ttErrorTranslationFailed: 'Translation failed. Please try again.',
    ttErrorNoInternet: 'No internet connection. Please check your connection and try again.',
    ttErrorTextTooLong: 'Text is too long. Maximum 5000 characters.',
    ttCopiedTitle: '✅ Copied',
    ttCopiedMessage: 'Translation copied to clipboard',
    ttInfoTitle: 'Info',
    ttInfoCannotSwap: 'Cannot swap when Auto Detect is selected',

    // AI Assistants
    aiHomeTitle: 'AI Assistants',
    aiHomeSubtitle: 'Choose an AI assistant to help you learn Turkmen language',
    aiInfoText: 'AI assistants use advanced language models to provide personalized help. Responses may take a few seconds.',

    // AI Assistant Names
    aiContextualTipsName: 'Contextual Tips',
    aiConversationTrainerName: 'Conversation Trainer',
    aiGrammarHelperName: 'Grammar Helper',
    aiCulturalAdvisorName: 'Cultural Advisor',
    aiGeneralAssistantName: 'General Assistant',

    // AI Assistant Descriptions
    aiContextualTipsDesc: 'Get smart tips based on your current learning context',
    aiConversationTrainerDesc: 'Practice real conversations and improve your speaking skills',
    aiGrammarHelperDesc: 'Get instant help with Turkmen grammar rules and structures',
    aiCulturalAdvisorDesc: 'Learn about Turkmen culture, customs, and etiquette',
    aiGeneralAssistantDesc: 'Ask anything about learning Turkmen language',

    // Welcome Messages
    aiContextualTipsWelcome: "Hello! I'm here to provide you with helpful tips and insights for learning Turkmen. Ask me anything!",
    aiConversationTrainerWelcome: "Hi there! Let's practice some conversations in Turkmen. I'll help you improve your speaking skills!",
    aiGrammarHelperWelcome: "Welcome! I'm your grammar assistant. Ask me about any Turkmen grammar rules or structures.",
    aiCulturalAdvisorWelcome: "Salam! Let me help you understand Turkmen culture, customs, and traditions.",
    aiGeneralAssistantWelcome: "Hello! I'm your AI assistant. I can help with translations, phrases, and communication in different languages.",

    // ChatScreen UI
    aiInputPlaceholder: 'Type your message...',
    aiThinking: 'Thinking...',
    aiErrorMessage: 'Sorry, I encountered an error. Please try again.',
    aiClearHistory: 'Clear History',
    aiClearHistoryTitle: 'Clear History',
    aiClearHistoryMessage: 'Are you sure you want to clear all messages?',
    aiSelectModel: 'Select AI Model',
    aiSelectModelMessage: 'Choose which AI model to use',
    aiExportChat: 'Export Chat',
    aiCopyAll: 'Copy All',
    aiResponseSettings: 'Response Settings',
    aiResponseSettingsMessage: 'Adjust how the AI responds',
    aiResponseLanguage: 'Response Language',
    aiResponseLanguageMessage: 'Choose which language the AI should respond in',
    aiCreativeMode: 'Creative Mode',
    aiBalancedMode: 'Balanced Mode',
    aiPreciseMode: 'Precise Mode',

    // Voice Translator
    vtHeaderTitle: 'Voice Translator',
    vtHeroTitle: 'Speak & Translate',
    vtHeroSubtitle: 'Speak in your language and get instant translation',
    vtTapToSpeak: 'Tap to speak',
    vtListening: 'Listening...',
    vtRecognized: 'Recognized',
    vtPlayOriginal: 'Play original',
    vtPlayTranslation: 'Play translation',
    vtCopyTranslation: 'Copy translation',
    vtClear: 'Clear',
    vtSwapLanguages: 'Swap languages',
    vtSelectSourceLanguage: 'Select source language',
    vtSelectTargetLanguage: 'Select target language',
    vtErrorNoPermission: 'No microphone permission. Please grant permission in settings.',
    vtErrorNoInternet: 'No internet connection. Check your connection and try again.',
    vtErrorRecognitionFailed: 'Speech recognition failed. Please try again.',
    vtErrorTranslationFailed: 'Translation failed. Please try again.',
    vtPermissionTitle: 'Microphone Permission',
    vtPermissionMessage: 'Microphone access is required to use this feature',
    vtGrantPermission: 'Grant Permission',
    vtComingSoon: 'Coming soon',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: 'Voice Translator is Coming!',
    voiceComingSoonDesc: 'We are working on real-time voice translation. Soon you will be able to speak and get instant translation!',
    voiceComingSoonFeature1: 'Real-time speech recognition',
    voiceComingSoonFeature2: 'Instant translation',
    voiceComingSoonFeature3: 'Text-to-speech playback',
    voiceComingSoonButton: 'Back to Home',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: 'Coming Soon!',
    visualComingSoonDesc: 'We are working on camera text recognition. Soon you will be able to translate signs, menus and documents!',
    visualComingSoonFeature1: 'Camera text recognition',
    visualComingSoonFeature2: 'AI text recognition',
    visualComingSoonFeature3: 'Gallery and camera support',

    // Coming Soon version badge
    comingSoonInVersion: 'Coming in v{version}',

    // Onboarding - Navigation
    onboardingSkip: 'Skip',
    onboardingNext: 'Next',
    // Slide 1: Welcome
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: 'Translate to and from Turkmen — fast and easy!',
    // Slide 2: Phrasebook
    onboardingPhrasebookTitle: '30 language pairs',
    onboardingPhrasebookSubtitle: 'Phrasebook with audio, works offline',
    onboardingPhrasebookDemo: 'Hello',
    onboardingPlayAudio: 'Play',
    onboardingPlaying: 'Playing...',
    onboardingFeatureAudio: 'Turkmen audio pronunciation',
    onboardingFeatureOffline: 'Works without internet',
    // Slide 3: Translation
    onboardingTranslationTitle: 'Smart Translation',
    onboardingTranslationSubtitle: 'Text translator and AI assistant',
    onboardingTextTranslator: 'Text Translator',
    onboardingTranslate: 'Translate',
    onboardingTryAgain: 'Try Again',
    onboardingVisualTranslator: 'Visual Translator',
    onboardingVoiceTranslator: 'Voice Translator',
    onboardingAIAssistant: 'AI Assistant',
    onboardingAIPowered: 'AI Powered',
    onboardingComingSoon: 'Coming Soon',
    // Slide 4: Ready
    onboardingReadyTitle: 'All Set!',
    onboardingReadySubtitle: 'Start learning Turkmen right now',
    onboardingGetStarted: 'Get Started',
    // Slide 4: Ready - Feature Tags
    onboardingTagPhrasebook: '📖 Phrasebook',
    onboardingTagAudio: '🔊 Audio',
    onboardingTagOffline: '✈️ Offline',
    onboardingTagTranslator: '📝 Translator',
    onboardingTagAI: '🤖 AI Assistant',
    onboardingTagVisual: '📷 Visual',
    onboardingTagVoice: '🎤 Voice',

    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: 'Installed Voices',
    settingsInstalledVoicesDesc: 'View all available TTS voices',
    settingsLoading: 'Loading settings...',
    settingsDarkMode: 'Dark Mode',
    settingsDarkModeDesc: 'Switch to dark theme',
    settingsSpeechRate: 'Speech Rate',
    settingsSpeechRateDesc: 'Adjust pronunciation speed',
    settingsResetAll: 'Reset All Settings',
    settingsResetAllDesc: 'Restore default settings',
    settingsResetConfirm: 'Are you sure you want to reset?',
    settingsClearSearchHistory: 'Clear Search History',
    settingsClearSearchHistoryDesc: 'Delete all search records',
    settingsRateApp: 'Rate App',
    settingsSendFeedback: 'Send Feedback',
    settingsAppearance: 'Appearance',
    settingsDataStorage: 'Data & Storage',
  },

  tr: {
    // Turkish mode: Turkish speaker learning Turkmen
    home: 'Ana Sayfa',
    search: 'Ara',
    favorites: 'Favoriler',
    settings: 'Ayarlar',
    additionalFeatures: 'Daha Fazla Özellik',
    statistics: 'İstatistikler',

    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: 'Dil öğrenimi için tüm araçlar',
    selectCategory: 'Kategori seçin',
    recentlyStudied: 'Son çalışılanlar',
    study: 'Çalış',

    // Main Hub Modules
    phrasebookTitle: 'Konuşma Kılavuzu',
    phrasebookSubtitle: '22 kategoride 305 ifade',
    visualTranslatorTitle: 'Görsel Çevirmen',
    visualTranslatorSubtitle: 'Kamera ile metin tarama',
    textTranslatorTitle: 'Metin Çevirmen',
    textTranslatorSubtitle: 'Metin yazıp çevir',
    voiceTranslatorTitle: 'Sesli Çevirmen',
    voiceTranslatorSubtitle: 'Konuş ve gerçek zamanlı çevir',
    dictionaryTitle: 'Sözlük',
    dictionarySubtitle: 'v2.0\'da gelecek',
    aiAssistantsTitle: 'AI Asistanlar',
    aiAssistantsSubtitle: 'Akıllı ipuçları ve destek',
    myFavoritesTitle: 'Favorilerim',
    myFavoritesSubtitle: 'Kaydedilen öğeler',

    pronunciation: 'Telaffuz',
    addToFavorites: 'Favorilere ekle',
    inFavorites: 'Favorilerde',
    share: 'Paylaş',

    settingsTitle: '⚙️ Ayarlar',
    languageInterface: 'Arayüz dili',
    switchLanguage: 'Dili değiştir',
    audio: 'Ses',
    soundEffects: 'Ses efektleri',
    data: 'Veri',
    clearHistory: 'Geçmişi temizle',
    offlineMode: 'Çevrimdışı mod',
    about: 'Uygulama hakkında',
    feedback: 'Geri bildirim',
    // Additional for SettingsScreen
    audioSettings: 'Ses ayarları',
    interfaceSettings: 'Arayüz ayarları',
    dataSettings: 'Veri ayarları',
    appInfo: 'Uygulama bilgileri',
    currentLanguage: 'Mevcut: ',
    phrasebookLanguage: 'Konuşma kılavuzu dili',
    languageChangeHint: 'Dili istediğiniz zaman ayarlardan değiştirebilirsiniz',
    fontSize: 'Yazı boyutu',
    fontSizePreview: 'Örnek metin - Shapak Konuşma Kılavuzu',
    currentFontSize: 'Mevcut: ',
    hapticFeedback: 'Dokunsal geri bildirim',
    hapticFeedbackDesc: 'Düğmeye basıldığında titreşim',
    testVoice: 'Ses testi',
    testVoiceDesc: 'Örnek cümle çal',
    testVoiceError: 'Ses çalınamadı. İnternet bağlantınızı kontrol edin.',
    voiceGender: 'Ses türü',
    voiceFemale: 'Kadın',
    voiceMale: 'Erkek',
    voicesAvailable: 'ses mevcut',
    clearHistoryConfirm: 'Geçmişi temizle?',
    historyCleared: 'Geçmiş temizlendi',
    versionAndInfo: 'Sürüm ve bilgi',
    phrases: 'ifade',
    views: 'görüntüleme',
    pronunciationPlayback: 'Telaffuz çalma',

    searchPlaceholder: 'Herhangi bir dilde ifade girin...',
    noResults: 'Sonuç bulunamadı',
    searchHistory: 'Arama geçmişi',

    cancel: 'İptal',
    save: 'Kaydet',
    delete: 'Sil',
    confirm: 'Onayla',
    loading: 'Yükleniyor...',
    error: 'Hata',
    success: 'Başarılı',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'AI ile Çevir',
    vtCameraSubtitle: 'Kameranızı herhangi bir metne doğrultun ve anında çeviri alın',
    vtTakePhoto: 'Fotoğraf Çek',
    vtChooseGallery: 'Galeriden Seç',
    vtProcessing: 'Görüntü işleniyor...',
    vtProcessingSubtext: 'Metin tanınıyor ve çevriliyor',
    vtOcrEngine: 'OCR Motoru',
    vtOcrEngineDesc: 'Görüntülerden metni nasıl tanıyacağınızı seçin.',
    vtOcrSpaceNote: 'Ücretsiz, ayda 25K istek',
    vtFeatures: 'Özellikler',
    vtFeatureOcrTitle: 'OCR Metin Tanıma',
    vtFeatureOcrDesc: '30+ dilde yüksek doğrulukla metin tanır',
    vtFeatureAiTitle: 'AI Nesne Açıklaması',
    vtFeatureAiDesc: 'Metin bulunamadığında nesneleri açıklar',
    vtFeatureSmartTitle: 'Akıllı Çeviri',
    vtFeatureSmartDesc: 'AI destekli bağlama duyarlı çeviri',
    vtFeatureSaveTitle: 'Kaydet ve Paylaş',
    vtFeatureSaveDesc: 'Çevirileri favorilere kaydedin ve başkalarıyla paylaşın',
    vtPermissionsText: 'Bu özelliği kullanmak için kamera ve fotoğraf galerisi izinleri gereklidir',
    vtGrantPermissions: 'İzin Ver',
    vtRequestingPermissions: 'İzinler isteniyor...',
    vtAutoFallback: 'Seçilen motor başarısız olursa otomatik geri dönüş etkin',

    // Visual Translator - Result Screen
    vtResult: 'Sonuç',
    vtRecognizedText: 'Tanınan Metin',
    vtLanguageLabel: 'Dil: ',
    vtAiAnalysis: 'AI Analizi',
    vtTranslation: 'Çeviri',
    vtTargetLabel: 'Hedef: ',
    vtPlay: 'Oynat',
    vtStop: 'Dur',
    vtCopy: 'Kopyala',
    vtTranslateAnother: 'Başka Çevir',
    vtCopied: 'Kopyalandı',
    vtCopiedMessage: 'Çeviri panoya kopyalandı',

    // Text Translator
    ttHeaderTitle: 'Metin Çevirmeni',
    ttHeroTitle: 'Anında Çeviri',
    ttHeroSubtitle: 'Herhangi bir metin yazın ve 100+ dil arasında çevirin',
    ttSelectLanguage: 'Seç',
    ttPlaceholder: 'Çevrilecek metni girin...',
    ttClear: 'Temizle',
    ttTranslate: 'Çevir',
    ttTranslating: 'Çevriliyor...',
    ttPlay: 'Oynat',
    ttStop: 'Dur',
    ttCopy: 'Kopyala',
    ttEmptyOutput: 'Çeviri burada görünecek',
    ttSourceLanguage: 'Kaynak dil',
    ttTargetLanguage: 'Hedef dil',
    ttErrorTitle: 'Hata',
    ttErrorEmptyText: 'Lütfen çevrilecek metin girin',
    ttErrorTranslationFailed: 'Çeviri başarısız. Lütfen tekrar deneyin.',
    ttErrorNoInternet: 'İnternet bağlantısı yok. Lütfen bağlantınızı kontrol edin ve tekrar deneyin.',
    ttErrorTextTooLong: 'Metin çok uzun. Maksimum 5000 karakter.',
    ttCopiedTitle: '✅ Kopyalandı',
    ttCopiedMessage: 'Çeviri panoya kopyalandı',
    ttInfoTitle: 'Bilgi',
    ttInfoCannotSwap: 'Otomatik Algılama seçiliyken değiştirilemez',

    // AI Assistants
    aiHomeTitle: 'AI Asistanları',
    aiHomeSubtitle: 'Türkmen dilini öğrenmenize yardımcı olacak bir AI asistanı seçin',
    aiInfoText: 'AI asistanları kişiselleştirilmiş yardım sağlamak için gelişmiş dil modelleri kullanır. Yanıtlar birkaç saniye sürebilir.',

    // AI Assistant Names
    aiContextualTipsName: 'Bağlamsal İpuçları',
    aiConversationTrainerName: 'Konuşma Eğitmeni',
    aiGrammarHelperName: 'Dilbilgisi Yardımcısı',
    aiCulturalAdvisorName: 'Kültür Danışmanı',
    aiGeneralAssistantName: 'Genel Asistan',

    // AI Assistant Descriptions
    aiContextualTipsDesc: 'Mevcut öğrenme bağlamınıza dayalı akıllı ipuçları alın',
    aiConversationTrainerDesc: 'Gerçek konuşmaları pratik yapın ve konuşma becerilerinizi geliştirin',
    aiGrammarHelperDesc: 'Türkmen dilbilgisi kuralları ve yapıları için anında yardım alın',
    aiCulturalAdvisorDesc: 'Türkmen kültürü, gelenekleri ve görgü kuralları hakkında bilgi edinin',
    aiGeneralAssistantDesc: 'Türkmen dili öğrenimi hakkında herhangi bir şey sorun',

    // Welcome Messages
    aiContextualTipsWelcome: 'Merhaba! Türkmen dilini öğrenmeniz için yararlı ipuçları ve içgörüler sağlamak için buradayım. Bana herhangi bir şey sorun!',
    aiConversationTrainerWelcome: 'Merhaba! Türkmen dilinde konuşma pratiği yapalım. Konuşma becerilerinizi geliştirmenize yardımcı olacağım!',
    aiGrammarHelperWelcome: 'Hoş geldiniz! Ben sizin dilbilgisi asistanınızım. Herhangi bir Türkmen dilbilgisi kuralı veya yapısı hakkında bana sorun.',
    aiCulturalAdvisorWelcome: 'Salam! Türkmen kültürünü, geleneklerini ve göreneklerini anlamanıza yardımcı olayım.',
    aiGeneralAssistantWelcome: 'Merhaba! Ben sizin AI asistanınızım. Çeviriler, ifadeler ve farklı dillerde iletişim konusunda yardımcı olabilirim.',

    // ChatScreen UI
    aiInputPlaceholder: 'Mesajınızı yazın...',
    aiThinking: 'Düşünüyor...',
    aiErrorMessage: 'Üzgünüm, bir hatayla karşılaştım. Lütfen tekrar deneyin.',
    aiClearHistory: 'Geçmişi Temizle',
    aiClearHistoryTitle: 'Geçmişi Temizle',
    aiClearHistoryMessage: 'Tüm mesajları silmek istediğinizden emin misiniz?',
    aiSelectModel: 'AI Modelini Seç',
    aiSelectModelMessage: 'Kullanılacak AI modelini seçin',
    aiExportChat: 'Sohbeti Dışa Aktar',
    aiCopyAll: 'Tümünü Kopyala',
    aiResponseSettings: 'Yanıt Ayarları',
    aiResponseSettingsMessage: 'AI\'nın nasıl yanıt vereceğini ayarlayın',
    aiResponseLanguage: 'Yanıt Dili',
    aiResponseLanguageMessage: 'AI hangi dilde yanıt vermeli',
    aiCreativeMode: 'Yaratıcı Mod',
    aiBalancedMode: 'Dengeli Mod',
    aiPreciseMode: 'Kesin Mod',

    // Voice Translator
    vtHeaderTitle: 'Sesli Çevirmen',
    vtHeroTitle: 'Konuş ve Çevir',
    vtHeroSubtitle: 'Kendi dilinizde konuşun ve anında çeviri alın',
    vtTapToSpeak: 'Konuşmak için dokunun',
    vtListening: 'Dinleniyor...',
    vtRecognized: 'Tanındı',
    vtPlayOriginal: 'Orijinali oynat',
    vtPlayTranslation: 'Çeviriyi oynat',
    vtCopyTranslation: 'Çeviriyi kopyala',
    vtClear: 'Temizle',
    vtSwapLanguages: 'Dilleri değiştir',
    vtSelectSourceLanguage: 'Kaynak dili seçin',
    vtSelectTargetLanguage: 'Hedef dili seçin',
    vtErrorNoPermission: 'Mikrofon izni yok. Lütfen ayarlardan izin verin.',
    vtErrorNoInternet: 'İnternet bağlantısı yok. Bağlantınızı kontrol edin ve tekrar deneyin.',
    vtErrorRecognitionFailed: 'Ses tanıma başarısız oldu. Lütfen tekrar deneyin.',
    vtErrorTranslationFailed: 'Çeviri başarısız oldu. Lütfen tekrar deneyin.',
    vtPermissionTitle: 'Mikrofon İzni',
    vtPermissionMessage: 'Bu özelliği kullanmak için mikrofon erişimi gereklidir',
    vtGrantPermission: 'İzin Ver',
    vtComingSoon: 'Yakında',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: 'Sesli Çevirmen Yakında!',
    voiceComingSoonDesc: 'Gerçek zamanlı ses çevirisi üzerinde çalışıyoruz. Yakında konuşarak anında çeviri alabileceksiniz!',
    voiceComingSoonFeature1: 'Gerçek zamanlı ses tanıma',
    voiceComingSoonFeature2: 'Anında çeviri',
    voiceComingSoonFeature3: 'Çeviriyi sesli dinle',
    voiceComingSoonButton: 'Ana Sayfaya',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: 'Yakında!',
    visualComingSoonDesc: 'Kameradan metin tanıma üzerinde çalışıyoruz. Yakında tabelaları, menüleri ve belgeleri çevirebileceksiniz!',
    visualComingSoonFeature1: 'Kameradan metin tanıma',
    visualComingSoonFeature2: 'AI metin tanıma',
    visualComingSoonFeature3: 'Galeri ve kamera desteği',

    // Coming Soon version badge
    comingSoonInVersion: 'v{version} sürümünde çıkacak',

    // Onboarding - Navigation
    onboardingSkip: 'Geç',
    onboardingNext: 'İleri',
    // Slide 1: Welcome
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: 'Türkmence çeviri — hızlı ve kolay!',
    // Slide 2: Phrasebook
    onboardingPhrasebookTitle: '30 dil çifti',
    onboardingPhrasebookSubtitle: 'Sesli konuşma kılavuzu, çevrimdışı çalışır',
    onboardingPhrasebookDemo: 'Merhaba',
    onboardingPlayAudio: 'Oynat',
    onboardingPlaying: 'Oynatılıyor...',
    onboardingFeatureAudio: 'Türkmence sesli telaffuz',
    onboardingFeatureOffline: 'İnternetsiz çalışır',
    // Slide 3: Translation
    onboardingTranslationTitle: 'Akıllı Çeviri',
    onboardingTranslationSubtitle: 'Metin çevirici ve AI asistan',
    onboardingTextTranslator: 'Metin Çevirici',
    onboardingTranslate: 'Çevir',
    onboardingTryAgain: 'Tekrar Dene',
    onboardingVisualTranslator: 'Görsel Çevirici',
    onboardingVoiceTranslator: 'Sesli Çevirici',
    onboardingAIAssistant: 'AI Asistan',
    onboardingAIPowered: 'AI Destekli',
    onboardingComingSoon: 'Yakında',
    // Slide 4: Ready
    onboardingReadyTitle: 'Her Şey Hazır!',
    onboardingReadySubtitle: 'Türkmence öğrenmeye hemen başla',
    onboardingGetStarted: 'Başla',
    // Slide 4: Ready - Feature Tags
    onboardingTagPhrasebook: '📖 Konuşma Kılavuzu',
    onboardingTagAudio: '🔊 Sesli',
    onboardingTagOffline: '✈️ Çevrimdışı',
    onboardingTagTranslator: '📝 Çevirici',
    onboardingTagAI: '🤖 AI Asistan',
    onboardingTagVisual: '📷 Görsel',
    onboardingTagVoice: '🎤 Sesli',

    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: 'Yüklü Sesler',
    settingsInstalledVoicesDesc: 'Tüm TTS seslerini görüntüle',
    settingsLoading: 'Ayarlar yükleniyor...',
    settingsDarkMode: 'Karanlık Mod',
    settingsDarkModeDesc: 'Karanlık temaya geç',
    settingsSpeechRate: 'Konuşma Hızı',
    settingsSpeechRateDesc: 'Telaffuz hızını ayarla',
    settingsResetAll: 'Tüm Ayarları Sıfırla',
    settingsResetAllDesc: 'Varsayılan ayarları geri yükle',
    settingsResetConfirm: 'Sıfırlamak istediğinizden emin misiniz?',
    settingsClearSearchHistory: 'Arama Geçmişini Temizle',
    settingsClearSearchHistoryDesc: 'Tüm arama kayıtlarını sil',
    settingsRateApp: 'Uygulamayı Değerlendir',
    settingsSendFeedback: 'Geri Bildirim Gönder',
    settingsAppearance: 'Görünüm',
    settingsDataStorage: 'Veri ve Depolama',
  },

  de: {
    // German mode: German speaker learning Turkmen
    home: 'Startseite',
    search: 'Suchen',
    favorites: 'Favoriten',
    settings: 'Einstellungen',
    additionalFeatures: 'Weitere Funktionen',
    statistics: 'Statistiken',

    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: 'Alle Werkzeuge zum Sprachenlernen',
    selectCategory: 'Kategorie wählen',
    recentlyStudied: 'Kürzlich gelernt',
    study: 'Lernen',

    // Main Hub Modules
    phrasebookTitle: 'Sprachführer',
    phrasebookSubtitle: '305 Phrasen in 22 Kategorien',
    visualTranslatorTitle: 'Visueller Übersetzer',
    visualTranslatorSubtitle: 'Text mit Kamera scannen',
    textTranslatorTitle: 'Textübersetzer',
    textTranslatorSubtitle: 'Text eingeben und übersetzen',
    voiceTranslatorTitle: 'Sprachübersetzer',
    voiceTranslatorSubtitle: 'Sprechen und in Echtzeit übersetzen',
    dictionaryTitle: 'Wörterbuch',
    dictionarySubtitle: 'Kommt in v2.0',
    aiAssistantsTitle: 'KI-Assistenten',
    aiAssistantsSubtitle: 'Intelligente Tipps und Unterstützung',
    myFavoritesTitle: 'Meine Favoriten',
    myFavoritesSubtitle: 'Gespeicherte Elemente',

    pronunciation: 'Aussprache',
    addToFavorites: 'Zu Favoriten hinzufügen',
    inFavorites: 'In Favoriten',
    share: 'Teilen',

    settingsTitle: '⚙️ Einstellungen',
    languageInterface: 'Oberflächensprache',
    switchLanguage: 'Sprache wechseln',
    audio: 'Audio',
    soundEffects: 'Soundeffekte',
    data: 'Daten',
    clearHistory: 'Verlauf löschen',
    offlineMode: 'Offline-Modus',
    about: 'Über die App',
    feedback: 'Feedback',

    searchPlaceholder: 'Phrase in beliebiger Sprache eingeben...',
    noResults: 'Keine Ergebnisse gefunden',
    searchHistory: 'Suchverlauf',

    cancel: 'Abbrechen',
    save: 'Speichern',
    delete: 'Löschen',
    confirm: 'Bestätigen',
    loading: 'Laden...',
    error: 'Fehler',
    success: 'Erfolg',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'Mit KI übersetzen',
    vtCameraSubtitle: 'Richten Sie Ihre Kamera auf beliebigen Text für sofortige Übersetzung',
    vtTakePhoto: 'Foto aufnehmen',
    vtChooseGallery: 'Aus Galerie wählen',
    vtProcessing: 'Bild wird verarbeitet...',
    vtProcessingSubtext: 'Text wird erkannt und übersetzt',
    vtOcrEngine: 'OCR-Engine',
    vtOcrEngineDesc: 'Wählen Sie, wie Text aus Bildern erkannt werden soll.',
    vtOcrSpaceNote: 'Kostenlos, 25K Anfragen/Monat',
    vtFeatures: 'Funktionen',
    vtFeatureOcrTitle: 'OCR-Texterkennung',
    vtFeatureOcrDesc: 'Erkennt Text in 30+ Sprachen mit hoher Genauigkeit',
    vtFeatureAiTitle: 'KI-Objektbeschreibung',
    vtFeatureAiDesc: 'Beschreibt Objekte, wenn kein Text gefunden wird',
    vtFeatureSmartTitle: 'Intelligente Übersetzung',
    vtFeatureSmartDesc: 'KI-gestützte kontextbezogene Übersetzung',
    vtFeatureSaveTitle: 'Speichern & Teilen',
    vtFeatureSaveDesc: 'Übersetzungen in Favoriten speichern und mit anderen teilen',
    vtPermissionsText: 'Kamera- und Fotogalerie-Berechtigungen sind erforderlich',
    vtGrantPermissions: 'Berechtigungen erteilen',
    vtRequestingPermissions: 'Berechtigungen werden angefordert...',
    vtAutoFallback: 'Automatisches Fallback aktiviert, falls ausgewählte Engine fehlschlägt',

    // Visual Translator - Result Screen
    vtResult: 'Ergebnis',
    vtRecognizedText: 'Erkannter Text',
    vtLanguageLabel: 'Sprache: ',
    vtAiAnalysis: 'KI-Analyse',
    vtTranslation: 'Übersetzung',
    vtTargetLabel: 'Ziel: ',
    vtPlay: 'Abspielen',
    vtStop: 'Stopp',
    vtCopy: 'Kopieren',
    vtTranslateAnother: 'Weitere übersetzen',
    vtCopied: 'Kopiert',
    vtCopiedMessage: 'Übersetzung in Zwischenablage kopiert',

    // Text Translator
    ttHeaderTitle: 'Textübersetzer',
    ttHeroTitle: 'Sofortübersetzung',
    ttHeroSubtitle: 'Geben Sie einen beliebigen Text ein und übersetzen Sie zwischen über 100 Sprachen',
    ttSelectLanguage: 'Auswählen',
    ttPlaceholder: 'Text zum Übersetzen eingeben...',
    ttClear: 'Löschen',
    ttTranslate: 'Übersetzen',
    ttTranslating: 'Wird übersetzt...',
    ttPlay: 'Abspielen',
    ttStop: 'Stopp',
    ttCopy: 'Kopieren',
    ttEmptyOutput: 'Die Übersetzung wird hier angezeigt',
    ttSourceLanguage: 'Ausgangssprache',
    ttTargetLanguage: 'Zielsprache',
    ttErrorTitle: 'Fehler',
    ttErrorEmptyText: 'Bitte geben Sie einen zu übersetzenden Text ein',
    ttErrorTranslationFailed: 'Übersetzung fehlgeschlagen. Bitte versuchen Sie es erneut.',
    ttErrorNoInternet: 'Keine Internetverbindung. Bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.',
    ttErrorTextTooLong: 'Der Text ist zu lang. Maximal 5000 Zeichen.',
    ttCopiedTitle: '✅ Kopiert',
    ttCopiedMessage: 'Übersetzung in die Zwischenablage kopiert',
    ttInfoTitle: 'Info',
    ttInfoCannotSwap: 'Wechsel nicht möglich, wenn "Automatisch erkennen" ausgewählt ist',

    // AI Assistants
    aiHomeTitle: 'KI-Assistenten',
    aiHomeSubtitle: 'Wählen Sie einen KI-Assistenten, der Ihnen beim Lernen der turkmenischen Sprache hilft',
    aiInfoText: 'KI-Assistenten verwenden fortschrittliche Sprachmodelle, um personalisierte Hilfe bereitzustellen. Antworten können einige Sekunden dauern.',

    // AI Assistant Names
    aiContextualTipsName: 'Kontextuelle Tipps',
    aiConversationTrainerName: 'Konversationstrainer',
    aiGrammarHelperName: 'Grammatik-Helfer',
    aiCulturalAdvisorName: 'Kulturberater',
    aiGeneralAssistantName: 'Allgemeiner Assistent',

    // AI Assistant Descriptions
    aiContextualTipsDesc: 'Erhalten Sie intelligente Tipps basierend auf Ihrem aktuellen Lernkontext',
    aiConversationTrainerDesc: 'Üben Sie echte Gespräche und verbessern Sie Ihre Sprechfähigkeiten',
    aiGrammarHelperDesc: 'Erhalten Sie sofortige Hilfe bei turkmenischen Grammatikregeln und Strukturen',
    aiCulturalAdvisorDesc: 'Erfahren Sie mehr über turkmenische Kultur, Bräuche und Etikette',
    aiGeneralAssistantDesc: 'Fragen Sie alles über das Lernen der turkmenischen Sprache',

    // Welcome Messages
    aiContextualTipsWelcome: 'Hallo! Ich bin hier, um Ihnen hilfreiche Tipps und Einblicke zum Lernen von Turkmenisch zu geben. Fragen Sie mich alles!',
    aiConversationTrainerWelcome: 'Hallo! Lassen Sie uns einige Gespräche auf Turkmenisch üben. Ich helfe Ihnen, Ihre Sprechfähigkeiten zu verbessern!',
    aiGrammarHelperWelcome: 'Willkommen! Ich bin Ihr Grammatik-Assistent. Fragen Sie mich nach turkmenischen Grammatikregeln oder Strukturen.',
    aiCulturalAdvisorWelcome: 'Salam! Lassen Sie mich Ihnen helfen, die turkmenische Kultur, Bräuche und Traditionen zu verstehen.',
    aiGeneralAssistantWelcome: 'Hallo! Ich bin Ihr KI-Assistent. Ich kann Ihnen bei Übersetzungen, Phrasen und der Kommunikation in verschiedenen Sprachen helfen.',

    // ChatScreen UI
    aiInputPlaceholder: 'Geben Sie Ihre Nachricht ein...',
    aiThinking: 'Denke nach...',
    aiErrorMessage: 'Entschuldigung, ich bin auf einen Fehler gestoßen. Bitte versuchen Sie es erneut.',
    aiClearHistory: 'Verlauf löschen',
    aiClearHistoryTitle: 'Verlauf löschen',
    aiClearHistoryMessage: 'Sind Sie sicher, dass Sie alle Nachrichten löschen möchten?',
    aiSelectModel: 'KI-Modell auswählen',
    aiSelectModelMessage: 'Wählen Sie das zu verwendende KI-Modell',
    aiExportChat: 'Chat exportieren',
    aiCopyAll: 'Alles kopieren',
    aiResponseSettings: 'Antworteinstellungen',
    aiResponseSettingsMessage: 'Passen Sie an, wie die KI antwortet',
    aiResponseLanguage: 'Antwortsprache',
    aiResponseLanguageMessage: 'In welcher Sprache soll die KI antworten',
    aiCreativeMode: 'Kreativer Modus',
    aiBalancedMode: 'Ausgewogener Modus',
    aiPreciseMode: 'Präziser Modus',

    // Voice Translator
    vtHeaderTitle: 'Sprachübersetzer',
    vtHeroTitle: 'Sprechen und übersetzen',
    vtHeroSubtitle: 'Sprechen Sie in Ihrer Sprache und erhalten Sie sofortige Übersetzung',
    vtTapToSpeak: 'Tippen zum Sprechen',
    vtListening: 'Zuhören...',
    vtRecognized: 'Erkannt',
    vtPlayOriginal: 'Original abspielen',
    vtPlayTranslation: 'Übersetzung abspielen',
    vtCopyTranslation: 'Übersetzung kopieren',
    vtClear: 'Löschen',
    vtSwapLanguages: 'Sprachen tauschen',
    vtSelectSourceLanguage: 'Quellsprache wählen',
    vtSelectTargetLanguage: 'Zielsprache wählen',
    vtErrorNoPermission: 'Keine Mikrofonberechtigung. Bitte erteilen Sie die Berechtigung in den Einstellungen.',
    vtErrorNoInternet: 'Keine Internetverbindung. Überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.',
    vtErrorRecognitionFailed: 'Spracherkennung fehlgeschlagen. Bitte versuchen Sie es erneut.',
    vtErrorTranslationFailed: 'Übersetzung fehlgeschlagen. Bitte versuchen Sie es erneut.',
    vtPermissionTitle: 'Mikrofonberechtigung',
    vtPermissionMessage: 'Mikrofonzugriff ist erforderlich, um diese Funktion zu verwenden',
    vtGrantPermission: 'Berechtigung erteilen',
    vtComingSoon: 'Demnächst',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: 'Sprachübersetzer kommt bald!',
    voiceComingSoonDesc: 'Wir arbeiten an Echtzeit-Sprachübersetzung. Bald können Sie sprechen und sofortige Übersetzungen erhalten!',
    voiceComingSoonFeature1: 'Echtzeit-Spracherkennung',
    voiceComingSoonFeature2: 'Sofortige Übersetzung',
    voiceComingSoonFeature3: 'Sprachausgabe der Übersetzung',
    voiceComingSoonButton: 'Zur Startseite',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: 'Demnächst!',
    visualComingSoonDesc: 'Wir arbeiten an Kamera-Texterkennung. Bald können Sie Schilder, Menüs und Dokumente übersetzen!',
    visualComingSoonFeature1: 'Kamera-Texterkennung',
    visualComingSoonFeature2: 'KI-Bildübersetzung',
    visualComingSoonFeature3: 'Galerie- und Kamera-Unterstützung',

    // Coming Soon version badge
    comingSoonInVersion: 'Kommt in v{version}',

    // Onboarding - Navigation
    onboardingSkip: 'Überspringen',
    onboardingNext: 'Weiter',
    // Slide 1: Welcome
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: 'Turkmenisch übersetzen — schnell und einfach!',
    // Slide 2: Phrasebook
    onboardingPhrasebookTitle: '30 Sprachpaare',
    onboardingPhrasebookSubtitle: 'Sprachführer mit Audio, funktioniert offline',
    onboardingPhrasebookDemo: 'Hallo',
    onboardingPlayAudio: 'Abspielen',
    onboardingPlaying: 'Wird abgespielt...',
    onboardingFeatureAudio: 'Turkmenische Aussprache',
    onboardingFeatureOffline: 'Funktioniert ohne Internet',
    // Slide 3: Translation
    onboardingTranslationTitle: 'Intelligente Übersetzung',
    onboardingTranslationSubtitle: 'Textübersetzer und KI-Assistent',
    onboardingTextTranslator: 'Textübersetzer',
    onboardingTranslate: 'Übersetzen',
    onboardingTryAgain: 'Erneut versuchen',
    onboardingVisualTranslator: 'Visueller Übersetzer',
    onboardingVoiceTranslator: 'Sprachübersetzer',
    onboardingAIAssistant: 'KI-Assistent',
    onboardingAIPowered: 'KI-gestützt',
    onboardingComingSoon: 'Demnächst',
    // Slide 4: Ready
    onboardingReadyTitle: 'Alles bereit!',
    onboardingReadySubtitle: 'Beginne jetzt Turkmenisch zu lernen',
    onboardingGetStarted: 'Jetzt starten',
    // Slide 4: Ready - Feature Tags
    onboardingTagPhrasebook: '📖 Sprachführer',
    onboardingTagAudio: '🔊 Audio',
    onboardingTagOffline: '✈️ Offline',
    onboardingTagTranslator: '📝 Übersetzer',
    onboardingTagAI: '🤖 KI-Assistent',
    onboardingTagVisual: '📷 Visuell',
    onboardingTagVoice: '🎤 Sprache',

    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: 'Installierte Stimmen',
    settingsInstalledVoicesDesc: 'Alle verfügbaren TTS-Stimmen anzeigen',
    settingsLoading: 'Einstellungen werden geladen...',
    settingsDarkMode: 'Dunkelmodus',
    settingsDarkModeDesc: 'Zum dunklen Design wechseln',
    settingsSpeechRate: 'Sprechgeschwindigkeit',
    settingsSpeechRateDesc: 'Aussprachegeschwindigkeit anpassen',
    settingsResetAll: 'Alle Einstellungen zurücksetzen',
    settingsResetAllDesc: 'Standardeinstellungen wiederherstellen',
    settingsResetConfirm: 'Möchten Sie wirklich zurücksetzen?',
    settingsClearSearchHistory: 'Suchverlauf löschen',
    settingsClearSearchHistoryDesc: 'Alle Sucheinträge löschen',
    settingsRateApp: 'App bewerten',
    settingsSendFeedback: 'Feedback senden',
    settingsAppearance: 'Darstellung',
    settingsDataStorage: 'Daten & Speicher',
  },

  fr: {
    // French mode: French speaker learning Turkmen
    home: 'Accueil',
    search: 'Rechercher',
    favorites: 'Favoris',
    settings: 'Paramètres',
    additionalFeatures: 'Plus de fonctionnalités',
    statistics: 'Statistiques',

    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: 'Tous les outils pour apprendre la langue',
    selectCategory: 'Sélectionner une catégorie',
    recentlyStudied: 'Récemment étudié',
    study: 'Étudier',

    // Main Hub Modules
    phrasebookTitle: 'Guide de conversation',
    phrasebookSubtitle: '305 phrases dans 22 catégories',
    visualTranslatorTitle: 'Traducteur visuel',
    visualTranslatorSubtitle: 'Scanner le texte avec la caméra',
    textTranslatorTitle: 'Traducteur de texte',
    textTranslatorSubtitle: 'Taper et traduire le texte',
    voiceTranslatorTitle: 'Traducteur vocal',
    voiceTranslatorSubtitle: 'Parlez et traduisez en temps réel',
    dictionaryTitle: 'Dictionnaire',
    dictionarySubtitle: 'Arrive dans v2.0',
    aiAssistantsTitle: 'Assistants IA',
    aiAssistantsSubtitle: 'Conseils intelligents et support',
    myFavoritesTitle: 'Mes favoris',
    myFavoritesSubtitle: 'Éléments sauvegardés',

    pronunciation: 'Prononciation',
    addToFavorites: 'Ajouter aux favoris',
    inFavorites: 'Dans les favoris',
    share: 'Partager',

    settingsTitle: '⚙️ Paramètres',
    languageInterface: 'Langue de l\'interface',
    switchLanguage: 'Changer de langue',
    audio: 'Audio',
    soundEffects: 'Effets sonores',
    data: 'Données',
    clearHistory: 'Effacer l\'historique',
    offlineMode: 'Mode hors ligne',
    about: 'À propos de l\'application',
    feedback: 'Commentaires',

    searchPlaceholder: 'Entrer une phrase dans n\'importe quelle langue...',
    noResults: 'Aucun résultat trouvé',
    searchHistory: 'Historique de recherche',

    cancel: 'Annuler',
    save: 'Enregistrer',
    delete: 'Supprimer',
    confirm: 'Confirmer',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'Traduire avec IA',
    vtCameraSubtitle: 'Pointez votre appareil photo sur n\'importe quel texte pour une traduction instantanée',
    vtTakePhoto: 'Prendre une photo',
    vtChooseGallery: 'Choisir dans la galerie',
    vtProcessing: 'Traitement de l\'image...',
    vtProcessingSubtext: 'Reconnaissance et traduction du texte',
    vtOcrEngine: 'Moteur OCR',
    vtOcrEngineDesc: 'Choisissez comment reconnaître le texte des images.',
    vtOcrSpaceNote: 'Gratuit, 25K requêtes/mois',
    vtFeatures: 'Fonctionnalités',
    vtFeatureOcrTitle: 'Reconnaissance de texte OCR',
    vtFeatureOcrDesc: 'Reconnaît le texte en 30+ langues avec haute précision',
    vtFeatureAiTitle: 'Description d\'objet par IA',
    vtFeatureAiDesc: 'Décrit les objets lorsqu\'aucun texte n\'est trouvé',
    vtFeatureSmartTitle: 'Traduction intelligente',
    vtFeatureSmartDesc: 'Traduction contextuelle alimentée par l\'IA',
    vtFeatureSaveTitle: 'Enregistrer et partager',
    vtFeatureSaveDesc: 'Enregistrez les traductions dans les favoris et partagez-les',
    vtPermissionsText: 'Les autorisations de caméra et de galerie photo sont requises',
    vtGrantPermissions: 'Accorder les autorisations',
    vtRequestingPermissions: 'Demande d\'autorisations...',
    vtAutoFallback: 'Repli automatique activé si le moteur sélectionné échoue',

    // Visual Translator - Result Screen
    vtResult: 'Résultat',
    vtRecognizedText: 'Texte reconnu',
    vtLanguageLabel: 'Langue: ',
    vtAiAnalysis: 'Analyse IA',
    vtTranslation: 'Traduction',
    vtTargetLabel: 'Cible: ',
    vtPlay: 'Lire',
    vtStop: 'Arrêter',
    vtCopy: 'Copier',
    vtTranslateAnother: 'Traduire un autre',
    vtCopied: 'Copié',
    vtCopiedMessage: 'Traduction copiée dans le presse-papiers',

    // Text Translator
    ttHeaderTitle: 'Traducteur de texte',
    ttHeroTitle: 'Traduction instantanée',
    ttHeroSubtitle: 'Saisissez n\'importe quel texte et traduisez entre plus de 100 langues',
    ttSelectLanguage: 'Sélectionner',
    ttPlaceholder: 'Entrez le texte à traduire...',
    ttClear: 'Effacer',
    ttTranslate: 'Traduire',
    ttTranslating: 'Traduction en cours...',
    ttPlay: 'Lire',
    ttStop: 'Arrêter',
    ttCopy: 'Copier',
    ttEmptyOutput: 'La traduction apparaîtra ici',
    ttSourceLanguage: 'Langue source',
    ttTargetLanguage: 'Langue cible',
    ttErrorTitle: 'Erreur',
    ttErrorEmptyText: 'Veuillez entrer un texte à traduire',
    ttErrorTranslationFailed: 'La traduction a échoué. Veuillez réessayer.',
    ttErrorNoInternet: 'Pas de connexion Internet. Veuillez vérifier votre connexion et réessayer.',
    ttErrorTextTooLong: 'Le texte est trop long. Maximum 5000 caractères.',
    ttCopiedTitle: '✅ Copié',
    ttCopiedMessage: 'Traduction copiée dans le presse-papiers',
    ttInfoTitle: 'Info',
    ttInfoCannotSwap: 'Impossible d\'échanger lorsque la détection automatique est sélectionnée',

    // AI Assistants
    aiHomeTitle: 'Assistants IA',
    aiHomeSubtitle: 'Choisissez un assistant IA pour vous aider à apprendre la langue turkmène',
    aiInfoText: 'Les assistants IA utilisent des modèles de langage avancés pour fournir une aide personnalisée. Les réponses peuvent prendre quelques secondes.',

    // AI Assistant Names
    aiContextualTipsName: 'Conseils contextuels',
    aiConversationTrainerName: 'Entraîneur de conversation',
    aiGrammarHelperName: 'Assistant de grammaire',
    aiCulturalAdvisorName: 'Conseiller culturel',
    aiGeneralAssistantName: 'Assistant général',

    // AI Assistant Descriptions
    aiContextualTipsDesc: 'Obtenez des conseils intelligents basés sur votre contexte d\'apprentissage actuel',
    aiConversationTrainerDesc: 'Pratiquez des conversations réelles et améliorez vos compétences orales',
    aiGrammarHelperDesc: 'Obtenez une aide instantanée avec les règles et structures grammaticales turkmènes',
    aiCulturalAdvisorDesc: 'Découvrez la culture, les coutumes et l\'étiquette turkmènes',
    aiGeneralAssistantDesc: 'Posez n\'importe quelle question sur l\'apprentissage de la langue turkmène',

    // Welcome Messages
    aiContextualTipsWelcome: 'Bonjour ! Je suis là pour vous fournir des conseils et des idées utiles pour apprendre le turkmène. Demandez-moi n\'importe quoi !',
    aiConversationTrainerWelcome: 'Salut ! Pratiquons des conversations en turkmène. Je vous aiderai à améliorer vos compétences orales !',
    aiGrammarHelperWelcome: 'Bienvenue ! Je suis votre assistant de grammaire. Posez-moi des questions sur les règles ou structures grammaticales turkmènes.',
    aiCulturalAdvisorWelcome: 'Salam ! Laissez-moi vous aider à comprendre la culture, les coutumes et les traditions turkmènes.',
    aiGeneralAssistantWelcome: 'Bonjour ! Je suis votre assistant IA. Je peux vous aider avec les traductions, les phrases et la communication dans différentes langues.',

    // ChatScreen UI
    aiInputPlaceholder: 'Tapez votre message...',
    aiThinking: 'Réflexion...',
    aiErrorMessage: 'Désolé, j\'ai rencontré une erreur. Veuillez réessayer.',
    aiClearHistory: 'Effacer l\'historique',
    aiClearHistoryTitle: 'Effacer l\'historique',
    aiClearHistoryMessage: 'Êtes-vous sûr de vouloir effacer tous les messages ?',
    aiSelectModel: 'Sélectionner un modèle IA',
    aiSelectModelMessage: 'Choisissez le modèle IA à utiliser',
    aiExportChat: 'Exporter la conversation',
    aiCopyAll: 'Tout copier',
    aiResponseSettings: 'Paramètres de réponse',
    aiResponseSettingsMessage: 'Ajustez comment l\'IA répond',
    aiResponseLanguage: 'Langue de réponse',
    aiResponseLanguageMessage: 'Choisissez dans quelle langue l\'IA doit répondre',
    aiCreativeMode: 'Mode créatif',
    aiBalancedMode: 'Mode équilibré',
    aiPreciseMode: 'Mode précis',

    // Voice Translator
    vtHeaderTitle: 'Traducteur vocal',
    vtHeroTitle: 'Parlez et traduisez',
    vtHeroSubtitle: 'Parlez dans votre langue et obtenez une traduction instantanée',
    vtTapToSpeak: 'Appuyez pour parler',
    vtListening: 'Écoute...',
    vtRecognized: 'Reconnu',
    vtPlayOriginal: 'Lire l\'original',
    vtPlayTranslation: 'Lire la traduction',
    vtCopyTranslation: 'Copier la traduction',
    vtClear: 'Effacer',
    vtSwapLanguages: 'Échanger les langues',
    vtSelectSourceLanguage: 'Sélectionner la langue source',
    vtSelectTargetLanguage: 'Sélectionner la langue cible',
    vtErrorNoPermission: 'Pas d\'autorisation microphone. Veuillez accorder l\'autorisation dans les paramètres.',
    vtErrorNoInternet: 'Pas de connexion Internet. Vérifiez votre connexion et réessayez.',
    vtErrorRecognitionFailed: 'La reconnaissance vocale a échoué. Veuillez réessayer.',
    vtErrorTranslationFailed: 'La traduction a échoué. Veuillez réessayer.',
    vtPermissionTitle: 'Autorisation du microphone',
    vtPermissionMessage: 'L\'accès au microphone est requis pour utiliser cette fonctionnalité',
    vtGrantPermission: 'Accorder l\'autorisation',
    vtComingSoon: 'Bientôt',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: 'Traducteur vocal bientôt!',
    voiceComingSoonDesc: 'Nous travaillons sur la traduction vocale en temps réel. Bientôt vous pourrez parler et obtenir une traduction instantanée!',
    voiceComingSoonFeature1: 'Reconnaissance vocale en temps réel',
    voiceComingSoonFeature2: 'Traduction instantanée',
    voiceComingSoonFeature3: 'Lecture audio de la traduction',
    voiceComingSoonButton: 'Retour à l\'accueil',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: 'Bientôt!',
    visualComingSoonDesc: 'Nous travaillons sur la reconnaissance de texte par caméra. Bientôt vous pourrez traduire panneaux, menus et documents!',
    visualComingSoonFeature1: 'Reconnaissance de texte par caméra',
    visualComingSoonFeature2: 'Traduction d\'images par IA',
    visualComingSoonFeature3: 'Support galerie et caméra',

    // Coming Soon version badge
    comingSoonInVersion: 'Disponible en v{version}',

    // Onboarding - Navigation
    onboardingSkip: 'Passer',
    onboardingNext: 'Suivant',
    // Slide 1: Welcome
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: 'Traduction turkmène — rapide et facile !',
    // Slide 2: Phrasebook
    onboardingPhrasebookTitle: '30 paires de langues',
    onboardingPhrasebookSubtitle: 'Guide de conversation avec audio, fonctionne hors ligne',
    onboardingPhrasebookDemo: 'Bonjour',
    onboardingPlayAudio: 'Lire',
    onboardingPlaying: 'Lecture en cours...',
    onboardingFeatureAudio: 'Prononciation turkmène',
    onboardingFeatureOffline: 'Fonctionne sans internet',
    // Slide 3: Translation
    onboardingTranslationTitle: 'Traduction intelligente',
    onboardingTranslationSubtitle: 'Traducteur de texte et assistant IA',
    onboardingTextTranslator: 'Traducteur de texte',
    onboardingTranslate: 'Traduire',
    onboardingTryAgain: 'Réessayer',
    onboardingVisualTranslator: 'Traducteur visuel',
    onboardingVoiceTranslator: 'Traducteur vocal',
    onboardingAIAssistant: 'Assistant IA',
    onboardingAIPowered: 'Propulsé par IA',
    onboardingComingSoon: 'Bientôt',
    // Slide 4: Ready
    onboardingReadyTitle: 'Tout est prêt !',
    onboardingReadySubtitle: 'Commencez à apprendre le turkmène maintenant',
    onboardingGetStarted: 'Commencer',
    // Slide 4: Ready - Feature Tags
    onboardingTagPhrasebook: '📖 Guide',
    onboardingTagAudio: '🔊 Audio',
    onboardingTagOffline: '✈️ Hors ligne',
    onboardingTagTranslator: '📝 Traducteur',
    onboardingTagAI: '🤖 Assistant IA',
    onboardingTagVisual: '📷 Visuel',
    onboardingTagVoice: '🎤 Vocal',

    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: 'Voix installées',
    settingsInstalledVoicesDesc: 'Voir toutes les voix TTS disponibles',
    settingsLoading: 'Chargement des paramètres...',
    settingsDarkMode: 'Mode sombre',
    settingsDarkModeDesc: 'Passer au thème sombre',
    settingsSpeechRate: 'Vitesse de parole',
    settingsSpeechRateDesc: 'Ajuster la vitesse de prononciation',
    settingsResetAll: 'Réinitialiser tous les paramètres',
    settingsResetAllDesc: 'Restaurer les paramètres par défaut',
    settingsResetConfirm: 'Êtes-vous sûr de vouloir réinitialiser?',
    settingsClearSearchHistory: "Effacer l'historique de recherche",
    settingsClearSearchHistoryDesc: 'Supprimer tous les enregistrements de recherche',
    settingsRateApp: "Évaluer l'application",
    settingsSendFeedback: 'Envoyer un commentaire',
    settingsAppearance: 'Apparence',
    settingsDataStorage: 'Données et stockage',
  },

  es: {
    // Spanish mode: Spanish speaker learning Turkmen
    home: 'Inicio',
    search: 'Buscar',
    favorites: 'Favoritos',
    settings: 'Configuración',
    additionalFeatures: 'Más funciones',
    statistics: 'Estadísticas',

    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: 'Todas las herramientas para aprender idiomas',
    selectCategory: 'Seleccionar categoría',
    recentlyStudied: 'Estudiado recientemente',
    study: 'Estudiar',

    // Main Hub Modules
    phrasebookTitle: 'Guía de conversación',
    phrasebookSubtitle: '305 frases en 22 categorías',
    visualTranslatorTitle: 'Traductor visual',
    visualTranslatorSubtitle: 'Escanear texto con cámara',
    textTranslatorTitle: 'Traductor de texto',
    textTranslatorSubtitle: 'Escribir y traducir texto',
    voiceTranslatorTitle: 'Traductor de voz',
    voiceTranslatorSubtitle: 'Habla y traduce en tiempo real',
    dictionaryTitle: 'Diccionario',
    dictionarySubtitle: 'Próximamente en v2.0',
    aiAssistantsTitle: 'Asistentes IA',
    aiAssistantsSubtitle: 'Consejos inteligentes y soporte',
    myFavoritesTitle: 'Mis favoritos',
    myFavoritesSubtitle: 'Elementos guardados',

    pronunciation: 'Pronunciación',
    addToFavorites: 'Añadir a favoritos',
    inFavorites: 'En favoritos',
    share: 'Compartir',

    settingsTitle: '⚙️ Configuración',
    languageInterface: 'Idioma de la interfaz',
    switchLanguage: 'Cambiar idioma',
    audio: 'Audio',
    soundEffects: 'Efectos de sonido',
    data: 'Datos',
    clearHistory: 'Borrar historial',
    offlineMode: 'Modo sin conexión',
    about: 'Acerca de la aplicación',
    feedback: 'Comentarios',

    searchPlaceholder: 'Introducir frase en cualquier idioma...',
    noResults: 'No se encontraron resultados',
    searchHistory: 'Historial de búsqueda',

    cancel: 'Cancelar',
    save: 'Guardar',
    delete: 'Eliminar',
    confirm: 'Confirmar',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',

    vtTranslateWithAI: 'Traducir con IA',
    vtCameraSubtitle: 'Apunta tu cámara a cualquier texto para obtener traducción instantánea',
    vtTakePhoto: 'Tomar foto',
    vtChooseGallery: 'Elegir de la galería',
    vtProcessing: 'Procesando imagen...',
    vtProcessingSubtext: 'Reconociendo y traduciendo texto',
    vtOcrEngine: 'Motor OCR',
    vtOcrEngineDesc: 'Elija cómo reconocer texto de imágenes.',
    vtOcrSpaceNote: 'Gratis, 25K solicitudes/mes',
    vtFeatures: 'Características',
    vtFeatureOcrTitle: 'Reconocimiento de texto OCR',
    vtFeatureOcrDesc: 'Reconoce texto en 30+ idiomas con alta precisión',
    vtFeatureAiTitle: 'Descripción de objetos con IA',
    vtFeatureAiDesc: 'Describe objetos cuando no se encuentra texto',
    vtFeatureSmartTitle: 'Traducción inteligente',
    vtFeatureSmartDesc: 'Traducción contextual impulsada por IA',
    vtFeatureSaveTitle: 'Guardar y compartir',
    vtFeatureSaveDesc: 'Guarda traducciones en favoritos y compártelas',
    vtPermissionsText: 'Se requieren permisos de cámara y galería de fotos',
    vtGrantPermissions: 'Conceder permisos',
    vtRequestingPermissions: 'Solicitando permisos...',
    vtAutoFallback: 'Reserva automática activada si falla el motor seleccionado',
    vtResult: 'Resultado',
    vtRecognizedText: 'Texto reconocido',
    vtLanguageLabel: 'Idioma: ',
    vtAiAnalysis: 'Análisis IA',
    vtTranslation: 'Traducción',
    vtTargetLabel: 'Objetivo: ',
    vtPlay: 'Reproducir',
    vtStop: 'Detener',
    vtCopy: 'Copiar',
    vtTranslateAnother: 'Traducir otro',
    vtCopied: 'Copiado',
    vtCopiedMessage: 'Traducción copiada al portapapeles',

    // Text Translator
    ttHeaderTitle: 'Traductor de texto',
    ttHeroTitle: 'Traducción instantánea',
    ttHeroSubtitle: 'Escribe cualquier texto y traduce entre más de 100 idiomas',
    ttSelectLanguage: 'Seleccionar',
    ttPlaceholder: 'Introduce el texto a traducir...',
    ttClear: 'Borrar',
    ttTranslate: 'Traducir',
    ttTranslating: 'Traduciendo...',
    ttPlay: 'Reproducir',
    ttStop: 'Detener',
    ttCopy: 'Copiar',
    ttEmptyOutput: 'La traducción aparecerá aquí',
    ttSourceLanguage: 'Idioma origen',
    ttTargetLanguage: 'Idioma destino',
    ttErrorTitle: 'Error',
    ttErrorEmptyText: 'Por favor, introduce el texto a traducir',
    ttErrorTranslationFailed: 'Error en la traducción. Por favor, inténtalo de nuevo.',
    ttErrorNoInternet: 'Sin conexión a Internet. Por favor, verifica tu conexión e inténtalo de nuevo.',
    ttErrorTextTooLong: 'El texto es demasiado largo. Máximo 5000 caracteres.',
    ttCopiedTitle: '✅ Copiado',
    ttCopiedMessage: 'Traducción copiada al portapapeles',
    ttInfoTitle: 'Información',
    ttInfoCannotSwap: 'No se puede intercambiar cuando está seleccionada la detección automática',

    // AI Assistants
    aiHomeTitle: 'Asistentes IA',
    aiHomeSubtitle: 'Elige un asistente IA para ayudarte a aprender el idioma turcomano',
    aiInfoText: 'Los asistentes IA utilizan modelos de lenguaje avanzados para proporcionar ayuda personalizada. Las respuestas pueden tardar unos segundos.',

    // AI Assistant Names
    aiContextualTipsName: 'Consejos contextuales',
    aiConversationTrainerName: 'Entrenador de conversación',
    aiGrammarHelperName: 'Asistente de gramática',
    aiCulturalAdvisorName: 'Asesor cultural',
    aiGeneralAssistantName: 'Asistente general',

    // AI Assistant Descriptions
    aiContextualTipsDesc: 'Obtén consejos inteligentes basados en tu contexto de aprendizaje actual',
    aiConversationTrainerDesc: 'Practica conversaciones reales y mejora tus habilidades para hablar',
    aiGrammarHelperDesc: 'Obtén ayuda instantánea con las reglas y estructuras gramaticales del turcomano',
    aiCulturalAdvisorDesc: 'Aprende sobre la cultura, costumbres y etiqueta turcomanas',
    aiGeneralAssistantDesc: 'Pregunta cualquier cosa sobre el aprendizaje del idioma turcomano',

    // Welcome Messages
    aiContextualTipsWelcome: '¡Hola! Estoy aquí para proporcionarte consejos e ideas útiles para aprender turcomano. ¡Pregúntame lo que quieras!',
    aiConversationTrainerWelcome: '¡Hola! Practiquemos algunas conversaciones en turcomano. ¡Te ayudaré a mejorar tus habilidades para hablar!',
    aiGrammarHelperWelcome: '¡Bienvenido! Soy tu asistente de gramática. Pregúntame sobre cualquier regla o estructura gramatical del turcomano.',
    aiCulturalAdvisorWelcome: '¡Salam! Déjame ayudarte a comprender la cultura, costumbres y tradiciones turcomanas.',
    aiGeneralAssistantWelcome: '¡Hola! Soy tu asistente de IA. Puedo ayudarte con traducciones, frases y comunicación en diferentes idiomas.',

    // ChatScreen UI
    aiInputPlaceholder: 'Escribe tu mensaje...',
    aiThinking: 'Pensando...',
    aiErrorMessage: 'Lo siento, encontré un error. Por favor, inténtalo de nuevo.',
    aiClearHistory: 'Borrar historial',
    aiClearHistoryTitle: 'Borrar historial',
    aiClearHistoryMessage: '¿Estás seguro de que quieres borrar todos los mensajes?',
    aiSelectModel: 'Seleccionar modelo de IA',
    aiSelectModelMessage: 'Elige qué modelo de IA usar',
    aiExportChat: 'Exportar chat',
    aiCopyAll: 'Copiar todo',
    aiResponseSettings: 'Configuración de respuestas',
    aiResponseSettingsMessage: 'Ajusta cómo responde la IA',
    aiResponseLanguage: 'Idioma de respuesta',
    aiResponseLanguageMessage: 'Elige en qué idioma debe responder la IA',
    aiCreativeMode: 'Modo creativo',
    aiBalancedMode: 'Modo equilibrado',
    aiPreciseMode: 'Modo preciso',

    // Voice Translator
    vtHeaderTitle: 'Traductor de voz',
    vtHeroTitle: 'Habla y traduce',
    vtHeroSubtitle: 'Habla en tu idioma y obtén traducción instantánea',
    vtTapToSpeak: 'Toca para hablar',
    vtListening: 'Escuchando...',
    vtRecognized: 'Reconocido',
    vtPlayOriginal: 'Reproducir original',
    vtPlayTranslation: 'Reproducir traducción',
    vtCopyTranslation: 'Copiar traducción',
    vtClear: 'Borrar',
    vtSwapLanguages: 'Intercambiar idiomas',
    vtSelectSourceLanguage: 'Seleccionar idioma de origen',
    vtSelectTargetLanguage: 'Seleccionar idioma de destino',
    vtErrorNoPermission: 'Sin permiso de micrófono. Por favor, concede permiso en la configuración.',
    vtErrorNoInternet: 'Sin conexión a Internet. Verifica tu conexión e inténtalo de nuevo.',
    vtErrorRecognitionFailed: 'Reconocimiento de voz fallido. Por favor, inténtalo de nuevo.',
    vtErrorTranslationFailed: 'Traducción fallida. Por favor, inténtalo de nuevo.',
    vtPermissionTitle: 'Permiso de micrófono',
    vtPermissionMessage: 'Se requiere acceso al micrófono para usar esta función',
    vtGrantPermission: 'Conceder permiso',
    vtComingSoon: 'Próximamente',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: '¡Traductor de voz próximamente!',
    voiceComingSoonDesc: 'Estamos trabajando en traducción de voz en tiempo real. ¡Pronto podrás hablar y obtener traducción instantánea!',
    voiceComingSoonFeature1: 'Reconocimiento de voz en tiempo real',
    voiceComingSoonFeature2: 'Traducción instantánea',
    voiceComingSoonFeature3: 'Reproducción de audio de la traducción',
    voiceComingSoonButton: 'Volver al inicio',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: '¡Próximamente!',
    visualComingSoonDesc: 'Estamos trabajando en reconocimiento de texto por cámara. ¡Pronto podrás traducir carteles, menús y documentos!',
    visualComingSoonFeature1: 'Reconocimiento de texto por cámara',
    visualComingSoonFeature2: 'Traducción de imágenes con IA',
    visualComingSoonFeature3: 'Soporte de galería y cámara',

    // Coming Soon version badge
    comingSoonInVersion: 'Disponible en v{version}',

    // Onboarding - Navigation
    onboardingSkip: 'Omitir',
    onboardingNext: 'Siguiente',
    // Slide 1: Welcome
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: 'Traducción turcomana — ¡rápida y fácil!',
    // Slide 2: Phrasebook
    onboardingPhrasebookTitle: '30 pares de idiomas',
    onboardingPhrasebookSubtitle: 'Guía de conversación con audio, funciona sin conexión',
    onboardingPhrasebookDemo: 'Hola',
    onboardingPlayAudio: 'Reproducir',
    onboardingPlaying: 'Reproduciendo...',
    onboardingFeatureAudio: 'Pronunciación turcomana',
    onboardingFeatureOffline: 'Funciona sin internet',
    // Slide 3: Translation
    onboardingTranslationTitle: 'Traducción inteligente',
    onboardingTranslationSubtitle: 'Traductor de texto y asistente IA',
    onboardingTextTranslator: 'Traductor de texto',
    onboardingTranslate: 'Traducir',
    onboardingTryAgain: 'Intentar de nuevo',
    onboardingVisualTranslator: 'Traductor visual',
    onboardingVoiceTranslator: 'Traductor de voz',
    onboardingAIAssistant: 'Asistente IA',
    onboardingAIPowered: 'Impulsado por IA',
    onboardingComingSoon: 'Próximamente',
    // Slide 4: Ready
    onboardingReadyTitle: '¡Todo listo!',
    onboardingReadySubtitle: 'Comienza a aprender turcomano ahora',
    onboardingGetStarted: 'Comenzar',
    // Slide 4: Ready - Feature Tags
    onboardingTagPhrasebook: '📖 Guía',
    onboardingTagAudio: '🔊 Audio',
    onboardingTagOffline: '✈️ Sin conexión',
    onboardingTagTranslator: '📝 Traductor',
    onboardingTagAI: '🤖 Asistente IA',
    onboardingTagVisual: '📷 Visual',
    onboardingTagVoice: '🎤 Voz',

    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: 'Voces instaladas',
    settingsInstalledVoicesDesc: 'Ver todas las voces TTS disponibles',
    settingsLoading: 'Cargando configuración...',
    settingsDarkMode: 'Modo oscuro',
    settingsDarkModeDesc: 'Cambiar al tema oscuro',
    settingsSpeechRate: 'Velocidad del habla',
    settingsSpeechRateDesc: 'Ajustar velocidad de pronunciación',
    settingsResetAll: 'Restablecer toda la configuración',
    settingsResetAllDesc: 'Restaurar configuración predeterminada',
    settingsResetConfirm: '¿Está seguro de que desea restablecer?',
    settingsClearSearchHistory: 'Borrar historial de búsqueda',
    settingsClearSearchHistoryDesc: 'Eliminar todos los registros de búsqueda',
    settingsRateApp: 'Calificar aplicación',
    settingsSendFeedback: 'Enviar comentarios',
    settingsAppearance: 'Apariencia',
    settingsDataStorage: 'Datos y almacenamiento',
  },

  it: {
    // Italian mode: Italian speaker learning Turkmen
    home: 'Home',
    search: 'Cerca',
    favorites: 'Preferiti',
    settings: 'Impostazioni',
    additionalFeatures: 'Altre funzionalità',
    statistics: 'Statistiche',

    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: 'Tutti gli strumenti per imparare la lingua',
    selectCategory: 'Seleziona una categoria',
    recentlyStudied: 'Studiato di recente',
    study: 'Studiare',

    // Main Hub Modules
    phrasebookTitle: 'Frasario',
    phrasebookSubtitle: '305 frasi in 22 categorie',
    visualTranslatorTitle: 'Traduttore visivo',
    visualTranslatorSubtitle: 'Scansiona testo con la fotocamera',
    textTranslatorTitle: 'Traduttore di testo',
    textTranslatorSubtitle: 'Scrivi e traduci testo',
    voiceTranslatorTitle: 'Traduttore vocale',
    voiceTranslatorSubtitle: 'Parla e traduci in tempo reale',
    dictionaryTitle: 'Dizionario',
    dictionarySubtitle: 'In arrivo nella v2.0',
    aiAssistantsTitle: 'Assistenti IA',
    aiAssistantsSubtitle: 'Suggerimenti intelligenti e supporto',
    myFavoritesTitle: 'I miei preferiti',
    myFavoritesSubtitle: 'Elementi salvati',

    pronunciation: 'Pronuncia',
    addToFavorites: 'Aggiungi ai preferiti',
    inFavorites: 'Nei preferiti',
    share: 'Condividi',

    settingsTitle: '⚙️ Impostazioni',
    languageInterface: 'Lingua dell\'interfaccia',
    switchLanguage: 'Cambia lingua',
    audio: 'Audio',
    soundEffects: 'Effetti sonori',
    data: 'Dati',
    clearHistory: 'Cancella cronologia',
    offlineMode: 'Modalità offline',
    about: 'Informazioni sull\'app',
    feedback: 'Feedback',

    searchPlaceholder: 'Inserisci frase in qualsiasi lingua...',
    noResults: 'Nessun risultato trovato',
    searchHistory: 'Cronologia ricerche',

    cancel: 'Annulla',
    save: 'Salva',
    delete: 'Elimina',
    confirm: 'Conferma',
    loading: 'Caricamento...',
    error: 'Errore',
    success: 'Successo',

    vtTranslateWithAI: 'Traduci con AI',
    vtCameraSubtitle: 'Punta la fotocamera su qualsiasi testo per una traduzione istantanea',
    vtTakePhoto: 'Scatta foto',
    vtChooseGallery: 'Scegli dalla galleria',
    vtProcessing: 'Elaborazione immagine...',
    vtProcessingSubtext: 'Riconoscimento e traduzione del testo',
    vtOcrEngine: 'Motore OCR',
    vtOcrEngineDesc: 'Scegli come riconoscere il testo dalle immagini.',
    vtOcrSpaceNote: 'Gratuito, 25K richieste/mese',
    vtFeatures: 'Funzionalità',
    vtFeatureOcrTitle: 'Riconoscimento testo OCR',
    vtFeatureOcrDesc: 'Riconosce testo in 30+ lingue con alta precisione',
    vtFeatureAiTitle: 'Descrizione oggetti AI',
    vtFeatureAiDesc: 'Descrive oggetti quando il testo non viene trovato',
    vtFeatureSmartTitle: 'Traduzione intelligente',
    vtFeatureSmartDesc: 'Traduzione contestuale alimentata da AI',
    vtFeatureSaveTitle: 'Salva e condividi',
    vtFeatureSaveDesc: 'Salva le traduzioni nei preferiti e condividile',
    vtPermissionsText: 'Sono richieste autorizzazioni per fotocamera e galleria',
    vtGrantPermissions: 'Concedi autorizzazioni',
    vtRequestingPermissions: 'Richiesta autorizzazioni...',
    vtAutoFallback: 'Fallback automatico attivato se il motore selezionato fallisce',
    vtResult: 'Risultato',
    vtRecognizedText: 'Testo riconosciuto',
    vtLanguageLabel: 'Lingua: ',
    vtAiAnalysis: 'Analisi AI',
    vtTranslation: 'Traduzione',
    vtTargetLabel: 'Obiettivo: ',
    vtPlay: 'Riproduci',
    vtStop: 'Ferma',
    vtCopy: 'Copia',
    vtTranslateAnother: 'Traduci un altro',
    vtCopied: 'Copiato',
    vtCopiedMessage: 'Traduzione copiata negli appunti',

    // Text Translator
    ttHeaderTitle: 'Traduttore di testo',
    ttHeroTitle: 'Traduzione istantanea',
    ttHeroSubtitle: 'Digita qualsiasi testo e traduci tra oltre 100 lingue',
    ttSelectLanguage: 'Seleziona',
    ttPlaceholder: 'Inserisci il testo da tradurre...',
    ttClear: 'Cancella',
    ttTranslate: 'Traduci',
    ttTranslating: 'Traduzione in corso...',
    ttPlay: 'Riproduci',
    ttStop: 'Ferma',
    ttCopy: 'Copia',
    ttEmptyOutput: 'La traduzione apparirà qui',
    ttSourceLanguage: 'Lingua di origine',
    ttTargetLanguage: 'Lingua di destinazione',
    ttErrorTitle: 'Errore',
    ttErrorEmptyText: 'Inserisci il testo da tradurre',
    ttErrorTranslationFailed: 'Traduzione fallita. Riprova.',
    ttErrorNoInternet: 'Nessuna connessione Internet. Controlla la connessione e riprova.',
    ttErrorTextTooLong: 'Il testo è troppo lungo. Massimo 5000 caratteri.',
    ttCopiedTitle: '✅ Copiato',
    ttCopiedMessage: 'Traduzione copiata negli appunti',
    ttInfoTitle: 'Informazioni',
    ttInfoCannotSwap: 'Impossibile scambiare quando è selezionato il rilevamento automatico',

    // AI Assistants
    aiHomeTitle: 'Assistenti IA',
    aiHomeSubtitle: 'Scegli un assistente IA per aiutarti a imparare la lingua turkmena',
    aiInfoText: 'Gli assistenti IA utilizzano modelli linguistici avanzati per fornire aiuto personalizzato. Le risposte potrebbero richiedere alcuni secondi.',

    // AI Assistant Names
    aiContextualTipsName: 'Suggerimenti contestuali',
    aiConversationTrainerName: 'Allenatore di conversazione',
    aiGrammarHelperName: 'Assistente grammaticale',
    aiCulturalAdvisorName: 'Consulente culturale',
    aiGeneralAssistantName: 'Assistente generale',

    // AI Assistant Descriptions
    aiContextualTipsDesc: 'Ottieni suggerimenti intelligenti basati sul tuo contesto di apprendimento attuale',
    aiConversationTrainerDesc: 'Pratica conversazioni reali e migliora le tue capacità di parlare',
    aiGrammarHelperDesc: 'Ottieni aiuto immediato con le regole e le strutture grammaticali turkmene',
    aiCulturalAdvisorDesc: 'Scopri la cultura, le usanze e l\'etichetta turkmene',
    aiGeneralAssistantDesc: 'Chiedi qualsiasi cosa sull\'apprendimento della lingua turkmena',

    // Welcome Messages
    aiContextualTipsWelcome: 'Ciao! Sono qui per fornirti suggerimenti e idee utili per imparare il turkmeno. Chiedimi qualsiasi cosa!',
    aiConversationTrainerWelcome: 'Ciao! Pratichiamo alcune conversazioni in turkmeno. Ti aiuterò a migliorare le tue capacità di parlare!',
    aiGrammarHelperWelcome: 'Benvenuto! Sono il tuo assistente grammaticale. Chiedimi qualsiasi regola o struttura grammaticale turkmena.',
    aiCulturalAdvisorWelcome: 'Salam! Lascia che ti aiuti a capire la cultura, le usanze e le tradizioni turkmene.',
    aiGeneralAssistantWelcome: 'Ciao! Sono il tuo assistente IA. Posso aiutarti con traduzioni, frasi e comunicazione in diverse lingue.',

    // ChatScreen UI
    aiInputPlaceholder: 'Scrivi il tuo messaggio...',
    aiThinking: 'Sto pensando...',
    aiErrorMessage: 'Scusa, ho riscontrato un errore. Riprova.',
    aiClearHistory: 'Cancella cronologia',
    aiClearHistoryTitle: 'Cancella cronologia',
    aiClearHistoryMessage: 'Sei sicuro di voler cancellare tutti i messaggi?',
    aiSelectModel: 'Seleziona modello IA',
    aiSelectModelMessage: 'Scegli quale modello IA utilizzare',
    aiExportChat: 'Esporta chat',
    aiCopyAll: 'Copia tutto',
    aiResponseSettings: 'Impostazioni risposte',
    aiResponseSettingsMessage: 'Regola come risponde l\'IA',
    aiResponseLanguage: 'Lingua di risposta',
    aiResponseLanguageMessage: 'Scegli in quale lingua deve rispondere l\'IA',
    aiCreativeMode: 'Modalità creativa',
    aiBalancedMode: 'Modalità bilanciata',
    aiPreciseMode: 'Modalità precisa',

    // Voice Translator
    vtHeaderTitle: 'Traduttore Vocale',
    vtHeroTitle: 'Parla e Traduci',
    vtHeroSubtitle: 'Parla nella tua lingua e ottieni la traduzione istantanea',
    vtTapToSpeak: 'Tocca per parlare',
    vtListening: 'In ascolto...',
    vtRecognized: 'Riconosciuto',
    vtPlayOriginal: 'Riproduci originale',
    vtPlayTranslation: 'Riproduci traduzione',
    vtCopyTranslation: 'Copia traduzione',
    vtClear: 'Cancella',
    vtSwapLanguages: 'Scambia lingue',
    vtSelectSourceLanguage: 'Seleziona lingua di origine',
    vtSelectTargetLanguage: 'Seleziona lingua di destinazione',
    vtErrorNoPermission: 'Nessun permesso per il microfono. Concedi il permesso nelle impostazioni.',
    vtErrorNoInternet: 'Nessuna connessione internet. Controlla la connessione e riprova.',
    vtErrorRecognitionFailed: 'Riconoscimento vocale fallito. Riprova.',
    vtErrorTranslationFailed: 'Traduzione fallita. Riprova.',
    vtPermissionTitle: 'Permesso Microfono',
    vtPermissionMessage: 'L\'accesso al microfono è necessario per utilizzare questa funzione',
    vtGrantPermission: 'Concedi Permesso',
    vtComingSoon: 'Prossimamente',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: 'Traduttore vocale in arrivo!',
    voiceComingSoonDesc: 'Stiamo lavorando alla traduzione vocale in tempo reale. Presto potrai parlare e ottenere una traduzione istantanea!',
    voiceComingSoonFeature1: 'Riconoscimento vocale in tempo reale',
    voiceComingSoonFeature2: 'Traduzione istantanea',
    voiceComingSoonFeature3: 'Riproduzione audio della traduzione',
    voiceComingSoonButton: 'Torna alla home',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: 'Prossimamente!',
    visualComingSoonDesc: 'Stiamo lavorando al riconoscimento del testo dalla fotocamera. Presto potrai tradurre cartelli, menu e documenti!',
    visualComingSoonFeature1: 'Riconoscimento testo da fotocamera',
    visualComingSoonFeature2: 'Traduzione immagini con IA',
    visualComingSoonFeature3: 'Supporto galleria e fotocamera',

    // Coming Soon version badge
    comingSoonInVersion: 'Disponibile nella v{version}',

    // Onboarding - Navigation
    onboardingSkip: 'Salta',
    onboardingNext: 'Avanti',
    // Slide 1: Welcome
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: 'Traduzione turkmena — veloce e facile!',
    // Slide 2: Phrasebook
    onboardingPhrasebookTitle: '30 coppie di lingue',
    onboardingPhrasebookSubtitle: 'Frasario con audio, funziona offline',
    onboardingPhrasebookDemo: 'Ciao',
    onboardingPlayAudio: 'Riproduci',
    onboardingPlaying: 'Riproduzione...',
    onboardingFeatureAudio: 'Pronuncia turkmena',
    onboardingFeatureOffline: 'Funziona senza internet',
    // Slide 3: Translation
    onboardingTranslationTitle: 'Traduzione intelligente',
    onboardingTranslationSubtitle: 'Traduttore di testo e assistente IA',
    onboardingTextTranslator: 'Traduttore di testo',
    onboardingTranslate: 'Traduci',
    onboardingTryAgain: 'Riprova',
    onboardingVisualTranslator: 'Traduttore visivo',
    onboardingVoiceTranslator: 'Traduttore vocale',
    onboardingAIAssistant: 'Assistente IA',
    onboardingAIPowered: 'Alimentato da IA',
    onboardingComingSoon: 'Prossimamente',
    // Slide 4: Ready
    onboardingReadyTitle: 'Tutto pronto!',
    onboardingReadySubtitle: 'Inizia a imparare il turkmeno ora',
    onboardingGetStarted: 'Inizia',
    // Slide 4: Ready - Feature Tags
    onboardingTagPhrasebook: '📖 Frasario',
    onboardingTagAudio: '🔊 Audio',
    onboardingTagOffline: '✈️ Offline',
    onboardingTagTranslator: '📝 Traduttore',
    onboardingTagAI: '🤖 Assistente IA',
    onboardingTagVisual: '📷 Visivo',
    onboardingTagVoice: '🎤 Vocale',

    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: 'Voci installate',
    settingsInstalledVoicesDesc: 'Visualizza tutte le voci TTS disponibili',
    settingsLoading: 'Caricamento impostazioni...',
    settingsDarkMode: 'Modalità scura',
    settingsDarkModeDesc: 'Passa al tema scuro',
    settingsSpeechRate: 'Velocità del parlato',
    settingsSpeechRateDesc: 'Regola la velocità di pronuncia',
    settingsResetAll: 'Ripristina tutte le impostazioni',
    settingsResetAllDesc: 'Ripristina impostazioni predefinite',
    settingsResetConfirm: 'Sei sicuro di voler ripristinare?',
    settingsClearSearchHistory: 'Cancella cronologia ricerche',
    settingsClearSearchHistoryDesc: 'Elimina tutti i record di ricerca',
    settingsRateApp: 'Valuta app',
    settingsSendFeedback: 'Invia feedback',
    settingsAppearance: 'Aspetto',
    settingsDataStorage: 'Dati e archiviazione',
  },

  pt: {
    // Portuguese mode: Portuguese speaker learning Turkmen
    home: 'Início',
    search: 'Pesquisar',
    favorites: 'Favoritos',
    settings: 'Configurações',
    additionalFeatures: 'Mais recursos',
    statistics: 'Estatísticas',

    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: 'Todas as ferramentas para aprender idiomas',
    selectCategory: 'Selecionar categoria',
    recentlyStudied: 'Estudado recentemente',
    study: 'Estudar',

    // Main Hub Modules
    phrasebookTitle: 'Guia de conversação',
    phrasebookSubtitle: '305 frases em 22 categorias',
    visualTranslatorTitle: 'Tradutor visual',
    visualTranslatorSubtitle: 'Digitalizar texto com câmera',
    textTranslatorTitle: 'Tradutor de texto',
    textTranslatorSubtitle: 'Digitar e traduzir texto',
    voiceTranslatorTitle: 'Tradutor de voz',
    voiceTranslatorSubtitle: 'Fale e traduza em tempo real',
    dictionaryTitle: 'Dicionário',
    dictionarySubtitle: 'Em breve na v2.0',
    aiAssistantsTitle: 'Assistentes IA',
    aiAssistantsSubtitle: 'Dicas inteligentes e suporte',
    myFavoritesTitle: 'Meus favoritos',
    myFavoritesSubtitle: 'Itens salvos',

    pronunciation: 'Pronúncia',
    addToFavorites: 'Adicionar aos favoritos',
    inFavorites: 'Nos favoritos',
    share: 'Compartilhar',

    settingsTitle: '⚙️ Configurações',
    languageInterface: 'Idioma da interface',
    switchLanguage: 'Mudar idioma',
    audio: 'Áudio',
    soundEffects: 'Efeitos sonoros',
    data: 'Dados',
    clearHistory: 'Limpar histórico',
    offlineMode: 'Modo offline',
    about: 'Sobre o aplicativo',
    feedback: 'Feedback',

    searchPlaceholder: 'Digite frase em qualquer idioma...',
    noResults: 'Nenhum resultado encontrado',
    searchHistory: 'Histórico de pesquisa',

    cancel: 'Cancelar',
    save: 'Salvar',
    delete: 'Excluir',
    confirm: 'Confirmar',
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',

    vtTranslateWithAI: 'Traduzir com IA',
    vtCameraSubtitle: 'Aponte sua câmera para qualquer texto e obtenha tradução instantânea',
    vtTakePhoto: 'Tirar foto',
    vtChooseGallery: 'Escolher da galeria',
    vtProcessing: 'Processando imagem...',
    vtProcessingSubtext: 'Reconhecendo e traduzindo texto',
    vtOcrEngine: 'Motor OCR',
    vtOcrEngineDesc: 'Escolha como reconhecer texto de imagens.',
    vtOcrSpaceNote: 'Grátis, 25K pedidos/mês',
    vtFeatures: 'Recursos',
    vtFeatureOcrTitle: 'Reconhecimento de texto OCR',
    vtFeatureOcrDesc: 'Reconhece texto em 30+ idiomas com alta precisão',
    vtFeatureAiTitle: 'Descrição de objetos por IA',
    vtFeatureAiDesc: 'Descreve objetos quando nenhum texto é encontrado',
    vtFeatureSmartTitle: 'Tradução inteligente',
    vtFeatureSmartDesc: 'Tradução contextual alimentada por IA',
    vtFeatureSaveTitle: 'Salvar e compartilhar',
    vtFeatureSaveDesc: 'Salve traduções nos favoritos e compartilhe',
    vtPermissionsText: 'São necessárias permissões de câmera e galeria de fotos',
    vtGrantPermissions: 'Conceder permissões',
    vtRequestingPermissions: 'Solicitando permissões...',
    vtAutoFallback: 'Fallback automático ativado se o motor selecionado falhar',
    vtResult: 'Resultado',
    vtRecognizedText: 'Texto reconhecido',
    vtLanguageLabel: 'Idioma: ',
    vtAiAnalysis: 'Análise IA',
    vtTranslation: 'Tradução',
    vtTargetLabel: 'Alvo: ',
    vtPlay: 'Reproduzir',
    vtStop: 'Parar',
    vtCopy: 'Copiar',
    vtTranslateAnother: 'Traduzir outro',
    vtCopied: 'Copiado',
    vtCopiedMessage: 'Tradução copiada para a área de transferência',

    // Text Translator
    ttHeaderTitle: 'Tradutor de texto',
    ttHeroTitle: 'Tradução instantânea',
    ttHeroSubtitle: 'Digite qualquer texto e traduza entre mais de 100 idiomas',
    ttSelectLanguage: 'Selecionar',
    ttPlaceholder: 'Digite o texto para traduzir...',
    ttClear: 'Limpar',
    ttTranslate: 'Traduzir',
    ttTranslating: 'Traduzindo...',
    ttPlay: 'Reproduzir',
    ttStop: 'Parar',
    ttCopy: 'Copiar',
    ttEmptyOutput: 'A tradução aparecerá aqui',
    ttSourceLanguage: 'Idioma de origem',
    ttTargetLanguage: 'Idioma de destino',
    ttErrorTitle: 'Erro',
    ttErrorEmptyText: 'Por favor, digite o texto para traduzir',
    ttErrorTranslationFailed: 'Falha na tradução. Por favor, tente novamente.',
    ttErrorNoInternet: 'Sem conexão à Internet. Por favor, verifique sua conexão e tente novamente.',
    ttErrorTextTooLong: 'O texto é muito longo. Máximo de 5000 caracteres.',
    ttCopiedTitle: '✅ Copiado',
    ttCopiedMessage: 'Tradução copiada para a área de transferência',
    ttInfoTitle: 'Informação',
    ttInfoCannotSwap: 'Não é possível trocar quando a detecção automática está selecionada',

    // AI Assistants
    aiHomeTitle: 'Assistentes IA',
    aiHomeSubtitle: 'Escolha um assistente IA para ajudá-lo a aprender a língua turcomana',
    aiInfoText: 'Os assistentes IA usam modelos de linguagem avançados para fornecer ajuda personalizada. As respostas podem levar alguns segundos.',

    // AI Assistant Names
    aiContextualTipsName: 'Dicas contextuais',
    aiConversationTrainerName: 'Treinador de conversação',
    aiGrammarHelperName: 'Assistente de gramática',
    aiCulturalAdvisorName: 'Consultor cultural',
    aiGeneralAssistantName: 'Assistente geral',

    // AI Assistant Descriptions
    aiContextualTipsDesc: 'Obtenha dicas inteligentes baseadas no seu contexto de aprendizagem atual',
    aiConversationTrainerDesc: 'Pratique conversas reais e melhore suas habilidades de fala',
    aiGrammarHelperDesc: 'Obtenha ajuda instantânea com regras e estruturas gramaticais do turcomano',
    aiCulturalAdvisorDesc: 'Aprenda sobre a cultura, costumes e etiqueta turcomanos',
    aiGeneralAssistantDesc: 'Pergunte qualquer coisa sobre aprender a língua turcomana',

    // Welcome Messages
    aiContextualTipsWelcome: 'Olá! Estou aqui para fornecer dicas e insights úteis para aprender turcomano. Pergunte-me qualquer coisa!',
    aiConversationTrainerWelcome: 'Oi! Vamos praticar algumas conversas em turcomano. Vou ajudá-lo a melhorar suas habilidades de fala!',
    aiGrammarHelperWelcome: 'Bem-vindo! Sou seu assistente de gramática. Pergunte-me sobre qualquer regra ou estrutura gramatical do turcomano.',
    aiCulturalAdvisorWelcome: 'Salam! Deixe-me ajudá-lo a entender a cultura, costumes e tradições turcomanas.',
    aiGeneralAssistantWelcome: 'Olá! Sou seu assistente de IA. Posso ajudar com traduções, frases e comunicação em diferentes idiomas.',

    // ChatScreen UI
    aiInputPlaceholder: 'Digite sua mensagem...',
    aiThinking: 'Pensando...',
    aiErrorMessage: 'Desculpe, encontrei um erro. Por favor, tente novamente.',
    aiClearHistory: 'Limpar histórico',
    aiClearHistoryTitle: 'Limpar Histórico',
    aiClearHistoryMessage: 'Tem certeza de que deseja limpar todas as mensagens?',
    aiSelectModel: 'Selecionar modelo de IA',
    aiSelectModelMessage: 'Escolha o modelo de IA para usar',
    aiExportChat: 'Exportar conversa',
    aiCopyAll: 'Copiar tudo',
    aiResponseSettings: 'Configurações de resposta',
    aiResponseSettingsMessage: 'Configure como a IA deve responder',
    aiResponseLanguage: 'Idioma da resposta',
    aiResponseLanguageMessage: 'Em que idioma a IA deve responder',
    aiCreativeMode: 'Modo criativo',
    aiBalancedMode: 'Modo equilibrado',
    aiPreciseMode: 'Modo preciso',
    // Voice Translator
    vtHeaderTitle: 'Tradutor de Voz',
    vtHeroTitle: 'Fale e Traduza',
    vtHeroSubtitle: 'Fale no seu idioma e obtenha tradução instantânea',
    vtTapToSpeak: 'Toque para falar',
    vtListening: 'Ouvindo...',
    vtRecognized: 'Reconhecido',
    vtPlayOriginal: 'Reproduzir original',
    vtPlayTranslation: 'Reproduzir tradução',
    vtCopyTranslation: 'Copiar tradução',
    vtClear: 'Limpar',
    vtSwapLanguages: 'Trocar idiomas',
    vtSelectSourceLanguage: 'Selecionar idioma de origem',
    vtSelectTargetLanguage: 'Selecionar idioma de destino',
    vtErrorNoPermission: 'Sem permissão do microfone. Conceda permissão nas configurações.',
    vtErrorNoInternet: 'Sem conexão com a internet. Verifique sua conexão e tente novamente.',
    vtErrorRecognitionFailed: 'Reconhecimento de voz falhou. Tente novamente.',
    vtErrorTranslationFailed: 'Tradução falhou. Tente novamente.',
    vtPermissionTitle: 'Permissão do Microfone',
    vtPermissionMessage: 'O acesso ao microfone é necessário para usar este recurso',
    vtGrantPermission: 'Conceder Permissão',
    vtComingSoon: 'Em breve',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: 'Tradutor de voz em breve!',
    voiceComingSoonDesc: 'Estamos trabalhando na tradução de voz em tempo real. Em breve você poderá falar e obter tradução instantânea!',
    voiceComingSoonFeature1: 'Reconhecimento de voz em tempo real',
    voiceComingSoonFeature2: 'Tradução instantânea',
    voiceComingSoonFeature3: 'Reprodução de áudio da tradução',
    voiceComingSoonButton: 'Voltar ao início',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: 'Em breve!',
    visualComingSoonDesc: 'Estamos trabalhando no reconhecimento de texto por câmera. Em breve você poderá traduzir placas, menus e documentos!',
    visualComingSoonFeature1: 'Reconhecimento de texto por câmera',
    visualComingSoonFeature2: 'Tradução de imagens com IA',
    visualComingSoonFeature3: 'Suporte a galeria e câmera',

    // Coming Soon version badge
    comingSoonInVersion: 'Disponível na v{version}',

    // Onboarding - Navigation
    onboardingSkip: 'Pular',
    onboardingNext: 'Próximo',
    // Slide 1: Welcome
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: 'Tradução turcomana — rápida e fácil!',
    // Slide 2: Phrasebook
    onboardingPhrasebookTitle: '30 pares de idiomas',
    onboardingPhrasebookSubtitle: 'Guia de conversação com áudio, funciona offline',
    onboardingPhrasebookDemo: 'Olá',
    onboardingPlayAudio: 'Reproduzir',
    onboardingPlaying: 'Reproduzindo...',
    onboardingFeatureAudio: 'Pronúncia turcomana',
    onboardingFeatureOffline: 'Funciona sem internet',
    // Slide 3: Translation
    onboardingTranslationTitle: 'Tradução inteligente',
    onboardingTranslationSubtitle: 'Tradutor de texto e assistente IA',
    onboardingTextTranslator: 'Tradutor de texto',
    onboardingTranslate: 'Traduzir',
    onboardingTryAgain: 'Tentar novamente',
    onboardingVisualTranslator: 'Tradutor visual',
    onboardingVoiceTranslator: 'Tradutor de voz',
    onboardingAIAssistant: 'Assistente IA',
    onboardingAIPowered: 'Alimentado por IA',
    onboardingComingSoon: 'Em breve',
    // Slide 4: Ready
    onboardingReadyTitle: 'Tudo pronto!',
    onboardingReadySubtitle: 'Comece a aprender turcomano agora',
    onboardingGetStarted: 'Começar',
    // Slide 4: Ready - Feature Tags
    onboardingTagPhrasebook: '📖 Guia',
    onboardingTagAudio: '🔊 Áudio',
    onboardingTagOffline: '✈️ Offline',
    onboardingTagTranslator: '📝 Tradutor',
    onboardingTagAI: '🤖 Assistente IA',
    onboardingTagVisual: '📷 Visual',
    onboardingTagVoice: '🎤 Voz',

    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: 'Vozes instaladas',
    settingsInstalledVoicesDesc: 'Ver todas as vozes TTS disponíveis',
    settingsLoading: 'Carregando configurações...',
    settingsDarkMode: 'Modo escuro',
    settingsDarkModeDesc: 'Mudar para tema escuro',
    settingsSpeechRate: 'Velocidade da fala',
    settingsSpeechRateDesc: 'Ajustar velocidade de pronúncia',
    settingsResetAll: 'Redefinir todas as configurações',
    settingsResetAllDesc: 'Restaurar configurações padrão',
    settingsResetConfirm: 'Tem certeza que deseja redefinir?',
    settingsClearSearchHistory: 'Limpar histórico de pesquisa',
    settingsClearSearchHistoryDesc: 'Excluir todos os registros de pesquisa',
    settingsRateApp: 'Avaliar aplicativo',
    settingsSendFeedback: 'Enviar feedback',
    settingsAppearance: 'Aparência',
    settingsDataStorage: 'Dados e armazenamento',
  },

  nl: {
    // Dutch mode: Dutch speaker learning Turkmen
    home: 'Home',
    search: 'Zoeken',
    favorites: 'Favorieten',
    settings: 'Instellingen',
    additionalFeatures: 'Meer functies',
    statistics: 'Statistieken',

    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: 'Alle tools voor het leren van talen',
    selectCategory: 'Selecteer een categorie',
    recentlyStudied: 'Recent bestudeerd',
    study: 'Studeren',

    // Main Hub Modules
    phrasebookTitle: 'Taalgids',
    phrasebookSubtitle: '305 zinnen in 22 categorieën',
    visualTranslatorTitle: 'Visuele vertaler',
    visualTranslatorSubtitle: 'Scan tekst met camera',
    textTranslatorTitle: 'Tekstvertaler',
    textTranslatorSubtitle: 'Typ en vertaal tekst',
    voiceTranslatorTitle: 'Stemvertaler',
    voiceTranslatorSubtitle: 'Spreek en vertaal in realtime',
    dictionaryTitle: 'Woordenboek',
    dictionarySubtitle: 'Komt in v2.0',
    aiAssistantsTitle: 'AI-assistenten',
    aiAssistantsSubtitle: 'Slimme tips en ondersteuning',
    myFavoritesTitle: 'Mijn favorieten',
    myFavoritesSubtitle: 'Opgeslagen items',

    pronunciation: 'Uitspraak',
    addToFavorites: 'Toevoegen aan favorieten',
    inFavorites: 'In favorieten',
    share: 'Delen',

    settingsTitle: '⚙️ Instellingen',
    languageInterface: 'Interface taal',
    switchLanguage: 'Wissel van taal',
    audio: 'Audio',
    soundEffects: 'Geluidseffecten',
    data: 'Gegevens',
    clearHistory: 'Geschiedenis wissen',
    offlineMode: 'Offline modus',
    about: 'Over de app',
    feedback: 'Feedback',

    searchPlaceholder: 'Voer zin in elke taal in...',
    noResults: 'Geen resultaten gevonden',
    searchHistory: 'Zoekgeschiedenis',

    cancel: 'Annuleren',
    save: 'Opslaan',
    delete: 'Verwijderen',
    confirm: 'Bevestigen',
    loading: 'Laden...',
    error: 'Fout',
    success: 'Succes',

    vtTranslateWithAI: 'Vertaal met AI',
    vtCameraSubtitle: 'Richt je camera op tekst voor directe vertaling',
    vtTakePhoto: 'Foto maken',
    vtChooseGallery: 'Kies uit galerij',
    vtProcessing: 'Afbeelding verwerken...',
    vtProcessingSubtext: 'Tekst herkennen en vertalen',
    vtOcrEngine: 'OCR-engine',
    vtOcrEngineDesc: 'Kies hoe tekst van afbeeldingen te herkennen.',
    vtOcrSpaceNote: 'Gratis, 25K verzoeken/maand',
    vtFeatures: 'Functies',
    vtFeatureOcrTitle: 'OCR-tekstherkenning',
    vtFeatureOcrDesc: 'Herkent tekst in 30+ talen met hoge nauwkeurigheid',
    vtFeatureAiTitle: 'AI-objectbeschrijving',
    vtFeatureAiDesc: 'Beschrijft objecten wanneer geen tekst wordt gevonden',
    vtFeatureSmartTitle: 'Slimme vertaling',
    vtFeatureSmartDesc: 'Contextbewuste vertaling aangedreven door AI',
    vtFeatureSaveTitle: 'Opslaan & delen',
    vtFeatureSaveDesc: 'Vertalingen opslaan in favorieten en delen',
    vtPermissionsText: 'Camera- en fotogalerijrechten zijn vereist',
    vtGrantPermissions: 'Rechten verlenen',
    vtRequestingPermissions: 'Rechten aanvragen...',
    vtAutoFallback: 'Automatische terugval ingeschakeld als geselecteerde engine faalt',
    vtResult: 'Resultaat',
    vtRecognizedText: 'Herkende tekst',
    vtLanguageLabel: 'Taal: ',
    vtAiAnalysis: 'AI-analyse',
    vtTranslation: 'Vertaling',
    vtTargetLabel: 'Doel: ',
    vtPlay: 'Afspelen',
    vtStop: 'Stop',
    vtCopy: 'Kopiëren',
    vtTranslateAnother: 'Nog een vertalen',
    vtCopied: 'Gekopieerd',
    vtCopiedMessage: 'Vertaling naar klembord gekopieerd',

    // Text Translator
    ttHeaderTitle: 'Tekstvertaler',
    ttHeroTitle: 'Directe vertaling',
    ttHeroSubtitle: 'Typ elke tekst en vertaal tussen meer dan 100 talen',
    ttSelectLanguage: 'Selecteren',
    ttPlaceholder: 'Voer tekst in om te vertalen...',
    ttClear: 'Wissen',
    ttTranslate: 'Vertalen',
    ttTranslating: 'Bezig met vertalen...',
    ttPlay: 'Afspelen',
    ttStop: 'Stop',
    ttCopy: 'Kopiëren',
    ttEmptyOutput: 'De vertaling verschijnt hier',
    ttSourceLanguage: 'Brontaal',
    ttTargetLanguage: 'Doeltaal',
    ttErrorTitle: 'Fout',
    ttErrorEmptyText: 'Voer alstublieft tekst in om te vertalen',
    ttErrorTranslationFailed: 'Vertaling mislukt. Probeer het opnieuw.',
    ttErrorNoInternet: 'Geen internetverbinding. Controleer uw verbinding en probeer het opnieuw.',
    ttErrorTextTooLong: 'De tekst is te lang. Maximum 5000 tekens.',
    ttCopiedTitle: '✅ Gekopieerd',
    ttCopiedMessage: 'Vertaling naar klembord gekopieerd',
    ttInfoTitle: 'Info',
    ttInfoCannotSwap: 'Kan niet wisselen als automatische detectie is geselecteerd',

    // AI Assistants
    aiHomeTitle: 'AI-assistenten',
    aiHomeSubtitle: 'Kies een AI-assistent om je te helpen de Turkmeense taal te leren',
    aiInfoText: 'AI-assistenten gebruiken geavanceerde taalmodellen om gepersonaliseerde hulp te bieden. Reacties kunnen een paar seconden duren.',

    // AI Assistant Names
    aiContextualTipsName: 'Contextuele tips',
    aiConversationTrainerName: 'Gesprekscoach',
    aiGrammarHelperName: 'Grammatica-assistent',
    aiCulturalAdvisorName: 'Culturele adviseur',
    aiGeneralAssistantName: 'Algemene assistent',

    // AI Assistant Descriptions
    aiContextualTipsDesc: 'Krijg slimme tips op basis van je huidige leercontext',
    aiConversationTrainerDesc: 'Oefen echte gesprekken en verbeter je spreekvaardigheid',
    aiGrammarHelperDesc: 'Krijg directe hulp bij Turkmeense grammaticaregels en -structuren',
    aiCulturalAdvisorDesc: 'Leer over Turkmeense cultuur, gebruiken en etiquette',
    aiGeneralAssistantDesc: 'Stel elke vraag over het leren van de Turkmeense taal',

    // Welcome Messages
    aiContextualTipsWelcome: 'Hallo! Ik ben hier om je nuttige tips en inzichten te geven voor het leren van Turkmeen. Vraag me alles!',
    aiConversationTrainerWelcome: 'Hoi! Laten we wat gesprekken in het Turkmeen oefenen. Ik help je je spreekvaardigheid te verbeteren!',
    aiGrammarHelperWelcome: 'Welkom! Ik ben je grammatica-assistent. Vraag me naar Turkmeense grammaticaregels of -structuren.',
    aiCulturalAdvisorWelcome: 'Salam! Laat me je helpen de Turkmeense cultuur, gebruiken en tradities te begrijpen.',
    aiGeneralAssistantWelcome: 'Hallo! Ik ben je AI-assistent. Ik kan helpen met vertalingen, zinnen en communicatie in verschillende talen.',

    // ChatScreen UI
    aiInputPlaceholder: 'Typ je bericht...',
    aiThinking: 'Denken...',
    aiErrorMessage: 'Sorry, ik ben een fout tegengekomen. Probeer het opnieuw.',
    aiClearHistory: 'Geschiedenis wissen',
    aiClearHistoryTitle: 'Geschiedenis Wissen',
    aiClearHistoryMessage: 'Weet je zeker dat je alle berichten wilt wissen?',
    aiSelectModel: 'AI-model selecteren',
    aiSelectModelMessage: 'Kies het AI-model om te gebruiken',
    aiExportChat: 'Chat exporteren',
    aiCopyAll: 'Alles kopiëren',
    aiResponseSettings: 'Antwoordinstellingen',
    aiResponseSettingsMessage: 'Configureer hoe de AI moet antwoorden',
    aiResponseLanguage: 'Antwoordtaal',
    aiResponseLanguageMessage: 'In welke taal moet de AI antwoorden',
    aiCreativeMode: 'Creatieve modus',
    aiBalancedMode: 'Gebalanceerde modus',
    aiPreciseMode: 'Precieze modus',
    // Voice Translator
    vtHeaderTitle: 'Spraakvertaler',
    vtHeroTitle: 'Spreek en vertaal',
    vtHeroSubtitle: 'Spreek in uw taal en krijg directe vertaling',
    vtTapToSpeak: 'Tik om te spreken',
    vtListening: 'Luisteren...',
    vtRecognized: 'Herkend',
    vtPlayOriginal: 'Origineel afspelen',
    vtPlayTranslation: 'Vertaling afspelen',
    vtCopyTranslation: 'Vertaling kopiëren',
    vtClear: 'Wissen',
    vtSwapLanguages: 'Talen wisselen',
    vtSelectSourceLanguage: 'Selecteer brontaal',
    vtSelectTargetLanguage: 'Selecteer doeltaal',
    vtErrorNoPermission: 'Geen microfoontoestemming. Geef toestemming in de instellingen.',
    vtErrorNoInternet: 'Geen internetverbinding. Controleer uw verbinding en probeer het opnieuw.',
    vtErrorRecognitionFailed: 'Spraakherkenning mislukt. Probeer het opnieuw.',
    vtErrorTranslationFailed: 'Vertaling mislukt. Probeer het opnieuw.',
    vtPermissionTitle: 'Microfoontoestemming',
    vtPermissionMessage: 'Microfoontoegang is vereist om deze functie te gebruiken',
    vtGrantPermission: 'Toestemming verlenen',
    vtComingSoon: 'Binnenkort',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: 'Spraakvertaler komt eraan!',
    voiceComingSoonDesc: 'We werken aan realtime spraakvertaling. Binnenkort kunt u spreken en directe vertalingen krijgen!',
    voiceComingSoonFeature1: 'Realtime spraakherkenning',
    voiceComingSoonFeature2: 'Directe vertaling',
    voiceComingSoonFeature3: 'Audio-weergave van vertaling',
    voiceComingSoonButton: 'Terug naar start',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: 'Binnenkort!',
    visualComingSoonDesc: 'We werken aan cameratekstherkenning. Binnenkort kunt u borden, menu\'s en documenten vertalen!',
    visualComingSoonFeature1: 'Cameratekstherkenning',
    visualComingSoonFeature2: 'AI tekstherkenning',
    visualComingSoonFeature3: 'Galerij- en camera-ondersteuning',

    // Coming Soon version badge
    comingSoonInVersion: 'Beschikbaar in v{version}',

    // Onboarding - Navigation
    onboardingSkip: 'Overslaan',
    onboardingNext: 'Volgende',
    // Slide 1: Welcome
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: 'Turkmeense vertaling — snel en gemakkelijk!',
    // Slide 2: Phrasebook
    onboardingPhrasebookTitle: '30 taalparen',
    onboardingPhrasebookSubtitle: 'Taalgids met audio, werkt offline',
    onboardingPhrasebookDemo: 'Hallo',
    onboardingPlayAudio: 'Afspelen',
    onboardingPlaying: 'Afspelen...',
    onboardingFeatureAudio: 'Turkmeense uitspraak',
    onboardingFeatureOffline: 'Werkt zonder internet',
    // Slide 3: Translation
    onboardingTranslationTitle: 'Slimme vertaling',
    onboardingTranslationSubtitle: 'Tekstvertaler en AI-assistent',
    onboardingTextTranslator: 'Tekstvertaler',
    onboardingTranslate: 'Vertalen',
    onboardingTryAgain: 'Opnieuw proberen',
    onboardingVisualTranslator: 'Visuele vertaler',
    onboardingVoiceTranslator: 'Spraakvertaler',
    onboardingAIAssistant: 'AI-assistent',
    onboardingAIPowered: 'AI-aangedreven',
    onboardingComingSoon: 'Binnenkort',
    // Slide 4: Ready
    onboardingReadyTitle: 'Alles klaar!',
    onboardingReadySubtitle: 'Begin nu met Turkmeen leren',
    onboardingGetStarted: 'Aan de slag',
    // Slide 4: Ready - Feature Tags
    onboardingTagPhrasebook: '📖 Taalgids',
    onboardingTagAudio: '🔊 Audio',
    onboardingTagOffline: '✈️ Offline',
    onboardingTagTranslator: '📝 Vertaler',
    onboardingTagAI: '🤖 AI-assistent',
    onboardingTagVisual: '📷 Visueel',
    onboardingTagVoice: '🎤 Spraak',

    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: 'Geïnstalleerde stemmen',
    settingsInstalledVoicesDesc: 'Bekijk alle beschikbare TTS-stemmen',
    settingsLoading: 'Instellingen laden...',
    settingsDarkMode: 'Donkere modus',
    settingsDarkModeDesc: 'Schakel naar donker thema',
    settingsSpeechRate: 'Spreeksnelheid',
    settingsSpeechRateDesc: 'Pas uitspraaksnelheid aan',
    settingsResetAll: 'Alle instellingen resetten',
    settingsResetAllDesc: 'Standaardinstellingen herstellen',
    settingsResetConfirm: 'Weet u zeker dat u wilt resetten?',
    settingsClearSearchHistory: 'Zoekgeschiedenis wissen',
    settingsClearSearchHistoryDesc: 'Alle zoekrecords verwijderen',
    settingsRateApp: 'App beoordelen',
    settingsSendFeedback: 'Feedback verzenden',
    settingsAppearance: 'Uiterlijk',
    settingsDataStorage: 'Gegevens en opslag',
  },

  pl: {
    // Polish mode: Polish speaker learning Turkmen
    home: 'Strona główna',
    search: 'Szukaj',
    favorites: 'Ulubione',
    settings: 'Ustawienia',
    additionalFeatures: 'Więcej funkcji',
    statistics: 'Statystyki',

    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: 'Wszystkie narzędzia do nauki języka',
    selectCategory: 'Wybierz kategorię',
    recentlyStudied: 'Ostatnio studiowane',
    study: 'Studiować',

    // Main Hub Modules
    phrasebookTitle: 'Rozmówki',
    phrasebookSubtitle: '305 zwrotów w 22 kategoriach',
    visualTranslatorTitle: 'Tłumacz wizualny',
    visualTranslatorSubtitle: 'Skanuj tekst aparatem',
    textTranslatorTitle: 'Tłumacz tekstu',
    textTranslatorSubtitle: 'Wpisz i przetłumacz tekst',
    voiceTranslatorTitle: 'Tłumacz głosowy',
    voiceTranslatorSubtitle: 'Mów i tłumacz w czasie rzeczywistym',
    dictionaryTitle: 'Słownik',
    dictionarySubtitle: 'Wkrótce w v2.0',
    aiAssistantsTitle: 'Asystenci AI',
    aiAssistantsSubtitle: 'Inteligentne wskazówki i wsparcie',
    myFavoritesTitle: 'Moje ulubione',
    myFavoritesSubtitle: 'Zapisane elementy',

    pronunciation: 'Wymowa',
    addToFavorites: 'Dodaj do ulubionych',
    inFavorites: 'W ulubionych',
    share: 'Udostępnij',

    settingsTitle: '⚙️ Ustawienia',
    languageInterface: 'Język interfejsu',
    switchLanguage: 'Zmień język',
    audio: 'Audio',
    soundEffects: 'Efekty dźwiękowe',
    data: 'Dane',
    clearHistory: 'Wyczyść historię',
    offlineMode: 'Tryb offline',
    about: 'O aplikacji',
    feedback: 'Opinie',

    searchPlaceholder: 'Wprowadź frazę w dowolnym języku...',
    noResults: 'Nie znaleziono wyników',
    searchHistory: 'Historia wyszukiwania',

    cancel: 'Anuluj',
    save: 'Zapisz',
    delete: 'Usuń',
    confirm: 'Potwierdź',
    loading: 'Ładowanie...',
    error: 'Błąd',
    success: 'Sukces',

    vtTranslateWithAI: 'Tłumacz z AI',
    vtCameraSubtitle: 'Skieruj kamerę na tekst, aby uzyskać natychmiastowe tłumaczenie',
    vtTakePhoto: 'Zrób zdjęcie',
    vtChooseGallery: 'Wybierz z galerii',
    vtProcessing: 'Przetwarzanie obrazu...',
    vtProcessingSubtext: 'Rozpoznawanie i tłumaczenie tekstu',
    vtOcrEngine: 'Silnik OCR',
    vtOcrEngineDesc: 'Wybierz sposób rozpoznawania tekstu z obrazów.',
    vtOcrSpaceNote: 'Bezpłatnie, 25K żądań/miesiąc',
    vtFeatures: 'Funkcje',
    vtFeatureOcrTitle: 'Rozpoznawanie tekstu OCR',
    vtFeatureOcrDesc: 'Rozpoznaje tekst w 30+ językach z wysoką dokładnością',
    vtFeatureAiTitle: 'Opis obiektów AI',
    vtFeatureAiDesc: 'Opisuje obiekty, gdy nie znaleziono tekstu',
    vtFeatureSmartTitle: 'Inteligentne tłumaczenie',
    vtFeatureSmartDesc: 'Tłumaczenie kontekstowe wspomagane przez AI',
    vtFeatureSaveTitle: 'Zapisz i udostępnij',
    vtFeatureSaveDesc: 'Zapisuj tłumaczenia w ulubionych i udostępniaj',
    vtPermissionsText: 'Wymagane są uprawnienia do kamery i galerii zdjęć',
    vtGrantPermissions: 'Udziel uprawnień',
    vtRequestingPermissions: 'Żądanie uprawnień...',
    vtAutoFallback: 'Automatyczne przełączanie włączone w przypadku awarii wybranego silnika',
    vtResult: 'Wynik',
    vtRecognizedText: 'Rozpoznany tekst',
    vtLanguageLabel: 'Język: ',
    vtAiAnalysis: 'Analiza AI',
    vtTranslation: 'Tłumaczenie',
    vtTargetLabel: 'Cel: ',
    vtPlay: 'Odtwórz',
    vtStop: 'Zatrzymaj',
    vtCopy: 'Kopiuj',
    vtTranslateAnother: 'Przetłumacz kolejne',
    vtCopied: 'Skopiowano',
    vtCopiedMessage: 'Tłumaczenie skopiowane do schowka',

    // Text Translator
    ttHeaderTitle: 'Tłumacz tekstu',
    ttHeroTitle: 'Natychmiastowe tłumaczenie',
    ttHeroSubtitle: 'Wpisz dowolny tekst i tłumacz między ponad 100 językami',
    ttSelectLanguage: 'Wybierz',
    ttPlaceholder: 'Wprowadź tekst do przetłumaczenia...',
    ttClear: 'Wyczyść',
    ttTranslate: 'Przetłumacz',
    ttTranslating: 'Tłumaczenie...',
    ttPlay: 'Odtwórz',
    ttStop: 'Zatrzymaj',
    ttCopy: 'Kopiuj',
    ttEmptyOutput: 'Tłumaczenie pojawi się tutaj',
    ttSourceLanguage: 'Język źródłowy',
    ttTargetLanguage: 'Język docelowy',
    ttErrorTitle: 'Błąd',
    ttErrorEmptyText: 'Proszę wprowadzić tekst do przetłumaczenia',
    ttErrorTranslationFailed: 'Tłumaczenie nie powiodło się. Spróbuj ponownie.',
    ttErrorNoInternet: 'Brak połączenia z Internetem. Sprawdź połączenie i spróbuj ponownie.',
    ttErrorTextTooLong: 'Tekst jest za długi. Maksymalnie 5000 znaków.',
    ttCopiedTitle: '✅ Skopiowano',
    ttCopiedMessage: 'Tłumaczenie skopiowane do schowka',
    ttInfoTitle: 'Informacja',
    ttInfoCannotSwap: 'Nie można zamienić, gdy wybrano automatyczne wykrywanie',

    // AI Assistants
    aiHomeTitle: 'Asystenci AI',
    aiHomeSubtitle: 'Wybierz asystenta AI, który pomoże Ci nauczyć się języka turkmeńskiego',
    aiInfoText: 'Asystenci AI używają zaawansowanych modeli językowych, aby zapewnić spersonalizowaną pomoc. Odpowiedzi mogą potrwać kilka sekund.',

    // AI Assistant Names
    aiContextualTipsName: 'Wskazówki kontekstowe',
    aiConversationTrainerName: 'Trener konwersacji',
    aiGrammarHelperName: 'Asystent gramatyki',
    aiCulturalAdvisorName: 'Doradca kulturowy',
    aiGeneralAssistantName: 'Asystent ogólny',

    // AI Assistant Descriptions
    aiContextualTipsDesc: 'Otrzymuj inteligentne wskazówki na podstawie aktualnego kontekstu nauki',
    aiConversationTrainerDesc: 'Ćwicz prawdziwe rozmowy i poprawiaj swoje umiejętności mówienia',
    aiGrammarHelperDesc: 'Uzyskaj natychmiastową pomoc dotyczącą turkmeńskich zasad i struktur gramatycznych',
    aiCulturalAdvisorDesc: 'Dowiedz się o turkmeńskiej kulturze, zwyczajach i etykiecie',
    aiGeneralAssistantDesc: 'Zadawaj pytania dotyczące nauki języka turkmeńskiego',

    // Welcome Messages
    aiContextualTipsWelcome: 'Cześć! Jestem tutaj, aby dostarczyć Ci pomocnych wskazówek i spostrzeżeń dotyczących nauki turkmeńskiego. Pytaj o wszystko!',
    aiConversationTrainerWelcome: 'Cześć! Poćwiczmy kilka rozmów po turkmeńsku. Pomogę Ci poprawić Twoje umiejętności mówienia!',
    aiGrammarHelperWelcome: 'Witaj! Jestem Twoim asystentem gramatyki. Pytaj mnie o turkmeńskie zasady lub struktury gramatyczne.',
    aiCulturalAdvisorWelcome: 'Salam! Pozwól, że pomogę Ci zrozumieć turkmeńską kulturę, zwyczaje i tradycje.',
    aiGeneralAssistantWelcome: 'Cześć! Jestem Twoim asystentem AI. Mogę pomóc w tłumaczeniach, frazach i komunikacji w różnych językach.',

    // ChatScreen UI
    aiInputPlaceholder: 'Wpisz swoją wiadomość...',
    aiThinking: 'Myślę...',
    aiErrorMessage: 'Przepraszam, napotkałem błąd. Spróbuj ponownie.',
    aiClearHistory: 'Wyczyść historię',
    aiClearHistoryTitle: 'Wyczyść Historię',
    aiClearHistoryMessage: 'Czy na pewno chcesz usunąć wszystkie wiadomości?',
    aiSelectModel: 'Wybierz model AI',
    aiSelectModelMessage: 'Wybierz model AI do użycia',
    aiExportChat: 'Eksportuj czat',
    aiCopyAll: 'Kopiuj wszystko',
    aiResponseSettings: 'Ustawienia odpowiedzi',
    aiResponseSettingsMessage: 'Skonfiguruj jak AI ma odpowiadać',
    aiResponseLanguage: 'Język odpowiedzi',
    aiResponseLanguageMessage: 'W jakim języku AI ma odpowiadać',
    aiCreativeMode: 'Tryb kreatywny',
    aiBalancedMode: 'Tryb zrównoważony',
    aiPreciseMode: 'Tryb precyzyjny',
    // Voice Translator
    vtHeaderTitle: 'Tłumacz Głosowy',
    vtHeroTitle: 'Mów i Tłumacz',
    vtHeroSubtitle: 'Mów w swoim języku i uzyskaj natychmiastowe tłumaczenie',
    vtTapToSpeak: 'Dotknij, aby mówić',
    vtListening: 'Słucham...',
    vtRecognized: 'Rozpoznano',
    vtPlayOriginal: 'Odtwórz oryginał',
    vtPlayTranslation: 'Odtwórz tłumaczenie',
    vtCopyTranslation: 'Kopiuj tłumaczenie',
    vtClear: 'Wyczyść',
    vtSwapLanguages: 'Zamień języki',
    vtSelectSourceLanguage: 'Wybierz język źródłowy',
    vtSelectTargetLanguage: 'Wybierz język docelowy',
    vtErrorNoPermission: 'Brak uprawnień mikrofonu. Przyznaj uprawnienia w ustawieniach.',
    vtErrorNoInternet: 'Brak połączenia z internetem. Sprawdź połączenie i spróbuj ponownie.',
    vtErrorRecognitionFailed: 'Rozpoznawanie mowy nie powiodło się. Spróbuj ponownie.',
    vtErrorTranslationFailed: 'Tłumaczenie nie powiodło się. Spróbuj ponownie.',
    vtPermissionTitle: 'Uprawnienia Mikrofonu',
    vtPermissionMessage: 'Dostęp do mikrofonu jest wymagany do korzystania z tej funkcji',
    vtGrantPermission: 'Przyznaj Uprawnienia',
    vtComingSoon: 'Wkrótce',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: 'Tłumacz głosowy wkrótce!',
    voiceComingSoonDesc: 'Pracujemy nad tłumaczeniem głosowym w czasie rzeczywistym. Wkrótce będziesz mógł mówić i otrzymywać natychmiastowe tłumaczenia!',
    voiceComingSoonFeature1: 'Rozpoznawanie mowy w czasie rzeczywistym',
    voiceComingSoonFeature2: 'Natychmiastowe tłumaczenie',
    voiceComingSoonFeature3: 'Odtwarzanie audio tłumaczenia',
    voiceComingSoonButton: 'Powrót do strony głównej',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: 'Wkrótce!',
    visualComingSoonDesc: 'Pracujemy nad rozpoznawaniem tekstu z kamery. Wkrótce będziesz mógł tłumaczyć znaki, menu i dokumenty!',
    visualComingSoonFeature1: 'Rozpoznawanie tekstu z kamery',
    visualComingSoonFeature2: 'Rozpoznawanie tekstu AI',
    visualComingSoonFeature3: 'Obsługa galerii i kamery',

    // Coming Soon version badge
    comingSoonInVersion: 'Dostępne w v{version}',

    // Onboarding - Navigation
    onboardingSkip: 'Pomiń',
    onboardingNext: 'Dalej',
    // Slide 1: Welcome
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: 'Tłumaczenie turkmeńskie — szybko i łatwo!',
    // Slide 2: Phrasebook
    onboardingPhrasebookTitle: '30 par językowych',
    onboardingPhrasebookSubtitle: 'Rozmówki z audio, działają offline',
    onboardingPhrasebookDemo: 'Cześć',
    onboardingPlayAudio: 'Odtwórz',
    onboardingPlaying: 'Odtwarzanie...',
    onboardingFeatureAudio: 'Turkmeńska wymowa',
    onboardingFeatureOffline: 'Działa bez internetu',
    // Slide 3: Translation
    onboardingTranslationTitle: 'Inteligentne tłumaczenie',
    onboardingTranslationSubtitle: 'Tłumacz tekstowy i asystent AI',
    onboardingTextTranslator: 'Tłumacz tekstowy',
    onboardingTranslate: 'Przetłumacz',
    onboardingTryAgain: 'Spróbuj ponownie',
    onboardingVisualTranslator: 'Tłumacz wizualny',
    onboardingVoiceTranslator: 'Tłumacz głosowy',
    onboardingAIAssistant: 'Asystent AI',
    onboardingAIPowered: 'Napędzane AI',
    onboardingComingSoon: 'Wkrótce',
    // Slide 4: Ready
    onboardingReadyTitle: 'Wszystko gotowe!',
    onboardingReadySubtitle: 'Zacznij uczyć się turkmeńskiego teraz',
    onboardingGetStarted: 'Rozpocznij',
    // Slide 4: Ready - Feature Tags
    onboardingTagPhrasebook: '📖 Rozmówki',
    onboardingTagAudio: '🔊 Audio',
    onboardingTagOffline: '✈️ Offline',
    onboardingTagTranslator: '📝 Tłumacz',
    onboardingTagAI: '🤖 Asystent AI',
    onboardingTagVisual: '📷 Wizualny',
    onboardingTagVoice: '🎤 Głosowy',

    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: 'Zainstalowane głosy',
    settingsInstalledVoicesDesc: 'Zobacz wszystkie dostępne głosy TTS',
    settingsLoading: 'Ładowanie ustawień...',
    settingsDarkMode: 'Tryb ciemny',
    settingsDarkModeDesc: 'Przełącz na ciemny motyw',
    settingsSpeechRate: 'Szybkość mowy',
    settingsSpeechRateDesc: 'Dostosuj szybkość wymowy',
    settingsResetAll: 'Zresetuj wszystkie ustawienia',
    settingsResetAllDesc: 'Przywróć ustawienia domyślne',
    settingsResetConfirm: 'Czy na pewno chcesz zresetować?',
    settingsClearSearchHistory: 'Wyczyść historię wyszukiwania',
    settingsClearSearchHistoryDesc: 'Usuń wszystkie rekordy wyszukiwania',
    settingsRateApp: 'Oceń aplikację',
    settingsSendFeedback: 'Wyślij opinię',
    settingsAppearance: 'Wygląd',
    settingsDataStorage: 'Dane i pamięć',
  },

  uk: {
    // Ukrainian mode: Ukrainian speaker learning Turkmen
    home: 'Головна',
    search: 'Пошук',
    favorites: 'Вибране',
    settings: 'Налаштування',
    additionalFeatures: 'Додаткові функції',
    statistics: 'Статистика',

    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: 'Всі інструменти для вивчення мови',
    selectCategory: 'Виберіть категорію',
    recentlyStudied: 'Нещодавно вивчене',
    study: 'Вивчати',

    // Main Hub Modules
    phrasebookTitle: 'Розмовник',
    phrasebookSubtitle: '305 фраз у 22 категоріях',
    visualTranslatorTitle: 'Візуальний перекладач',
    visualTranslatorSubtitle: 'Сканування тексту камерою',
    textTranslatorTitle: 'Текстовий перекладач',
    textTranslatorSubtitle: 'Введення і переклад тексту',
    voiceTranslatorTitle: 'Голосовий перекладач',
    voiceTranslatorSubtitle: 'Говоріть і перекладайте в реальному часі',
    dictionaryTitle: 'Словник',
    dictionarySubtitle: 'Вийде у v2.0',
    aiAssistantsTitle: 'AI помічники',
    aiAssistantsSubtitle: 'Розумні підказки та підтримка',
    myFavoritesTitle: 'Моє вибране',
    myFavoritesSubtitle: 'Збережені елементи',

    pronunciation: 'Вимова',
    addToFavorites: 'Додати до вибраного',
    inFavorites: 'У вибраному',
    share: 'Поділитися',

    settingsTitle: '⚙️ Налаштування',
    languageInterface: 'Мова інтерфейсу',
    switchLanguage: 'Змінити мову',
    audio: 'Аудіо',
    soundEffects: 'Звукові ефекти',
    data: 'Дані',
    clearHistory: 'Очистити історію',
    offlineMode: 'Офлайн режим',
    about: 'Про додаток',
    feedback: 'Зворотний зв\'язок',

    searchPlaceholder: 'Введіть фразу будь-якою мовою...',
    noResults: 'Нічого не знайдено',
    searchHistory: 'Історія пошуку',

    cancel: 'Скасувати',
    save: 'Зберегти',
    delete: 'Видалити',
    confirm: 'Підтвердити',
    loading: 'Завантаження...',
    error: 'Помилка',
    success: 'Успішно',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'Перекласти з AI',
    vtCameraSubtitle: 'Наведіть камеру на будь-який текст для миттєвого перекладу',
    vtTakePhoto: 'Зробити фото',
    vtChooseGallery: 'Вибрати з галереї',
    vtProcessing: 'Обробка зображення...',
    vtProcessingSubtext: 'Розпізнавання тексту та переклад',
    vtOcrEngine: 'OCR движок',
    vtOcrEngineDesc: 'Виберіть спосіб розпізнавання тексту з зображень.',
    vtOcrSpaceNote: 'Безкоштовно, 25K запитів/місяць',
    vtFeatures: 'Функції',
    vtFeatureOcrTitle: 'Розпізнавання тексту OCR',
    vtFeatureOcrDesc: 'Розпізнає текст більш ніж 30 мовами з високою точністю',
    vtFeatureAiTitle: 'AI опис об\'єктів',
    vtFeatureAiDesc: 'Описує об\'єкти, коли текст не знайдено',
    vtFeatureSmartTitle: 'Розумний переклад',
    vtFeatureSmartDesc: 'Контекстний переклад з підтримкою AI',
    vtFeatureSaveTitle: 'Зберегти та поділитися',
    vtFeatureSaveDesc: 'Зберігайте переклади в обране та діліться ними',
    vtPermissionsText: 'Потрібні дозволи на камеру та галерею',
    vtGrantPermissions: 'Надати дозволи',
    vtRequestingPermissions: 'Запит дозволів...',
    vtAutoFallback: 'Автоматичне перемикання увімкнено при збої обраного движка',

    // Visual Translator - Result Screen
    vtResult: 'Результат',
    vtRecognizedText: 'Розпізнаний текст',
    vtLanguageLabel: 'Мова: ',
    vtAiAnalysis: 'AI аналіз',
    vtTranslation: 'Переклад',
    vtTargetLabel: 'Ціль: ',
    vtPlay: 'Відтворити',
    vtStop: 'Зупинити',
    vtCopy: 'Копіювати',
    vtTranslateAnother: 'Перекласти ще',
    vtCopied: 'Скопійовано',
    vtCopiedMessage: 'Переклад скопійовано в буфер обміну',

    // Text Translator (placeholder for now)
    ttHeaderTitle: 'Текстовий перекладач',
    ttHeroTitle: 'Миттєвий переклад',
    ttHeroSubtitle: 'Перекладіть текст на будь-яку мову',
    ttSelectLanguage: 'Вибрати мову',
    ttPlaceholder: 'Введіть текст для перекладу...',
    ttClear: 'Очистити',
    ttTranslate: 'Перекласти',
    ttTranslating: 'Переклад...',
    ttPlay: 'Відтворити',
    ttStop: 'Зупинити',
    ttCopy: 'Копіювати',
    ttEmptyOutput: 'Переклад з\'явиться тут',
    ttSourceLanguage: 'Мова оригіналу',
    ttTargetLanguage: 'Мова перекладу',
    ttErrorTitle: 'Помилка',
    ttErrorEmptyText: 'Будь ласка, введіть текст для перекладу',
    ttErrorTranslationFailed: 'Не вдалося перекласти. Спробуйте ще раз.',
    ttErrorNoInternet: 'Немає підключення до Інтернету',
    ttErrorTextTooLong: 'Текст занадто довгий. Максимум 1000 символів.',
    ttCopiedTitle: 'Скопійовано',
    ttCopiedMessage: 'Переклад скопійовано в буфер обміну',
    ttInfoTitle: 'Інформація',
    ttInfoCannotSwap: 'Не можна поміняти мови місцями',

    // AI Assistants
    aiHomeTitle: 'AI-асистенти',
    aiHomeSubtitle: 'Виберіть AI-асистента, щоб допомогти вам вивчити туркменську мову',
    aiInfoText: 'AI-асистенти використовують передові мовні моделі для надання персоналізованої допомоги. Відповіді можуть зайняти кілька секунд.',

    // AI Assistant Names
    aiContextualTipsName: 'Контекстні поради',
    aiConversationTrainerName: 'Тренер розмов',
    aiGrammarHelperName: 'Помічник з граматики',
    aiCulturalAdvisorName: 'Культурний радник',
    aiGeneralAssistantName: 'Загальний асистент',

    // AI Assistant Descriptions
    aiContextualTipsDesc: 'Отримуйте розумні поради на основі вашого поточного контексту навчання',
    aiConversationTrainerDesc: 'Практикуйте справжні розмови та покращуйте свої навички спілкування',
    aiGrammarHelperDesc: 'Отримайте миттєву допомогу з туркменськими граматичними правилами та структурами',
    aiCulturalAdvisorDesc: 'Дізнайтеся про туркменську культуру, звичаї та етикет',
    aiGeneralAssistantDesc: 'Запитайте будь-що про вивчення туркменської мови',

    // Welcome Messages
    aiContextualTipsWelcome: 'Привіт! Я тут, щоб надати вам корисні поради та ідеї для вивчення туркменської мови. Запитайте мене про все!',
    aiConversationTrainerWelcome: 'Привіт! Давайте попрактикуємо кілька розмов туркменською. Я допоможу вам покращити ваші навички спілкування!',
    aiGrammarHelperWelcome: 'Ласкаво просимо! Я ваш помічник з граматики. Запитайте мене про будь-які туркменські граматичні правила або структури.',
    aiCulturalAdvisorWelcome: 'Салам! Дозвольте мені допомогти вам зрозуміти туркменську культуру, звичаї та традиції.',
    aiGeneralAssistantWelcome: 'Привіт! Я ваш AI помічник. Можу допомогти з перекладами, фразами та спілкуванням різними мовами.',

    // ChatScreen UI
    aiInputPlaceholder: 'Введіть ваше повідомлення...',
    aiThinking: 'Думаю...',
    aiErrorMessage: 'Вибачте, виникла помилка. Спробуйте ще раз.',
    aiClearHistory: 'Очистити історію',
    aiClearHistoryTitle: 'Очистити Історію',
    aiClearHistoryMessage: 'Ви впевнені, що хочете видалити всі повідомлення?',
    aiSelectModel: 'Вибрати модель ШІ',
    aiSelectModelMessage: 'Виберіть модель ШІ для використання',
    aiExportChat: 'Експортувати чат',
    aiCopyAll: 'Копіювати все',
    aiResponseSettings: 'Налаштування відповіді',
    aiResponseSettingsMessage: 'Налаштуйте як ШІ має відповідати',
    aiResponseLanguage: 'Мова відповіді',
    aiResponseLanguageMessage: 'Якою мовою ШІ має відповідати',
    aiCreativeMode: 'Творчий режим',
    aiBalancedMode: 'Збалансований режим',
    aiPreciseMode: 'Точний режим',
    // Voice Translator
    vtHeaderTitle: 'Голосовий Перекладач',
    vtHeroTitle: 'Говоріть і Перекладайте',
    vtHeroSubtitle: 'Говоріть своєю мовою та отримуйте миттєвий переклад',
    vtTapToSpeak: 'Торкніться, щоб говорити',
    vtListening: 'Слухаю...',
    vtRecognized: 'Розпізнано',
    vtPlayOriginal: 'Відтворити оригінал',
    vtPlayTranslation: 'Відтворити переклад',
    vtCopyTranslation: 'Копіювати переклад',
    vtClear: 'Очистити',
    vtSwapLanguages: 'Поміняти мови',
    vtSelectSourceLanguage: 'Виберіть вихідну мову',
    vtSelectTargetLanguage: 'Виберіть цільову мову',
    vtErrorNoPermission: 'Немає дозволу на мікрофон. Надайте дозвіл у налаштуваннях.',
    vtErrorNoInternet: 'Немає інтернет-з\'єднання. Перевірте підключення та спробуйте ще раз.',
    vtErrorRecognitionFailed: 'Розпізнавання мовлення не вдалося. Спробуйте ще раз.',
    vtErrorTranslationFailed: 'Переклад не вдався. Спробуйте ще раз.',
    vtPermissionTitle: 'Дозвіл на Мікрофон',
    vtPermissionMessage: 'Доступ до мікрофона необхідний для використання цієї функції',
    vtGrantPermission: 'Надати Дозвіл',
    vtComingSoon: 'Незабаром',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: 'Голосовий перекладач незабаром!',
    voiceComingSoonDesc: 'Ми працюємо над голосовим перекладом у реальному часі. Незабаром ви зможете говорити і отримувати миттєвий переклад!',
    voiceComingSoonFeature1: 'Розпізнавання мовлення в реальному часі',
    voiceComingSoonFeature2: 'Миттєвий переклад',
    voiceComingSoonFeature3: 'Озвучення перекладу',
    voiceComingSoonButton: 'На головну',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: 'Незабаром!',
    visualComingSoonDesc: 'Ми працюємо над розпізнаванням тексту з камери. Незабаром ви зможете перекладати вивіски, меню та документи!',
    visualComingSoonFeature1: 'Розпізнавання тексту з камери',
    visualComingSoonFeature2: 'AI розпізнавання тексту',
    visualComingSoonFeature3: 'Підтримка галереї та камери',

    // Coming Soon version badge
    comingSoonInVersion: 'Вийде у v{version}',

    // Onboarding - Navigation
    onboardingSkip: 'Пропустити',
    onboardingNext: 'Далі',
    // Slide 1: Welcome
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: 'Переклад туркменською — швидко та зручно!',
    // Slide 2: Phrasebook
    onboardingPhrasebookTitle: '30 мовних пар',
    onboardingPhrasebookSubtitle: 'Розмовник з озвучкою, працює офлайн',
    onboardingPhrasebookDemo: 'Привіт',
    onboardingPlayAudio: 'Відтворити',
    onboardingPlaying: 'Відтворення...',
    onboardingFeatureAudio: 'Озвучка туркменською',
    onboardingFeatureOffline: 'Працює без інтернету',
    // Slide 3: Translation
    onboardingTranslationTitle: 'Розумний переклад',
    onboardingTranslationSubtitle: 'Текстовий перекладач і AI помічник',
    onboardingTextTranslator: 'Текстовий перекладач',
    onboardingTranslate: 'Перекласти',
    onboardingTryAgain: 'Ще раз',
    onboardingVisualTranslator: 'Візуальний перекладач',
    onboardingVoiceTranslator: 'Голосовий перекладач',
    onboardingAIAssistant: 'AI помічник',
    onboardingAIPowered: 'На базі AI',
    onboardingComingSoon: 'Незабаром',
    // Slide 4: Ready
    onboardingReadyTitle: 'Все готово!',
    onboardingReadySubtitle: 'Почни вивчати туркменську прямо зараз',
    onboardingGetStarted: 'Почати',
    // Slide 4: Ready - Feature Tags
    onboardingTagPhrasebook: '📖 Розмовник',
    onboardingTagAudio: '🔊 Озвучка',
    onboardingTagOffline: '✈️ Офлайн',
    onboardingTagTranslator: '📝 Перекладач',
    onboardingTagAI: '🤖 AI помічник',
    onboardingTagVisual: '📷 Візуальний',
    onboardingTagVoice: '🎤 Голосовий',

    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: 'Встановлені голоси',
    settingsInstalledVoicesDesc: 'Переглянути всі доступні TTS голоси',
    settingsLoading: 'Завантаження налаштувань...',
    settingsDarkMode: 'Темна тема',
    settingsDarkModeDesc: 'Перемкнути на темну тему',
    settingsSpeechRate: 'Швидкість мовлення',
    settingsSpeechRateDesc: 'Налаштувати швидкість вимови',
    settingsResetAll: 'Скинути всі налаштування',
    settingsResetAllDesc: 'Відновити налаштування за замовчуванням',
    settingsResetConfirm: 'Ви впевнені, що хочете скинути?',
    settingsClearSearchHistory: 'Очистити історію пошуку',
    settingsClearSearchHistoryDesc: 'Видалити всі записи пошуку',
    settingsRateApp: 'Оцінити додаток',
    settingsSendFeedback: 'Надіслати відгук',
    settingsAppearance: 'Зовнішній вигляд',
    settingsDataStorage: 'Дані та сховище',
  },

  ja: {
    // Japanese mode: Japanese speaker learning Turkmen
    home: 'ホーム',
    search: '検索',
    favorites: 'お気に入り',
    settings: '設定',
    additionalFeatures: '追加機能',
    statistics: '統計',

    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: '言語学習のための全てのツール',
    selectCategory: 'カテゴリーを選択',
    recentlyStudied: '最近学習した項目',
    study: '学習する',

    phrasebookTitle: 'フレーズブック',
    phrasebookSubtitle: '22カテゴリーに305フレーズ',
    visualTranslatorTitle: 'ビジュアル翻訳',
    visualTranslatorSubtitle: 'カメラでテキストをスキャン',
    textTranslatorTitle: 'テキスト翻訳',
    textTranslatorSubtitle: 'テキストを入力して翻訳',
    voiceTranslatorTitle: '音声翻訳',
    voiceTranslatorSubtitle: '話してリアルタイムで翻訳',
    dictionaryTitle: '辞書',
    dictionarySubtitle: 'v2.0で公開予定',
    aiAssistantsTitle: 'AIアシスタント',
    aiAssistantsSubtitle: 'スマートなヒントとサポート',
    myFavoritesTitle: 'マイお気に入り',
    myFavoritesSubtitle: '保存したアイテム',

    pronunciation: '発音',
    addToFavorites: 'お気に入りに追加',
    inFavorites: 'お気に入り済み',
    share: '共有',

    settingsTitle: '⚙️ 設定',
    languageInterface: 'インターフェース言語',
    switchLanguage: '言語を変更',
    audio: 'オーディオ',
    soundEffects: '効果音',
    data: 'データ',
    clearHistory: '履歴をクリア',
    offlineMode: 'オフラインモード',
    about: 'アプリについて',
    feedback: 'フィードバック',

    searchPlaceholder: 'どの言語でもフレーズを入力...',
    noResults: '結果が見つかりません',
    searchHistory: '検索履歴',

    cancel: 'キャンセル',
    save: '保存',
    delete: '削除',
    confirm: '確認',
    loading: '読み込み中...',
    error: 'エラー',
    success: '成功',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'AIで翻訳',
    vtCameraSubtitle: 'カメラをテキストに向けて即座に翻訳',
    vtTakePhoto: '写真を撮る',
    vtChooseGallery: 'ギャラリーから選択',
    vtProcessing: '画像を処理中...',
    vtProcessingSubtext: 'テキストを認識して翻訳中',
    vtOcrEngine: 'OCRエンジン',
    vtOcrEngineDesc: '画像からテキストを認識する方法を選択してください。',
    vtOcrSpaceNote: '無料、月25Kリクエスト',
    vtFeatures: '機能',
    vtFeatureOcrTitle: 'OCRテキスト認識',
    vtFeatureOcrDesc: '30以上の言語で高精度にテキストを認識',
    vtFeatureAiTitle: 'AIオブジェクト説明',
    vtFeatureAiDesc: 'テキストが見つからない場合、オブジェクトを説明',
    vtFeatureSmartTitle: 'スマート翻訳',
    vtFeatureSmartDesc: 'AI支援による文脈翻訳',
    vtFeatureSaveTitle: '保存と共有',
    vtFeatureSaveDesc: '翻訳をお気に入りに保存して共有',
    vtPermissionsText: 'カメラと写真ライブラリの権限が必要です',
    vtGrantPermissions: '権限を付与',
    vtRequestingPermissions: '権限を要求中...',
    vtAutoFallback: '選択したエンジンが失敗した場合、自動切り替えが有効',

    // Visual Translator - Result Screen
    vtResult: '結果',
    vtRecognizedText: '認識されたテキスト',
    vtLanguageLabel: '言語: ',
    vtAiAnalysis: 'AI分析',
    vtTranslation: '翻訳',
    vtTargetLabel: 'ターゲット: ',
    vtPlay: '再生',
    vtStop: '停止',
    vtCopy: 'コピー',
    vtTranslateAnother: '別の翻訳',
    vtCopied: 'コピーしました',
    vtCopiedMessage: '翻訳をクリップボードにコピーしました',

    // Text Translator
    ttHeaderTitle: 'テキスト翻訳',
    ttHeroTitle: '即座に翻訳',
    ttHeroSubtitle: 'テキストを任意の言語に翻訳',
    ttSelectLanguage: '言語を選択',
    ttPlaceholder: '翻訳するテキストを入力...',
    ttClear: 'クリア',
    ttTranslate: '翻訳',
    ttTranslating: '翻訳中...',
    ttPlay: '再生',
    ttStop: '停止',
    ttCopy: 'コピー',
    ttEmptyOutput: '翻訳がここに表示されます',
    ttSourceLanguage: '元の言語',
    ttTargetLanguage: 'ターゲット言語',
    ttErrorTitle: 'エラー',
    ttErrorEmptyText: '翻訳するテキストを入力してください',
    ttErrorTranslationFailed: '翻訳に失敗しました。もう一度お試しください。',
    ttErrorNoInternet: 'インターネット接続がありません',
    ttErrorTextTooLong: 'テキストが長すぎます。最大1000文字です。',
    ttCopiedTitle: 'コピーしました',
    ttCopiedMessage: '翻訳をクリップボードにコピーしました',
    ttInfoTitle: '情報',
    ttInfoCannotSwap: '言語を入れ替えることができません',

    // AI Assistants
    aiHomeTitle: 'AIアシスタント',
    aiHomeSubtitle: 'トルクメン語学習を支援するAIアシスタントを選択してください',
    aiInfoText: 'AIアシスタントは高度な言語モデルを使用して、パーソナライズされたヘルプを提供します。応答には数秒かかる場合があります。',

    // AI Assistant Names
    aiContextualTipsName: 'コンテキストヒント',
    aiConversationTrainerName: '会話トレーナー',
    aiGrammarHelperName: '文法アシスタント',
    aiCulturalAdvisorName: '文化アドバイザー',
    aiGeneralAssistantName: '一般アシスタント',

    // AI Assistant Descriptions
    aiContextualTipsDesc: '現在の学習コンテキストに基づいたスマートなヒントを取得',
    aiConversationTrainerDesc: '実際の会話を練習して、スピーキングスキルを向上させる',
    aiGrammarHelperDesc: 'トルクメン語の文法規則と構造に関する即座のヘルプを取得',
    aiCulturalAdvisorDesc: 'トルクメンの文化、習慣、エチケットについて学ぶ',
    aiGeneralAssistantDesc: 'トルクメン語学習に関する質問は何でも聞いてください',

    // Welcome Messages
    aiContextualTipsWelcome: 'こんにちは！トルクメン語学習に役立つヒントと洞察を提供します。何でも聞いてください！',
    aiConversationTrainerWelcome: 'こんにちは！トルクメン語で会話を練習しましょう。スピーキングスキルの向上をお手伝いします！',
    aiGrammarHelperWelcome: 'ようこそ！文法アシスタントです。トルクメン語の文法規則や構造について質問してください。',
    aiCulturalAdvisorWelcome: 'サラーム！トルクメンの文化、習慣、伝統を理解するお手伝いをします。',
    aiGeneralAssistantWelcome: 'こんにちは！AIアシスタントです。翻訳、フレーズ、さまざまな言語でのコミュニケーションをお手伝いします。',

    // ChatScreen UI
    aiInputPlaceholder: 'メッセージを入力...',
    aiThinking: '考え中...',
    aiErrorMessage: '申し訳ございません、エラーが発生しました。もう一度お試しください。',
    aiClearHistory: '履歴をクリア',
    aiClearHistoryTitle: '履歴をクリア',
    aiClearHistoryMessage: 'すべてのメッセージを削除してもよろしいですか？',
    aiSelectModel: 'AIモデルを選択',
    aiSelectModelMessage: '使用するAIモデルを選択してください',
    aiExportChat: 'チャットをエクスポート',
    aiCopyAll: 'すべてコピー',
    aiResponseSettings: '応答設定',
    aiResponseSettingsMessage: 'AIの応答方法を設定',
    aiResponseLanguage: '応答言語',
    aiResponseLanguageMessage: 'AIがどの言語で応答するか',
    aiCreativeMode: 'クリエイティブモード',
    aiBalancedMode: 'バランスモード',
    aiPreciseMode: '正確モード',
    // Voice Translator
    vtHeaderTitle: '音声翻訳',
    vtHeroTitle: '話して翻訳',
    vtHeroSubtitle: 'あなたの言語で話して即座に翻訳',
    vtTapToSpeak: 'タップして話す',
    vtListening: '聞いています...',
    vtRecognized: '認識しました',
    vtPlayOriginal: '元の音声を再生',
    vtPlayTranslation: '翻訳を再生',
    vtCopyTranslation: '翻訳をコピー',
    vtClear: 'クリア',
    vtSwapLanguages: '言語を入れ替え',
    vtSelectSourceLanguage: '元の言語を選択',
    vtSelectTargetLanguage: '翻訳先の言語を選択',
    vtErrorNoPermission: 'マイクの許可がありません。設定で許可してください。',
    vtErrorNoInternet: 'インターネット接続がありません。接続を確認して再試行してください。',
    vtErrorRecognitionFailed: '音声認識に失敗しました。もう一度お試しください。',
    vtErrorTranslationFailed: '翻訳に失敗しました。もう一度お試しください。',
    vtPermissionTitle: 'マイクの許可',
    vtPermissionMessage: 'この機能を使用するにはマイクへのアクセスが必要です',
    vtGrantPermission: '許可する',
    vtComingSoon: '近日公開',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: '音声翻訳が近日公開！',
    voiceComingSoonDesc: 'リアルタイム音声翻訳を開発中です。まもなく話すだけで即座に翻訳を取得できます！',
    voiceComingSoonFeature1: 'リアルタイム音声認識',
    voiceComingSoonFeature2: '即時翻訳',
    voiceComingSoonFeature3: '翻訳の音声再生',
    voiceComingSoonButton: 'ホームに戻る',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: '近日公開!',
    visualComingSoonDesc: 'カメラからのテキスト認識を開発中です。まもなく看板、メニュー、書類を翻訳できます！',
    visualComingSoonFeature1: 'カメラテキスト認識',
    visualComingSoonFeature2: 'AI テキスト認識',
    visualComingSoonFeature3: 'ギャラリーとカメラのサポート',

    // Coming Soon version badge
    comingSoonInVersion: 'v{version}で公開',

    // Onboarding - Navigation
    onboardingSkip: 'スキップ',
    onboardingNext: '次へ',
    // Slide 1: Welcome
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: 'トルクメン語翻訳 — 速くて簡単！',
    // Slide 2: Phrasebook
    onboardingPhrasebookTitle: '30の言語ペア',
    onboardingPhrasebookSubtitle: '音声付きフレーズブック、オフライン対応',
    onboardingPhrasebookDemo: 'こんにちは',
    onboardingPlayAudio: '再生',
    onboardingPlaying: '再生中...',
    onboardingFeatureAudio: 'トルクメン語音声発音',
    onboardingFeatureOffline: 'インターネット不要',
    // Slide 3: Translation
    onboardingTranslationTitle: 'スマート翻訳',
    onboardingTranslationSubtitle: 'テキスト翻訳とAIアシスタント',
    onboardingTextTranslator: 'テキスト翻訳',
    onboardingTranslate: '翻訳',
    onboardingTryAgain: 'もう一度',
    onboardingVisualTranslator: 'ビジュアル翻訳',
    onboardingVoiceTranslator: '音声翻訳',
    onboardingAIAssistant: 'AIアシスタント',
    onboardingAIPowered: 'AI搭載',
    onboardingComingSoon: '近日公開',
    // Slide 4: Ready
    onboardingReadyTitle: '準備完了！',
    onboardingReadySubtitle: '今すぐトルクメン語を学び始めよう',
    onboardingGetStarted: '始める',
    // Slide 4: Ready - Feature Tags
    onboardingTagPhrasebook: '📖 フレーズブック',
    onboardingTagAudio: '🔊 音声',
    onboardingTagOffline: '✈️ オフライン',
    onboardingTagTranslator: '📝 翻訳',
    onboardingTagAI: '🤖 AIアシスタント',
    onboardingTagVisual: '📷 ビジュアル',
    onboardingTagVoice: '🎤 音声',

    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: 'インストール済み音声',
    settingsInstalledVoicesDesc: '利用可能なすべてのTTS音声を表示',
    settingsLoading: '設定を読み込み中...',
    settingsDarkMode: 'ダークモード',
    settingsDarkModeDesc: 'ダークテーマに切り替え',
    settingsSpeechRate: '読み上げ速度',
    settingsSpeechRateDesc: '発音速度を調整',
    settingsResetAll: 'すべての設定をリセット',
    settingsResetAllDesc: 'デフォルト設定を復元',
    settingsResetConfirm: '本当にリセットしますか？',
    settingsClearSearchHistory: '検索履歴を消去',
    settingsClearSearchHistoryDesc: 'すべての検索記録を削除',
    settingsRateApp: 'アプリを評価',
    settingsSendFeedback: 'フィードバックを送信',
    settingsAppearance: '外観',
    settingsDataStorage: 'データとストレージ',
  },

  ko: {
    // Korean mode: Korean speaker learning Turkmen
    home: '홈',
    search: '검색',
    favorites: '즐겨찾기',
    settings: '설정',
    additionalFeatures: '추가 기능',
    statistics: '통계',

    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: '언어 학습을 위한 모든 도구',
    selectCategory: '카테고리 선택',
    recentlyStudied: '최근 학습 항목',
    study: '학습하기',

    phrasebookTitle: '회화집',
    phrasebookSubtitle: '22개 카테고리에 305개 문구',
    visualTranslatorTitle: '비주얼 번역',
    visualTranslatorSubtitle: '카메라로 텍스트 스캔',
    textTranslatorTitle: '텍스트 번역',
    textTranslatorSubtitle: '텍스트 입력 및 번역',
    voiceTranslatorTitle: '음성 번역',
    voiceTranslatorSubtitle: '말하고 실시간으로 번역',
    dictionaryTitle: '사전',
    dictionarySubtitle: 'v2.0에서 출시 예정',
    aiAssistantsTitle: 'AI 어시스턴트',
    aiAssistantsSubtitle: '스마트한 힌트 및 지원',
    myFavoritesTitle: '내 즐겨찾기',
    myFavoritesSubtitle: '저장된 항목',

    pronunciation: '발음',
    addToFavorites: '즐겨찾기에 추가',
    inFavorites: '즐겨찾기에 있음',
    share: '공유',

    settingsTitle: '⚙️ 설정',
    languageInterface: '인터페이스 언어',
    switchLanguage: '언어 변경',
    audio: '오디오',
    soundEffects: '음향 효과',
    data: '데이터',
    clearHistory: '기록 지우기',
    offlineMode: '오프라인 모드',
    about: '앱 정보',
    feedback: '피드백',

    searchPlaceholder: '모든 언어로 문구 입력...',
    noResults: '결과 없음',
    searchHistory: '검색 기록',

    cancel: '취소',
    save: '저장',
    delete: '삭제',
    confirm: '확인',
    loading: '로딩 중...',
    error: '오류',
    success: '성공',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'AI로 번역',
    vtCameraSubtitle: '카메라를 텍스트에 향하면 즉시 번역',
    vtTakePhoto: '사진 촬영',
    vtChooseGallery: '갤러리에서 선택',
    vtProcessing: '이미지 처리 중...',
    vtProcessingSubtext: '텍스트 인식 및 번역 중',
    vtOcrEngine: 'OCR 엔진',
    vtOcrEngineDesc: '이미지에서 텍스트를 인식하는 방법을 선택하세요.',
    vtOcrSpaceNote: '무료, 월 25K 요청',
    vtFeatures: '기능',
    vtFeatureOcrTitle: 'OCR 텍스트 인식',
    vtFeatureOcrDesc: '30개 이상의 언어로 높은 정확도로 텍스트 인식',
    vtFeatureAiTitle: 'AI 객체 설명',
    vtFeatureAiDesc: '텍스트가 없을 때 객체 설명',
    vtFeatureSmartTitle: '스마트 번역',
    vtFeatureSmartDesc: 'AI 지원 문맥 번역',
    vtFeatureSaveTitle: '저장 및 공유',
    vtFeatureSaveDesc: '번역을 즐겨찾기에 저장하고 공유',
    vtPermissionsText: '카메라 및 사진 라이브러리 권한이 필요합니다',
    vtGrantPermissions: '권한 부여',
    vtRequestingPermissions: '권한 요청 중...',
    vtAutoFallback: '선택한 엔진이 실패하면 자동 전환 활성화',

    // Visual Translator - Result Screen
    vtResult: '결과',
    vtRecognizedText: '인식된 텍스트',
    vtLanguageLabel: '언어: ',
    vtAiAnalysis: 'AI 분석',
    vtTranslation: '번역',
    vtTargetLabel: '대상: ',
    vtPlay: '재생',
    vtStop: '중지',
    vtCopy: '복사',
    vtTranslateAnother: '다른 번역',
    vtCopied: '복사됨',
    vtCopiedMessage: '번역이 클립보드에 복사되었습니다',

    // Text Translator
    ttHeaderTitle: '텍스트 번역',
    ttHeroTitle: '즉시 번역',
    ttHeroSubtitle: '텍스트를 모든 언어로 번역',
    ttSelectLanguage: '언어 선택',
    ttPlaceholder: '번역할 텍스트 입력...',
    ttClear: '지우기',
    ttTranslate: '번역',
    ttTranslating: '번역 중...',
    ttPlay: '재생',
    ttStop: '중지',
    ttCopy: '복사',
    ttEmptyOutput: '번역이 여기에 표시됩니다',
    ttSourceLanguage: '원본 언어',
    ttTargetLanguage: '대상 언어',
    ttErrorTitle: '오류',
    ttErrorEmptyText: '번역할 텍스트를 입력하세요',
    ttErrorTranslationFailed: '번역 실패. 다시 시도하세요.',
    ttErrorNoInternet: '인터넷 연결 없음',
    ttErrorTextTooLong: '텍스트가 너무 깁니다. 최대 1000자입니다.',
    ttCopiedTitle: '복사됨',
    ttCopiedMessage: '번역이 클립보드에 복사되었습니다',
    ttInfoTitle: '정보',
    ttInfoCannotSwap: '언어를 바꿀 수 없습니다',

    // AI Assistants
    aiHomeTitle: 'AI 도우미',
    aiHomeSubtitle: '투르크멘어 학습을 도와줄 AI 도우미를 선택하세요',
    aiInfoText: 'AI 도우미는 고급 언어 모델을 사용하여 맞춤형 도움을 제공합니다. 응답에는 몇 초가 걸릴 수 있습니다.',

    // AI Assistant Names
    aiContextualTipsName: '상황별 팁',
    aiConversationTrainerName: '대화 트레이너',
    aiGrammarHelperName: '문법 도우미',
    aiCulturalAdvisorName: '문화 고문',
    aiGeneralAssistantName: '일반 도우미',

    // AI Assistant Descriptions
    aiContextualTipsDesc: '현재 학습 맥락을 기반으로 스마트한 팁 받기',
    aiConversationTrainerDesc: '실제 대화를 연습하고 말하기 기술을 향상시키기',
    aiGrammarHelperDesc: '투르크멘어 문법 규칙과 구조에 대한 즉각적인 도움 받기',
    aiCulturalAdvisorDesc: '투르크멘 문화, 관습 및 에티켓에 대해 배우기',
    aiGeneralAssistantDesc: '투르크멘어 학습에 대해 무엇이든 질문하세요',

    // Welcome Messages
    aiContextualTipsWelcome: '안녕하세요! 투르크멘어 학습을 위한 유용한 팁과 통찰력을 제공해드립니다. 무엇이든 물어보세요!',
    aiConversationTrainerWelcome: '안녕하세요! 투르크멘어로 대화를 연습해봅시다. 말하기 기술 향상을 도와드릴게요!',
    aiGrammarHelperWelcome: '환영합니다! 문법 도우미입니다. 투르크멘어 문법 규칙이나 구조에 대해 질문해주세요.',
    aiCulturalAdvisorWelcome: '살람! 투르크멘 문화, 관습 및 전통을 이해하도록 도와드리겠습니다.',
    aiGeneralAssistantWelcome: '안녕하세요! AI 도우미입니다. 번역, 문구, 다양한 언어로의 의사소통을 도와드릴 수 있습니다.',

    // ChatScreen UI
    aiInputPlaceholder: '메시지를 입력하세요...',
    aiThinking: '생각 중...',
    aiErrorMessage: '죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.',
    aiClearHistory: '기록 지우기',
    aiClearHistoryTitle: '기록 지우기',
    aiClearHistoryMessage: '모든 메시지를 삭제하시겠습니까?',
    aiSelectModel: 'AI 모델 선택',
    aiSelectModelMessage: '사용할 AI 모델을 선택하세요',
    aiExportChat: '채팅 내보내기',
    aiCopyAll: '모두 복사',
    aiResponseSettings: '응답 설정',
    aiResponseSettingsMessage: 'AI 응답 방식 설정',
    aiResponseLanguage: '응답 언어',
    aiResponseLanguageMessage: 'AI가 어떤 언어로 응답할지',
    aiCreativeMode: '창의적 모드',
    aiBalancedMode: '균형 모드',
    aiPreciseMode: '정확 모드',
    // Voice Translator
    vtHeaderTitle: '음성 번역기',
    vtHeroTitle: '말하고 번역하기',
    vtHeroSubtitle: '당신의 언어로 말하면 즉시 번역됩니다',
    vtTapToSpeak: '탭하여 말하기',
    vtListening: '듣는 중...',
    vtRecognized: '인식됨',
    vtPlayOriginal: '원본 재생',
    vtPlayTranslation: '번역 재생',
    vtCopyTranslation: '번역 복사',
    vtClear: '지우기',
    vtSwapLanguages: '언어 바꾸기',
    vtSelectSourceLanguage: '소스 언어 선택',
    vtSelectTargetLanguage: '대상 언어 선택',
    vtErrorNoPermission: '마이크 권한이 없습니다. 설정에서 권한을 부여해주세요.',
    vtErrorNoInternet: '인터넷 연결이 없습니다. 연결을 확인하고 다시 시도해주세요.',
    vtErrorRecognitionFailed: '음성 인식에 실패했습니다. 다시 시도해주세요.',
    vtErrorTranslationFailed: '번역에 실패했습니다. 다시 시도해주세요.',
    vtPermissionTitle: '마이크 권한',
    vtPermissionMessage: '이 기능을 사용하려면 마이크 액세스가 필요합니다',
    vtGrantPermission: '권한 부여',
    vtComingSoon: '곧 출시',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: '음성 번역기 출시 예정!',
    voiceComingSoonDesc: '실시간 음성 번역을 개발 중입니다. 곧 말하고 즉시 번역을 받을 수 있습니다!',
    voiceComingSoonFeature1: '실시간 음성 인식',
    voiceComingSoonFeature2: '즉시 번역',
    voiceComingSoonFeature3: '번역 음성 재생',
    voiceComingSoonButton: '홈으로 돌아가기',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: '곧 출시!',
    visualComingSoonDesc: '카메라 텍스트 인식을 개발 중입니다. 곧 간판, 메뉴, 문서를 번역할 수 있습니다!',
    visualComingSoonFeature1: '카메라 텍스트 인식',
    visualComingSoonFeature2: 'AI 텍스트 인식',
    visualComingSoonFeature3: '갤러리 및 카메라 지원',

    // Coming Soon version badge
    comingSoonInVersion: 'v{version}에서 출시',

    // Onboarding - Navigation
    onboardingSkip: '건너뛰기',
    onboardingNext: '다음',
    // Slide 1: Welcome
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: '투르크멘어 번역 — 빠르고 쉽게!',
    // Slide 2: Phrasebook
    onboardingPhrasebookTitle: '30개 언어 쌍',
    onboardingPhrasebookSubtitle: '음성 포함 회화집, 오프라인 지원',
    onboardingPhrasebookDemo: '안녕하세요',
    onboardingPlayAudio: '재생',
    onboardingPlaying: '재생 중...',
    onboardingFeatureAudio: '투르크멘어 음성 발음',
    onboardingFeatureOffline: '인터넷 없이 작동',
    // Slide 3: Translation
    onboardingTranslationTitle: '스마트 번역',
    onboardingTranslationSubtitle: '텍스트 번역기와 AI 어시스턴트',
    onboardingTextTranslator: '텍스트 번역기',
    onboardingTranslate: '번역',
    onboardingTryAgain: '다시 시도',
    onboardingVisualTranslator: '시각적 번역기',
    onboardingVoiceTranslator: '음성 번역기',
    onboardingAIAssistant: 'AI 어시스턴트',
    onboardingAIPowered: 'AI 기반',
    onboardingComingSoon: '출시 예정',
    // Slide 4: Ready
    onboardingReadyTitle: '모두 준비 완료!',
    onboardingReadySubtitle: '지금 투르크멘어 학습을 시작하세요',
    onboardingGetStarted: '시작하기',
    // Slide 4: Ready - Feature Tags
    onboardingTagPhrasebook: '📖 회화집',
    onboardingTagAudio: '🔊 음성',
    onboardingTagOffline: '✈️ 오프라인',
    onboardingTagTranslator: '📝 번역기',
    onboardingTagAI: '🤖 AI 어시스턴트',
    onboardingTagVisual: '📷 시각적',
    onboardingTagVoice: '🎤 음성',

    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: '설치된 음성',
    settingsInstalledVoicesDesc: '사용 가능한 모든 TTS 음성 보기',
    settingsLoading: '설정 로드 중...',
    settingsDarkMode: '다크 모드',
    settingsDarkModeDesc: '다크 테마로 전환',
    settingsSpeechRate: '음성 속도',
    settingsSpeechRateDesc: '발음 속도 조정',
    settingsResetAll: '모든 설정 초기화',
    settingsResetAllDesc: '기본 설정 복원',
    settingsResetConfirm: '정말 초기화하시겠습니까?',
    settingsClearSearchHistory: '검색 기록 지우기',
    settingsClearSearchHistoryDesc: '모든 검색 기록 삭제',
    settingsRateApp: '앱 평가',
    settingsSendFeedback: '피드백 보내기',
    settingsAppearance: '모양',
    settingsDataStorage: '데이터 및 저장소',
  },

  th: {
    // Thai mode: Thai speaker learning Turkmen
    home: 'หน้าหลัก',
    search: 'ค้นหา',
    favorites: 'รายการโปรด',
    settings: 'การตั้งค่า',
    additionalFeatures: 'ฟีเจอร์เพิ่มเติม',
    statistics: 'สถิติ',

    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: 'เครื่องมือทั้งหมดสำหรับการเรียนภาษา',
    selectCategory: 'เลือกหมวดหมู่',
    recentlyStudied: 'เรียนล่าสุด',
    study: 'เรียน',

    phrasebookTitle: 'หนังสือวลี',
    phrasebookSubtitle: '305 วลีใน 22 หมวดหมู่',
    visualTranslatorTitle: 'แปลภาพ',
    visualTranslatorSubtitle: 'สแกนข้อความด้วยกล้อง',
    textTranslatorTitle: 'แปลข้อความ',
    textTranslatorSubtitle: 'พิมพ์และแปลข้อความ',
    voiceTranslatorTitle: 'แปลเสียง',
    voiceTranslatorSubtitle: 'พูดและแปลแบบเรียลไทม์',
    dictionaryTitle: 'พจนานุกรม',
    dictionarySubtitle: 'จะมาใน v2.0',
    aiAssistantsTitle: 'ผู้ช่วย AI',
    aiAssistantsSubtitle: 'คำแนะนำและการสนับสนุนอัจฉริยะ',
    myFavoritesTitle: 'รายการโปรดของฉัน',
    myFavoritesSubtitle: 'รายการที่บันทึก',

    pronunciation: 'การออกเสียง',
    addToFavorites: 'เพิ่มในรายการโปรด',
    inFavorites: 'อยู่ในรายการโปรด',
    share: 'แชร์',

    settingsTitle: '⚙️ การตั้งค่า',
    languageInterface: 'ภาษาอินเทอร์เฟซ',
    switchLanguage: 'เปลี่ยนภาษา',
    audio: 'เสียง',
    soundEffects: 'เอฟเฟกต์เสียง',
    data: 'ข้อมูล',
    clearHistory: 'ล้างประวัติ',
    offlineMode: 'โหมดออฟไลน์',
    about: 'เกี่ยวกับแอป',
    feedback: 'ความคิดเห็น',

    searchPlaceholder: 'พิมพ์วลีในภาษาใดก็ได้...',
    noResults: 'ไม่พบผลลัพธ์',
    searchHistory: 'ประวัติการค้นหา',

    cancel: 'ยกเลิก',
    save: 'บันทึก',
    delete: 'ลบ',
    confirm: 'ยืนยัน',
    loading: 'กำลังโหลด...',
    error: 'ข้อผิดพลาด',
    success: 'สำเร็จ',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'แปลด้วย AI',
    vtCameraSubtitle: 'ชี้กล้องไปที่ข้อความเพื่อแปลทันที',
    vtTakePhoto: 'ถ่ายรูป',
    vtChooseGallery: 'เลือกจากแกลเลอรี',
    vtProcessing: 'กำลังประมวลผลภาพ...',
    vtProcessingSubtext: 'กำลังรู้จำและแปลข้อความ',
    vtOcrEngine: 'เครื่องมือ OCR',
    vtOcrEngineDesc: 'เลือกวิธีการรู้จำข้อความจากรูปภาพ',
    vtOcrSpaceNote: 'ฟรี, 25K คำขอ/เดือน',
    vtFeatures: 'คุณสมบัติ',
    vtFeatureOcrTitle: 'การรู้จำข้อความ OCR',
    vtFeatureOcrDesc: 'รู้จำข้อความใน 30+ ภาษาด้วยความแม่นยำสูง',
    vtFeatureAiTitle: 'คำอธิบายวัตถุ AI',
    vtFeatureAiDesc: 'อธิบายวัตถุเมื่อไม่พบข้อความ',
    vtFeatureSmartTitle: 'การแปลอัจฉริยะ',
    vtFeatureSmartDesc: 'การแปลตามบริบทด้วย AI',
    vtFeatureSaveTitle: 'บันทึกและแชร์',
    vtFeatureSaveDesc: 'บันทึกการแปลในรายการโปรดและแชร์',
    vtPermissionsText: 'ต้องการสิทธิ์กล้องและไลบรารีรูปภาพ',
    vtGrantPermissions: 'อนุญาตสิทธิ์',
    vtRequestingPermissions: 'กำลังขอสิทธิ์...',
    vtAutoFallback: 'การเปลี่ยนอัตโนมัติเปิดใช้งานเมื่อเครื่องมือที่เลือกล้มเหลว',

    // Visual Translator - Result Screen
    vtResult: 'ผลลัพธ์',
    vtRecognizedText: 'ข้อความที่รู้จำได้',
    vtLanguageLabel: 'ภาษา: ',
    vtAiAnalysis: 'การวิเคราะห์ AI',
    vtTranslation: 'การแปล',
    vtTargetLabel: 'เป้าหมาย: ',
    vtPlay: 'เล่น',
    vtStop: 'หยุด',
    vtCopy: 'คัดลอก',
    vtTranslateAnother: 'แปลอีกครั้ง',
    vtCopied: 'คัดลอกแล้ว',
    vtCopiedMessage: 'คัดลอกการแปลไปยังคลิปบอร์ดแล้ว',

    // Text Translator
    ttHeaderTitle: 'แปลข้อความ',
    ttHeroTitle: 'แปลทันที',
    ttHeroSubtitle: 'แปลข้อความเป็นภาษาใดก็ได้',
    ttSelectLanguage: 'เลือกภาษา',
    ttPlaceholder: 'พิมพ์ข้อความที่จะแปล...',
    ttClear: 'ล้าง',
    ttTranslate: 'แปล',
    ttTranslating: 'กำลังแปล...',
    ttPlay: 'เล่น',
    ttStop: 'หยุด',
    ttCopy: 'คัดลอก',
    ttEmptyOutput: 'การแปลจะแสดงที่นี่',
    ttSourceLanguage: 'ภาษาต้นทาง',
    ttTargetLanguage: 'ภาษาเป้าหมาย',
    ttErrorTitle: 'ข้อผิดพลาด',
    ttErrorEmptyText: 'โปรดพิมพ์ข้อความที่จะแปล',
    ttErrorTranslationFailed: 'การแปลล้มเหลว ลองอีกครั้ง',
    ttErrorNoInternet: 'ไม่มีการเชื่อมต่ออินเทอร์เน็ต',
    ttErrorTextTooLong: 'ข้อความยาวเกินไป สูงสุด 1000 ตัวอักษร',
    ttCopiedTitle: 'คัดลอกแล้ว',
    ttCopiedMessage: 'คัดลอกการแปลไปยังคลิปบอร์ดแล้ว',
    ttInfoTitle: 'ข้อมูล',
    ttInfoCannotSwap: 'ไม่สามารถสลับภาษาได้',

    // AI Assistants
    aiHomeTitle: 'ผู้ช่วย AI',
    aiHomeSubtitle: 'เลือกผู้ช่วย AI เพื่อช่วยคุณเรียนภาษาเติร์กเมน',
    aiInfoText: 'ผู้ช่วย AI ใช้โมเดลภาษาขั้นสูงเพื่อให้ความช่วยเหลือแบบเฉพาะบุคคล การตอบกลับอาจใช้เวลาสักครู่',

    // AI Assistant Names
    aiContextualTipsName: 'เคล็ดลับตามบริบท',
    aiConversationTrainerName: 'ผู้ฝึกสอนการสนทนา',
    aiGrammarHelperName: 'ผู้ช่วยไวยากรณ์',
    aiCulturalAdvisorName: 'ที่ปรึกษาด้านวัฒนธรรม',
    aiGeneralAssistantName: 'ผู้ช่วยทั่วไป',

    // AI Assistant Descriptions
    aiContextualTipsDesc: 'รับเคล็ดลับอัจฉริยะตามบริบทการเรียนรู้ปัจจุบันของคุณ',
    aiConversationTrainerDesc: 'ฝึกฝนการสนทนาจริงและพัฒนาทักษะการพูด',
    aiGrammarHelperDesc: 'รับความช่วยเหลือทันทีเกี่ยวกับกฎไวยากรณ์และโครงสร้างภาษาเติร์กเมน',
    aiCulturalAdvisorDesc: 'เรียนรู้เกี่ยวกับวัฒนธรรม ประเพณี และมารยาทของเติร์กเมน',
    aiGeneralAssistantDesc: 'ถามอะไรก็ได้เกี่ยวกับการเรียนภาษาเติร์กเมน',

    // Welcome Messages
    aiContextualTipsWelcome: 'สวัสดี! ฉันพร้อมให้เคล็ดลับและข้อมูลที่เป็นประโยชน์สำหรับการเรียนภาษาเติร์กเมน ถามฉันอะไรก็ได้!',
    aiConversationTrainerWelcome: 'สวัสดี! มาฝึกฝนการสนทนาภาษาเติร์กเมนกันเถอะ ฉันจะช่วยคุณพัฒนาทักษะการพูด!',
    aiGrammarHelperWelcome: 'ยินดีต้อนรับ! ฉันเป็นผู้ช่วยไวยากรณ์ของคุณ ถามฉันเกี่ยวกับกฎไวยากรณ์หรือโครงสร้างภาษาเติร์กเมน',
    aiCulturalAdvisorWelcome: 'ซาลาม! ให้ฉันช่วยคุณทำความเข้าใจวัฒนธรรม ประเพณี และขนบธรรมเนียมของเติร์กเมน',
    aiGeneralAssistantWelcome: 'สวัสดี! ฉันคือผู้ช่วย AI ของคุณ สามารถช่วยเรื่องการแปล วลี และการสื่อสารในภาษาต่างๆ ได้',

    // ChatScreen UI
    aiInputPlaceholder: 'พิมพ์ข้อความของคุณ...',
    aiThinking: 'กำลังคิด...',
    aiErrorMessage: 'ขออภัย เกิดข้อผิดพลาด โปรดลองอีกครั้ง',
    aiClearHistory: 'ล้างประวัติ',
    aiClearHistoryTitle: 'ล้างประวัติ',
    aiClearHistoryMessage: 'คุณแน่ใจหรือไม่ว่าต้องการลบข้อความทั้งหมด?',
    aiSelectModel: 'เลือกโมเดล AI',
    aiSelectModelMessage: 'เลือกโมเดล AI ที่จะใช้',
    aiExportChat: 'ส่งออกแชท',
    aiCopyAll: 'คัดลอกทั้งหมด',
    aiResponseSettings: 'ตั้งค่าการตอบกลับ',
    aiResponseSettingsMessage: 'กำหนดวิธีการตอบกลับของ AI',
    aiResponseLanguage: 'ภาษาการตอบกลับ',
    aiResponseLanguageMessage: 'AI ควรตอบกลับเป็นภาษาใด',
    aiCreativeMode: 'โหมดสร้างสรรค์',
    aiBalancedMode: 'โหมดสมดุล',
    aiPreciseMode: 'โหมดแม่นยำ',
    // Voice Translator
    vtHeaderTitle: 'ตัวแปลเสียง',
    vtHeroTitle: 'พูดและแปล',
    vtHeroSubtitle: 'พูดในภาษาของคุณและรับการแปลทันที',
    vtTapToSpeak: 'แตะเพื่อพูด',
    vtListening: 'กำลังฟัง...',
    vtRecognized: 'รับรู้แล้ว',
    vtPlayOriginal: 'เล่นต้นฉบับ',
    vtPlayTranslation: 'เล่นคำแปล',
    vtCopyTranslation: 'คัดลอกคำแปล',
    vtClear: 'ล้าง',
    vtSwapLanguages: 'สลับภาษา',
    vtSelectSourceLanguage: 'เลือกภาษาต้นทาง',
    vtSelectTargetLanguage: 'เลือกภาษาปลายทาง',
    vtErrorNoPermission: 'ไม่มีสิทธิ์ใช้ไมโครโฟน กรุณาอนุญาตในการตั้งค่า',
    vtErrorNoInternet: 'ไม่มีการเชื่อมต่ออินเทอร์เน็ต ตรวจสอบการเชื่อมต่อและลองอีกครั้ง',
    vtErrorRecognitionFailed: 'การรู้จำเสียงล้มเหลว กรุณาลองอีกครั้ง',
    vtErrorTranslationFailed: 'การแปลล้มเหลว กรุณาลองอีกครั้ง',
    vtPermissionTitle: 'สิทธิ์การใช้ไมโครโฟน',
    vtPermissionMessage: 'จำเป็นต้องเข้าถึงไมโครโฟนเพื่อใช้ฟีเจอร์นี้',
    vtGrantPermission: 'อนุญาตสิทธิ์',
    vtComingSoon: 'เร็วๆ นี้',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: 'นักแปลเสียงกำลังมา!',
    voiceComingSoonDesc: 'เรากำลังพัฒนาการแปลเสียงแบบเรียลไทม์ เร็วๆ นี้คุณจะพูดและได้รับการแปลทันที!',
    voiceComingSoonFeature1: 'การรู้จำเสียงแบบเรียลไทม์',
    voiceComingSoonFeature2: 'แปลทันที',
    voiceComingSoonFeature3: 'เล่นเสียงคำแปล',
    voiceComingSoonButton: 'กลับหน้าหลัก',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: 'เร็วๆนี้!',
    visualComingSoonDesc: 'เรากำลังพัฒนาการรู้จำข้อความจากกล้อง เร็วๆ นี้คุณจะแปลป้าย เมนู และเอกสารได้!',
    visualComingSoonFeature1: 'การรู้จำข้อความจากกล้อง',
    visualComingSoonFeature2: 'การจดจำข้อความ AI',
    visualComingSoonFeature3: 'รองรับแกลเลอรีและกล้อง',

    // Coming Soon version badge
    comingSoonInVersion: 'มาใน v{version}',

    // Onboarding - Navigation
    onboardingSkip: 'ข้าม',
    onboardingNext: 'ถัดไป',
    // Slide 1: Welcome
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: 'แปลภาษาเติร์กเมน — เร็วและง่าย!',
    // Slide 2: Phrasebook
    onboardingPhrasebookTitle: '30 คู่ภาษา',
    onboardingPhrasebookSubtitle: 'คู่มือสนทนาพร้อมเสียง ใช้ออฟไลน์ได้',
    onboardingPhrasebookDemo: 'สวัสดี',
    onboardingPlayAudio: 'เล่น',
    onboardingPlaying: 'กำลังเล่น...',
    onboardingFeatureAudio: 'การออกเสียงภาษาเติร์กเมน',
    onboardingFeatureOffline: 'ใช้งานได้โดยไม่ต้องใช้อินเทอร์เน็ต',
    // Slide 3: Translation
    onboardingTranslationTitle: 'การแปลอัจฉริยะ',
    onboardingTranslationSubtitle: 'ตัวแปลข้อความและผู้ช่วย AI',
    onboardingTextTranslator: 'ตัวแปลข้อความ',
    onboardingTranslate: 'แปล',
    onboardingTryAgain: 'ลองอีกครั้ง',
    onboardingVisualTranslator: 'ตัวแปลภาพ',
    onboardingVoiceTranslator: 'ตัวแปลเสียง',
    onboardingAIAssistant: 'ผู้ช่วย AI',
    onboardingAIPowered: 'ขับเคลื่อนด้วย AI',
    onboardingComingSoon: 'เร็วๆ นี้',
    // Slide 4: Ready
    onboardingReadyTitle: 'พร้อมทุกอย่างแล้ว!',
    onboardingReadySubtitle: 'เริ่มเรียนภาษาเติร์กเมนตอนนี้เลย',
    onboardingGetStarted: 'เริ่มต้น',
    // Slide 4: Ready - Feature Tags
    onboardingTagPhrasebook: '📖 คู่มือสนทนา',
    onboardingTagAudio: '🔊 เสียง',
    onboardingTagOffline: '✈️ ออฟไลน์',
    onboardingTagTranslator: '📝 ตัวแปล',
    onboardingTagAI: '🤖 ผู้ช่วย AI',
    onboardingTagVisual: '📷 ภาพ',
    onboardingTagVoice: '🎤 เสียง',

    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: 'เสียงที่ติดตั้ง',
    settingsInstalledVoicesDesc: 'ดูเสียง TTS ทั้งหมดที่มี',
    settingsLoading: 'กำลังโหลดการตั้งค่า...',
    settingsDarkMode: 'โหมดมืด',
    settingsDarkModeDesc: 'เปลี่ยนเป็นธีมมืด',
    settingsSpeechRate: 'ความเร็วการพูด',
    settingsSpeechRateDesc: 'ปรับความเร็วการออกเสียง',
    settingsResetAll: 'รีเซ็ตการตั้งค่าทั้งหมด',
    settingsResetAllDesc: 'คืนค่าการตั้งค่าเริ่มต้น',
    settingsResetConfirm: 'คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ต?',
    settingsClearSearchHistory: 'ล้างประวัติการค้นหา',
    settingsClearSearchHistoryDesc: 'ลบบันทึกการค้นหาทั้งหมด',
    settingsRateApp: 'ให้คะแนนแอป',
    settingsSendFeedback: 'ส่งความคิดเห็น',
    settingsAppearance: 'รูปลักษณ์',
    settingsDataStorage: 'ข้อมูลและที่เก็บ',
  },

  vi: {
    // Vietnamese mode: Vietnamese speaker learning Turkmen
    home: 'Trang chủ',
    search: 'Tìm kiếm',
    favorites: 'Yêu thích',
    settings: 'Cài đặt',
    additionalFeatures: 'Tính năng bổ sung',
    statistics: 'Thống kê',

    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: 'Tất cả công cụ để học ngôn ngữ',
    selectCategory: 'Chọn danh mục',
    recentlyStudied: 'Học gần đây',
    study: 'Học',

    phrasebookTitle: 'Sách cụm từ',
    phrasebookSubtitle: '305 cụm từ trong 22 danh mục',
    visualTranslatorTitle: 'Dịch hình ảnh',
    visualTranslatorSubtitle: 'Quét văn bản bằng camera',
    textTranslatorTitle: 'Dịch văn bản',
    textTranslatorSubtitle: 'Nhập và dịch văn bản',
    voiceTranslatorTitle: 'Dịch giọng nói',
    voiceTranslatorSubtitle: 'Nói và dịch theo thời gian thực',
    dictionaryTitle: 'Từ điển',
    dictionarySubtitle: 'Sắp ra mắt trong v2.0',
    aiAssistantsTitle: 'Trợ lý AI',
    aiAssistantsSubtitle: 'Gợi ý thông minh và hỗ trợ',
    myFavoritesTitle: 'Yêu thích của tôi',
    myFavoritesSubtitle: 'Mục đã lưu',

    pronunciation: 'Phát âm',
    addToFavorites: 'Thêm vào yêu thích',
    inFavorites: 'Đã yêu thích',
    share: 'Chia sẻ',

    settingsTitle: '⚙️ Cài đặt',
    languageInterface: 'Ngôn ngữ giao diện',
    switchLanguage: 'Đổi ngôn ngữ',
    audio: 'Âm thanh',
    soundEffects: 'Hiệu ứng âm thanh',
    data: 'Dữ liệu',
    clearHistory: 'Xóa lịch sử',
    offlineMode: 'Chế độ ngoại tuyến',
    about: 'Về ứng dụng',
    feedback: 'Phản hồi',

    searchPlaceholder: 'Nhập cụm từ bằng bất kỳ ngôn ngữ nào...',
    noResults: 'Không tìm thấy kết quả',
    searchHistory: 'Lịch sử tìm kiếm',

    cancel: 'Hủy',
    save: 'Lưu',
    delete: 'Xóa',
    confirm: 'Xác nhận',
    loading: 'Đang tải...',
    error: 'Lỗi',
    success: 'Thành công',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'Dịch với AI',
    vtCameraSubtitle: 'Hướng camera vào văn bản để dịch ngay lập tức',
    vtTakePhoto: 'Chụp ảnh',
    vtChooseGallery: 'Chọn từ thư viện',
    vtProcessing: 'Đang xử lý hình ảnh...',
    vtProcessingSubtext: 'Nhận dạng và dịch văn bản',
    vtOcrEngine: 'Công cụ OCR',
    vtOcrEngineDesc: 'Chọn cách nhận dạng văn bản từ hình ảnh.',
    vtOcrSpaceNote: 'Miễn phí, 25K yêu cầu/tháng',
    vtFeatures: 'Tính năng',
    vtFeatureOcrTitle: 'Nhận dạng văn bản OCR',
    vtFeatureOcrDesc: 'Nhận dạng văn bản trong hơn 30 ngôn ngữ với độ chính xác cao',
    vtFeatureAiTitle: 'Mô tả đối tượng AI',
    vtFeatureAiDesc: 'Mô tả đối tượng khi không tìm thấy văn bản',
    vtFeatureSmartTitle: 'Dịch thông minh',
    vtFeatureSmartDesc: 'Dịch ngữ cảnh với sự hỗ trợ của AI',
    vtFeatureSaveTitle: 'Lưu và chia sẻ',
    vtFeatureSaveDesc: 'Lưu bản dịch vào yêu thích và chia sẻ',
    vtPermissionsText: 'Cần quyền truy cập camera và thư viện ảnh',
    vtGrantPermissions: 'Cấp quyền',
    vtRequestingPermissions: 'Đang yêu cầu quyền...',
    vtAutoFallback: 'Tự động chuyển đổi được bật khi công cụ đã chọn thất bại',

    // Visual Translator - Result Screen
    vtResult: 'Kết quả',
    vtRecognizedText: 'Văn bản đã nhận dạng',
    vtLanguageLabel: 'Ngôn ngữ: ',
    vtAiAnalysis: 'Phân tích AI',
    vtTranslation: 'Bản dịch',
    vtTargetLabel: 'Đích: ',
    vtPlay: 'Phát',
    vtStop: 'Dừng',
    vtCopy: 'Sao chép',
    vtTranslateAnother: 'Dịch tiếp',
    vtCopied: 'Đã sao chép',
    vtCopiedMessage: 'Đã sao chép bản dịch vào clipboard',

    // Text Translator
    ttHeaderTitle: 'Dịch văn bản',
    ttHeroTitle: 'Dịch ngay lập tức',
    ttHeroSubtitle: 'Dịch văn bản sang bất kỳ ngôn ngữ nào',
    ttSelectLanguage: 'Chọn ngôn ngữ',
    ttPlaceholder: 'Nhập văn bản để dịch...',
    ttClear: 'Xóa',
    ttTranslate: 'Dịch',
    ttTranslating: 'Đang dịch...',
    ttPlay: 'Phát',
    ttStop: 'Dừng',
    ttCopy: 'Sao chép',
    ttEmptyOutput: 'Bản dịch sẽ xuất hiện ở đây',
    ttSourceLanguage: 'Ngôn ngữ nguồn',
    ttTargetLanguage: 'Ngôn ngữ đích',
    ttErrorTitle: 'Lỗi',
    ttErrorEmptyText: 'Vui lòng nhập văn bản để dịch',
    ttErrorTranslationFailed: 'Dịch thất bại. Thử lại.',
    ttErrorNoInternet: 'Không có kết nối Internet',
    ttErrorTextTooLong: 'Văn bản quá dài. Tối đa 1000 ký tự.',
    ttCopiedTitle: 'Đã sao chép',
    ttCopiedMessage: 'Đã sao chép bản dịch vào clipboard',
    ttInfoTitle: 'Thông tin',
    ttInfoCannotSwap: 'Không thể hoán đổi ngôn ngữ',

    // AI Assistants
    aiHomeTitle: 'Trợ lý AI',
    aiHomeSubtitle: 'Chọn trợ lý AI để giúp bạn học tiếng Turkmen',
    aiInfoText: 'Trợ lý AI sử dụng các mô hình ngôn ngữ tiên tiến để cung cấp trợ giúp cá nhân hóa. Câu trả lời có thể mất vài giây.',

    // AI Assistant Names
    aiContextualTipsName: 'Mẹo theo ngữ cảnh',
    aiConversationTrainerName: 'Huấn luyện viên hội thoại',
    aiGrammarHelperName: 'Trợ lý ngữ pháp',
    aiCulturalAdvisorName: 'Cố vấn văn hóa',
    aiGeneralAssistantName: 'Trợ lý chung',

    // AI Assistant Descriptions
    aiContextualTipsDesc: 'Nhận các mẹo thông minh dựa trên bối cảnh học tập hiện tại của bạn',
    aiConversationTrainerDesc: 'Thực hành các cuộc hội thoại thực tế và cải thiện kỹ năng nói',
    aiGrammarHelperDesc: 'Nhận trợ giúp tức thì về các quy tắc và cấu trúc ngữ pháp tiếng Turkmen',
    aiCulturalAdvisorDesc: 'Tìm hiểu về văn hóa, phong tục và nghi thức của Turkmen',
    aiGeneralAssistantDesc: 'Hỏi bất cứ điều gì về việc học tiếng Turkmen',

    // Welcome Messages
    aiContextualTipsWelcome: 'Xin chào! Tôi ở đây để cung cấp cho bạn các mẹo và hiểu biết hữu ích để học tiếng Turkmen. Hỏi tôi bất cứ điều gì!',
    aiConversationTrainerWelcome: 'Xin chào! Hãy thực hành một số cuộc hội thoại bằng tiếng Turkmen. Tôi sẽ giúp bạn cải thiện kỹ năng nói!',
    aiGrammarHelperWelcome: 'Chào mừng! Tôi là trợ lý ngữ pháp của bạn. Hỏi tôi về bất kỳ quy tắc hoặc cấu trúc ngữ pháp tiếng Turkmen nào.',
    aiCulturalAdvisorWelcome: 'Salam! Hãy để tôi giúp bạn hiểu văn hóa, phong tục và truyền thống của Turkmen.',
    aiGeneralAssistantWelcome: 'Xin chào! Tôi là trợ lý AI của bạn. Tôi có thể giúp với dịch thuật, cụm từ và giao tiếp bằng nhiều ngôn ngữ khác nhau.',

    // ChatScreen UI
    aiInputPlaceholder: 'Nhập tin nhắn của bạn...',
    aiThinking: 'Đang suy nghĩ...',
    aiErrorMessage: 'Xin lỗi, tôi gặp lỗi. Vui lòng thử lại.',
    aiClearHistory: 'Xóa lịch sử',
    aiClearHistoryTitle: 'Xóa Lịch Sử',
    aiClearHistoryMessage: 'Bạn có chắc chắn muốn xóa tất cả tin nhắn không?',
    aiSelectModel: 'Chọn mô hình AI',
    aiSelectModelMessage: 'Chọn mô hình AI để sử dụng',
    aiExportChat: 'Xuất cuộc trò chuyện',
    aiCopyAll: 'Sao chép tất cả',
    aiResponseSettings: 'Cài đặt phản hồi',
    aiResponseSettingsMessage: 'Cấu hình cách AI phản hồi',
    aiResponseLanguage: 'Ngôn ngữ phản hồi',
    aiResponseLanguageMessage: 'AI nên phản hồi bằng ngôn ngữ nào',
    aiCreativeMode: 'Chế độ sáng tạo',
    aiBalancedMode: 'Chế độ cân bằng',
    aiPreciseMode: 'Chế độ chính xác',
    // Voice Translator
    vtHeaderTitle: 'Phiên Dịch Giọng Nói',
    vtHeroTitle: 'Nói và Dịch',
    vtHeroSubtitle: 'Nói bằng ngôn ngữ của bạn và nhận bản dịch ngay lập tức',
    vtTapToSpeak: 'Chạm để nói',
    vtListening: 'Đang nghe...',
    vtRecognized: 'Đã nhận diện',
    vtPlayOriginal: 'Phát bản gốc',
    vtPlayTranslation: 'Phát bản dịch',
    vtCopyTranslation: 'Sao chép bản dịch',
    vtClear: 'Xóa',
    vtSwapLanguages: 'Đổi ngôn ngữ',
    vtSelectSourceLanguage: 'Chọn ngôn ngữ nguồn',
    vtSelectTargetLanguage: 'Chọn ngôn ngữ đích',
    vtErrorNoPermission: 'Không có quyền truy cập micro. Vui lòng cấp quyền trong cài đặt.',
    vtErrorNoInternet: 'Không có kết nối internet. Kiểm tra kết nối và thử lại.',
    vtErrorRecognitionFailed: 'Nhận diện giọng nói thất bại. Vui lòng thử lại.',
    vtErrorTranslationFailed: 'Dịch thất bại. Vui lòng thử lại.',
    vtPermissionTitle: 'Quyền Truy Cập Micro',
    vtPermissionMessage: 'Cần quyền truy cập micro để sử dụng tính năng này',
    vtGrantPermission: 'Cấp Quyền',
    vtComingSoon: 'Sắp ra mắt',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: 'Phiên dịch giọng nói sắp ra mắt!',
    voiceComingSoonDesc: 'Chúng tôi đang phát triển dịch giọng nói thời gian thực. Sắp tới bạn có thể nói và nhận bản dịch ngay lập tức!',
    voiceComingSoonFeature1: 'Nhận diện giọng nói thời gian thực',
    voiceComingSoonFeature2: 'Dịch tức thì',
    voiceComingSoonFeature3: 'Phát âm thanh bản dịch',
    voiceComingSoonButton: 'Về trang chủ',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: 'Sắp ra mắt!',
    visualComingSoonDesc: 'Chúng tôi đang phát triển nhận diện văn bản từ camera. Sắp tới bạn có thể dịch biển báo, thực đơn và tài liệu!',
    visualComingSoonFeature1: 'Nhận diện văn bản từ camera',
    visualComingSoonFeature2: 'Nhận dạng văn bản AI',
    visualComingSoonFeature3: 'Hỗ trợ thư viện và camera',

    // Coming Soon version badge
    comingSoonInVersion: 'Ra mắt trong v{version}',

    // Onboarding - Navigation
    onboardingSkip: 'Bỏ qua',
    onboardingNext: 'Tiếp theo',
    // Slide 1: Welcome
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: 'Dịch tiếng Turkmen — nhanh và dễ dàng!',
    // Slide 2: Phrasebook
    onboardingPhrasebookTitle: '30 cặp ngôn ngữ',
    onboardingPhrasebookSubtitle: 'Sách cụm từ có âm thanh, hoạt động ngoại tuyến',
    onboardingPhrasebookDemo: 'Xin chào',
    onboardingPlayAudio: 'Phát',
    onboardingPlaying: 'Đang phát...',
    onboardingFeatureAudio: 'Phát âm tiếng Turkmen',
    onboardingFeatureOffline: 'Hoạt động không cần internet',
    // Slide 3: Translation
    onboardingTranslationTitle: 'Dịch thông minh',
    onboardingTranslationSubtitle: 'Trình dịch văn bản và trợ lý AI',
    onboardingTextTranslator: 'Trình dịch văn bản',
    onboardingTranslate: 'Dịch',
    onboardingTryAgain: 'Thử lại',
    onboardingVisualTranslator: 'Trình dịch hình ảnh',
    onboardingVoiceTranslator: 'Trình dịch giọng nói',
    onboardingAIAssistant: 'Trợ lý AI',
    onboardingAIPowered: 'Hỗ trợ bởi AI',
    onboardingComingSoon: 'Sắp ra mắt',
    // Slide 4: Ready
    onboardingReadyTitle: 'Tất cả đã sẵn sàng!',
    onboardingReadySubtitle: 'Bắt đầu học tiếng Turkmen ngay bây giờ',
    onboardingGetStarted: 'Bắt đầu',
    // Slide 4: Ready - Feature Tags
    onboardingTagPhrasebook: '📖 Sách cụm từ',
    onboardingTagAudio: '🔊 Âm thanh',
    onboardingTagOffline: '✈️ Ngoại tuyến',
    onboardingTagTranslator: '📝 Trình dịch',
    onboardingTagAI: '🤖 Trợ lý AI',
    onboardingTagVisual: '📷 Hình ảnh',
    onboardingTagVoice: '🎤 Giọng nói',

    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: 'Giọng nói đã cài',
    settingsInstalledVoicesDesc: 'Xem tất cả giọng TTS có sẵn',
    settingsLoading: 'Đang tải cài đặt...',
    settingsDarkMode: 'Chế độ tối',
    settingsDarkModeDesc: 'Chuyển sang giao diện tối',
    settingsSpeechRate: 'Tốc độ nói',
    settingsSpeechRateDesc: 'Điều chỉnh tốc độ phát âm',
    settingsResetAll: 'Đặt lại tất cả cài đặt',
    settingsResetAllDesc: 'Khôi phục cài đặt mặc định',
    settingsResetConfirm: 'Bạn có chắc muốn đặt lại không?',
    settingsClearSearchHistory: 'Xóa lịch sử tìm kiếm',
    settingsClearSearchHistoryDesc: 'Xóa tất cả bản ghi tìm kiếm',
    settingsRateApp: 'Đánh giá ứng dụng',
    settingsSendFeedback: 'Gửi phản hồi',
    settingsAppearance: 'Giao diện',
    settingsDataStorage: 'Dữ liệu và lưu trữ',
  },

  id: {
    // Indonesian mode: Indonesian speaker learning Turkmen
    home: 'Beranda',
    search: 'Cari',
    favorites: 'Favorit',
    settings: 'Pengaturan',
    additionalFeatures: 'Fitur tambahan',
    statistics: 'Statistik',

    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: 'Semua alat untuk belajar bahasa',
    selectCategory: 'Pilih kategori',
    recentlyStudied: 'Baru dipelajari',
    study: 'Belajar',

    phrasebookTitle: 'Buku Frasa',
    phrasebookSubtitle: '305 frasa dalam 22 kategori',
    visualTranslatorTitle: 'Penerjemah Visual',
    visualTranslatorSubtitle: 'Pindai teks dengan kamera',
    textTranslatorTitle: 'Penerjemah Teks',
    textTranslatorSubtitle: 'Ketik dan terjemahkan teks',
    voiceTranslatorTitle: 'Penerjemah Suara',
    voiceTranslatorSubtitle: 'Bicara dan terjemahkan secara real-time',
    dictionaryTitle: 'Kamus',
    dictionarySubtitle: 'Segera hadir di v2.0',
    aiAssistantsTitle: 'Asisten AI',
    aiAssistantsSubtitle: 'Petunjuk cerdas dan dukungan',
    myFavoritesTitle: 'Favorit Saya',
    myFavoritesSubtitle: 'Item tersimpan',

    pronunciation: 'Pengucapan',
    addToFavorites: 'Tambah ke favorit',
    inFavorites: 'Sudah di favorit',
    share: 'Bagikan',

    settingsTitle: '⚙️ Pengaturan',
    languageInterface: 'Bahasa antarmuka',
    switchLanguage: 'Ganti bahasa',
    audio: 'Audio',
    soundEffects: 'Efek suara',
    data: 'Data',
    clearHistory: 'Hapus riwayat',
    offlineMode: 'Mode offline',
    about: 'Tentang aplikasi',
    feedback: 'Umpan balik',

    searchPlaceholder: 'Ketik frasa dalam bahasa apa pun...',
    noResults: 'Tidak ada hasil',
    searchHistory: 'Riwayat pencarian',

    cancel: 'Batal',
    save: 'Simpan',
    delete: 'Hapus',
    confirm: 'Konfirmasi',
    loading: 'Memuat...',
    error: 'Kesalahan',
    success: 'Berhasil',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'Terjemahkan dengan AI',
    vtCameraSubtitle: 'Arahkan kamera ke teks untuk terjemahan instan',
    vtTakePhoto: 'Ambil Foto',
    vtChooseGallery: 'Pilih dari Galeri',
    vtProcessing: 'Memproses gambar...',
    vtProcessingSubtext: 'Mengenali dan menerjemahkan teks',
    vtOcrEngine: 'Mesin OCR',
    vtOcrEngineDesc: 'Pilih cara mengenali teks dari gambar.',
    vtOcrSpaceNote: 'Gratis, 25K permintaan/bulan',
    vtFeatures: 'Fitur',
    vtFeatureOcrTitle: 'Pengenalan Teks OCR',
    vtFeatureOcrDesc: 'Mengenali teks dalam 30+ bahasa dengan akurasi tinggi',
    vtFeatureAiTitle: 'Deskripsi Objek AI',
    vtFeatureAiDesc: 'Mendeskripsikan objek saat teks tidak ditemukan',
    vtFeatureSmartTitle: 'Terjemahan Cerdas',
    vtFeatureSmartDesc: 'Terjemahan kontekstual dengan bantuan AI',
    vtFeatureSaveTitle: 'Simpan dan Bagikan',
    vtFeatureSaveDesc: 'Simpan terjemahan ke favorit dan bagikan',
    vtPermissionsText: 'Izin kamera dan perpustakaan foto diperlukan',
    vtGrantPermissions: 'Berikan Izin',
    vtRequestingPermissions: 'Meminta izin...',
    vtAutoFallback: 'Peralihan otomatis diaktifkan saat mesin yang dipilih gagal',

    // Visual Translator - Result Screen
    vtResult: 'Hasil',
    vtRecognizedText: 'Teks yang Dikenali',
    vtLanguageLabel: 'Bahasa: ',
    vtAiAnalysis: 'Analisis AI',
    vtTranslation: 'Terjemahan',
    vtTargetLabel: 'Target: ',
    vtPlay: 'Putar',
    vtStop: 'Berhenti',
    vtCopy: 'Salin',
    vtTranslateAnother: 'Terjemahkan Lagi',
    vtCopied: 'Disalin',
    vtCopiedMessage: 'Terjemahan disalin ke clipboard',

    // Text Translator
    ttHeaderTitle: 'Penerjemah Teks',
    ttHeroTitle: 'Terjemahan Instan',
    ttHeroSubtitle: 'Terjemahkan teks ke bahasa apa pun',
    ttSelectLanguage: 'Pilih Bahasa',
    ttPlaceholder: 'Ketik teks untuk diterjemahkan...',
    ttClear: 'Hapus',
    ttTranslate: 'Terjemahkan',
    ttTranslating: 'Menerjemahkan...',
    ttPlay: 'Putar',
    ttStop: 'Berhenti',
    ttCopy: 'Salin',
    ttEmptyOutput: 'Terjemahan akan muncul di sini',
    ttSourceLanguage: 'Bahasa Sumber',
    ttTargetLanguage: 'Bahasa Target',
    ttErrorTitle: 'Kesalahan',
    ttErrorEmptyText: 'Silakan masukkan teks untuk diterjemahkan',
    ttErrorTranslationFailed: 'Terjemahan gagal. Coba lagi.',
    ttErrorNoInternet: 'Tidak ada koneksi Internet',
    ttErrorTextTooLong: 'Teks terlalu panjang. Maksimal 1000 karakter.',
    ttCopiedTitle: 'Disalin',
    ttCopiedMessage: 'Terjemahan disalin ke clipboard',
    ttInfoTitle: 'Informasi',
    ttInfoCannotSwap: 'Tidak dapat menukar bahasa',

    // AI Assistants
    aiHomeTitle: 'Asisten AI',
    aiHomeSubtitle: 'Pilih asisten AI untuk membantu Anda belajar bahasa Turkmen',
    aiInfoText: 'Asisten AI menggunakan model bahasa canggih untuk memberikan bantuan yang dipersonalisasi. Respons mungkin memerlukan beberapa detik.',

    // AI Assistant Names
    aiContextualTipsName: 'Tips Kontekstual',
    aiConversationTrainerName: 'Pelatih Percakapan',
    aiGrammarHelperName: 'Pembantu Tata Bahasa',
    aiCulturalAdvisorName: 'Penasihat Budaya',
    aiGeneralAssistantName: 'Asisten Umum',

    // AI Assistant Descriptions
    aiContextualTipsDesc: 'Dapatkan tips cerdas berdasarkan konteks pembelajaran Anda saat ini',
    aiConversationTrainerDesc: 'Latih percakapan nyata dan tingkatkan keterampilan berbicara Anda',
    aiGrammarHelperDesc: 'Dapatkan bantuan instan dengan aturan dan struktur tata bahasa Turkmen',
    aiCulturalAdvisorDesc: 'Pelajari tentang budaya, adat istiadat, dan etiket Turkmen',
    aiGeneralAssistantDesc: 'Tanyakan apa saja tentang belajar bahasa Turkmen',

    // Welcome Messages
    aiContextualTipsWelcome: 'Halo! Saya di sini untuk memberi Anda tips dan wawasan berguna untuk belajar bahasa Turkmen. Tanyakan apa saja!',
    aiConversationTrainerWelcome: 'Halo! Mari kita latih beberapa percakapan dalam bahasa Turkmen. Saya akan membantu Anda meningkatkan keterampilan berbicara!',
    aiGrammarHelperWelcome: 'Selamat datang! Saya asisten tata bahasa Anda. Tanyakan kepada saya tentang aturan atau struktur tata bahasa Turkmen.',
    aiCulturalAdvisorWelcome: 'Salam! Biarkan saya membantu Anda memahami budaya, adat istiadat, dan tradisi Turkmen.',
    aiGeneralAssistantWelcome: 'Halo! Saya asisten AI Anda. Saya dapat membantu dengan terjemahan, frasa, dan komunikasi dalam berbagai bahasa.',

    // ChatScreen UI
    aiInputPlaceholder: 'Ketik pesan Anda...',
    aiThinking: 'Berpikir...',
    aiErrorMessage: 'Maaf, saya mengalami kesalahan. Silakan coba lagi.',
    aiClearHistory: 'Hapus Riwayat',
    aiClearHistoryTitle: 'Hapus Riwayat',
    aiClearHistoryMessage: 'Apakah Anda yakin ingin menghapus semua pesan?',
    aiSelectModel: 'Pilih model AI',
    aiSelectModelMessage: 'Pilih model AI yang akan digunakan',
    aiExportChat: 'Ekspor obrolan',
    aiCopyAll: 'Salin semua',
    aiResponseSettings: 'Pengaturan respons',
    aiResponseSettingsMessage: 'Konfigurasi cara AI merespons',
    aiResponseLanguage: 'Bahasa respons',
    aiResponseLanguageMessage: 'Dalam bahasa apa AI harus merespons',
    aiCreativeMode: 'Mode kreatif',
    aiBalancedMode: 'Mode seimbang',
    aiPreciseMode: 'Mode tepat',
    // Voice Translator
    vtHeaderTitle: 'Penerjemah Suara',
    vtHeroTitle: 'Bicara & Terjemahkan',
    vtHeroSubtitle: 'Bicara dalam bahasa Anda dan dapatkan terjemahan instan',
    vtTapToSpeak: 'Ketuk untuk bicara',
    vtListening: 'Mendengarkan...',
    vtRecognized: 'Dikenali',
    vtPlayOriginal: 'Putar asli',
    vtPlayTranslation: 'Putar terjemahan',
    vtCopyTranslation: 'Salin terjemahan',
    vtClear: 'Hapus',
    vtSwapLanguages: 'Tukar bahasa',
    vtSelectSourceLanguage: 'Pilih bahasa sumber',
    vtSelectTargetLanguage: 'Pilih bahasa tujuan',
    vtErrorNoPermission: 'Tidak ada izin mikrofon. Harap berikan izin di pengaturan.',
    vtErrorNoInternet: 'Tidak ada koneksi internet. Periksa koneksi Anda dan coba lagi.',
    vtErrorRecognitionFailed: 'Pengenalan suara gagal. Silakan coba lagi.',
    vtErrorTranslationFailed: 'Terjemahan gagal. Silakan coba lagi.',
    vtPermissionTitle: 'Izin Mikrofon',
    vtPermissionMessage: 'Akses mikrofon diperlukan untuk menggunakan fitur ini',
    vtGrantPermission: 'Berikan Izin',
    vtComingSoon: 'Segera hadir',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: 'Penerjemah Suara Segera Hadir!',
    voiceComingSoonDesc: 'Kami sedang mengembangkan terjemahan suara real-time. Segera Anda bisa berbicara dan mendapatkan terjemahan instan!',
    voiceComingSoonFeature1: 'Pengenalan suara real-time',
    voiceComingSoonFeature2: 'Terjemahan instan',
    voiceComingSoonFeature3: 'Pemutaran audio terjemahan',
    voiceComingSoonButton: 'Kembali ke Beranda',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: 'Segera Hadir!',
    visualComingSoonDesc: 'Kami sedang mengembangkan pengenalan teks dari kamera. Segera Anda bisa menerjemahkan papan, menu, dan dokumen!',
    visualComingSoonFeature1: 'Pengenalan teks dari kamera',
    visualComingSoonFeature2: 'Pengenalan teks AI',
    visualComingSoonFeature3: 'Dukungan galeri dan kamera',

    // Coming Soon version badge
    comingSoonInVersion: 'Tersedia di v{version}',

    // Onboarding - Navigation
    onboardingSkip: 'Lewati',
    onboardingNext: 'Berikutnya',
    // Slide 1: Welcome
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: 'Terjemahan Turkmen — cepat dan mudah!',
    // Slide 2: Phrasebook
    onboardingPhrasebookTitle: '30 pasangan bahasa',
    onboardingPhrasebookSubtitle: 'Buku frasa dengan audio, bekerja offline',
    onboardingPhrasebookDemo: 'Halo',
    onboardingPlayAudio: 'Putar',
    onboardingPlaying: 'Memutar...',
    onboardingFeatureAudio: 'Pengucapan bahasa Turkmen',
    onboardingFeatureOffline: 'Bekerja tanpa internet',
    // Slide 3: Translation
    onboardingTranslationTitle: 'Terjemahan Cerdas',
    onboardingTranslationSubtitle: 'Penerjemah teks dan asisten AI',
    onboardingTextTranslator: 'Penerjemah Teks',
    onboardingTranslate: 'Terjemahkan',
    onboardingTryAgain: 'Coba Lagi',
    onboardingVisualTranslator: 'Penerjemah Visual',
    onboardingVoiceTranslator: 'Penerjemah Suara',
    onboardingAIAssistant: 'Asisten AI',
    onboardingAIPowered: 'Didukung AI',
    onboardingComingSoon: 'Segera hadir',
    // Slide 4: Ready
    onboardingReadyTitle: 'Semua Siap!',
    onboardingReadySubtitle: 'Mulai belajar Turkmen sekarang',
    onboardingGetStarted: 'Mulai',
    // Slide 4: Ready - Feature Tags
    onboardingTagPhrasebook: '📖 Buku Frasa',
    onboardingTagAudio: '🔊 Audio',
    onboardingTagOffline: '✈️ Offline',
    onboardingTagTranslator: '📝 Penerjemah',
    onboardingTagAI: '🤖 Asisten AI',
    onboardingTagVisual: '📷 Visual',
    onboardingTagVoice: '🎤 Suara',

    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: 'Suara Terpasang',
    settingsInstalledVoicesDesc: 'Lihat semua suara TTS yang tersedia',
    settingsLoading: 'Memuat pengaturan...',
    settingsDarkMode: 'Mode Gelap',
    settingsDarkModeDesc: 'Beralih ke tema gelap',
    settingsSpeechRate: 'Kecepatan Bicara',
    settingsSpeechRateDesc: 'Sesuaikan kecepatan pengucapan',
    settingsResetAll: 'Atur Ulang Semua Pengaturan',
    settingsResetAllDesc: 'Pulihkan pengaturan default',
    settingsResetConfirm: 'Yakin ingin mengatur ulang?',
    settingsClearSearchHistory: 'Hapus Riwayat Pencarian',
    settingsClearSearchHistoryDesc: 'Hapus semua catatan pencarian',
    settingsRateApp: 'Beri Rating Aplikasi',
    settingsSendFeedback: 'Kirim Masukan',
    settingsAppearance: 'Tampilan',
    settingsDataStorage: 'Data & Penyimpanan',
  },

  ms: {
    // Malay mode: Malay speaker learning Turkmen
    home: 'Laman Utama',
    search: 'Cari',
    favorites: 'Kegemaran',
    settings: 'Tetapan',
    additionalFeatures: 'Ciri tambahan',
    statistics: 'Statistik',

    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: 'Semua alat untuk belajar bahasa',
    selectCategory: 'Pilih kategori',
    recentlyStudied: 'Baru dipelajari',
    study: 'Belajar',

    phrasebookTitle: 'Buku Frasa',
    phrasebookSubtitle: '305 frasa dalam 22 kategori',
    visualTranslatorTitle: 'Penterjemah Visual',
    visualTranslatorSubtitle: 'Imbas teks dengan kamera',
    textTranslatorTitle: 'Penterjemah Teks',
    textTranslatorSubtitle: 'Taip dan terjemahkan teks',
    voiceTranslatorTitle: 'Penterjemah Suara',
    voiceTranslatorSubtitle: 'Bercakap dan terjemahkan secara masa nyata',
    dictionaryTitle: 'Kamus',
    dictionarySubtitle: 'Akan datang dalam v2.0',
    aiAssistantsTitle: 'Pembantu AI',
    aiAssistantsSubtitle: 'Petua pintar dan sokongan',
    myFavoritesTitle: 'Kegemaran Saya',
    myFavoritesSubtitle: 'Item yang disimpan',

    pronunciation: 'Sebutan',
    addToFavorites: 'Tambah ke kegemaran',
    inFavorites: 'Dalam kegemaran',
    share: 'Kongsi',

    settingsTitle: '⚙️ Tetapan',
    languageInterface: 'Bahasa antara muka',
    switchLanguage: 'Tukar bahasa',
    audio: 'Audio',
    soundEffects: 'Kesan bunyi',
    data: 'Data',
    clearHistory: 'Kosongkan sejarah',
    offlineMode: 'Mod luar talian',
    about: 'Tentang aplikasi',
    feedback: 'Maklum balas',

    searchPlaceholder: 'Taip frasa dalam mana-mana bahasa...',
    noResults: 'Tiada keputusan',
    searchHistory: 'Sejarah carian',

    cancel: 'Batal',
    save: 'Simpan',
    delete: 'Padam',
    confirm: 'Sahkan',
    loading: 'Memuatkan...',
    error: 'Ralat',
    success: 'Berjaya',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'Terjemah dengan AI',
    vtCameraSubtitle: 'Tujukan kamera ke teks untuk terjemahan segera',
    vtTakePhoto: 'Ambil Gambar',
    vtChooseGallery: 'Pilih dari Galeri',
    vtProcessing: 'Memproses imej...',
    vtProcessingSubtext: 'Mengenali dan menterjemah teks',
    vtOcrEngine: 'Enjin OCR',
    vtOcrEngineDesc: 'Pilih cara mengenal pasti teks daripada imej.',
    vtOcrSpaceNote: 'Percuma, 25K permintaan/bulan',
    vtFeatures: 'Ciri-ciri',
    vtFeatureOcrTitle: 'Pengecaman Teks OCR',
    vtFeatureOcrDesc: 'Mengenali teks dalam 30+ bahasa dengan ketepatan tinggi',
    vtFeatureAiTitle: 'Huraian Objek AI',
    vtFeatureAiDesc: 'Menghuraikan objek apabila teks tidak dijumpai',
    vtFeatureSmartTitle: 'Terjemahan Pintar',
    vtFeatureSmartDesc: 'Terjemahan kontekstual dengan bantuan AI',
    vtFeatureSaveTitle: 'Simpan dan Kongsi',
    vtFeatureSaveDesc: 'Simpan terjemahan ke kegemaran dan kongsi',
    vtPermissionsText: 'Kebenaran kamera dan perpustakaan foto diperlukan',
    vtGrantPermissions: 'Berikan Kebenaran',
    vtRequestingPermissions: 'Meminta kebenaran...',
    vtAutoFallback: 'Penukaran automatik diaktifkan apabila enjin yang dipilih gagal',

    // Visual Translator - Result Screen
    vtResult: 'Hasil',
    vtRecognizedText: 'Teks yang Dikenali',
    vtLanguageLabel: 'Bahasa: ',
    vtAiAnalysis: 'Analisis AI',
    vtTranslation: 'Terjemahan',
    vtTargetLabel: 'Sasaran: ',
    vtPlay: 'Main',
    vtStop: 'Berhenti',
    vtCopy: 'Salin',
    vtTranslateAnother: 'Terjemah Lagi',
    vtCopied: 'Disalin',
    vtCopiedMessage: 'Terjemahan disalin ke papan klip',

    // Text Translator
    ttHeaderTitle: 'Penterjemah Teks',
    ttHeroTitle: 'Terjemahan Segera',
    ttHeroSubtitle: 'Terjemahkan teks ke mana-mana bahasa',
    ttSelectLanguage: 'Pilih Bahasa',
    ttPlaceholder: 'Taip teks untuk diterjemah...',
    ttClear: 'Kosongkan',
    ttTranslate: 'Terjemah',
    ttTranslating: 'Menterjemah...',
    ttPlay: 'Main',
    ttStop: 'Berhenti',
    ttCopy: 'Salin',
    ttEmptyOutput: 'Terjemahan akan muncul di sini',
    ttSourceLanguage: 'Bahasa Sumber',
    ttTargetLanguage: 'Bahasa Sasaran',
    ttErrorTitle: 'Ralat',
    ttErrorEmptyText: 'Sila masukkan teks untuk diterjemah',
    ttErrorTranslationFailed: 'Terjemahan gagal. Cuba lagi.',
    ttErrorNoInternet: 'Tiada sambungan Internet',
    ttErrorTextTooLong: 'Teks terlalu panjang. Maksimum 1000 aksara.',
    ttCopiedTitle: 'Disalin',
    ttCopiedMessage: 'Terjemahan disalin ke papan klip',
    ttInfoTitle: 'Maklumat',
    ttInfoCannotSwap: 'Tidak boleh tukar bahasa',

    // AI Assistants
    aiHomeTitle: 'Pembantu AI',
    aiHomeSubtitle: 'Pilih pembantu AI untuk membantu anda belajar bahasa Turkmen',
    aiInfoText: 'Pembantu AI menggunakan model bahasa canggih untuk memberikan bantuan yang diperibadikan. Respons mungkin mengambil masa beberapa saat.',

    // AI Assistant Names
    aiContextualTipsName: 'Petua Kontekstual',
    aiConversationTrainerName: 'Jurulatih Perbualan',
    aiGrammarHelperName: 'Pembantu Tatabahasa',
    aiCulturalAdvisorName: 'Penasihat Budaya',
    aiGeneralAssistantName: 'Pembantu Am',

    // AI Assistant Descriptions
    aiContextualTipsDesc: 'Dapatkan petua pintar berdasarkan konteks pembelajaran semasa anda',
    aiConversationTrainerDesc: 'Latih perbualan sebenar dan tingkatkan kemahiran bercakap anda',
    aiGrammarHelperDesc: 'Dapatkan bantuan segera dengan peraturan dan struktur tatabahasa Turkmen',
    aiCulturalAdvisorDesc: 'Ketahui tentang budaya, adat resam dan etiket Turkmen',
    aiGeneralAssistantDesc: 'Tanya apa sahaja tentang pembelajaran bahasa Turkmen',

    // Welcome Messages
    aiContextualTipsWelcome: 'Helo! Saya di sini untuk memberikan anda petua dan pandangan berguna untuk belajar Turkmen. Tanya saya apa sahaja!',
    aiConversationTrainerWelcome: 'Helo! Mari kita latih beberapa perbualan dalam bahasa Turkmen. Saya akan membantu anda meningkatkan kemahiran bercakap!',
    aiGrammarHelperWelcome: 'Selamat datang! Saya pembantu tatabahasa anda. Tanya saya tentang sebarang peraturan atau struktur tatabahasa Turkmen.',
    aiCulturalAdvisorWelcome: 'Salam! Biarkan saya membantu anda memahami budaya, adat resam dan tradisi Turkmen.',
    aiGeneralAssistantWelcome: 'Helo! Saya pembantu AI anda. Saya boleh membantu dengan terjemahan, frasa, dan komunikasi dalam pelbagai bahasa.',

    // ChatScreen UI
    aiInputPlaceholder: 'Taip mesej anda...',
    aiThinking: 'Berfikir...',
    aiErrorMessage: 'Maaf, saya menghadapi ralat. Sila cuba lagi.',
    aiClearHistory: 'Padam Sejarah',
    aiClearHistoryTitle: 'Padam Sejarah',
    aiClearHistoryMessage: 'Adakah anda pasti mahu memadam semua mesej?',
    aiSelectModel: 'Pilih model AI',
    aiSelectModelMessage: 'Pilih model AI untuk digunakan',
    aiExportChat: 'Eksport sembang',
    aiCopyAll: 'Salin semua',
    aiResponseSettings: 'Tetapan respons',
    aiResponseSettingsMessage: 'Konfigurasikan cara AI bertindak balas',
    aiResponseLanguage: 'Bahasa respons',
    aiResponseLanguageMessage: 'Dalam bahasa apa AI harus bertindak balas',
    aiCreativeMode: 'Mod kreatif',
    aiBalancedMode: 'Mod seimbang',
    aiPreciseMode: 'Mod tepat',
    // Voice Translator
    vtHeaderTitle: 'Penterjemah Suara',
    vtHeroTitle: 'Cakap & Terjemah',
    vtHeroSubtitle: 'Cakap dalam bahasa anda dan dapatkan terjemahan segera',
    vtTapToSpeak: 'Ketik untuk cakap',
    vtListening: 'Mendengar...',
    vtRecognized: 'Dikenali',
    vtPlayOriginal: 'Main asal',
    vtPlayTranslation: 'Main terjemahan',
    vtCopyTranslation: 'Salin terjemahan',
    vtClear: 'Padam',
    vtSwapLanguages: 'Tukar bahasa',
    vtSelectSourceLanguage: 'Pilih bahasa sumber',
    vtSelectTargetLanguage: 'Pilih bahasa sasaran',
    vtErrorNoPermission: 'Tiada kebenaran mikrofon. Sila berikan kebenaran dalam tetapan.',
    vtErrorNoInternet: 'Tiada sambungan internet. Semak sambungan anda dan cuba lagi.',
    vtErrorRecognitionFailed: 'Pengecaman suara gagal. Sila cuba lagi.',
    vtErrorTranslationFailed: 'Terjemahan gagal. Sila cuba lagi.',
    vtPermissionTitle: 'Kebenaran Mikrofon',
    vtPermissionMessage: 'Akses mikrofon diperlukan untuk menggunakan ciri ini',
    vtGrantPermission: 'Berikan Kebenaran',
    vtComingSoon: 'Akan datang',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: 'Penterjemah Suara Akan Datang!',
    voiceComingSoonDesc: 'Kami sedang membangunkan terjemahan suara masa nyata. Tidak lama lagi anda boleh bercakap dan mendapat terjemahan segera!',
    voiceComingSoonFeature1: 'Pengecaman suara masa nyata',
    voiceComingSoonFeature2: 'Terjemahan segera',
    voiceComingSoonFeature3: 'Main balik audio terjemahan',
    voiceComingSoonButton: 'Kembali ke Utama',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: 'Akan Datang!',
    visualComingSoonDesc: 'Kami sedang membangunkan pengecaman teks dari kamera. Tidak lama lagi anda boleh menterjemah papan tanda, menu dan dokumen!',
    visualComingSoonFeature1: 'Pengecaman teks dari kamera',
    visualComingSoonFeature2: 'Pengecaman teks AI',
    visualComingSoonFeature3: 'Sokongan galeri dan kamera',

    // Coming Soon version badge
    comingSoonInVersion: 'Tersedia dalam v{version}',

    // Onboarding
    onboardingSkip: 'Langkau',
    onboardingNext: 'Seterusnya',
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: 'Terjemah ke dan dari bahasa Turkmen — pantas dan mudah!',
    onboardingPhrasebookTitle: '30 pasangan bahasa',
    onboardingPhrasebookSubtitle: 'Buku frasa dengan sebutan, berfungsi luar talian',
    onboardingPhrasebookDemo: 'Hello',
    onboardingPlayAudio: 'Main Audio',
    onboardingPlaying: 'Memainkan...',
    onboardingFeatureAudio: 'Sebutan dalam bahasa Turkmen',
    onboardingFeatureOffline: 'Berfungsi tanpa internet',
    onboardingTranslationTitle: 'Terjemahan Pintar',
    onboardingTranslationSubtitle: 'Penterjemah teks dan pembantu AI',
    onboardingTextTranslator: 'Penterjemah Teks',
    onboardingTranslate: 'Terjemah',
    onboardingTryAgain: 'Cuba Lagi',
    onboardingVisualTranslator: 'Penterjemah Visual',
    onboardingVoiceTranslator: 'Penterjemah Suara',
    onboardingAIAssistant: 'Pembantu AI',
    onboardingAIPowered: 'Dikuasakan AI',
    onboardingComingSoon: 'Akan datang',
    onboardingReadyTitle: 'Semua sedia!',
    onboardingReadySubtitle: 'Mula belajar bahasa Turkmen sekarang',
    onboardingGetStarted: 'Mula',
    onboardingTagPhrasebook: '📖 Buku Frasa',
    onboardingTagAudio: '🔊 Sebutan',
    onboardingTagOffline: '✈️ Luar Talian',
    onboardingTagTranslator: '📝 Penterjemah',
    onboardingTagAI: '🤖 Pembantu AI',
    onboardingTagVisual: '📷 Visual',
    onboardingTagVoice: '🎤 Suara',

    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: 'Suara Dipasang',
    settingsInstalledVoicesDesc: 'Lihat semua suara TTS yang tersedia',
    settingsLoading: 'Memuatkan tetapan...',
    settingsDarkMode: 'Mod Gelap',
    settingsDarkModeDesc: 'Tukar ke tema gelap',
    settingsSpeechRate: 'Kelajuan Pertuturan',
    settingsSpeechRateDesc: 'Laraskan kelajuan sebutan',
    settingsResetAll: 'Tetapkan Semula Semua Tetapan',
    settingsResetAllDesc: 'Pulihkan tetapan lalai',
    settingsResetConfirm: 'Pasti mahu tetapkan semula?',
    settingsClearSearchHistory: 'Padam Sejarah Carian',
    settingsClearSearchHistoryDesc: 'Padam semua rekod carian',
    settingsRateApp: 'Nilai Aplikasi',
    settingsSendFeedback: 'Hantar Maklum Balas',
    settingsAppearance: 'Penampilan',
    settingsDataStorage: 'Data & Storan',
  },

  hi: {
    // Hindi mode: Hindi speaker learning Turkmen
    home: 'होम',
    search: 'खोजें',
    favorites: 'पसंदीदा',
    settings: 'सेटिंग्स',
    additionalFeatures: 'अतिरिक्त सुविधाएं',
    statistics: 'आंकड़े',

    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: 'भाषा सीखने के लिए सभी उपकरण',
    selectCategory: 'श्रेणी चुनें',
    recentlyStudied: 'हाल ही में अध्ययन किया',
    study: 'अध्ययन करें',

    phrasebookTitle: 'वाक्यांश पुस्तक',
    phrasebookSubtitle: '22 श्रेणियों में 305 वाक्यांश',
    visualTranslatorTitle: 'दृश्य अनुवादक',
    visualTranslatorSubtitle: 'कैमरे से टेक्स्ट स्कैन करें',
    textTranslatorTitle: 'टेक्स्ट अनुवादक',
    textTranslatorSubtitle: 'टेक्स्ट टाइप और अनुवाद करें',
    voiceTranslatorTitle: 'आवाज़ अनुवादक',
    voiceTranslatorSubtitle: 'बोलें और रीयल-टाइम में अनुवाद करें',
    dictionaryTitle: 'शब्दकोश',
    dictionarySubtitle: 'v2.0 में आ रहा है',
    aiAssistantsTitle: 'AI सहायक',
    aiAssistantsSubtitle: 'स्मार्ट सुझाव और समर्थन',
    myFavoritesTitle: 'मेरी पसंदीदा',
    myFavoritesSubtitle: 'सहेजी गई वस्तुएं',

    pronunciation: 'उच्चारण',
    addToFavorites: 'पसंदीदा में जोड़ें',
    inFavorites: 'पसंदीदा में',
    share: 'शेयर करें',

    settingsTitle: '⚙️ सेटिंग्स',
    languageInterface: 'इंटरफ़ेस भाषा',
    switchLanguage: 'भाषा बदलें',
    audio: 'ऑडियो',
    soundEffects: 'ध्वनि प्रभाव',
    data: 'डेटा',
    clearHistory: 'इतिहास साफ़ करें',
    offlineMode: 'ऑफ़लाइन मोड',
    about: 'ऐप के बारे में',
    feedback: 'प्रतिक्रिया',

    searchPlaceholder: 'किसी भी भाषा में वाक्यांश टाइप करें...',
    noResults: 'कोई परिणाम नहीं',
    searchHistory: 'खोज इतिहास',

    cancel: 'रद्द करें',
    save: 'सहेजें',
    delete: 'हटाएं',
    confirm: 'पुष्टि करें',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'AI से अनुवाद करें',
    vtCameraSubtitle: 'तत्काल अनुवाद के लिए कैमरा को टेक्स्ट पर रखें',
    vtTakePhoto: 'फोटो लें',
    vtChooseGallery: 'गैलरी से चुनें',
    vtProcessing: 'छवि संसाधित हो रही है...',
    vtProcessingSubtext: 'टेक्स्ट पहचान और अनुवाद',
    vtOcrEngine: 'OCR इंजन',
    vtOcrEngineDesc: 'छवियों से टेक्स्ट को कैसे पहचानें चुनें।',
    vtOcrSpaceNote: 'मुफ्त, 25K अनुरोध/माह',
    vtFeatures: 'विशेषताएं',
    vtFeatureOcrTitle: 'OCR टेक्स्ट पहचान',
    vtFeatureOcrDesc: '30+ भाषाओं में उच्च सटीकता के साथ टेक्स्ट पहचानें',
    vtFeatureAiTitle: 'AI ऑब्जेक्ट विवरण',
    vtFeatureAiDesc: 'जब टेक्स्ट नहीं मिलता तो ऑब्जेक्ट का वर्णन करें',
    vtFeatureSmartTitle: 'स्मार्ट अनुवाद',
    vtFeatureSmartDesc: 'AI सहायता के साथ संदर्भ अनुवाद',
    vtFeatureSaveTitle: 'सहेजें और साझा करें',
    vtFeatureSaveDesc: 'अनुवाद को पसंदीदा में सहेजें और साझा करें',
    vtPermissionsText: 'कैमरा और फोटो लाइब्रेरी अनुमतियां आवश्यक हैं',
    vtGrantPermissions: 'अनुमतियां दें',
    vtRequestingPermissions: 'अनुमतियां मांगी जा रही हैं...',
    vtAutoFallback: 'जब चुना गया इंजन विफल हो तो स्वचालित स्विचिंग सक्षम है',

    // Visual Translator - Result Screen
    vtResult: 'परिणाम',
    vtRecognizedText: 'पहचाना गया टेक्स्ट',
    vtLanguageLabel: 'भाषा: ',
    vtAiAnalysis: 'AI विश्लेषण',
    vtTranslation: 'अनुवाद',
    vtTargetLabel: 'लक्ष्य: ',
    vtPlay: 'प्ले करें',
    vtStop: 'रोकें',
    vtCopy: 'कॉपी करें',
    vtTranslateAnother: 'फिर अनुवाद करें',
    vtCopied: 'कॉपी किया गया',
    vtCopiedMessage: 'अनुवाद क्लिपबोर्ड में कॉपी किया गया',

    // Text Translator
    ttHeaderTitle: 'टेक्स्ट अनुवादक',
    ttHeroTitle: 'तत्काल अनुवाद',
    ttHeroSubtitle: 'किसी भी भाषा में टेक्स्ट का अनुवाद करें',
    ttSelectLanguage: 'भाषा चुनें',
    ttPlaceholder: 'अनुवाद के लिए टेक्स्ट टाइप करें...',
    ttClear: 'साफ़ करें',
    ttTranslate: 'अनुवाद करें',
    ttTranslating: 'अनुवाद हो रहा है...',
    ttPlay: 'प्ले करें',
    ttStop: 'रोकें',
    ttCopy: 'कॉपी करें',
    ttEmptyOutput: 'अनुवाद यहां दिखाई देगा',
    ttSourceLanguage: 'स्रोत भाषा',
    ttTargetLanguage: 'लक्ष्य भाषा',
    ttErrorTitle: 'त्रुटि',
    ttErrorEmptyText: 'कृपया अनुवाद के लिए टेक्स्ट दर्ज करें',
    ttErrorTranslationFailed: 'अनुवाद विफल। पुनः प्रयास करें।',
    ttErrorNoInternet: 'कोई इंटरनेट कनेक्शन नहीं',
    ttErrorTextTooLong: 'टेक्स्ट बहुत लंबा है। अधिकतम 1000 वर्ण।',
    ttCopiedTitle: 'कॉपी किया गया',
    ttCopiedMessage: 'अनुवाद क्लिपबोर्ड में कॉपी किया गया',
    ttInfoTitle: 'जानकारी',
    ttInfoCannotSwap: 'भाषाएं स्वैप नहीं कर सकते',

    // AI Assistants
    aiHomeTitle: 'AI सहायक',
    aiHomeSubtitle: 'तुर्कमेन भाषा सीखने में मदद के लिए एक AI सहायक चुनें',
    aiInfoText: 'AI सहायक व्यक्तिगत सहायता प्रदान करने के लिए उन्नत भाषा मॉडल का उपयोग करते हैं। प्रतिक्रिया में कुछ सेकंड लग सकते हैं।',

    // AI Assistant Names
    aiContextualTipsName: 'संदर्भीय सुझाव',
    aiConversationTrainerName: 'बातचीत प्रशिक्षक',
    aiGrammarHelperName: 'व्याकरण सहायक',
    aiCulturalAdvisorName: 'सांस्कृतिक सलाहकार',
    aiGeneralAssistantName: 'सामान्य सहायक',

    // AI Assistant Descriptions
    aiContextualTipsDesc: 'अपने वर्तमान सीखने के संदर्भ के आधार पर स्मार्ट सुझाव प्राप्त करें',
    aiConversationTrainerDesc: 'वास्तविक बातचीत का अभ्यास करें और अपने बोलने के कौशल में सुधार करें',
    aiGrammarHelperDesc: 'तुर्कमेन व्याकरण नियमों और संरचनाओं के साथ तुरंत सहायता प्राप्त करें',
    aiCulturalAdvisorDesc: 'तुर्कमेन संस्कृति, रीति-रिवाजों और शिष्टाचार के बारे में जानें',
    aiGeneralAssistantDesc: 'तुर्कमेन भाषा सीखने के बारे में कुछ भी पूछें',

    // Welcome Messages
    aiContextualTipsWelcome: 'नमस्ते! मैं आपको तुर्कमेन सीखने के लिए उपयोगी सुझाव और अंतर्दृष्टि प्रदान करने के लिए यहां हूं। मुझसे कुछ भी पूछें!',
    aiConversationTrainerWelcome: 'नमस्ते! चलिए तुर्कमेन में कुछ बातचीत का अभ्यास करते हैं। मैं आपके बोलने के कौशल को बेहतर बनाने में मदद करूंगा!',
    aiGrammarHelperWelcome: 'स्वागत है! मैं आपका व्याकरण सहायक हूं। मुझसे किसी भी तुर्कमेन व्याकरण नियम या संरचना के बारे में पूछें।',
    aiCulturalAdvisorWelcome: 'सलाम! मुझे आपको तुर्कमेन संस्कृति, रीति-रिवाजों और परंपराओं को समझने में मदद करने दें।',
    aiGeneralAssistantWelcome: 'नमस्ते! मैं आपका AI सहायक हूं। मैं अनुवाद, वाक्यांश और विभिन्न भाषाओं में संवाद में मदद कर सकता हूं।',

    // ChatScreen UI
    aiInputPlaceholder: 'अपना संदेश टाइप करें...',
    aiThinking: 'सोच रहा हूं...',
    aiErrorMessage: 'क्षमा करें, मुझे एक त्रुटि का सामना करना पड़ा। कृपया पुनः प्रयास करें।',
    aiClearHistory: 'इतिहास साफ़ करें',
    aiClearHistoryTitle: 'इतिहास साफ़ करें',
    aiClearHistoryMessage: 'क्या आप वाकई सभी संदेश हटाना चाहते हैं?',
    aiSelectModel: 'AI मॉडल चुनें',
    aiSelectModelMessage: 'उपयोग करने के लिए AI मॉडल चुनें',
    aiExportChat: 'चैट निर्यात करें',
    aiCopyAll: 'सभी कॉपी करें',
    aiResponseSettings: 'प्रतिक्रिया सेटिंग्स',
    aiResponseSettingsMessage: 'AI कैसे प्रतिक्रिया दे, कॉन्फ़िगर करें',
    aiResponseLanguage: 'प्रतिक्रिया भाषा',
    aiResponseLanguageMessage: 'AI किस भाषा में प्रतिक्रिया दे',
    aiCreativeMode: 'क्रिएटिव मोड',
    aiBalancedMode: 'संतुलित मोड',
    aiPreciseMode: 'सटीक मोड',
    // Voice Translator
    vtHeaderTitle: 'वॉयस ट्रांसलेटर',
    vtHeroTitle: 'बोलें और अनुवाद करें',
    vtHeroSubtitle: 'अपनी भाषा में बोलें और तुरंत अनुवाद प्राप्त करें',
    vtTapToSpeak: 'बोलने के लिए टैप करें',
    vtListening: 'सुन रहा है...',
    vtRecognized: 'पहचाना गया',
    vtPlayOriginal: 'मूल चलाएं',
    vtPlayTranslation: 'अनुवाद चलाएं',
    vtCopyTranslation: 'अनुवाद कॉपी करें',
    vtClear: 'साफ़ करें',
    vtSwapLanguages: 'भाषाएं बदलें',
    vtSelectSourceLanguage: 'स्रोत भाषा चुनें',
    vtSelectTargetLanguage: 'लक्ष्य भाषा चुनें',
    vtErrorNoPermission: 'माइक्रोफ़ोन की अनुमति नहीं है। कृपया सेटिंग में अनुमति दें।',
    vtErrorNoInternet: 'इंटरनेट कनेक्शन नहीं है। अपना कनेक्शन जांचें और पुनः प्रयास करें।',
    vtErrorRecognitionFailed: 'वाक् पहचान विफल रही। कृपया पुनः प्रयास करें।',
    vtErrorTranslationFailed: 'अनुवाद विफल रहा। कृपया पुनः प्रयास करें।',
    vtPermissionTitle: 'माइक्रोफ़ोन अनुमति',
    vtPermissionMessage: 'इस सुविधा का उपयोग करने के लिए माइक्रोफ़ोन एक्सेस आवश्यक है',
    vtGrantPermission: 'अनुमति दें',
    vtComingSoon: 'जल्द आ रहा है',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: 'वॉइस ट्रांसलेटर जल्द आ रहा है!',
    voiceComingSoonDesc: 'हम रीयल-टाइम वॉइस ट्रांसलेशन पर काम कर रहे हैं। जल्द ही आप बोलकर तुरंत अनुवाद प्राप्त कर सकेंगे!',
    voiceComingSoonFeature1: 'रीयल-टाइम वॉइस पहचान',
    voiceComingSoonFeature2: 'तुरंत अनुवाद',
    voiceComingSoonFeature3: 'अनुवाद की ऑडियो प्लेबैक',
    voiceComingSoonButton: 'होम पर वापस जाएं',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: 'जल्द आ रहा है!',
    visualComingSoonDesc: 'हम कैमरा टेक्स्ट पहचान पर काम कर रहे हैं। जल्द ही आप साइनबोर्ड, मेनू और दस्तावेज़ अनुवाद कर सकेंगे!',
    visualComingSoonFeature1: 'कैमरा टेक्स्ट पहचान',
    visualComingSoonFeature2: 'AI टेक्स्ट पहचान',
    visualComingSoonFeature3: 'गैलरी और कैमरा सपोर्ट',

    // Coming Soon version badge
    comingSoonInVersion: 'v{version} में उपलब्ध',

    // Onboarding
    onboardingSkip: 'छोड़ें',
    onboardingNext: 'आगे',
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: 'तुर्कमेन में और तुर्कमेन से अनुवाद करें — तेज़ और आसान!',
    onboardingPhrasebookTitle: '30 भाषा जोड़े',
    onboardingPhrasebookSubtitle: 'उच्चारण के साथ वाक्यांश पुस्तक, ऑफ़लाइन काम करती है',
    onboardingPhrasebookDemo: 'नमस्ते',
    onboardingPlayAudio: 'ऑडियो चलाएं',
    onboardingPlaying: 'चल रहा है...',
    onboardingFeatureAudio: 'तुर्कमेन में उच्चारण',
    onboardingFeatureOffline: 'इंटरनेट के बिना काम करता है',
    onboardingTranslationTitle: 'स्मार्ट अनुवाद',
    onboardingTranslationSubtitle: 'पाठ अनुवादक और AI सहायक',
    onboardingTextTranslator: 'पाठ अनुवादक',
    onboardingTranslate: 'अनुवाद करें',
    onboardingTryAgain: 'पुनः प्रयास करें',
    onboardingVisualTranslator: 'दृश्य अनुवादक',
    onboardingVoiceTranslator: 'वॉयस अनुवादक',
    onboardingAIAssistant: 'AI सहायक',
    onboardingAIPowered: 'AI संचालित',
    onboardingComingSoon: 'जल्द आ रहा है',
    onboardingReadyTitle: 'सब तैयार!',
    onboardingReadySubtitle: 'अभी तुर्कमेन सीखना शुरू करें',
    onboardingGetStarted: 'शुरू करें',
    onboardingTagPhrasebook: '📖 वाक्यांश पुस्तक',
    onboardingTagAudio: '🔊 उच्चारण',
    onboardingTagOffline: '✈️ ऑफ़लाइन',
    onboardingTagTranslator: '📝 अनुवादक',
    onboardingTagAI: '🤖 AI सहायक',
    onboardingTagVisual: '📷 दृश्य',
    onboardingTagVoice: '🎤 वॉयस',

    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: 'स्थापित आवाजें',
    settingsInstalledVoicesDesc: 'सभी उपलब्ध TTS आवाजें देखें',
    settingsLoading: 'सेटिंग्स लोड हो रही हैं...',
    settingsDarkMode: 'डार्क मोड',
    settingsDarkModeDesc: 'डार्क थीम पर स्विच करें',
    settingsSpeechRate: 'बोलने की गति',
    settingsSpeechRateDesc: 'उच्चारण की गति समायोजित करें',
    settingsResetAll: 'सभी सेटिंग्स रीसेट करें',
    settingsResetAllDesc: 'डिफ़ॉल्ट सेटिंग्स पुनर्स्थापित करें',
    settingsResetConfirm: 'क्या आप वाकई रीसेट करना चाहते हैं?',
    settingsClearSearchHistory: 'खोज इतिहास साफ़ करें',
    settingsClearSearchHistoryDesc: 'सभी खोज रिकॉर्ड हटाएं',
    settingsRateApp: 'ऐप रेट करें',
    settingsSendFeedback: 'प्रतिक्रिया भेजें',
    settingsAppearance: 'दिखावट',
    settingsDataStorage: 'डेटा और स्टोरेज',
  },

  ur: {
    // Urdu mode: Urdu speaker learning Turkmen (RTL)
    home: 'ہوم',
    search: 'تلاش کریں',
    favorites: 'پسندیدہ',
    settings: 'ترتیبات',
    additionalFeatures: 'اضافی خصوصیات',
    statistics: 'اعدادوشمار',

    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: 'زبان سیکھنے کے لیے تمام ٹولز',
    selectCategory: 'زمرہ منتخب کریں',
    recentlyStudied: 'حال ہی میں مطالعہ کیا',
    study: 'مطالعہ کریں',

    phrasebookTitle: 'جملوں کی کتاب',
    phrasebookSubtitle: '22 زمروں میں 305 جملے',
    visualTranslatorTitle: 'بصری مترجم',
    visualTranslatorSubtitle: 'کیمرے سے متن سکین کریں',
    textTranslatorTitle: 'متن کا مترجم',
    textTranslatorSubtitle: 'متن ٹائپ اور ترجمہ کریں',
    voiceTranslatorTitle: 'آواز کا مترجم',
    voiceTranslatorSubtitle: 'بولیں اور ریئل ٹائم میں ترجمہ کریں',
    dictionaryTitle: 'لغت',
    dictionarySubtitle: 'v2.0 میں آرہا ہے',
    aiAssistantsTitle: 'AI معاون',
    aiAssistantsSubtitle: 'سمارٹ تجاویز اور تعاون',
    myFavoritesTitle: 'میری پسندیدہ',
    myFavoritesSubtitle: 'محفوظ کردہ اشیاء',

    pronunciation: 'تلفظ',
    addToFavorites: 'پسندیدہ میں شامل کریں',
    inFavorites: 'پسندیدہ میں',
    share: 'شیئر کریں',

    settingsTitle: '⚙️ ترتیبات',
    languageInterface: 'انٹرفیس کی زبان',
    switchLanguage: 'زبان تبدیل کریں',
    audio: 'آڈیو',
    soundEffects: 'آواز کے اثرات',
    data: 'ڈیٹا',
    clearHistory: 'سرگزشت صاف کریں',
    offlineMode: 'آف لائن موڈ',
    about: 'ایپ کے بارے میں',
    feedback: 'رائے',

    searchPlaceholder: 'کسی بھی زبان میں جملہ ٹائپ کریں...',
    noResults: 'کوئی نتیجہ نہیں',
    searchHistory: 'تلاش کی سرگزشت',

    cancel: 'منسوخ کریں',
    save: 'محفوظ کریں',
    delete: 'حذف کریں',
    confirm: 'تصدیق کریں',
    loading: 'لوڈ ہو رہا ہے...',
    error: 'خرابی',
    success: 'کامیابی',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'AI سے ترجمہ کریں',
    vtCameraSubtitle: 'فوری ترجمے کے لیے کیمرا کو متن پر رکھیں',
    vtTakePhoto: 'تصویر لیں',
    vtChooseGallery: 'گیلری سے منتخب کریں',
    vtProcessing: 'تصویر پروسیس ہو رہی ہے...',
    vtProcessingSubtext: 'متن کی شناخت اور ترجمہ',
    vtOcrEngine: 'OCR انجن',
    vtOcrEngineDesc: 'منتخب کریں کہ تصاویر سے متن کو کیسے پہچانا جائے۔',
    vtOcrSpaceNote: 'مفت، 25K درخواستیں/ماہ',
    vtFeatures: 'خصوصیات',
    vtFeatureOcrTitle: 'OCR متن کی شناخت',
    vtFeatureOcrDesc: '30+ زبانوں میں اعلیٰ درستگی کے ساتھ متن کی شناخت',
    vtFeatureAiTitle: 'AI آبجیکٹ کی تفصیل',
    vtFeatureAiDesc: 'جب متن نہ ملے تو آبجیکٹ کی تفصیل',
    vtFeatureSmartTitle: 'سمارٹ ترجمہ',
    vtFeatureSmartDesc: 'AI مدد کے ساتھ سیاق و سباق کا ترجمہ',
    vtFeatureSaveTitle: 'محفوظ اور شیئر کریں',
    vtFeatureSaveDesc: 'ترجمے کو پسندیدہ میں محفوظ کریں اور شیئر کریں',
    vtPermissionsText: 'کیمرا اور فوٹو لائبریری کی اجازت درکار ہے',
    vtGrantPermissions: 'اجازت دیں',
    vtRequestingPermissions: 'اجازت مانگی جا رہی ہے...',
    vtAutoFallback: 'جب منتخب انجن ناکام ہو تو خودکار سوئچنگ فعال ہے',

    // Visual Translator - Result Screen
    vtResult: 'نتیجہ',
    vtRecognizedText: 'شناخت شدہ متن',
    vtLanguageLabel: 'زبان: ',
    vtAiAnalysis: 'AI تجزیہ',
    vtTranslation: 'ترجمہ',
    vtTargetLabel: 'ہدف: ',
    vtPlay: 'چلائیں',
    vtStop: 'روکیں',
    vtCopy: 'کاپی کریں',
    vtTranslateAnother: 'دوبارہ ترجمہ کریں',
    vtCopied: 'کاپی ہو گیا',
    vtCopiedMessage: 'ترجمہ کلپ بورڈ میں کاپی ہو گیا',

    // Text Translator
    ttHeaderTitle: 'متن کا مترجم',
    ttHeroTitle: 'فوری ترجمہ',
    ttHeroSubtitle: 'کسی بھی زبان میں متن کا ترجمہ کریں',
    ttSelectLanguage: 'زبان منتخب کریں',
    ttPlaceholder: 'ترجمے کے لیے متن ٹائپ کریں...',
    ttClear: 'صاف کریں',
    ttTranslate: 'ترجمہ کریں',
    ttTranslating: 'ترجمہ ہو رہا ہے...',
    ttPlay: 'چلائیں',
    ttStop: 'روکیں',
    ttCopy: 'کاپی کریں',
    ttEmptyOutput: 'ترجمہ یہاں ظاہر ہوگا',
    ttSourceLanguage: 'ماخذ زبان',
    ttTargetLanguage: 'ہدف زبان',
    ttErrorTitle: 'خرابی',
    ttErrorEmptyText: 'براہ کرم ترجمے کے لیے متن درج کریں',
    ttErrorTranslationFailed: 'ترجمہ ناکام۔ دوبارہ کوشش کریں۔',
    ttErrorNoInternet: 'انٹرنیٹ کنیکشن نہیں',
    ttErrorTextTooLong: 'متن بہت لمبا ہے۔ زیادہ سے زیادہ 1000 حروف۔',
    ttCopiedTitle: 'کاپی ہو گیا',
    ttCopiedMessage: 'ترجمہ کلپ بورڈ میں کاپی ہو گیا',
    ttInfoTitle: 'معلومات',
    ttInfoCannotSwap: 'زبانیں تبدیل نہیں ہو سکتیں',

    // AI Assistants
    aiHomeTitle: 'AI اسسٹنٹ',
    aiHomeSubtitle: 'ترکمان زبان سیکھنے میں مدد کے لیے AI اسسٹنٹ منتخب کریں',
    aiInfoText: 'AI اسسٹنٹ ذاتی نوعیت کی مدد فراہم کرنے کے لیے جدید زبان کے ماڈل استعمال کرتے ہیں۔ جوابات میں کچھ سیکنڈ لگ سکتے ہیں۔',

    // AI Assistant Names
    aiContextualTipsName: 'سیاق و سباق کے مطابق تجاویز',
    aiConversationTrainerName: 'گفتگو کا ٹرینر',
    aiGrammarHelperName: 'گرامر اسسٹنٹ',
    aiCulturalAdvisorName: 'ثقافتی مشیر',
    aiGeneralAssistantName: 'عمومی اسسٹنٹ',

    // AI Assistant Descriptions
    aiContextualTipsDesc: 'اپنے موجودہ سیکھنے کے سیاق و سباق کی بنیاد پر ہوشیار تجاویز حاصل کریں',
    aiConversationTrainerDesc: 'حقیقی گفتگو کی مشق کریں اور اپنی بولنے کی مہارت کو بہتر بنائیں',
    aiGrammarHelperDesc: 'ترکمان گرامر کے قواعد اور ڈھانچے کے ساتھ فوری مدد حاصل کریں',
    aiCulturalAdvisorDesc: 'ترکمان ثقافت، رسم و رواج اور آداب کے بارے میں جانیں',
    aiGeneralAssistantDesc: 'ترکمان زبان سیکھنے کے بارے میں کچھ بھی پوچھیں',

    // Welcome Messages
    aiContextualTipsWelcome: 'ہیلو! میں ترکمان سیکھنے کے لیے مفید تجاویز اور بصیرت فراہم کرنے کے لیے یہاں ہوں۔ مجھ سے کچھ بھی پوچھیں!',
    aiConversationTrainerWelcome: 'ہیلو! آئیے ترکمان میں کچھ گفتگو کی مشق کریں۔ میں آپ کی بولنے کی مہارت کو بہتر بنانے میں مدد کروں گا!',
    aiGrammarHelperWelcome: 'خوش آمدید! میں آپ کا گرامر اسسٹنٹ ہوں۔ مجھ سے کسی بھی ترکمان گرامر کے قواعد یا ڈھانچے کے بارے میں پوچھیں۔',
    aiCulturalAdvisorWelcome: 'سلام! مجھے آپ کو ترکمان ثقافت، رسم و رواج اور روایات کو سمجھنے میں مدد کرنے دیں۔',
    aiGeneralAssistantWelcome: 'ہیلو! میں آپ کا AI اسسٹنٹ ہوں۔ میں ترجمہ، فقرے اور مختلف زبانوں میں بات چیت میں مدد کر سکتا ہوں۔',

    // ChatScreen UI
    aiInputPlaceholder: 'اپنا پیغام ٹائپ کریں...',
    aiThinking: 'سوچ رہا ہوں...',
    aiErrorMessage: 'معذرت، مجھے ایک خرابی کا سامنا کرنا پڑا۔ براہ کرم دوبارہ کوشش کریں۔',
    aiClearHistory: 'سرگزشت صاف کریں',
    aiClearHistoryTitle: 'سرگزشت صاف کریں',
    aiClearHistoryMessage: 'کیا آپ واقعی تمام پیغامات حذف کرنا چاہتے ہیں؟',
    aiSelectModel: 'AI ماڈل منتخب کریں',
    aiSelectModelMessage: 'استعمال کرنے کے لیے AI ماڈل منتخب کریں',
    aiExportChat: 'چیٹ برآمد کریں',
    aiCopyAll: 'سب کاپی کریں',
    aiResponseSettings: 'جواب کی ترتیبات',
    aiResponseSettingsMessage: 'AI کیسے جواب دے، ترتیب دیں',
    aiResponseLanguage: 'جواب کی زبان',
    aiResponseLanguageMessage: 'AI کس زبان میں جواب دے',
    aiCreativeMode: 'تخلیقی موڈ',
    aiBalancedMode: 'متوازن موڈ',
    aiPreciseMode: 'درست موڈ',
    // Voice Translator
    vtHeaderTitle: 'صوتی مترجم',
    vtHeroTitle: 'بولیں اور ترجمہ کریں',
    vtHeroSubtitle: 'اپنی زبان میں بولیں اور فوری ترجمہ حاصل کریں',
    vtTapToSpeak: 'بولنے کے لیے ٹیپ کریں',
    vtListening: 'سن رہا ہے...',
    vtRecognized: 'پہچان لیا',
    vtPlayOriginal: 'اصل چلائیں',
    vtPlayTranslation: 'ترجمہ چلائیں',
    vtCopyTranslation: 'ترجمہ کاپی کریں',
    vtClear: 'صاف کریں',
    vtSwapLanguages: 'زبانیں تبدیل کریں',
    vtSelectSourceLanguage: 'ماخذ زبان منتخب کریں',
    vtSelectTargetLanguage: 'ہدف زبان منتخب کریں',
    vtErrorNoPermission: 'مائیکروفون کی اجازت نہیں ہے۔ براہ کرم ترتیبات میں اجازت دیں۔',
    vtErrorNoInternet: 'انٹرنیٹ کنکشن نہیں ہے۔ اپنا کنکشن چیک کریں اور دوبارہ کوشش کریں۔',
    vtErrorRecognitionFailed: 'آواز کی شناخت ناکام ہوگئی۔ براہ کرم دوبارہ کوشش کریں۔',
    vtErrorTranslationFailed: 'ترجمہ ناکام ہوگیا۔ براہ کرم دوبارہ کوشش کریں۔',
    vtPermissionTitle: 'مائیکروفون کی اجازت',
    vtPermissionMessage: 'اس خصوصیت کو استعمال کرنے کے لیے مائیکروفون تک رسائی ضروری ہے',
    vtGrantPermission: 'اجازت دیں',
    vtComingSoon: 'جلد آرہا ہے',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: 'وائس ٹرانسلیٹر جلد آرہا ہے!',
    voiceComingSoonDesc: 'ہم ریئل ٹائم وائس ٹرانسلیشن پر کام کر رہے ہیں۔ جلد ہی آپ بول کر فوری ترجمہ حاصل کر سکیں گے!',
    voiceComingSoonFeature1: 'ریئل ٹائم آواز پہچان',
    voiceComingSoonFeature2: 'فوری ترجمہ',
    voiceComingSoonFeature3: 'ترجمے کی آڈیو پلے بیک',
    voiceComingSoonButton: 'ہوم پر واپس جائیں',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: 'جلد آرہا ہے!',
    visualComingSoonDesc: 'ہم کیمرے سے ٹیکسٹ پہچان پر کام کر رہے ہیں۔ جلد ہی آپ سائن بورڈز، مینیو اور دستاویزات کا ترجمہ کر سکیں گے!',
    visualComingSoonFeature1: 'کیمرے سے ٹیکسٹ پہچان',
    visualComingSoonFeature2: 'AI ٹیکسٹ پہچان',
    visualComingSoonFeature3: 'گیلری اور کیمرہ سپورٹ',

    // Coming Soon version badge
    comingSoonInVersion: 'v{version} میں دستیاب',

    // Onboarding
    onboardingSkip: 'چھوڑیں',
    onboardingNext: 'اگلا',
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: 'ترکمن میں اور ترکمن سے ترجمہ کریں — تیز اور آسان!',
    onboardingPhrasebookTitle: '30 زبان کے جوڑے',
    onboardingPhrasebookSubtitle: 'تلفظ کے ساتھ فقرہ کتاب، آف لائن کام کرتی ہے',
    onboardingPhrasebookDemo: 'ہیلو',
    onboardingPlayAudio: 'آڈیو چلائیں',
    onboardingPlaying: 'چل رہا ہے...',
    onboardingFeatureAudio: 'ترکمن میں تلفظ',
    onboardingFeatureOffline: 'انٹرنیٹ کے بغیر کام کرتا ہے',
    onboardingTranslationTitle: 'سمارٹ ترجمہ',
    onboardingTranslationSubtitle: 'ٹیکسٹ مترجم اور AI معاون',
    onboardingTextTranslator: 'ٹیکسٹ مترجم',
    onboardingTranslate: 'ترجمہ کریں',
    onboardingTryAgain: 'دوبارہ کوشش کریں',
    onboardingVisualTranslator: 'بصری مترجم',
    onboardingVoiceTranslator: 'صوتی مترجم',
    onboardingAIAssistant: 'AI معاون',
    onboardingAIPowered: 'AI سے چلنے والا',
    onboardingComingSoon: 'جلد آ رہا ہے',
    onboardingReadyTitle: 'سب تیار!',
    onboardingReadySubtitle: 'ابھی ترکمن سیکھنا شروع کریں',
    onboardingGetStarted: 'شروع کریں',
    onboardingTagPhrasebook: '📖 فقرہ کتاب',
    onboardingTagAudio: '🔊 تلفظ',
    onboardingTagOffline: '✈️ آف لائن',
    onboardingTagTranslator: '📝 مترجم',
    onboardingTagAI: '🤖 AI معاون',
    onboardingTagVisual: '📷 بصری',
    onboardingTagVoice: '🎤 صوتی',

    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: 'نصب شدہ آوازیں',
    settingsInstalledVoicesDesc: 'تمام دستیاب TTS آوازیں دیکھیں',
    settingsLoading: 'ترتیبات لوڈ ہو رہی ہیں...',
    settingsDarkMode: 'ڈارک موڈ',
    settingsDarkModeDesc: 'ڈارک تھیم پر سوئچ کریں',
    settingsSpeechRate: 'تقریر کی رفتار',
    settingsSpeechRateDesc: 'تلفظ کی رفتار کو ایڈجسٹ کریں',
    settingsResetAll: 'تمام ترتیبات ری سیٹ کریں',
    settingsResetAllDesc: 'ڈیفالٹ ترتیبات بحال کریں',
    settingsResetConfirm: 'کیا آپ واقعی ری سیٹ کرنا چاہتے ہیں؟',
    settingsClearSearchHistory: 'تلاش کی تاریخ صاف کریں',
    settingsClearSearchHistoryDesc: 'تمام تلاش کے ریکارڈ حذف کریں',
    settingsRateApp: 'ایپ کی درجہ بندی کریں',
    settingsSendFeedback: 'رائے بھیجیں',
    settingsAppearance: 'ظاہری شکل',
    settingsDataStorage: 'ڈیٹا اور اسٹوریج',
  },

  fa: {
    // Persian mode: Persian speaker learning Turkmen (RTL)
    home: 'خانه',
    search: 'جستجو',
    favorites: 'علاقه‌مندی‌ها',
    settings: 'تنظیمات',
    additionalFeatures: 'ویژگی‌های اضافی',
    statistics: 'آمار',

    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: 'تمام ابزارها برای یادگیری زبان',
    selectCategory: 'انتخاب دسته‌بندی',
    recentlyStudied: 'اخیراً مطالعه شده',
    study: 'مطالعه',

    phrasebookTitle: 'کتاب عبارات',
    phrasebookSubtitle: '305 عبارت در 22 دسته',
    visualTranslatorTitle: 'مترجم بصری',
    visualTranslatorSubtitle: 'اسکن متن با دوربین',
    textTranslatorTitle: 'مترجم متن',
    textTranslatorSubtitle: 'تایپ و ترجمه متن',
    voiceTranslatorTitle: 'مترجم صوتی',
    voiceTranslatorSubtitle: 'صحبت کنید و به صورت زنده ترجمه کنید',
    dictionaryTitle: 'فرهنگ لغت',
    dictionarySubtitle: 'به زودی در v2.0',
    aiAssistantsTitle: 'دستیاران هوش مصنوعی',
    aiAssistantsSubtitle: 'راهنمایی‌های هوشمند و پشتیبانی',
    myFavoritesTitle: 'علاقه‌مندی‌های من',
    myFavoritesSubtitle: 'موارد ذخیره شده',

    pronunciation: 'تلفظ',
    addToFavorites: 'افزودن به علاقه‌مندی‌ها',
    inFavorites: 'در علاقه‌مندی‌ها',
    share: 'اشتراک‌گذاری',

    settingsTitle: '⚙️ تنظیمات',
    languageInterface: 'زبان رابط کاربری',
    switchLanguage: 'تغییر زبان',
    audio: 'صدا',
    soundEffects: 'جلوه‌های صوتی',
    data: 'داده‌ها',
    clearHistory: 'پاک کردن تاریخچه',
    offlineMode: 'حالت آفلاین',
    about: 'درباره برنامه',
    feedback: 'بازخورد',

    searchPlaceholder: 'عبارت را به هر زبانی تایپ کنید...',
    noResults: 'نتیجه‌ای یافت نشد',
    searchHistory: 'تاریخچه جستجو',

    cancel: 'لغو',
    save: 'ذخیره',
    delete: 'حذف',
    confirm: 'تأیید',
    loading: 'در حال بارگذاری...',
    error: 'خطا',
    success: 'موفقیت',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'ترجمه با هوش مصنوعی',
    vtCameraSubtitle: 'دوربین را روی متن بگیرید برای ترجمه فوری',
    vtTakePhoto: 'عکس بگیرید',
    vtChooseGallery: 'انتخاب از گالری',
    vtProcessing: 'در حال پردازش تصویر...',
    vtProcessingSubtext: 'شناسایی و ترجمه متن',
    vtOcrEngine: 'موتور OCR',
    vtOcrEngineDesc: 'نحوه تشخیص متن از تصاویر را انتخاب کنید.',
    vtOcrSpaceNote: 'رایگان، ۲۵ هزار درخواست/ماه',
    vtFeatures: 'ویژگی‌ها',
    vtFeatureOcrTitle: 'شناسایی متن OCR',
    vtFeatureOcrDesc: 'شناسایی متن در بیش از 30 زبان با دقت بالا',
    vtFeatureAiTitle: 'توصیف اشیا با هوش مصنوعی',
    vtFeatureAiDesc: 'توصیف اشیا وقتی متن پیدا نشود',
    vtFeatureSmartTitle: 'ترجمه هوشمند',
    vtFeatureSmartDesc: 'ترجمه زمینه‌ای با کمک هوش مصنوعی',
    vtFeatureSaveTitle: 'ذخیره و اشتراک‌گذاری',
    vtFeatureSaveDesc: 'ذخیره ترجمه‌ها در علاقه‌مندی‌ها و اشتراک‌گذاری',
    vtPermissionsText: 'مجوز دوربین و کتابخانه عکس مورد نیاز است',
    vtGrantPermissions: 'اعطای مجوز',
    vtRequestingPermissions: 'درخواست مجوزها...',
    vtAutoFallback: 'جابجایی خودکار فعال است وقتی موتور انتخابی ناموفق باشد',

    // Visual Translator - Result Screen
    vtResult: 'نتیجه',
    vtRecognizedText: 'متن شناسایی شده',
    vtLanguageLabel: 'زبان: ',
    vtAiAnalysis: 'تحلیل هوش مصنوعی',
    vtTranslation: 'ترجمه',
    vtTargetLabel: 'هدف: ',
    vtPlay: 'پخش',
    vtStop: 'توقف',
    vtCopy: 'کپی',
    vtTranslateAnother: 'ترجمه دیگری',
    vtCopied: 'کپی شد',
    vtCopiedMessage: 'ترجمه در کلیپ‌بورد کپی شد',

    // Text Translator
    ttHeaderTitle: 'مترجم متن',
    ttHeroTitle: 'ترجمه فوری',
    ttHeroSubtitle: 'ترجمه متن به هر زبانی',
    ttSelectLanguage: 'انتخاب زبان',
    ttPlaceholder: 'متن را برای ترجمه تایپ کنید...',
    ttClear: 'پاک کردن',
    ttTranslate: 'ترجمه',
    ttTranslating: 'در حال ترجمه...',
    ttPlay: 'پخش',
    ttStop: 'توقف',
    ttCopy: 'کپی',
    ttEmptyOutput: 'ترجمه اینجا ظاهر می‌شود',
    ttSourceLanguage: 'زبان مبدأ',
    ttTargetLanguage: 'زبان مقصد',
    ttErrorTitle: 'خطا',
    ttErrorEmptyText: 'لطفاً متنی برای ترجمه وارد کنید',
    ttErrorTranslationFailed: 'ترجمه ناموفق. دوباره تلاش کنید.',
    ttErrorNoInternet: 'اتصال به اینترنت وجود ندارد',
    ttErrorTextTooLong: 'متن خیلی طولانی است. حداکثر 1000 کاراکتر.',
    ttCopiedTitle: 'کپی شد',
    ttCopiedMessage: 'ترجمه در کلیپ‌بورد کپی شد',
    ttInfoTitle: 'اطلاعات',
    ttInfoCannotSwap: 'نمی‌توان زبان‌ها را جابجا کرد',

    // AI Assistants
    aiHomeTitle: 'دستیاران هوش مصنوعی',
    aiHomeSubtitle: 'یک دستیار هوش مصنوعی برای کمک به یادگیری زبان ترکمنی انتخاب کنید',
    aiInfoText: 'دستیاران هوش مصنوعی از مدل‌های زبانی پیشرفته برای ارائه کمک شخصی‌سازی شده استفاده می‌کنند. پاسخ‌ها ممکن است چند ثانیه طول بکشد.',

    // AI Assistant Names
    aiContextualTipsName: 'نکات زمینه‌ای',
    aiConversationTrainerName: 'مربی مکالمه',
    aiGrammarHelperName: 'کمک دستور زبان',
    aiCulturalAdvisorName: 'مشاور فرهنگی',
    aiGeneralAssistantName: 'دستیار عمومی',

    // AI Assistant Descriptions
    aiContextualTipsDesc: 'نکات هوشمند بر اساس زمینه یادگیری فعلی خود دریافت کنید',
    aiConversationTrainerDesc: 'مکالمات واقعی را تمرین کنید و مهارت‌های گفتاری خود را بهبود بخشید',
    aiGrammarHelperDesc: 'کمک فوری با قواعد و ساختارهای دستوری ترکمنی دریافت کنید',
    aiCulturalAdvisorDesc: 'درباره فرهنگ، آداب و رسوم ترکمنی بیاموزید',
    aiGeneralAssistantDesc: 'هر سوالی درباره یادگیری زبان ترکمنی بپرسید',

    // Welcome Messages
    aiContextualTipsWelcome: 'سلام! من اینجا هستم تا نکات و بینش‌های مفیدی برای یادگیری ترکمنی به شما ارائه دهم. هر چیزی بپرسید!',
    aiConversationTrainerWelcome: 'سلام! بیایید چند مکالمه به زبان ترکمنی تمرین کنیم. من به شما کمک می‌کنم مهارت‌های گفتاری خود را بهبود بخشید!',
    aiGrammarHelperWelcome: 'خوش آمدید! من دستیار دستور زبان شما هستم. از من درباره هر قاعده یا ساختار دستوری ترکمنی بپرسید.',
    aiCulturalAdvisorWelcome: 'سلام! بگذارید به شما کمک کنم فرهنگ، آداب و رسوم ترکمنی را درک کنید.',
    aiGeneralAssistantWelcome: 'سلام! من دستیار هوش مصنوعی شما هستم. می‌توانم در ترجمه، عبارات و ارتباط به زبان‌های مختلف کمک کنم.',

    // ChatScreen UI
    aiInputPlaceholder: 'پیام خود را تایپ کنید...',
    aiThinking: 'در حال فکر کردن...',
    aiErrorMessage: 'متأسفم، با خطا مواجه شدم. لطفاً دوباره تلاش کنید.',
    aiClearHistory: 'پاک کردن تاریخچه',
    aiClearHistoryTitle: 'پاک کردن تاریخچه',
    aiClearHistoryMessage: 'آیا مطمئن هستید که می‌خواهید همه پیام‌ها را حذف کنید؟',
    aiSelectModel: 'انتخاب مدل هوش مصنوعی',
    aiSelectModelMessage: 'مدل هوش مصنوعی را برای استفاده انتخاب کنید',
    aiExportChat: 'صادرات گفتگو',
    aiCopyAll: 'کپی همه',
    aiResponseSettings: 'تنظیمات پاسخ',
    aiResponseSettingsMessage: 'نحوه پاسخگویی هوش مصنوعی را پیکربندی کنید',
    aiResponseLanguage: 'زبان پاسخ',
    aiResponseLanguageMessage: 'هوش مصنوعی به چه زبانی پاسخ دهد',
    aiCreativeMode: 'حالت خلاقانه',
    aiBalancedMode: 'حالت متعادل',
    aiPreciseMode: 'حالت دقیق',
    // Voice Translator
    vtHeaderTitle: 'مترجم صوتی',
    vtHeroTitle: 'صحبت کنید و ترجمه کنید',
    vtHeroSubtitle: 'به زبان خود صحبت کنید و ترجمه فوری دریافت کنید',
    vtTapToSpeak: 'برای صحبت کردن ضربه بزنید',
    vtListening: 'در حال گوش دادن...',
    vtRecognized: 'شناسایی شد',
    vtPlayOriginal: 'پخش اصلی',
    vtPlayTranslation: 'پخش ترجمه',
    vtCopyTranslation: 'کپی ترجمه',
    vtClear: 'پاک کردن',
    vtSwapLanguages: 'تعویض زبان‌ها',
    vtSelectSourceLanguage: 'انتخاب زبان مبدا',
    vtSelectTargetLanguage: 'انتخاب زبان مقصد',
    vtErrorNoPermission: 'مجوز میکروفون وجود ندارد. لطفاً در تنظیمات مجوز دهید.',
    vtErrorNoInternet: 'اتصال به اینترنت وجود ندارد. اتصال خود را بررسی کنید و دوباره امتحان کنید.',
    vtErrorRecognitionFailed: 'تشخیص گفتار ناموفق بود. لطفاً دوباره تلاش کنید.',
    vtErrorTranslationFailed: 'ترجمه ناموفق بود. لطفاً دوباره تلاش کنید.',
    vtPermissionTitle: 'مجوز میکروفون',
    vtPermissionMessage: 'دسترسی به میکروفون برای استفاده از این ویژگی لازم است',
    vtGrantPermission: 'اعطای مجوز',
    vtComingSoon: 'به زودی',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: 'مترجم صوتی به زودی!',
    voiceComingSoonDesc: 'ما در حال کار روی ترجمه صوتی بلادرنگ هستیم. به زودی می‌توانید صحبت کنید و فوراً ترجمه دریافت کنید!',
    voiceComingSoonFeature1: 'تشخیص صوت بلادرنگ',
    voiceComingSoonFeature2: 'ترجمه فوری',
    voiceComingSoonFeature3: 'پخش صوتی ترجمه',
    voiceComingSoonButton: 'بازگشت به خانه',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: 'به زودی!',
    visualComingSoonDesc: 'ما در حال کار روی تشخیص متن از دوربین هستیم. به زودی می‌توانید تابلوها، منوها و اسناد را ترجمه کنید!',
    visualComingSoonFeature1: 'تشخیص متن از دوربین',
    visualComingSoonFeature2: 'ترجمه تصویر با هوش مصنوعی',
    visualComingSoonFeature3: 'پشتیبانی از گالری و دوربین',

    // Coming Soon version badge
    comingSoonInVersion: 'در v{version} موجود می‌شود',

    // Onboarding
    onboardingSkip: 'رد کردن',
    onboardingNext: 'بعدی',
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: 'به ترکمنی و از ترکمنی ترجمه کنید — سریع و آسان!',
    onboardingPhrasebookTitle: '30 جفت زبان',
    onboardingPhrasebookSubtitle: 'کتاب عبارات با تلفظ، آفلاین کار می‌کند',
    onboardingPhrasebookDemo: 'سلام',
    onboardingPlayAudio: 'پخش صدا',
    onboardingPlaying: 'در حال پخش...',
    onboardingFeatureAudio: 'تلفظ به ترکمنی',
    onboardingFeatureOffline: 'بدون اینترنت کار می‌کند',
    onboardingTranslationTitle: 'ترجمه هوشمند',
    onboardingTranslationSubtitle: 'مترجم متن و دستیار هوش مصنوعی',
    onboardingTextTranslator: 'مترجم متن',
    onboardingTranslate: 'ترجمه',
    onboardingTryAgain: 'دوباره تلاش کنید',
    onboardingVisualTranslator: 'مترجم تصویری',
    onboardingVoiceTranslator: 'مترجم صوتی',
    onboardingAIAssistant: 'دستیار هوش مصنوعی',
    onboardingAIPowered: 'مجهز به هوش مصنوعی',
    onboardingComingSoon: 'به زودی',
    onboardingReadyTitle: 'همه چیز آماده!',
    onboardingReadySubtitle: 'همین الان شروع به یادگیری ترکمنی کنید',
    onboardingGetStarted: 'شروع کنید',
    onboardingTagPhrasebook: '📖 کتاب عبارات',
    onboardingTagAudio: '🔊 تلفظ',
    onboardingTagOffline: '✈️ آفلاین',
    onboardingTagTranslator: '📝 مترجم',
    onboardingTagAI: '🤖 دستیار هوش مصنوعی',
    onboardingTagVisual: '📷 تصویری',
    onboardingTagVoice: '🎤 صوتی',

    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: 'صداهای نصب شده',
    settingsInstalledVoicesDesc: 'مشاهده همه صداهای TTS موجود',
    settingsLoading: 'در حال بارگذاری تنظیمات...',
    settingsDarkMode: 'حالت تاریک',
    settingsDarkModeDesc: 'تغییر به تم تاریک',
    settingsSpeechRate: 'سرعت گفتار',
    settingsSpeechRateDesc: 'تنظیم سرعت تلفظ',
    settingsResetAll: 'بازنشانی همه تنظیمات',
    settingsResetAllDesc: 'بازیابی تنظیمات پیش‌فرض',
    settingsResetConfirm: 'آیا مطمئن هستید که می‌خواهید بازنشانی کنید؟',
    settingsClearSearchHistory: 'پاک کردن تاریخچه جستجو',
    settingsClearSearchHistoryDesc: 'حذف همه سوابق جستجو',
    settingsRateApp: 'امتیاز دادن به برنامه',
    settingsSendFeedback: 'ارسال بازخورد',
    settingsAppearance: 'ظاهر',
    settingsDataStorage: 'داده و ذخیره‌سازی',
  },

  ps: {
    // Pashto mode: Pashto speaker learning Turkmen (RTL)
    home: 'کور',
    search: 'لټون',
    favorites: 'خوښې',
    settings: 'تنظیمات',
    additionalFeatures: 'اضافي ځانګړتیاوې',
    statistics: 'شمېرنه',

    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: 'د ژبې زده کړې لپاره ټولې وسیلې',
    selectCategory: 'کټګورۍ وټاکئ',
    recentlyStudied: 'وروستۍ مطالعه شوي',
    study: 'مطالعه',

    phrasebookTitle: 'د جملو کتاب',
    phrasebookSubtitle: 'په 22 کټګوریو کې 305 جملې',
    visualTranslatorTitle: 'لیدلی ژباړن',
    visualTranslatorSubtitle: 'د کیمرې سره متن سکین کړئ',
    textTranslatorTitle: 'د متن ژباړن',
    textTranslatorSubtitle: 'متن ټایپ او ژباړه کړئ',
    voiceTranslatorTitle: 'د غږ ژباړن',
    voiceTranslatorSubtitle: 'خبرې وکړئ او په ریښتیني وخت کې ژباړه کړئ',
    dictionaryTitle: 'قاموس',
    dictionarySubtitle: 'په v2.0 کې راځي',
    aiAssistantsTitle: 'AI مرستندویان',
    aiAssistantsSubtitle: 'هوښیار لارښوونې او ملاتړ',
    myFavoritesTitle: 'زما خوښې',
    myFavoritesSubtitle: 'خوندي شوي توکي',

    pronunciation: 'تلفظ',
    addToFavorites: 'خوښو ته اضافه کړئ',
    inFavorites: 'په خوښو کې',
    share: 'شریکول',

    settingsTitle: '⚙️ تنظیمات',
    languageInterface: 'د انٹرفیس ژبه',
    switchLanguage: 'ژبه بدله کړئ',
    audio: 'آډیو',
    soundEffects: 'د غږ اغیزې',
    data: 'ډاټا',
    clearHistory: 'تاریخچه پاکه کړئ',
    offlineMode: 'آفلاین حالت',
    about: 'د اپلیکیشن په اړه',
    feedback: 'غبرګون',

    searchPlaceholder: 'په هره ژبه کې جمله ټایپ کړئ...',
    noResults: 'نتیجه ونه موندل شوه',
    searchHistory: 'د لټون تاریخچه',

    cancel: 'لغوه کړئ',
    save: 'خوندي کړئ',
    delete: 'ړنګول',
    confirm: 'تایید کړئ',
    loading: 'بارېږي...',
    error: 'تېروتنه',
    success: 'بریالیتوب',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'د AI سره ژباړه کړئ',
    vtCameraSubtitle: 'د فوري ژباړې لپاره کیمره متن ته ونیسئ',
    vtTakePhoto: 'عکس واخلئ',
    vtChooseGallery: 'د ګالري څخه انتخاب کړئ',
    vtProcessing: 'انځور پروسس کیږي...',
    vtProcessingSubtext: 'د متن پیژندنه او ژباړه',
    vtOcrEngine: 'OCR انجن',
    vtOcrEngineDesc: 'غوره کړئ چې د انځورونو څخه متن څنګه وپیژندل شي.',
    vtOcrSpaceNote: 'وړیا، 25K غوښتنې/میاشت',
    vtFeatures: 'ځانګړتیاوې',
    vtFeatureOcrTitle: 'OCR د متن پیژندنه',
    vtFeatureOcrDesc: 'په 30+ ژبو کې د لوړ دقت سره متن وپیژنئ',
    vtFeatureAiTitle: 'AI د شیانو تشریح',
    vtFeatureAiDesc: 'کله چې متن ونه موندل شي شیان تشریح کړئ',
    vtFeatureSmartTitle: 'هوښیاره ژباړه',
    vtFeatureSmartDesc: 'د AI مرستې سره د شرایطو ژباړه',
    vtFeatureSaveTitle: 'خوندي او شریکول',
    vtFeatureSaveDesc: 'ژباړې په خوښو کې خوندي کړئ او شریک کړئ',
    vtPermissionsText: 'د کیمرې او د عکس کتابتون اجازې ته اړتیا ده',
    vtGrantPermissions: 'اجازې ورکړئ',
    vtRequestingPermissions: 'اجازې غوښتل کیږي...',
    vtAutoFallback: 'کله چې غوره شوی انجن ناکام شي خودکار بدلون فعال دی',

    // Visual Translator - Result Screen
    vtResult: 'پایله',
    vtRecognizedText: 'پیژندل شوی متن',
    vtLanguageLabel: 'ژبه: ',
    vtAiAnalysis: 'AI تحلیل',
    vtTranslation: 'ژباړه',
    vtTargetLabel: 'هدف: ',
    vtPlay: 'غږول',
    vtStop: 'ودرول',
    vtCopy: 'کاپي',
    vtTranslateAnother: 'بله ژباړه',
    vtCopied: 'کاپي شوه',
    vtCopiedMessage: 'ژباړه کلیپ بورډ ته کاپي شوه',

    // Text Translator
    ttHeaderTitle: 'د متن ژباړن',
    ttHeroTitle: 'فوري ژباړه',
    ttHeroSubtitle: 'متن په هره ژبه کې وژباړئ',
    ttSelectLanguage: 'ژبه وټاکئ',
    ttPlaceholder: 'د ژباړې لپاره متن ټایپ کړئ...',
    ttClear: 'پاکول',
    ttTranslate: 'ژباړه',
    ttTranslating: 'ژباړل کیږي...',
    ttPlay: 'غږول',
    ttStop: 'ودرول',
    ttCopy: 'کاپي',
    ttEmptyOutput: 'ژباړه دلته ښکاري',
    ttSourceLanguage: 'سرچینې ژبه',
    ttTargetLanguage: 'د هدف ژبه',
    ttErrorTitle: 'تېروتنه',
    ttErrorEmptyText: 'مهرباني وکړئ د ژباړې لپاره متن دننه کړئ',
    ttErrorTranslationFailed: 'ژباړه ناکامه شوه. بیا هڅه وکړئ.',
    ttErrorNoInternet: 'د انټرنیټ اتصال شتون نلري',
    ttErrorTextTooLong: 'متن ډیر اوږد دی. تر 1000 کرکټرونو پورې.',
    ttCopiedTitle: 'کاپي شوه',
    ttCopiedMessage: 'ژباړه کلیپ بورډ ته کاپي شوه',
    ttInfoTitle: 'معلومات',
    ttInfoCannotSwap: 'ژبې تبدیل نشي کیدای',

    // AI Assistants
    aiHomeTitle: 'AI مرستندویان',
    aiHomeSubtitle: 'د ترکمني ژبې زده کړې کې د مرستې لپاره یو AI مرستندوی غوره کړئ',
    aiInfoText: 'AI مرستندویان پرمختللي ژبني ماډلونه کاروي ترڅو شخصي مرسته چمتو کړي. ځوابونه ممکن څو ثانیې ونیسي.',

    // AI Assistant Names
    aiContextualTipsName: 'د شرایطو مطابق لارښوونې',
    aiConversationTrainerName: 'د خبرو اترو روزونکی',
    aiGrammarHelperName: 'د ګرامر مرستندوی',
    aiCulturalAdvisorName: 'کلتوري مشاور',
    aiGeneralAssistantName: 'عمومي مرستندوی',

    // AI Assistant Descriptions
    aiContextualTipsDesc: 'د خپل اوسني زده کړې شرایطو پر بنسټ هوښیار لارښوونې ترلاسه کړئ',
    aiConversationTrainerDesc: 'ریښتیني خبرې اترې تمرین کړئ او خپل د خبرو کولو مهارتونه ښه کړئ',
    aiGrammarHelperDesc: 'د ترکمني ګرامر قواعدو او جوړښتونو سره سمدستي مرسته ترلاسه کړئ',
    aiCulturalAdvisorDesc: 'د ترکمني کلتور، دودونو او آدابو په اړه زده کړئ',
    aiGeneralAssistantDesc: 'د ترکمني ژبې زده کړې په اړه هر څه وپوښتئ',

    // Welcome Messages
    aiContextualTipsWelcome: 'سلام! زه دلته یم چې تاسو ته د ترکمني زده کړې لپاره ګټورې لارښوونې او بصیرتونه چمتو کړم. له ما څخه هر څه وپوښتئ!',
    aiConversationTrainerWelcome: 'سلام! راځئ په ترکمني کې یو څو خبرې اترې تمرین کړو. زه به ستاسو د خبرو کولو مهارتونو په ښه کولو کې مرسته وکړم!',
    aiGrammarHelperWelcome: 'ښه راغلاست! زه ستاسو د ګرامر مرستندوی یم. له ما څخه د ترکمني ګرامر د هرې قاعدې یا جوړښت په اړه وپوښتئ.',
    aiCulturalAdvisorWelcome: 'سلام! راځئ چې زه تاسو سره د ترکمني کلتور، دودونو او روایاتو په پوهیدو کې مرسته وکړم.',
    aiGeneralAssistantWelcome: 'سلام! زه ستاسو AI مرستندوی یم. په ژباړه، جملو او مختلفو ژبو کې خبرو اترو کې مرسته کولی شم.',

    // ChatScreen UI
    aiInputPlaceholder: 'خپل پیغام ولیکئ...',
    aiThinking: 'فکر کوم...',
    aiErrorMessage: 'بخښنه غواړم، ما یوه تېروتنه ولیده. مهرباني وکړئ بیا هڅه وکړئ.',
    aiClearHistory: 'تاریخچه پاکه کړئ',
    aiClearHistoryTitle: 'تاریخچه پاکه کړئ',
    aiClearHistoryMessage: 'ایا تاسو ډاډه یاست چې ټول پیغامونه حذف کړئ؟',
    aiSelectModel: 'د AI ماډل غوره کړئ',
    aiSelectModelMessage: 'د کارولو لپاره AI ماډل غوره کړئ',
    aiExportChat: 'خبرې اترې صادر کړئ',
    aiCopyAll: 'ټول کاپي کړئ',
    aiResponseSettings: 'د ځواب تنظیمات',
    aiResponseSettingsMessage: 'AI څنګه ځواب ورکړي تنظیم کړئ',
    aiResponseLanguage: 'د ځواب ژبه',
    aiResponseLanguageMessage: 'AI په کومه ژبه ځواب ورکړي',
    aiCreativeMode: 'خلاقه حالت',
    aiBalancedMode: 'متوازن حالت',
    aiPreciseMode: 'دقیق حالت',
    // Voice Translator
    vtHeaderTitle: 'غږیز ژباړونکی',
    vtHeroTitle: 'خبرې وکړئ او ژباړه وکړئ',
    vtHeroSubtitle: 'په خپله ژبه خبرې وکړئ او سمدستي ژباړه ترلاسه کړئ',
    vtTapToSpeak: 'د خبرو کولو لپاره ټک وکړئ',
    vtListening: 'اورېدل کېږي...',
    vtRecognized: 'پیژندل شوی',
    vtPlayOriginal: 'اصلي غږ غوړوئ',
    vtPlayTranslation: 'ژباړه غوړوئ',
    vtCopyTranslation: 'ژباړه کاپي کړئ',
    vtClear: 'پاکه کړئ',
    vtSwapLanguages: 'ژبې تبدیل کړئ',
    vtSelectSourceLanguage: 'سرچینې ژبه وټاکئ',
    vtSelectTargetLanguage: 'موخې ژبه وټاکئ',
    vtErrorNoPermission: 'د مایکروفون اجازه نشته. مهرباني وکړئ په تنظیماتو کې اجازه ورکړئ.',
    vtErrorNoInternet: 'د انټرنیټ اتصال نشته. خپل اتصال وګورئ او بیا هڅه وکړئ.',
    vtErrorRecognitionFailed: 'د غږ پیژندنه ناکامه شوه. مهرباني وکړئ بیا هڅه وکړئ.',
    vtErrorTranslationFailed: 'ژباړه ناکامه شوه. مهرباني وکړئ بیا هڅه وکړئ.',
    vtPermissionTitle: 'د مایکروفون اجازه',
    vtPermissionMessage: 'د دې ځانګړتیا کارولو لپاره مایکروفون ته لاسرسی اړین دی',
    vtGrantPermission: 'اجازه ورکړئ',
    vtComingSoon: 'ډیر ژر',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: 'غږیز ژباړونکی ډیر ژر راځي!',
    voiceComingSoonDesc: 'موږ په ریښتیني وخت کې غږیزه ژباړه کوو. ډیر ژر تاسو خبرې وکړئ او سمدستي ژباړه ترلاسه کړئ!',
    voiceComingSoonFeature1: 'ریښتیني وخت غږ پیژندل',
    voiceComingSoonFeature2: 'سمدستي ژباړه',
    voiceComingSoonFeature3: 'د ژباړې آډیو غږول',
    voiceComingSoonButton: 'کور ته ورګرځه',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: 'ډیر ژر راځي!',
    visualComingSoonDesc: 'موږ له کمرې څخه متن پیژندل کوو. ډیر ژر تاسو نښې، مینو او اسناد ژباړلی شئ!',
    visualComingSoonFeature1: 'له کمرې څخه متن پیژندل',
    visualComingSoonFeature2: 'AI متن پیژندل',
    visualComingSoonFeature3: 'ګالري او کمرې ملاتړ',

    // Coming Soon version badge
    comingSoonInVersion: 'په v{version} کې شتون لري',

    // Onboarding
    onboardingSkip: 'پرېښودل',
    onboardingNext: 'بل',
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: 'ترکمني ته او له ترکمني ژباړه وکړئ — چټک او اسانه!',
    onboardingPhrasebookTitle: '30 ژبې جوړې',
    onboardingPhrasebookSubtitle: 'د تلفظ سره جملې کتاب، آفلاین کار کوي',
    onboardingPhrasebookDemo: 'سلام',
    onboardingPlayAudio: 'آډیو غږول',
    onboardingPlaying: 'غږیږي...',
    onboardingFeatureAudio: 'په ترکمني تلفظ',
    onboardingFeatureOffline: 'پرته له انټرنټ کار کوي',
    onboardingTranslationTitle: 'هوښیار ژباړه',
    onboardingTranslationSubtitle: 'متن ژباړونکی او AI مرستندوی',
    onboardingTextTranslator: 'متن ژباړونکی',
    onboardingTranslate: 'ژباړه',
    onboardingTryAgain: 'بیا هڅه وکړئ',
    onboardingVisualTranslator: 'بصری ژباړونکی',
    onboardingVoiceTranslator: 'غږ ژباړونکی',
    onboardingAIAssistant: 'AI مرستندوی',
    onboardingAIPowered: 'د AI لخوا پرمخ وړل کیږي',
    onboardingComingSoon: 'ډېر ژر راځي',
    onboardingReadyTitle: 'ټول تیار!',
    onboardingReadySubtitle: 'اوس همدا ترکمني زده کول پیل کړئ',
    onboardingGetStarted: 'پیل کړئ',
    onboardingTagPhrasebook: '📖 جملې کتاب',
    onboardingTagAudio: '🔊 تلفظ',
    onboardingTagOffline: '✈️ آفلاین',
    onboardingTagTranslator: '📝 ژباړونکی',
    onboardingTagAI: '🤖 AI مرستندوی',
    onboardingTagVisual: '📷 بصری',
    onboardingTagVoice: '🎤 غږ',

    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: 'نصب شوي غږونه',
    settingsInstalledVoicesDesc: 'ټول موجود TTS غږونه وګورئ',
    settingsLoading: 'تنظیمات بار کیږي...',
    settingsDarkMode: 'تیاره حالت',
    settingsDarkModeDesc: 'تیارې موضوع ته لاړ شئ',
    settingsSpeechRate: 'د خبرو سرعت',
    settingsSpeechRateDesc: 'د تلفظ سرعت تنظیم کړئ',
    settingsResetAll: 'ټول تنظیمات بیا تنظیم کړئ',
    settingsResetAllDesc: 'ډیفالټ تنظیمات بحال کړئ',
    settingsResetConfirm: 'ایا تاسو ډاډه یاست چې غواړئ بیا تنظیم کړئ؟',
    settingsClearSearchHistory: 'د لټون تاریخ پاک کړئ',
    settingsClearSearchHistoryDesc: 'د لټون ټول ریکارډونه حذف کړئ',
    settingsRateApp: 'اپلیکیشن ته درجه ورکړئ',
    settingsSendFeedback: 'نظر واستوئ',
    settingsAppearance: 'بڼه',
    settingsDataStorage: 'ډاټا او ذخیره',
  },

  uz: {
    // Uzbek mode: Uzbek speaker learning Turkmen
    home: 'Bosh sahifa',
    search: 'Qidirish',
    favorites: 'Sevimlilar',
    settings: 'Sozlamalar',
    additionalFeatures: 'Qo\'shimcha xususiyatlar',
    statistics: 'Statistika',

    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: 'Til o\'rganish uchun barcha vositalar',
    selectCategory: 'Kategoriyani tanlang',
    recentlyStudied: 'Yaqinda o\'rganilgan',
    study: 'O\'rganish',

    phrasebookTitle: 'Iboralar kitobi',
    phrasebookSubtitle: '22 kategoriyada 305 ibora',
    visualTranslatorTitle: 'Vizual tarjimon',
    visualTranslatorSubtitle: 'Kamera bilan matnni skanerlash',
    textTranslatorTitle: 'Matn tarjimoni',
    textTranslatorSubtitle: 'Matn kiritish va tarjima qilish',
    voiceTranslatorTitle: 'Ovoz tarjimoni',
    voiceTranslatorSubtitle: 'Gapiring va real vaqtda tarjima qiling',
    dictionaryTitle: 'Lug\'at',
    dictionarySubtitle: 'v2.0 da chiqadi',
    aiAssistantsTitle: 'AI yordamchilar',
    aiAssistantsSubtitle: 'Aqlli maslahatlar va qo\'llab-quvvatlash',
    myFavoritesTitle: 'Mening sevimlilarim',
    myFavoritesSubtitle: 'Saqlangan elementlar',

    pronunciation: 'Talaffuz',
    addToFavorites: 'Sevimlilarga qo\'shish',
    inFavorites: 'Sevimlilarda',
    share: 'Ulashish',

    settingsTitle: '⚙️ Sozlamalar',
    languageInterface: 'Interfeys tili',
    switchLanguage: 'Tilni o\'zgartirish',
    audio: 'Audio',
    soundEffects: 'Ovoz effektlari',
    data: 'Ma\'lumotlar',
    clearHistory: 'Tarixni tozalash',
    offlineMode: 'Oflayn rejim',
    about: 'Ilova haqida',
    feedback: 'Fikr-mulohaza',

    searchPlaceholder: 'Iborani istalgan tilda kiriting...',
    noResults: 'Natija topilmadi',
    searchHistory: 'Qidiruv tarixi',

    cancel: 'Bekor qilish',
    save: 'Saqlash',
    delete: 'O\'chirish',
    confirm: 'Tasdiqlash',
    loading: 'Yuklanmoqda...',
    error: 'Xato',
    success: 'Muvaffaqiyat',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'AI bilan tarjima qiling',
    vtCameraSubtitle: 'Tezkor tarjima uchun kamerani matnga qarating',
    vtTakePhoto: 'Rasm oling',
    vtChooseGallery: 'Galereyadan tanlang',
    vtProcessing: 'Rasm qayta ishlanmoqda...',
    vtProcessingSubtext: 'Matn tanib olinmoqda va tarjima qilinmoqda',
    vtOcrEngine: 'OCR mexanizmi',
    vtOcrEngineDesc: 'Rasmlardan matnni qanday tanishni tanlang.',
    vtOcrSpaceNote: 'Bepul, oyiga 25K so\'rov',
    vtFeatures: 'Xususiyatlar',
    vtFeatureOcrTitle: 'OCR matn tanish',
    vtFeatureOcrDesc: '30+ tilda yuqori aniqlik bilan matnni tanish',
    vtFeatureAiTitle: 'AI ob\'ektlarni tasvirlash',
    vtFeatureAiDesc: 'Matn topilmaganda ob\'ektlarni tasvirlash',
    vtFeatureSmartTitle: 'Aqlli tarjima',
    vtFeatureSmartDesc: 'AI yordami bilan kontekstli tarjima',
    vtFeatureSaveTitle: 'Saqlash va ulashish',
    vtFeatureSaveDesc: 'Tarjimalarni sevimlilarga saqlash va ulashish',
    vtPermissionsText: 'Kamera va foto kutubxona ruxsatlari kerak',
    vtGrantPermissions: 'Ruxsat berish',
    vtRequestingPermissions: 'Ruxsat so\'ralmoqda...',
    vtAutoFallback: 'Tanlangan mexanizm ishlamay qolganda avtomatik almashtirish faol',

    // Visual Translator - Result Screen
    vtResult: 'Natija',
    vtRecognizedText: 'Tanilgan matn',
    vtLanguageLabel: 'Til: ',
    vtAiAnalysis: 'AI tahlili',
    vtTranslation: 'Tarjima',
    vtTargetLabel: 'Maqsad: ',
    vtPlay: 'Ijro etish',
    vtStop: 'To\'xtatish',
    vtCopy: 'Nusxalash',
    vtTranslateAnother: 'Boshqa tarjima',
    vtCopied: 'Nusxalandi',
    vtCopiedMessage: 'Tarjima klipbordga nusxalandi',

    // Text Translator
    ttHeaderTitle: 'Matn tarjimoni',
    ttHeroTitle: 'Tezkor tarjima',
    ttHeroSubtitle: 'Matnni istalgan tilga tarjima qiling',
    ttSelectLanguage: 'Tilni tanlang',
    ttPlaceholder: 'Tarjima uchun matn kiriting...',
    ttClear: 'Tozalash',
    ttTranslate: 'Tarjima qilish',
    ttTranslating: 'Tarjima qilinmoqda...',
    ttPlay: 'Ijro etish',
    ttStop: 'To\'xtatish',
    ttCopy: 'Nusxalash',
    ttEmptyOutput: 'Tarjima bu yerda paydo bo\'ladi',
    ttSourceLanguage: 'Manba til',
    ttTargetLanguage: 'Maqsadli til',
    ttErrorTitle: 'Xato',
    ttErrorEmptyText: 'Iltimos, tarjima uchun matn kiriting',
    ttErrorTranslationFailed: 'Tarjima amalga oshmadi. Qayta urinib ko\'ring.',
    ttErrorNoInternet: 'Internet aloqasi yo\'q',
    ttErrorTextTooLong: 'Matn juda uzun. Maksimal 1000 belgi.',
    ttCopiedTitle: 'Nusxalandi',
    ttCopiedMessage: 'Tarjima klipbordga nusxalandi',
    ttInfoTitle: 'Ma\'lumot',
    ttInfoCannotSwap: 'Tillarni almashtirib bo\'lmaydi',

    // AI Assistants
    aiHomeTitle: 'AI Yordamchilar',
    aiHomeSubtitle: 'Turkman tilini o\'rganishda yordam berish uchun AI yordamchini tanlang',
    aiInfoText: 'AI yordamchilar shaxsiylashtirilgan yordam ko\'rsatish uchun ilg\'or til modellaridan foydalanadi. Javoblar bir necha soniya davom etishi mumkin.',

    // AI Assistant Names
    aiContextualTipsName: 'Kontekstli maslahatlar',
    aiConversationTrainerName: 'Suhbat o\'qituvchisi',
    aiGrammarHelperName: 'Grammatika yordamchisi',
    aiCulturalAdvisorName: 'Madaniy maslahatchi',
    aiGeneralAssistantName: 'Umumiy yordamchi',

    // AI Assistant Descriptions
    aiContextualTipsDesc: 'Joriy o\'rganish kontekstingizga asoslangan aqlli maslahatlar oling',
    aiConversationTrainerDesc: 'Haqiqiy suhbatlarni mashq qiling va gapirish ko\'nikmalaringizni yaxshilang',
    aiGrammarHelperDesc: 'Turkman grammatika qoidalari va tuzilmalari bo\'yicha zudlik bilan yordam oling',
    aiCulturalAdvisorDesc: 'Turkman madaniyati, urf-odatlari va odob-axloqi haqida bilib oling',
    aiGeneralAssistantDesc: 'Turkman tilini o\'rganish haqida har qanday savol bering',

    // Welcome Messages
    aiContextualTipsWelcome: 'Salom! Men sizga turkman tilini o\'rganish uchun foydali maslahatlar va tushunchalar berish uchun shu yerdaman. Menga har qanday savol bering!',
    aiConversationTrainerWelcome: 'Salom! Keling, turkman tilida suhbatlarni mashq qilaylik. Men sizga gapirish ko\'nikmalaringizni yaxshilashga yordam beraman!',
    aiGrammarHelperWelcome: 'Xush kelibsiz! Men sizning grammatika yordamchingizman. Menga har qanday turkman grammatika qoidasi yoki tuzilmasi haqida so\'rang.',
    aiCulturalAdvisorWelcome: 'Salam! Sizga turkman madaniyati, urf-odatlari va an\'analarini tushunishda yordam berishimga ruxsat bering.',
    aiGeneralAssistantWelcome: 'Salom! Men sizning AI yordamchingizman. Tarjimalar, iboralar va turli tillarda muloqot qilishda yordam bera olaman.',

    // ChatScreen UI
    aiInputPlaceholder: 'Xabaringizni yozing...',
    aiThinking: 'O\'ylayapman...',
    aiErrorMessage: 'Kechirasiz, xatolikka duch keldim. Iltimos, qayta urinib ko\'ring.',
    aiClearHistory: 'Tarixni tozalash',
    aiClearHistoryTitle: 'Tarixni Tozalash',
    aiClearHistoryMessage: 'Barcha xabarlarni o\'chirishni xohlaysizmi?',
    aiSelectModel: 'AI modelini tanlang',
    aiSelectModelMessage: 'Foydalanish uchun AI modelini tanlang',
    aiExportChat: 'Suhbatni eksport qilish',
    aiCopyAll: 'Hammasini nusxalash',
    aiResponseSettings: 'Javob sozlamalari',
    aiResponseSettingsMessage: 'AI qanday javob berishini sozlang',
    aiResponseLanguage: 'Javob tili',
    aiResponseLanguageMessage: 'AI qaysi tilda javob berishi kerak',
    aiCreativeMode: 'Ijodiy rejim',
    aiBalancedMode: 'Muvozanatli rejim',
    aiPreciseMode: 'Aniq rejim',
    // Voice Translator
    vtHeaderTitle: 'Ovozli Tarjimon',
    vtHeroTitle: 'Gapiring va Tarjima Qiling',
    vtHeroSubtitle: 'O\'z tilingizda gapiring va bir zumda tarjima oling',
    vtTapToSpeak: 'Gapirish uchun bosing',
    vtListening: 'Tinglanmoqda...',
    vtRecognized: 'Tanildi',
    vtPlayOriginal: 'Asl nusxani ijro eting',
    vtPlayTranslation: 'Tarjimani ijro eting',
    vtCopyTranslation: 'Tarjimani nusxalash',
    vtClear: 'Tozalash',
    vtSwapLanguages: 'Tillarni almashtirish',
    vtSelectSourceLanguage: 'Manba tilini tanlang',
    vtSelectTargetLanguage: 'Maqsad tilini tanlang',
    vtErrorNoPermission: 'Mikrofon ruxsati yo\'q. Iltimos, sozlamalarda ruxsat bering.',
    vtErrorNoInternet: 'Internet aloqasi yo\'q. Ulanishingizni tekshiring va qayta urinib ko\'ring.',
    vtErrorRecognitionFailed: 'Nutqni tanish muvaffaqiyatsiz tugadi. Iltimos, qayta urinib ko\'ring.',
    vtErrorTranslationFailed: 'Tarjima muvaffaqiyatsiz tugadi. Iltimos, qayta urinib ko\'ring.',
    vtPermissionTitle: 'Mikrofon Ruxsati',
    vtPermissionMessage: 'Ushbu xususiyatdan foydalanish uchun mikrofon kirishi talab qilinadi',
    vtGrantPermission: 'Ruxsat Berish',
    vtComingSoon: 'Tez kunda',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: 'Ovozli tarjimon tez orada!',
    voiceComingSoonDesc: 'Biz real vaqtda ovozli tarjima ustida ishlamoqdamiz. Tez orada gapiring va darhol tarjima oling!',
    voiceComingSoonFeature1: 'Real vaqtda ovoz tanish',
    voiceComingSoonFeature2: 'Tezkor tarjima',
    voiceComingSoonFeature3: 'Tarjima audio ijrosi',
    voiceComingSoonButton: 'Bosh sahifaga qaytish',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: 'Tez orada!',
    visualComingSoonDesc: 'Biz kameradan matn tanish ustida ishlamoqdamiz. Tez orada belgilar, menyu va hujjatlarni tarjima qiling!',
    visualComingSoonFeature1: 'Kameradan matn tanish',
    visualComingSoonFeature2: 'AI matn tanish',
    visualComingSoonFeature3: 'Galereya va kamera qo\'llab-quvvatlash',

    // Coming Soon version badge
    comingSoonInVersion: 'v{version} da mavjud',

    // Onboarding
    onboardingSkip: 'O\'tkazib yuborish',
    onboardingNext: 'Keyingisi',
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: 'Turkman tiliga va turkman tilidan tarjima qiling — tez va oson!',
    onboardingPhrasebookTitle: '30 til juftligi',
    onboardingPhrasebookSubtitle: 'Talaffuz bilan iboralar kitobi, oflayn ishlaydi',
    onboardingPhrasebookDemo: 'Salom',
    onboardingPlayAudio: 'Audiоni ijro etish',
    onboardingPlaying: 'Ijro etilmoqda...',
    onboardingFeatureAudio: 'Turkman tilida talaffuz',
    onboardingFeatureOffline: 'Internetsiz ishlaydi',
    onboardingTranslationTitle: 'Aqlli tarjima',
    onboardingTranslationSubtitle: 'Matn tarjimon va AI yordamchi',
    onboardingTextTranslator: 'Matn tarjimon',
    onboardingTranslate: 'Tarjima qilish',
    onboardingTryAgain: 'Qayta urinish',
    onboardingVisualTranslator: 'Vizual tarjimon',
    onboardingVoiceTranslator: 'Ovozli tarjimon',
    onboardingAIAssistant: 'AI yordamchi',
    onboardingAIPowered: 'AI tomonidan quvvatlanadi',
    onboardingComingSoon: 'Tez kunda',
    onboardingReadyTitle: 'Hammasi tayyor!',
    onboardingReadySubtitle: 'Hoziroq turkman tilini o\'rganishni boshlang',
    onboardingGetStarted: 'Boshlash',
    onboardingTagPhrasebook: '📖 Iboralar kitobi',
    onboardingTagAudio: '🔊 Talaffuz',
    onboardingTagOffline: '✈️ Oflayn',
    onboardingTagTranslator: '📝 Tarjimon',
    onboardingTagAI: '🤖 AI yordamchi',
    onboardingTagVisual: '📷 Vizual',
    onboardingTagVoice: '🎤 Ovoz',

    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: "O'rnatilgan ovozlar",
    settingsInstalledVoicesDesc: "Barcha mavjud TTS ovozlarini ko'ring",
    settingsLoading: 'Sozlamalar yuklanmoqda...',
    settingsDarkMode: "Qorong'i rejim",
    settingsDarkModeDesc: "Qorong'i mavzuga o'tish",
    settingsSpeechRate: 'Nutq tezligi',
    settingsSpeechRateDesc: 'Talaffuz tezligini sozlash',
    settingsResetAll: 'Barcha sozlamalarni tiklash',
    settingsResetAllDesc: 'Standart sozlamalarni tiklash',
    settingsResetConfirm: 'Rostdan ham tiklamoqchimisiz?',
    settingsClearSearchHistory: 'Qidiruv tarixini tozalash',
    settingsClearSearchHistoryDesc: "Barcha qidiruv yozuvlarini o'chirish",
    settingsRateApp: 'Ilovani baholash',
    settingsSendFeedback: 'Fikr yuborish',
    settingsAppearance: "Ko'rinish",
    settingsDataStorage: "Ma'lumotlar va saqlash",
  },

  kk: {
    // Kazakh mode: Kazakh speaker learning Turkmen
    home: 'Басты бет',
    search: 'Іздеу',
    favorites: 'Таңдаулылар',
    settings: 'Параметрлер',
    additionalFeatures: 'Қосымша мүмкіндіктер',
    statistics: 'Статистика',

    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: 'Тіл үйрену үшін барлық құралдар',
    selectCategory: 'Санатты таңдаңыз',
    recentlyStudied: 'Жақында үйренілген',
    study: 'Оқу',

    phrasebookTitle: 'Сөйлем кітабы',
    phrasebookSubtitle: '22 санатта 305 сөйлем',
    visualTranslatorTitle: 'Визуалды аудармашы',
    visualTranslatorSubtitle: 'Камерамен мәтінді сканерлеу',
    textTranslatorTitle: 'Мәтін аудармашысы',
    textTranslatorSubtitle: 'Мәтін енгізу және аудару',
    voiceTranslatorTitle: 'Дауыс аудармашысы',
    voiceTranslatorSubtitle: 'Сөйлеңіз және нақты уақытта аударыңыз',
    dictionaryTitle: 'Сөздік',
    dictionarySubtitle: 'v2.0-де шығады',
    aiAssistantsTitle: 'AI көмекшілері',
    aiAssistantsSubtitle: 'Ақылды кеңестер және қолдау',
    myFavoritesTitle: 'Менің таңдаулыларым',
    myFavoritesSubtitle: 'Сақталған элементтер',

    pronunciation: 'Айтылуы',
    addToFavorites: 'Таңдаулыларға қосу',
    inFavorites: 'Таңдаулыларда',
    share: 'Бөлісу',

    settingsTitle: '⚙️ Параметрлер',
    languageInterface: 'Интерфейс тілі',
    switchLanguage: 'Тілді өзгерту',
    audio: 'Аудио',
    soundEffects: 'Дыбыс эффектілері',
    data: 'Деректер',
    clearHistory: 'Тарихты тазалау',
    offlineMode: 'Офлайн режимі',
    about: 'Қолданба туралы',
    feedback: 'Кері байланыс',

    searchPlaceholder: 'Кез келген тілде сөйлем енгізіңіз...',
    noResults: 'Нәтиже табылмады',
    searchHistory: 'Іздеу тарихы',

    cancel: 'Болдырмау',
    save: 'Сақтау',
    delete: 'Жою',
    confirm: 'Растау',
    loading: 'Жүктелуде...',
    error: 'Қате',
    success: 'Сәттілік',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'AI арқылы аудару',
    vtCameraSubtitle: 'Жедел аудару үшін камераны мәтінге бағыттаңыз',
    vtTakePhoto: 'Сурет түсіру',
    vtChooseGallery: 'Галереядан таңдау',
    vtProcessing: 'Сурет өңделуде...',
    vtProcessingSubtext: 'Мәтінді тану және аудару',
    vtOcrEngine: 'OCR қозғалтқышы',
    vtOcrEngineDesc: 'Суреттерден мәтінді қалай тануды таңдаңыз.',
    vtOcrSpaceNote: 'Тегін, айына 25K сұрау',
    vtFeatures: 'Мүмкіндіктер',
    vtFeatureOcrTitle: 'OCR мәтінді тану',
    vtFeatureOcrDesc: '30+ тілде жоғары дәлдікпен мәтінді тану',
    vtFeatureAiTitle: 'AI нысандарды сипаттау',
    vtFeatureAiDesc: 'Мәтін табылмаған кезде нысандарды сипаттау',
    vtFeatureSmartTitle: 'Ақылды аудару',
    vtFeatureSmartDesc: 'AI көмегімен контекстік аудару',
    vtFeatureSaveTitle: 'Сақтау және бөлісу',
    vtFeatureSaveDesc: 'Аудармаларды таңдаулыларға сақтау және бөлісу',
    vtPermissionsText: 'Камера және фото кітапхана рұқсаттары қажет',
    vtGrantPermissions: 'Рұқсат беру',
    vtRequestingPermissions: 'Рұқсаттар сұралуда...',
    vtAutoFallback: 'Таңдалған қозғалтқыш сәтсіз болғанда автоматты ауыстыру қосулы',

    // Visual Translator - Result Screen
    vtResult: 'Нәтиже',
    vtRecognizedText: 'Танылған мәтін',
    vtLanguageLabel: 'Тіл: ',
    vtAiAnalysis: 'AI талдауы',
    vtTranslation: 'Аудару',
    vtTargetLabel: 'Мақсат: ',
    vtPlay: 'Ойнату',
    vtStop: 'Тоқтату',
    vtCopy: 'Көшіру',
    vtTranslateAnother: 'Тағы бір аудару',
    vtCopied: 'Көшірілді',
    vtCopiedMessage: 'Аудару алмасу буферіне көшірілді',

    // Text Translator
    ttHeaderTitle: 'Мәтін аудармашысы',
    ttHeroTitle: 'Жедел аудару',
    ttHeroSubtitle: 'Мәтінді кез келген тілге аударыңыз',
    ttSelectLanguage: 'Тілді таңдау',
    ttPlaceholder: 'Аударуға мәтін енгізіңіз...',
    ttClear: 'Тазалау',
    ttTranslate: 'Аудару',
    ttTranslating: 'Аударылуда...',
    ttPlay: 'Ойнату',
    ttStop: 'Тоқтату',
    ttCopy: 'Көшіру',
    ttEmptyOutput: 'Аудару осында пайда болады',
    ttSourceLanguage: 'Бастапқы тіл',
    ttTargetLanguage: 'Мақсатты тіл',
    ttErrorTitle: 'Қате',
    ttErrorEmptyText: 'Аударуға мәтін енгізіңіз',
    ttErrorTranslationFailed: 'Аудару сәтсіз. Қайталап көріңіз.',
    ttErrorNoInternet: 'Интернет қосылымы жоқ',
    ttErrorTextTooLong: 'Мәтін тым ұзын. Максимум 1000 таңба.',
    ttCopiedTitle: 'Көшірілді',
    ttCopiedMessage: 'Аудару алмасу буферіне көшірілді',
    ttInfoTitle: 'Ақпарат',
    ttInfoCannotSwap: 'Тілдерді ауыстыру мүмкін емес',

    // AI Assistants
    aiHomeTitle: 'AI көмекшілері',
    aiHomeSubtitle: 'Түрікмен тілін үйренуге көмектесетін AI көмекшісін таңдаңыз',
    aiInfoText: 'AI көмекшілері жекелендірілген көмек көрсету үшін жетілдірілген тіл модельдерін пайдаланады. Жауаптар бірнеше секунд алуы мүмкін.',

    // AI Assistant Names
    aiContextualTipsName: 'Контекстік кеңестер',
    aiConversationTrainerName: 'Сөйлесу жаттықтырушысы',
    aiGrammarHelperName: 'Грамматика көмекшісі',
    aiCulturalAdvisorName: 'Мәдени кеңесші',
    aiGeneralAssistantName: 'Жалпы көмекші',

    // AI Assistant Descriptions
    aiContextualTipsDesc: 'Ағымдағы оқу контекстіңізге негізделген ақылды кеңестер алыңыз',
    aiConversationTrainerDesc: 'Нақты сөйлесулерді жаттықтырыңыз және сөйлеу дағдыларыңызды жақсартыңыз',
    aiGrammarHelperDesc: 'Түрікмен грамматикасының ережелері мен құрылымдары бойынша жедел көмек алыңыз',
    aiCulturalAdvisorDesc: 'Түрікмен мәдениеті, әдет-ғұрыптары мен этикеті туралы біліңіз',
    aiGeneralAssistantDesc: 'Түрікмен тілін үйрену туралы кез келген сұрақ қойыңыз',

    // Welcome Messages
    aiContextualTipsWelcome: 'Сәлеметсіз бе! Мен сізге түрікмен тілін үйрену үшін пайдалы кеңестер мен түсініктер беру үшін мұндамын. Маған кез келген сұрақ қойыңыз!',
    aiConversationTrainerWelcome: 'Сәлеметсіз бе! Түрікмен тілінде бірнеше сөйлесуді жаттықтырайық. Мен сізге сөйлеу дағдыларыңызды жақсартуға көмектесемін!',
    aiGrammarHelperWelcome: 'Қош келдіңіз! Мен сіздің грамматика көмекшіңізбін. Маған түрікмен грамматикасының кез келген ережесі немесе құрылымы туралы сұраңыз.',
    aiCulturalAdvisorWelcome: 'Салам! Сізге түрікмен мәдениеті, әдет-ғұрыптары мен дәстүрлерін түсінуге көмектесейін.',
    aiGeneralAssistantWelcome: 'Сәлеметсіз бе! Мен сіздің AI көмекшіңізбін. Аудармалар, сөз тіркестері және әртүрлі тілдерде қарым-қатынас жасауда көмектесе аламын.',

    // ChatScreen UI
    aiInputPlaceholder: 'Хабарламаңызды теріңіз...',
    aiThinking: 'Ойланып жатырмын...',
    aiErrorMessage: 'Кешіріңіз, қателікке тап болдым. Қайталап көріңіз.',
    aiClearHistory: 'Тарихты тазалау',
    aiClearHistoryTitle: 'Тарихты Тазалау',
    aiClearHistoryMessage: 'Барлық хабарларды жойғыңыз келе ме?',
    aiSelectModel: 'AI моделін таңдау',
    aiSelectModelMessage: 'Қолданылатын AI моделін таңдаңыз',
    aiExportChat: 'Чатты экспорттау',
    aiCopyAll: 'Барлығын көшіру',
    aiResponseSettings: 'Жауап параметрлері',
    aiResponseSettingsMessage: 'AI қалай жауап беретінін реттеңіз',
    aiResponseLanguage: 'Жауап тілі',
    aiResponseLanguageMessage: 'AI қай тілде жауап беруі керек',
    aiCreativeMode: 'Шығармашылық режим',
    aiBalancedMode: 'Теңгерімді режим',
    aiPreciseMode: 'Нақты режим',
    // Voice Translator
    vtHeaderTitle: 'Дауыстық Аудармашы',
    vtHeroTitle: 'Сөйлеңіз және Аударыңыз',
    vtHeroSubtitle: 'Өз тіліңізде сөйлеңіз және лезде аударма алыңыз',
    vtTapToSpeak: 'Сөйлеу үшін басыңыз',
    vtListening: 'Тыңдап жатыр...',
    vtRecognized: 'Танылды',
    vtPlayOriginal: 'Түпнұсқаны ойнату',
    vtPlayTranslation: 'Аударманы ойнату',
    vtCopyTranslation: 'Аударманы көшіру',
    vtClear: 'Тазалау',
    vtSwapLanguages: 'Тілдерді ауыстыру',
    vtSelectSourceLanguage: 'Бастапқы тілді таңдаңыз',
    vtSelectTargetLanguage: 'Мақсатты тілді таңдаңыз',
    vtErrorNoPermission: 'Микрофон рұқсаты жоқ. Параметрлерде рұқсат беріңіз.',
    vtErrorNoInternet: 'Интернет қосылымы жоқ. Байланысыңызды тексеріп, қайталап көріңіз.',
    vtErrorRecognitionFailed: 'Сөйлеуді тану сәтсіз аяқталды. Қайталап көріңіз.',
    vtErrorTranslationFailed: 'Аударма сәтсіз аяқталды. Қайталап көріңіз.',
    vtPermissionTitle: 'Микрофон Рұқсаты',
    vtPermissionMessage: 'Бұл мүмкіндікті пайдалану үшін микрофон қол жетімділігі қажет',
    vtGrantPermission: 'Рұқсат Беру',
    vtComingSoon: 'Жақында',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: 'Дауыстық аудармашы',
    voiceComingSoonDesc: 'Бұл мүмкіндік жақында қолжетімді болады',
    voiceComingSoonFeature1: '🎤 Сөйлеу арқылы аударыңыз',
    voiceComingSoonFeature2: '🌍 30+ тілді қолдайды',
    voiceComingSoonFeature3: '⚡ Лезде аудару',
    voiceComingSoonButton: 'Түсіндім',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: 'Жақында!',
    visualComingSoonDesc: 'Біз камерадан мәтінді тану мүмкіндігін әзірлеп жатырмыз. Жақында жазуларды, мәзірлерді және құжаттарды аудара аласыз!',
    visualComingSoonFeature1: 'Камерадан мәтінді тану',
    visualComingSoonFeature2: 'AI мәтінді тану',
    visualComingSoonFeature3: 'Галерея және камера қолдауы',

    // Coming Soon version badge
    comingSoonInVersion: 'v{version} нұсқасында шығады',

    // Onboarding
    onboardingSkip: 'Өткізіп жіберу',
    onboardingNext: 'Келесі',
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: 'Түрікмен тіліне және түрікмен тілінен аударыңыз — жылдам және оңай!',
    onboardingPhrasebookTitle: '30 тіл жұбы',
    onboardingPhrasebookSubtitle: 'Айтылыммен сөйлем кітабы, офлайн жұмыс істейді',
    onboardingPhrasebookDemo: 'Сәлем',
    onboardingPlayAudio: 'Аудио ойнату',
    onboardingPlaying: 'Ойнатылуда...',
    onboardingFeatureAudio: 'Түрікмен тілінде айтылым',
    onboardingFeatureOffline: 'Интернетсіз жұмыс істейді',
    onboardingTranslationTitle: 'Ақылды аударма',
    onboardingTranslationSubtitle: 'Мәтін аудармашысы және AI көмекші',
    onboardingTextTranslator: 'Мәтін аудармашысы',
    onboardingTranslate: 'Аударма',
    onboardingTryAgain: 'Қайталап көру',
    onboardingVisualTranslator: 'Көрнекі аудармашы',
    onboardingVoiceTranslator: 'Дауыс аудармашысы',
    onboardingAIAssistant: 'AI көмекші',
    onboardingAIPowered: 'AI қуатымен',
    onboardingComingSoon: 'Жақында',
    onboardingReadyTitle: 'Бәрі дайын!',
    onboardingReadySubtitle: 'Қазір түрікмен тілін үйренуді бастаңыз',
    onboardingGetStarted: 'Бастау',
    onboardingTagPhrasebook: '📖 Сөйлем кітабы',
    onboardingTagAudio: '🔊 Айтылым',
    onboardingTagOffline: '✈️ Офлайн',
    onboardingTagTranslator: '📝 Аудармашы',
    onboardingTagAI: '🤖 AI көмекші',
    onboardingTagVisual: '📷 Көрнекі',
    onboardingTagVoice: '🎤 Дауыс',

    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: 'Орнатылған дауыстар',
    settingsInstalledVoicesDesc: 'Барлық қолжетімді TTS дауыстарын көру',
    settingsLoading: 'Параметрлер жүктелуде...',
    settingsDarkMode: 'Қараңғы режим',
    settingsDarkModeDesc: 'Қараңғы тақырыпқа ауысу',
    settingsSpeechRate: 'Сөйлеу жылдамдығы',
    settingsSpeechRateDesc: 'Айту жылдамдығын реттеу',
    settingsResetAll: 'Барлық параметрлерді қалпына келтіру',
    settingsResetAllDesc: 'Әдепкі параметрлерді қалпына келтіру',
    settingsResetConfirm: 'Шынымен қалпына келтіргіңіз келе ме?',
    settingsClearSearchHistory: 'Іздеу тарихын тазалау',
    settingsClearSearchHistoryDesc: 'Барлық іздеу жазбаларын жою',
    settingsRateApp: 'Қолданбаны бағалау',
    settingsSendFeedback: 'Пікір жіберу',
    settingsAppearance: 'Көрініс',
    settingsDataStorage: 'Деректер мен сақтау',
  },

  az: {
    // Azerbaijani mode: Azerbaijani speaker learning Turkmen
    home: 'Ana səhifə',
    search: 'Axtar',
    favorites: 'Sevimlilər',
    settings: 'Parametrlər',
    additionalFeatures: 'Əlavə xüsusiyyətlər',
    statistics: 'Statistika',

    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: 'Dil öyrənmək üçün bütün alətlər',
    selectCategory: 'Kateqoriya seçin',
    recentlyStudied: 'Son öyrənilənlər',
    study: 'Öyrən',

    phrasebookTitle: 'İfadələr kitabı',
    phrasebookSubtitle: '22 kateqoriyada 305 ifadə',
    visualTranslatorTitle: 'Vizual tərcüməçi',
    visualTranslatorSubtitle: 'Kamera ilə mətn skan et',
    textTranslatorTitle: 'Mətn tərcüməçisi',
    textTranslatorSubtitle: 'Mətn yaz və tərcümə et',
    voiceTranslatorTitle: 'Səs tərcüməçisi',
    voiceTranslatorSubtitle: 'Danış və real vaxtda tərcümə et',
    dictionaryTitle: 'Lüğət',
    dictionarySubtitle: 'v2.0-da gələcək',
    aiAssistantsTitle: 'Sİ köməkçiləri',
    aiAssistantsSubtitle: 'Ağıllı məsləhətlər və dəstək',
    myFavoritesTitle: 'Mənim sevimlilərim',
    myFavoritesSubtitle: 'Saxlanmış elementlər',

    pronunciation: 'Tələffüz',
    addToFavorites: 'Sevimlilərə əlavə et',
    inFavorites: 'Sevimlilərdə',
    share: 'Paylaş',

    settingsTitle: '⚙️ Parametrlər',
    languageInterface: 'İnterfeys dili',
    switchLanguage: 'Dili dəyiş',
    audio: 'Audio',
    soundEffects: 'Səs effektləri',
    data: 'Məlumat',
    clearHistory: 'Tarixçəni təmizlə',
    offlineMode: 'Oflayn rejim',
    about: 'Tətbiq haqqında',
    feedback: 'Rəy',

    searchPlaceholder: 'İstənilən dildə ifadə yazın...',
    noResults: 'Nəticə tapılmadı',
    searchHistory: 'Axtarış tarixçəsi',

    cancel: 'Ləğv et',
    save: 'Saxla',
    delete: 'Sil',
    confirm: 'Təsdiq et',
    loading: 'Yüklənir...',
    error: 'Xəta',
    success: 'Uğurlu',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'Sİ ilə tərcümə et',
    vtCameraSubtitle: 'Ani tərcümə üçün kameranı mətinə yönəlt',
    vtTakePhoto: 'Şəkil çək',
    vtChooseGallery: 'Qalereyadan seç',
    vtProcessing: 'Şəkil işlənir...',
    vtProcessingSubtext: 'Mətn tanınır və tərcümə edilir',
    vtOcrEngine: 'OCR mühərriki',
    vtOcrEngineDesc: 'Şəkillərdən mətni necə tanıyacağınızı seçin.',
    vtOcrSpaceNote: 'Pulsuz, ayda 25K sorğu',
    vtFeatures: 'Xüsusiyyətlər',
    vtFeatureOcrTitle: 'OCR mətn tanıma',
    vtFeatureOcrDesc: '30+ dildə yüksək dəqiqliklə mətni tanıyır',
    vtFeatureAiTitle: 'Sİ obyekt təsviri',
    vtFeatureAiDesc: 'Mətn tapılmadıqda obyektləri təsvir edir',
    vtFeatureSmartTitle: 'Ağıllı tərcümə',
    vtFeatureSmartDesc: 'Sİ dəstəyi ilə kontekstual tərcümə',
    vtFeatureSaveTitle: 'Saxla və paylaş',
    vtFeatureSaveDesc: 'Tərcümələri sevimlilərə saxla və paylaş',
    vtPermissionsText: 'Kamera və foto kitabxana icazələri tələb olunur',
    vtGrantPermissions: 'İcazə ver',
    vtRequestingPermissions: 'İcazələr tələb edilir...',
    vtAutoFallback: 'Seçilmiş mühərrik uğursuz olduqda avtomatik keçid aktivdir',

    // Visual Translator - Result Screen
    vtResult: 'Nəticə',
    vtRecognizedText: 'Tanınmış mətn',
    vtLanguageLabel: 'Dil: ',
    vtAiAnalysis: 'Sİ təhlili',
    vtTranslation: 'Tərcümə',
    vtTargetLabel: 'Hədəf: ',
    vtPlay: 'Oxut',
    vtStop: 'Dayandır',
    vtCopy: 'Kopyala',
    vtTranslateAnother: 'Başqa tərcümə',
    vtCopied: 'Kopyalandı',
    vtCopiedMessage: 'Tərcümə buferə kopyalandı',

    // Text Translator
    ttHeaderTitle: 'Mətn tərcüməçisi',
    ttHeroTitle: 'Ani tərcümə',
    ttHeroSubtitle: 'Mətni istənilən dilə tərcümə et',
    ttSelectLanguage: 'Dil seç',
    ttPlaceholder: 'Tərcümə üçün mətn yazın...',
    ttClear: 'Təmizlə',
    ttTranslate: 'Tərcümə et',
    ttTranslating: 'Tərcümə edilir...',
    ttPlay: 'Oxut',
    ttStop: 'Dayandır',
    ttCopy: 'Kopyala',
    ttEmptyOutput: 'Tərcümə burada görünəcək',
    ttSourceLanguage: 'Mənbə dil',
    ttTargetLanguage: 'Hədəf dil',
    ttErrorTitle: 'Xəta',
    ttErrorEmptyText: 'Tərcümə üçün mətn daxil edin',
    ttErrorTranslationFailed: 'Tərcümə uğursuz oldu. Yenidən cəhd edin.',
    ttErrorNoInternet: 'İnternet bağlantısı yoxdur',
    ttErrorTextTooLong: 'Mətn çox uzundur. Maksimum 1000 simvol.',
    ttCopiedTitle: 'Kopyalandı',
    ttCopiedMessage: 'Tərcümə buferə kopyalandı',
    ttInfoTitle: 'Məlumat',
    ttInfoCannotSwap: 'Dilləri dəyişmək mümkün deyil',

    // AI Assistants
    aiHomeTitle: 'AI Köməkçiləri',
    aiHomeSubtitle: 'Türkmən dilini öyrənməyə kömək etmək üçün AI köməkçisi seçin',
    aiInfoText: 'AI köməkçiləri fərdiləşdirilmiş kömək göstərmək üçün qabaqcıl dil modellərindən istifadə edir. Cavablar bir neçə saniyə çəkə bilər.',

    // AI Assistant Names
    aiContextualTipsName: 'Kontekst məsləhətləri',
    aiConversationTrainerName: 'Söhbət məşqçisi',
    aiGrammarHelperName: 'Qrammatika köməkçisi',
    aiCulturalAdvisorName: 'Mədəni məsləhətçi',
    aiGeneralAssistantName: 'Ümumi köməkçi',

    // AI Assistant Descriptions
    aiContextualTipsDesc: 'Cari öyrənmə kontekstinizə əsaslanaraq ağıllı məsləhətlər əldə edin',
    aiConversationTrainerDesc: 'Həqiqi söhbətləri məşq edin və danışıq bacarıqlarınızı təkmilləşdirin',
    aiGrammarHelperDesc: 'Türkmən qrammatika qaydaları və strukturları üzrə dərhal kömək alın',
    aiCulturalAdvisorDesc: 'Türkmən mədəniyyəti, adət-ənənələri və etiketi haqqında öyrənin',
    aiGeneralAssistantDesc: 'Türkmən dilini öyrənmək haqqında hər hansı sual verin',

    // Welcome Messages
    aiContextualTipsWelcome: 'Salam! Mən sizə türkmən dilini öyrənmək üçün faydalı məsləhətlər və fikirlər təqdim etmək üçün buradayam. Mənə hər şeyi soruşun!',
    aiConversationTrainerWelcome: 'Salam! Gəlin türkmən dilində bir neçə söhbət məşq edək. Mən sizə danışıq bacarıqlarınızı təkmilləşdirməyə kömək edəcəyəm!',
    aiGrammarHelperWelcome: 'Xoş gəlmisiniz! Mən sizin qrammatika köməkçinizəm. Mənə türkmən qrammatikasının hər hansı qaydası və ya strukturu haqqında soruşun.',
    aiCulturalAdvisorWelcome: 'Salam! Qoy mən sizə türkmən mədəniyyəti, adət-ənənələri və ənənələrini başa düşməyə kömək edim.',
    aiGeneralAssistantWelcome: 'Salam! Mən sizin AI köməkçinizəm. Tərcümələr, ifadələr və müxtəlif dillərdə ünsiyyətdə kömək edə bilərəm.',

    // ChatScreen UI
    aiInputPlaceholder: 'Mesajınızı yazın...',
    aiThinking: 'Düşünürəm...',
    aiErrorMessage: 'Bağışlayın, xəta ilə üzləşdim. Zəhmət olmasa yenidən cəhd edin.',
    aiClearHistory: 'Tarixçəni təmizlə',
    aiClearHistoryTitle: 'Tarixçəni Təmizlə',
    aiClearHistoryMessage: 'Bütün mesajları silmək istədiyinizə əminsiniz?',
    aiSelectModel: 'AI modelini seçin',
    aiSelectModelMessage: 'İstifadə etmək üçün AI modelini seçin',
    aiExportChat: 'Söhbəti ixrac edin',
    aiCopyAll: 'Hamısını kopyala',
    aiResponseSettings: 'Cavab parametrləri',
    aiResponseSettingsMessage: 'AI-nin necə cavab verəcəyini konfiqurasiya edin',
    aiResponseLanguage: 'Cavab dili',
    aiResponseLanguageMessage: 'AI hansı dildə cavab verməlidir',
    aiCreativeMode: 'Yaradıcı rejim',
    aiBalancedMode: 'Balanslaşdırılmış rejim',
    aiPreciseMode: 'Dəqiq rejim',
    // Voice Translator
    vtHeaderTitle: 'Səs Tərcüməçisi',
    vtHeroTitle: 'Danışın və Tərcümə Edin',
    vtHeroSubtitle: 'Öz dilinizdə danışın və ani tərcümə əldə edin',
    vtTapToSpeak: 'Danışmaq üçün toxunun',
    vtListening: 'Dinləyir...',
    vtRecognized: 'Tanındı',
    vtPlayOriginal: 'Orijinalı oxut',
    vtPlayTranslation: 'Tərcüməni oxut',
    vtCopyTranslation: 'Tərcüməni kopyala',
    vtClear: 'Təmizlə',
    vtSwapLanguages: 'Dilləri dəyiş',
    vtSelectSourceLanguage: 'Mənbə dilini seçin',
    vtSelectTargetLanguage: 'Hədəf dilini seçin',
    vtErrorNoPermission: 'Mikrofon icazəsi yoxdur. Zəhmət olmasa parametrlərdə icazə verin.',
    vtErrorNoInternet: 'İnternet bağlantısı yoxdur. Bağlantınızı yoxlayın və yenidən cəhd edin.',
    vtErrorRecognitionFailed: 'Nitq tanıma uğursuz oldu. Zəhmət olmasa yenidən cəhd edin.',
    vtErrorTranslationFailed: 'Tərcümə uğursuz oldu. Zəhmət olmasa yenidən cəhd edin.',
    vtPermissionTitle: 'Mikrofon İcazəsi',
    vtPermissionMessage: 'Bu xüsusiyyətdən istifadə etmək üçün mikrofon girişi tələb olunur',
    vtGrantPermission: 'İcazə Ver',
    vtComingSoon: 'Tezliklə',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: 'Səsli tərcüməçi',
    voiceComingSoonDesc: 'Bu funksiya tezliklə əlçatan olacaq',
    voiceComingSoonFeature1: '🎤 Danışaraq tərcümə edin',
    voiceComingSoonFeature2: '🌍 30+ dili dəstəkləyir',
    voiceComingSoonFeature3: '⚡ Ani tərcümə',
    voiceComingSoonButton: 'Anladım',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: 'Tezliklə!',
    visualComingSoonDesc: 'Kameradan mətn tanıma xüsusiyyəti üzərində işləyirik. Tezliklə yazıları, menyuları və sənədləri tərcümə edə biləcəksiniz!',
    visualComingSoonFeature1: 'Kameradan mətn tanıma',
    visualComingSoonFeature2: 'AI mətn tanıma',
    visualComingSoonFeature3: 'Qalereya və kamera dəstəyi',

    // Coming Soon version badge
    comingSoonInVersion: 'v{version}-da gələcək',

    // Onboarding
    onboardingSkip: 'Keç',
    onboardingNext: 'Növbəti',
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: 'Türkmən dilinə və türkmən dilindən tərcümə edin — sürətli və asan!',
    onboardingPhrasebookTitle: '30 dil cüt',
    onboardingPhrasebookSubtitle: 'Tələffüzlü ifadələr kitabı, oflayn işləyir',
    onboardingPhrasebookDemo: 'Salam',
    onboardingPlayAudio: 'Audio oxut',
    onboardingPlaying: 'Oxudulur...',
    onboardingFeatureAudio: 'Türkmən dilində tələffüz',
    onboardingFeatureOffline: 'İnternetsiz işləyir',
    onboardingTranslationTitle: 'Ağıllı tərcümə',
    onboardingTranslationSubtitle: 'Mətn tərcüməçisi və AI köməkçi',
    onboardingTextTranslator: 'Mətn tərcüməçisi',
    onboardingTranslate: 'Tərcümə et',
    onboardingTryAgain: 'Yenidən cəhd et',
    onboardingVisualTranslator: 'Vizual tərcüməçi',
    onboardingVoiceTranslator: 'Səsli tərcüməçi',
    onboardingAIAssistant: 'AI köməkçi',
    onboardingAIPowered: 'AI ilə işləyir',
    onboardingComingSoon: 'Tezliklə',
    onboardingReadyTitle: 'Hamısı hazırdır!',
    onboardingReadySubtitle: 'İndi türkmən dilini öyrənməyə başlayın',
    onboardingGetStarted: 'Başla',
    onboardingTagPhrasebook: '📖 İfadələr kitabı',
    onboardingTagAudio: '🔊 Tələffüz',
    onboardingTagOffline: '✈️ Oflayn',
    onboardingTagTranslator: '📝 Tərcüməçi',
    onboardingTagAI: '🤖 AI köməkçi',
    onboardingTagVisual: '📷 Vizual',
    onboardingTagVoice: '🎤 Səs',

    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: 'Quraşdırılmış səslər',
    settingsInstalledVoicesDesc: 'Bütün mövcud TTS səslərini göstər',
    settingsLoading: 'Parametrlər yüklənir...',
    settingsDarkMode: 'Qaranlıq rejim',
    settingsDarkModeDesc: 'Qaranlıq mövzuya keç',
    settingsSpeechRate: 'Danışıq sürəti',
    settingsSpeechRateDesc: 'Tələffüz sürətini tənzimləyin',
    settingsResetAll: 'Bütün parametrləri sıfırla',
    settingsResetAllDesc: 'Defolt parametrləri bərpa et',
    settingsResetConfirm: 'Sıfırlamaq istədiyinizə əminsiniz?',
    settingsClearSearchHistory: 'Axtarış tarixçəsini təmizlə',
    settingsClearSearchHistoryDesc: 'Bütün axtarış qeydlərini sil',
    settingsRateApp: 'Tətbiqi qiymətləndir',
    settingsSendFeedback: 'Rəy göndər',
    settingsAppearance: 'Görünüş',
    settingsDataStorage: 'Məlumat və yaddaş',
  },

  ky: {
    // Kyrgyz mode: Kyrgyz speaker learning Turkmen
    home: 'Башкы бет',
    search: 'Издөө',
    favorites: 'Тандалмалар',
    settings: 'Жөндөөлөр',
    additionalFeatures: 'Кошумча мүмкүнчүлүктөр',
    statistics: 'Статистика',

    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: 'Тил үйрөнүү үчүн бардык куралдар',
    selectCategory: 'Категорияны тандоо',
    recentlyStudied: 'Жакында үйрөнгөндөр',
    study: 'Окуу',

    phrasebookTitle: 'Сөздөр китеби',
    phrasebookSubtitle: '22 категорияда 305 сөз',
    visualTranslatorTitle: 'Визуалдык котормочу',
    visualTranslatorSubtitle: 'Камера менен текст сканерлөө',
    textTranslatorTitle: 'Текст котормочусу',
    textTranslatorSubtitle: 'Текст жазуу жана которуу',
    voiceTranslatorTitle: 'Үн котормочусу',
    voiceTranslatorSubtitle: 'Сүйлөңүз жана реалдуу убакытта которуңуз',
    dictionaryTitle: 'Сөздүк',
    dictionarySubtitle: 'v2.0-до чыгат',
    aiAssistantsTitle: 'AI жардамчылары',
    aiAssistantsSubtitle: 'Акылдуу кеңештер жана колдоо',
    myFavoritesTitle: 'Менин тандалмаларым',
    myFavoritesSubtitle: 'Сакталган нерселер',

    pronunciation: 'Айтылышы',
    addToFavorites: 'Тандалмаларга кошуу',
    inFavorites: 'Тандалмаларда',
    share: 'Бөлүшүү',

    settingsTitle: '⚙️ Жөндөөлөр',
    languageInterface: 'Интерфейс тили',
    switchLanguage: 'Тилди өзгөртүү',
    audio: 'Аудио',
    soundEffects: 'Үн эффектери',
    data: 'Маалыматтар',
    clearHistory: 'Тарыхты тазалоо',
    offlineMode: 'Офлайн режими',
    about: 'Колдонмо жөнүндө',
    feedback: 'Пикир',

    searchPlaceholder: 'Каалаган тилде сөз киргизиңиз...',
    noResults: 'Жыйынтык табылган жок',
    searchHistory: 'Издөө тарыхы',

    cancel: 'Жокко чыгаруу',
    save: 'Сактоо',
    delete: 'Өчүрүү',
    confirm: 'Ырастоо',
    loading: 'Жүктөлүүдө...',
    error: 'Ката',
    success: 'Ийгилик',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'AI менен которуу',
    vtCameraSubtitle: 'Тез которуу үчүн камераны текстке багыттаңыз',
    vtTakePhoto: 'Сүрөт тартуу',
    vtChooseGallery: 'Галереядан тандоо',
    vtProcessing: 'Сүрөт иштетилүүдө...',
    vtProcessingSubtext: 'Текстти таануу жана которуу',
    vtOcrEngine: 'OCR кыймылдаткычы',
    vtOcrEngineDesc: 'Сүрөттөрдөн текстти кантип тааныйды тандаңыз.',
    vtOcrSpaceNote: 'Акысыз, айына 25K суроо',
    vtFeatures: 'Мүмкүнчүлүктөр',
    vtFeatureOcrTitle: 'OCR текстти таануу',
    vtFeatureOcrDesc: '30+ тилде жогорку тактык менен текстти таануу',
    vtFeatureAiTitle: 'AI нерселерди сыпаттоо',
    vtFeatureAiDesc: 'Текст табылбаса нерселерди сыпаттайт',
    vtFeatureSmartTitle: 'Акылдуу котормо',
    vtFeatureSmartDesc: 'AI жардамы менен контексттик котормо',
    vtFeatureSaveTitle: 'Сактоо жана бөлүшүү',
    vtFeatureSaveDesc: 'Котормолорду тандалмаларга сактоо жана бөлүшүү',
    vtPermissionsText: 'Камера жана фото китепкана уруксаттары керек',
    vtGrantPermissions: 'Уруксат берүү',
    vtRequestingPermissions: 'Уруксаттар суралууда...',
    vtAutoFallback: 'Тандалган кыймылдаткыч иштебесе автоматтык которуу иштейт',

    // Visual Translator - Result Screen
    vtResult: 'Жыйынтык',
    vtRecognizedText: 'Таанылган текст',
    vtLanguageLabel: 'Тил: ',
    vtAiAnalysis: 'AI анализи',
    vtTranslation: 'Котормо',
    vtTargetLabel: 'Максат: ',
    vtPlay: 'Ойнотуу',
    vtStop: 'Токтотуу',
    vtCopy: 'Көчүрүү',
    vtTranslateAnother: 'Дагы которуу',
    vtCopied: 'Көчүрүлдү',
    vtCopiedMessage: 'Котормо буферге көчүрүлдү',

    // Text Translator
    ttHeaderTitle: 'Текст котормочусу',
    ttHeroTitle: 'Тез котормо',
    ttHeroSubtitle: 'Текстти каалаган тилге которуңуз',
    ttSelectLanguage: 'Тилди тандоо',
    ttPlaceholder: 'Которуу үчүн текст киргизиңиз...',
    ttClear: 'Тазалоо',
    ttTranslate: 'Которуу',
    ttTranslating: 'Которулууда...',
    ttPlay: 'Ойнотуу',
    ttStop: 'Токтотуу',
    ttCopy: 'Көчүрүү',
    ttEmptyOutput: 'Котормо бул жерде пайда болот',
    ttSourceLanguage: 'Башталгыч тил',
    ttTargetLanguage: 'Максат тил',
    ttErrorTitle: 'Ката',
    ttErrorEmptyText: 'Которуу үчүн текст киргизиңиз',
    ttErrorTranslationFailed: 'Котормо ийгиликсиз болду. Кайра аракет кылыңыз.',
    ttErrorNoInternet: 'Интернет байланышы жок',
    ttErrorTextTooLong: 'Текст өтө узун. Максималдуу 1000 белги.',
    ttCopiedTitle: 'Көчүрүлдү',
    ttCopiedMessage: 'Котормо буферге көчүрүлдү',
    ttInfoTitle: 'Маалымат',
    ttInfoCannotSwap: 'Тилдерди алмаштыруу мүмкүн эмес',

    // AI Assistants
    aiHomeTitle: 'AI жардамчылары',
    aiHomeSubtitle: 'Түркмөн тилин үйрөнүүгө жардам берүү үчүн AI жардамчысын тандаңыз',
    aiInfoText: 'AI жардамчылары жекелештирилген жардам көрсөтүү үчүн өркүндөтүлгөн тил моделдерин колдонушат. Жооптор бир нече секунд алышы мүмкүн.',

    // AI Assistant Names
    aiContextualTipsName: 'Контексттик кеңештер',
    aiConversationTrainerName: 'Сүйлөшүү машыктыргычы',
    aiGrammarHelperName: 'Грамматика жардамчысы',
    aiCulturalAdvisorName: 'Маданий кеңешчи',
    aiGeneralAssistantName: 'Жалпы жардамчы',

    // AI Assistant Descriptions
    aiContextualTipsDesc: 'Учурдагы окуу контекстиңизге негизделген акылдуу кеңештерди алыңыз',
    aiConversationTrainerDesc: 'Чыныгы сүйлөшүүлөрдү машыктырыңыз жана сүйлөө жөндөмүңүздү өркүндөтүңүз',
    aiGrammarHelperDesc: 'Түркмөн грамматикасынын эрежелери жана түзүлүшү боюнча тез жардам алыңыз',
    aiCulturalAdvisorDesc: 'Түркмөн маданияты, салттары жана этикеттери жөнүндө билиңиз',
    aiGeneralAssistantDesc: 'Түркмөн тилин үйрөнүү жөнүндө каалаган суроо бериңиз',

    // Welcome Messages
    aiContextualTipsWelcome: 'Саламатсызбы! Мен сизге түркмөн тилин үйрөнүү үчүн пайдалуу кеңештерди жана түшүнүктөрдү берүү үчүн бул жердемин. Мага каалаган суроо бериңиз!',
    aiConversationTrainerWelcome: 'Саламатсызбы! Түркмөн тилинде бир нече сүйлөшүүнү машыктырайлы. Мен сизге сүйлөө жөндөмүңүздү өркүндөтүүгө жардам берем!',
    aiGrammarHelperWelcome: 'Кош келиңиз! Мен сиздин грамматика жардамчыңызмын. Мага түркмөн грамматикасынын каалаган эрежеси же түзүлүшү жөнүндө сураңыз.',
    aiCulturalAdvisorWelcome: 'Салам! Сизге түркмөн маданиятын, салттарын жана үрп-адаттарын түшүнүүгө жардам берейин.',
    aiGeneralAssistantWelcome: 'Саламатсызбы! Мен сиздин AI жардамчыңызмын. Которуулар, сөз айкаштар жана ар кандай тилдерде баарлашууда жардам бере алам.',

    // ChatScreen UI
    aiInputPlaceholder: 'Билдирүүңүздү жазыңыз...',
    aiThinking: 'Ойлонуп жатам...',
    aiErrorMessage: 'Кечиресиз, катага туш болдум. Кайра аракет кылыңыз.',
    aiClearHistory: 'Тарыхты тазалоо',
    aiClearHistoryTitle: 'Тарыхты Тазалоо',
    aiClearHistoryMessage: 'Бардык билдирүүлөрдү өчүргүңүз келеби?',
    aiSelectModel: 'AI моделин тандоо',
    aiSelectModelMessage: 'Колдонуу үчүн AI моделин тандаңыз',
    aiExportChat: 'Чатты экспорттоо',
    aiCopyAll: 'Баарын көчүрүү',
    aiResponseSettings: 'Жооп параметрлери',
    aiResponseSettingsMessage: 'AI кантип жооп берерин конфигурациялаңыз',
    aiResponseLanguage: 'Жооп тили',
    aiResponseLanguageMessage: 'AI кайсы тилде жооп бериши керек',
    aiCreativeMode: 'Чыгармачыл режим',
    aiBalancedMode: 'Тең салмактуу режим',
    aiPreciseMode: 'Так режим',
    // Voice Translator
    vtHeaderTitle: 'Үн Которуучу',
    vtHeroTitle: 'Сүйлөңүз жана Которуңуз',
    vtHeroSubtitle: 'Өз тилиңизде сүйлөңүз жана бир замат которууну алыңыз',
    vtTapToSpeak: 'Сүйлөө үчүн басыңыз',
    vtListening: 'Угуп жатат...',
    vtRecognized: 'Таанылды',
    vtPlayOriginal: 'Түп нускасын ойнотуу',
    vtPlayTranslation: 'Которууну ойнотуу',
    vtCopyTranslation: 'Которууну көчүрүү',
    vtClear: 'Тазалоо',
    vtSwapLanguages: 'Тилдерди алмаштыруу',
    vtSelectSourceLanguage: 'Баштапкы тилди тандаңыз',
    vtSelectTargetLanguage: 'Максат тилди тандаңыз',
    vtErrorNoPermission: 'Микрофонго уруксат жок. Сураныч, параметрлерде уруксат бериңиз.',
    vtErrorNoInternet: 'Интернет байланышы жок. Байланышыңызды текшерип, кайра аракет кылыңыз.',
    vtErrorRecognitionFailed: 'Сүйлөшүү таануу ишке ашпады. Сураныч, кайра аракет кылыңыз.',
    vtErrorTranslationFailed: 'Которуу ишке ашпады. Сураныч, кайра аракет кылыңыз.',
    vtPermissionTitle: 'Микрофон Уруксаты',
    vtPermissionMessage: 'Бул мүмкүнчүлүктү колдонуу үчүн микрофонго кирүү керек',
    vtGrantPermission: 'Уруксат Берүү',
    vtComingSoon: 'Жакында',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: 'Үн котормочусу',
    voiceComingSoonDesc: 'Бул функция жакында жеткиликтүү болот',
    voiceComingSoonFeature1: '🎤 Сүйлөп которуңуз',
    voiceComingSoonFeature2: '🌍 30+ тилди колдойт',
    voiceComingSoonFeature3: '⚡ Ыкчам которуу',
    voiceComingSoonButton: 'Түшүндүм',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: 'Жакында!',
    visualComingSoonDesc: 'Камерадан текстти таануу мүмкүнчүлүгүн иштеп жатабыз. Жакында жазууларды, менюларды жана документтерди которо аласыз!',
    visualComingSoonFeature1: 'Камерадан текстти таануу',
    visualComingSoonFeature2: 'AI текстти таануу',
    visualComingSoonFeature3: 'Галерея жана камера колдоосу',

    // Coming Soon version badge
    comingSoonInVersion: 'v{version} версиясында чыгат',

    // Onboarding
    onboardingSkip: 'Өткөрүп жиберүү',
    onboardingNext: 'Кийинки',
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: 'Түркмөн тилине жана түркмөн тилинен которуңуз — тез жана оңой!',
    onboardingPhrasebookTitle: '30 тил жупу',
    onboardingPhrasebookSubtitle: 'Айтылыш менен сүйлөм китеби, офлайн иштейт',
    onboardingPhrasebookDemo: 'Салам',
    onboardingPlayAudio: 'Аудио ойнотуу',
    onboardingPlaying: 'Ойнотууда...',
    onboardingFeatureAudio: 'Түркмөн тилинде айтылыш',
    onboardingFeatureOffline: 'Интернетсиз иштейт',
    onboardingTranslationTitle: 'Акылдуу которуу',
    onboardingTranslationSubtitle: 'Текст которуучу жана AI жардамчы',
    onboardingTextTranslator: 'Текст которуучу',
    onboardingTranslate: 'Которуу',
    onboardingTryAgain: 'Кайра аракет кылыңыз',
    onboardingVisualTranslator: 'Визуалдык которуучу',
    onboardingVoiceTranslator: 'Үн которуучу',
    onboardingAIAssistant: 'AI жардамчы',
    onboardingAIPowered: 'AI менен иштейт',
    onboardingComingSoon: 'Жакында',
    onboardingReadyTitle: 'Баары даяр!',
    onboardingReadySubtitle: 'Азыр түркмөн тилин үйрөнүүнү баштаңыз',
    onboardingGetStarted: 'Баштоо',
    onboardingTagPhrasebook: '📖 Сүйлөм китеби',
    onboardingTagAudio: '🔊 Айтылыш',
    onboardingTagOffline: '✈️ Офлайн',
    onboardingTagTranslator: '📝 Которуучу',
    onboardingTagAI: '🤖 AI жардамчы',
    onboardingTagVisual: '📷 Визуалдык',
    onboardingTagVoice: '🎤 Үн',

    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: 'Орнотулган үндөр',
    settingsInstalledVoicesDesc: 'Бардык жеткиликтүү TTS үндөрүн көрүү',
    settingsLoading: 'Орнотуулар жүктөлүүдө...',
    settingsDarkMode: 'Караңгы режим',
    settingsDarkModeDesc: 'Караңгы темага өтүү',
    settingsSpeechRate: 'Сүйлөө ылдамдыгы',
    settingsSpeechRateDesc: 'Айтуу ылдамдыгын тууралоо',
    settingsResetAll: 'Бардык орнотууларды баштапкы абалга келтирүү',
    settingsResetAllDesc: 'Демейки орнотууларды калыбына келтирүү',
    settingsResetConfirm: 'Чындап эле баштапкы абалга келтиргиңиз келеби?',
    settingsClearSearchHistory: 'Издөө тарыхын тазалоо',
    settingsClearSearchHistoryDesc: 'Бардык издөө жазууларын өчүрүү',
    settingsRateApp: 'Колдонмону баалоо',
    settingsSendFeedback: 'Пикир жөнөтүү',
    settingsAppearance: 'Көрүнүш',
    settingsDataStorage: 'Маалыматтар жана сактоо',
  },

  tg: {
    // Tajik mode: Tajik speaker learning Turkmen
    home: 'Саҳифаи асосӣ',
    search: 'Ҷустуҷӯ',
    favorites: 'Дӯст доштаҳо',
    settings: 'Танзимот',
    additionalFeatures: 'Хусусиятҳои иловагӣ',
    statistics: 'Омор',

    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: 'Ҳамаи воситаҳо барои омӯхтани забон',
    selectCategory: 'Категорияро интихоб кунед',
    recentlyStudied: 'Ба наздикӣ омӯхташуда',
    study: 'Омӯхтан',

    phrasebookTitle: 'Китоби иборот',
    phrasebookSubtitle: '305 ибора дар 22 категория',
    visualTranslatorTitle: 'Тарҷумони визуалӣ',
    visualTranslatorSubtitle: 'Сканкунии матн бо дурбин',
    textTranslatorTitle: 'Тарҷумони матн',
    textTranslatorSubtitle: 'Навиштан ва тарҷума кардани матн',
    voiceTranslatorTitle: 'Тарҷумони овоз',
    voiceTranslatorSubtitle: 'Гап занед ва дар вақти воқеӣ тарҷума кунед',
    dictionaryTitle: 'Луғат',
    dictionarySubtitle: 'Дар v2.0 мебарояд',
    aiAssistantsTitle: 'Ёрирасонҳои AI',
    aiAssistantsSubtitle: 'Маслиҳатҳои зеҳнӣ ва дастгирӣ',
    myFavoritesTitle: 'Дӯст доштаҳои ман',
    myFavoritesSubtitle: 'Ашёҳои нигоҳдошташуда',

    pronunciation: 'Талаффуз',
    addToFavorites: 'Ба дӯст доштаҳо илова кардан',
    inFavorites: 'Дар дӯст доштаҳо',
    share: 'Мубодила кардан',

    settingsTitle: '⚙️ Танзимот',
    languageInterface: 'Забони интерфейс',
    switchLanguage: 'Иваз кардани забон',
    audio: 'Аудио',
    soundEffects: 'Эффектҳои садо',
    data: 'Додаҳо',
    clearHistory: 'Тоза кардани таърих',
    offlineMode: 'Реҷаи офлайн',
    about: 'Дар бораи барнома',
    feedback: 'Фикру мулоҳиза',

    searchPlaceholder: 'Дар ҳар забоне иборатро нависед...',
    noResults: 'Натиҷа ёфт нашуд',
    searchHistory: 'Таърихи ҷустуҷӯ',

    cancel: 'Бекор кардан',
    save: 'Нигоҳ доштан',
    delete: 'Нест кардан',
    confirm: 'Тасдиқ кардан',
    loading: 'Бор шуда истодааст...',
    error: 'Хато',
    success: 'Муваффақият',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'Тарҷума бо AI',
    vtCameraSubtitle: 'Дурбинро ба матн нишон диҳед барои тарҷумаи фаврӣ',
    vtTakePhoto: 'Акс гирифтан',
    vtChooseGallery: 'Аз галерея интихоб кунед',
    vtProcessing: 'Коркарди акс...',
    vtProcessingSubtext: 'Шинохтан ва тарҷума кардани матн',
    vtOcrEngine: 'Муҳаррики OCR',
    vtOcrEngineDesc: 'Интихоб кунед, ки матнро аз тасвирҳо чӣ гуна шинохт.',
    vtOcrSpaceNote: 'Ройгон, 25K дархост/моҳ',
    vtFeatures: 'Хусусиятҳо',
    vtFeatureOcrTitle: 'Шинохтани матни OCR',
    vtFeatureOcrDesc: 'Шинохтани матн бо дақиқияти баланд дар 30+ забон',
    vtFeatureAiTitle: 'Тавсифи ашёҳои AI',
    vtFeatureAiDesc: 'Агар матн ёфт нашавад, ашёҳоро тавсиф мекунад',
    vtFeatureSmartTitle: 'Тарҷумаи зеҳнӣ',
    vtFeatureSmartDesc: 'Тарҷумаи контекстӣ бо ёрии AI',
    vtFeatureSaveTitle: 'Нигоҳдорӣ ва мубодила',
    vtFeatureSaveDesc: 'Нигоҳ доштан ва мубодила кардани тарҷумаҳо ба дӯст доштаҳо',
    vtPermissionsText: 'Иҷозатҳои дурбин ва галереяи аксҳо лозиманд',
    vtGrantPermissions: 'Иҷозат додан',
    vtRequestingPermissions: 'Дархости иҷозатҳо...',
    vtAutoFallback: 'Агар муҳаррики интихобшуда кор накунад, тарҷумаи автоматӣ кор мекунад',

    // Visual Translator - Result Screen
    vtResult: 'Натиҷа',
    vtRecognizedText: 'Матни шинохташуда',
    vtLanguageLabel: 'Забон: ',
    vtAiAnalysis: 'Таҳлили AI',
    vtTranslation: 'Тарҷума',
    vtTargetLabel: 'Ҳадаф: ',
    vtPlay: 'Пахш кардан',
    vtStop: 'Қатъ кардан',
    vtCopy: 'Нусха бардоштан',
    vtTranslateAnother: 'Тарҷумаи дигар',
    vtCopied: 'Нусха бардошта шуд',
    vtCopiedMessage: 'Тарҷума ба буфер нусха бардошта шуд',

    // Text Translator
    ttHeaderTitle: 'Тарҷумони матн',
    ttHeroTitle: 'Тарҷумаи фаврӣ',
    ttHeroSubtitle: 'Матнро ба ҳар забоне тарҷума кунед',
    ttSelectLanguage: 'Интихоби забон',
    ttPlaceholder: 'Матнро барои тарҷума ворид кунед...',
    ttClear: 'Тоза кардан',
    ttTranslate: 'Тарҷума кардан',
    ttTranslating: 'Тарҷума шуда истодааст...',
    ttPlay: 'Пахш кардан',
    ttStop: 'Қатъ кардан',
    ttCopy: 'Нусха бардоштан',
    ttEmptyOutput: 'Тарҷума дар ин ҷо пайдо мешавад',
    ttSourceLanguage: 'Забони манбаъ',
    ttTargetLanguage: 'Забони ҳадаф',
    ttErrorTitle: 'Хато',
    ttErrorEmptyText: 'Матнро барои тарҷума ворид кунед',
    ttErrorTranslationFailed: 'Тарҷума ноком шуд. Дубора кӯшиш кунед.',
    ttErrorNoInternet: 'Пайвасти интернет нест',
    ttErrorTextTooLong: 'Матн хеле дароз аст. Максимум 1000 аломат.',
    ttCopiedTitle: 'Нусха бардошта шуд',
    ttCopiedMessage: 'Тарҷума ба буфер нусха бардошта шуд',
    ttInfoTitle: 'Маълумот',
    ttInfoCannotSwap: 'Иваз кардани забонҳо имконнопазир аст',

    // AI Assistants
    aiHomeTitle: 'Ёвардиҳои AI',
    aiHomeSubtitle: 'Барои кӯмак дар омӯзиши забони туркманӣ ёвардиҳои AI-ро интихоб кунед',
    aiInfoText: 'Ёвардиҳои AI моделҳои забонии пешрафта истифода мебаранд то кӯмаки шахсигардонида пешниҳод кунанд. Ҷавобҳо метавонанд якчанд сония вақт гиранд.',

    // AI Assistant Names
    aiContextualTipsName: 'Маслиҳатҳои контекстӣ',
    aiConversationTrainerName: 'Мураббии гуфтугӯ',
    aiGrammarHelperName: 'Ёвардиҳои грамматика',
    aiCulturalAdvisorName: 'Машваратчии фарҳангӣ',
    aiGeneralAssistantName: 'Ёвардиҳои умумӣ',

    // AI Assistant Descriptions
    aiContextualTipsDesc: 'Маслиҳатҳои ақлонаро дар асоси контексти ҷории омӯзиш гиред',
    aiConversationTrainerDesc: 'Гуфтугӯҳои воқеиро машқ кунед ва малакаҳои суханронии худро беҳтар кунед',
    aiGrammarHelperDesc: 'Кӯмаки фаврӣ дар бораи қоидаҳо ва сохторҳои грамматикии туркманӣ гиред',
    aiCulturalAdvisorDesc: 'Дар бораи фарҳанг, урфу одатҳо ва одоби туркманӣ омӯзед',
    aiGeneralAssistantDesc: 'Дар бораи омӯзиши забони туркманӣ ҳар чиз бипурсед',

    // Welcome Messages
    aiContextualTipsWelcome: 'Салом! Ман дар ин ҷо ҳастам, то ба шумо маслиҳатҳо ва маълумоти муфид барои омӯзиши туркманӣ пешниҳод кунам. Аз ман ҳар чиз бипурсед!',
    aiConversationTrainerWelcome: 'Салом! Биёед якчанд гуфтугӯ ба забони туркманӣ машқ кунем. Ман ба шумо дар беҳтар кардани малакаҳои суханронӣ кӯмак мекунам!',
    aiGrammarHelperWelcome: 'Хуш омадед! Ман ёвардиҳои грамматикаи шумо ҳастам. Аз ман дар бораи ҳар қоида ё сохтори грамматикии туркманӣ бипурсед.',
    aiCulturalAdvisorWelcome: 'Салом! Бигзор ба шумо дар фаҳмидани фарҳанг, урфу одатҳо ва суннатҳои туркманӣ кӯмак кунам.',
    aiGeneralAssistantWelcome: 'Салом! Ман ёвардиҳои AI-и шумо ҳастам. Ман метавонам дар тарҷума, ибораҳо ва муошират бо забонҳои гуногун кӯмак кунам.',

    // ChatScreen UI
    aiInputPlaceholder: 'Паёми худро нависед...',
    aiThinking: 'Андеша мекунам...',
    aiErrorMessage: 'Бубахшед, ман бо хато рӯбарӯ шудам. Лутфан дубора кӯшиш кунед.',
    aiClearHistory: 'Тозакунии таърих',
    aiClearHistoryTitle: 'Тозакунии Таърих',
    aiClearHistoryMessage: 'Оё мутмаин ҳастед, ки ҳама паёмҳоро нест кунед?',
    aiSelectModel: 'Модели AI-ро интихоб кунед',
    aiSelectModelMessage: 'Модели AI-ро барои истифода интихоб кунед',
    aiExportChat: 'Сӯҳбатро содир кунед',
    aiCopyAll: 'Ҳамаро нусхабардорӣ кунед',
    aiResponseSettings: 'Танзимоти ҷавоб',
    aiResponseSettingsMessage: 'AI чӣ гуна ҷавоб диҳад танзим кунед',
    aiResponseLanguage: 'Забони ҷавоб',
    aiResponseLanguageMessage: 'AI бо кадом забон ҷавоб диҳад',
    aiCreativeMode: 'Режими эҷодӣ',
    aiBalancedMode: 'Режими мутавозин',
    aiPreciseMode: 'Режими дақиқ',
    // Voice Translator
    vtHeaderTitle: 'Тарҷумони Овозӣ',
    vtHeroTitle: 'Гап занед ва тарҷума кунед',
    vtHeroSubtitle: 'Ба забони худ гап занед ва тарҷумаи фаврӣ дастрас кунед',
    vtTapToSpeak: 'Барои гап задан зарба занед',
    vtListening: 'Гӯш мекунад...',
    vtRecognized: 'Шинохта шуд',
    vtPlayOriginal: 'Пахши аслӣ',
    vtPlayTranslation: 'Пахши тарҷума',
    vtCopyTranslation: 'Нусхабардории тарҷума',
    vtClear: 'Тоза кунед',
    vtSwapLanguages: 'Иваз кардани забонҳо',
    vtSelectSourceLanguage: 'Забони манбаъро интихоб кунед',
    vtSelectTargetLanguage: 'Забони мақсадро интихоб кунед',
    vtErrorNoPermission: 'Иҷозати микрофон нест. Лутфан дар танзимот иҷозат диҳед.',
    vtErrorNoInternet: 'Пайвасти интернет нест. Пайвастро санҷед ва дубора кӯшиш кунед.',
    vtErrorRecognitionFailed: 'Шинохти нутқ ноком шуд. Лутфан дубора кӯшиш кунед.',
    vtErrorTranslationFailed: 'Тарҷума ноком шуд. Лутфан дубора кӯшиш кунед.',
    vtPermissionTitle: 'Иҷозати Микрофон',
    vtPermissionMessage: 'Барои истифодаи ин хусусият дастрасӣ ба микрофон лозим аст',
    vtGrantPermission: 'Иҷозат додан',
    vtComingSoon: 'Ба наздикӣ',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: 'Тарҷумони овозӣ',
    voiceComingSoonDesc: 'Ин хусусият ба наздикӣ дастрас мешавад',
    voiceComingSoonFeature1: '🎤 Бо гап задан тарҷума кунед',
    voiceComingSoonFeature2: '🌍 Зиёда аз 30 забонро дастгирӣ мекунад',
    voiceComingSoonFeature3: '⚡ Тарҷумаи фаврӣ',
    voiceComingSoonButton: 'Фаҳмидам',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: 'Ба наздикӣ!',
    visualComingSoonDesc: 'Мо дар рӯи қобилияти шинохтани матн аз камера кор мекунем. Ба наздикӣ шумо метавонед навиштаҳо, менюҳо ва ҳуҷҷатҳоро тарҷума кунед!',
    visualComingSoonFeature1: 'Шинохтани матн аз камера',
    visualComingSoonFeature2: 'AI шинохтани матн',
    visualComingSoonFeature3: 'Дастгирии галерея ва камера',

    // Coming Soon version badge
    comingSoonInVersion: 'Дар v{version} мебарояд',

    // Onboarding
    onboardingSkip: 'Гузаронидан',
    onboardingNext: 'Минбаъда',
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: 'Ба туркманӣ ва аз туркманӣ тарҷума кунед — зуд ва осон!',
    onboardingPhrasebookTitle: '30 ҷуфти забон',
    onboardingPhrasebookSubtitle: 'Китоби ибораҳо бо талаффуз, офлайн кор мекунад',
    onboardingPhrasebookDemo: 'Салом',
    onboardingPlayAudio: 'Пахши аудио',
    onboardingPlaying: 'Дар ҳоли пахш...',
    onboardingFeatureAudio: 'Талаффуз ба туркманӣ',
    onboardingFeatureOffline: 'Бе интернет кор мекунад',
    onboardingTranslationTitle: 'Тарҷумаи ҳушманд',
    onboardingTranslationSubtitle: 'Тарҷумони матнӣ ва ёрирасони AI',
    onboardingTextTranslator: 'Тарҷумони матнӣ',
    onboardingTranslate: 'Тарҷума кардан',
    onboardingTryAgain: 'Боз кӯшиш кардан',
    onboardingVisualTranslator: 'Тарҷумони визуалӣ',
    onboardingVoiceTranslator: 'Тарҷумони овозӣ',
    onboardingAIAssistant: 'Ёрирасони AI',
    onboardingAIPowered: 'Бо AI',
    onboardingComingSoon: 'Ба зудӣ',
    onboardingReadyTitle: 'Ҳама омода!',
    onboardingReadySubtitle: 'Ҳозир омӯзиши туркманиро оғоз кунед',
    onboardingGetStarted: 'Оғоз кардан',
    onboardingTagPhrasebook: '📖 Китоби ибораҳо',
    onboardingTagAudio: '🔊 Талаффуз',
    onboardingTagOffline: '✈️ Офлайн',
    onboardingTagTranslator: '📝 Тарҷумон',
    onboardingTagAI: '🤖 Ёрирасони AI',
    onboardingTagVisual: '📷 Визуалӣ',
    onboardingTagVoice: '🎤 Овоз',

    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: 'Овозҳои насбшуда',
    settingsInstalledVoicesDesc: 'Дидани ҳамаи овозҳои TTS дастрас',
    settingsLoading: 'Танзимот бор карда мешавад...',
    settingsDarkMode: 'Режими торик',
    settingsDarkModeDesc: 'Гузариш ба мавзӯи торик',
    settingsSpeechRate: 'Суръати нутқ',
    settingsSpeechRateDesc: 'Танзими суръати талаффуз',
    settingsResetAll: 'Бозгардонии ҳамаи танзимот',
    settingsResetAllDesc: 'Барқарор кардани танзимоти пешфарз',
    settingsResetConfirm: 'Шумо боварӣ доред, ки мехоҳед бозгардонед?',
    settingsClearSearchHistory: 'Тоза кардани таърихи ҷустуҷӯ',
    settingsClearSearchHistoryDesc: 'Нест кардани ҳамаи сабтҳои ҷустуҷӯ',
    settingsRateApp: 'Баҳо додан ба барнома',
    settingsSendFeedback: 'Фиристодани фикру мулоҳиза',
    settingsAppearance: 'Намуд',
    settingsDataStorage: 'Маълумот ва захира',
  },

  hy: {
    // Armenian mode: Armenian speaker learning Turkmen
    home: 'Գլխավոր',
    search: 'Որոնել',
    favorites: 'Ընտրանի',
    settings: 'Կարգավորումներ',
    additionalFeatures: 'Լրացուցիչ գործառույթներ',
    statistics: 'Վիճակագրություն',

    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: 'Բոլոր գործիքները լեզու սովորելու համար',
    selectCategory: 'Ընտրել կատեգորիա',
    recentlyStudied: 'Վերջերս ուսումնասիրված',
    study: 'Ուսումնասիրել',

    phrasebookTitle: 'Արտահայտությունների գիրք',
    phrasebookSubtitle: '305 արտահայտություն 22 կատեգորիայում',
    visualTranslatorTitle: 'Տեսողական թարգմանիչ',
    visualTranslatorSubtitle: 'Տեքստը սկանավորել տեսախցիկով',
    textTranslatorTitle: 'Տեքստի թարգմանիչ',
    textTranslatorSubtitle: 'Մուտքագրել և թարգմանել տեքստը',
    voiceTranslatorTitle: 'Ձայնային թարգմանիչ',
    voiceTranslatorSubtitle: 'Խոսեք և թարգմանեք իրական ժամանակում',
    dictionaryTitle: 'Բառարան',
    dictionarySubtitle: 'Կլինի v2.0-ում',
    aiAssistantsTitle: 'AI օգնականներ',
    aiAssistantsSubtitle: 'Խելացի խորհուրդներ և աջակցություն',
    myFavoritesTitle: 'Իմ ընտրանին',
    myFavoritesSubtitle: 'Պահպանված տարրեր',

    pronunciation: 'Արտասանություն',
    addToFavorites: 'Ավելացնել ընտրանու',
    inFavorites: 'Ընտրանում է',
    share: 'Կիսվել',

    settingsTitle: '⚙️ Կարգավորումներ',
    languageInterface: 'Ինտերֆեյսի լեզու',
    switchLanguage: 'Փոխել լեզուն',
    audio: 'Աուդիո',
    soundEffects: 'Ձայնային էֆեկտներ',
    data: 'Տվյալներ',
    clearHistory: 'Մաքրել պատմությունը',
    offlineMode: 'Օֆլայն ռեժիմ',
    about: 'Ծրագրի մասին',
    feedback: 'Կարծիք',

    searchPlaceholder: 'Մուտքագրել արտահայտություն ցանկացած լեզվով...',
    noResults: 'Արդյունքներ չեն գտնվել',
    searchHistory: 'Որոնման պատմություն',

    cancel: 'Չեղարկել',
    save: 'Պահպանել',
    delete: 'Ջնջել',
    confirm: 'Հաստատել',
    loading: 'Բեռնվում է...',
    error: 'Սխալ',
    success: 'Հաջողություն',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'Թարգմանել AI-ով',
    vtCameraSubtitle: 'Ուղղել տեսախցիկը տեքստին՝ ակնթարթային թարգմանության համար',
    vtTakePhoto: 'Լուսանկարել',
    vtChooseGallery: 'Ընտրել պատկերասրահից',
    vtProcessing: 'Պատկերի մշակում...',
    vtProcessingSubtext: 'Տեքստի ճանաչում և թարգմանություն',
    vtOcrEngine: 'OCR շարժիչ',
    vtOcrEngineDesc: 'Choose how to recognize text from images.',
    vtOcrSpaceNote: 'Free, 25K requests/month',
    vtFeatures: 'Հնարավորություններ',
    vtFeatureOcrTitle: 'OCR տեքստի ճանաչում',
    vtFeatureOcrDesc: 'Տեքստի ճանաչում բարձր ճշգրտությամբ 30+ լեզուներով',
    vtFeatureAiTitle: 'AI առարկաների նկարագրություն',
    vtFeatureAiDesc: 'Նկարագրում է առարկաները, եթե տեքստ չի գտնվել',
    vtFeatureSmartTitle: 'Խելացի թարգմանություն',
    vtFeatureSmartDesc: 'Համատեքստային թարգմանություն AI օգնությամբ',
    vtFeatureSaveTitle: 'Պահպանում և կիսում',
    vtFeatureSaveDesc: 'Պահպանել և կիսել թարգմանություններ ընտրանու մեջ',
    vtPermissionsText: 'Տեսախցիկի և լուսանկարների թույլտվություններ անհրաժեշտ են',
    vtGrantPermissions: 'Տալ թույլտվություն',
    vtRequestingPermissions: 'Թույլտվությունների հարցում...',
    vtAutoFallback: 'Եթե ընտրված շարժիչը չաշխատի, ավտոմատ թարգմանությունը կաշխատի',

    // Visual Translator - Result Screen
    vtResult: 'Արդյունք',
    vtRecognizedText: 'Ճանաչված տեքստ',
    vtLanguageLabel: 'Լեզու՝ ',
    vtAiAnalysis: 'AI վերլուծություն',
    vtTranslation: 'Թարգմանություն',
    vtTargetLabel: 'Նպատակ՝ ',
    vtPlay: 'Նվագարկել',
    vtStop: 'Կանգնեցնել',
    vtCopy: 'Պատճենել',
    vtTranslateAnother: 'Թարգմանել մեկ այլը',
    vtCopied: 'Պատճենված է',
    vtCopiedMessage: 'Թարգմանությունը պատճենված է բուֆեր',

    // Text Translator
    ttHeaderTitle: 'Տեքստի թարգմանիչ',
    ttHeroTitle: 'Ակնթարթային թարգմանություն',
    ttHeroSubtitle: 'Թարգմանեք տեքստը ցանկացած լեզու',
    ttSelectLanguage: 'Ընտրել լեզու',
    ttPlaceholder: 'Մուտքագրեք տեքստ թարգմանության համար...',
    ttClear: 'Մաքրել',
    ttTranslate: 'Թարգմանել',
    ttTranslating: 'Թարգմանվում է...',
    ttPlay: 'Նվագարկել',
    ttStop: 'Կանգնեցնել',
    ttCopy: 'Պատճենել',
    ttEmptyOutput: 'Թարգմանությունը կհայտնվի այստեղ',
    ttSourceLanguage: 'Սկզբնաղբյուր լեզու',
    ttTargetLanguage: 'Նպատակային լեզու',
    ttErrorTitle: 'Սխալ',
    ttErrorEmptyText: 'Մուտքագրեք տեքստ թարգմանության համար',
    ttErrorTranslationFailed: 'Թարգմանությունը ձախողվեց: Փորձեք կրկին:',
    ttErrorNoInternet: 'Ինտերնետ կապ չկա',
    ttErrorTextTooLong: 'Տեքստը շատ երկար է: Առավելագույնը 1000 նիշ:',
    ttCopiedTitle: 'Պատճենված է',
    ttCopiedMessage: 'Թարգմանությունը պատճենված է բուֆեր',
    ttInfoTitle: 'Տեղեկատվություն',
    ttInfoCannotSwap: 'Հնարավոր չէ փոխել լեզուները',

    // AI Assistants
    aiHomeTitle: 'AI օգնականներ',
    aiHomeSubtitle: 'Ընտրեք AI օգնական՝ թուրքմեներեն սովորելու համար',
    aiInfoText: 'AI օգնականները օգտագործում են առաջադեմ լեզվական մոդելներ՝ անհատականացված օգնություն տրամադրելու համար: Պատասխանները կարող են մի քանի վայրկյան տևել:',

    // AI Assistant Names
    aiContextualTipsName: 'Համատեքստային խորհուրդներ',
    aiConversationTrainerName: 'Զրույցի մարզիչ',
    aiGrammarHelperName: 'Քերականության օգնական',
    aiCulturalAdvisorName: 'Մշակութային խորհրդատու',
    aiGeneralAssistantName: 'Ընդհանուր օգնական',

    // AI Assistant Descriptions
    aiContextualTipsDesc: 'Ստացեք խելացի խորհուրդներ՝ ելնելով ձեր ընթացիկ ուսուցման համատեքստից',
    aiConversationTrainerDesc: 'Վարժեցեք իրական զրույցներ և բարելավեք ձեր խոսելու հմտությունները',
    aiGrammarHelperDesc: 'Ստացեք ակնթարթային օգնություն թուրքմեներեն քերականական կանոնների և կառուցվածքների հետ',
    aiCulturalAdvisorDesc: 'Իմացեք թուրքմենական մշակույթի, սովորույթների և վարքագծի մասին',
    aiGeneralAssistantDesc: 'Հարցրեք ցանկացած բան թուրքմեներեն սովորելու մասին',

    // Welcome Messages
    aiContextualTipsWelcome: 'Բարև! Ես այստեղ եմ՝ ձեզ օգտակար խորհուրդներ և պատկերացումներ տրամադրելու թուրքմեներեն սովորելու համար: Հարցրեք ինձ ցանկացած բան:',
    aiConversationTrainerWelcome: 'Բարև! Եկեք վարժենք մի քանի զրույց թուրքմեներեն: Ես կօգնեմ ձեզ բարելավել ձեր խոսելու հմտությունները:',
    aiGrammarHelperWelcome: 'Բարի գալուստ: Ես ձեր քերականության օգնականն եմ: Հարցրեք ինձ թուրքմեներեն քերականական ցանկացած կանոնի կամ կառուցվածքի մասին:',
    aiCulturalAdvisorWelcome: 'Սալամ: Թույլ տվեք ինձ օգնել ձեզ հասկանալ թուրքմենական մշակույթը, սովորույթները և ավանդույթները:',
    aiGeneralAssistantWelcome: 'Բարև: Ես ձեր AI օգնականն եմ: Կարող եմ օգնել թարգմանություններում, արտահայտություններում և տարբեր լեզուներով հաղորդակցությանը:',

    // ChatScreen UI
    aiInputPlaceholder: 'Մուտքագրեք ձեր հաղորդագրությունը...',
    aiThinking: 'Մտածում եմ...',
    aiErrorMessage: 'Ներողություն, ես հանդիպեցի սխալի: Խնդրում ենք փորձել կրկին:',
    aiClearHistory: 'Մաքրել պատմությունը',
    aiClearHistoryTitle: 'Clear History',
    aiClearHistoryMessage: 'Are you sure you want to delete all messages?',
    aiSelectModel: 'Select AI Model',
    aiSelectModelMessage: 'Select the AI model to use',
    aiExportChat: 'Export Chat',
    aiCopyAll: 'Copy All',
    aiResponseSettings: 'Response Settings',
    aiResponseSettingsMessage: 'Configure how AI responds',
    aiResponseLanguage: 'Response Language',
    aiResponseLanguageMessage: 'In what language should AI respond',
    aiCreativeMode: 'Creative Mode',
    aiBalancedMode: 'Balanced Mode',
    aiPreciseMode: 'Precise Mode',
    // Voice Translator
    vtHeaderTitle: 'Ձայնային Թարգմանիչ',
    vtHeroTitle: 'Խոսեք և Թարգմանեք',
    vtHeroSubtitle: 'Խոսեք ձեր լեզվով և ստացեք ակնթարթային թարգմանություն',
    vtTapToSpeak: 'Հպեք՝ խոսելու համար',
    vtListening: 'Լսում է...',
    vtRecognized: 'Ճանաչված է',
    vtPlayOriginal: 'Նվագարկել բնագիրը',
    vtPlayTranslation: 'Նվագարկել թարգմանությունը',
    vtCopyTranslation: 'Պատճենել թարգմանությունը',
    vtClear: 'Մաքրել',
    vtSwapLanguages: 'Փոխել լեզուները',
    vtSelectSourceLanguage: 'Ընտրել սկզբնական լեզուն',
    vtSelectTargetLanguage: 'Ընտրել թիրախ լեզուն',
    vtErrorNoPermission: 'Բացակայում է խոսափողի թույլտվությունը: Խնդրում ենք տրամադրել թույլտվություն կարգավորումներում:',
    vtErrorNoInternet: 'Ինտերնետ կապը բացակայում է: Ստուգեք կապը և փորձեք կրկին:',
    vtErrorRecognitionFailed: 'Խոսքի ճանաչումը ձախողվեց: Խնդրում ենք փորձել կրկին:',
    vtErrorTranslationFailed: 'Թարգմանությունը ձախողվեց: Խնդրում ենք փորձել կրկին:',
    vtPermissionTitle: 'Խոսափողի Թույլտվություն',
    vtPermissionMessage: 'Խոսափողին մուտքը անհրաժեշտ է այս գործառույթն օգտագործելու համար',
    vtGrantPermission: 'Տրամադրել Թույլտվություն',
    vtComingSoon: 'Շուտով',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: 'Ձայնային թարգմանիչ',
    voiceComingSoonDesc: 'Այս հնարավորությունը շուտով կլինի հասանելի',
    voiceComingSoonFeature1: '🎤 Խոսեք և թարգմանեք',
    voiceComingSoonFeature2: '🌍 30+ լեզուների աջակցություն',
    voiceComingSoonFeature3: '⚡ Ակնթարթային թարգմանություն',
    voiceComingSoonButton: 'Հասկանալի է',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: 'Coming Soon!',
    visualComingSoonDesc: 'We are working on camera text recognition. Soon you will be able to translate signs, menus and documents!',
    visualComingSoonFeature1: 'Camera text recognition',
    visualComingSoonFeature2: 'AI text recognition',
    visualComingSoonFeature3: 'Gallery and camera support',

    // Coming Soon version badge
    comingSoonInVersion: 'Coming in v{version}',

    // Onboarding
    onboardingSkip: 'Բdelays θdelays',
    onboardingNext: 'Ηdelays',
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: 'Θdelays delays delays delays delays — delays delays delays!',
    onboardingPhrasebookTitle: '30 delays delays delays',
    onboardingPhrasebookSubtitle: 'Αdelays delays delays, delays delays delays',
    onboardingPhrasebookDemo: 'Βdelays',
    onboardingPlayAudio: 'Νdelays delays delays',
    onboardingPlaying: 'Νdelays delays...',
    onboardingFeatureAudio: 'Αdelays delays delays',
    onboardingFeatureOffline: 'delays delays delays delays',
    onboardingTranslationTitle: 'Χdelays delays delays',
    onboardingTranslationSubtitle: 'Τdelays delays delays AI delays',
    onboardingTextTranslator: 'Τdelays delays delays',
    onboardingTranslate: 'Θdelays',
    onboardingTryAgain: 'Φdelays delays',
    onboardingVisualTranslator: 'Τdelays delays delays',
    onboardingVoiceTranslator: 'delays delays delays',
    onboardingAIAssistant: 'AI delays',
    onboardingAIPowered: 'AI-delays delays',
    onboardingComingSoon: 'Σdelays',
    onboardingReadyTitle: 'Αdelays delays!',
    onboardingReadySubtitle: 'delays delays delays delays delays delays delays',
    onboardingGetStarted: 'Σdelays',
    onboardingTagPhrasebook: '📖 Αdelays delays delays',
    onboardingTagAudio: '🔊 Αdelays',
    onboardingTagOffline: '✈️ Οdelays',
    onboardingTagTranslator: '📝 Θdelays',
    onboardingTagAI: '🤖 AI delays',
    onboardingTagVisual: '📷 Τdelays',
    onboardingTagVoice: '🎤 Delays',
    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: 'Installed Voices',
    settingsInstalledVoicesDesc: 'Available TTS voices',
    settingsLoading: 'Loading...',
    settingsDarkMode: 'Dark Mode',
    settingsDarkModeDesc: 'Enable dark theme',
    settingsSpeechRate: 'Speech Rate',
    settingsSpeechRateDesc: 'Adjust speech speed',
    settingsResetAll: 'Reset All',
    settingsResetAllDesc: 'Reset all settings',
    settingsResetConfirm: 'Reset all settings?',
    settingsClearSearchHistory: 'Clear Search History',
    settingsClearSearchHistoryDesc: 'Delete search history',
    settingsRateApp: 'Rate App',
    settingsSendFeedback: 'Send Feedback',
    settingsAppearance: 'Tdays',
    settingsDataStorage: 'Data & Storage',
  },

  ka: {
    // Georgian mode: Georgian speaker learning Turkmen
    home: 'მთავარი',
    search: 'ძიება',
    favorites: 'რჩეულები',
    settings: 'პარამეტრები',
    additionalFeatures: 'დამატებითი ფუნქციები',
    statistics: 'სტატისტიკა',

    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: 'ყველა ხელსაწყო ენის შესასწავლად',
    selectCategory: 'აირჩიეთ კატეგორია',
    recentlyStudied: 'ახლახან შესწავლილი',
    study: 'სწავლა',

    phrasebookTitle: 'ფრაზების წიგნი',
    phrasebookSubtitle: '305 ფრაზა 22 კატეგორიაში',
    visualTranslatorTitle: 'ვიზუალური თარჯიმანი',
    visualTranslatorSubtitle: 'ტექსტის სკანირება კამერით',
    textTranslatorTitle: 'ტექსტის თარჯიმანი',
    textTranslatorSubtitle: 'ტექსტის აკრეფა და თარჯმა',
    voiceTranslatorTitle: 'ხმოვანი თარჯიმანი',
    voiceTranslatorSubtitle: 'ილაპარაკეთ და თარგმნეთ რეალურ დროში',
    dictionaryTitle: 'ლექსიკონი',
    dictionarySubtitle: 'გამოვა v2.0-ში',
    aiAssistantsTitle: 'AI ასისტენტები',
    aiAssistantsSubtitle: 'ჭკვიანი რჩევები და მხარდაჭერა',
    myFavoritesTitle: 'ჩემი რჩეულები',
    myFavoritesSubtitle: 'შენახული ელემენტები',

    pronunciation: 'გამოთქმა',
    addToFavorites: 'რჩეულებში დამატება',
    inFavorites: 'რჩეულებშია',
    share: 'გაზიარება',

    settingsTitle: '⚙️ პარამეტრები',
    languageInterface: 'ინტერფეისის ენა',
    switchLanguage: 'ენის შეცვლა',
    audio: 'აუდიო',
    soundEffects: 'ხმოვანი ეფექტები',
    data: 'მონაცემები',
    clearHistory: 'ისტორიის წაშლა',
    offlineMode: 'ოფლაინ რეჟიმი',
    about: 'აპლიკაციის შესახებ',
    feedback: 'უკუკავშირი',

    searchPlaceholder: 'აკრიფეთ ფრაზა ნებისმიერ ენაზე...',
    noResults: 'შედეგები არ მოიძებნა',
    searchHistory: 'ძიების ისტორია',

    cancel: 'გაუქმება',
    save: 'შენახვა',
    delete: 'წაშლა',
    confirm: 'დადასტურება',
    loading: 'იტვირთება...',
    error: 'შეცდომა',
    success: 'წარმატება',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'თარგმნა AI-ით',
    vtCameraSubtitle: 'მიმართეთ კამერა ტექსტისკენ მყისიერი თარგმნისთვის',
    vtTakePhoto: 'ფოტოს გადაღება',
    vtChooseGallery: 'აირჩიეთ გალერეიდან',
    vtProcessing: 'სურათის დამუშავება...',
    vtProcessingSubtext: 'ტექსტის ამოცნობა და თარგმნა',
    vtOcrEngine: 'OCR ძრავა',
    vtOcrEngineDesc: 'აირჩიეთ, როგორ ამოიცნოთ ტექსტი სურათებიდან.',
    vtOcrSpaceNote: 'უფასო, 25K მოთხოვნა/თვე',
    vtFeatures: 'ფუნქციები',
    vtFeatureOcrTitle: 'OCR ტექსტის ამოცნობა',
    vtFeatureOcrDesc: 'ტექსტის ამოცნობა მაღალი სიზუსტით 30+ ენაზე',
    vtFeatureAiTitle: 'AI ობიექტების აღწერა',
    vtFeatureAiDesc: 'ობიექტების აღწერა, თუ ტექსტი არ მოიძებნა',
    vtFeatureSmartTitle: 'ჭკვიანი თარგმანი',
    vtFeatureSmartDesc: 'კონტექსტური თარგმნა AI დახმარებით',
    vtFeatureSaveTitle: 'შენახვა და გაზიარება',
    vtFeatureSaveDesc: 'თარგმნის შენახვა და გაზიარება რჩეულებში',
    vtPermissionsText: 'კამერისა და ფოტოების ნებართვები საჭიროა',
    vtGrantPermissions: 'ნებართვის მიცემა',
    vtRequestingPermissions: 'ნებართვების მოთხოვნა...',
    vtAutoFallback: 'თუ არჩეული ძრავა არ იმუშავებს, ავტომატური თარგმანი იმუშავებს',

    // Visual Translator - Result Screen
    vtResult: 'შედეგი',
    vtRecognizedText: 'ამოცნობილი ტექსტი',
    vtLanguageLabel: 'ენა: ',
    vtAiAnalysis: 'AI ანალიზი',
    vtTranslation: 'თარგმანი',
    vtTargetLabel: 'მიზანი: ',
    vtPlay: 'დაკვრა',
    vtStop: 'გაჩერება',
    vtCopy: 'კოპირება',
    vtTranslateAnother: 'სხვის თარგმნა',
    vtCopied: 'დაკოპირდა',
    vtCopiedMessage: 'თარგმანი დაკოპირდა ბუფერში',

    // Text Translator
    ttHeaderTitle: 'ტექსტის თარჯიმანი',
    ttHeroTitle: 'მყისიერი თარგმანი',
    ttHeroSubtitle: 'თარგმნეთ ტექსტი ნებისმიერ ენაზე',
    ttSelectLanguage: 'ენის არჩევა',
    ttPlaceholder: 'შეიყვანეთ ტექსტი თარგმნისთვის...',
    ttClear: 'გასუფთავება',
    ttTranslate: 'თარგმნა',
    ttTranslating: 'მიმდინარეობს თარგმნა...',
    ttPlay: 'დაკვრა',
    ttStop: 'გაჩერება',
    ttCopy: 'კოპირება',
    ttEmptyOutput: 'თარგმანი გამოჩნდება აქ',
    ttSourceLanguage: 'საწყისი ენა',
    ttTargetLanguage: 'სამიზნე ენა',
    ttErrorTitle: 'შეცდომა',
    ttErrorEmptyText: 'შეიყვანეთ ტექსტი თარგმნისთვის',
    ttErrorTranslationFailed: 'თარგმნა ვერ მოხერხდა. სცადეთ ხელახლა.',
    ttErrorNoInternet: 'ინტერნეტ კავშირი არ არის',
    ttErrorTextTooLong: 'ტექსტი ძალიან გრძელია. მაქსიმუმ 1000 სიმბოლო.',
    ttCopiedTitle: 'დაკოპირდა',
    ttCopiedMessage: 'თარგმანი დაკოპირდა ბუფერში',
    ttInfoTitle: 'ინფორმაცია',
    ttInfoCannotSwap: 'ენების გაცვლა შეუძლებელია',

    // AI Assistants
    aiHomeTitle: 'AI ასისტენტები',
    aiHomeSubtitle: 'აირჩიეთ AI ასისტენტი თურქმენული ენის სწავლაში დასახმარებლად',
    aiInfoText: 'AI ასისტენტები იყენებენ მოწინავე ენის მოდელებს პერსონალიზებული დახმარების უზრუნველსაყოფად. პასუხები შეიძლება რამდენიმე წამს გასტანოს.',

    // AI Assistant Names
    aiContextualTipsName: 'კონტექსტური რჩევები',
    aiConversationTrainerName: 'საუბრის ტრენერი',
    aiGrammarHelperName: 'გრამატიკის ასისტენტი',
    aiCulturalAdvisorName: 'კულტურული მრჩეველი',
    aiGeneralAssistantName: 'ზოგადი ასისტენტი',

    // AI Assistant Descriptions
    aiContextualTipsDesc: 'მიიღეთ ჭკვიანი რჩევები თქვენი მიმდინარე სასწავლო კონტექსტის საფუძველზე',
    aiConversationTrainerDesc: 'ივარჯიშეთ რეალურ საუბრებში და გააუმჯობესეთ თქვენი საუბრის უნარები',
    aiGrammarHelperDesc: 'მიიღეთ დაუყოვნებლივ დახმარება თურქმენული გრამატიკის წესებთან და სტრუქტურებთან',
    aiCulturalAdvisorDesc: 'გაეცანით თურქმენულ კულტურას, ტრადიციებსა და ეტიკეტს',
    aiGeneralAssistantDesc: 'იკითხეთ რაც გნებავთ თურქმენული ენის სწავლის შესახებ',

    // Welcome Messages
    aiContextualTipsWelcome: 'გამარჯობა! მე აქ ვარ რომ მოგაწოდოთ სასარგებლო რჩევები და იდეები თურქმენულის სასწავლად. იკითხეთ რაც გნებავთ!',
    aiConversationTrainerWelcome: 'გამარჯობა! მოდით ვივარჯიშოთ რამდენიმე საუბარი თურქმენულად. დაგეხმარებით თქვენი საუბრის უნარების გაუმჯობესებაში!',
    aiGrammarHelperWelcome: 'კეთილი იყოს თქვენი მობრძანება! მე ვარ თქვენი გრამატიკის ასისტენტი. იკითხეთ ნებისმიერი თურქმენული გრამატიკის წესის ან სტრუქტურის შესახებ.',
    aiCulturalAdvisorWelcome: 'სალამი! ნება მომეცით დაგეხმაროთ თურქმენული კულტურის, ტრადიციებისა და ჩვეულებების გაგებაში.',
    aiGeneralAssistantWelcome: 'გამარჯობა! მე ვარ თქვენი AI ასისტენტი. შემიძლია დაგეხმაროთ თარგმანებში, ფრაზებსა და სხვადასხვა ენაზე კომუნიკაციაში.',

    // ChatScreen UI
    aiInputPlaceholder: 'აკრიფეთ თქვენი შეტყობინება...',
    aiThinking: 'ვფიქრობ...',
    aiErrorMessage: 'ბოდიში, შეცდომა დავუშვი. გთხოვთ სცადოთ ხელახლა.',
    aiClearHistory: 'ისტორიის გასუფთავება',
    aiClearHistoryTitle: 'ისტორიის გასუფთავება',
    aiClearHistoryMessage: 'დარწმუნებული ხართ, რომ გსურთ ყველა შეტყობინების წაშლა?',
    aiSelectModel: 'აირჩიეთ AI მოდელი',
    aiSelectModelMessage: 'აირჩიეთ გამოსაყენებელი AI მოდელი',
    aiExportChat: 'ჩატის ექსპორტი',
    aiCopyAll: 'ყველას კოპირება',
    aiResponseSettings: 'პასუხის პარამეტრები',
    aiResponseSettingsMessage: 'დააკონფიგურირეთ როგორ უპასუხოს AI-მ',
    aiResponseLanguage: 'პასუხის ენა',
    aiResponseLanguageMessage: 'რომელ ენაზე უნდა უპასუხოს AI-მ',
    aiCreativeMode: 'შემოქმედებითი რეჟიმი',
    aiBalancedMode: 'დაბალანსებული რეჟიმი',
    aiPreciseMode: 'ზუსტი რეჟიმი',
    // Voice Translator
    vtHeaderTitle: 'ხმოვანი მთარგმნელი',
    vtHeroTitle: 'ისაუბრეთ და თარგმნეთ',
    vtHeroSubtitle: 'ისაუბრეთ თქვენს ენაზე და მიიღეთ მყისიერი თარგმანი',
    vtTapToSpeak: 'შეეხეთ საუბრისთვის',
    vtListening: 'ისმენს...',
    vtRecognized: 'ამოცნობილია',
    vtPlayOriginal: 'დაუკარი ორიგინალს',
    vtPlayTranslation: 'დაუკარი თარგმანს',
    vtCopyTranslation: 'თარგმანის კოპირება',
    vtClear: 'გასუფთავება',
    vtSwapLanguages: 'ენების შეცვლა',
    vtSelectSourceLanguage: 'აირჩიეთ საწყისი ენა',
    vtSelectTargetLanguage: 'აირჩიეთ სამიზნე ენა',
    vtErrorNoPermission: 'მიკროფონის ნებართვა არ არის. გთხოვთ მიანიჭოთ ნებართვა პარამეტრებში.',
    vtErrorNoInternet: 'ინტერნეტ კავშირი არ არის. შეამოწმეთ კავშირი და სცადეთ ხელახლა.',
    vtErrorRecognitionFailed: 'მეტყველების ამოცნობა ვერ მოხერხდა. გთხოვთ სცადოთ ხელახლა.',
    vtErrorTranslationFailed: 'თარგმანი ვერ მოხერხდა. გთხოვთ სცადოთ ხელახლა.',
    vtPermissionTitle: 'მიკროფონის ნებართვა',
    vtPermissionMessage: 'მიკროფონზე წვდომა აუცილებელია ამ ფუნქციის გამოსაყენებლად',
    vtGrantPermission: 'ნებართვის მიცემა',
    vtComingSoon: 'მალე',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: 'ხმოვანი მთარგმნელი',
    voiceComingSoonDesc: 'ეს ფუნქცია მალე ხელმისაწვდომი იქნება',
    voiceComingSoonFeature1: '🎤 თარგმნე ლაპარაკით',
    voiceComingSoonFeature2: '🌍 30+ ენის მხარდაჭერა',
    voiceComingSoonFeature3: '⚡ მყისიერი თარგმანი',
    voiceComingSoonButton: 'გასაგებია',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: 'ვიზუალური მთარგმნელი მალე!',
    visualComingSoonDesc: 'ჩვენ ვმუშაობთ კამერიდან ტექსტის ამოცნობის ფუნქციაზე. მალე შეძლებთ წარწერების, მენიუებისა და დოკუმენტების თარგმნას!',
    visualComingSoonFeature1: 'ტექსტის ამოცნობა კამერიდან',
    visualComingSoonFeature2: 'AI სურათის თარგმანი',
    visualComingSoonFeature3: 'გალერეისა და კამერის მხარდაჭერა',

    // Coming Soon version badge
    comingSoonInVersion: 'გამოვა v{version}-ში',

    // Onboarding
    onboardingSkip: 'გამოტოვება',
    onboardingNext: 'შემდეგი',
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: 'თურქმენულად და თურქმენულიდან თარგმნეთ — სწრაფად და მარტივად!',
    onboardingPhrasebookTitle: '30 ენის წყვილი',
    onboardingPhrasebookSubtitle: 'ფრაზების წიგნი გამოთქმით, მუშაობს ოფლაინ',
    onboardingPhrasebookDemo: 'გამარჯობა',
    onboardingPlayAudio: 'აუდიოს დაკვრა',
    onboardingPlaying: 'დაკვრა...',
    onboardingFeatureAudio: 'გამოთქმა თურქმენულად',
    onboardingFeatureOffline: 'მუშაობს ინტერნეტის გარეშე',
    onboardingTranslationTitle: 'ჭკვიანი თარგმანი',
    onboardingTranslationSubtitle: 'ტექსტის მთარგმნელი და AI ასისტენტი',
    onboardingTextTranslator: 'ტექსტის მთარგმნელი',
    onboardingTranslate: 'თარგმნა',
    onboardingTryAgain: 'სცადეთ ხელახლა',
    onboardingVisualTranslator: 'ვიზუალური მთარგმნელი',
    onboardingVoiceTranslator: 'ხმოვანი მთარგმნელი',
    onboardingAIAssistant: 'AI ასისტენტი',
    onboardingAIPowered: 'AI-ით მართული',
    onboardingComingSoon: 'მალე',
    onboardingReadyTitle: 'ყველაფერი მზადაა!',
    onboardingReadySubtitle: 'ახლავე დაიწყეთ თურქმენული ენის შესწავლა',
    onboardingGetStarted: 'დაწყება',
    onboardingTagPhrasebook: '📖 ფრაზების წიგნი',
    onboardingTagAudio: '🔊 გამოთქმა',
    onboardingTagOffline: '✈️ ოფლაინ',
    onboardingTagTranslator: '📝 მთარგმნელი',
    onboardingTagAI: '🤖 AI ასისტენტი',
    onboardingTagVisual: '📷 ვიზუალური',
    onboardingTagVoice: '🎤 ხმა',

    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: 'დაყენებული ხმები',
    settingsInstalledVoicesDesc: 'ყველა ხელმისაწვდომი TTS ხმის ნახვა',
    settingsLoading: 'პარამეტრების ჩატვირთვა...',
    settingsDarkMode: 'მუქი რეჟიმი',
    settingsDarkModeDesc: 'მუქ თემაზე გადართვა',
    settingsSpeechRate: 'მეტყველების სიჩქარე',
    settingsSpeechRateDesc: 'წარმოთქმის სიჩქარის რეგულირება',
    settingsResetAll: 'ყველა პარამეტრის გადატვირთვა',
    settingsResetAllDesc: 'ნაგულისხმევი პარამეტრების აღდგენა',
    settingsResetConfirm: 'დარწმუნებული ხართ, რომ გსურთ გადატვირთვა?',
    settingsClearSearchHistory: 'ძიების ისტორიის გასუფთავება',
    settingsClearSearchHistoryDesc: 'ყველა ძიების ჩანაწერის წაშლა',
    settingsRateApp: 'აპის შეფასება',
    settingsSendFeedback: 'უკუკავშირის გაგზავნა',
    settingsAppearance: 'გარეგნობა',
    settingsDataStorage: 'მონაცემები და საცავი',
  },

  ar: {
    // Arabic mode: Arabic speaker learning Turkmen (RTL)
    home: 'الرئيسية',
    search: 'بحث',
    favorites: 'المفضلة',
    settings: 'الإعدادات',
    additionalFeatures: 'ميزات إضافية',
    statistics: 'الإحصائيات',

    appTitle: 'Şapak - Ykjam Terjime',
    appSubtitle: 'جميع الأدوات لتعلم اللغة',
    selectCategory: 'اختر الفئة',
    recentlyStudied: 'المدروس مؤخراً',
    study: 'دراسة',

    phrasebookTitle: 'كتاب العبارات',
    phrasebookSubtitle: '305 عبارة في 22 فئة',
    visualTranslatorTitle: 'المترجم المرئي',
    visualTranslatorSubtitle: 'مسح النص بالكاميرا',
    textTranslatorTitle: 'مترجم النصوص',
    textTranslatorSubtitle: 'كتابة وترجمة النص',
    voiceTranslatorTitle: 'مترجم الصوت',
    voiceTranslatorSubtitle: 'تحدث وترجم في الوقت الفعلي',
    dictionaryTitle: 'القاموس',
    dictionarySubtitle: 'قريباً في v2.0',
    aiAssistantsTitle: 'مساعدو الذكاء الاصطناعي',
    aiAssistantsSubtitle: 'نصائح ذكية ودعم',
    myFavoritesTitle: 'مفضلتي',
    myFavoritesSubtitle: 'العناصر المحفوظة',

    pronunciation: 'النطق',
    addToFavorites: 'إضافة إلى المفضلة',
    inFavorites: 'في المفضلة',
    share: 'مشاركة',

    settingsTitle: '⚙️ الإعدادات',
    languageInterface: 'لغة الواجهة',
    switchLanguage: 'تغيير اللغة',
    audio: 'الصوت',
    soundEffects: 'المؤثرات الصوتية',
    data: 'البيانات',
    clearHistory: 'مسح السجل',
    offlineMode: 'وضع عدم الاتصال',
    about: 'حول التطبيق',
    feedback: 'التعليقات',

    searchPlaceholder: 'اكتب عبارة بأي لغة...',
    noResults: 'لا توجد نتائج',
    searchHistory: 'سجل البحث',

    cancel: 'إلغاء',
    save: 'حفظ',
    delete: 'حذف',
    confirm: 'تأكيد',
    loading: 'جار التحميل...',
    error: 'خطأ',
    success: 'نجاح',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'الترجمة بالذكاء الاصطناعي',
    vtCameraSubtitle: 'وجه الكاميرا إلى النص للترجمة الفورية',
    vtTakePhoto: 'التقاط صورة',
    vtChooseGallery: 'اختيار من المعرض',
    vtProcessing: 'معالجة الصورة...',
    vtProcessingSubtext: 'التعرف على النص والترجمة',
    vtOcrEngine: 'محرك OCR',
    vtOcrEngineDesc: 'اختر كيفية التعرف على النص من الصور.',
    vtOcrSpaceNote: 'مجاني، 25 ألف طلب/شهر',
    vtFeatures: 'الميزات',
    vtFeatureOcrTitle: 'التعرف على النص OCR',
    vtFeatureOcrDesc: 'التعرف على النص بدقة عالية في أكثر من 30 لغة',
    vtFeatureAiTitle: 'وصف الأشياء بالذكاء الاصطناعي',
    vtFeatureAiDesc: 'وصف الأشياء إذا لم يتم العثور على نص',
    vtFeatureSmartTitle: 'الترجمة الذكية',
    vtFeatureSmartDesc: 'الترجمة السياقية بمساعدة الذكاء الاصطناعي',
    vtFeatureSaveTitle: 'الحفظ والمشاركة',
    vtFeatureSaveDesc: 'حفظ ومشاركة الترجمات في المفضلة',
    vtPermissionsText: 'مطلوب أذونات الكاميرا والصور',
    vtGrantPermissions: 'منح الإذن',
    vtRequestingPermissions: 'طلب الأذونات...',
    vtAutoFallback: 'إذا لم يعمل المحرك المحدد، ستعمل الترجمة التلقائية',

    // Visual Translator - Result Screen
    vtResult: 'النتيجة',
    vtRecognizedText: 'النص المُتعرف عليه',
    vtLanguageLabel: 'اللغة: ',
    vtAiAnalysis: 'تحليل الذكاء الاصطناعي',
    vtTranslation: 'الترجمة',
    vtTargetLabel: 'الهدف: ',
    vtPlay: 'تشغيل',
    vtStop: 'إيقاف',
    vtCopy: 'نسخ',
    vtTranslateAnother: 'ترجمة أخرى',
    vtCopied: 'تم النسخ',
    vtCopiedMessage: 'تم نسخ الترجمة إلى الحافظة',

    // Text Translator
    ttHeaderTitle: 'مترجم النصوص',
    ttHeroTitle: 'الترجمة الفورية',
    ttHeroSubtitle: 'ترجمة النص إلى أي لغة',
    ttSelectLanguage: 'اختيار اللغة',
    ttPlaceholder: 'أدخل النص للترجمة...',
    ttClear: 'مسح',
    ttTranslate: 'ترجمة',
    ttTranslating: 'جاري الترجمة...',
    ttPlay: 'تشغيل',
    ttStop: 'إيقاف',
    ttCopy: 'نسخ',
    ttEmptyOutput: 'ستظهر الترجمة هنا',
    ttSourceLanguage: 'لغة المصدر',
    ttTargetLanguage: 'اللغة المستهدفة',
    ttErrorTitle: 'خطأ',
    ttErrorEmptyText: 'أدخل النص للترجمة',
    ttErrorTranslationFailed: 'فشلت الترجمة. حاول مرة أخرى.',
    ttErrorNoInternet: 'لا يوجد اتصال بالإنترنت',
    ttErrorTextTooLong: 'النص طويل جداً. الحد الأقصى 1000 حرف.',
    ttCopiedTitle: 'تم النسخ',
    ttCopiedMessage: 'تم نسخ الترجمة إلى الحافظة',
    ttInfoTitle: 'معلومات',
    ttInfoCannotSwap: 'لا يمكن تبديل اللغات',

    // AI Assistants
    aiHomeTitle: 'مساعدو الذكاء الاصطناعي',
    aiHomeSubtitle: 'اختر مساعد ذكاء اصطناعي لمساعدتك في تعلم اللغة التركمانية',
    aiInfoText: 'يستخدم مساعدو الذكاء الاصطناعي نماذج لغوية متقدمة لتقديم مساعدة مخصصة. قد تستغرق الاستجابات بضع ثوانٍ.',

    // AI Assistant Names
    aiContextualTipsName: 'نصائح سياقية',
    aiConversationTrainerName: 'مدرب المحادثة',
    aiGrammarHelperName: 'مساعد القواعد',
    aiCulturalAdvisorName: 'مستشار ثقافي',
    aiGeneralAssistantName: 'مساعد عام',

    // AI Assistant Descriptions
    aiContextualTipsDesc: 'احصل على نصائح ذكية بناءً على سياق التعلم الحالي الخاص بك',
    aiConversationTrainerDesc: 'تدرب على محادثات حقيقية وحسّن مهارات التحدث لديك',
    aiGrammarHelperDesc: 'احصل على مساعدة فورية في قواعد وهياكل اللغة التركمانية',
    aiCulturalAdvisorDesc: 'تعرف على الثقافة التركمانية والعادات والآداب',
    aiGeneralAssistantDesc: 'اسأل أي شيء عن تعلم اللغة التركمانية',

    // Welcome Messages
    aiContextualTipsWelcome: 'مرحباً! أنا هنا لأقدم لك نصائح ورؤى مفيدة لتعلم التركمانية. اسألني أي شيء!',
    aiConversationTrainerWelcome: 'مرحباً! دعنا نتدرب على بعض المحادثات بالتركمانية. سأساعدك على تحسين مهارات التحدث لديك!',
    aiGrammarHelperWelcome: 'مرحباً بك! أنا مساعد القواعد الخاص بك. اسألني عن أي قاعدة أو هيكل نحوي تركماني.',
    aiCulturalAdvisorWelcome: 'سلام! دعني أساعدك على فهم الثقافة والعادات والتقاليد التركمانية.',
    aiGeneralAssistantWelcome: 'مرحباً! أنا مساعدك الذكي. يمكنني المساعدة في الترجمات والعبارات والتواصل بلغات مختلفة.',

    // ChatScreen UI
    aiInputPlaceholder: 'اكتب رسالتك...',
    aiThinking: 'أفكر...',
    aiErrorMessage: 'آسف، واجهت خطأ. يرجى المحاولة مرة أخرى.',
    aiClearHistory: 'مسح السجل',
    aiClearHistoryTitle: 'مسح السجل',
    aiClearHistoryMessage: 'هل أنت متأكد أنك تريد حذف جميع الرسائل؟',
    aiSelectModel: 'اختر نموذج الذكاء الاصطناعي',
    aiSelectModelMessage: 'اختر نموذج الذكاء الاصطناعي للاستخدام',
    aiExportChat: 'تصدير المحادثة',
    aiCopyAll: 'نسخ الكل',
    aiResponseSettings: 'إعدادات الرد',
    aiResponseSettingsMessage: 'تكوين كيفية رد الذكاء الاصطناعي',
    aiResponseLanguage: 'لغة الرد',
    aiResponseLanguageMessage: 'بأي لغة يجب أن يرد الذكاء الاصطناعي',
    aiCreativeMode: 'الوضع الإبداعي',
    aiBalancedMode: 'الوضع المتوازن',
    aiPreciseMode: 'الوضع الدقيق',
    // Voice Translator
    vtHeaderTitle: 'المترجم الصوتي',
    vtHeroTitle: 'تحدث وترجم',
    vtHeroSubtitle: 'تحدث بلغتك واحصل على ترجمة فورية',
    vtTapToSpeak: 'اضغط للتحدث',
    vtListening: 'يستمع...',
    vtRecognized: 'تم التعرف',
    vtPlayOriginal: 'تشغيل الأصلي',
    vtPlayTranslation: 'تشغيل الترجمة',
    vtCopyTranslation: 'نسخ الترجمة',
    vtClear: 'مسح',
    vtSwapLanguages: 'تبديل اللغات',
    vtSelectSourceLanguage: 'اختر اللغة المصدر',
    vtSelectTargetLanguage: 'اختر اللغة الهدف',
    vtErrorNoPermission: 'لا يوجد إذن للميكروفون. يرجى منح الإذن في الإعدادات.',
    vtErrorNoInternet: 'لا يوجد اتصال بالإنترنت. تحقق من اتصالك وحاول مرة أخرى.',
    vtErrorRecognitionFailed: 'فشل التعرف على الكلام. يرجى المحاولة مرة أخرى.',
    vtErrorTranslationFailed: 'فشلت الترجمة. يرجى المحاولة مرة أخرى.',
    vtPermissionTitle: 'إذن الميكروفون',
    vtPermissionMessage: 'يلزم الوصول إلى الميكروفون لاستخدام هذه الميزة',
    vtGrantPermission: 'منح الإذن',
    vtComingSoon: 'قريباً',

    // Voice Translator Coming Soon
    voiceComingSoonTitle: 'المترجم الصوتي',
    voiceComingSoonDesc: 'ستتوفر هذه الميزة قريباً',
    voiceComingSoonFeature1: '🎤 ترجم بالتحدث',
    voiceComingSoonFeature2: '🌍 يدعم 30+ لغة',
    voiceComingSoonFeature3: '⚡ ترجمة فورية',
    voiceComingSoonButton: 'فهمت',

    // Visual Translator Coming Soon (v1.5)
    visualComingSoonTitle: 'المترجم المرئي قريباً!',
    visualComingSoonDesc: 'نحن نعمل على ميزة التعرف على النص من الكاميرا. قريباً ستتمكن من ترجمة اللافتات والقوائم والمستندات!',
    visualComingSoonFeature1: 'التعرف على النص من الكاميرا',
    visualComingSoonFeature2: 'ترجمة الصور بالذكاء الاصطناعي',
    visualComingSoonFeature3: 'دعم المعرض والكاميرا',

    // Coming Soon version badge
    comingSoonInVersion: 'قادم في v{version}',

    // Onboarding
    onboardingSkip: 'تخطي',
    onboardingNext: 'التالي',
    onboardingWelcomeTitle: 'Şapak - Ykjam Terjime',
    onboardingWelcomeSubtitle: 'ترجم إلى التركمانية ومنها — بسرعة وسهولة!',
    onboardingPhrasebookTitle: '30 زوج لغة',
    onboardingPhrasebookSubtitle: 'كتاب عبارات مع النطق، يعمل بدون اتصال',
    onboardingPhrasebookDemo: 'مرحباً',
    onboardingPlayAudio: 'تشغيل الصوت',
    onboardingPlaying: 'جاري التشغيل...',
    onboardingFeatureAudio: 'النطق بالتركمانية',
    onboardingFeatureOffline: 'يعمل بدون إنترنت',
    onboardingTranslationTitle: 'ترجمة ذكية',
    onboardingTranslationSubtitle: 'مترجم النصوص ومساعد الذكاء الاصطناعي',
    onboardingTextTranslator: 'مترجم النصوص',
    onboardingTranslate: 'ترجم',
    onboardingTryAgain: 'حاول مرة أخرى',
    onboardingVisualTranslator: 'المترجم المرئي',
    onboardingVoiceTranslator: 'المترجم الصوتي',
    onboardingAIAssistant: 'مساعد الذكاء الاصطناعي',
    onboardingAIPowered: 'مدعوم بالذكاء الاصطناعي',
    onboardingComingSoon: 'قريباً',
    onboardingReadyTitle: 'كل شيء جاهز!',
    onboardingReadySubtitle: 'ابدأ تعلم التركمانية الآن',
    onboardingGetStarted: 'ابدأ',
    onboardingTagPhrasebook: '📖 كتاب العبارات',
    onboardingTagAudio: '🔊 النطق',
    onboardingTagOffline: '✈️ بدون اتصال',
    onboardingTagTranslator: '📝 المترجم',
    onboardingTagAI: '🤖 مساعد AI',
    onboardingTagVisual: '📷 مرئي',
    onboardingTagVoice: '🎤 صوتي',

    // Settings Screen - Additional translations (Task 2)
    settingsInstalledVoices: 'الأصوات المثبتة',
    settingsInstalledVoicesDesc: 'عرض جميع أصوات TTS المتاحة',
    settingsLoading: 'جاري تحميل الإعدادات...',
    settingsDarkMode: 'الوضع الداكن',
    settingsDarkModeDesc: 'التبديل إلى السمة الداكنة',
    settingsSpeechRate: 'سرعة الكلام',
    settingsSpeechRateDesc: 'ضبط سرعة النطق',
    settingsResetAll: 'إعادة تعيين جميع الإعدادات',
    settingsResetAllDesc: 'استعادة الإعدادات الافتراضية',
    settingsResetConfirm: 'هل أنت متأكد من إعادة التعيين؟',
    settingsClearSearchHistory: 'مسح سجل البحث',
    settingsClearSearchHistoryDesc: 'حذف جميع سجلات البحث',
    settingsRateApp: 'تقييم التطبيق',
    settingsSendFeedback: 'إرسال ملاحظات',
    settingsAppearance: 'المظهر',
    settingsDataStorage: 'البيانات والتخزين',
  },
};

const validateConfig = (config: any): config is AppLanguageConfig => {
  return (
    config &&
    typeof config === 'object' &&
    ['tk', 'zh', 'ru', 'en', 'tr', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'pl', 'uk'].includes(config.mode) &&
    ['tk', 'zh'].includes(config.primaryLanguage) &&
    ['tk', 'zh'].includes(config.learningLanguage) &&
    config.helperLanguage === 'ru' &&
    typeof config.version === 'string'
  );
};

const createConfig = (mode: AppLanguageMode): AppLanguageConfig => {
  // Для интерфейсных языков (ru, en, tr, de, fr, es, it, pt, nl, pl, uk) - используем tk-zh пару по умолчанию
  let primaryLanguage: 'tk' | 'zh' = 'tk';
  let learningLanguage: 'tk' | 'zh' = 'zh';

  if (mode === 'tk') {
    primaryLanguage = 'tk';
    learningLanguage = 'zh';
  } else if (mode === 'zh') {
    primaryLanguage = 'zh';
    learningLanguage = 'tk';
  }
  // Для всех остальных языков используем значения по умолчанию (tk-zh)

  return {
    mode,
    primaryLanguage,
    learningLanguage,
    helperLanguage: 'ru',
    version: LANGUAGE_VERSION,
  };
};

interface LanguageContextValue {
  config: AppLanguageConfig;
  isLoading: boolean;
  setLanguageMode: (mode: AppLanguageMode, shouldSave?: boolean) => Promise<void>;
  switchMode: () => Promise<boolean>;
  resetLanguageSettings: () => Promise<void>;
  getTexts: () => InterfaceTexts;
  getLanguageName: (lang: 'tk' | 'zh' | 'ru') => string;
  getPhraseTexts: (phrase: { translation: { text: string; transcription?: string }; turkmen: string }) => {
    primary: string;
    learning: string;
    helper: string;
  };
  isFirstLaunch: boolean;
  error: string | null;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [config, setConfig] = useState<AppLanguageConfig>(createConfig('tk'));
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка сохраненной конфигурации при запуске
  useEffect(() => {
    let isMounted = true;

    const loadConfig = async () => {
      try {
        const saved = await AsyncStorage.getItem(APP_LANGUAGE_KEY);
        if (!isMounted) return; // Prevent state update if unmounted

        if (saved) {
          const parsedConfig = JSON.parse(saved);
          if (validateConfig(parsedConfig)) {
            if (isMounted) {
              setConfig(parsedConfig);
              setIsFirstLaunch(false);
            }
          }
        }
      } catch (error) {
        console.warn('Ошибка загрузки языковой конфигурации:', error);
        if (isMounted) {
          setError('Не удалось загрузить настройки языка');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadConfig();

    return () => {
      isMounted = false; // Cleanup: prevent state updates after unmount
    };
  }, []);

  const saveConfig = useCallback(async (config: AppLanguageConfig): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(APP_LANGUAGE_KEY, JSON.stringify(config));
      return true;
    } catch (error) {
      console.warn('Ошибка сохранения языковой конфигурации:', error);
      setError('Не удалось сохранить настройки языка');
      return false;
    }
  }, []);

  const setLanguageMode = useCallback(async (mode: AppLanguageMode, shouldSave: boolean = true) => {
    try {
      if (!['tk', 'zh', 'ru', 'en', 'tr', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'pl', 'uk', 'ja', 'ko', 'th', 'vi', 'id', 'ms', 'hi', 'ur', 'fa', 'ps', 'uz', 'kk', 'az', 'ky', 'tg', 'hy', 'ka', 'ar'].includes(mode)) {
        throw new Error(`Invalid language mode: ${mode}`);
      }

      const newConfig = createConfig(mode);
      
      if (shouldSave) {
        const saved = await saveConfig(newConfig);
        if (saved) {
          setIsFirstLaunch(false);
          setError(null);
        }
      }

      setConfig(newConfig);
    } catch (error) {
      console.warn('Ошибка установки языкового режима:', error);
      setError('Не удалось изменить язык');
    }
  }, [saveConfig]);

  const switchMode = useCallback(async (): Promise<boolean> => {
    try {
      const newMode: AppLanguageMode = config.mode === 'tk' ? 'zh' : 'tk';
      await setLanguageMode(newMode, true);
      return true;
    } catch (error) {
      console.warn('Ошибка переключения режима:', error);
      return false;
    }
  }, [config.mode, setLanguageMode]);

  const resetLanguageSettings = useCallback(async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(APP_LANGUAGE_KEY);
      setConfig(createConfig('tk'));
      setIsFirstLaunch(true);
      setError(null);
    } catch (error) {
      console.warn('Ошибка сброса настроек языка:', error);
      setError('Не удалось сбросить настройки языка');
    }
  }, []);

  const getTexts = useCallback((): InterfaceTexts => {
    try {
      return INTERFACE_TEXTS[config.mode] || INTERFACE_TEXTS.tk;
    } catch (error) {
      console.warn('Ошибка получения текстов интерфейса:', error);
      return INTERFACE_TEXTS.tk;
    }
  }, [config.mode]);

  const getLanguageName = useCallback((lang: 'tk' | 'zh' | 'ru'): string => {
    const names = {
      tk: config.primaryLanguage === 'tk' ? 'Türkmençe' : '土库曼语',
      zh: config.primaryLanguage === 'tk' ? 'Hytaýça' : '中文',
      ru: config.primaryLanguage === 'tk' ? 'Rusça' : '俄语'
    };
    return names[lang] || lang;
  }, [config.primaryLanguage]);

  const getPhraseTexts = useCallback((phrase: { translation: { text: string; transcription?: string }; turkmen: string }) => {
    try {
      if (config.mode === 'tk') {
        // Туркмен изучает выбранный язык (китайский/русский/английский)
        return {
          primary: phrase.translation.text,  // Выбранный язык - основной для изучения
          learning: phrase.turkmen,          // Туркменский - родной язык
          helper: phrase.translation.transcription || ''  // Транскрипция если есть
        };
      } else {
        // Носитель другого языка изучает туркменский
        return {
          primary: phrase.turkmen,           // Туркменский - основной для изучения
          learning: phrase.translation.text, // Выбранный язык - родной язык
          helper: phrase.translation.transcription || ''  // Транскрипция если есть
        };
      }
    } catch (error) {
      console.warn('Ошибка получения текстов фразы:', error);
      return {
        primary: phrase.translation.text,
        learning: phrase.turkmen,
        helper: ''
      };
    }
  }, [config.mode]);

  const contextValue: LanguageContextValue = useMemo(() => ({
    config,
    isLoading,
    setLanguageMode,
    switchMode,
    resetLanguageSettings,
    getTexts,
    getLanguageName,
    getPhraseTexts,
    isFirstLaunch,
    error,
  }), [config, isLoading, setLanguageMode, switchMode, resetLanguageSettings, getTexts, getLanguageName, getPhraseTexts, isFirstLaunch, error]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useAppLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useAppLanguage must be used within a LanguageProvider');
  }
  return context;
}