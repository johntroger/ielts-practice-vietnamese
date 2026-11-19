/**
 * src/data/conversationData.js
 *
 * Interactive Roleplay Conversation Bank & Turn-Gated Pronunciation Engine (/conversation).
 * Reuses evaluatePronunciationAttempt from pronunciationData.js with a default 75% pass gate.
 * Strictly complies with Global English UI Rule (100% English when isEn === true).
 */

import {
  evaluatePronunciationAttempt,
  buildCustomPronunciationDrill
} from './pronunciationData.js';

export const CONVERSATION_DEFAULT_THRESHOLD = 75;
export const CONVERSATION_THRESHOLD_OPTIONS = [
  { value: 70, labelEn: '70% Relaxed', labelVi: '70% Cơ bản' },
  { value: 75, labelEn: '75% Standard', labelVi: '75% Chuẩn' },
  { value: 80, labelEn: '80% Strict', labelVi: '80% Khắt khe' },
  { value: 88, labelEn: '88% Band 8+', labelVi: '88% Band 8+' }
];

export const CONVERSATION_TRACKS = [
  {
    id: 'all',
    labelEn: 'All Scenarios',
    labelVi: 'Tất Cả Kịch Bản',
    badgeColor: 'from-slate-700 to-slate-800',
    baseTurnXp: 18,
    completionBonusXp: 35
  },
  {
    id: 'daily',
    labelEn: 'Daily & Travel',
    labelVi: 'Đời Sống & Du Lịch',
    shortDescEn: 'Real-world cafés, hotels, transport & errands',
    shortDescVi: 'Giao tiếp quán cà phê, khách sạn, đi lại & đời sống',
    badgeColor: 'from-cyan-500 to-blue-600',
    baseTurnXp: 15,
    completionBonusXp: 30
  },
  {
    id: 'ielts',
    labelEn: 'IELTS Speaking',
    labelVi: 'Đối Thoại IELTS',
    shortDescEn: 'Part 1 & Part 3 examiner-candidate turn-taking',
    shortDescVi: 'Luyện đối đáp Giám khảo ↔ Thí sinh Part 1 & Part 3',
    badgeColor: 'from-violet-500 to-purple-600',
    baseTurnXp: 20,
    completionBonusXp: 40
  },
  {
    id: 'academic',
    labelEn: 'Workplace & Academic',
    labelVi: 'Công Sở & Học Thuật',
    shortDescEn: 'Tutor consultations, interviews & project standups',
    shortDescVi: 'Thảo luận học thuật, phỏng vấn & họp dự án',
    badgeColor: 'from-rose-500 to-amber-500',
    baseTurnXp: 25,
    completionBonusXp: 50
  }
];

