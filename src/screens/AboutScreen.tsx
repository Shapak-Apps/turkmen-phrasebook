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
import { version as appVersion } from '../../package.json';
import { credits, CONTRIBUTORS_URL, githubProfileUrl } from '../data/credits';
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
      authorsContent: 'Ykjam Terjime – Türkmenistan, Mary welaýaty, Mary şäherinde ýerleşýän "Şapak" döredijiler topary tarapyndan döredildi.\n\nBiziň maksadymyz — Türkmenistanda ýaşaýan we şol bir wagtyň özünde daşary ýurtlara çykýan ildeşlerimize we ýurdumyza gelýän myhmanlara dürli dillerdäki gatnaşygy has aňsat we elýeterli etmekdir.\n\nProgramma 5 dili goldaýar we aşakdakylary öz içine alýar:\n• Hakyky ýagdaýlar üçin ssenariýaly gepleşik kitaby, jogaplar we offlaýn ulanmak\n• Tekst terjimeçi (ýakynda)\n• AI kömekçileri (ýakynda)\n• Sesli terjimeçi (ýakynda)\n• Wizual terjimeçi (ýakynda)\n\nTeklipler, ýalňyşlyklar ýa-da habarlaşmak üçin:\nshapak.apps@gmail.com',
      seriesContent: 'Şapak goşundylar toplumy — ilkinji nobatda Türkmenistanyň ilatynyň daşary ýurt dillerini öwrenmegine kömek etmek üçin döredilen toplumlaýyn goşundylardan ybaratdyr.\n\nGoşundy esasan türkmen ulanyjylary üçin niýetlense-de, bütin dünýäniň adamlary tarapyndan hem aňsatlyk bilen ulanylyp bilner.\n\nYkjam Terjime — toplumyň ilkinji goşundysydyr. Häzirki wagtda ol hakyky ýagdaýlar üçin ssenariýaly gepleşik kitabydyr (jogaplar we offlaýn ulanmak); tekst, sesli we wizual terjimeçiler hem-de Emeli Aň funksiýalary bolsa meýilleşdirilen (ýakynda).\n\nToplumyň beýleki goşundylary işjeň tapgyryndadyr — täzeliklerden habarly boluň!',
      mission: 'Wezipe',
      features: 'Mümkinçilikler',
      contact: 'Habarlaşmak',
      specialThanks: 'Aýratyn minnetdarlyk',
      thanksIntro: 'Şapak Apps topary taslama kömek edenlere minnetdarlyk bildirýär:',
      allContributors: 'Ähli goşant goşanlar GitHub-da',
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
      authorsContent: 'Ykjam Terjime 由来自土库曼斯坦马雷省马雷市的 Şapak 开发团队 开发。\n\n我们的使命是帮助土库曼斯坦人民——无论是生活在国内还是国外——以及访客，轻松使用多种语言进行交流。\n\n该应用支持 5 种语言，包括：\n• 面向真实场景的情景短语手册，支持回复与离线使用\n• 文本翻译器（即将推出）\n• AI 助手（即将推出）\n• 语音翻译器（即将推出）\n• 视觉翻译器（即将推出）\n\n反馈、错误或建议请联系：\nshapak.apps@gmail.com',
      seriesContent: 'Şapak 应用系列是一套全面的应用程序，主要旨在帮助土库曼斯坦人民学习外语。\n\n尽管这些应用是为土库曼用户设计的，但世界各地的人们都可以轻松使用。\n\nYkjam Terjime 是该系列的第一款应用。它目前是一本面向真实场景的情景短语手册，支持回复与离线使用；文本、语音和视觉翻译器以及 AI 功能尚在规划中（即将推出）。\n\n该系列的其他应用目前正在积极开发中——敬请关注更新！',
      mission: '使命',
      features: '功能',
      contact: '联系方式',
      specialThanks: '特别感谢',
      thanksIntro: 'Shapak Apps 团队感谢为本项目提供帮助的人：',
      allContributors: 'GitHub 上的所有贡献者',
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
      authorsContent: 'Ykjam Terjime создано командой разработчиков Şapak из города Мары, Марыйского велаята, Туркменистан.\n\nНаша миссия — помочь жителям Туркменистана, как находящимся в стране, так и за её пределами, а также гостям государства, легко и удобно общаться на разных языках.\n\nПриложение поддерживает 5 языков и включает:\n• Сценарный разговорник для реальных ситуаций, с ответами и офлайн-режимом\n• Текстовый переводчик (скоро)\n• AI-ассистенты (скоро)\n• Голосовой переводчик (скоро)\n• Визуальный переводчик (скоро)\n\nДля обратной связи, ошибок и предложений:\nshapak.apps@gmail.com',
      seriesContent: 'Серия приложений Şapak — это комплекс приложений, созданных прежде всего для того, чтобы помочь жителям Туркменистана изучать иностранные языки.\n\nНесмотря на то что приложения ориентированы на туркменистанцев, они могут быть с лёгкостью использованы людьми по всему миру.\n\nYkjam Terjime — первое приложение серии. Сейчас это сценарный разговорник для реальных ситуаций, с ответами и офлайн-режимом; текстовый, голосовой и визуальный переводчики, а также возможности искусственного интеллекта запланированы (скоро).\n\nДругие приложения серии находятся в активной разработке — оставайтесь с нами и следите за новостями!',
      mission: 'Миссия',
      features: 'Функции',
      contact: 'Контакт',
      specialThanks: 'Особая благодарность',
      thanksIntro: 'Команда Shapak Apps благодарит за помощь в проекте:',
      allContributors: 'Все контрибьюторы на GitHub',
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
      authorsContent: 'Ykjam Terjime is developed by the development team Şapak from Mary, Mary Province, Turkmenistan.\n\nOur mission is to help the people of Turkmenistan — both those living in the country and abroad — as well as visitors, communicate easily in multiple languages.\n\nThe app supports 5 languages and includes:\n• Scenario phrasebook for real situations, with replies and offline use\n• Text translator (coming soon)\n• AI assistants (coming soon)\n• Voice translator (coming soon)\n• Visual translator (coming soon)\n\nFor feedback, errors, or suggestions:\nshapak.apps@gmail.com',
      seriesContent: 'The Şapak app series is a comprehensive suite of applications designed primarily to help the people of Turkmenistan learn foreign languages.\n\nAlthough these apps are created with Turkmen users in mind, they can be easily used by people all around the world.\n\nYkjam Terjime is the first app in the series. It is currently a scenario phrasebook for real situations, with replies and offline use; the text, voice and visual translators as well as AI-powered features are planned (coming soon).\n\nOther apps in the series are currently in active development — stay tuned for updates!',
      mission: 'Mission',
      features: 'Features',
      contact: 'Contact',
      specialThanks: 'Special Thanks',
      thanksIntro: 'The Shapak Apps team thanks everyone who helped the project:',
      allContributors: 'All contributors on GitHub',
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
      authorsContent: 'Ykjam Terjimeは、トルクメニスタン、マリ州マリ市の開発チームŞapakによって開発されました。\n\n私たちの使命は、トルクメニスタンの人々——国内および海外在住者——ならびに訪問者が、複数の言語で簡単にコミュニケーションできるよう支援することです。\n\nこのアプリは5言語をサポートし、以下を含みます：\n• 実際の状況に対応したシナリオ会話集（返信・オフライン対応）\n• テキスト翻訳機（近日公開）\n• AIアシスタント（近日公開）\n• 音声翻訳機（近日公開）\n• ビジュアル翻訳機（近日公開）\n\nフィードバック、エラー、提案については：\nshapak.apps@gmail.com',
      seriesContent: 'Şapakアプリシリーズは、主にトルクメニスタンの人々が外国語を学ぶのを支援するために設計された包括的なアプリケーションスイートです。\n\nこれらのアプリはトルクメンユーザーを念頭に置いて作成されていますが、世界中の人々が簡単に使用できます。\n\nYkjam Terjimeはシリーズの最初のアプリです。現在は実際の状況に対応したシナリオ会話集（返信・オフライン対応）であり、テキスト・音声・ビジュアル翻訳機およびAI機能は計画中です（近日公開）。\n\nシリーズの他のアプリは現在積極的に開発中です — 更新情報をお待ちください！',
      mission: 'ミッション',
      features: '機能',
      contact: 'お問い合わせ',
      specialThanks: '特別な感謝',
      thanksIntro: 'Shapak Apps チームはプロジェクトに協力してくださった方々に感謝します：',
      allContributors: 'GitHub のすべての貢献者',
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
      authorsContent: 'Ykjam Terjime은 투르크메니스탄 마리 주 마리 시의 개발팀 Şapak이 개발했습니다.\n\n우리의 사명은 투르크메니스탄 사람들—국내 및 해외 거주자—과 방문객들이 여러 언어로 쉽게 소통할 수 있도록 돕는 것입니다.\n\n이 앱은 5개 언어를 지원하며 다음을 포함합니다:\n• 실제 상황을 위한 시나리오 회화집 (답변 및 오프라인 사용)\n• 텍스트 번역기 (곧 출시)\n• AI 어시스턴트 (곧 출시)\n• 음성 번역기 (곧 출시)\n• 시각 번역기 (곧 출시)\n\n피드백, 오류 또는 제안사항:\nshapak.apps@gmail.com',
      seriesContent: 'Şapak 앱 시리즈는 주로 투르크메니스탄 사람들이 외국어를 배울 수 있도록 설계된 포괄적인 애플리케이션 제품군입니다.\n\n이러한 앱은 투르크멘 사용자를 염두에 두고 만들어졌지만 전 세계 사람들이 쉽게 사용할 수 있습니다.\n\nYkjam Terjime은 시리즈의 첫 번째 앱입니다. 현재는 실제 상황을 위한 시나리오 회화집(답변 및 오프라인 사용)이며, 텍스트·음성·시각 번역기와 AI 기능은 계획 중입니다(곧 출시).\n\n시리즈의 다른 앱들은 현재 적극적으로 개발 중입니다 — 업데이트를 기대해 주세요!',
      mission: '미션',
      features: '기능',
      contact: '연락처',
      specialThanks: '특별한 감사',
      thanksIntro: 'Shapak Apps 팀은 프로젝트를 도와주신 분들께 감사드립니다:',
      allContributors: 'GitHub의 모든 기여자',
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
      authorsContent: 'Ykjam Terjime พัฒนาโดยทีมพัฒนา Şapak จากเมืองแมรี จังหวัดแมรี ประเทศเติร์กเมนิสถาน\n\nภารกิจของเราคือช่วยให้ชาวเติร์กเมนิสถาน — ทั้งผู้ที่อาศัยในประเทศและต่างประเทศ — รวมถึงผู้มาเยือน สื่อสารได้อย่างง่ายดายในหลายภาษา\n\nแอปนี้รองรับ 5 ภาษา และรวมถึง:\n• หนังสือวลีสถานการณ์สำหรับสถานการณ์จริง พร้อมคำตอบและการใช้งานแบบออฟไลน์\n• นักแปลข้อความ (เร็วๆ นี้)\n• ผู้ช่วย AI (เร็วๆ นี้)\n• นักแปลเสียง (เร็วๆ นี้)\n• นักแปลภาพ (เร็วๆ นี้)\n\nสำหรับข้อเสนอแนะ ข้อผิดพลาด หรือข้อเสนอแนะ:\nshapak.apps@gmail.com',
      seriesContent: 'ซีรีส์แอป Şapak เป็นชุดแอปพลิเคชันที่ครอบคลุม ออกแบบมาเพื่อช่วยให้ประชาชนเติร์กเมนิสถานเรียนรู้ภาษาต่างประเทศเป็นหลัก\n\nแม้ว่าแอปเหล่านี้สร้างขึ้นโดยคำนึงถึงผู้ใช้ชาวเติร์กเมน แต่ผู้คนทั่วโลกก็สามารถใช้งานได้อย่างง่ายดาย\n\nYkjam Terjime เป็นแอปแรกในซีรีส์ ปัจจุบันเป็นหนังสือวลีสถานการณ์สำหรับสถานการณ์จริง พร้อมคำตอบและการใช้งานแบบออฟไลน์ ส่วนนักแปลข้อความ เสียง และภาพ รวมถึงฟีเจอร์ AI อยู่ในแผนการพัฒนา (เร็วๆ นี้)\n\nแอปอื่นๆ ในซีรีส์กำลังอยู่ในระหว่างการพัฒนาอย่างต่อเนื่อง — ติดตามการอัปเดต!',
      mission: 'ภารกิจ',
      features: 'ฟีเจอร์',
      contact: 'ติดต่อ',
      specialThanks: 'ขอบคุณเป็นพิเศษ',
      thanksIntro: 'ทีม Shapak Apps ขอขอบคุณผู้ที่ช่วยเหลือโครงการ:',
      allContributors: 'ผู้มีส่วนร่วมทั้งหมดบน GitHub',
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
      authorsContent: 'Ykjam Terjime được phát triển bởi đội ngũ phát triển Şapak từ thành phố Mary, tỉnh Mary, Turkmenistan.\n\nSứ mệnh của chúng tôi là giúp người dân Turkmenistan — cả những người sống trong nước và nước ngoài — cũng như du khách, giao tiếp dễ dàng bằng nhiều ngôn ngữ.\n\nỨng dụng hỗ trợ 5 ngôn ngữ và bao gồm:\n• Sổ tay hội thoại theo kịch bản cho các tình huống thực tế, có câu trả lời và sử dụng ngoại tuyến\n• Trình dịch văn bản (sắp ra mắt)\n• Trợ lý AI (sắp ra mắt)\n• Trình dịch giọng nói (sắp ra mắt)\n• Trình dịch hình ảnh (sắp ra mắt)\n\nĐể gửi phản hồi, báo lỗi hoặc đề xuất:\nshapak.apps@gmail.com',
      seriesContent: 'Bộ ứng dụng Şapak là một bộ ứng dụng toàn diện được thiết kế chủ yếu để giúp người dân Turkmenistan học ngoại ngữ.\n\nMặc dù các ứng dụng này được tạo ra với người dùng Turkmen trong tâm trí, chúng có thể dễ dàng được sử dụng bởi mọi người trên khắp thế giới.\n\nYkjam Terjime là ứng dụng đầu tiên trong bộ. Hiện tại, đây là sổ tay hội thoại theo kịch bản cho các tình huống thực tế, có câu trả lời và sử dụng ngoại tuyến; các trình dịch văn bản, giọng nói, hình ảnh cùng các tính năng AI đang được lên kế hoạch (sắp ra mắt).\n\nCác ứng dụng khác trong bộ hiện đang được phát triển tích cực — hãy theo dõi các cập nhật!',
      mission: 'Sứ mệnh',
      features: 'Tính năng',
      contact: 'Liên hệ',
      specialThanks: 'Lời cảm ơn đặc biệt',
      thanksIntro: 'Đội ngũ Shapak Apps cảm ơn những người đã giúp đỡ dự án:',
      allContributors: 'Tất cả người đóng góp trên GitHub',
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
      authorsContent: 'Ykjam Terjime dikembangkan oleh tim pengembang Şapak dari kota Mary, Provinsi Mary, Turkmenistan.\n\nMisi kami adalah membantu masyarakat Turkmenistan — baik yang tinggal di dalam negeri maupun luar negeri — serta pengunjung, berkomunikasi dengan mudah dalam berbagai bahasa.\n\nAplikasi ini mendukung 5 bahasa dan mencakup:\n• Buku frasa skenario untuk situasi nyata, dengan balasan dan penggunaan luring\n• Penerjemah teks (segera hadir)\n• Asisten AI (segera hadir)\n• Penerjemah suara (segera hadir)\n• Penerjemah visual (segera hadir)\n\nUntuk umpan balik, kesalahan, atau saran:\nshapak.apps@gmail.com',
      seriesContent: 'Seri Aplikasi Şapak adalah rangkaian aplikasi komprehensif yang dirancang terutama untuk membantu rakyat Turkmenistan belajar bahasa asing.\n\nMeskipun aplikasi-aplikasi ini dibuat dengan mempertimbangkan pengguna Turkmen, mereka dapat dengan mudah digunakan oleh orang-orang di seluruh dunia.\n\nYkjam Terjime adalah aplikasi pertama dalam seri ini. Saat ini merupakan buku frasa skenario untuk situasi nyata, dengan balasan dan penggunaan luring; penerjemah teks, suara, dan visual serta fitur-fitur AI masih direncanakan (segera hadir).\n\nAplikasi lain dalam seri ini saat ini sedang dalam pengembangan aktif — nantikan pembaruan!',
      mission: 'Misi',
      features: 'Fitur',
      contact: 'Kontak',
      specialThanks: 'Terima Kasih Khusus',
      thanksIntro: 'Tim Shapak Apps berterima kasih kepada yang telah membantu proyek ini:',
      allContributors: 'Semua kontributor di GitHub',
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
      authorsContent: 'Ykjam Terjime dibangunkan oleh pasukan pembangunan Şapak dari bandar Mary, Wilayah Mary, Turkmenistan.\n\nMisi kami adalah membantu rakyat Turkmenistan — kedua-duanya yang tinggal di dalam dan luar negara — serta pelawat, berkomunikasi dengan mudah dalam pelbagai bahasa.\n\nAplikasi ini menyokong 5 bahasa dan termasuk:\n• Buku frasa senario untuk situasi sebenar, dengan balasan dan kegunaan luar talian\n• Penterjemah teks (akan datang)\n• Pembantu AI (akan datang)\n• Penterjemah suara (akan datang)\n• Penterjemah visual (akan datang)\n\nUntuk maklum balas, kesilapan, atau cadangan:\nshapak.apps@gmail.com',
      seriesContent: 'Siri Aplikasi Şapak adalah suite aplikasi komprehensif yang direka terutamanya untuk membantu rakyat Turkmenistan mempelajari bahasa asing.\n\nWalaupun aplikasi-aplikasi ini dicipta dengan pengguna Turkmen dalam fikiran, mereka boleh digunakan dengan mudah oleh orang di seluruh dunia.\n\nYkjam Terjime adalah aplikasi pertama dalam siri ini. Buat masa ini, ia ialah buku frasa senario untuk situasi sebenar, dengan balasan dan kegunaan luar talian; penterjemah teks, suara dan visual serta ciri-ciri AI masih dalam perancangan (akan datang).\n\nAplikasi lain dalam siri ini sedang dalam pembangunan aktif — nantikan kemas kini!',
      mission: 'Misi',
      features: 'Ciri-ciri',
      contact: 'Hubungi',
      specialThanks: 'Terima Kasih Khas',
      thanksIntro: 'Pasukan Shapak Apps berterima kasih kepada yang membantu projek ini:',
      allContributors: 'Semua penyumbang di GitHub',
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
      authorsContent: 'Ykjam Terjime को तुर्कमेनिस्तान के मैरी प्रांत, मैरी शहर की डेवलपमेंट टीम Şapak द्वारा विकसित किया गया है।\n\nहमारा मिशन तुर्कमेनिस्तान के लोगों — देश के भीतर और विदेश में रहने वाले दोनों — के साथ-साथ आगंतुकों को कई भाषाओं में आसानी से संवाद करने में मदद करना है।\n\nयह ऐप 5 भाषाओं का समर्थन करता है और इसमें शामिल हैं:\n• वास्तविक परिस्थितियों के लिए परिदृश्य वाक्यांश पुस्तक, उत्तर और ऑफ़लाइन उपयोग के साथ\n• टेक्स्ट अनुवादक (जल्द आ रहा है)\n• AI सहायक (जल्द आ रहा है)\n• वॉयस अनुवादक (जल्द आ रहा है)\n• विज़ुअल अनुवादक (जल्द आ रहा है)\n\nफीडबैक, त्रुटियों या सुझावों के लिए:\nshapak.apps@gmail.com',
      seriesContent: 'Şapak ऐप सीरीज़ एप्लिकेशन का एक व्यापक सूट है जो मुख्य रूप से तुर्कमेनिस्तान के लोगों को विदेशी भाषाएं सीखने में मदद करने के लिए डिज़ाइन किया गया है।\n\nहालांकि ये ऐप्स तुर्कमेन उपयोगकर्ताओं को ध्यान में रखकर बनाए गए हैं, इन्हें दुनिया भर के लोग आसानी से उपयोग कर सकते हैं।\n\nYkjam Terjime सीरीज़ का पहला ऐप है। यह वर्तमान में वास्तविक परिस्थितियों के लिए परिदृश्य वाक्यांश पुस्तक है, उत्तर और ऑफ़लाइन उपयोग के साथ; टेक्स्ट, वॉयस और विज़ुअल अनुवादक तथा AI-संचालित सुविधाएँ जल्द ही आ रही हैं।\n\nसीरीज़ के अन्य ऐप्स वर्तमान में सक्रिय विकास में हैं — अपडेट के लिए बने रहें!',
      mission: 'मिशन',
      features: 'सुविधाएं',
      contact: 'संपर्क',
      specialThanks: 'विशेष धन्यवाद',
      thanksIntro: 'Shapak Apps टीम परियोजना में मदद करने वालों का धन्यवाद करती है:',
      allContributors: 'GitHub पर सभी योगदानकर्ता',
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
      authorsContent: 'تم تطوير Ykjam Terjime بواسطة فريق التطوير Şapak من مدينة ماري، مقاطعة ماري، تركمانستان.\n\nمهمتنا هي مساعدة شعب تركمانستان — سواء المقيمين في البلاد أو في الخارج — بالإضافة إلى الزوار، على التواصل بسهولة بلغات متعددة.\n\nيدعم التطبيق 5 لغات ويتضمن:\n• كتاب عبارات سيناريو للمواقف الحقيقية، مع الردود والاستخدام دون اتصال بالإنترنت\n• مترجم نصوص (قريبًا)\n• مساعدو الذكاء الاصطناعي (قريبًا)\n• مترجم صوتي (قريبًا)\n• مترجم مرئي (قريبًا)\n\nللملاحظات أو الأخطاء أو الاقتراحات:\nshapak.apps@gmail.com',
      seriesContent: 'سلسلة تطبيقات Şapak هي مجموعة شاملة من التطبيقات المصممة بشكل أساسي لمساعدة شعب تركمانستان على تعلم اللغات الأجنبية.\n\nعلى الرغم من أن هذه التطبيقات تم إنشاؤها مع وضع المستخدمين التركمان في الاعتبار، إلا أنه يمكن للأشخاص في جميع أنحاء العالم استخدامها بسهولة.\n\nYkjam Terjime هو التطبيق الأول في السلسلة. وهو حاليًا كتاب عبارات سيناريو للمواقف الحقيقية، مع الردود والاستخدام دون اتصال بالإنترنت؛ أما المترجم النصي والصوتي والمرئي وميزات الذكاء الاصطناعي فهي مخططة (قريبًا).\n\nالتطبيقات الأخرى في السلسلة قيد التطوير النشط حاليًا — ترقبوا التحديثات!',
      mission: 'المهمة',
      features: 'الميزات',
      contact: 'اتصل بنا',
      specialThanks: 'شكر خاص',
      thanksIntro: 'يشكر فريق Shapak Apps كل من ساعد المشروع:',
      allContributors: 'جميع المساهمين على GitHub',
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
      authorsContent: 'Ykjam Terjime توسط تیم توسعه‌دهندگان Şapak از شهر ماری، استان ماری، ترکمنستان توسعه یافته است.\n\nمأموریت ما کمک به مردم ترکمنستان — چه ساکنان داخل کشور و چه خارج از کشور — و همچنین بازدیدکنندگان برای برقراری ارتباط آسان به زبان‌های متعدد است.\n\nاین برنامه از 5 زبان پشتیبانی می‌کند و شامل:\n• کتاب عبارات سناریویی برای موقعیت‌های واقعی، همراه با پاسخ‌ها و استفاده آفلاین\n• مترجم متن (به زودی)\n• دستیاران هوش مصنوعی (به زودی)\n• مترجم صوتی (به زودی)\n• مترجم بصری (به زودی)\n\nبرای بازخورد، خطاها یا پیشنهادات:\nshapak.apps@gmail.com',
      seriesContent: 'مجموعه برنامه‌های Şapak یک مجموعه جامع از برنامه‌ها است که عمدتاً برای کمک به مردم ترکمنستان در یادگیری زبان‌های خارجی طراحی شده است.\n\nاگرچه این برنامه‌ها با در نظر گرفتن کاربران ترکمن ساخته شده‌اند، اما مردم سراسر جهان می‌توانند به راحتی از آنها استفاده کنند.\n\nYkjam Terjime اولین برنامه در این مجموعه است. در حال حاضر این یک کتاب عبارات سناریویی برای موقعیت‌های واقعی، همراه با پاسخ‌ها و استفاده آفلاین است؛ مترجمان متن، صوتی و بصری و همچنین ویژگی‌های مبتنی بر هوش مصنوعی برنامه‌ریزی شده‌اند (به زودی).\n\nبرنامه‌های دیگر در این مجموعه در حال حاضر در حال توسعه فعال هستند — منتظر به‌روزرسانی‌ها باشید!',
      mission: 'مأموریت',
      features: 'ویژگی‌ها',
      contact: 'تماس',
      specialThanks: 'تشکر ویژه',
      thanksIntro: 'تیم Shapak Apps از کسانی که به پروژه کمک کردند سپاسگزار است:',
      allContributors: 'همه مشارکت‌کنندگان در GitHub',
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
      authorsContent: 'Ykjam Terjime کو ترکمانستان کے صوبہ ماری، شہر ماری کی ڈیولپمنٹ ٹیم Şapak نے تیار کیا ہے۔\n\nہمارا مشن ترکمانستان کے لوگوں — ملک کے اندر اور بیرون ملک دونوں — کے ساتھ ساتھ زائرین کو متعدد زبانوں میں آسانی سے بات چیت کرنے میں مدد کرنا ہے۔\n\nیہ ایپ 5 زبانوں کی حمایت کرتی ہے اور اس میں شامل ہیں:\n• حقیقی حالات کے لیے منظرنامے کی فقرات کی کتاب، جوابات اور آف لائن استعمال کے ساتھ\n• ٹیکسٹ مترجم (جلد آ رہا ہے)\n• AI معاونین (جلد آ رہا ہے)\n• صوتی مترجم (جلد آ رہا ہے)\n• بصری مترجم (جلد آ رہا ہے)\n\nرائے، غلطیوں یا تجاویز کے لیے:\nshapak.apps@gmail.com',
      seriesContent: 'Şapak ایپ سیریز ایپلیکیشنز کا ایک جامع سوٹ ہے جو بنیادی طور پر ترکمانستان کے لوگوں کو غیر ملکی زبانیں سیکھنے میں مدد کے لیے ڈیزائن کیا گیا ہے۔\n\nاگرچہ یہ ایپس ترکمان صارفین کو ذہن میں رکھ کر بنائی گئی ہیں، لیکن دنیا بھر کے لوگ انہیں آسانی سے استعمال کر سکتے ہیں۔\n\nYkjam Terjime اس سیریز کی پہلی ایپ ہے۔ فی الحال یہ حقیقی حالات کے لیے منظرنامے کی فقرات کی کتاب ہے، جوابات اور آف لائن استعمال کے ساتھ؛ متن، صوتی اور بصری مترجمین کے ساتھ ساتھ AI پر مبنی خصوصیات کی منصوبہ بندی کی گئی ہے (جلد آ رہا ہے)۔\n\nسیریز کی دیگر ایپس فی الوقت فعال ترقی میں ہیں — اپڈیٹس کے لیے دیکھتے رہیں!',
      mission: 'مشن',
      features: 'خصوصیات',
      contact: 'رابطہ',
      specialThanks: 'خصوصی شکریہ',
      thanksIntro: 'Shapak Apps ٹیم پروجیکٹ میں مدد کرنے والوں کا شکریہ ادا کرتی ہے:',
      allContributors: 'GitHub پر تمام معاونین',
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
      authorsContent: 'Ykjam Terjime د ترکمنستان د ماري ولایت، ماري ښار څخه د پراختیا ټیم Şapak لخوا جوړ شوی دی.\n\nزموږ ماموریت د ترکمنستان خلکو — دواړه هغه چې په هیواد او بهر کې ژوند کوي — او همدارنګه میلمنو سره مرسته کول دي چې په څو ژبو کې په اسانۍ سره خبرې وکړي.\n\nدا اپلیکیشن 5 ژبې ملاتړ کوي او شامل دي:\n• د ریښتیني حالاتو لپاره د سناریو جملو کتاب، د ځوابونو او آفلاین کارولو سره\n• د متن ژباړونکی (ډیر ژر)\n• د AI مرستندویان (ډیر ژر)\n• غږیز ژباړونکی (ډیر ژر)\n• لیدونکی ژباړونکی (ډیر ژر)\n\nد فیډبیک، غلطیو، یا وړاندیزونو لپاره:\nshapak.apps@gmail.com',
      seriesContent: 'د Şapak اپلیکیشن لړۍ د اپلیکیشنونو یوه جامعه مجموعه ده چې په عمده توګه د ترکمنستان خلکو سره مرسته کوي چې بهرنۍ ژبې زده کړي.\n\nکه څه هم دا اپلیکیشنونه د ترکمن کاروونکو په ذهن کې جوړ شوي، خو د نړۍ خلک یې په اسانۍ سره کارولی شي.\n\nYkjam Terjime په لړۍ کې لومړی اپلیکیشن دی. دا اوس مهال د ریښتیني حالاتو لپاره د سناریو جملو کتاب دی، د ځوابونو او آفلاین کارولو سره؛ د متن، غږ او لید ژباړونکي او همدارنګه د AI ځانګړتیاوې پلان شوي (ډیر ژر).\n\nپه لړۍ کې نور اپلیکیشنونه اوس مهال په فعاله پرمختګ کې دي — د تازه معلوماتو لپاره تماشه کوئ!',
      mission: 'ماموریت',
      features: 'ځانګړتیاوې',
      contact: 'اړیکه',
      specialThanks: 'ځانګړی مننه',
      thanksIntro: 'د Shapak Apps ټیم د پروژې مرستندویانو څخه مننه کوي:',
      allContributors: 'په GitHub کې ټول ونډه اخیستونکي',
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
      authorsContent: 'Ykjam Terjime, Türkmenistan\'ın Mary Vilayeti, Mary şehrinden geliştirici ekibi Şapak tarafından geliştirilmiştir.\n\nMisyonumuz, Türkmenistan halkının — hem ülkede hem de yurt dışında yaşayanların — ve ziyaretçilerin birden fazla dilde kolayca iletişim kurmasına yardımcı olmaktır.\n\nUygulama 5 dili destekler ve şunları içerir:\n• Gerçek durumlar için senaryolu konuşma kılavuzu, yanıtlar ve çevrimdışı kullanım\n• Metin çevirmeni (yakında)\n• Yapay zeka asistanları (yakında)\n• Sesli çevirmen (yakında)\n• Görsel çevirmen (yakında)\n\nGeri bildirim, hatalar veya öneriler için:\nshapak.apps@gmail.com',
      seriesContent: 'Şapak Uygulama Serisi, öncelikle Türkmenistan halkının yabancı dil öğrenmesine yardımcı olmak için tasarlanmış kapsamlı bir uygulama paketidir.\n\nBu uygulamalar Türkmen kullanıcılar göz önünde bulundurularak oluşturulmuş olsa da, dünyanın her yerinden insanlar tarafından kolayca kullanılabilir.\n\nYkjam Terjime serideki ilk uygulamadır. Şu anda gerçek durumlar için senaryolu bir konuşma kılavuzudur (yanıtlar ve çevrimdışı kullanım ile); metin, ses ve görsel çevirmenlerin yanı sıra yapay zeka destekli özellikler planlanmaktadır (yakında).\n\nSerideki diğer uygulamalar şu anda aktif geliştirme aşamasındadır — güncellemeler için takipte kalın!',
      mission: 'Misyon',
      features: 'Özellikler',
      contact: 'İletişim',
      specialThanks: 'Özel Teşekkürler',
      thanksIntro: 'Shapak Apps ekibi projeye yardım edenlere teşekkür eder:',
      allContributors: 'GitHub\'daki tüm katkıda bulunanlar',
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
      authorsContent: 'Ykjam Terjime Türkmənistanın Mary Vilayəti, Mary şəhərindən inkişaf komandası Şapak tərəfindən hazırlanmışdır.\n\nMissiyamız Türkmənistan xalqına — həm ölkədə, həm də xaricdə yaşayanlara — və ziyarətçilərə bir neçə dildə asanlıqla ünsiyyət qurmaqda kömək etməkdir.\n\nTətbiq 5 dili dəstəkləyir və bunları əhatə edir:\n• Real hallar üçün ssenarili ifadə kitabı, cavablar və oflayn istifadə\n• Mətn tərcüməçisi (tezliklə)\n• Süni intellekt köməkçiləri (tezliklə)\n• Səsli tərcüməçi (tezliklə)\n• Vizual tərcüməçi (tezliklə)\n\nRəy, xətalar və ya təkliflər üçün:\nshapak.apps@gmail.com',
      seriesContent: 'Şapak Tətbiq Seriyası ilk növbədə Türkmənistan xalqının xarici dillər öyrənməsinə kömək etmək üçün hazırlanmış hərtərəfli tətbiqlər toplusudur.\n\nBu tətbiqlər türkmən istifadəçiləri nəzərdə tutularaq yaradılsa da, dünyanın hər yerindən insanlar asanlıqla istifadə edə bilər.\n\nYkjam Terjime seriyadakı ilk tətbiqdir. Hazırda bu, real hallar üçün ssenarili ifadə kitabıdır (cavablar və oflayn istifadə ilə); mətn, səs və vizual tərcüməçilər, həmçinin süni intellekt əsaslı xüsusiyyətlər planlaşdırılır (tezliklə).\n\nSeriyadakı digər tətbiqlər hazırda aktiv inkişaf mərhələsindədir — yeniləmələri izləyin!',
      mission: 'Missiya',
      features: 'Xüsusiyyətlər',
      contact: 'Əlaqə',
      specialThanks: 'Xüsusi Təşəkkür',
      thanksIntro: 'Shapak Apps komandası layihəyə kömək edənlərə təşəkkür edir:',
      allContributors: 'GitHub-dakı bütün töhfə verənlər',
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
      authorsContent: 'Ykjam Terjime Turkmanistonning Mari viloyati, Mari shahridan dasturchilar jamoasi Şapak tomonidan ishlab chiqilgan.\n\nBizning missiyamiz - Turkmaniston xalqiga — mamlakat ichida va tashqarisida yashovchilarga — hamda mehmonlarga bir nechta tillarda oson muloqot qilishda yordam berishdir.\n\nIlova 5 tilni qo\'llab-quvvatlaydi va quyidagilarni o\'z ichiga oladi:\n• Real vaziyatlar uchun ssenariyli iboralar kitobi, javoblar va oflayn foydalanish\n• Matn tarjimoni (tez orada)\n• AI yordamchilari (tez orada)\n• Ovozli tarjimon (tez orada)\n• Vizual tarjimon (tez orada)\n\nFikr-mulohazalar, xatolar yoki takliflar uchun:\nshapak.apps@gmail.com',
      seriesContent: 'Şapak Ilova Seriyasi - bu birinchi navbatda Turkmaniston xalqiga chet tillarini o\'rganishda yordam berish uchun mo\'ljallangan keng qamrovli ilovalar to\'plami.\n\nBu ilovalar turkman foydalanuvchilari uchun yaratilgan bo\'lsa-da, dunyo bo\'ylab odamlar tomonidan osongina foydalanilishi mumkin.\n\nYkjam Terjime seriyadagi birinchi ilova hisoblanadi. Hozirda bu real vaziyatlar uchun ssenariyli iboralar kitobi (javoblar va oflayn foydalanish bilan); matn, ovoz va vizual tarjimonlar, shuningdek AI asosidagi xususiyatlar rejalashtirilgan (tez orada).\n\nSeriyadagi boshqa ilovalar hozirda faol ishlab chiqilmoqda — yangilanishlarni kuzatib boring!',
      mission: 'Missiya',
      features: 'Xususiyatlar',
      contact: 'Aloqa',
      specialThanks: 'Maxsus minnatdorchilik',
      thanksIntro: 'Shapak Apps jamoasi loyihaga yordam berganlarga minnatdorchilik bildiradi:',
      allContributors: 'GitHub\'dagi barcha hissa qo\'shganlar',
      soon: 'Tez kunda',
      aboutSeries: 'Seriya haqida',
      forEveryone: 'Hamma uchun',
      whatsNext: 'Keyingisi nima',
    },
    kk: {
      title: 'Қолданба туралы',
      authors: 'Әзірлеушілер туралы',
      authorsDesc: 'Бұл қолданбаны кім жасады',
      series: 'Şapak қолданба сериясы',
      seriesDesc: 'Басқа қолданбалар',
      version: 'Нұсқа',
      authorsContent: 'Ykjam Terjime Түрікменстанның Мары облысы, Мары қаласынан әзірлеушілер тобы Şapak әзірледі.\n\nБіздің миссиямыз - Түрікменстан халқына — елде де, шетелде де тұратындарға — және қонақтарға бірнеше тілде оңай қарым-қатынас жасауға көмектесу.\n\nҚолданба 5 тілді қолдайды және мыналарды қамтиды:\n• Шынайы жағдайларға арналған сценарийлік сөйлемдер кітабы, жауаптар және офлайн пайдалану\n• Мәтіндік аудармашы (жақын арада)\n• AI көмекшілер (жақын арада)\n• Дауыстық аудармашы (жақын арада)\n• Визуалды аудармашы (жақын арада)\n\nПікірлер, қателер немесе ұсыныстар үшін:\nshapak.apps@gmail.com',
      seriesContent: 'Şapak қолданба сериясы - бұл ең алдымен Түрікменстан халқына шет тілдерін үйренуге көмектесу үшін жасалған кешенді қолданбалар жиынтығы.\n\nБұл қолданбалар түрікмен пайдаланушыларын ескере отырып жасалғанымен, бүкіл әлемдегі адамдар оңай пайдалана алады.\n\nYkjam Terjime — сериядағы бірінші қолданба. Қазіргі уақытта бұл шынайы жағдайларға арналған сценарийлік сөйлемдер кітабы (жауаптар және офлайн пайдаланумен); мәтін, дауыс және визуалды аудармашылар, сондай-ақ AI негізіндегі мүмкіндіктер жоспарланған (жақын арада).\n\nСериядағы басқа қолданбалар қазіргі уақытта белсенді әзірлеу кезеңінде — жаңартуларды қадағалап отырыңыз!',
      mission: 'Миссия',
      features: 'Мүмкіндіктер',
      contact: 'Байланыс',
      specialThanks: 'Ерекше алғыс',
      thanksIntro: 'Shapak Apps командасы жобаға көмектескендерге алғыс білдіреді:',
      allContributors: 'GitHub-тағы барлық үлес қосушылар',
      soon: 'Жақында',
      aboutSeries: 'Серия туралы',
      forEveryone: 'Барлығына арналған',
      whatsNext: 'Келесі не',
    },
    ky: {
      title: 'Колдонмо жөнүндө',
      authors: 'Иштеп чыгуучулар жөнүндө',
      authorsDesc: 'Бул колдонмону ким жасады',
      series: 'Şapak колдонмо сериясы',
      seriesDesc: 'Башка колдонмолор',
      version: 'Версия',
      authorsContent: 'Ykjam Terjime Түркмөнстандын Мары областы, Мары шаарынан иштеп чыгуучулар тобу Şapak тарабынан иштелип чыккан.\n\nБиздин миссиябыз - Түркмөнстан элине — өлкөдө жана чет өлкөдө жашагандарга — ошондой эле конокторго бир нече тилде оңой баарлашууга жардам берүү.\n\nКолдонмо 5 тилди колдойт жана төмөнкүлөрдү камтыйт:\n• Чыныгы кырдаалдар үчүн сценарийлик сүйлөмдөр китеби, жооптор жана оффлайн колдонуу\n• Текст котормочусу (жакында)\n• AI жардамчылар (жакында)\n• Үн котормочусу (жакында)\n• Визуалдык котормочу (жакында)\n\nПикир-сын, каталар же сунуштар үчүн:\nshapak.apps@gmail.com',
      seriesContent: 'Şapak колдонмо сериясы - бул биринчи кезекте Түркмөнстан элине чет тилдерин үйрөнүүгө жардам берүү үчүн иштелип чыккан комплекстүү колдонмолор жыйнагы.\n\nБул колдонмолор түркмөн колдонуучулар эске алынып түзүлгөн болсо да, дүйнө жүзүндөгү адамдар оңой эле колдоно алышат.\n\nYkjam Terjime — сериядагы биринчи колдонмо. Учурда бул чыныгы кырдаалдар үчүн сценарийлик сүйлөмдөр китеби (жооптор жана оффлайн колдонуу менен); текст, үн жана визуалдык котормочулар, ошондой эле AI негизиндеги мүмкүнчүлүктөр пландаштырылган (жакында).\n\nСериядагы башка колдонмолор учурда активдүү иштелип чыгууда — жаңыртууларды байкап туруңуз!',
      mission: 'Миссия',
      features: 'Мүмкүнчүлүктөр',
      contact: 'Байланыш',
      specialThanks: 'Өзгөчө ыраазычылык',
      thanksIntro: 'Shapak Apps командасы долбоорго жардам бергендерге ыраазычылык билдирет:',
      allContributors: 'GitHub\'дагы бардык салым кошуучулар',
      soon: 'Жакында',
      aboutSeries: 'Сериал жөнүндө',
      forEveryone: 'Баары үчүн',
      whatsNext: 'Кийинки эмне',
    },
    tg: {
      title: 'Дар бораи барнома',
      authors: 'Дар бораи таҳиягарон',
      authorsDesc: 'Ин барномаро кӣ сохт',
      series: 'Силсилаи барномаҳои Şapak',
      seriesDesc: 'Барномаҳои дигар',
      version: 'Версия',
      authorsContent: 'Ykjam Terjime аз ҷониби дастаи таҳиягарони Şapak аз шаҳри Мари, вилояти Мари, Туркманистон таҳия шудааст.\n\nМаҳорати мо кӯмак ба мардуми Туркманистон — ҳам дар дохили кишвар ва ҳам дар хориҷ зиндагикунандагон — ва меҳмонон барои муошират бо забонҳои зиёд ба осонӣ аст.\n\nБарнома 5 забонро дастгирӣ мекунад ва инҳоро дар бар мегирад:\n• Китоби ибораҳои сценариявӣ барои вазъиятҳои воқеӣ, бо ҷавобҳо ва истифодаи офлайн\n• Тарҷумони матн (ба наздикӣ)\n• Дастёрони AI (ба наздикӣ)\n• Тарҷумони овозӣ (ба наздикӣ)\n• Тарҷумони визуалӣ (ба наздикӣ)\n\nБарои фикру мулоҳизаҳо, хатоҳо ё пешниҳодҳо:\nshapak.apps@gmail.com',
      seriesContent: 'Силсилаи барномаҳои Şapak маҷмӯаи ҳаматарафаи барномаҳоест, ки пеш аз ҳама барои кӯмак ба мардуми Туркманистон дар омӯзиши забонҳои хориҷӣ таҳия шудааст.\n\nГарчанде ки ин барномаҳо бо дар назардошти корбарони туркман таҳия шудаанд, мардуми саросари ҷаҳон метавонанд онҳоро ба осонӣ истифода баранд.\n\nYkjam Terjime аввалин барнома дар силсила аст. Дар айни замон он як китоби ибораҳои сценариявӣ барои вазъиятҳои воқеӣ мебошад (бо ҷавобҳо ва истифодаи офлайн); тарҷумонҳои матн, овоз ва визуалӣ, инчунин хусусиятҳои асосёфтаи AI ба нақша гирифта шудаанд (ба наздикӣ).\n\nБарномаҳои дигар дар силсила айни ҳол дар марҳилаи таҳияи фаъол қарор доранд — мунтазири навсозиҳо бошед!',
      mission: 'Миссия',
      features: 'Хусусиятҳо',
      contact: 'Тамос',
      specialThanks: 'Ташаккури махсус',
      thanksIntro: 'Дастаи Shapak Apps ба онҳое, ки ба лоиҳа кӯмак карданд, миннатдорӣ мекунад:',
      allContributors: 'Ҳамаи саҳмгузорон дар GitHub',
      soon: 'Ба зудӣ',
      aboutSeries: 'Дар бораи силсила',
      forEveryone: 'Барои ҳама',
      whatsNext: 'Баъдӣ чӣ',
    },
    hy: {
      title: 'Հավելվածի մասին',
      authors: 'Մշակողների մասին',
      authorsDesc: 'Ով է ստեղծել այս հավելվածը',
      series: 'Şapak հավելվածների շարք',
      seriesDesc: 'Այլ հավելվածներ',
      version: 'Տարբերակ',
      authorsContent: 'Ykjam Terjime մշակվել է Թուրքմենստանի Մարի նահանգի Մարի քաղաքից մշակողների թիմ Şapak-ի կողմից։\n\nՄեր առաքելությունն է օգնել Թուրքմենստանի ժողովրդին — և՛ երկրում, և՛ արտերկրում բնակվողներին — ինչպես նաև այցելուներին հեշտությամբ շփվել մի քանի լեզուներով։\n\nՀավելվածը աջակցում է 5 լեզու և ներառում է՝\n• Սցենարային արտահայտությունների գիրք իրական իրավիճակների համար, պատասխաններով և օֆլայն օգտագործմամբ\n• Տեքստային թարգմանիչ (շուտով)\n• AI օգնականներ (շուտով)\n• Ձայնային թարգմանիչ (շուտով)\n• Տեսողական թարգմանիչ (շուտով)\n\nԿարծիքների, սխալների կամ առաջարկների համար՝\nshapak.apps@gmail.com',
      seriesContent: 'Şapak հավելվածների շարքը հավելվածների համապարփակ փաթեթ է, որը նախատեսված է հիմնականում Թուրքմենստանի ժողովրդին օտար լեզուներ սովորելու օգնելու համար։\n\nԹեև այս հավելվածները ստեղծվել են թուրքմեն օգտատերերին նկատի ունենալով, դրանք կարող են հեշտությամբ օգտագործվել ամբողջ աշխարհի մարդկանց կողմից։\n\nYkjam Terjime-ն շարքի առաջին հավելվածն է: Ներկայումս այն սցենարային արտահայտությունների գիրք է իրական իրավիճակների համար՝ պատասխաններով և օֆլայն օգտագործմամբ. տեքստային, ձայնային և տեսողական թարգմանիչները, ինչպես նաև AI-ի վրա հիմնված գործառույթները պլանավորված են (շուտով):\n\nՇարքի այլ հավելվածները ներկայումս ակտիվ մշակման փուլում են — սպասեք թարմացումներին!',
      mission: 'Առաքելություն',
      features: 'Հնարավորություններ',
      contact: 'Կապ',
      specialThanks: 'Հատուկ շնորհակալություն',
      thanksIntro: 'Shapak Apps թիմը շնորհակալություն է հայտնում նախագծին օգնածներին՝',
      allContributors: 'Բոլոր ներդրողները GitHub-ում',
      soon: 'Շուտով',
      aboutSeries: 'Շարքի մասին',
      forEveryone: 'Բոլորի համար',
      whatsNext: 'Ինչ է հաջորդը',
    },
    ka: {
      title: 'აპლიკაციის შესახებ',
      authors: 'დეველოპერების შესახებ',
      authorsDesc: 'ვინ შექმნა ეს აპლიკაცია',
      series: 'Şapak აპლიკაციების სერია',
      seriesDesc: 'სხვა აპლიკაციები',
      version: 'ვერსია',
      authorsContent: 'Ykjam Terjime შეიქმნა თურქმენეთის მარის პროვინცია, მარის ქალაქიდან დეველოპერთა გუნდი Şapak-ის მიერ.\n\nჩვენი მისიაა დავეხმაროთ თურქმენეთის ხალხს — როგორც ქვეყანაში, ასევე საზღვარგარეთ მცხოვრებლებს — და ასევე ვიზიტორებს მარტივად ურთიერთობაში რამდენიმე ენაზე.\n\nაპლიკაცია მხარს უჭერს 5 ენას და მოიცავს:\n• სცენარული ფრაზების წიგნი რეალური სიტუაციებისთვის, პასუხებითა და ოფლაინ გამოყენებით\n• ტექსტის მთარგმნელი (მალე)\n• AI ასისტენტები (მალე)\n• ხმოვანი მთარგმნელი (მალე)\n• ვიზუალური მთარგმნელი (მალე)\n\nგამოხმაურებისთვის, შეცდომებისთვის ან წინადადებებისთვის:\nshapak.apps@gmail.com',
      seriesContent: 'Şapak აპლიკაციების სერია არის აპლიკაციების ყოვლისმომცველი პაკეტი, რომელიც პირველ რიგში შექმნილია თურქმენეთის ხალხის დასახმარებლად უცხო ენების შესწავლაში.\n\nმიუხედავად იმისა, რომ ეს აპლიკაციები შექმნილია თურქმენი მომხმარებლების გათვალისწინებით, მთელი მსოფლიოს ხალხს შეუძლია მათი ადვილად გამოყენება.\n\nYkjam Terjime სერიის პირველი აპლიკაციაა. ამჟამად ის არის სცენარული ფრაზების წიგნი რეალური სიტუაციებისთვის, პასუხებითა და ოფლაინ გამოყენებით; ტექსტის, ხმის და ვიზუალური მთარგმნელები, ასევე AI-ზე დაფუძნებული ფუნქციები დაგეგმილია (მალე).\n\nსერიის სხვა აპლიკაციები ამჟამად აქტიურ განვითარებაშია — მიჰყევით განახლებებს!',
      mission: 'მისია',
      features: 'ფუნქციები',
      contact: 'კონტაქტი',
      specialThanks: 'განსაკუთრებული მადლობა',
      thanksIntro: 'Shapak Apps-ის გუნდი მადლობას უხდის პროექტის დამხმარეებს:',
      allContributors: 'ყველა კონტრიბუტორი GitHub-ზე',
      soon: 'მალე',
      aboutSeries: 'სერიის შესახებ',
      forEveryone: 'ყველასთვის',
      whatsNext: 'რა არის შემდეგ',
    },
    de: {
      title: 'Über die App',
      authors: 'Über die Entwickler',
      authorsDesc: 'Wer hat diese App erstellt',
      series: 'Şapak App-Serie',
      seriesDesc: 'Andere Apps',
      version: 'Version',
      authorsContent: 'Ykjam Terjime wurde vom Entwicklerteam Şapak aus Mary, Provinz Mary, Turkmenistan entwickelt.\n\nUnsere Mission ist es, den Menschen in Turkmenistan — sowohl denen, die im Land als auch im Ausland leben — sowie Besuchern zu helfen, einfach in mehreren Sprachen zu kommunizieren.\n\nDie App unterstützt 5 Sprachen und enthält:\n• Szenario-Phrasenbuch für reale Situationen, mit Antworten und Offline-Nutzung\n• Textübersetzer (demnächst)\n• KI-Assistenten (demnächst)\n• Sprachübersetzer (demnächst)\n• Visueller Übersetzer (demnächst)\n\nFür Feedback, Fehler oder Vorschläge:\nshapak.apps@gmail.com',
      seriesContent: 'Die Şapak App-Serie ist eine umfassende Suite von Anwendungen, die hauptsächlich dazu dienen, den Menschen in Turkmenistan beim Erlernen von Fremdsprachen zu helfen.\n\nObwohl diese Apps mit turkmenischen Nutzern im Hinterkopf erstellt wurden, können sie von Menschen auf der ganzen Welt problemlos genutzt werden.\n\nYkjam Terjime ist die erste App der Serie. Sie ist derzeit ein Szenario-Phrasenbuch für reale Situationen, mit Antworten und Offline-Nutzung; die Text-, Sprach- und visuellen Übersetzer sowie KI-gestützte Funktionen sind geplant (demnächst).\n\nAndere Apps der Serie befinden sich derzeit in aktiver Entwicklung — bleiben Sie dran für Updates!',
      mission: 'Mission',
      features: 'Funktionen',
      contact: 'Kontakt',
      specialThanks: 'Besonderer Dank',
      thanksIntro: 'Das Shapak-Apps-Team dankt allen, die dem Projekt geholfen haben:',
      allContributors: 'Alle Mitwirkenden auf GitHub',
      soon: 'Bald',
      aboutSeries: 'Über die Serie',
      forEveryone: 'Für alle',
      whatsNext: 'Was kommt als Nächstes',
    },
    fr: {
      title: 'À propos',
      authors: 'À propos des développeurs',
      authorsDesc: 'Qui a créé cette application',
      series: 'Série d\'applications Şapak',
      seriesDesc: 'Autres applications',
      version: 'Version',
      authorsContent: 'Ykjam Terjime a été développé par l\'équipe de développement Şapak de Mary, province de Mary, Turkménistan.\n\nNotre mission est d\'aider les habitants du Turkménistan — aussi bien ceux vivant dans le pays qu\'à l\'étranger — ainsi que les visiteurs à communiquer facilement dans plusieurs langues.\n\nL\'application prend en charge 5 langues et comprend :\n• Guide de conversation par scénarios pour situations réelles, avec réponses et utilisation hors ligne\n• Traducteur de texte (bientôt)\n• Assistants IA (bientôt)\n• Traducteur vocal (bientôt)\n• Traducteur visuel (bientôt)\n\nPour les commentaires, erreurs ou suggestions :\nshapak.apps@gmail.com',
      seriesContent: 'La série d\'applications Şapak est une suite complète d\'applications conçues principalement pour aider les habitants du Turkménistan à apprendre des langues étrangères.\n\nBien que ces applications soient créées en pensant aux utilisateurs turkmènes, elles peuvent être facilement utilisées par des personnes du monde entier.\n\nYkjam Terjime est la première application de la série. Il s\'agit actuellement d\'un guide de conversation par scénarios pour des situations réelles, avec réponses et utilisation hors ligne ; les traducteurs de texte, vocaux et visuels ainsi que les fonctionnalités basées sur l\'IA sont prévus (bientôt).\n\nD\'autres applications de la série sont actuellement en développement actif — restez à l\'écoute pour les mises à jour!',
      mission: 'Mission',
      features: 'Fonctionnalités',
      contact: 'Contact',
      specialThanks: 'Remerciements spéciaux',
      thanksIntro: 'L\'équipe Shapak Apps remercie ceux qui ont aidé le projet :',
      allContributors: 'Tous les contributeurs sur GitHub',
      soon: 'Bientôt',
      aboutSeries: 'À propos de la série',
      forEveryone: 'Pour tous',
      whatsNext: 'Et ensuite',
    },
    es: {
      title: 'Acerca de',
      authors: 'Acerca de los desarrolladores',
      authorsDesc: 'Quién creó esta aplicación',
      series: 'Serie de apps Şapak',
      seriesDesc: 'Otras aplicaciones',
      version: 'Versión',
      authorsContent: 'Ykjam Terjime fue desarrollado por el equipo de desarrollo Şapak de Mary, Provincia de Mary, Turkmenistán.\n\nNuestra misión es ayudar a la gente de Turkmenistán — tanto los que viven en el país como en el extranjero — así como a los visitantes, a comunicarse fácilmente en múltiples idiomas.\n\nLa aplicación admite 5 idiomas e incluye:\n• Libro de frases con escenarios para situaciones reales, respuestas y uso sin conexión\n• Traductor de texto (próximamente)\n• Asistentes de IA (próximamente)\n• Traductor de voz (próximamente)\n• Traductor visual (próximamente)\n\nPara comentarios, errores o sugerencias:\nshapak.apps@gmail.com',
      seriesContent: 'La serie de aplicaciones Şapak es un conjunto integral de aplicaciones diseñadas principalmente para ayudar a la gente de Turkmenistán a aprender idiomas extranjeros.\n\nAunque estas aplicaciones están creadas pensando en los usuarios turcomanos, pueden ser fácilmente utilizadas por personas de todo el mundo.\n\nYkjam Terjime es la primera aplicación de la serie. Actualmente es un libro de frases con escenarios para situaciones reales, con respuestas y uso sin conexión; los traductores de texto, voz y visuales, así como las funciones impulsadas por IA, están planeados (próximamente).\n\nOtras aplicaciones de la serie están actualmente en desarrollo activo — ¡estén atentos a las actualizaciones!',
      mission: 'Misión',
      features: 'Funciones',
      contact: 'Contacto',
      specialThanks: 'Agradecimiento especial',
      thanksIntro: 'El equipo de Shapak Apps agradece a quienes ayudaron al proyecto:',
      allContributors: 'Todos los colaboradores en GitHub',
      soon: 'Próximamente',
      aboutSeries: 'Acerca de la serie',
      forEveryone: 'Para todos',
      whatsNext: 'Qué sigue',
    },
    it: {
      title: 'Informazioni',
      authors: 'Informazioni sugli sviluppatori',
      authorsDesc: 'Chi ha creato questa app',
      series: 'Serie di app Şapak',
      seriesDesc: 'Altre applicazioni',
      version: 'Versione',
      authorsContent: 'Ykjam Terjime è stato sviluppato dal team di sviluppo Şapak da Mary, Provincia di Mary, Turkmenistan.\n\nLa nostra missione è aiutare le persone del Turkmenistan — sia quelle che vivono nel paese che all\'estero — così come i visitatori, a comunicare facilmente in più lingue.\n\nL\'app supporta 5 lingue e include:\n• Frasario a scenari per situazioni reali, con risposte e uso offline\n• Traduttore di testo (in arrivo)\n• Assistenti AI (in arrivo)\n• Traduttore vocale (in arrivo)\n• Traduttore visivo (in arrivo)\n\nPer feedback, errori o suggerimenti:\nshapak.apps@gmail.com',
      seriesContent: 'La serie di app Şapak è una suite completa di applicazioni progettate principalmente per aiutare il popolo del Turkmenistan ad imparare le lingue straniere.\n\nSebbene queste app siano create pensando agli utenti turkmeni, possono essere facilmente utilizzate da persone di tutto il mondo.\n\nYkjam Terjime è la prima app della serie. Attualmente è un frasario a scenari per situazioni reali, con risposte e uso offline; i traduttori di testo, voce e visivo, nonché le funzionalità basate sull\'IA sono pianificati (in arrivo).\n\nAltre app della serie sono attualmente in sviluppo attivo — restate sintonizzati per gli aggiornamenti!',
      mission: 'Missione',
      features: 'Funzionalità',
      contact: 'Contatto',
      specialThanks: 'Ringraziamenti speciali',
      thanksIntro: 'Il team di Shapak Apps ringrazia chi ha aiutato il progetto:',
      allContributors: 'Tutti i collaboratori su GitHub',
      soon: 'In arrivo',
      aboutSeries: 'Sulla serie',
      forEveryone: 'Per tutti',
      whatsNext: 'Cosa c\'è dopo',
    },
    pt: {
      title: 'Sobre',
      authors: 'Sobre os desenvolvedores',
      authorsDesc: 'Quem criou este aplicativo',
      series: 'Série de apps Şapak',
      seriesDesc: 'Outros aplicativos',
      version: 'Versão',
      authorsContent: 'Ykjam Terjime foi desenvolvido pela equipe de desenvolvimento Şapak de Mary, Província de Mary, Turcomenistão.\n\nNossa missão é ajudar o povo do Turcomenistão — tanto aqueles que vivem no país quanto no exterior — bem como visitantes, a se comunicarem facilmente em vários idiomas.\n\nO aplicativo suporta 5 idiomas e inclui:\n• Livro de frases cenarizado para situações reais, com respostas e uso offline\n• Tradutor de texto (em breve)\n• Assistentes de IA (em breve)\n• Tradutor de voz (em breve)\n• Tradutor visual (em breve)\n\nPara feedback, erros ou sugestões:\nshapak.apps@gmail.com',
      seriesContent: 'A série de aplicativos Şapak é um conjunto abrangente de aplicativos projetados principalmente para ajudar o povo do Turcomenistão a aprender idiomas estrangeiros.\n\nEmbora estes aplicativos sejam criados pensando nos usuários turcomenos, eles podem ser facilmente usados por pessoas de todo o mundo.\n\nYkjam Terjime é o primeiro aplicativo da série. Atualmente é um livro de frases cenarizado para situações reais, com respostas e uso offline; os tradutores de texto, voz e visual, bem como os recursos baseados em IA estão planejados (em breve).\n\nOutros aplicativos da série estão atualmente em desenvolvimento ativo — fique atento às atualizações!',
      mission: 'Missão',
      features: 'Recursos',
      contact: 'Contato',
      specialThanks: 'Agradecimentos especiais',
      thanksIntro: 'A equipe Shapak Apps agradece a quem ajudou o projeto:',
      allContributors: 'Todos os colaboradores no GitHub',
      soon: 'Em breve',
      aboutSeries: 'Sobre a série',
      forEveryone: 'Para todos',
      whatsNext: 'O que vem a seguir',
    },
    pl: {
      title: 'O aplikacji',
      authors: 'O twórcach',
      authorsDesc: 'Kto stworzył tę aplikację',
      series: 'Seria aplikacji Şapak',
      seriesDesc: 'Inne aplikacje',
      version: 'Wersja',
      authorsContent: 'Ykjam Terjime zostało opracowane przez zespół deweloperski Şapak z Mary, Prowincja Mary, Turkmenistan.\n\nNaszą misją jest pomoc ludziom z Turkmenistanu — zarówno mieszkającym w kraju, jak i za granicą — oraz odwiedzającym w łatwej komunikacji w wielu językach.\n\nAplikacja obsługuje 5 języków i zawiera:\n• Scenariuszowe rozmówki do realnych sytuacji, z odpowiedziami i trybem offline\n• Tłumacz tekstu (wkrótce)\n• Asystenci AI (wkrótce)\n• Tłumacz głosowy (wkrótce)\n• Tłumacz wizualny (wkrótce)\n\nW przypadku opinii, błędów lub sugestii:\nshapak.apps@gmail.com',
      seriesContent: 'Seria aplikacji Şapak to kompleksowy zestaw aplikacji zaprojektowanych przede wszystkim, aby pomóc mieszkańcom Turkmenistanu w nauce języków obcych.\n\nChociaż te aplikacje zostały stworzone z myślą o turkmeńskich użytkownikach, mogą być łatwo używane przez ludzi z całego świata.\n\nYkjam Terjime to pierwsza aplikacja w serii. Obecnie są to scenariuszowe rozmówki do realnych sytuacji, z odpowiedziami i trybem offline; tłumacz tekstu, mowy i wizualny, a także zaawansowane funkcje oparte na AI są w planach (wkrótce).\n\nInne aplikacje z serii są obecnie w trakcie aktywnego rozwoju — bądźcie na bieżąco z aktualizacjami!',
      mission: 'Misja',
      features: 'Funkcje',
      contact: 'Kontakt',
      specialThanks: 'Specjalne podziękowania',
      thanksIntro: 'Zespół Shapak Apps dziękuje osobom, które pomogły projektowi:',
      allContributors: 'Wszyscy współtwórcy na GitHubie',
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
      authorsContent: 'Ykjam Terjime is ontwikkeld door het ontwikkelteam Şapak uit Mary, Provincie Mary, Turkmenistan.\n\nOnze missie is om de mensen van Turkmenistan — zowel degenen die in het land wonen als in het buitenland — evenals bezoekers te helpen gemakkelijk te communiceren in meerdere talen.\n\nDe app ondersteunt 5 talen en bevat:\n• Scenario-taalgids voor echte situaties, met antwoorden en offline gebruik\n• Tekstvertaler (binnenkort)\n• AI-assistenten (binnenkort)\n• Spraakvertaler (binnenkort)\n• Visuele vertaler (binnenkort)\n\nVoor feedback, fouten of suggesties:\nshapak.apps@gmail.com',
      seriesContent: 'De Şapak app-serie is een uitgebreide suite van applicaties die voornamelijk zijn ontworpen om de mensen van Turkmenistan te helpen bij het leren van vreemde talen.\n\nHoewel deze apps zijn gemaakt met Turkmeense gebruikers in gedachten, kunnen ze gemakkelijk worden gebruikt door mensen over de hele wereld.\n\nYkjam Terjime is de eerste app in de serie. Het is momenteel een scenario-taalgids voor echte situaties, met antwoorden en offline gebruik; de tekst-, spraak- en visuele vertalers evenals AI-aangedreven functies staan in de planning (binnenkort).\n\nAndere apps in de serie zijn momenteel in actieve ontwikkeling — blijf op de hoogte voor updates!',
      mission: 'Missie',
      features: 'Functies',
      contact: 'Contact',
      specialThanks: 'Speciale dank',
      thanksIntro: 'Het Shapak Apps-team bedankt iedereen die het project heeft geholpen:',
      allContributors: 'Alle bijdragers op GitHub',
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
      authorsContent: 'Ykjam Terjime розроблено командою розробників Şapak з міста Мари, провінція Мари, Туркменістан.\n\nНаша місія — допомогти людям Туркменістану — як тим, хто живе в країні, так і за кордоном — а також відвідувачам легко спілкуватися кількома мовами.\n\nДодаток підтримує 5 мов та включає:\n• Сценарний розмовник для реальних ситуацій, з відповідями та офлайн-режимом\n• Текстовий перекладач (скоро)\n• AI-асистенти (скоро)\n• Голосовий перекладач (скоро)\n• Візуальний перекладач (скоро)\n\nДля відгуків, помилок або пропозицій:\nshapak.apps@gmail.com',
      seriesContent: 'Серія додатків Şapak — це комплексний набір додатків, розроблених насамперед для допомоги народу Туркменістану у вивченні іноземних мов.\n\nХоча ці додатки створені з урахуванням туркменських користувачів, ними можуть легко користуватися люди з усього світу.\n\nYkjam Terjime — перший додаток серії. Наразі це сценарійний розмовник для реальних ситуацій, з відповідями та офлайн-режимом; текстовий, голосовий та візуальний перекладачі, а також функції на основі ШІ заплановані (скоро).\n\nІнші додатки серії зараз перебувають в активній розробці — слідкуйте за оновленнями!',
      mission: 'Місія',
      features: 'Функції',
      contact: 'Контакт',
      specialThanks: 'Особлива подяка',
      thanksIntro: 'Команда Shapak Apps дякує за допомогу проєкту:',
      allContributors: 'Усі контриб\'ютори на GitHub',
      soon: 'Незабаром',
      aboutSeries: 'Про серію',
      forEveryone: 'Для всіх',
      whatsNext: 'Що далі',
    },
  };

  const t = aboutTexts[config.mode as keyof typeof aboutTexts] || aboutTexts.en;

  const handleEmailPress = () => {
    Linking.openURL('mailto:shapak.apps@gmail.com');
  };

  const renderAuthorsContent = () => {
    // Parse the authors content to extract sections
    const content = t.authorsContent;
    const lines = content.split('\n\n');

    // Extract email from content
    const emailMatch = content.match(/[\w.+-]+@[\w-]+\.[\w.]+/);
    const email = emailMatch ? emailMatch[0] : 'shapak.apps@gmail.com';

    // Список возможностей: первый пункт — то, что работает сейчас, остальные ещё не готовы.
    // Метку «(soon)» из текста показываем бейджем, чтобы она не повторялась дважды.
    const featureIcons = ['book', 'language', 'sparkles', 'mic', 'camera'];
    const soonLabel = (t as any).soon || 'Soon';
    const featureItems = (lines[2] && lines[2].includes('•'))
      ? lines[2].split('•').slice(1).map((s) => s.trim()).filter(Boolean).slice(0, featureIcons.length)
      : [];

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
              {featureItems.map((item, index) => (
                <FeatureItem
                  key={featureIcons[index]}
                  icon={featureIcons[index]}
                  text={index === 0 ? item : item.replace(/\s*[（(][^)）]*[)）]\s*$/, '')}
                  badge={index === 0 ? undefined : soonLabel}
                />
              ))}
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

        {/* Thanks Section — кто помогал, по версиям; список живёт в src/data/credits.ts */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="heart" size={20} color="#EF4444" />
            <Text style={styles.sectionTitle}>{(t as any).specialThanks || 'Special Thanks'}</Text>
          </View>
          <Text style={styles.sectionText}>
            {(t as any).thanksIntro || 'The Shapak Apps team thanks everyone who helped the project:'}
          </Text>

          {credits.map((credit) => {
            const row = (
              <>
                <View style={styles.creditVersion}>
                  <Text style={styles.creditVersionText}>{credit.version}</Text>
                </View>
                <View style={styles.creditPerson}>
                  <Text style={styles.creditName}>{credit.name}</Text>
                  {credit.github && <Text style={styles.creditHandle}>@{credit.github}</Text>}
                </View>
                {credit.github && <Ionicons name="arrow-forward" size={16} color="#3B82F6" />}
              </>
            );

            return credit.github ? (
              <TouchableOpacity
                key={credit.name}
                style={styles.creditRow}
                onPress={() => Linking.openURL(githubProfileUrl(credit.github as string))}
                activeOpacity={0.7}
              >
                {row}
              </TouchableOpacity>
            ) : (
              <View key={credit.name} style={styles.creditRow}>
                {row}
              </View>
            );
          })}

          <TouchableOpacity
            style={styles.contributorsButton}
            onPress={() => Linking.openURL(CONTRIBUTORS_URL)}
            activeOpacity={0.7}
          >
            <Ionicons name="logo-github" size={18} color="#3B82F6" />
            <Text style={styles.contributorsText}>
              {(t as any).allContributors || 'All contributors on GitHub'}
            </Text>
            <Ionicons name="arrow-forward" size={16} color="#3B82F6" />
          </TouchableOpacity>
        </View>
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
              <Text style={styles.sectionTitle}>Ykjam Terjime</Text>
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
          <Text style={styles.versionText}>{t.version} {appVersion}</Text>
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
  creditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  creditVersion: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 52,
    alignItems: 'center',
  },
  creditVersionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3B82F6',
  },
  creditPerson: {
    flex: 1,
  },
  creditName: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '600',
  },
  creditHandle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  contributorsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  contributorsText: {
    flex: 1,
    fontSize: 14,
    color: '#3B82F6',
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


