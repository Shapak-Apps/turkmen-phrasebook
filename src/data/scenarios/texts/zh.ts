// src/data/scenarios/texts/zh.ts
// Слой китайского. ЧЕРНОВИК: разговорный стиль, у каждой записи обязателен translit (пиньинь).
// Пиньинь как в v1.0.3: строчные буквы, тоновые знаки, пробел между слогами.
// Источник: где книга (translations/chinese.ts) давала прямой смысловой аналог — взято оттуда;
// остальное переведено в этой сессии и требует вычитки.
import { LangLayer } from '../types';

export const zh: LangLayer = {
  // --- survival-ядро ---
  'sv.hello': { text: '你好!', translit: 'nǐ hǎo!' },
  'sv.thanks': { text: '谢谢!', translit: 'xiè xiè!' },
  'sv.please': { text: '请', translit: 'qǐng' },
  'sv.yes': { text: '对', translit: 'duì' },
  'sv.no': { text: '不是', translit: 'bú shì' },
  'sv.ok': { text: '好', translit: 'hǎo' },
  'sv.sorry': { text: '对不起', translit: 'duì bù qǐ' },
  'sv.goodbye': { text: '再见!', translit: 'zài jiàn!' },
  'sv.dont-understand': { text: '我听不懂', translit: 'wǒ tīng bù dǒng' },
  'sv.speak-slower': { text: '请说慢一点', translit: 'qǐng shuō màn yì diǎn' },
  'sv.repeat': { text: '请重复一遍', translit: 'qǐng chóng fù yí biàn' },
  // На каждом слое — про его же язык.
  'sv.no-language': { text: '我不会说中文', translit: 'wǒ bú huì shuō zhōng wén' },
  'sv.write-it': { text: '请写下来', translit: 'qǐng xiě xià lái' },
  'sv.show-map': { text: '请在地图上指给我看', translit: 'qǐng zài dì tú shàng zhǐ gěi wǒ kàn' },
  'sv.help': { text: '请帮助我!', translit: 'qǐng bāng zhù wǒ!' },
  'sv.where-toilet': { text: '厕所在哪里?', translit: 'cè suǒ zài nǎ lǐ?' },
  'sv.how-much': { text: '这个多少钱?', translit: 'zhè ge duō shǎo qián?' },
  'sv.too-expensive': { text: '太贵了', translit: 'tài guì le' },
  'sv.i-want-this': { text: '请给我这个', translit: 'qǐng gěi wǒ zhè ge' },
  'sv.water': { text: '请给我水', translit: 'qǐng gěi wǒ shuǐ' },
  'sv.im-lost': { text: '我迷路了', translit: 'wǒ mí lù le' },
  'sv.where-is': { text: '…在哪里?', translit: '… zài nǎ lǐ?' },
  'sv.need-doctor': { text: '我需要医生', translit: 'wǒ xū yào yī shēng' },
  'sv.police': { text: '请叫警察!', translit: 'qǐng jiào jǐng chá!' },
  'sv.embassy': { text: '我要去土库曼斯坦大使馆', translit: 'wǒ yào qù tǔ kù màn sī tǎn dà shǐ guǎn' },
  'sv.im-from-tm': { text: '我来自土库曼斯坦', translit: 'wǒ lái zì tǔ kù màn sī tǎn' },
  'sv.my-name': { text: '我叫…', translit: 'wǒ jiào…' },
  'sv.charge-phone': { text: '可以充电吗?', translit: 'kě yǐ chōng diàn ma?' },
  'sv.wifi-password': { text: 'Wi-Fi 密码是多少?', translit: 'wi-fi mì mǎ shì duō shǎo?' },
  'sv.can-photo': { text: '可以拍照吗?', translit: 'kě yǐ pāi zhào ma?' },
  'sv.when': { text: '几点?', translit: 'jǐ diǎn?' },
  'sv.wait': { text: '请稍等一下', translit: 'qǐng shāo děng yí xià' },
  'sv.allergy': { text: '我对…过敏', translit: 'wǒ duì… guò mǐn' },
  'sv.no-spicy': { text: '请不要辣的', translit: 'qǐng bú yào là de' },
  'sv.call-taxi': { text: '请给我叫一辆出租车', translit: 'qǐng gěi wǒ jiào yí liàng chū zū chē' },
  // --- сценарий air: регистрация ---
  'air.checkin.where-checkin': { text: '…航班在哪里办登机手续?', translit: '… háng bān zài nǎ lǐ bàn dēng jī shǒu xù?' },
  'air.checkin.here-baggage': { text: '这是我的行李', translit: 'zhè shì wǒ de xíng li' },
  'air.checkin.window-seat': { text: '可以给我靠窗的座位吗?', translit: 'kě yǐ gěi wǒ kào chuāng de zuò wèi ma?' },
  'air.checkin.q-baggage-count': { text: '您托运几件行李?', translit: 'nín tuō yùn jǐ jiàn xíng li?' },
  'air.checkin.one-bag': { text: '一件', translit: 'yí jiàn' },
  'air.checkin.two-bags': { text: '两件', translit: 'liǎng jiàn' },
  'air.checkin.overweight': { text: '我的行李超重吗?', translit: 'wǒ de xíng li chāo zhòng ma?' },
  'air.checkin.boarding-time': { text: '什么时候登机?', translit: 'shén me shí hòu dēng jī?' },

  // --- сценарий air: паспортный контроль ---
  'air.passport.here-passport': { text: '这是我的护照', translit: 'zhè shì wǒ de hù zhào' },
  'air.passport.q-purpose': { text: '您此行的目的是什么?', translit: 'nín cǐ xíng de mù dì shì shén me?' },
  'air.passport.a-tourism': { text: '旅游', translit: 'lǚ yóu' },
  'air.passport.a-business': { text: '出差', translit: 'chū chāi' },
  'air.passport.a-study': { text: '留学', translit: 'liú xué' },
  'air.passport.a-transit': { text: '我是过境的', translit: 'wǒ shì guò jìng de' },
  'air.passport.q-how-long': { text: '您要待多久?', translit: 'nín yào dāi duō jiǔ?' },
  'air.passport.a-days': { text: '…天', translit: '… tiān' },
  'air.passport.q-where-stay': { text: '您住在哪里?', translit: 'nín zhù zài nǎ lǐ?' },
  'air.passport.a-hotel': { text: '在…旅馆', translit: 'zài… lǚ guǎn' },
  'air.passport.q-return-ticket': { text: '您有回程机票吗?', translit: 'nín yǒu huí chéng jī piào ma?' },
  'air.passport.a-here-ticket': { text: '有, 在这里', translit: 'yǒu, zài zhè lǐ' },
  'air.passport.first-time': { text: '我是第一次来你们国家', translit: 'wǒ shì dì yī cì lái nǐ men guó jiā' },

  // --- сценарий air: получение багажа ---
  'air.baggage.where-belt': { text: '…航班的行李在哪里取?', translit: '… háng bān de xíng li zài nǎ lǐ qǔ?' },
  'air.baggage.lost-bag': { text: '我的行李没有到', translit: 'wǒ de xíng li méi yǒu dào' },
  'air.baggage.bag-desc': { text: '我的皮箱是…色的', translit: 'wǒ de pí xiāng shì… sè de' },
  'air.baggage.claim-office': { text: '行李查询处在哪里?', translit: 'xíng li chá xún chù zài nǎ lǐ?' },
  'air.baggage.where-cart': { text: '行李车在哪里?', translit: 'xíng li chē zài nǎ lǐ?' },

  // --- сценарий air: связь и деньги ---
  'air.sim-money.where-exchange': { text: '在哪儿可以换钱?', translit: 'zài nǎ ér kě yǐ huàn qián?' },
  'air.sim-money.exchange-rate': { text: '汇率是多少?', translit: 'huì lǜ shì duō shǎo?' },
  'air.sim-money.need-sim': { text: '我需要一张能上网的手机卡', translit: 'wǒ xū yào yì zhāng néng shàng wǎng de shǒu jī kǎ' },
  'air.sim-money.q-passport-please': { text: '请出示您的护照', translit: 'qǐng chū shì nín de hù zhào' },
  'air.sim-money.a-here-it-is': { text: '给您', translit: 'gěi nín' },
  'air.sim-money.have-esim': { text: '你们有 eSIM 吗?', translit: 'nǐ men yǒu eSIM ma?' },
  'air.sim-money.how-topup': { text: '怎么充值?', translit: 'zěn me chōng zhí?' },
  'air.sim-money.official-taxi': { text: '正规出租车站在哪里?', translit: 'zhèng guī chū zū chē zhàn zài nǎ lǐ?' },
};