export const CONVERSATION_SCENARIOS = [
  // =========================================================================
  // TRACK 1: DAILY & TRAVEL (4 Scenarios)
  // =========================================================================
  {
    id: 'conv-daily-coffee',
    track: 'daily',
    bandLevel: '5.5',
    titleEn: 'Ordering Specialty Coffee',
    titleVi: 'Đặt Cà Phê & Tùy Chỉnh Đồ Uống',
    contextEn: 'You are ordering a morning coffee at a busy London café and checking seating.',
    contextVi: 'Bạn đang gọi cà phê buổi sáng tại một quán ở London và hỏi chỗ ngồi.',
    roles: {
      A: { nameEn: 'Barista', nameVi: 'Nhân viên pha chế', avatar: '☕' },
      B: { nameEn: 'Customer', nameVi: 'Khách hàng', avatar: '🧑' }
    },
    defaultUserRole: 'B',
    xpReward: 75,
    turns: [
      {
        id: 't1',
        speaker: 'A',
        text: 'Good morning! Welcome to Atlas Roastery. What can I get started for you today?',
        intonationText: 'Good ˈmorning! ↗ / ˈWelcome to ˈAtlas ˈRoastery. ↘ / ˈWhat can I get ˈstarted for you toˈday? ↘',
        meaningEn: 'Friendly morning greeting and opening order prompt.',
        meaningVi: 'Chào buổi sáng và hỏi khách muốn gọi món gì.',
        mouthTipEn: 'Link "What can I" smoothly and keep a warm rising tone on "morning".',
        mouthTipVi: 'Nối mượt "What can I" và lên giọng thân thiện ở "morning".'
      },
      {
        id: 't2',
        speaker: 'B',
        text: 'Hi there! Could I please have a medium iced latte with oat milk?',
        intonationText: 'ˈHi there! ↗ / Could I ˈplease have a ˈmedium ˈiced ˈlatte ↗ / with ˈoat milk? ↗',
        meaningEn: 'Polite request specifying drink size and milk alternative.',
        meaningVi: 'Cho tôi một ly latte đá cỡ vừa dùng sữa yến mạch nhé.',
        mouthTipEn: 'Pronounce the final /t/ in "iced" and "oat" lightly without dropping the /s/ in "please".',
        mouthTipVi: 'Bật nhẹ âm cuối /s/ trong "please" và /t/ trong "oat".'
      },
      {
        id: 't3',
        speaker: 'A',
        text: 'Sure thing. Would you like an extra espresso shot or any sugar syrup in that?',
        intonationText: 'ˈSure thing. ↘ / Would you ˈlike an ˈextra eˈspresso ˈshot ↗ / or any ˈsugar ˈsyrup in that? ↗',
        meaningEn: 'Asking about drink customization options.',
        meaningVi: 'Hỏi xem bạn có muốn thêm shot espresso hoặc si-rô đường không.',
        mouthTipEn: 'Stress "EX-tra" and "e-SPRES-so" clearly.',
        mouthTipVi: 'Nhấn rõ "EX-tra" và "e-SPRES-so".'
      },
      {
        id: 't4',
        speaker: 'B',
        text: 'No syrup, thank you. Just a regular shot is totally fine for me.',
        intonationText: 'ˈNo ˈsyrup, ˈthank you. ↘ / Just a ˈregular ˈshot is ˈtotally ˈfine for me. ↘',
        meaningEn: 'Declining syrup politely and confirming standard strength.',
        meaningVi: 'Không cần si-rô đâu, cảm ơn bạn. Một shot bình thường là ổn rồi.',
        mouthTipEn: 'Articulate /θ/ in "thank" and stress "REG-u-lar" on the first syllable.',
        mouthTipVi: 'Đặt lưỡi giữa hai răng cho âm /θ/ ở "thank" và nhấn âm đầu "REG-u-lar".'
      },
      {
        id: 't5',
        speaker: 'A',
        text: 'Got it. Will that be for here or to take away?',
        intonationText: 'ˈGot it. ↘ / Will ˈthat be for ˈhere ↗ / or to ˈtake aˈway? ↘',
        meaningEn: 'Confirming dine-in versus takeaway.',
        meaningVi: 'Hỏi dùng tại quán hay mang đi.',
        mouthTipEn: 'Contrast rising pitch on "here ↗" and falling pitch on "take away ↘".',
        mouthTipVi: 'Lên giọng ở "here ↗" và hạ giọng ở "take away ↘".'
      },
      {
        id: 't6',
        speaker: 'B',
        text: 'For here, please. Also, is there a quiet table with a power outlet upstairs?',
        intonationText: 'For ˈhere, please. ↘ / ˈAlso, ↗ / is there a ˈquiet ˈtable with a ˈpower ˈoutlet upˈstairs? ↗',
        meaningEn: 'Choosing dine-in and asking about workspace amenities.',
        meaningVi: 'Tôi uống tại quán. Trên lầu có bàn yên tĩnh gần ổ cắm điện không?',
        mouthTipEn: 'Pronounce "quiet" with two clear syllables (/ˈkwaɪ.ət/) and raise pitch at the end of the question.',
        mouthTipVi: 'Đọc rõ 2 âm tiết của "quiet" (/ˈkwaɪ.ət/) và lên giọng cuối câu hỏi Yes/No.'
      }
    ]
  },
  {
    id: 'conv-daily-hotel',
    track: 'daily',
    bandLevel: '6.0',
    titleEn: 'Hotel Check-in & Room Request',
    titleVi: 'Nhận Phòng Khách Sạn & Yêu Cầu Hỗ Trợ',
    contextEn: 'Arriving at a hotel reception and requesting a quiet room away from the street.',
    contextVi: 'Làm thủ tục nhận phòng tại quầy lễ tân và xin đổi sang phòng yên tĩnh.',
    roles: {
      A: { nameEn: 'Receptionist', nameVi: 'Lễ tân', avatar: '🏨' },
      B: { nameEn: 'Guest', nameVi: 'Khách lưu trú', avatar: '🧳' }
    },
    defaultUserRole: 'B',
    xpReward: 80,
    turns: [
      {
        id: 't1',
        speaker: 'A',
        text: 'Good evening! Do you have a reservation with us tonight?',
        intonationText: 'Good ˈevening! ↗ / Do you ˈhave a reserˈvation with us toˈnight? ↗',
        meaningEn: 'Evening welcome and reservation check.',
        meaningVi: 'Chào buổi tối! Quý khách đã đặt phòng trước cho tối nay chưa ạ?',
        mouthTipEn: 'Stress "-VA-" in "reser-VA-tion" and raise pitch on "tonight".',
        mouthTipVi: 'Nhấn "-VA-" trong "reser-VA-tion" và lên giọng ở "tonight".'
      },
      {
        id: 't2',
        speaker: 'B',
        text: 'Yes, I booked a double room for three nights under the name Minh Tran.',
        intonationText: 'ˈYes, ↘ / I ˈbooked a ˈdouble ˈroom for ˈthree ˈnights ↗ / under the ˈname ˈMinh ˈTran. ↘',
        meaningEn: 'Confirming booking details and duration.',
        meaningVi: 'Vâng, tôi có đặt một phòng đôi trong ba đêm dưới tên Minh Tran.',
        mouthTipEn: 'Pronounce /t/ in "booked" (/bʊkt/) and clear /s/ at the end of "nights".',
        mouthTipVi: 'Bật rõ đuôi /t/ của "booked" và âm /s/ ở cuối "nights".'
      },
      {
        id: 't3',
        speaker: 'A',
        text: 'Let me check. Yes, everything is confirmed. Would you like breakfast included?',
        intonationText: 'ˈLet me ˈcheck. ↘ / ˈYes, ˈeverything is conˈfirmed. ↘ / Would you ˈlike ˈbreakfast inˈcluded? ↗',
        meaningEn: 'Verifying booking and offering breakfast add-on.',
        meaningVi: 'Để tôi kiểm tra. Vâng, mọi thứ đã xác nhận. Quý khách có muốn kèm bữa sáng không?',
        mouthTipEn: 'Keep "breakfast" as /ˈbrek.fəst/ (not "break-fast").',
        mouthTipVi: 'Đọc "breakfast" là /ˈbrek.fəst/, tránh đọc thành /breɪk-fɑːst/.'
      },
      {
        id: 't4',
        speaker: 'B',
        text: 'Yes, please. If possible, could I have a quiet room on a higher floor?',
        intonationText: 'ˈYes, please. ↘ / If ˈpossible, ↗ / could I ˈhave a ˈquiet ˈroom on a ˈhigher ˈfloor? ↗',
        meaningEn: 'Accepting breakfast and politely requesting a quieter room.',
        meaningVi: 'Có ạ. Nếu được, cho tôi xin phòng yên tĩnh ở tầng cao hơn được không?',
        mouthTipEn: 'Pause briefly after "If possible" and link "on a" smoothly.',
        mouthTipVi: 'Ngắt nhẹ sau "If possible" và nối mượt "on a".'
      },
      {
        id: 't5',
        speaker: 'A',
        text: 'Certainly! I can assign you room 704 overlooking the courtyard. Here is your key card.',
        intonationText: 'ˈCertainly! ↘ / I can aˈssign you room ˈseven oh ˈfour ↗ / overˈlooking the ˈcourtyard. ↘ / ˈHere is your ˈkey card. ↘',
        meaningEn: 'Confirming room assignment and handing over key card.',
        meaningVi: 'Chắc chắn rồi! Tôi xếp cho bạn phòng 704 nhìn ra sân trong. Đây là thẻ phòng của bạn.',
        mouthTipEn: 'Stress "CER-tain-ly" on the first syllable and "a-SSIGN" on the second.',
        mouthTipVi: 'Nhấn âm đầu "CER-tain-ly" và âm hai "a-SSIGN".'
      },
      {
        id: 't6',
        speaker: 'B',
        text: 'That sounds wonderful. What time does the breakfast buffet open tomorrow morning?',
        intonationText: 'That ˈsounds ˈwonderful. ↘ / ˈWhat ˈtime does the ˈbreakfast buˈffet ˈopen toˈmorrow ˈmorning? ↘',
        meaningEn: 'Expressing appreciation and asking breakfast hours.',
        meaningVi: 'Tuyệt vời quá. Sáng mai tiệc buffet sáng mở cửa lúc mấy giờ vậy ạ?',
        mouthTipEn: 'Pronounce "buffet" as /ˈbʊf.eɪ/ or /bəˈfeɪ/ (silent final t).',
        mouthTipVi: 'Chú ý "buffet" có âm /t/ cuối câm (/bəˈfeɪ/).'
      }
    ]
  },
  {
    id: 'conv-daily-directions',
    track: 'daily',
    bandLevel: '6.0',
    titleEn: 'Asking Directions to the Museum',
    titleVi: 'Hỏi Đường Đến Bảo Tàng Thành Phố',
    contextEn: 'Asking a local resident for walking and bus directions to the National History Museum.',
    contextVi: 'Hỏi người dân địa phương đường đi bộ hoặc xe buýt đến Bảo tàng Lịch sử.',
    roles: {
      A: { nameEn: 'Local Resident', nameVi: 'Người dân địa phương', avatar: '🗺️' },
      B: { nameEn: 'Visitor', nameVi: 'Du khách', avatar: '📸' }
    },
    defaultUserRole: 'B',
    xpReward: 80,
    turns: [
      {
        id: 't1',
        speaker: 'B',
        text: 'Excuse me, could you tell me the quickest way to the National History Museum?',
        intonationText: 'Exˈcuse me, ↗ / could you ˈtell me the ˈquickest ˈway ↗ / to the ˈNational ˈHistory Muˈseum? ↘',
        meaningEn: 'Polite opening to ask for the fastest route.',
        meaningVi: 'Xin lỗi, bạn có thể chỉ giúp tôi đường nhanh nhất đến Bảo tàng Lịch sử Quốc gia không?',
        mouthTipEn: 'Stress "mu-SE-um" on the second syllable and drop the silent "o" in "History" (/ˈhɪs.tər.i/).',
        mouthTipVi: 'Nhấn âm 2 ở "mu-SE-um" và đọc gọn "History" (/ˈhɪs.tri/).'
      },
      {
        id: 't2',
        speaker: 'A',
        text: 'Sure! Walk straight down this street for two blocks, then turn left at the traffic lights.',
        intonationText: 'ˈSure! ↘ / Walk ˈstraight down this ˈstreet for ˈtwo ˈblocks, ↗ / then turn ˈleft at the ˈtraffic lights. ↘',
        meaningEn: 'Giving step-by-step walking directions.',
        meaningVi: 'Được chứ! Bạn đi thẳng hết con phố này hai dãy nhà, rồi rẽ trái ở chỗ đèn giao thông.',
        mouthTipEn: 'Pronounce the final /s/ in "blocks" and "lights" clearly.',
        mouthTipVi: 'Bật rõ âm /s/ cuối ở "blocks" và "lights".'
      },
      {
        id: 't3',
        speaker: 'B',
        text: 'Got it. Is it within walking distance from the traffic lights, or should I take a bus?',
        intonationText: 'ˈGot it. ↘ / Is it wiˈthin ˈwalking ˈdistance from the ˈtraffic lights, ↗ / or should I ˈtake a ˈbus? ↘',
        meaningEn: 'Checking whether walking is practical or public transit is better.',
        meaningVi: 'Tôi hiểu rồi. Từ chỗ đèn đỏ có đi bộ tới được không, hay tôi nên bắt xe buýt?',
        mouthTipEn: 'Keep pitch up before the comma on "traffic lights ↗" and fall on "bus ↘".',
        mouthTipVi: 'Lên giọng nhẹ trước dấu phẩy ở "traffic lights ↗" và hạ giọng ở "bus ↘".'
      },
      {
        id: 't4',
        speaker: 'A',
        text: 'It is only a five-minute walk past the central library. You cannot miss the glass entrance.',
        intonationText: 'It is ˈonly a ˈfive-minute ˈwalk past the ˈcentral ˈlibrary. ↘ / You ˈcannot ˈmiss the ˈglass ˈentrance. ↘',
        meaningEn: 'Reassuring that it is a short walk with a clear landmark.',
        meaningVi: 'Chỉ mất 5 phút đi bộ qua thư viện trung tâm thôi. Bạn sẽ thấy ngay cổng kính lớn.',
        mouthTipEn: 'Pronounce "library" with three syllables (/ˈlaɪ.brər.i/) and clear /s/ in "entrance".',
        mouthTipVi: 'Đọc đủ âm của "library" và bật rõ âm /s/ cuối "entrance".'
      },
      {
        id: 't5',
        speaker: 'B',
        text: 'Thank you so much for your help! Do you happen to know if admission is free?',
        intonationText: 'ˈThank you ˈso much for your ˈhelp! ↘ / Do you ˈhappen to ˈknow if adˈmission is ˈfree? ↗',
        meaningEn: 'Thanking the local and asking about ticket fees.',
        meaningVi: 'Cảm ơn bạn rất nhiều! Bạn có biết vé vào cửa có miễn phí không?',
        mouthTipEn: 'Stress "ad-MIS-sion" on the second syllable and rise at the end on "free ↗".',
        mouthTipVi: 'Nhấn "ad-MIS-sion" ở âm 2 và lên giọng ở cuối câu hỏi "free ↗".'
      },
      {
        id: 't6',
        speaker: 'A',
        text: 'Yes, the permanent exhibition is free, though special galleries require a small ticket.',
        intonationText: 'ˈYes, ↘ / the ˈpermanent exhiˈbition is ˈfree, ↗ / though ˈspecial ˈgalleries reˈquire a ˈsmall ˈticket. ↘',
        meaningEn: 'Explaining free permanent access vs paid special exhibitions.',
        meaningVi: 'Có, khu trưng bày thường trực miễn phí, còn các phòng triển lãm đặc biệt cần mua vé nhỏ.',
        mouthTipEn: 'Stress "-BI-" in "exhi-BI-tion" and "PER-ma-nent" on the first syllable.',
        mouthTipVi: 'Nhấn "-BI-" trong "exhi-BI-tion" và âm đầu "PER-ma-nent".'
      }
    ]
  },
  {
    id: 'conv-daily-pharmacy',
    track: 'daily',
    bandLevel: '6.5',
    titleEn: 'At the Pharmacy: Describing Symptoms',
    titleVi: 'Tại Hiệu Thuốc: Mô Tả Triệu Chứng',
    contextEn: 'Explaining mild cold symptoms to a pharmacist and asking about dosage.',
    contextVi: 'Mô tả triệu chứng cảm nhẹ với dược sĩ và hỏi liều dùng an toàn.',
    roles: {
      A: { nameEn: 'Pharmacist', nameVi: 'Dược sĩ', avatar: '💊' },
      B: { nameEn: 'Customer', nameVi: 'Khách hàng', avatar: '🤒' }
    },
    defaultUserRole: 'B',
    xpReward: 85,
    turns: [
      {
        id: 't1',
        speaker: 'A',
        text: 'Hello! How can I help you today? Are you looking for something specific?',
        intonationText: 'Helˈlo! ↗ / ˈHow can I ˈhelp you toˈday? ↘ / Are you ˈlooking for ˈsomething speˈcific? ↗',
        meaningEn: 'Greeting and asking what the customer needs.',
        meaningVi: 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay? Bạn đang tìm loại thuốc nào cụ thể không?',
        mouthTipEn: 'Stress "spe-CIF-ic" on the second syllable.',
        mouthTipVi: 'Nhấn trọng âm vào âm 2 của "spe-CIF-ic".'
      },
      {
        id: 't2',
        speaker: 'B',
        text: 'I have had a sore throat and a blocked nose since yesterday evening.',
        intonationText: 'I have ˈhad a ˈsore ˈthroat ↗ / and a ˈblocked ˈnose since ˈyesterday ˈevening. ↘',
        meaningEn: 'Describing onset and exact symptoms.',
        meaningVi: 'Tôi bị đau họng và nghẹt mũi từ tối hôm qua đến giờ.',
        mouthTipEn: 'Pronounce /θ/ in "throat" and /t/ in "blocked" (/blɒkt/).',
        mouthTipVi: 'Đọc chuẩn /θ/ trong "throat" và đuôi /t/ trong "blocked" (/blɒkt/).'
      },
      {
        id: 't3',
        speaker: 'A',
        text: 'I see. Do you have a fever, or are you allergic to any common medications?',
        intonationText: 'I ˈsee. ↘ / Do you ˈhave a ˈfever, ↗ / or are you aˈllergic to any ˈcommon mediˈcations? ↘',
        meaningEn: 'Checking for fever and medication allergies.',
        meaningVi: 'Tôi hiểu. Bạn có bị sốt hay dị ứng với loại thuốc phổ biến nào không?',
        mouthTipEn: 'Stress "al-LER-gic" and "medi-CA-tions" cleanly.',
        mouthTipVi: 'Nhấn rõ "al-LER-gic" và "medi-CA-tions".'
      },
      {
        id: 't4',
        speaker: 'B',
        text: 'No fever and no allergies. I just need something non-drowsy so I can still work.',
        intonationText: 'ˈNo ˈfever and ˈno ˈallergies. ↘ / I just ˈneed ˈsomething non-ˈdrowsy ↗ / so I can ˈstill ˈwork. ↘',
        meaningEn: 'Ruling out allergies and requesting a non-drowsy formula.',
        meaningVi: 'Không sốt và không dị ứng. Tôi chỉ cần loại không gây buồn ngủ để vẫn làm việc được.',
        mouthTipEn: 'Pronounce plural /-z/ in "allergies" and diphthong /aʊ/ in "drowsy".',
        mouthTipVi: 'Bật âm /z/ cuối từ "allergies" và nguyên âm đôi /aʊ/ ở "drowsy".'
      },
      {
        id: 't5',
        speaker: 'A',
        text: 'These herbal lozenges and nasal spray will relieve your symptoms without causing drowsiness.',
        intonationText: 'These ˈherbal ˈlozenges and ˈnasal ˈspray ↗ / will reˈlieve your ˈsymptoms ↗ / without ˈcausing ˈdrowsiness. ↘',
        meaningEn: 'Recommending suitable over-the-counter remedies.',
        meaningVi: 'Viên ngậm thảo dược và thuốc xịt mũi này sẽ giảm triệu chứng mà không gây buồn ngủ.',
        mouthTipEn: 'Link "symptoms without" smoothly and stress "re-LIEVE".',
        mouthTipVi: 'Nối mượt "symptoms without" và nhấn âm 2 ở "re-LIEVE".'
      },
      {
        id: 't6',
        speaker: 'B',
        text: 'That is perfect. How often should I take the lozenges during the day?',
        intonationText: 'That is ˈperfect. ↘ / ˈHow ˈoften should I ˈtake the ˈlozenges during the ˈday? ↘',
        meaningEn: 'Confirming dosage frequency.',
        meaningVi: 'Tuyệt quá. Trong ngày tôi nên ngậm viên này bao lâu một lần?',
        mouthTipEn: 'Silent "t" in "often" (/ˈɒf.ən/) is very natural in everyday speech.',
        mouthTipVi: 'Chữ "t" trong "often" (/ˈɒf.ən/) có thể đọc câm cho tự nhiên.'
      }
    ]
  },

  // =========================================================================
  // TRACK 2: IELTS SPEAKING (4 Scenarios)
  // =========================================================================
  {
    id: 'conv-ielts-p1-work',
    track: 'ielts',
    bandLevel: '7.0',
    titleEn: 'IELTS Part 1: Work & Work-Life Balance',
    titleVi: 'IELTS Part 1: Công Việc & Cân Bằng Cuộc Sống',
    contextEn: 'Authentic IELTS Speaking Part 1 interview about your current occupation and daily pressure.',
    contextVi: 'Phỏng vấn IELTS Speaking Part 1 về công việc/học tập và cách cân bằng áp lực.',
    roles: {
      A: { nameEn: 'Examiner', nameVi: 'Giám khảo IELTS', avatar: '🎓' },
      B: { nameEn: 'Candidate', nameVi: 'Thí sinh', avatar: '🎙️' }
    },
    defaultUserRole: 'B',
    xpReward: 100,
    turns: [
      {
        id: 't1',
        speaker: 'A',
        text: 'Good morning. Let us talk about what you do. Do you currently work or are you a student?',
        intonationText: 'Good ˈmorning. ↘ / Let us ˈtalk about ˈwhat you ˈdo. ↘ / Do you ˈcurrently ˈwork ↗ / or are you a ˈstudent? ↘',
        meaningEn: 'Standard Part 1 opening question.',
        meaningVi: 'Chào buổi sáng. Hiện tại bạn đang đi làm hay còn là sinh viên?',
        mouthTipEn: 'Keep a steady, welcoming examiner cadence.',
        mouthTipVi: 'Giữ nhịp điệu điềm đạm, rõ ràng.'
      },
      {
        id: 't2',
        speaker: 'B',
        text: 'At the moment, I work as a software developer at a growing technology company.',
        intonationText: 'At the ˈmoment, ↗ / I ˈwork as a ˈsoftware deˈveloper ↗ / at a ˈgrowing techˈnology ˈcompany. ↘',
        meaningEn: 'Direct answer with clear job title and context.',
        meaningVi: 'Hiện tại tôi đang làm lập trình viên phần mềm tại một công ty công nghệ đang phát triển.',
        mouthTipEn: 'Stress "de-VEL-op-er" on the second syllable and "tech-NOL-o-gy" on the second.',
        mouthTipVi: 'Nhấn âm 2 ở "de-VEL-op-er" và "tech-NOL-o-gy".'
      },
      {
        id: 't3',
        speaker: 'A',
        text: 'That sounds interesting. What do you find most demanding about your daily work?',
        intonationText: 'That ˈsounds ˈinteresting. ↘ / ˈWhat do you ˈfind most deˈmanding ↗ / about your ˈdaily ˈwork? ↘',
        meaningEn: 'Follow-up probing workplace challenges.',
        meaningVi: 'Nghe thú vị đấy. Điều gì bạn thấy áp lực nhất trong công việc hàng ngày?',
        mouthTipEn: 'Keep "interesting" to 3 syllables (/ˈɪn.trəs.tɪŋ/).',
        mouthTipVi: 'Đọc gọn "interesting" thành 3 âm tiết (/ˈɪn.trəs.tɪŋ/).'
      },
      {
        id: 't4',
        speaker: 'B',
        text: 'Honestly, the toughest part is meeting tight deadlines while maintaining a healthy work-life balance.',
        intonationText: 'ˈHonestly, ↗ / the ˈtoughest ˈpart is ˈmeeting ˈtight ˈdeadlines ↗ / while mainˈtaining a ˈhealthy ˈwork-life ˈbalance. ↘',
        meaningEn: 'Band 7.5+ idiomatic phrasing ("tight deadlines", "work-life balance").',
        meaningVi: 'Thú thật là phần khó nhất là chạy kịp các hạn chót gấp gáp mà vẫn giữ cân bằng cuộc sống.',
        mouthTipEn: 'Silent "h" in "honestly" (/ˈɒn.ɪst.li/) and clear /z/ in "deadlines".',
        mouthTipVi: 'Âm "h" trong "honestly" là âm câm (/ˈɒn.ɪst.li/), bật rõ /z/ ở "deadlines".'
      },
      {
        id: 't5',
        speaker: 'A',
        text: 'I see. Do you think your field will change significantly over the next decade?',
        intonationText: 'I ˈsee. ↘ / Do you ˈthink your ˈfield will ˈchange sigˈnificantly ↗ / over the ˈnext ˈdecade? ↗',
        meaningEn: 'Transitioning to future speculation.',
        meaningVi: 'Tôi hiểu. Bạn có nghĩ ngành của mình sẽ thay đổi mạnh trong thập kỷ tới không?',
        mouthTipEn: 'Stress "sig-NIF-i-cant-ly" and "DEC-ade".',
        mouthTipVi: 'Nhấn "sig-NIF-i-cant-ly" và âm đầu "DEC-ade".'
      },
      {
        id: 't6',
        speaker: 'B',
        text: 'Definitely, because artificial intelligence is automating routine coding tasks at an unprecedented pace.',
        intonationText: 'ˈDefinitely, ↗ / because ˌartiˈficial inˈtelligence is ˈautomating rouˈtine ˈcoding ˈtasks ↗ / at an unˈprecedented ˈpace. ↘',
        meaningEn: 'Band 8.0 response using "unprecedented pace" and "routine".',
        meaningVi: 'Chắc chắn rồi, vì AI đang tự động hóa các tác vụ code lặp lại với tốc độ chưa từng có.',
        mouthTipEn: 'Stress "rou-TINE" on the second syllable and pronounce /-sks/ in "tasks".',
        mouthTipVi: 'Nhấn "rou-TINE" ở âm 2 và đọc rõ cụm /-sks/ cuối từ "tasks".'
      }
    ]
  },
  {
    id: 'conv-ielts-p1-hometown',
    track: 'ielts',
    bandLevel: '6.5',
    titleEn: 'IELTS Part 1: Hometown & Urban Changes',
    titleVi: 'IELTS Part 1: Quê Hương & Đô Thị Hóa',
    contextEn: 'Discussing your hometown atmosphere, favorite places, and recent urban development.',
    contextVi: 'Trò chuyện về quê hương, nét đặc trưng và sự thay đổi hạ tầng gần đây.',
    roles: {
      A: { nameEn: 'Examiner', nameVi: 'Giám khảo IELTS', avatar: '🎓' },
      B: { nameEn: 'Candidate', nameVi: 'Thí sinh', avatar: '🎙️' }
    },
    defaultUserRole: 'B',
    xpReward: 95,
    turns: [
      {
        id: 't1',
        speaker: 'A',
        text: 'Let us move on to your hometown. Where did you grow up?',
        intonationText: 'Let us ˈmove on to your ˈhometown. ↘ / ˈWhere did you ˈgrow ˈup? ↘',
        meaningEn: 'Opening question about hometown origin.',
        meaningVi: 'Hãy chuyển sang chủ đề quê hương. Bạn lớn lên ở đâu?',
        mouthTipEn: 'Link "move on" smoothly and drop pitch at the Wh-question end.',
        mouthTipVi: 'Nối mượt "move on" và hạ giọng cuối câu hỏi Wh-.'
      },
      {
        id: 't2',
        speaker: 'B',
        text: 'I grew up in Da Nang, a vibrant coastal city situated in central Vietnam.',
        intonationText: 'I ˈgrew up in ˈDa Nang, ↗ / a ˈvibrant ˈcoastal ˈcity ↗ / ˈsituated in ˈcentral Vietˈnam. ↘',
        meaningEn: 'Band 7.0+ geographical description ("vibrant coastal city").',
        meaningVi: 'Tôi lớn lên ở Đà Nẵng, một thành phố biển năng động nằm ở miền Trung Việt Nam.',
        mouthTipEn: 'Pronounce "coastal" (/ˈkəʊ.stəl/) and "situated" (/ˈsɪtʃ.u.eɪ.tɪd/) clearly.',
        mouthTipVi: 'Đọc rõ âm /tʃ/ trong "situated" và âm /l/ cuối "coastal".'
      },
      {
        id: 't3',
        speaker: 'A',
        text: 'What do people usually enjoy most about living there?',
        intonationText: 'ˈWhat do ˈpeople ˈusually enˈjoy ˈmost ↗ / about ˈliving there? ↘',
        meaningEn: 'Asking about positive highlights of the city.',
        meaningVi: 'Mọi người thường thích nhất điều gì khi sống ở đó?',
        mouthTipEn: 'Stress "U-su-al-ly" on the first syllable.',
        mouthTipVi: 'Nhấn âm đầu của "U-su-al-ly".'
      },
      {
        id: 't4',
        speaker: 'B',
        text: 'Visitors often love the laid-back pace of life, clean beaches, and warm-hearted local residents.',
        intonationText: 'ˈVisitors ˈoften ˈlove the ˈlaid-back ˈpace of ˈlife, ↗ / ˈclean ˈbeaches, ↗ / and ˈwarm-hearted ˈlocal ˈresidents. ↘',
        meaningEn: 'Listing three highlights with natural rising-falling intonation.',
        meaningVi: 'Du khách thường thích nhịp sống thư thái, bãi biển sạch và người dân địa phương hiếu khách.',
        mouthTipEn: 'Use rising intonation on the first two list items and fall on "residents ↘".',
        mouthTipVi: 'Lên giọng ở 2 ý liệt kê đầu và hạ giọng dứt khoát ở "residents ↘".'
      },
      {
        id: 't5',
        speaker: 'A',
        text: 'Has your hometown changed much over the past ten years?',
        intonationText: 'Has your ˈhometown ˈchanged ˈmuch ↗ / over the ˈpast ˈten ˈyears? ↗',
        meaningEn: 'Comparing past and present city development.',
        meaningVi: 'Quê hương bạn có thay đổi nhiều trong mười năm qua không?',
        mouthTipEn: 'Pronounce /dʒd/ at the end of "changed" without adding an extra syllable.',
        mouthTipVi: 'Đọc "changed" 1 âm tiết (/tʃeɪndʒd/), không đọc thêm âm tiết thừa.'
      },
      {
        id: 't6',
        speaker: 'B',
        text: 'Yes, public transport infrastructure has improved dramatically, although traffic congestion is slightly worse.',
        intonationText: 'ˈYes, ↘ / ˈpublic ˈtransport ˈinfrastructure has imˈproved draˈmatically, ↗ / alˈthough ˈtraffic conˈgestion is ˈslightly ˈworse. ↘',
        meaningEn: 'Balanced contrast response ("although", "infrastructure", "congestion").',
        meaningVi: 'Có ạ, hạ tầng giao thông công cộng cải thiện rõ rệt, dù ùn tắc giao thông có tăng nhẹ.',
        mouthTipEn: 'Stress "IN-fra-struc-ture" on the first syllable and "dra-MAT-i-cal-ly" on the second.',
        mouthTipVi: 'Nhấn "IN-fra-struc-ture" ở âm 1 và "dra-MAT-i-cal-ly" ở âm 2.'
      }
    ]
  },
  {
    id: 'conv-ielts-p3-ai',
    track: 'ielts',
    bandLevel: '8.0',
    titleEn: 'IELTS Part 3: AI & Future of Employment',
    titleVi: 'IELTS Part 3: Trí Tuệ Nhân Tạo & Việc Làm',
    contextEn: 'Abstract two-way Part 3 discussion weighing automation efficiency against human empathy.',
    contextVi: 'Thảo luận chuyên sâu Part 3 về tác động của tự động hóa và giá trị cảm xúc con người.',
    roles: {
      A: { nameEn: 'Examiner', nameVi: 'Giám khảo IELTS', avatar: '🎓' },
      B: { nameEn: 'Candidate', nameVi: 'Thí sinh', avatar: '🎙️' }
    },
    defaultUserRole: 'B',
    xpReward: 115,
    turns: [
      {
        id: 't1',
        speaker: 'A',
        text: 'In your view, will artificial intelligence replace most human jobs in the foreseeable future?',
        intonationText: 'In your ˈview, ↗ / will ˌartiˈficial inˈtelligence reˈplace ˈmost ˈhuman ˈjobs ↗ / in the foreˈseeable ˈfuture? ↗',
        meaningEn: 'Part 3 analytical question on technological displacement.',
        meaningVi: 'Theo quan điểm của bạn, AI có thay thế phần lớn công việc của con người trong tương lai gần không?',
        mouthTipEn: 'Stress "fore-SEE-able" on the second syllable.',
        mouthTipVi: 'Nhấn âm 2 của "fore-SEE-able".'
      },
      {
        id: 't2',
        speaker: 'B',
        text: 'Admittedly, AI streamlines repetitive tasks, yet human empathy and creativity remain completely irreplaceable.',
        intonationText: 'Adˈmittedly, ↗ / AI ˈstreamlines reˈpetitive ˈtasks, ↗ / yet ˈhuman ˈempathy and creˈativity reˈmain ˌirreˈplaceable. ↘',
        meaningEn: 'Band 8.0+ concession-and-contrast structure.',
        meaningVi: 'Phải thừa nhận AI tối ưu hóa việc lặp lại, nhưng sự thấu cảm và sáng tạo của con người là không thể thay thế.',
        mouthTipEn: 'Pause cleanly after "Admittedly", stress "re-PET-i-tive" and "irre-PLACE-a-ble".',
        mouthTipVi: 'Ngắt nhịp sau "Admittedly", nhấn "re-PET-i-tive" và "irre-PLACE-a-ble".'
      },
      {
        id: 't3',
        speaker: 'A',
        text: 'How should universities adapt their curriculum to prepare graduates for this transition?',
        intonationText: 'ˈHow should uniˈversities aˈdapt their curˈriculum ↗ / to preˈpare ˈgraduates for ˈthis tranˈsition? ↘',
        meaningEn: 'Asking for policy/educational solutions.',
        meaningVi: 'Các trường đại học nên điều chỉnh chương trình học thế nào để chuẩn bị cho sinh viên?',
        mouthTipEn: 'Pronounce "curriculum" as /kəˈrɪk.jə.ləm/ and "graduates" with /dʒ/.',
        mouthTipVi: 'Đọc rõ "cur-RIC-u-lum" và âm /dʒ/ trong "graduates".'
      },
      {
        id: 't4',
        speaker: 'B',
        text: 'Universities ought to prioritize critical thinking, ethical reasoning, and lifelong digital literacy.',
        intonationText: 'Uniˈversities ˈought to priˈoritize ˈcritical ˈthinking, ↗ / ˈethical ˈreasoning, ↗ / and ˈlifelong ˈdigital ˈliteracy. ↘',
        meaningEn: 'Band 8.0 academic recommendation using "ought to prioritize".',
        meaningVi: 'Đại học nên ưu tiên tư duy phản biện, lập luận đạo đức và năng lực số suốt đời.',
        mouthTipEn: 'Stress "pri-OR-i-tize" and pronounce /θ/ in "ethical" and "thinking".',
        mouthTipVi: 'Nhấn "pri-OR-i-tize" và đọc chuẩn /θ/ trong "ethical" và "thinking".'
      },
      {
        id: 't5',
        speaker: 'A',
        text: 'Should governments regulate how companies deploy automated systems in the workplace?',
        intonationText: 'Should ˈgovernments ˈregulate ↗ / how ˈcompanies deˈploy ˈautomated ˈsystems in the ˈworkplace? ↗',
        meaningEn: 'Testing regulatory perspective.',
        meaningVi: 'Chính phủ có nên quản lý chặt việc doanh nghiệp triển khai hệ thống tự động hóa không?',
        mouthTipEn: 'Keep "governments" to 3 syllables (/ˈɡʌv.ən.mənts/) without over-pronouncing the middle n.',
        mouthTipVi: 'Đọc "governments" gọn 3 âm tiết (/ˈɡʌv.ən.mənts/).'
      },
      {
        id: 't6',
        speaker: 'B',
        text: 'Yes, transparent regulations are essential to prevent algorithmic bias and protect workers.',
        intonationText: 'ˈYes, ↘ / transˈparent reguˈlations are eˈssential ↗ / to preˈvent algoˈrithmic ˈbias and proˈtect ˈworkers. ↘',
        meaningEn: 'Concise policy stance with C1-C2 collocations.',
        meaningVi: 'Có, quy định minh bạch rất thiết yếu để ngăn thiên lệch thuật toán và bảo vệ người lao động.',
        mouthTipEn: 'Stress "trans-PAR-ent" and "algo-RITH-mic" (/ð/ sound).',
        mouthTipVi: 'Nhấn "trans-PAR-ent" và đọc rõ âm /ð/ ở "algo-RITH-mic".'
      }
    ]
  },
  {
    id: 'conv-ielts-p3-tourism',
    track: 'ielts',
    bandLevel: '8.0',
    titleEn: 'IELTS Part 3: Sustainable Tourism & Ecology',
    titleVi: 'IELTS Part 3: Du Lịch Bền Vững & Sinh Thái',
    contextEn: 'Debating the economic benefits of mass tourism versus environmental preservation.',
    contextVi: 'Tranh luận về lợi ích kinh tế của du lịch đại trà và bảo tồn hệ sinh thái.',
    roles: {
      A: { nameEn: 'Examiner', nameVi: 'Giám khảo IELTS', avatar: '🎓' },
      B: { nameEn: 'Candidate', nameVi: 'Thí sinh', avatar: '🎙️' }
    },
    defaultUserRole: 'B',
    xpReward: 115,
    turns: [
      {
        id: 't1',
        speaker: 'A',
        text: 'Why do so many developing regions rely heavily on international tourism for economic growth?',
        intonationText: 'ˈWhy do ˈso many deˈveloping ˈregions ↗ / reˈly ˈheavily on interˈnational ˈtourism ↗ / for ecoˈnomic ˈgrowth? ↘',
        meaningEn: 'Exploring economic drivers of tourism.',
        meaningVi: 'Vì sao nhiều khu vực đang phát triển lại phụ thuộc nhiều vào du lịch quốc tế?',
        mouthTipEn: 'Pronounce /θ/ cleanly at the end of "growth".',
        mouthTipVi: 'Thổi nhẹ âm /θ/ ở cuối từ "growth".'
      },
      {
        id: 't2',
        speaker: 'B',
        text: 'Because tourism generates immediate employment and encourages investment in local transport infrastructure.',
        intonationText: 'Because ˈtourism ˈgenerates imˈmediate emˈployment ↗ / and enˈcourages inˈvestment in ˈlocal ˈtransport ˈinfrastructure. ↘',
        meaningEn: 'Clear causal explanation with strong academic verbs.',
        meaningVi: 'Vì du lịch tạo ra việc làm tức thì và thúc đẩy đầu tư vào hạ tầng giao thông địa phương.',
        mouthTipEn: 'Stress "im-ME-di-ate" and "en-COUR-a-ges" (/ɪnˈkʌr.ɪdʒ.ɪz/).',
        mouthTipVi: 'Nhấn "im-ME-di-ate" và đọc rõ đuôi /-ɪz/ ở "encourages".'
      },
      {
        id: 't3',
        speaker: 'A',
        text: 'However, what happens when popular destinations attract far more visitors than they can handle?',
        intonationText: 'Howˈever, ↗ / ˈwhat ˈhappens when ˈpopular destiˈnations ↗ / atˈtract ˈfar more ˈvisitors than they can ˈhandle? ↘',
        meaningEn: 'Probing negative consequences of overtourism.',
        meaningVi: 'Tuy nhiên, điều gì xảy ra khi điểm đến thu hút quá nhiều du khách vượt sức chứa?',
        mouthTipEn: 'Stress "desti-NA-tions" and link "far more" smoothly.',
        mouthTipVi: 'Nhấn "desti-NA-tions" và nối mượt "far more".'
      },
      {
        id: 't4',
        speaker: 'B',
        text: 'Unless strict regulations are enforced, irresponsible tourism could irreversibly damage fragile ecosystems.',
        intonationText: 'Unˈless ˈstrict reguˈlations are enˈforced, ↗ / irreˈsponsible ˈtourism could irreˈversibly ˈdamage ˈfragile ˈecosystems. ↘',
        meaningEn: 'Band 8.5 conditional warning with advanced adverbial control.',
        meaningVi: 'Nếu không thực thi quy định nghiêm ngặt, du lịch thiếu trách nhiệm có thể hủy hoại vĩnh viễn hệ sinh thái mỏng manh.',
        mouthTipEn: 'Stress "-SPON-" in "irresponsible", "-VER-" in "irreversibly", and finish on /z/ in "ecosystems".',
        mouthTipVi: 'Nhấn "-SPON-" trong "irresponsible", "-VER-" trong "irreversibly" và bật /z/ cuối "ecosystems".'
      },
      {
        id: 't5',
        speaker: 'A',
        text: 'Do you think limiting daily visitor numbers is a realistic solution?',
        intonationText: 'Do you ˈthink ˈlimiting ˈdaily ˈvisitor ˈnumbers ↗ / is a reaˈlistic soˈlution? ↗',
        meaningEn: 'Evaluating practicality of visitor caps.',
        meaningVi: 'Bạn có nghĩ giới hạn lượng khách mỗi ngày là giải pháp khả thi không?',
        mouthTipEn: 'Stress "rea-LIS-tic" and "so-LU-tion".',
        mouthTipVi: 'Nhấn "rea-LIS-tic" và "so-LU-tion".'
      },
      {
        id: 't6',
        speaker: 'B',
        text: 'Yes, especially when paired with eco-taxes that fund conservation and community education.',
        intonationText: 'ˈYes, ↘ / eˈspecially when ˈpaired with ˈeco-taxes ↗ / that ˈfund conserˈvation and comˈmunity eduˈcation. ↘',
        meaningEn: 'Pragmatic policy synthesis.',
        meaningVi: 'Có, đặc biệt khi kết hợp thuế sinh thái để tài trợ cho bảo tồn và giáo dục cộng đồng.',
        mouthTipEn: 'Pronounce /-ɪz/ in "taxes" and stress "conser-VA-tion".',
        mouthTipVi: 'Đọc rõ đuôi /-ɪz/ ở "taxes" và nhấn "conser-VA-tion".'
      }
    ]
  },

  // =========================================================================
  // TRACK 3: WORKPLACE & ACADEMIC (4 Scenarios)
  // =========================================================================
  {
    id: 'conv-acad-tutor',
    track: 'academic',
    bandLevel: '7.5',
    titleEn: 'University Tutor: Research Feedback',
    titleVi: 'Gặp Giảng Viên Hướng Dẫn Nghiên Cứu',
    contextEn: 'Cambridge Listening Section 3 style tutorial reviewing dissertation methodology.',
    contextVi: 'Buổi trao đổi học thuật kiểu Listening Section 3 về phương pháp nghiên cứu luận văn.',
    roles: {
      A: { nameEn: 'Dr. Evans (Tutor)', nameVi: 'TS. Evans (GVHD)', avatar: '👨‍🏫' },
      B: { nameEn: 'Research Student', nameVi: 'Sinh viên nghiên cứu', avatar: '📚' }
    },
    defaultUserRole: 'B',
    xpReward: 110,
    turns: [
      {
        id: 't1',
        speaker: 'A',
        text: 'Come in! I have read your draft methodology chapter. Overall, the research question is very focused.',
        intonationText: 'Come ˈin! ↘ / I have ˈread your ˈdraft methodˈology ˈchapter. ↘ / Overˈall, ↗ / the ˈresearch ˈquestion is ˈvery ˈfocused. ↘',
        meaningEn: 'Opening tutorial with positive validation.',
        meaningVi: 'Mời vào! Tôi đã đọc bản nháp chương phương pháp của bạn. Nhìn chung câu hỏi nghiên cứu rất trọng tâm.',
        mouthTipEn: 'Stress "meth-o-DOL-o-gy" on the third syllable and pronounce "read" as /red/.',
        mouthTipVi: 'Nhấn âm 3 của "meth-o-DOL-o-gy" và đọc "read" quá khứ là /red/.'
      },
      {
        id: 't2',
        speaker: 'B',
        text: 'Thank you, Dr. Evans. Did you feel my survey sample size was sufficient for statistical analysis?',
        intonationText: 'ˈThank you, Doctor ˈEvans. ↘ / Did you ˈfeel my ˈsurvey ˈsample ˈsize ↗ / was suˈfficient for staˈtistical aˈnalysis? ↗',
        meaningEn: 'Asking targeted feedback on sample adequacy.',
        meaningVi: 'Cảm ơn thầy Evans. Thầy có thấy cỡ mẫu khảo sát của em đủ để phân tích thống kê chưa ạ?',
        mouthTipEn: 'Stress "suf-FI-cient" (/səˈfɪʃ.ənt/) and "a-NAL-y-sis".',
        mouthTipVi: 'Nhấn "suf-FI-cient" (/səˈfɪʃ.ənt/) và "a-NAL-y-sis".'
      },
      {
        id: 't3',
        speaker: 'A',
        text: 'Actually, eighty responses is slightly narrow. Adding twenty interviews would strengthen your validity.',
        intonationText: 'ˈActually, ↗ / ˈeighty reˈsponses is ˈslightly ˈnarrow. ↘ / ˈAdding ˈtwenty ˈinterviews ↗ / would ˈstrengthen your vaˈlidity. ↘',
        meaningEn: 'Suggesting mixed-methods triangulation.',
        meaningVi: 'Thực ra 80 phản hồi hơi hẹp. Bổ sung thêm 20 cuộc phỏng vấn sẽ tăng độ tin cậy.',
        mouthTipEn: 'Stress "va-LID-i-ty" and pronounce /θ/ in "strengthen".',
        mouthTipVi: 'Nhấn "va-LID-i-ty" và bật nhẹ /θ/ trong "strengthen".'
      },
      {
        id: 't4',
        speaker: 'B',
        text: 'That makes complete sense. Should I prioritize undergraduate students or recent alumni for those interviews?',
        intonationText: 'That ˈmakes comˈplete ˈsense. ↘ / Should I priˈoritize underˈgraduate ˈstudents ↗ / or ˈrecent aˈlumni for those ˈinterviews? ↘',
        meaningEn: 'Clarifying participant sampling strategy.',
        meaningVi: 'Rất hợp lý ạ. Em nên ưu tiên phỏng vấn sinh viên đại học hay cựu sinh viên mới ra trường?',
        mouthTipEn: 'Pronounce "alumni" as /əˈlʌm.naɪ/ and "recent" as /ˈriː.sənt/.',
        mouthTipVi: 'Đọc "alumni" là /əˈlʌm.naɪ/ và nhấn âm đầu "RE-cent".'
      },
      {
        id: 't5',
        speaker: 'A',
        text: 'Focus on recent alumni, because they can reflect objectively on how coursework translated into workplace skills.',
        intonationText: 'ˈFocus on ˈrecent aˈlumni, ↗ / because they can reˈflect obˈjectively ↗ / on how ˈcoursework transˈlated into ˈworkplace ˈskills. ↘',
        meaningEn: 'Explaining rationale behind sampling choice.',
        meaningVi: 'Hãy tập trung vào cựu sinh viên mới tốt nghiệp, vì họ có góc nhìn khách quan về việc áp dụng kiến thức vào công việc.',
        mouthTipEn: 'Stress "ob-JEC-tive-ly" and "trans-LA-ted".',
        mouthTipVi: 'Nhấn "ob-JEC-tive-ly" và "trans-LA-ted".'
      },
      {
        id: 't6',
        speaker: 'B',
        text: 'Understood. I will revise the ethics form this week and submit the updated schedule on Friday.',
        intonationText: 'Underˈstood. ↘ / I will reˈvise the ˈethics ˈform this ˈweek ↗ / and subˈmit the upˈdated ˈschedule on ˈFriday. ↘',
        meaningEn: 'Committing to concrete next steps and deadline.',
        meaningVi: 'Em đã rõ. Tuần này em sẽ sửa lại biểu mẫu đạo đức nghiên cứu và nộp lịch trình cập nhật vào thứ Sáu.',
        mouthTipEn: 'Use either UK /ˈʃed.juːl/ or US /ˈskedʒ.uːl/ consistently for "schedule".',
        mouthTipVi: 'Đọc nhất quán "schedule" theo Anh-Anh (/ˈʃed.juːl/) hoặc Anh-Mỹ (/ˈskedʒ.uːl/).'
      }
    ]
  },
  {
    id: 'conv-acad-interview',
    track: 'academic',
    bandLevel: '7.5',
    titleEn: 'Job Interview: Strengths & Pressure',
    titleVi: 'Phỏng Vấn Việc Làm: Điểm Mạnh & Áp Lực',
    contextEn: 'Answering behavioral interview questions for an international analyst role.',
    contextVi: 'Trả lời phỏng vấn hành vi cho vị trí chuyên viên phân tích tại công ty quốc tế.',
    roles: {
      A: { nameEn: 'Hiring Manager', nameVi: 'Quản lý tuyển dụng', avatar: '💼' },
      B: { nameEn: 'Applicant', nameVi: 'Ứng viên', avatar: '👔' }
    },
    defaultUserRole: 'B',
    xpReward: 110,
    turns: [
      {
        id: 't1',
        speaker: 'A',
        text: 'Thanks for joining us today. Could you briefly describe a project where you demonstrated strong resilience?',
        intonationText: 'ˈThanks for ˈjoining us toˈday. ↘ / Could you ˈbriefly deˈscribe a ˈproject ↗ / where you ˈdemonstrated ˈstrong reˈsilience? ↘',
        meaningEn: 'Behavioral interview prompt on resilience.',
        meaningVi: 'Cảm ơn bạn đã tham gia hôm nay. Bạn có thể mô tả ngắn gọn một dự án bạn đã thể hiện sự kiên cường không?',
        mouthTipEn: 'Vibrate /z/ in "re-SIL-ience" (/rɪˈzɪl.i.əns/).',
        mouthTipVi: 'Rung âm /z/ trong "re-SIL-ience" (/rɪˈzɪl.i.əns/).'
      },
      {
        id: 't2',
        speaker: 'B',
        text: 'Last quarter, our team faced an unexpected server outage just forty-eight hours before a major launch.',
        intonationText: 'ˈLast ˈquarter, ↗ / our ˈteam ˈfaced an unexˈpected ˈserver ˈoutage ↗ / just ˈforty-eight ˈhours before a ˈmajor ˈlaunch. ↘',
        meaningEn: 'Setting the STAR situation clearly.',
        meaningVi: 'Quý trước, nhóm tôi gặp sự cố sập máy chủ bất ngờ chỉ 48 giờ trước ngày ra mắt lớn.',
        mouthTipEn: 'Silent "h" in "hours" (/ˈaʊərz/) and clear /tʃ/ in "launch".',
        mouthTipVi: 'Âm "h" câm trong "hours" (/ˈaʊərz/) và bật rõ /tʃ/ cuối "launch".'
      },
      {
        id: 't3',
        speaker: 'A',
        text: 'That sounds stressful. How did you coordinate with colleagues under such a tight deadline?',
        intonationText: 'That ˈsounds ˈstressful. ↘ / ˈHow did you coˈordinate with ˈcolleagues ↗ / under ˈsuch a ˈtight ˈdeadline? ↘',
        meaningEn: 'Probing teamwork and coordination action.',
        meaningVi: 'Nghe căng thẳng đấy. Bạn đã phối hợp với đồng nghiệp thế nào dưới áp lực thời gian như vậy?',
        mouthTipEn: 'Stretch long /iː/ in "colleagues" (/ˈkɒl.iːɡz/) so it does not sound like "college".',
        mouthTipVi: 'Kéo dài âm /iː/ trong "colleagues" để tránh nhầm với "college".'
      },
      {
        id: 't4',
        speaker: 'B',
        text: 'I divided the recovery tasks into clear milestones and kept stakeholders updated every two hours.',
        intonationText: 'I diˈvided the reˈcovery ˈtasks into ˈclear ˈmilestones ↗ / and ˈkept ˈstakeholders upˈdated every ˈtwo ˈhours. ↘',
        meaningEn: 'Explaining structured ownership and communication.',
        meaningVi: 'Tôi chia nhỏ các đầu việc khắc phục theo từng mốc rõ ràng và cập nhật cho các bên liên quan mỗi hai giờ.',
        mouthTipEn: 'Pronounce "stakeholders" and "milestones" with clear plural /z/ endings.',
        mouthTipVi: 'Bật rõ âm /z/ cuối trong "milestones" và "stakeholders".'
      },
      {
        id: 't5',
        speaker: 'A',
        text: 'Impressive! What was the final outcome of that launch?',
        intonationText: 'Imˈpressive! ↘ / ˈWhat was the ˈfinal ˈoutcome of that ˈlaunch? ↘',
        meaningEn: 'Asking for the STAR result.',
        meaningVi: 'Ấn tượng đấy! Kết quả cuối cùng của đợt ra mắt đó thế nào?',
        mouthTipEn: 'Stress "im-PRES-sive" on the second syllable.',
        mouthTipVi: 'Nhấn âm 2 của "im-PRES-sive".'
      },
      {
        id: 't6',
        speaker: 'B',
        text: 'We launched on schedule with zero downtime and improved our client retention rate by twelve percent.',
        intonationText: 'We ˈlaunched on ˈschedule with ˈzero ˈdowntime ↗ / and imˈproved our ˈclient reˈtention ˈrate by ˈtwelve perˈcent. ↘',
        meaningEn: 'Quantified STAR result.',
        meaningVi: 'Chúng tôi ra mắt đúng tiến độ với 0 phút gián đoạn và tăng tỷ lệ giữ chân khách hàng thêm 12%.',
        mouthTipEn: 'Pronounce /t/ in "launched" (/lɔːntʃt/) and stress "re-TEN-tion".',
        mouthTipVi: 'Bật nhẹ /t/ cuối "launched" và nhấn "re-TEN-tion".'
      }
    ]
  },
  {
    id: 'conv-acad-standup',
    track: 'academic',
    bandLevel: '7.5',
    titleEn: 'Project Standup & Scope Negotiation',
    titleVi: 'Họp Tiến Độ Dự Án & Đàm Phán Phạm Vi',
    contextEn: 'Negotiating feature scope politely during an international product standup meeting.',
    contextVi: 'Đàm phán phạm vi công việc khéo léo trong cuộc họp tiến độ dự án quốc tế.',
    roles: {
      A: { nameEn: 'Product Lead', nameVi: 'Trưởng nhóm sản phẩm', avatar: '📊' },
      B: { nameEn: 'Team Member', nameVi: 'Thành viên dự án', avatar: '💻' }
    },
    defaultUserRole: 'B',
    xpReward: 115,
    turns: [
      {
        id: 't1',
        speaker: 'A',
        text: 'Morning everyone. Can we squeeze the analytics dashboard into Friday’s release as well?',
        intonationText: 'ˈMorning everyone. ↘ / Can we ˈsqueeze the anaˈlytics ˈdashboard ↗ / into ˈFriday’s reˈlease as ˈwell? ↗',
        meaningEn: 'Requesting extra scope before the deadline.',
        meaningVi: 'Chào cả nhà. Mình có thể nhồi thêm bảng phân tích vào bản phát hành thứ Sáu này luôn không?',
        mouthTipEn: 'Stress "ana-LYT-ics" and pronounce "dashboard" clearly.',
        mouthTipVi: 'Nhấn âm 3 của "ana-LYT-ics" và đọc rõ "dashboard".'
      },
      {
        id: 't2',
        speaker: 'B',
        text: 'On the face of it, that sounds tempting, yet rushing it could compromise overall stability.',
        intonationText: 'On the ˈface of it, ↗ / that ˈsounds ˈtempting, ↗ / yet ˈrushing it could ˈcompromise overˈall staˈbility. ↘',
        meaningEn: 'Polite concession and risk-based pushback.',
        meaningVi: 'Nghe qua thì rất hấp dẫn, nhưng làm vội có thể ảnh hưởng đến độ ổn định chung của hệ thống.',
        mouthTipEn: 'Stress "COM-pro-mise" (/ˈkɒm.prə.maɪz/) on the first syllable and "sta-BIL-i-ty".',
        mouthTipVi: 'Nhấn âm đầu "COM-pro-mise" và nhấn "sta-BIL-i-ty".'
      },
      {
        id: 't3',
        speaker: 'A',
        text: 'That is a fair point. What would be a realistic alternative for this sprint?',
        intonationText: 'That is a ˈfair ˈpoint. ↘ / ˈWhat would be a reaˈlistic alˈternative for ˈthis ˈsprint? ↘',
        meaningEn: 'Validating concern and asking for a compromise.',
        meaningVi: 'Ý kiến xác đáng đấy. Vậy phương án thay thế khả thi cho tuần này là gì?',
        mouthTipEn: 'Stress "al-TER-na-tive" on the second syllable.',
        mouthTipVi: 'Nhấn âm 2 của "al-TER-na-tive".'
      },
      {
        id: 't4',
        speaker: 'B',
        text: 'We can ship the core payment flow on Friday and schedule the dashboard for next Wednesday.',
        intonationText: 'We can ˈship the ˈcore ˈpayment ˈflow on ˈFriday ↗ / and ˈschedule the ˈdashboard for ˈnext ˈWednesday. ↘',
        meaningEn: 'Proposing phased delivery.',
        meaningVi: 'Mình có thể phát hành luồng thanh toán cốt lõi vào thứ Sáu và hẹn bảng phân tích sang thứ Tư tới.',
        mouthTipEn: 'Silent "d" in "Wednesday" (/ˈwenz.deɪ/) — two syllables only.',
        mouthTipVi: 'Chữ "d" đầu trong "Wednesday" câm (/ˈwenz.deɪ/), chỉ đọc 2 âm tiết.'
      },
      {
        id: 't5',
        speaker: 'A',
        text: 'Agreed. Please document that timeline so the client team stays aligned.',
        intonationText: 'Aˈgreed. ↘ / Please ˈdocument that ˈtimeline ↗ / so the ˈclient ˈteam stays aˈligned. ↘',
        meaningEn: 'Approving proposal and requesting documentation.',
        meaningVi: 'Đồng ý. Bạn ghi lại mốc thời gian đó để phía khách hàng nắm đồng bộ nhé.',
        mouthTipEn: 'As a verb, stress "DOC-u-ment" on the first syllable.',
        mouthTipVi: 'Động từ "document" nhấn âm đầu: DOC-u-ment.'
      },
      {
        id: 't6',
        speaker: 'B',
        text: 'Will do! I will send a concise summary right after this meeting.',
        intonationText: 'ˈWill ˈdo! ↘ / I will ˈsend a conˈcise ˈsummary ↗ / ˈright after this ˈmeeting. ↘',
        meaningEn: 'Confirming immediate follow-through.',
        meaningVi: 'Rõ ạ! Tôi sẽ gửi bản tóm tắt ngắn gọn ngay sau cuộc họp này.',
        mouthTipEn: 'Stress "con-CISE" on the second syllable and "SUM-ma-ry" on the first.',
        mouthTipVi: 'Nhấn "con-CISE" ở âm 2 và "SUM-ma-ry" ở âm 1.'
      }
    ]
  },
  {
    id: 'conv-acad-pitch',
    track: 'academic',
    bandLevel: '8.0',
    titleEn: 'Client Pitch & Evidence Q&A',
    titleVi: 'Thuyết Trình Khách Hàng & Hỏi Đáp Số Liệu',
    contextEn: 'Presenting sustainability ROI metrics to an executive client and handling skeptical questions.',
    contextVi: 'Trình bày hiệu quả đầu tư bền vững trước khách hàng doanh nghiệp và giải đáp câu hỏi phản biện.',
    roles: {
      A: { nameEn: 'Executive Client', nameVi: 'Khách hàng điều hành', avatar: '🏛️' },
      B: { nameEn: 'Consultant', nameVi: 'Chuyên viên tư vấn', avatar: '📈' }
    },
    defaultUserRole: 'B',
    xpReward: 120,
    turns: [
      {
        id: 't1',
        speaker: 'B',
        text: 'Our pilot data indicates that switching to renewable packaging cuts logistics waste by thirty percent.',
        intonationText: 'Our ˈpilot ˈdata ˈindicates ↗ / that ˈswitching to reˈnewable ˈpackaging ↗ / cuts loˈgistics ˈwaste by ˈthirty perˈcent. ↘',
        meaningEn: 'Opening pitch with concrete pilot metrics.',
        meaningVi: 'Dữ liệu thử nghiệm cho thấy chuyển sang bao bì tái tạo giúp giảm 30% rác thải vận chuyển.',
        mouthTipEn: 'Stress "re-NEW-a-ble" and "lo-GIS-tics" (/ləˈdʒɪs.tɪks/).',
        mouthTipVi: 'Nhấn "re-NEW-a-ble" và "lo-GIS-tics" (/ləˈdʒɪs.tɪks/).'
      },
      {
        id: 't2',
        speaker: 'A',
        text: 'Those numbers look promising, but will the upfront material costs significantly erode our profit margins?',
        intonationText: 'Those ˈnumbers look ˈpromising, ↗ / but will the ˈupfront maˈterial ˈcosts ↗ / sigˈnificantly eˈrode our ˈprofit ˈmargins? ↗',
        meaningEn: 'Challenging financial feasibility.',
        meaningVi: 'Số liệu rất hứa hẹn, nhưng chi phí vật liệu ban đầu có làm bào mòn biên lợi nhuận không?',
        mouthTipEn: 'Stress "e-RODE" and "ma-TE-ri-al".',
        mouthTipVi: 'Nhấn "e-RODE" và "ma-TE-ri-al".'
      },
      {
        id: 't3',
        speaker: 'B',
        text: 'Initially, unit costs rise slightly, yet bulk procurement offsets that difference within six months.',
        intonationText: 'Iˈnitially, ↗ / ˈunit ˈcosts ˈrise ˈslightly, ↗ / yet ˈbulk proˈcurement ˈoffsets that ˈdifference within ˈsix ˈmonths. ↘',
        meaningEn: 'Addressing cost concern with break-even timeline.',
        meaningVi: 'Ban đầu chi phí đơn vị tăng nhẹ, nhưng thu mua số lượng lớn sẽ bù đắp chênh lệch trong 6 tháng.',
        mouthTipEn: 'Pronounce "initially" (/ɪˈnɪʃ.əl.i/) and "months" (/mʌnθs/) clearly.',
        mouthTipVi: 'Đọc rõ âm /ʃ/ trong "initially" và cụm /-nθs/ ở "months".'
      },
      {
        id: 't4',
        speaker: 'A',
        text: 'And how reliable is your supplier network during peak seasonal demand?',
        intonationText: 'And ˈhow reˈliable is your supˈplier ˈnetwork ↗ / during ˈpeak ˈseasonal deˈmand? ↘',
        meaningEn: 'Testing supply-chain resilience.',
        meaningVi: 'Mạng lưới nhà cung cấp của bạn đáng tin cậy thế nào vào mùa cao điểm?',
        mouthTipEn: 'Stress "re-LI-a-ble" and "SEA-son-al".',
        mouthTipVi: 'Nhấn "re-LI-a-ble" và "SEA-son-al".'
      },
      {
        id: 't5',
        speaker: 'B',
        text: 'We partner with three certified regional manufacturers, so there is no single point of failure.',
        intonationText: 'We ˈpartner with ˈthree ˈcertified ˈregional manuˈfacturers, ↗ / so there is ˈno ˈsingle ˈpoint of ˈfailure. ↘',
        meaningEn: 'Demonstrating redundancy and risk mitigation.',
        meaningVi: 'Chúng tôi hợp tác với ba nhà sản xuất khu vực đạt chuẩn nên không bị phụ thuộc một nguồn duy nhất.',
        mouthTipEn: 'Stress "CER-ti-fied" and "manu-FAC-tur-ers".',
        mouthTipVi: 'Nhấn "CER-ti-fied" và "manu-FAC-tur-ers".'
      },
      {
        id: 't6',
        speaker: 'A',
        text: 'That gives us real confidence. Let us schedule a technical review with our operations director.',
        intonationText: 'That ˈgives us ˈreal ˈconfidence. ↘ / Let us ˈschedule a ˈtechnical reˈview ↗ / with our opeˈrations diˈrector. ↘',
        meaningEn: 'Advancing to next deal stage.',
        meaningVi: 'Điều đó tạo cho chúng tôi sự tin tưởng lớn. Hãy hẹn một buổi rà soát kỹ thuật với giám đốc vận hành.',
        mouthTipEn: 'Stress "CON-fi-dence" on the first syllable and "ope-RA-tions".',
        mouthTipVi: 'Nhấn "CON-fi-dence" ở âm đầu và "ope-RA-tions".'
      }
    ]
  }
];

