// src/screens/AboutScreen.tsx - О приложении

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppLanguage } from '../contexts/LanguageContext';
import { scale, verticalScale, moderateScale } from '../utils/ResponsiveUtils';
import { useSafeArea } from '../hooks/useSafeArea';

type ModalType = 'authors' | 'series' | null;

export default function AboutScreen() {
  const navigation = useNavigation();
  const { getTexts, config } = useAppLanguage();
  const texts = getTexts();
  const { bottom: safeAreaBottom } = useSafeArea();

  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Тексты для разных языков
  const aboutTexts = {
    tk: {
      title: 'Programma barada',
      authors: 'Awtorlar barada',
      authorsDesc: 'Kim döretdi',
      series: 'Şapak programmalar toplumy',
      seriesDesc: 'Beýleki programmalar',
      version: 'Wersiýa',
      authorsContent: 'Şapak – Ykjam Terjime – Türkmenistan, Mary welaýaty, Mary şäherinde ýerleşýän "Şapak" döredijiler topary tarapyndan döredildi.\n\nBiziň maksadymyz — Türkmenistanda ýaşaýan we şol bir wagtyň özünde daşary ýurtlara çykýan ildeşlerimize we ýurdumyza gelýän myhmanlara dürli dillerdäki gatnaşygy has aňsat we elýeterli etmekdir.\n\nProgramma 31 dili goldaýar we aşakdakylary öz içine alýar:\n• Gepleşik kitaby\n• Tekst terjimeçi\n• AI kömekçileri\n• Sesli terjimeçi (ýakynda)\n• Wizual terjimeçi (ýakynda)\n\nTeklipler, ýalňyşlyklar ýa-da habarlaşmak üçin:\nshapak.app@gmail.com\n\nTürkmen dili audio ses ýazgysy üçin Daňatarowa Gülhatyja minnetdarlygymyzy bildirýäris!',
      seriesContent: 'Şapak goşundylar toplumy — ilkinji nobatda Türkmenistanyň ilatynyň daşary ýurt dillerini öwrenmegine kömek etmek üçin döredilen toplumlaýyn goşundylardan ybaratdyr.\n\nGoşundy esasan türkmen ulanyjylary üçin niýetlense-de, bütin dünýäniň adamlary tarapyndan hem aňsatlyk bilen ulanylyp bilner.\n\nŞapak – Ykjam Terjime — toplumyň ilkinji goşundysydyr. Ol gepleşik kitabyny, tekst we ses terjimeçisi, wizual terjimeçi ýaly mümkinçilikleri hem-de ösen Emeli Aň  funksiýalaryny özünde jemleýär.\n\nToplumyň beýleki goşundylary işjeň tapgyryndadyr — täzeliklerden habarly boluň!',
      mission: 'Wezipe',
      features: 'Mümkinçilikler',
      contact: 'Habarlaşmak',
      specialThanks: 'Aýratyn minnetdarlyk',
      soon: 'Ýakynda',
      aboutSeries: 'Toplum barada',
      forEveryone: 'Hemmeler üçin',
      whatsNext: 'Indiki',
    },
    zh: {
      title: '关于应用',
      authors: '关于作者',
      authorsDesc: '谁创建了这个应用',
      series: 'Şapak 应用系列',
      seriesDesc: '其他应用',
      version: '版本',
      authorsContent: 'Şapak – Ykjam Terjime 由来自土库曼斯坦马雷省马雷市的 Şapak 开发团队 开发。\n\n我们的使命是帮助土库曼斯坦人民——无论是生活在国内还是国外——以及访客，轻松使用多种语言进行交流。\n\n该应用支持 31 种语言，包括：\n• 短语手册\n• 翻译器\n• AI 助手\n• 语音翻译器（即将推出）\n• 视觉翻译器（即将推出）\n\n反馈、错误或建议请联系：\nshapak.app@gmail.com\n\n特别感谢 Daňatarowa Gülhatyja 为土库曼语录音提供她的声音。',
      seriesContent: 'Şapak 应用系列是一套全面的应用程序，主要旨在帮助土库曼斯坦人民学习外语。\n\n尽管这些应用是为土库曼用户设计的，但世界各地的人们都可以轻松使用。\n\nŞapak – Ykjam Terjime 是该系列的第一款应用。它结合了短语手册、文本和语音翻译器、视觉翻译器以及先进的AI功能。\n\n该系列的其他应用目前正在积极开发中——敬请关注更新！',
      mission: '使命',
      features: '功能',
      contact: '联系方式',
      specialThanks: '特别感谢',
      soon: '即将推出',
      aboutSeries: '关于系列',
      forEveryone: '适合所有人',
      whatsNext: '下一步',
    },
    ru: {
      title: 'О приложении',
      authors: 'Об авторах',
      authorsDesc: 'Кто создал приложение',
      series: 'Серия приложений Şapak',
      seriesDesc: 'Другие приложения',
      version: 'Версия',
      authorsContent: 'Şapak – Ykjam Terjime создано командой разработчиков Şapak из города Мары, Марыйского велаята, Туркменистан.\n\nНаша миссия — помочь жителям Туркменистана, как находящимся в стране, так и за её пределами, а также гостям государства, легко и удобно общаться на разных языках.\n\nПриложение поддерживает 31 язык и включает:\n• разговорник\n• переводчик\n• AI-ассистентов\n• голосовой переводчик (скоро)\n• визуальный переводчик (скоро)\n\nДля обратной связи, ошибок и предложений:\nshapak.app@gmail.com\n\nОсобая благодарность Daňatarowa Gülhatyja за предоставление её голоса для туркменской аудио-озвучки.',
      seriesContent: 'Серия приложений Şapak — это комплекс приложений, созданных прежде всего для того, чтобы помочь жителям Туркменистана изучать иностранные языки.\n\nНесмотря на то что приложения ориентированы на туркменистанцев, они могут быть с лёгкостью использованы людьми по всему миру.\n\nŞapak – Ykjam Terjime — первое приложение серии. Оно сочетает в себе функции разговорника, текстового и голосового переводчика, визуального переводчика, а также современные возможности искусственного интеллекта.\n\nДругие приложения серии находятся в активной разработке — оставайтесь с нами и следите за новостями!',
      mission: 'Миссия',
      features: 'Функции',
      contact: 'Контакт',
      specialThanks: 'Особая благодарность',
      soon: 'Скоро',
      aboutSeries: 'О серии',
      forEveryone: 'Для всех',
      whatsNext: 'Что дальше',
    },
    en: {
      title: 'About',
      authors: 'About Authors',
      authorsDesc: 'Who created this app',
      series: 'Şapak App Series',
      seriesDesc: 'Other apps',
      version: 'Version',
      authorsContent: 'Şapak – Ykjam Terjime is developed by the development team Şapak from Mary, Mary Province, Turkmenistan.\n\nOur mission is to help the people of Turkmenistan — both those living in the country and abroad — as well as visitors, communicate easily in multiple languages.\n\nThe app supports 31 languages and includes:\n• Phrasebook\n• Translator\n• AI assistants\n• Voice translator (coming soon)\n• Visual translator (coming soon)\n\nFor feedback, errors, or suggestions:\nshapak.app@gmail.com\n\nSpecial thanks to Daňatarowa Gülhatyja for providing her voice for the Turkmen audio recordings.',
      seriesContent: 'The Şapak app series is a comprehensive suite of applications designed primarily to help the people of Turkmenistan learn foreign languages.\n\nAlthough these apps are created with Turkmen users in mind, they can be easily used by people all around the world.\n\nŞapak – Ykjam Terjime is the first app in the series. It combines the functions of a phrasebook, text and voice translator, visual translator, as well as advanced AI-powered features.\n\nOther apps in the series are currently in active development — stay tuned for updates!',
      mission: 'Mission',
      features: 'Features',
      contact: 'Contact',
      specialThanks: 'Special Thanks',
      soon: 'Soon',
      aboutSeries: 'About Series',
      forEveryone: 'For Everyone',
      whatsNext: "What's Next",
    },
    ja: {
      title: 'アプリについて',
      authors: '開発者について',
      authorsDesc: 'このアプリを作った人',
      series: 'Şapakアプリシリーズ',
      seriesDesc: '他のアプリ',
      version: 'バージョン',
      authorsContent: 'Şapak – Ykjam Terjimeは、トルクメニスタン、マリ州マリ市の開発チームŞapakによって開発されました。\n\n私たちの使命は、トルクメニスタンの人々——国内および海外在住者——ならびに訪問者が、複数の言語で簡単にコミュニケーションできるよう支援することです。\n\nこのアプリは31言語をサポートし、以下を含みます：\n• フレーズブック\n• 翻訳機\n• AIアシスタント\n• 音声翻訳機（近日公開）\n• ビジュアル翻訳機（近日公開）\n\nフィードバック、エラー、提案については：\nshapak.app@gmail.com\n\nトルクメン語の音声録音を提供してくださったDaňatarowa Gülhatyjaに特別な感謝を。',
      seriesContent: 'Şapakアプリシリーズは、主にトルクメニスタンの人々が外国語を学ぶのを支援するために設計された包括的なアプリケーションスイートです。\n\nこれらのアプリはトルクメンユーザーを念頭に置いて作成されていますが、世界中の人々が簡単に使用できます。\n\nŞapak – Ykjam Terjimeはシリーズの最初のアプリです。フレーズブック、テキストおよび音声翻訳機、ビジュアル翻訳機の機能に加え、高度なAI機能を組み合わせています。\n\nシリーズの他のアプリは現在積極的に開発中です — 更新情報をお待ちください！',
      mission: 'ミッション',
      features: '機能',
      contact: 'お問い合わせ',
      specialThanks: '特別な感謝',
      soon: '近日公開',
      aboutSeries: 'シリーズについて',
      forEveryone: 'みんなのために',
      whatsNext: '次は何',
    },
    ko: {
      title: '앱 정보',
      authors: '개발자 소개',
      authorsDesc: '이 앱을 만든 사람',
      series: 'Şapak 앱 시리즈',
      seriesDesc: '다른 앱들',
      version: '버전',
      authorsContent: 'Şapak – Ykjam Terjime은 투르크메니스탄 마리 주 마리 시의 개발팀 Şapak이 개발했습니다.\n\n우리의 사명은 투르크메니스탄 사람들—국내 및 해외 거주자—과 방문객들이 여러 언어로 쉽게 소통할 수 있도록 돕는 것입니다.\n\n이 앱은 31개 언어를 지원하며 다음을 포함합니다:\n• 회화집\n• 번역기\n• AI 어시스턴트\n• 음성 번역기 (곧 출시)\n• 시각 번역기 (곧 출시)\n\n피드백, 오류 또는 제안사항:\nshapak.app@gmail.com\n\n투르크멘어 음성 녹음을 제공해 주신 Daňatarowa Gülhatyja님께 특별히 감사드립니다.',
      seriesContent: 'Şapak 앱 시리즈는 주로 투르크메니스탄 사람들이 외국어를 배울 수 있도록 설계된 포괄적인 애플리케이션 제품군입니다.\n\n이러한 앱은 투르크멘 사용자를 염두에 두고 만들어졌지만 전 세계 사람들이 쉽게 사용할 수 있습니다.\n\nŞapak – Ykjam Terjime은 시리즈의 첫 번째 앱입니다. 회화집, 텍스트 및 음성 번역기, 시각 번역기의 기능과 고급 AI 기반 기능을 결합합니다.\n\n시리즈의 다른 앱들은 현재 적극적으로 개발 중입니다 — 업데이트를 기대해 주세요!',
      mission: '미션',
      features: '기능',
      contact: '연락처',
      specialThanks: '특별한 감사',
      soon: '곧 출시',
      aboutSeries: '시리즈 소개',
      forEveryone: '모두를 위해',
      whatsNext: '다음은',
    },
    th: {
      title: 'เกี่ยวกับแอป',
      authors: 'เกี่ยวกับผู้พัฒนา',
      authorsDesc: 'ใครสร้างแอปนี้',
      series: 'ซีรีส์แอป Şapak',
      seriesDesc: 'แอปอื่นๆ',
      version: 'เวอร์ชัน',
      authorsContent: 'Şapak – Ykjam Terjime พัฒนาโดยทีมพัฒนา Şapak จากเมืองแมรี จังหวัดแมรี ประเทศเติร์กเมนิสถาน\n\nภารกิจของเราคือช่วยให้ชาวเติร์กเมนิสถาน — ทั้งผู้ที่อาศัยในประเทศและต่างประเทศ — รวมถึงผู้มาเยือน สื่อสารได้อย่างง่ายดายในหลายภาษา\n\nแอปนี้รองรับ 31 ภาษา และรวมถึง:\n• หนังสือวลี\n• นักแปล\n• ผู้ช่วย AI\n• นักแปลเสียง (เร็วๆ นี้)\n• นักแปลภาพ (เร็วๆ นี้)\n\nสำหรับข้อเสนอแนะ ข้อผิดพลาด หรือข้อเสนอแนะ:\nshapak.app@gmail.com\n\nขอขอบคุณเป็นพิเศษแก่ Daňatarowa Gülhatyja สำหรับการให้เสียงสำหรับการบันทึกเสียงภาษาเติร์กเมน',
      seriesContent: 'ซีรีส์แอป Şapak เป็นชุดแอปพลิเคชันที่ครอบคลุม ออกแบบมาเพื่อช่วยให้ประชาชนเติร์กเมนิสถานเรียนรู้ภาษาต่างประเทศเป็นหลัก\n\nแม้ว่าแอปเหล่านี้สร้างขึ้นโดยคำนึงถึงผู้ใช้ชาวเติร์กเมน แต่ผู้คนทั่วโลกก็สามารถใช้งานได้อย่างง่ายดาย\n\nŞapak – Ykjam Terjime เป็นแอปแรกในซีรีส์ รวมฟังก์ชันของหนังสือวลี นักแปลข้อความและเสียง นักแปลภาพ รวมถึงฟีเจอร์ AI ขั้นสูง\n\nแอปอื่นๆ ในซีรีส์กำลังอยู่ในระหว่างการพัฒนาอย่างต่อเนื่อง — ติดตามการอัปเดต!',
      mission: 'ภารกิจ',
      features: 'ฟีเจอร์',
      contact: 'ติดต่อ',
      specialThanks: 'ขอบคุณเป็นพิเศษ',
      soon: 'เร็วๆ นี้',
      aboutSeries: 'เกี่ยวกับซีรีส์',
      forEveryone: 'สำหรับทุกคน',
      whatsNext: 'ขั้นต่อไป',
    },
    vi: {
      title: 'Về ứng dụng',
      authors: 'Về tác giả',
      authorsDesc: 'Ai đã tạo ứng dụng này',
      series: 'Bộ ứng dụng Şapak',
      seriesDesc: 'Các ứng dụng khác',
      version: 'Phiên bản',
      authorsContent: 'Şapak – Ykjam Terjime được phát triển bởi đội ngũ phát triển Şapak từ thành phố Mary, tỉnh Mary, Turkmenistan.\n\nSứ mệnh của chúng tôi là giúp người dân Turkmenistan — cả những người sống trong nước và nước ngoài — cũng như du khách, giao tiếp dễ dàng bằng nhiều ngôn ngữ.\n\nỨng dụng hỗ trợ 31 ngôn ngữ và bao gồm:\n• Sổ tay hội thoại\n• Trình dịch\n• Trợ lý AI\n• Trình dịch giọng nói (sắp ra mắt)\n• Trình dịch hình ảnh (sắp ra mắt)\n\nĐể gửi phản hồi, báo lỗi hoặc đề xuất:\nshapak.app@gmail.com\n\nĐặc biệt cảm ơn Daňatarowa Gülhatyja đã cung cấp giọng nói cho bản ghi âm tiếng Turkmen.',
      seriesContent: 'Bộ ứng dụng Şapak là một bộ ứng dụng toàn diện được thiết kế chủ yếu để giúp người dân Turkmenistan học ngoại ngữ.\n\nMặc dù các ứng dụng này được tạo ra với người dùng Turkmen trong tâm trí, chúng có thể dễ dàng được sử dụng bởi mọi người trên khắp thế giới.\n\nŞapak – Ykjam Terjime là ứng dụng đầu tiên trong bộ. Nó kết hợp các chức năng của sổ tay hội thoại, trình dịch văn bản và giọng nói, trình dịch hình ảnh, cũng như các tính năng AI tiên tiến.\n\nCác ứng dụng khác trong bộ hiện đang được phát triển tích cực — hãy theo dõi các cập nhật!',
      mission: 'Sứ mệnh',
      features: 'Tính năng',
      contact: 'Liên hệ',
      specialThanks: 'Lời cảm ơn đặc biệt',
      soon: 'Sắp ra mắt',
      aboutSeries: 'Về bộ ứng dụng',
      forEveryone: 'Dành cho tất cả',
      whatsNext: 'Tiếp theo',
    },
    id: {
      title: 'Tentang Aplikasi',
      authors: 'Tentang Pengembang',
      authorsDesc: 'Siapa yang membuat aplikasi ini',
      series: 'Seri Aplikasi Şapak',
      seriesDesc: 'Aplikasi lainnya',
      version: 'Versi',
      authorsContent: 'Şapak – Ykjam Terjime dikembangkan oleh tim pengembang Şapak dari kota Mary, Provinsi Mary, Turkmenistan.\n\nMisi kami adalah membantu masyarakat Turkmenistan — baik yang tinggal di dalam negeri maupun luar negeri — serta pengunjung, berkomunikasi dengan mudah dalam berbagai bahasa.\n\nAplikasi ini mendukung 31 bahasa dan mencakup:\n• Buku frasa\n• Penerjemah\n• Asisten AI\n• Penerjemah suara (segera hadir)\n• Penerjemah visual (segera hadir)\n\nUntuk umpan balik, kesalahan, atau saran:\nshapak.app@gmail.com\n\nTerima kasih khusus kepada Daňatarowa Gülhatyja atas penyediaan suaranya untuk rekaman audio Turkmen.',
      seriesContent: 'Seri Aplikasi Şapak adalah rangkaian aplikasi komprehensif yang dirancang terutama untuk membantu rakyat Turkmenistan belajar bahasa asing.\n\nMeskipun aplikasi-aplikasi ini dibuat dengan mempertimbangkan pengguna Turkmen, mereka dapat dengan mudah digunakan oleh orang-orang di seluruh dunia.\n\nŞapak – Ykjam Terjime adalah aplikasi pertama dalam seri ini. Ini menggabungkan fungsi buku frasa, penerjemah teks dan suara, penerjemah visual, serta fitur-fitur canggih bertenaga AI.\n\nAplikasi lain dalam seri ini saat ini sedang dalam pengembangan aktif — nantikan pembaruan!',
      mission: 'Misi',
      features: 'Fitur',
      contact: 'Kontak',
      specialThanks: 'Terima Kasih Khusus',
      soon: 'Segera',
      aboutSeries: 'Tentang Seri',
      forEveryone: 'Untuk Semua',
      whatsNext: 'Selanjutnya',
    },
    ms: {
      title: 'Tentang Aplikasi',
      authors: 'Tentang Pembangun',
      authorsDesc: 'Siapa yang membuat aplikasi ini',
      series: 'Siri Aplikasi Şapak',
      seriesDesc: 'Aplikasi lain',
      version: 'Versi',
      authorsContent: 'Şapak – Ykjam Terjime dibangunkan oleh pasukan pembangunan Şapak dari bandar Mary, Wilayah Mary, Turkmenistan.\n\nMisi kami adalah membantu rakyat Turkmenistan — kedua-duanya yang tinggal di dalam dan luar negara — serta pelawat, berkomunikasi dengan mudah dalam pelbagai bahasa.\n\nAplikasi ini menyokong 31 bahasa dan termasuk:\n• Buku frasa\n• Penterjemah\n• Pembantu AI\n• Penterjemah suara (akan datang)\n• Penterjemah visual (akan datang)\n\nUntuk maklum balas, kesilapan, atau cadangan:\nshapak.app@gmail.com\n\nTerima kasih khas kepada Daňatarowa Gülhatyja kerana menyediakan suaranya untuk rakaman audio Turkmen.',
      seriesContent: 'Siri Aplikasi Şapak adalah suite aplikasi komprehensif yang direka terutamanya untuk membantu rakyat Turkmenistan mempelajari bahasa asing.\n\nWalaupun aplikasi-aplikasi ini dicipta dengan pengguna Turkmen dalam fikiran, mereka boleh digunakan dengan mudah oleh orang di seluruh dunia.\n\nŞapak – Ykjam Terjime adalah aplikasi pertama dalam siri ini. Ia menggabungkan fungsi buku frasa, penterjemah teks dan suara, penterjemah visual, serta ciri-ciri AI canggih.\n\nAplikasi lain dalam siri ini sedang dalam pembangunan aktif — nantikan kemas kini!',
      mission: 'Misi',
      features: 'Ciri-ciri',
      contact: 'Hubungi',
      specialThanks: 'Terima Kasih Khas',
      soon: 'Akan Datang',
      aboutSeries: 'Tentang Siri',
      forEveryone: 'Untuk Semua',
      whatsNext: 'Seterusnya',
    },
    hi: {
      title: 'ऐप के बारे में',
      authors: 'डेवलपर्स के बारे में',
      authorsDesc: 'इस ऐप को किसने बनाया',
      series: 'Şapak ऐप सीरीज़',
      seriesDesc: 'अन्य ऐप्स',
      version: 'संस्करण',
      authorsContent: 'Şapak – Ykjam Terjime को तुर्कमेनिस्तान के मैरी प्रांत, मैरी शहर की डेवलपमेंट टीम Şapak द्वारा विकसित किया गया है।\n\nहमारा मिशन तुर्कमेनिस्तान के लोगों — देश के भीतर और विदेश में रहने वाले दोनों — के साथ-साथ आगंतुकों को कई भाषाओं में आसानी से संवाद करने में मदद करना है।\n\nयह ऐप 31 भाषाओं का समर्थन करता है और इसमें शामिल हैं:\n• वाक्यांश पुस्तक\n• अनुवादक\n• AI सहायक\n• वॉयस अनुवादक (जल्द आ रहा है)\n• विज़ुअल अनुवादक (जल्द आ रहा है)\n\nफीडबैक, त्रुटियों या सुझावों के लिए:\nshapak.app@gmail.com\n\nतुर्कमेन ऑडियो रिकॉर्डिंग के लिए अपनी आवाज़ प्रदान करने के लिए Daňatarowa Gülhatyja को विशेष धन्यवाद।',
      seriesContent: 'Şapak ऐप सीरीज़ एप्लिकेशन का एक व्यापक सूट है जो मुख्य रूप से तुर्कमेनिस्तान के लोगों को विदेशी भाषाएं सीखने में मदद करने के लिए डिज़ाइन किया गया है।\n\nहालांकि ये ऐप्स तुर्कमेन उपयोगकर्ताओं को ध्यान में रखकर बनाए गए हैं, इन्हें दुनिया भर के लोग आसानी से उपयोग कर सकते हैं।\n\nŞapak – Ykjam Terjime सीरीज़ का पहला ऐप है। यह वाक्यांश पुस्तक, टेक्स्ट और वॉयस ट्रांसलेटर, विज़ुअल ट्रांसलेटर के कार्यों के साथ-साथ उन्नत AI-संचालित सुविधाओं को जोड़ता है।\n\nसीरीज़ के अन्य ऐप्स वर्तमान में सक्रिय विकास में हैं — अपडेट के लिए बने रहें!',
      mission: 'मिशन',
      features: 'सुविधाएं',
      contact: 'संपर्क',
      specialThanks: 'विशेष धन्यवाद',
      soon: 'जल्द आ रहा है',
      aboutSeries: 'सीरीज़ के बारे में',
      forEveryone: 'सभी के लिए',
      whatsNext: 'आगे क्या',
    },
    ar: {
      title: 'حول التطبيق',
      authors: 'حول المطورين',
      authorsDesc: 'من أنشأ هذا التطبيق',
      series: 'سلسلة تطبيقات Şapak',
      seriesDesc: 'تطبيقات أخرى',
      version: 'الإصدار',
      authorsContent: 'تم تطوير Şapak – Ykjam Terjime بواسطة فريق التطوير Şapak من مدينة ماري، مقاطعة ماري، تركمانستان.\n\nمهمتنا هي مساعدة شعب تركمانستان — سواء المقيمين في البلاد أو في الخارج — بالإضافة إلى الزوار، على التواصل بسهولة بلغات متعددة.\n\nيدعم التطبيق 31 لغة ويتضمن:\n• كتاب العبارات\n• المترجم\n• مساعدو الذكاء الاصطناعي\n• مترجم صوتي (قريبًا)\n• مترجم مرئي (قريبًا)\n\nللملاحظات أو الأخطاء أو الاقتراحات:\nshapak.app@gmail.com\n\nشكر خاص لـ Daňatarowa Gülhatyja لتوفير صوتها للتسجيلات الصوتية التركمانية.',
      seriesContent: 'سلسلة تطبيقات Şapak هي مجموعة شاملة من التطبيقات المصممة بشكل أساسي لمساعدة شعب تركمانستان على تعلم اللغات الأجنبية.\n\nعلى الرغم من أن هذه التطبيقات تم إنشاؤها مع وضع المستخدمين التركمان في الاعتبار، إلا أنه يمكن للأشخاص في جميع أنحاء العالم استخدامها بسهولة.\n\nŞapak – Ykjam Terjime هو التطبيق الأول في السلسلة. يجمع بين وظائف كتاب العبارات والمترجم النصي والصوتي والمترجم المرئي بالإضافة إلى ميزات الذكاء الاصطناعي المتقدمة.\n\nالتطبيقات الأخرى في السلسلة قيد التطوير النشط حاليًا — ترقبوا التحديثات!',
      mission: 'المهمة',
      features: 'الميزات',
      contact: 'اتصل بنا',
      specialThanks: 'شكر خاص',
      soon: 'قريبًا',
      aboutSeries: 'عن السلسلة',
      forEveryone: 'للجميع',
      whatsNext: 'ما التالي',
    },
    fa: {
      title: 'درباره برنامه',
      authors: 'درباره توسعه‌دهندگان',
      authorsDesc: 'چه کسی این برنامه را ساخت',
      series: 'مجموعه برنامه‌های Şapak',
      seriesDesc: 'برنامه‌های دیگر',
      version: 'نسخه',
      authorsContent: 'Şapak – Ykjam Terjime توسط تیم توسعه‌دهندگان Şapak از شهر ماری، استان ماری، ترکمنستان توسعه یافته است.\n\nمأموریت ما کمک به مردم ترکمنستان — چه ساکنان داخل کشور و چه خارج از کشور — و همچنین بازدیدکنندگان برای برقراری ارتباط آسان به زبان‌های متعدد است.\n\nاین برنامه از 31 زبان پشتیبانی می‌کند و شامل:\n• کتاب عبارات\n• مترجم\n• دستیاران هوش مصنوعی\n• مترجم صوتی (به زودی)\n• مترجم بصری (به زودی)\n\nبرای بازخورد، خطاها یا پیشنهادات:\nshapak.app@gmail.com\n\nتشکر ویژه از Daňatarowa Gülhatyja برای ارائه صدایش برای ضبط‌های صوتی ترکمنی.',
      seriesContent: 'مجموعه برنامه‌های Şapak یک مجموعه جامع از برنامه‌ها است که عمدتاً برای کمک به مردم ترکمنستان در یادگیری زبان‌های خارجی طراحی شده است.\n\nاگرچه این برنامه‌ها با در نظر گرفتن کاربران ترکمن ساخته شده‌اند، اما مردم سراسر جهان می‌توانند به راحتی از آنها استفاده کنند.\n\nŞapak – Ykjam Terjime اولین برنامه در این مجموعه است. این برنامه عملکردهای کتاب عبارات، مترجم متن و صدا، مترجم بصری و همچنین ویژگی‌های پیشرفته مبتنی بر هوش مصنوعی را ترکیب می‌کند.\n\nبرنامه‌های دیگر در این مجموعه در حال حاضر در حال توسعه فعال هستند — منتظر به‌روزرسانی‌ها باشید!',
      mission: 'مأموریت',
      features: 'ویژگی‌ها',
      contact: 'تماس',
      specialThanks: 'تشکر ویژه',
      soon: 'به زودی',
      aboutSeries: 'درباره مجموعه',
      forEveryone: 'برای همه',
      whatsNext: 'بعدی چیست',
    },
    ur: {
      title: 'ایپ کے بارے میں',
      authors: 'ڈویلپرز کے بارے میں',
      authorsDesc: 'اس ایپ کو کس نے بنایا',
      series: 'Şapak ایپ سیریز',
      seriesDesc: 'دیگر ایپس',
      version: 'ورژن',
      authorsContent: 'Şapak – Ykjam Terjime کو ترکمانستان کے صوبہ ماری، شہر ماری کی ڈیولپمنٹ ٹیم Şapak نے تیار کیا ہے۔\n\nہمارا مشن ترکمانستان کے لوگوں — ملک کے اندر اور بیرون ملک دونوں — کے ساتھ ساتھ زائرین کو متعدد زبانوں میں آسانی سے بات چیت کرنے میں مدد کرنا ہے۔\n\nیہ ایپ 31 زبانوں کی حمایت کرتی ہے اور اس میں شامل ہیں:\n• فقرات کی کتاب\n• مترجم\n• AI معاونین\n• صوتی مترجم (جلد آ رہا ہے)\n• بصری مترجم (جلد آ رہا ہے)\n\nرائے، غلطیوں یا تجاویز کے لیے:\nshapak.app@gmail.com\n\nترکمان آڈیو ریکارڈنگز کے لیے اپنی آواز فراہم کرنے کے لیے Daňatarowa Gülhatyja کا خصوصی شکریہ۔',
      seriesContent: 'Şapak ایپ سیریز ایپلیکیشنز کا ایک جامع سوٹ ہے جو بنیادی طور پر ترکمانستان کے لوگوں کو غیر ملکی زبانیں سیکھنے میں مدد کے لیے ڈیزائن کیا گیا ہے۔\n\nاگرچہ یہ ایپس ترکمان صارفین کو ذہن میں رکھ کر بنائی گئی ہیں، لیکن دنیا بھر کے لوگ انہیں آسانی سے استعمال کر سکتے ہیں۔\n\nŞapak – Ykjam Terjime سیریز کی پہلی ایپ ہے۔ یہ فقرات کی کتاب، ٹیکسٹ اور وائس ٹرانسلیٹر، ویژول ٹرانسلیٹر کے ساتھ ساتھ جدید AI سے چلنے والی خصوصیات کو یکجا کرتی ہے۔\n\nسیریز کی دیگر ایپس فی الوقت فعال ترقی میں ہیں — اپڈیٹس کے لیے دیکھتے رہیں!',
      mission: 'مشن',
      features: 'خصوصیات',
      contact: 'رابطہ',
      specialThanks: 'خصوصی شکریہ',
      soon: 'جلد آرہا ہے',
      aboutSeries: 'سیریز کے بارے میں',
      forEveryone: 'سب کے لیے',
      whatsNext: 'آگے کیا',
    },
    ps: {
      title: 'د اپلیکیشن په اړه',
      authors: 'د جوړونکو په اړه',
      authorsDesc: 'چا دا اپلیکیشن جوړ کړ',
      series: 'د Şapak اپلیکیشن لړۍ',
      seriesDesc: 'نور اپلیکیشنونه',
      version: 'نسخه',
      authorsContent: 'Şapak – Ykjam Terjime د ترکمنستان د ماري ولایت، ماري ښار څخه د پراختیا ټیم Şapak لخوا جوړ شوی دی.\n\nزموږ ماموریت د ترکمنستان خلکو — دواړه هغه چې په هیواد او بهر کې ژوند کوي — او همدارنګه میلمنو سره مرسته کول دي چې په څو ژبو کې په اسانۍ سره خبرې وکړي.\n\nدا اپلیکیشن 31 ژبې ملاتړ کوي او شامل دي:\n• د جملو کتاب\n• ژباړونکی\n• AI مرستندویان\n• غږیز ژباړونکی (ډیر ژر)\n• لیدونکی ژباړونکی (ډیر ژر)\n\nد فیډبیک، غلطیو، یا وړاندیزونو لپاره:\nshapak.app@gmail.com\n\nد ترکمني آډیو ریکارډینګونو لپاره خپل غږ چمتو کولو لپاره Daňatarowa Gülhatyja ته ځانګړې مننه.',
      seriesContent: 'د Şapak اپلیکیشن لړۍ د اپلیکیشنونو یوه جامعه مجموعه ده چې په عمده توګه د ترکمنستان خلکو سره مرسته کوي چې بهرنۍ ژبې زده کړي.\n\nکه څه هم دا اپلیکیشنونه د ترکمن کاروونکو په ذهن کې جوړ شوي، خو د نړۍ خلک یې په اسانۍ سره کارولی شي.\n\nŞapak – Ykjam Terjime په لړۍ کې لومړی اپلیکیشن دی. دا د جملو کتاب، متن او غږ ژباړونکي، لیدلو ژباړونکي د دندو سربیره د AI پرمختللي ځانګړتیاوې سره یوځای کوي.\n\nپه لړۍ کې نور اپلیکیشنونه اوس مهال په فعاله پرمختګ کې دي — د تازه معلوماتو لپاره تماشه کوئ!',
      mission: 'ماموریت',
      features: 'ځانګړتیاوې',
      contact: 'اړیکه',
      specialThanks: 'ځانګړی مننه',
      soon: 'ډیر ژر',
      aboutSeries: 'د لړۍ په اړه',
      forEveryone: 'د ټولو لپاره',
      whatsNext: 'بل څه',
    },
    tr: {
      title: 'Uygulama Hakkında',
      authors: 'Geliştiriciler Hakkında',
      authorsDesc: 'Bu uygulamayı kim yaptı',
      series: 'Şapak Uygulama Serisi',
      seriesDesc: 'Diğer uygulamalar',
      version: 'Sürüm',
      authorsContent: 'Şapak – Ykjam Terjime, Türkmenistan\'ın Mary Vilayeti, Mary şehrinden geliştirici ekibi Şapak tarafından geliştirilmiştir.\n\nMisyonumuz, Türkmenistan halkının — hem ülkede hem de yurt dışında yaşayanların — ve ziyaretçilerin birden fazla dilde kolayca iletişim kurmasına yardımcı olmaktır.\n\nUygulama 31 dili destekler ve şunları içerir:\n• Konuşma kılavuzu\n• Çevirmen\n• Yapay zeka asistanları\n• Sesli çevirmen (yakında)\n• Görsel çevirmen (yakında)\n\nGeri bildirim, hatalar veya öneriler için:\nshapak.app@gmail.com\n\nTürkmen ses kayıtları için sesini sağladığı için Daňatarowa Gülhatyja\'ya özel teşekkürler.',
      seriesContent: 'Şapak Uygulama Serisi, öncelikle Türkmenistan halkının yabancı dil öğrenmesine yardımcı olmak için tasarlanmış kapsamlı bir uygulama paketidir.\n\nBu uygulamalar Türkmen kullanıcılar göz önünde bulundurularak oluşturulmuş olsa da, dünyanın her yerinden insanlar tarafından kolayca kullanılabilir.\n\nŞapak – Ykjam Terjime serideki ilk uygulamadır. Konuşma kılavuzu, metin ve ses çevirmeni, görsel çevirmen işlevlerini ve gelişmiş yapay zeka destekli özellikleri birleştirir.\n\nSerideki diğer uygulamalar şu anda aktif geliştirme aşamasındadır — güncellemeler için takipte kalın!',
      mission: 'Misyon',
      features: 'Özellikler',
      contact: 'İletişim',
      specialThanks: 'Özel Teşekkürler',
      soon: 'Yakında',
      aboutSeries: 'Seri Hakkında',
      forEveryone: 'Herkes İçin',
      whatsNext: 'Sırada Ne Var',
    },
    az: {
      title: 'Tətbiq haqqında',
      authors: 'Tərtibatçılar haqqında',
      authorsDesc: 'Bu tətbiqi kim yaratdı',
      series: 'Şapak Tətbiq Seriyası',
      seriesDesc: 'Digər tətbiqlər',
      version: 'Versiya',
      authorsContent: 'Şapak – Ykjam Terjime Türkmənistanın Mary Vilayəti, Mary şəhərindən inkişaf komandası Şapak tərəfindən hazırlanmışdır.\n\nMissiyamız Türkmənistan xalqına — həm ölkədə, həm də xaricdə yaşayanlara — və ziyarətçilərə bir neçə dildə asanlıqla ünsiyyət qurmaqda kömək etməkdir.\n\nTətbiq 31 dili dəstəkləyir və bunları əhatə edir:\n• İfadə kitabı\n• Tərcüməçi\n• Süni intellekt köməkçiləri\n• Səsli tərcüməçi (tezliklə)\n• Vizual tərcüməçi (tezliklə)\n\nRəy, xətalar və ya təkliflər üçün:\nshapak.app@gmail.com\n\nTürkmən audio yazıları üçün səsini təqdim etdiyi üçün Daňatarowa Gülhatyja-ya xüsusi təşəkkür.',
      seriesContent: 'Şapak Tətbiq Seriyası ilk növbədə Türkmənistan xalqının xarici dillər öyrənməsinə kömək etmək üçün hazırlanmış hərtərəfli tətbiqlər toplusudur.\n\nBu tətbiqlər türkmən istifadəçiləri nəzərdə tutularaq yaradılsa da, dünyanın hər yerindən insanlar asanlıqla istifadə edə bilər.\n\nŞapak – Ykjam Terjime seriyadakı ilk tətbiqdir. O, ifadə kitabı, mətn və səs tərcüməçisi, vizual tərcüməçi funksiyalarını və qabaqcıl süni intellekt əsaslı xüsusiyyətləri birləşdirir.\n\nSeriyadakı digər tətbiqlər hazırda aktiv inkişaf mərhələsindədir — yeniləmələri izləyin!',
      mission: 'Missiya',
      features: 'Xüsusiyyətlər',
      contact: 'Əlaqə',
      specialThanks: 'Xüsusi Təşəkkür',
      soon: 'Tezliklə',
      aboutSeries: 'Seriya haqqında',
      forEveryone: 'Hamı üçün',
      whatsNext: 'Növbəti nədir',
    },
    uz: {
      title: 'Ilova haqida',
      authors: 'Ishlab chiquvchilar haqida',
      authorsDesc: 'Bu ilovani kim yaratdi',
      series: 'Şapak Ilova Seriyasi',
      seriesDesc: 'Boshqa ilovalar',
      version: 'Versiya',
      authorsContent: 'Şapak – Ykjam Terjime Turkmanistonning Mari viloyati, Mari shahridan dasturchilar jamoasi Şapak tomonidan ishlab chiqilgan.\n\nBizning missiyamiz - Turkmaniston xalqiga — mamlakat ichida va tashqarisida yashovchilarga — hamda mehmonlarga bir nechta tillarda oson muloqot qilishda yordam berishdir.\n\nIlova 31 tilni qo\'llab-quvvatlaydi va quyidagilarni o\'z ichiga oladi:\n• Iboralar kitobi\n• Tarjimon\n• AI yordamchilari\n• Ovozli tarjimon (tez orada)\n• Vizual tarjimon (tez orada)\n\nFikr-mulohazalar, xatolar yoki takliflar uchun:\nshapak.app@gmail.com\n\nTurkman audio yozuvlari uchun ovozini taqdim etgani uchun Daňatarowa Gülhatyja-ga alohida rahmat.',
      seriesContent: 'Şapak Ilova Seriyasi - bu birinchi navbatda Turkmaniston xalqiga chet tillarini o\'rganishda yordam berish uchun mo\'ljallangan keng qamrovli ilovalar to\'plami.\n\nBu ilovalar turkman foydalanuvchilari uchun yaratilgan bo\'lsa-da, dunyo bo\'ylab odamlar tomonidan osongina foydalanilishi mumkin.\n\nŞapak – Ykjam Terjime seriyadagi birinchi ilova. U iboralar kitobi, matn va ovoz tarjimoni, vizual tarjimon funksiyalarini hamda ilg\'or AI asosidagi xususiyatlarni birlashtiradi.\n\nSeriyadagi boshqa ilovalar hozirda faol ishlab chiqilmoqda — yangilanishlarni kuzatib boring!',
    },
    kk: {
      title: 'Қолданба туралы',
      authors: 'Әзірлеушілер туралы',
      authorsDesc: 'Бұл қолданбаны кім жасады',
      series: 'Şapak қолданба сериясы',
      seriesDesc: 'Басқа қолданбалар',
      version: 'Нұсқа',
      authorsContent: 'Şapak – Ykjam Terjime Түрікменстанның Мары облысы, Мары қаласынан әзірлеушілер тобы Şapak әзірледі.\n\nБіздің миссиямыз - Түрікменстан халқына — елде де, шетелде де тұратындарға — және қонақтарға бірнеше тілде оңай қарым-қатынас жасауға көмектесу.\n\nҚолданба 31 тілді қолдайды және мыналарды қамтиды:\n• Сөйлемдер кітабы\n• Аудармашы\n• AI көмекшілер\n• Дауыстық аудармашы (жақын арада)\n• Визуалды аудармашы (жақын арада)\n\nПікірлер, қателер немесе ұсыныстар үшін:\nshapak.app@gmail.com\n\nТүрікмен аудио жазбалары үшін дауысын бергені үшін Daňatarowa Gülhatyja-ға ерекше рахмет.',
      seriesContent: 'Şapak қолданба сериясы - бұл ең алдымен Түрікменстан халқына шет тілдерін үйренуге көмектесу үшін жасалған кешенді қолданбалар жиынтығы.\n\nБұл қолданбалар түрікмен пайдаланушыларын ескере отырып жасалғанымен, бүкіл әлемдегі адамдар оңай пайдалана алады.\n\nŞapak – Ykjam Terjime сериядағы бірінші қолданба. Ол сөйлемдер кітабы, мәтін және дауыс аудармашысы, визуалды аудармашы функцияларын және озық AI негізіндегі мүмкіндіктерді біріктіреді.\n\nСериядағы басқа қолданбалар қазіргі уақытта белсенді әзірлеу кезеңінде — жаңартуларды қадағалап отырыңыз!',
      mission: 'Missiya',
      features: 'Xususiyatlar',
      contact: 'Aloqa',
      specialThanks: 'Maxsus minnatdorchilik',
      soon: 'Tez kunda',
      aboutSeries: 'Seriya haqida',
      forEveryone: 'Hamma uchun',
      whatsNext: 'Keyingisi nima',
    },
    ky: {
      title: 'Колдонмо жөнүндө',
      authors: 'Иштеп чыгуучулар жөнүндө',
      authorsDesc: 'Бул колдонмону ким жасады',
      series: 'Şapak колдонмо сериясы',
      seriesDesc: 'Башка колдонмолор',
      version: 'Версия',
      authorsContent: 'Şapak – Ykjam Terjime Түркмөнстандын Мары областы, Мары шаарынан иштеп чыгуучулар тобу Şapak тарабынан иштелип чыккан.\n\nБиздин миссиябыз - Түркмөнстан элине — өлкөдө жана чет өлкөдө жашагандарга — ошондой эле конокторго бир нече тилде оңой баарлашууга жардам берүү.\n\nКолдонмо 31 тилди колдойт жана төмөнкүлөрдү камтыйт:\n• Сүйлөмдөр китеби\n• Котормочу\n• AI жардамчылар\n• Үн котормочусу (жакында)\n• Визуалдык котормочу (жакында)\n\nПикир-сын, каталар же сунуштар үчүн:\nshapak.app@gmail.com\n\nТүркмөн аудио жазууларын үчүн үнүн бергени үчүн Daňatarowa Gülhatyja-га өзгөчө ыраазычылык.',
      seriesContent: 'Şapak колдонмо сериясы - бул биринчи кезекте Түркмөнстан элине чет тилдерин үйрөнүүгө жардам берүү үчүн иштелип чыккан комплекстүү колдонмолор жыйнагы.\n\nБул колдонмолор түркмөн колдонуучулар эске алынып түзүлгөн болсо да, дүйнө жүзүндөгү адамдар оңой эле колдоно алышат.\n\nŞapak – Ykjam Terjime сериядагы биринчи колдонмо. Ал сүйлөмдөр китеби, текст жана үн котормочусу, визуалдык котормочу функцияларын жана өнүккөн AI негизиндеги өзгөчөлүктөрдү бириктирет.\n\nСериядагы башка колдонмолор учурда активдүү иштелип чыгууда — жаңыртууларды байкап туруңуз!',
      mission: 'Миссия',
      features: 'Мүмкіндіктер',
      contact: 'Байланыс',
      specialThanks: 'Ерекше алғыс',
      soon: 'Жақында',
      aboutSeries: 'Серия туралы',
      forEveryone: 'Барлығына арналған',
      whatsNext: 'Келесі не',
    },
    tg: {
      title: 'Дар бораи барнома',
      authors: 'Дар бораи таҳиягарон',
      authorsDesc: 'Ин барномаро кӣ сохт',
      series: 'Силсилаи барномаҳои Şapak',
      seriesDesc: 'Барномаҳои дигар',
      version: 'Версия',
      authorsContent: 'Şapak – Ykjam Terjime аз ҷониби дастаи таҳиягарони Şapak аз шаҳри Мари, вилояти Мари, Туркманистон таҳия шудааст.\n\nМаҳорати мо кӯмак ба мардуми Туркманистон — ҳам дар дохили кишвар ва ҳам дар хориҷ зиндагикунандагон — ва меҳмонон барои муошират бо забонҳои зиёд ба осонӣ аст.\n\nБарнома 31 забонро дастгирӣ мекунад ва инҳоро дар бар мегирад:\n• Китоби ибораҳо\n• Тарҷумон\n• Дастёрони AI\n• Тарҷумони овозӣ (ба наздикӣ)\n• Тарҷумони визуалӣ (ба наздикӣ)\n\nБарои фикру мулоҳизаҳо, хатоҳо ё пешниҳодҳо:\nshapak.app@gmail.com\n\nТашаккури махсус ба Daňatarowa Gülhatyja барои пешниҳоди овози худ барои сабтҳои аудиоии туркманӣ.',
      seriesContent: 'Силсилаи барномаҳои Şapak маҷмӯаи ҳаматарафаи барномаҳоест, ки пеш аз ҳама барои кӯмак ба мардуми Туркманистон дар омӯзиши забонҳои хориҷӣ таҳия шудааст.\n\nГарчанде ки ин барномаҳо бо дар назардошти корбарони туркман таҳия шудаанд, мардуми саросари ҷаҳон метавонанд онҳоро ба осонӣ истифода баранд.\n\nŞapak – Ykjam Terjime аввалин барнома дар силсила аст. Он вазифаҳои китоби ибораҳо, тарҷумони матн ва овоз, тарҷумони визуалиро ҳамчунин хусусиятҳои пешрафтаи асосёфтаи AI-ро муттаҳид мекунад.\n\nБарномаҳои дигар дар силсила айни ҳол дар марҳилаи таҳияи фаъол қарор доранд — мунтазири навсозиҳо бошед!',
      mission: 'Миссия',
      features: 'Мүмкүнчүлүктөр',
      contact: 'Байланыш',
      specialThanks: 'Өзгөчө ыраазычылык',
      soon: 'Жакында',
      aboutSeries: 'Сериал жөнүндө',
      forEveryone: 'Баары үчүн',
      whatsNext: 'Кийинки эмне',
    },
    hy: {
      title: 'Հավելվածի մասին',
      authors: 'Մշակողների մասին',
      authorsDesc: 'Ով է ստեղծել այս հավելվածը',
      series: 'Şapak հավելվածների շարք',
      seriesDesc: 'Այլ հավելվածներ',
      version: 'Տարբերակ',
      authorsContent: 'Şapak – Ykjam Terjime մշակվել է Թուրքմենստանի Մարի նահանգի Մարի քաղաքից մշակողների թիմ Şapak-ի կողմից։\n\nՄեր առաքելությունն է օգնել Թուրքմենստանի ժողովրդին — և՛ երկրում, և՛ արտերկրում բնակվողներին — ինչպես նաև այցելուներին հեշտությամբ շփվել մի քանի լեզուներով։\n\nՀավելվածը աջակցում է 31 լեզու և ներառում է՝\n• Արտահայտությունների գիրք\n• Թարգմանիչ\n• AI օգնականներ\n• Ձայնային թարգմանիչ (շուտով)\n• Տեսողական թարգմանիչ (շուտով)\n\nԿարծիքների, սխալների կամ առաջարկների համար՝\nshapak.app@gmail.com\n\nՀատուկ շնորհակալություն Daňatarowa Gülhatyja-ին թուրքմեն աուդիո ձայնագրությունների համար իր ձայնը տրամադրելու համար։',
      seriesContent: 'Şapak հավելվածների շարքը հավելվածների համապարփակ փաթեթ է, որը նախատեսված է հիմնականում Թուրքմենստանի ժողովրդին օտար լեզուներ սովորելու օգնելու համար։\n\nԹեև այս հավելվածները ստեղծվել են թուրքմեն օգտատերերին նկատի ունենալով, դրանք կարող են հեշտությամբ օգտագործվել ամբողջ աշխարհի մարդկանց կողմից։\n\nŞapak – Ykjam Terjime շարքի առաջին հավելվածն է։ Այն համատեղում է արտահայտությունների գրքի, տեքստային և ձայնային թարգմանչի, տեսողական թարգմանչի գործառույթներն ու առաջադեմ AI-ի վրա հիմնված հնարավորությունները։\n\nՇարքի այլ հավելվածները ներկայումս ակտիվ մշակման փուլում են — սպասեք թարմացումներին!',
      mission: 'Миссия',
      features: 'Хусусиятҳо',
      contact: 'Тамос',
      specialThanks: 'Ташаккури махсус',
      soon: 'Ба зудӣ',
      aboutSeries: 'Дар бораи силсила',
      forEveryone: 'Барои ҳама',
      whatsNext: 'Баъдӣ чӣ',
    },
    ka: {
      title: 'აპლიკაციის შესახებ',
      authors: 'დეველოპერების შესახებ',
      authorsDesc: 'ვინ შექმნა ეს აპლიკაცია',
      series: 'Şapak აპლიკაციების სერია',
      seriesDesc: 'სხვა აპლიკაციები',
      version: 'ვერსია',
      authorsContent: 'Şapak – Ykjam Terjime შეიქმნა თურქმენეთის მარის პროვინცია, მარის ქალაქიდან დეველოპერთა გუნდი Şapak-ის მიერ.\n\nჩვენი მისიაა დავეხმაროთ თურქმენეთის ხალხს — როგორც ქვეყანაში, ასევე საზღვარგარეთ მცხოვრებებს — და ასევე ვიზიტორებს მარტივად ურთიერთობაში რამდენიმე ენაზე.\n\nაპლიკაცია მხარს უჭერს 31 ენას და მოიცავს:\n• ფრაზების წიგნს\n• მთარგმნელს\n• AI ასისტენტებს\n• ხმოვან მთარგმნელს (მალე)\n• ვიზუალურ მთარგმნელს (მალე)\n\nგამოხმაურებისთვის, შეცდომებისთვის ან წინადადებებისთვის:\nshapak.app@gmail.com\n\nგანსაკუთრებული მადლობა Daňatarowa Gülhatyja-ს თურქმენული აუდიო ჩანაწერებისთვის მისი ხმის უზრუნველყოფისთვის.',
      seriesContent: 'Şapak აპლიკაციების სერია არის აპლიკაციების ყოვლისმომცველი პაკეტი, რომელიც პირველ რიგში შექმნილია თურქმენეთის ხალხის დასახმარებლად უცხო ენების შესწავლაში.\n\nმიუხედავად იმისა, რომ ეს აპლიკაციები შექმნილია თურქმენი მომხმარებლების გათვალისწინებით, მთელი მსოფლიოს ხალხს შეუძლია მათი ადვილად გამოყენება.\n\nŞapak – Ykjam Terjime სერიის პირველი აპლიკაციაა. ის აერთიანებს ფრაზების წიგნის, ტექსტური და ხმოვანი მთარგმნელის, ვიზუალური მთარგმნელის ფუნქციებსა და მოწინავე AI-ზე დაფუძნებულ შესაძლებლობებს.\n\nსერიის სხვა აპლიკაციები ამჟამად აქტიურ განვითარებაშია — მიჰყევით განახლებებს!',
      mission: 'Mission',
      features: 'Features',
      contact: 'Contact',
      specialThanks: 'Special Thanks',
      soon: 'Soon',
      aboutSeries: 'About Series',
      forEveryone: 'For Everyone',
      whatsNext: "What's Next",
    },
    de: {
      title: 'Über die App',
      authors: 'Über die Entwickler',
      authorsDesc: 'Wer hat diese App erstellt',
      series: 'Şapak App-Serie',
      seriesDesc: 'Andere Apps',
      version: 'Version',
      authorsContent: 'Şapak – Ykjam Terjime wurde vom Entwicklerteam Şapak aus Mary, Provinz Mary, Turkmenistan entwickelt.\n\nUnsere Mission ist es, den Menschen in Turkmenistan — sowohl denen, die im Land als auch im Ausland leben — sowie Besuchern zu helfen, einfach in mehreren Sprachen zu kommunizieren.\n\nDie App unterstützt 31 Sprachen und enthält:\n• Phrasenbuch\n• Übersetzer\n• KI-Assistenten\n• Sprachübersetzer (demnächst)\n• Visueller Übersetzer (demnächst)\n\nFür Feedback, Fehler oder Vorschläge:\nshapak.app@gmail.com\n\nBesonderer Dank an Daňatarowa Gülhatyja für die Bereitstellung ihrer Stimme für die turkmenischen Audioaufnahmen.',
      seriesContent: 'Die Şapak App-Serie ist eine umfassende Suite von Anwendungen, die hauptsächlich dazu dienen, den Menschen in Turkmenistan beim Erlernen von Fremdsprachen zu helfen.\n\nObwohl diese Apps mit turkmenischen Nutzern im Hinterkopf erstellt wurden, können sie von Menschen auf der ganzen Welt problemlos genutzt werden.\n\nŞapak – Ykjam Terjime ist die erste App der Serie. Sie vereint die Funktionen eines Phrasenbuchs, Text- und Sprachübersetzers, visuellen Übersetzers sowie fortschrittliche KI-gestützte Funktionen.\n\nAndere Apps der Serie befinden sich derzeit in aktiver Entwicklung — bleiben Sie dran für Updates!',
      mission: 'მისია',
      features: 'ფუნქციები',
      contact: 'კონტაქტი',
      specialThanks: 'განსაკუთრებული მადლობა',
      soon: 'მალე',
      aboutSeries: 'სერიის შესახებ',
      forEveryone: 'ყველასთვის',
      whatsNext: 'რა არის შემდეგ',
    },
    fr: {
      title: 'À propos',
      authors: 'À propos des développeurs',
      authorsDesc: 'Qui a créé cette application',
      series: 'Série d\'applications Şapak',
      seriesDesc: 'Autres applications',
      version: 'Version',
      authorsContent: 'Şapak – Ykjam Terjime a été développé par l\'équipe de développement Şapak de Mary, province de Mary, Turkménistan.\n\nNotre mission est d\'aider les habitants du Turkménistan — aussi bien ceux vivant dans le pays qu\'à l\'étranger — ainsi que les visiteurs à communiquer facilement dans plusieurs langues.\n\nL\'application prend en charge 31 langues et comprend :\n• Guide de conversation\n• Traducteur\n• Assistants IA\n• Traducteur vocal (bientôt)\n• Traducteur visuel (bientôt)\n\nPour les commentaires, erreurs ou suggestions :\nshapak.app@gmail.com\n\nRemerciements particuliers à Daňatarowa Gülhatyja pour avoir fourni sa voix pour les enregistrements audio turkmènes.',
      seriesContent: 'La série d\'applications Şapak est une suite complète d\'applications conçues principalement pour aider les habitants du Turkménistan à apprendre des langues étrangères.\n\nBien que ces applications soient créées en pensant aux utilisateurs turkmènes, elles peuvent être facilement utilisées par des personnes du monde entier.\n\nŞapak – Ykjam Terjime est la première application de la série. Elle combine les fonctions de guide de conversation, traducteur de texte et vocal, traducteur visuel, ainsi que des fonctionnalités avancées basées sur l\'IA.\n\nD\'autres applications de la série sont actuellement en développement actif — restez à l\'écoute pour les mises à jour!',
    },
    es: {
      title: 'Acerca de',
      authors: 'Acerca de los desarrolladores',
      authorsDesc: 'Quién creó esta aplicación',
      series: 'Serie de apps Şapak',
      seriesDesc: 'Otras aplicaciones',
      version: 'Versión',
      authorsContent: 'Şapak – Ykjam Terjime fue desarrollado por el equipo de desarrollo Şapak de Mary, Provincia de Mary, Turkmenistán.\n\nNuestra misión es ayudar a la gente de Turkmenistán — tanto los que viven en el país como en el extranjero — así como a los visitantes, a comunicarse fácilmente en múltiples idiomas.\n\nLa aplicación admite 31 idiomas e incluye:\n• Libro de frases\n• Traductor\n• Asistentes de IA\n• Traductor de voz (próximamente)\n• Traductor visual (próximamente)\n\nPara comentarios, errores o sugerencias:\nshapak.app@gmail.com\n\nAgradecimiento especial a Daňatarowa Gülhatyja por proporcionar su voz para las grabaciones de audio en turcomano.',
      seriesContent: 'La serie de aplicaciones Şapak es un conjunto integral de aplicaciones diseñadas principalmente para ayudar a la gente de Turkmenistán a aprender idiomas extranjeros.\n\nAunque estas aplicaciones están creadas pensando en los usuarios turcomanos, pueden ser fácilmente utilizadas por personas de todo el mundo.\n\nŞapak – Ykjam Terjime es la primera aplicación de la serie. Combina las funciones de libro de frases, traductor de texto y voz, traductor visual, así como características avanzadas impulsadas por IA.\n\nOtras aplicaciones de la serie están actualmente en desarrollo activo — ¡estén atentos a las actualizaciones!',
      mission: 'Mission',
      features: 'Funktionen',
      contact: 'Kontakt',
      specialThanks: 'Besonderer Dank',
      soon: 'Bald',
      aboutSeries: 'Über die Serie',
      forEveryone: 'Für alle',
      whatsNext: 'Was kommt als Nächstes',
    },
    it: {
      title: 'Informazioni',
      authors: 'Informazioni sugli sviluppatori',
      authorsDesc: 'Chi ha creato questa app',
      series: 'Serie di app Şapak',
      seriesDesc: 'Altre applicazioni',
      version: 'Versione',
      authorsContent: 'Şapak – Ykjam Terjime è stato sviluppato dal team di sviluppo Şapak da Mary, Provincia di Mary, Turkmenistan.\n\nLa nostra missione è aiutare le persone del Turkmenistan — sia quelle che vivono nel paese che all\'estero — così come i visitatori, a comunicare facilmente in più lingue.\n\nL\'app supporta 31 lingue e include:\n• Frasario\n• Traduttore\n• Assistenti AI\n• Traduttore vocale (in arrivo)\n• Traduttore visivo (in arrivo)\n\nPer feedback, errori o suggerimenti:\nshapak.app@gmail.com\n\nUn ringraziamento speciale a Daňatarowa Gülhatyja per aver fornito la sua voce per le registrazioni audio turkmene.',
      seriesContent: 'La serie di app Şapak è una suite completa di applicazioni progettate principalmente per aiutare il popolo del Turkmenistan ad imparare le lingue straniere.\n\nSebbene queste app siano create pensando agli utenti turkmeni, possono essere facilmente utilizzate da persone di tutto il mondo.\n\nŞapak – Ykjam Terjime è la prima app della serie. Combina le funzioni di frasario, traduttore di testo e voce, traduttore visivo, nonché funzionalità avanzate basate sull\'IA.\n\nAltre app della serie sono attualmente in sviluppo attivo — restate sintonizzati per gli aggiornamenti!',
    },
    pt: {
      title: 'Sobre',
      authors: 'Sobre os desenvolvedores',
      authorsDesc: 'Quem criou este aplicativo',
      series: 'Série de apps Şapak',
      seriesDesc: 'Outros aplicativos',
      version: 'Versão',
      authorsContent: 'Şapak – Ykjam Terjime foi desenvolvido pela equipe de desenvolvimento Şapak de Mary, Província de Mary, Turcomenistão.\n\nNossa missão é ajudar o povo do Turcomenistão — tanto aqueles que vivem no país quanto no exterior — bem como visitantes, a se comunicarem facilmente em vários idiomas.\n\nO aplicativo suporta 31 idiomas e inclui:\n• Livro de frases\n• Tradutor\n• Assistentes de IA\n• Tradutor de voz (em breve)\n• Tradutor visual (em breve)\n\nPara feedback, erros ou sugestões:\nshapak.app@gmail.com\n\nAgradecimento especial a Daňatarowa Gülhatyja por fornecer sua voz para as gravações de áudio em turcomeno.',
      seriesContent: 'A série de aplicativos Şapak é um conjunto abrangente de aplicativos projetados principalmente para ajudar o povo do Turcomenistão a aprender idiomas estrangeiros.\n\nEmbora estes aplicativos sejam criados pensando nos usuários turcomenos, eles podem ser facilmente usados por pessoas de todo o mundo.\n\nŞapak – Ykjam Terjime é o primeiro aplicativo da série. Ele combina as funções de livro de frases, tradutor de texto e voz, tradutor visual, além de recursos avançados baseados em IA.\n\nOutros aplicativos da série estão atualmente em desenvolvimento ativo — fique atento às atualizações!',
      mission: 'Mission',
      features: 'Fonctionnalités',
      contact: 'Contact',
      specialThanks: 'Remerciements spéciaux',
      soon: 'Bientôt',
      aboutSeries: 'À propos de la série',
      forEveryone: 'Pour tous',
      whatsNext: 'Et ensuite',
    },
    pl: {
      title: 'O aplikacji',
      authors: 'O twórcach',
      authorsDesc: 'Kto stworzył tę aplikację',
      series: 'Seria aplikacji Şapak',
      seriesDesc: 'Inne aplikacje',
      version: 'Wersja',
      authorsContent: 'Şapak – Ykjam Terjime zostało opracowane przez zespół deweloperski Şapak z Mary, Prowincja Mary, Turkmenistan.\n\nNaszą misją jest pomoc ludziom z Turkmenistanu — zarówno mieszkającym w kraju, jak i za granicą — oraz odwiedzającym w łatwej komunikacji w wielu językach.\n\nAplikacja obsługuje 31 języków i zawiera:\n• Rozmówki\n• Tłumacz\n• Asystenci AI\n• Tłumacz głosowy (wkrótce)\n• Tłumacz wizualny (wkrótce)\n\nW przypadku opinii, błędów lub sugestii:\nshapak.app@gmail.com\n\nSpecjalne podziękowania dla Daňatarowa Gülhatyja za udostępnienie swojego głosu do nagrań audio w języku turkmeńskim.',
      seriesContent: 'Seria aplikacji Şapak to kompleksowy zestaw aplikacji zaprojektowanych przede wszystkim, aby pomóc mieszkańcom Turkmenistanu w nauce języków obcych.\n\nChociaż te aplikacje zostały stworzone z myślą o turkmeńskich użytkownikach, mogą być łatwo używane przez ludzi z całego świata.\n\nŞapak – Ykjam Terjime to pierwsza aplikacja w serii. Łączy funkcje rozmówek, tłumacza tekstu i mowy, tłumacza wizualnego, a także zaawansowane funkcje oparte na AI.\n\nInne aplikacje z serii są obecnie w trakcie aktywnego rozwoju — bądźcie na bieżąco z aktualizacjami!',
      mission: 'Misja',
      features: 'Funkcje',
      contact: 'Kontakt',
      specialThanks: 'Specjalne podziękowania',
      soon: 'Wkrótce',
      aboutSeries: 'O serii',
      forEveryone: 'Dla wszystkich',
      whatsNext: 'Co dalej',
    },
    nl: {
      title: 'Over de app',
      authors: 'Over de ontwikkelaars',
      authorsDesc: 'Wie heeft deze app gemaakt',
      series: 'Şapak app-serie',
      seriesDesc: 'Andere apps',
      version: 'Versie',
      authorsContent: 'Şapak – Ykjam Terjime is ontwikkeld door het ontwikkelteam Şapak uit Mary, Provincie Mary, Turkmenistan.\n\nOnze missie is om de mensen van Turkmenistan — zowel degenen die in het land wonen als in het buitenland — evenals bezoekers te helpen gemakkelijk te communiceren in meerdere talen.\n\nDe app ondersteunt 31 talen en bevat:\n• Taalgids\n• Vertaler\n• AI-assistenten\n• Spraakvertaler (binnenkort)\n• Visuele vertaler (binnenkort)\n\nVoor feedback, fouten of suggesties:\nshapak.app@gmail.com\n\nSpeciale dank aan Daňatarowa Gülhatyja voor het leveren van haar stem voor de Turkmeense audio-opnames.',
      seriesContent: 'De Şapak app-serie is een uitgebreide suite van applicaties die voornamelijk zijn ontworpen om de mensen van Turkmenistan te helpen bij het leren van vreemde talen.\n\nHoewel deze apps zijn gemaakt met Turkmeense gebruikers in gedachten, kunnen ze gemakkelijk worden gebruikt door mensen over de hele wereld.\n\nŞapak – Ykjam Terjime is de eerste app in de serie. Het combineert de functies van een taalgids, tekst- en spraakvertaler, visuele vertaler, evenals geavanceerde AI-aangedreven functies.\n\nAndere apps in de serie zijn momenteel in actieve ontwikkeling — blijf op de hoogte voor updates!',
      mission: 'Missie',
      features: 'Functies',
      contact: 'Contact',
      specialThanks: 'Speciale dank',
      soon: 'Binnenkort',
      aboutSeries: 'Over de serie',
      forEveryone: 'Voor iedereen',
      whatsNext: 'Wat komt er nog',
    },
    uk: {
      title: 'Про додаток',
      authors: 'Про розробників',
      authorsDesc: 'Хто створив цей додаток',
      series: 'Серія додатків Şapak',
      seriesDesc: 'Інші додатки',
      version: 'Версія',
      authorsContent: 'Şapak – Ykjam Terjime розроблено командою розробників Şapak з міста Мари, провінція Мари, Туркменістан.\n\nНаша місія — допомогти людям Туркменістану — як тим, хто живе в країні, так і за кордоном — а також відвідувачам легко спілкуватися кількома мовами.\n\nДодаток підтримує 31 мову та включає:\n• Розмовник\n• Перекладач\n• AI-асистенти\n• Голосовий перекладач (скоро)\n• Візуальний перекладач (скоро)\n\nДля відгуків, помилок або пропозицій:\nshapak.app@gmail.com\n\nОсобдива подяка Daňatarowa Gülhatyja за надання свого голосу для туркменських аудіозаписів.',
      seriesContent: 'Серія додатків Şapak — це комплексний набір додатків, розроблених насамперед для допомоги народу Туркменістану у вивченні іноземних мов.\n\nХоча ці додатки створені з урахуванням туркменських користувачів, ними можуть легко користуватися люди з усього світу.\n\nŞapak – Ykjam Terjime — перший додаток серії. Він поєднує функції розмовника, текстового та голосового перекладача, візуального перекладача, а також передові можливості на основі ШІ.\n\nІнші додатки серії зараз перебувають в активній розробці — слідкуйте за оновленнями!',
      mission: 'Місія',
      features: 'Функції',
      contact: 'Контакт',
      specialThanks: 'Особлива подяка',
      soon: 'Незабаром',
      aboutSeries: 'Про серію',
      forEveryone: 'Для всіх',
      whatsNext: 'Що далі',
    },
  };

  const t = aboutTexts[config.mode as keyof typeof aboutTexts] || aboutTexts.en;

  const handleEmailPress = () => {
    Linking.openURL('mailto:shapak.app@gmail.com');
  };

  const renderAuthorsContent = () => {
    // Parse the authors content to extract sections
    const content = t.authorsContent;
    const lines = content.split('\n\n');

    // Extract email from content
    const emailMatch = content.match(/shapak\.app@gmail\.com/);
    const email = emailMatch ? emailMatch[0] : 'shapak.app@gmail.com';

    return (
      <View>
        {/* Team Image */}
        <View style={styles.modalImageContainer}>
          <Image
            source={require('../../assets/shapak_logo.png')}
            style={{ width: 120, height: 120, borderRadius: 20 }}
            resizeMode="contain"
          />
        </View>

        {/* Team Info Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="business" size={20} color="#3B82F6" />
            <Text style={styles.sectionTitle}>{lines[0]}</Text>
          </View>
        </View>

        {/* Mission Section */}
        {lines[1] && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="flag" size={20} color="#10B981" />
              <Text style={styles.sectionTitle}>{(t as any).mission || 'Mission'}</Text>
            </View>
            <Text style={styles.sectionText}>{lines[1]}</Text>
          </View>
        )}

        {/* Features Section */}
        {lines[2] && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="apps" size={20} color="#F59E0B" />
              <Text style={styles.sectionTitle}>{(t as any).features || 'Features'}</Text>
            </View>
            <View style={styles.featuresList}>
              <FeatureItem icon="book" text={lines[2].includes('•') ? lines[2].split('•')[1]?.trim() || '' : ''} />
              <FeatureItem icon="language" text={lines[2].includes('•') ? lines[2].split('•')[2]?.trim() || '' : ''} />
              <FeatureItem icon="sparkles" text={lines[2].includes('•') ? lines[2].split('•')[3]?.trim() || '' : ''} />
              <FeatureItem icon="mic" text={lines[2].includes('•') ? lines[2].split('•')[4]?.trim() || '' : ''} badge={(t as any).soon || 'Soon'} />
              <FeatureItem icon="camera" text={lines[2].includes('•') ? lines[2].split('•')[5]?.trim() || '' : ''} badge={(t as any).soon || 'Soon'} />
            </View>
          </View>
        )}

        {/* Contact Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="mail" size={20} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>{(t as any).contact || 'Contact'}</Text>
          </View>
          <TouchableOpacity
            style={styles.emailButton}
            onPress={handleEmailPress}
            activeOpacity={0.7}
          >
            <Ionicons name="mail-outline" size={20} color="#3B82F6" />
            <Text style={styles.emailText}>{email}</Text>
            <Ionicons name="arrow-forward" size={16} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        {/* Thanks Section */}
        {lines[lines.length - 1] && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="heart" size={20} color="#EF4444" />
              <Text style={styles.sectionTitle}>{(t as any).specialThanks || 'Special Thanks'}</Text>
            </View>
            <Text style={styles.sectionText}>{lines[lines.length - 1]}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderSeriesContent = () => {
    const content = t.seriesContent;
    const lines = content.split('\n\n');

    return (
      <View>
        {/* Series Logo */}
        <View style={styles.modalImageContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.seriesLogo}
            resizeMode="contain"
          />
        </View>

        {/* About Series Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={20} color="#3B82F6" />
            <Text style={styles.sectionTitle}>{(t as any).aboutSeries || 'About Series'}</Text>
          </View>
          <Text style={styles.sectionText}>{lines[0]}</Text>
        </View>

        {/* For Everyone Section */}
        {lines[1] && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="globe" size={20} color="#10B981" />
              <Text style={styles.sectionTitle}>{(t as any).forEveryone || 'For Everyone'}</Text>
            </View>
            <Text style={styles.sectionText}>{lines[1]}</Text>
          </View>
        )}

        {/* First App Section */}
        {lines[2] && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="rocket" size={20} color="#F59E0B" />
              <Text style={styles.sectionTitle}>Şapak – Ykjam Terjime</Text>
            </View>
            <Text style={styles.sectionText}>{lines[2]}</Text>
          </View>
        )}

        {/* Coming Soon Section */}
        {lines[3] && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="time" size={20} color="#8B5CF6" />
              <Text style={styles.sectionTitle}>{(t as any).whatsNext || 'Coming Soon'}</Text>
            </View>
            <Text style={styles.sectionText}>{lines[3]}</Text>
          </View>
        )}
      </View>
    );
  };

  const FeatureItem = ({ icon, text, badge }: { icon: string; text: string; badge?: string }) => {
    if (!text) return null;
    return (
      <View style={styles.featureItem}>
        <View style={styles.featureIconContainer}>
          <Ionicons name={icon as any} size={18} color="#3B82F6" />
        </View>
        <Text style={styles.featureText}>{text}</Text>
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderModal = () => {
    if (!activeModal) return null;

    const isAuthors = activeModal === 'authors';
    const modalTitle = isAuthors ? t.authors : t.series;

    return (
      <Modal
        visible={!!activeModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActiveModal(null)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setActiveModal(null)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <View style={styles.modalPlaceholder} />
          </View>

          <ScrollView
            style={styles.modalContent}
            contentContainerStyle={{ paddingBottom: safeAreaBottom + 20 }}
            showsVerticalScrollIndicator={false}
          >
            {isAuthors ? renderAuthorsContent() : renderSeriesContent()}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={moderateScale(24)} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerBarTitle}>{t.title}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Math.max(safeAreaBottom, verticalScale(20)),
          paddingHorizontal: scale(16),
          paddingTop: verticalScale(16),
        }}
      >
        {/* Logo / App Icon */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Ykjam Terjime</Text>
          <Text style={styles.versionText}>{t.version} 1.0.0</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {/* About Authors */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setActiveModal('authors')}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#EBF5FF' }]}>
                <Ionicons name="people" size={24} color="#3B82F6" />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{t.authors}</Text>
                <Text style={styles.menuSubtitle}>{t.authorsDesc}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* About Shapak Series */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setActiveModal('series')}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFF7ED' }]}>
                <Image
                  source={require('../../assets/logo.png')}
                  style={styles.menuLogoIcon}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{t.series}</Text>
                <Text style={styles.menuSubtitle}>{t.seriesDesc}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 Ykjam Terjime</Text>
        </View>
      </ScrollView>

      {renderModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA',
    flex: 1,
  },
  headerBar: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
  },
  backButton: {
    alignItems: 'center',
    borderRadius: scale(20),
    height: scale(40),
    justifyContent: 'center',
    width: scale(40),
  },
  headerBarTitle: {
    color: '#1F2937',
    fontSize: moderateScale(18),
    fontWeight: '700',
  },
  placeholder: {
    width: scale(40),
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: verticalScale(24),
  },
  logoImage: {
    height: scale(100),
    marginBottom: verticalScale(8),
    width: scale(120),
  },
  menuLogoIcon: {
    height: scale(32),
    width: scale(32),
  },
  appName: {
    color: '#1F2937',
    fontSize: moderateScale(20),
    fontWeight: '700',
    marginBottom: verticalScale(4),
  },
  versionText: {
    color: '#6B7280',
    fontSize: moderateScale(14),
  },
  menuContainer: {
    gap: verticalScale(12),
  },
  menuItem: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: scale(12),
    borderWidth: 1,
    elevation: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: scale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  menuLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: scale(12),
    height: scale(48),
    justifyContent: 'center',
    width: scale(48),
  },
  menuText: {
    flex: 1,
    marginLeft: scale(16),
  },
  menuTitle: {
    color: '#1F2937',
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginBottom: verticalScale(2),
  },
  menuSubtitle: {
    color: '#6B7280',
    fontSize: moderateScale(14),
  },
  footer: {
    alignItems: 'center',
    paddingTop: verticalScale(32),
  },
  footerText: {
    color: '#9CA3AF',
    fontSize: moderateScale(14),
  },
  // Modal styles
  modalContainer: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  modalHeader: {
    alignItems: 'center',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
  },
  modalCloseButton: {
    alignItems: 'center',
    borderRadius: scale(20),
    height: scale(40),
    justifyContent: 'center',
    width: scale(40),
  },
  modalTitle: {
    color: '#1F2937',
    fontSize: moderateScale(18),
    fontWeight: '700',
  },
  modalPlaceholder: {
    width: scale(40),
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
  },
  modalText: {
    color: '#374151',
    fontSize: moderateScale(16),
    lineHeight: moderateScale(24),
  },
  // New modal styles
  modalImageContainer: {
    alignItems: 'center',
    paddingVertical: verticalScale(20),
  },
  teamIconContainer: {
    alignItems: 'center',
    backgroundColor: '#EBF5FF',
    borderRadius: scale(48),
    height: scale(96),
    justifyContent: 'center',
    width: scale(96),
  },
  seriesLogo: {
    height: scale(180),
    width: scale(180),
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: scale(12),
    borderWidth: 1,
    elevation: 1,
    marginBottom: verticalScale(12),
    padding: scale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: verticalScale(8),
  },
  sectionTitle: {
    color: '#1F2937',
    flex: 1,
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginLeft: scale(8),
  },
  sectionText: {
    color: '#4B5563',
    fontSize: moderateScale(15),
    lineHeight: moderateScale(22),
  },
  featuresList: {
    gap: verticalScale(8),
  },
  featureItem: {
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: scale(8),
    flexDirection: 'row',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
  },
  featureIconContainer: {
    alignItems: 'center',
    backgroundColor: '#EBF5FF',
    borderRadius: scale(16),
    height: scale(32),
    justifyContent: 'center',
    marginRight: scale(12),
    width: scale(32),
  },
  featureText: {
    color: '#374151',
    flex: 1,
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
  },
  badge: {
    backgroundColor: '#FEF3C7',
    borderRadius: scale(12),
    marginLeft: scale(8),
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
  },
  badgeText: {
    color: '#D97706',
    fontSize: moderateScale(11),
    fontWeight: '600',
  },
  emailButton: {
    alignItems: 'center',
    backgroundColor: '#EBF5FF',
    borderRadius: scale(8),
    flexDirection: 'row',
    gap: scale(8),
    padding: scale(12),
  },
  emailText: {
    color: '#3B82F6',
    flex: 1,
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
});