/**
 * Generates simple intonation/linking markup for custom user-created turns.
 */
function buildAutoIntonation(text) {
  return String(text || '')
    .trim()
    .replace(/,\s+/g, ', ↗ / ')
    .replace(/\s+(because|although|while|whereas|yet|and|but|so)\s+/gi, ' / $1 ')
    .replace(/([.!?])?$/, (m) => `${m || ''} ${m === '?' ? '↗' : '↘'}`);
}

/**
 * Parses pasted dialogue lines like:
 * A: Hello!
 * B: Hi there!
 */
export function parseRawDialogueLines(rawScript = '') {
  const lines = String(rawScript || '')
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  const turns = [];
  lines.forEach((line, idx) => {
    const match = line.match(/^(A|B|Speaker\s*A|Speaker\s*B|Examiner|Candidate|Host|Guest|1|2)\s*:\s*(.+)$/i);
    let speaker = idx % 2 === 0 ? 'A' : 'B';
    let text = line;

    if (match) {
      const label = match[1].toLowerCase();
      speaker =
        label === 'b' ||
        label.includes('b') ||
        label === 'candidate' ||
        label === 'guest' ||
        label === '2'
          ? 'B'
          : 'A';
      text = match[2].trim();
    }

    if (!text) return;
    turns.push({
      id: `ct-${idx + 1}`,
      speaker,
      text,
      intonationText: buildAutoIntonation(text),
      meaningEn: '',
      meaningVi: '',
      mouthTipEn: 'Articulate ending consonants clearly and follow natural thought-group pauses.',
      mouthTipVi: 'Bật rõ phụ âm cuối và ngắt nhịp tự nhiên theo cụm từ.'
    });
  });

  return turns;
}

/**
 * Builds a custom conversation scenario (100% offline capable).
 */
export function buildCustomConversation({
  title = '',
  track = 'daily',
  bandLevel = '7.0',
  context = '',
  roleAName = 'Partner',
  roleBName = 'You',
  rawScript = '',
  turns: providedTurns = null
}) {
  const parsedTurns = Array.isArray(providedTurns) && providedTurns.length > 0
    ? providedTurns.map((t, i) => ({
        id: t.id || `ct-${i + 1}`,
        speaker: t.speaker === 'A' ? 'A' : 'B',
        text: String(t.text || '').trim(),
        intonationText: t.intonationText || buildAutoIntonation(t.text || ''),
        meaningEn: t.meaningEn || '',
        meaningVi: t.meaningVi || '',
        mouthTipEn: t.mouthTipEn || buildCustomPronunciationDrill({ text: t.text || '' }).mouthTipEn,
        mouthTipVi: t.mouthTipVi || buildCustomPronunciationDrill({ text: t.text || '' }).mouthTipVi
      })).filter(t => t.text.length > 0)
    : parseRawDialogueLines(rawScript);

  const cleanTitle = String(title || '').trim() || 'Custom Conversation';
  const cleanContext = String(context || '').trim() || 'Custom interactive roleplay dialogue.';
  const resolvedTrack = ['daily', 'ielts', 'academic'].includes(track) ? track : 'daily';

  return {
    id: `conv-custom-${Date.now()}`,
    track: resolvedTrack,
    bandLevel: String(bandLevel || '7.0'),
    titleEn: cleanTitle,
    titleVi: cleanTitle,
    contextEn: cleanContext,
    contextVi: cleanContext,
    roles: {
      A: { nameEn: roleAName || 'Partner', nameVi: roleAName || 'Đối thoại', avatar: '🗣️' },
      B: { nameEn: roleBName || 'You', nameVi: roleBName || 'Bạn', avatar: '🎙️' }
    },
    defaultUserRole: 'B',
    xpReward: Math.max(40, parsedTurns.filter(t => t.speaker === 'B').length * 20),
    isCustom: true,
    turns: parsedTurns
  };
}

/**
 * Evaluates one user turn against the active pass threshold (default 75%).
 */
export function evaluateConversationTurn({
  targetText = '',
  spokenText = '',
  confidence = 0.88,
  streak = 0,
  alternatives = [],
  acousticMetrics = null,
  threshold = CONVERSATION_DEFAULT_THRESHOLD
}) {
  const wordCount = String(targetText || '').trim().split(/\s+/).filter(Boolean).length;
  const itemType = wordCount <= 1 ? 'words' : wordCount <= 5 ? 'phrases' : 'sentences';

  const baseEval = evaluatePronunciationAttempt({
    targetText,
    spokenText,
    confidence,
    itemType,
    streak,
    alternatives,
    acousticMetrics
  });

  const safeThreshold = Number(threshold) || CONVERSATION_DEFAULT_THRESHOLD;
  const isPassed = baseEval.overallAccuracy >= safeThreshold;

  return {
    ...baseEval,
    spokenTranscript: String(spokenText || '').trim(),
    threshold: safeThreshold,
    isPassed
  };
}

/**
 * Extracts unique struggled words (accuracy < 84% / status !== 'correct') across completed turns.
 */
export function extractStruggledWordsFromSession(turnResults = {}) {
  const wordMap = new Map();

  Object.values(turnResults || {}).forEach((res) => {
    if (!res || !Array.isArray(res.wordBreakdown)) return;
    res.wordBreakdown.forEach((wb) => {
      const clean = String(wb.cleanWord || wb.word || '').trim().toLowerCase();
      if (!clean || clean.length < 3) return;
      if (wb.status === 'correct' && wb.similarity >= 84) return;

      const prev = wordMap.get(clean);
      if (!prev || wb.similarity < prev.similarity) {
        wordMap.set(clean, {
          word: wb.word.replace(/[.,!?;:"'()]/g, ''),
          cleanWord: clean,
          similarity: wb.similarity,
          status: wb.status,
          missingCoda: Boolean(wb.missingCoda)
        });
      }
    });
  });

  return Array.from(wordMap.values()).sort((a, b) => a.similarity - b.similarity);
}

/**
 * Summarizes a completed conversation session (avg accuracy, band, first-try pass rate, XP).
 */
export function summarizeConversationSession({
  scenario,
  userRole = 'B',
  turnResults = {},
  turnAttempts = {}
}) {
  const userTurns = (scenario?.turns || []).filter(t => t.speaker === userRole);
  const completedResults = userTurns
    .map(t => ({ turn: t, res: turnResults[t.id], attempts: turnAttempts[t.id] || 1 }))
    .filter(item => Boolean(item.res));

  const scoredItems = completedResults.filter(item => !item.res.skipped);
  const avgAccuracy = scoredItems.length > 0
    ? Math.round(scoredItems.reduce((sum, item) => sum + (item.res.overallAccuracy || 0), 0) / scoredItems.length)
    : 0;

  const firstTryCount = scoredItems.filter(item => item.attempts <= 1 && item.res.isPassed).length;
  const firstTryRate = scoredItems.length > 0
    ? Math.round((firstTryCount / scoredItems.length) * 100)
    : 0;

  let estimatedBand = '5.0';
  if (avgAccuracy >= 93) estimatedBand = '8.5';
  else if (avgAccuracy >= 86) estimatedBand = '8.0';
  else if (avgAccuracy >= 79) estimatedBand = '7.5';
  else if (avgAccuracy >= 72) estimatedBand = '7.0';
  else if (avgAccuracy >= 64) estimatedBand = '6.5';
  else if (avgAccuracy >= 55) estimatedBand = '6.0';
  else if (avgAccuracy >= 40) estimatedBand = '5.5';

  const trackMeta = CONVERSATION_TRACKS.find(tr => tr.id === scenario?.track) || CONVERSATION_TRACKS[1];
  const bonusXp = scoredItems.length > 0 && scoredItems.length === userTurns.length
    ? trackMeta.completionBonusXp
    : 0;

  const totalXp = scoredItems.reduce((sum, item) => sum + (item.res.xpEarned || 0), 0) + bonusXp;
  const struggledWords = extractStruggledWordsFromSession(turnResults);

  return {
    totalUserTurns: userTurns.length,
    completedTurns: completedResults.length,
    skippedTurns: completedResults.length - scoredItems.length,
    avgAccuracy,
    estimatedBand,
    firstTryRate,
    bonusXp,
    totalXp,
    struggledWords
  };
}
