/**
 * src/data/shadowingData.js
 *
 * Speech Shadowing Bank, Dynamic Segment Chunker & Pass-Gated Evaluation Engine.
 * Supports IELTS Speaking Part 1, Part 2 (Cue Card), and Part 3 sample tasks where
 * the machine reads either a single sentence or a multi-sentence paragraph depending on
 * rhetorical flow, and unlocks the next segment once accuracy meets the threshold (default 75%).
 *
 * Designed as an extensible schema ready for future external document ingestion.
 * Strictly complies with Global English UI Rule (100% English when isEn === true).
 */

import { evaluatePronunciationAttempt } from './pronunciationData.js';
import { extractStruggledWordsFromSession } from './conversationData.js';

export const SHADOWING_DEFAULT_THRESHOLD = 75;

export const SHADOWING_PARTS = [
  {
    id: 'all',
    labelEn: 'All Parts',
    labelVi: 'Tất Cả Phần',
    badgeColor: 'from-slate-700 to-slate-800'
  },
  {
    id: 'part1',
    labelEn: 'Part 1',
    labelVi: 'Part 1',
    badgeColor: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'part2',
    labelEn: 'Part 2 Cue Card',
    labelVi: 'Part 2 (Thẻ Gợi Ý)',
    badgeColor: 'from-violet-500 to-purple-600'
  },
  {
    id: 'part3',
    labelEn: 'Part 3 Discussion',
    labelVi: 'Part 3 (Thảo Luận)',
    badgeColor: 'from-rose-500 to-amber-500'
  }
];

export const SHADOWING_CHUNK_MODES = [
  {
    id: 'auto',
    labelEn: 'Smart Flow',
    labelVi: 'Theo mạch bài',
    descEn: 'Mixes sentences & paragraphs naturally',
    descVi: 'Đan xen câu đơn & đoạn theo diễn biến bài'
  },
  {
    id: 'sentence',
    labelEn: '1 Sentence',
    labelVi: 'Từng câu',
    descEn: 'Split into single sentences',
    descVi: 'Tách từng câu ngắn dễ đọc'
  },
  {
    id: 'paragraph',
    labelEn: 'Paragraph',
    labelVi: 'Theo đoạn',
    descEn: 'Group into full paragraphs',
    descVi: 'Gộp thành đoạn dài luyện sức bền'
  }
];

/**
 * Generates automatic thought-group / intonation markers for segments lacking custom markup.
 */
function buildAutoIntonation(text) {
  return String(text || '')
    .trim()
    .replace(/,\s+/g, ', ↗ / ')
    .replace(/\s+(because|although|while|whereas|yet|however|moreover|therefore|and|but|so)\s+/gi, ' / $1 ')
    .replace(/([.!?])?$/, (m) => `${m || ''} ${m === '?' ? '↗' : '↘'}`);
}

export const SHADOWING_STARTER_TASKS = [
  // =========================================================================
  // PART 1 STARTER TASKS (2 Tasks)
  // =========================================================================
  {
    id: 'shad-p1-reading-habits',
    part: 'part1',
    bandLevel: '7.0',
    topicEn: 'Reading & Digital Media',
    topicVi: 'Đọc Sách & Truyền Thông Số',
    titleEn: 'Part 1: Reading Habits & Audio Books',
    titleVi: 'Part 1: Thói Quen Đọc Sách & Sách Nói',
    promptEn: 'Examiner asks about your daily reading routine and preference between paper books and e-books.',
    promptVi: 'Giám khảo hỏi về thói quen đọc sách hàng ngày và lựa chọn giữa sách giấy với sách điện tử.',
    sourceTag: 'Starter Bank',
    xpReward: 95,
    segments: [
      {
        id: 's1',
        unitType: 'prompt_only',
        phaseLabelEn: 'Examiner Question 1',
        phaseLabelVi: 'Câu hỏi Giám khảo 1',
        text: 'Do you enjoy reading books in your spare time?',
        intonationText: 'Do you enˈjoy ˈreading ˈbooks in your ˈspare ˈtime? ↗',
        meaningEn: 'Opening Part 1 question about leisure reading.',
        meaningVi: 'Câu hỏi mở đầu Part 1 về sở thích đọc sách lúc rảnh.',
        mouthTipEn: 'Listen for the rising pitch at the end of the Yes/No question.',
        mouthTipVi: 'Nghe ngữ điệu lên giọng ở cuối câu hỏi Yes/No.'
      },
      {
        id: 's2',
        unitType: 'sentence',
        phaseLabelEn: 'Direct Answer (1 Sentence)',
        phaseLabelVi: 'Trả lời trực diện (1 câu)',
        text: 'Yes, I am an avid reader and usually set aside thirty minutes before bed to unwind with a good book.',
        intonationText: 'ˈYes, ↘ / I am an ˈavid ˈreader ↗ / and ˈusually ˈset aˈside ˈthirty ˈminutes before ˈbed ↗ / to unˈwind with a ˈgood ˈbook. ↘',
        meaningEn: 'Direct positive answer with C1 phrase "avid reader" and "unwind".',
        meaningVi: 'Trả lời trực diện kết hợp cụm từ "avid reader" (người mê đọc) và "unwind" (thư giãn).',
        mouthTipEn: 'Link "an avid" smoothly and pronounce /θ/ clearly in "thirty".',
        mouthTipVi: 'Nối mượt "an avid" và bật rõ âm /θ/ trong "thirty".',
        keyPhrases: ['avid reader', 'set aside', 'unwind']
      },
      {
        id: 's3',
        unitType: 'paragraph',
        phaseLabelEn: 'Reason & Example (Paragraph)',
        phaseLabelVi: 'Giải thích & Ví dụ (Đoạn ngắn)',
        text: 'Reading helps me disconnect from glowing digital screens after a demanding workday. Lately, I have been absorbed in behavioral psychology books because they explain everyday decision-making.',
        intonationText: 'ˈReading ˈhelps me disconˈnect from ˈglowing ˈdigital ˈscreens ↗ / after a deˈmanding ˈworkday. ↘ // ˈLately, ↗ / I have been abˈsorbed in beˈhavioral psyˈchology ˈbooks ↗ / because they exˈplain ˈeveryday deˈcision-making. ↘',
        meaningEn: 'Developing the answer with clear cause and a current reading example.',
        meaningVi: 'Mở rộng ý với lý do tách khỏi màn hình và ví dụ thể loại tâm lý học hành vi.',
        mouthTipEn: 'Drop the silent "p" in "psychology" (/saɪˈkɒl.ə.dʒi/) and pause briefly between the two sentences.',
        mouthTipVi: 'Âm "p" đầu trong "psychology" câm (/saɪˈkɒl.ə.dʒi/), ngắt nhịp nhẹ giữa 2 câu.',
        keyPhrases: ['disconnect from', 'absorbed in', 'behavioral psychology']
      },
      {
        id: 's4',
        unitType: 'prompt_only',
        phaseLabelEn: 'Examiner Question 2',
        phaseLabelVi: 'Câu hỏi Giám khảo 2',
        text: 'Do you prefer physical paper books or digital e-books?',
        intonationText: 'Do you preˈfer ˈphysical ˈpaper ˈbooks ↗ / or ˈdigital ˈe-books? ↘',
        meaningEn: 'Alternative choice question comparing formats.',
        meaningVi: 'Câu hỏi lựa chọn giữa sách giấy truyền thống và sách điện tử.',
        mouthTipEn: 'Notice rising pitch on the first option and falling pitch on the second.',
        mouthTipVi: 'Chú ý lên giọng ở lựa chọn đầu và hạ giọng ở lựa chọn sau.'
      },
      {
        id: 's5',
        unitType: 'paragraph',
        phaseLabelEn: 'Balanced Preference (Paragraph)',
        phaseLabelVi: 'Quan điểm cân bằng (Đoạn)',
        text: 'At home, I genuinely cherish the tactile feel and crisp scent of printed paperbacks. However, whenever I travel, e-books are far more convenient because I can carry an entire library in my pocket.',
        intonationText: 'At ˈhome, ↗ / I ˈgenuinely ˈcherish the ˈtactile ˈfeel and ˈcrisp ˈscent of ˈprinted ˈpaperbacks. ↘ // Howˈever, ↗ / whenˈever I ˈtravel, ↗ / ˈe-books are ˈfar more conˈvenient ↗ / because I can ˈcarry an enˈtire ˈlibrary in my ˈpocket. ↘',
        meaningEn: 'Contrasting home preference with travel practicality.',
        meaningVi: 'Đối chiếu sở thích đọc sách giấy ở nhà với tính tiện lợi của e-book khi đi xa.',
        mouthTipEn: 'Stress "GEN-u-ine-ly" and "con-VEN-ient", and watch silent "c" in "scent" (/sent/).',
        mouthTipVi: 'Nhấn "GEN-u-ine-ly", "con-VEN-ient", chữ "c" trong "scent" (/sent/) không đọc riêng.',
        keyPhrases: ['tactile feel', 'far more convenient', 'entire library']
      }
    ]
  },
  {
    id: 'shad-p1-mornings',
    part: 'part1',
    bandLevel: '6.5',
    titleEn: 'Part 1: Morning Routine & Productivity',
    topicEn: 'Daily Routine',
    topicVi: 'Thói Quen Hàng Ngày',
    titleVi: 'Part 1: Thói Quen Buổi Sáng & Năng Suất',
    promptEn: 'Examiner asks about how you usually start your mornings and whether weekdays differ from weekends.',
    promptVi: 'Giám khảo hỏi về cách bạn bắt đầu buổi sáng và sự khác biệt giữa ngày thường với cuối tuần.',
    sourceTag: 'Starter Bank',
    xpReward: 90,
    segments: [
      {
        id: 's1',
        unitType: 'prompt_only',
        phaseLabelEn: 'Examiner Question 1',
        phaseLabelVi: 'Câu hỏi Giám khảo 1',
        text: 'What is the first thing you usually do after waking up?',
        intonationText: 'ˈWhat is the ˈfirst ˈthing you ˈusually ˈdo ↗ / after ˈwaking ˈup? ↘',
        meaningEn: 'Opening question about morning habits.',
        meaningVi: 'Câu hỏi về việc đầu tiên bạn làm sau khi thức dậy.',
        mouthTipEn: 'Focus on the falling Wh-question intonation.',
        mouthTipVi: 'Nghe ngữ điệu đi xuống ở cuối câu hỏi Wh-.'
      },
      {
        id: 's2',
        unitType: 'sentence',
        phaseLabelEn: 'Opening Habit (1 Sentence)',
        phaseLabelVi: 'Thói quen mở đầu (1 câu)',
        text: 'Right after my alarm rings, I drink a tall glass of water and stretch for five minutes.',
        intonationText: 'ˈRight after my aˈlarm ˈrings, ↗ / I ˈdrink a ˈtall ˈglass of ˈwater ↗ / and ˈstretch for ˈfive ˈminutes. ↘',
        meaningEn: 'Simple, vivid opening action.',
        meaningVi: 'Hành động mở đầu gọn gàng, tự nhiên.',
        mouthTipEn: 'Pronounce /z/ in "rings" and final /s/ in "minutes".',
        mouthTipVi: 'Bật âm /z/ cuối "rings" và âm /s/ cuối "minutes".',
        keyPhrases: ['alarm rings', 'stretch']
      },
      {
        id: 's3',
        unitType: 'paragraph',
        phaseLabelEn: 'Routine & Reason (Paragraph)',
        phaseLabelVi: 'Nhịp sinh hoạt & Lý do (Đoạn)',
        text: 'Starting the morning without scrolling on my phone keeps my mind calm and focused. Afterwards, I brew a quick cup of coffee while reviewing my top three priorities for the day.',
        intonationText: 'ˈStarting the ˈmorning without ˈscrolling on my ˈphone ↗ / ˈkeeps my ˈmind ˈcalm and ˈfocused. ↘ // ˈAfterwards, ↗ / I ˈbrew a ˈquick ˈcup of ˈcoffee ↗ / while reˈviewing my ˈtop ˈthree priˈorities for the ˈday. ↘',
        meaningEn: 'Explaining digital-free morning discipline.',
        meaningVi: 'Giải thích lợi ích của việc không lướt điện thoại sáng sớm và lập danh sách ưu tiên.',
        mouthTipEn: 'Silent "l" in "calm" (/kɑːm/) and clear /t/ in "focused" (/ˈfəʊ.kəst/).',
        mouthTipVi: 'Chữ "l" trong "calm" (/kɑːm/) câm và bật rõ /t/ ở cuối "focused".',
        keyPhrases: ['calm and focused', 'top three priorities']
      },
      {
        id: 's4',
        unitType: 'prompt_only',
        phaseLabelEn: 'Examiner Question 2',
        phaseLabelVi: 'Câu hỏi Giám khảo 2',
        text: 'Are your weekend mornings very different from weekday mornings?',
        intonationText: 'Are your ˈweekend ˈmornings ˈvery ˈdifferent ↗ / from ˈweekday ˈmornings? ↗',
        meaningEn: 'Comparing weekday vs weekend habits.',
        meaningVi: 'So sánh buổi sáng cuối tuần và ngày trong tuần.',
        mouthTipEn: 'Notice the slight rise on "weekday mornings".',
        mouthTipVi: 'Nghe ngữ điệu hơi lên ở cuối câu hỏi Yes/No.'
      },
      {
        id: 's5',
        unitType: 'sentence',
        phaseLabelEn: 'Weekend Contrast (1 Sentence)',
        phaseLabelVi: 'Đối chiếu cuối tuần (1 câu)',
        text: 'Yes, on Saturdays I love sleeping in an extra hour and enjoying a unhurried breakfast with my family.',
        intonationText: 'ˈYes, ↘ / on ˈSaturdays I ˈlove ˈsleeping in an ˈextra ˈhour ↗ / and enˈjoying a ˈleisurely ˈbreakfast with my ˈfamily. ↘',
        meaningEn: 'Natural weekend contrast.',
        meaningVi: 'Sự khác biệt thư giãn vào sáng cuối tuần.',
        mouthTipEn: 'Silent "h" in "hour" (/ˈaʊər/) and pronounce "breakfast" as /ˈbrek.fəst/.',
        mouthTipVi: 'Âm "h" trong "hour" câm và đọc "breakfast" là /ˈbrek.fəst/.',
        keyPhrases: ['sleeping in', 'extra hour']
      }
    ]
  },

  // =========================================================================
  // PART 2 CUE CARD STARTER TASKS (2 Tasks)
  // =========================================================================
  {
    id: 'shad-p2-quiet-cafe',
    part: 'part2',
    bandLevel: '7.5',
    topicEn: 'Places & Focus',
    topicVi: 'Địa Điểm & Tập Trung',
    titleEn: 'Part 2: A Quiet Place Where You Love to Study',
    titleVi: 'Part 2: Một Không Gian Yên Tĩnh Bạn Thích Học Tập',
    promptEn: 'Describe a quiet place you like to spend time in. Say where it is, how often you go there, what you do there, and why you find it relaxing.',
    promptVi: 'Mô tả một nơi yên tĩnh bạn thích lui tới: ở đâu, tần suất đến, bạn làm gì ở đó và vì sao nơi đó giúp bạn thư giãn.',
    cueBulletsEn: [
      'Where this quiet place is located',
      'How frequently you visit it',
      'What activities you usually do there',
      'And explain why it feels so peaceful to you'
    ],
    cueBulletsVi: [
      'Địa điểm yên tĩnh đó nằm ở đâu',
      'Tần suất bạn ghé thăm',
      'Bạn thường làm gì ở đó',
      'Giải thích vì sao nơi đó mang lại cảm giác bình yên'
    ],
    sourceTag: 'Starter Bank',
    xpReward: 120,
    segments: [
      {
        id: 's1',
        unitType: 'sentence',
        phaseLabelEn: 'Phase 1: Opening Hook (1 Sentence)',
        phaseLabelVi: 'Chặng 1: Mở đầu ấn tượng (1 câu)',
        text: 'I would like to describe a hidden botanical café tucked away in a peaceful alley near the university campus.',
        intonationText: 'I would ˈlike to deˈscribe a ˈhidden boˈtanical caˈfé ↗ / ˈtucked aˈway in a ˈpeaceful ˈalley ↗ / near the uniˈversity ˈcampus. ↘',
        meaningEn: 'Setting the scene clearly with vivid imagery.',
        meaningVi: 'Giới thiệu ngay địa điểm ẩn mình yên tĩnh gần khuôn viên đại học.',
        mouthTipEn: 'Stress "bo-TAN-i-cal" and "ca-FÉ", and link "tucked away" smoothly.',
        mouthTipVi: 'Nhấn "bo-TAN-i-cal", "ca-FÉ" và nối mượt "tucked away".',
        keyPhrases: ['tucked away', 'peaceful alley']
      },
      {
        id: 's2',
        unitType: 'paragraph',
        phaseLabelEn: 'Phase 2: Frequency & Atmosphere (Paragraph)',
        phaseLabelVi: 'Chặng 2: Tần suất & Không gian (Đoạn)',
        text: 'I visit this sanctuary at least twice a week, especially when preparing for demanding exams. Stepping through the wooden door feels worlds apart from the traffic outside, because soft acoustic music and indoor greenery fill the room.',
        intonationText: 'I ˈvisit this ˈsanctuary at least ˈtwice a ˈweek, ↗ / eˈspecially when preˈparing for deˈmanding exˈams. ↘ // ˈStepping through the ˈwooden ˈdoor ↗ / feels ˈworlds aˈpart from the ˈtraffic outˈside, ↗ / because ˈsoft aˈcoustic ˈmusic and ˈindoor ˈgreenery ˈfill the ˈroom. ↘',
        meaningEn: 'Describing frequency and multisensory calm atmosphere.',
        meaningVi: 'Mô tả tần suất ghé quán và bầu không khí tách biệt hẳn ồn ào đường phố.',
        mouthTipEn: 'Stress "SANC-tu-ar-y" on the first syllable and "a-COUS-tic" on the second.',
        mouthTipVi: 'Nhấn âm 1 ở "SANC-tu-ar-y" và âm 2 ở "a-COUS-tic".',
        keyPhrases: ['worlds apart', 'indoor greenery']
      },
      {
        id: 's3',
        unitType: 'paragraph',
        phaseLabelEn: 'Phase 3: Core Activities (Paragraph)',
        phaseLabelVi: 'Chặng 3: Hoạt động chính (Đoạn)',
        text: 'I usually pick a corner desk beside the window, order a warm herbal tea, and work uninterrupted for two hours. Without noisy chatter around me, my concentration improves dramatically and complex reading tasks become effortless.',
        intonationText: 'I ˈusually ˈpick a ˈcorner ˈdesk beˈside the ˈwindow, ↗ / ˈorder a ˈwarm ˈherbal ˈtea, ↗ / and ˈwork uninterˈrupted for ˈtwo ˈhours. ↘ // Withˈout ˈnoisy ˈchatter aˈround me, ↗ / my concenˈtration imˈproves draˈmatically ↗ / and ˈcomplex ˈreading ˈtasks beˈcome ˈeffortless. ↘',
        meaningEn: 'Explaining productive routine and focus benefits.',
        meaningVi: 'Kể chi tiết thói quen ngồi góc bàn cửa sổ và hiệu quả tập trung cao độ.',
        mouthTipEn: 'Stress "uninter-RUP-ted" and "dra-MAT-i-cal-ly", keeping "effortless" crisp.',
        mouthTipVi: 'Nhấn "uninter-RUP-ted" và "dra-MAT-i-cal-ly", bật âm cuối /s/ trong "effortless".',
        keyPhrases: ['work uninterrupted', 'improves dramatically']
      },
      {
        id: 's4',
        unitType: 'sentence',
        phaseLabelEn: 'Phase 4: Reflective Takeaway (1 Sentence)',
        phaseLabelVi: 'Chặng 4: Đúc kết cảm xúc (1 câu)',
        text: 'Overall, having a reliable refuge like this helps me recharge mentally and stay balanced throughout busy semesters.',
        intonationText: 'Overˈall, ↗ / ˈhaving a reˈliable ˈrefuge like ˈthis ↗ / ˈhelps me reˈcharge ˈmentally and ˈstay ˈbalanced throughˈout ˈbusy seˈmesters. ↘',
        meaningEn: 'Polished Part 2 concluding reflection.',
        meaningVi: 'Câu kết đúc kết giá trị tinh thần của không gian yêu thích.',
        mouthTipEn: 'Pronounce "refuge" as /ˈref.juːdʒ/ and keep /t/ clear at the end of "balanced" (/ˈbæl.ənst/).',
        mouthTipVi: 'Đọc "refuge" là /ˈref.juːdʒ/ và bật nhẹ đuôi /t/ ở "balanced".',
        keyPhrases: ['reliable refuge', 'recharge mentally']
      }
    ]
  },
  {
    id: 'shad-p2-useful-skill',
    part: 'part2',
    bandLevel: '7.5',
    topicEn: 'Skills & Learning',
    topicVi: 'Kỹ Năng & Học Tập',
    titleEn: 'Part 2: A Practical Skill You Learned Online',
    titleVi: 'Part 2: Một Kỹ Năng Thực Tiễn Học Qua Mạng',
    promptEn: 'Describe a practical skill you learned from an online video or course. Say what it was, why you learned it, how you practiced, and how useful it is.',
    promptVi: 'Mô tả một kỹ năng thực tế bạn tự học qua video/khóa học online: kỹ năng gì, vì sao học, cách thực hành và giá trị mang lại.',
    cueBulletsEn: [
      'What practical skill you learned',
      'Why you decided to learn it',
      'How you practiced and overcame difficulties',
      'And explain how it benefits you today'
    ],
    cueBulletsVi: [
      'Kỹ năng thực tiễn bạn đã học',
      'Lý do bạn quyết định học nó',
      'Cách bạn luyện tập và vượt qua khó khăn',
      'Lợi ích hiện tại của kỹ năng đó'
    ],
    sourceTag: 'Starter Bank',
    xpReward: 120,
    segments: [
      {
        id: 's1',
        unitType: 'sentence',
        phaseLabelEn: 'Phase 1: Skill Introduction (1 Sentence)',
        phaseLabelVi: 'Chặng 1: Giới thiệu kỹ năng (1 câu)',
        text: 'One practical skill I taught myself through online tutorials is editing concise documentary-style videos.',
        intonationText: 'ˈOne ˈpractical ˈskill I ˈtaught myˈself through ˈonline tuˈtorials ↗ / is ˈediting conˈcise docuˈmentary-style ˈvideos. ↘',
        meaningEn: 'Direct Part 2 topic introduction.',
        meaningVi: 'Giới thiệu trực diện kỹ năng tự học dựng video tài liệu ngắn.',
        mouthTipEn: 'Stress "tu-TOR-i-als" and "con-CISE".',
        mouthTipVi: 'Nhấn "tu-TOR-i-als" và "con-CISE".',
        keyPhrases: ['taught myself', 'concise']
      },
      {
        id: 's2',
        unitType: 'paragraph',
        phaseLabelEn: 'Phase 2: Motivation & Practice (Paragraph)',
        phaseLabelVi: 'Chặng 2: Động lực & Thực hành (Đoạn)',
        text: 'I picked up this skill two years ago when my university club needed engaging clips to promote community events. Every weekend, I watched step-by-step lessons and experimented with pacing, color balance, and audio mixing on short clips.',
        intonationText: 'I ˈpicked up this ˈskill ˈtwo ˈyears aˈgo ↗ / when my uniˈversity ˈclub ˈneeded enˈgaging ˈclips ↗ / to proˈmote comˈmunity eˈvents. ↘ // ˈEvery weekˈend, ↗ / I ˈwatched ˈstep-by-step ˈlessons ↗ / and exˈperimented with ˈpacing, ˈcolor ˈbalance, ↗ / and ˈaudio ˈmixing on ˈshort ˈclips. ↘',
        meaningEn: 'Narrating the initial need and deliberate weekend practice.',
        meaningVi: 'Kể lại bối cảnh cần làm video cho CLB và quá trình tự thực hành mỗi cuối tuần.',
        mouthTipEn: 'Pronounce "picked" as /pɪkt/ and "watched" as /wɒtʃt/ (no extra syllable).',
        mouthTipVi: 'Đọc "picked" (/pɪkt/) và "watched" (/wɒtʃt/) chỉ 1 âm tiết, bật đuôi /t/.',
        keyPhrases: ['picked up', 'experimented with']
      },
      {
        id: 's3',
        unitType: 'paragraph',
        phaseLabelEn: 'Phase 3: Breakthrough & Impact (Paragraph)',
        phaseLabelVi: 'Chặng 3: Bước ngoặt & Giá trị (Đoạn)',
        text: 'At first, synchronizing background music with voiceovers felt frustratingly slow. However, once I mastered keyboard shortcuts, my workflow became twice as fast and our club’s recap video gained thousands of views.',
        intonationText: 'At ˈfirst, ↗ / ˈsynchronizing ˈbackground ˈmusic with ˈvoiceovers ↗ / felt frusˈtratingly ˈslow. ↘ // Howˈever, ↗ / ˈonce I ˈmastered ˈkeyboard ˈshortcuts, ↗ / my ˈworkflow beˈcame ˈtwice as ˈfast ↗ / and our ˈclub’s ˈrecap ˈvideo ˈgained ˈthousands of ˈviews. ↘',
        meaningEn: 'Highlighting obstacle overcome and tangible success.',
        meaningVi: 'Nêu khó khăn ban đầu và bước ngoặt khi làm chủ phím tắt.',
        mouthTipEn: 'Pronounce /θ/ in "thousands" and stress "SYN-chro-ni-zing".',
        mouthTipVi: 'Đọc chuẩn /θ/ trong "thousands" và nhấn âm đầu "SYN-chro-ni-zing".',
        keyPhrases: ['synchronizing', 'workflow']
      },
      {
        id: 's4',
        unitType: 'sentence',
        phaseLabelEn: 'Phase 4: Long-Term Value (1 Sentence)',
        phaseLabelVi: 'Chặng 4: Giá trị lâu dài (1 câu)',
        text: 'Even today, visual storytelling remains an invaluable asset for both my academic presentations and freelance projects.',
        intonationText: 'ˈEven toˈday, ↗ / ˈvisual ˈstorytelling reˈmains an inˈvaluable ˈasset ↗ / for ˈboth my acaˈdemic presenˈtations and ˈfreelance ˈprojects. ↘',
        meaningEn: 'Strong closing takeaway linking skill to future career.',
        meaningVi: 'Kết bài khẳng định giá trị lâu dài trong học tập và công việc.',
        mouthTipEn: 'Stress "in-VAL-u-a-ble" (/ɪnˈvæl.ju.ə.bəl/) and clear /s/ in "projects".',
        mouthTipVi: 'Nhấn "in-VAL-u-a-ble" và bật âm /s/ cuối "projects".',
        keyPhrases: ['visual storytelling', 'invaluable asset']
      }
    ]
  },

  // =========================================================================
  // PART 3 DISCUSSION STARTER TASKS (2 Tasks)
  // =========================================================================
  {
    id: 'shad-p3-urban-green',
    part: 'part3',
    bandLevel: '8.0',
    topicEn: 'Cities & Environment',
    topicVi: 'Đô Thị & Môi Trường',
    titleEn: 'Part 3: Urban Green Spaces & City Planning',
    titleVi: 'Part 3: Không Gian Xanh & Quy Hoạch Đô Thị',
    promptEn: 'Examiner explores whether high-density cities should protect public parks instead of expanding commercial real estate.',
    promptVi: 'Giám khảo thảo luận về việc các đô thị đông đúc có nên ưu tiên bảo vệ công viên công cộng thay vì mở rộng bất động sản thương mại.',
    sourceTag: 'Starter Bank',
    xpReward: 130,
    segments: [
      {
        id: 's1',
        unitType: 'prompt_only',
        phaseLabelEn: 'Examiner Question 1',
        phaseLabelVi: 'Câu hỏi Giám khảo 1',
        text: 'Why are public parks becoming increasingly important in overcrowded modern cities?',
        intonationText: 'ˈWhy are ˈpublic ˈparks beˈcoming inˈcreasingly imˈportant ↗ / in overˈcrowded ˈmodern ˈcities? ↘',
        meaningEn: 'Analytical Part 3 question on urban wellbeing.',
        meaningVi: 'Câu hỏi phân tích tầm quan trọng của công viên tại các đô thị đông đúc.',
        mouthTipEn: 'Notice stress on "in-CREAS-ing-ly" and "over-CROWD-ed".',
        mouthTipVi: 'Nghe cách nhấn ở "in-CREAS-ing-ly" và "over-CROWD-ed".'
      },
      {
        id: 's2',
        unitType: 'sentence',
        phaseLabelEn: 'Core Thesis (1 Sentence)',
        phaseLabelVi: 'Luận điểm chính (1 câu)',
        text: 'Public parks act as vital ecological lungs that cool dense neighborhoods and reduce daily psychological stress.',
        intonationText: 'ˈPublic ˈparks ˈact as ˈvital ecoˈlogical ˈlungs ↗ / that ˈcool ˈdense ˈneighborhoods ↗ / and reˈduce ˈdaily psychoˈlogical ˈstress. ↘',
        meaningEn: 'Clear Band 8.0 topic sentence with metaphor ("ecological lungs").',
        meaningVi: 'Câu luận điểm sắc nét ví công viên như lá phổi sinh thái làm dịu áp lực tâm lý.',
        mouthTipEn: 'Stress "eco-LOG-i-cal" and pronounce final /z/ in "parks" /s/ vs "lungs" /z/.',
        mouthTipVi: 'Nhấn "eco-LOG-i-cal", phân biệt /s/ ở "parks" và /z/ ở "lungs".',
        keyPhrases: ['ecological lungs', 'dense neighborhoods']
      },
      {
        id: 's3',
        unitType: 'paragraph',
        phaseLabelEn: 'Evidence & Societal Impact (Paragraph)',
        phaseLabelVi: 'Phân tích xã hội (Đoạn)',
        text: 'When concrete skyscrapers dominate every block, residents rarely get opportunities to exercise outdoors or interact casually with neighbors. Accessible green spaces bridge that gap by fostering community cohesion across different age groups without costing a single penny.',
        intonationText: 'When ˈconcrete ˈskyscrapers ˈdominate ˈevery ˈblock, ↗ / ˈresidents ˈrarely get opporˈtunities to ˈexercise outˈdoors ↗ / or interˈact ˈcasually with ˈneighbors. ↘ // Acˈcessible ˈgreen ˈspaces ˈbridge that ˈgap ↗ / by ˈfostering comˈmunity coˈhesion ↗ / across ˈdifferent ˈage ˈgroups withˈout ˈcosting a ˈsingle ˈpenny. ↘',
        meaningEn: 'Expanding with social cohesion and accessibility reasoning.',
        meaningVi: 'Phân tích sâu lợi ích gắn kết cộng đồng miễn phí cho mọi lứa tuổi.',
        mouthTipEn: 'Stress "ac-CES-si-ble" and "co-HE-sion" (/kəʊˈhiː.ʒən/).',
        mouthTipVi: 'Nhấn "ac-CES-si-ble" và đọc chuẩn âm /ʒ/ trong "co-HE-sion".',
        keyPhrases: ['community cohesion', 'bridge that gap']
      },
      {
        id: 's4',
        unitType: 'prompt_only',
        phaseLabelEn: 'Examiner Follow-up',
        phaseLabelVi: 'Câu hỏi nối tiếp',
        text: 'Should municipal governments sacrifice commercial land to build more green zones?',
        intonationText: 'Should muˈnicipal ˈgovernments ˈsacrifice comˈmercial ˈland ↗ / to ˈbuild more ˈgreen ˈzones? ↗',
        meaningEn: 'Testing policy trade-off evaluation.',
        meaningVi: 'Hỏi về sự đánh đổi giữa đất thương mại và không gian xanh.',
        mouthTipEn: 'Listen to stress on "mu-NIC-i-pal" and "SAC-ri-fice".',
        mouthTipVi: 'Nghe trọng âm ở "mu-NIC-i-pal" và "SAC-ri-fice".'
      },
      {
        id: 's5',
        unitType: 'paragraph',
        phaseLabelEn: 'Balanced Policy Conclusion (Paragraph)',
        phaseLabelVi: 'Kết luận chính sách cân bằng (Đoạn)',
        text: 'Admittedly, commercial districts generate immediate tax revenue that funds public transit. Nevertheless, balanced urban planning must protect green corridors so cities remain livable and resilient against rising summer temperatures.',
        intonationText: 'Adˈmittedly, ↗ / comˈmercial ˈdistricts ˈgenerate imˈmediate ˈtax ˈrevenue ↗ / that ˈfunds ˈpublic ˈtransit. ↘ // Nevertheˈless, ↗ / ˈbalanced ˈurban ˈplanning must proˈtect ˈgreen ˈcorridors ↗ / so ˈcities reˈmain ˈlivable and reˈsilient against ˈrising ˈsummer ˈtemperatures. ↘',
        meaningEn: 'Two-sided Part 3 concession and long-term sustainability stance.',
        meaningVi: 'Lập luận nhượng bộ 2 chiều chuẩn Band 8.0+ về quy hoạch bền vững.',
        mouthTipEn: 'Pronounce "temperature" cleanly (/ˈtem.prə.tʃər/) and stress "re-SIL-ient".',
        mouthTipVi: 'Đọc gọn "temperatures" (/ˈtem.prə.tʃərz/) và rung âm /z/ trong "re-SIL-ient".',
        keyPhrases: ['tax revenue', 'green corridors', 'livable and resilient']
      }
    ]
  },
  {
    id: 'shad-p3-remote-work',
    part: 'part3',
    bandLevel: '8.0',
    topicEn: 'Work & Technology',
    topicVi: 'Công Việc & Công Nghệ',
    titleEn: 'Part 3: Hybrid Work & Workplace Culture',
    titleVi: 'Part 3: Làm Việc Linh Hoạt & Văn Hóa Công Sở',
    promptEn: 'Examiner asks about the long-term impact of remote work on mentorship, innovation, and employee wellbeing.',
    promptVi: 'Giám khảo hỏi về tác động dài hạn của làm việc từ xa lên đào tạo nhân sự trẻ, sáng tạo và sức khỏe nhân viên.',
    sourceTag: 'Starter Bank',
    xpReward: 130,
    segments: [
      {
        id: 's1',
        unitType: 'prompt_only',
        phaseLabelEn: 'Examiner Question 1',
        phaseLabelVi: 'Câu hỏi Giám khảo 1',
        text: 'Do you think working permanently from home weakens team collaboration?',
        intonationText: 'Do you ˈthink ˈworking ˈpermanently from ˈhome ↗ / ˈweakens ˈteam collaboˈration? ↗',
        meaningEn: 'Direct Part 3 question evaluating remote teamwork.',
        meaningVi: 'Câu hỏi về việc làm việc tại nhà hoàn toàn có làm giảm gắn kết nhóm không.',
        mouthTipEn: 'Notice stress on "PER-ma-nent-ly" and "col-lab-o-RA-tion".',
        mouthTipVi: 'Chú ý trọng âm ở "PER-ma-nent-ly" và "col-lab-o-RA-tion".'
      },
      {
        id: 's2',
        unitType: 'sentence',
        phaseLabelEn: 'Nuanced Stance (1 Sentence)',
        phaseLabelVi: 'Quan điểm đa chiều (1 câu)',
        text: 'To some extent, yes, because spontaneous brainstorming rarely happens during rigidly scheduled video calls.',
        intonationText: 'To ˈsome exˈtent, ˈyes, ↗ / because sponˈtaneous ˈbrainstorming ˈrarely ˈhappens ↗ / during ˈrigidly ˈscheduled ˈvideo ˈcalls. ↘',
        meaningEn: 'Nuanced Band 8.0 hedging ("To some extent", "spontaneous").',
        meaningVi: 'Cách trả lời học thuật có kiểm soát mức độ khẳng định.',
        mouthTipEn: 'Stress "spon-TA-ne-ous" on the second syllable and "RIG-id-ly" on the first.',
        mouthTipVi: 'Nhấn "spon-TA-ne-ous" ở âm 2 và "RIG-id-ly" ở âm 1.',
        keyPhrases: ['to some extent', 'spontaneous brainstorming']
      },
      {
        id: 's3',
        unitType: 'paragraph',
        phaseLabelEn: 'Mentorship & Hybrid Solution (Paragraph)',
        phaseLabelVi: 'Đào tạo & Giải pháp Hybrid (Đoạn)',
        text: 'Junior staff especially benefit from observing experienced colleagues handle difficult clients in person. Therefore, a hybrid model offering three office days and two remote days strikes the ideal balance between mentorship and personal autonomy.',
        intonationText: 'ˈJunior ˈstaff eˈspecially ˈbenefit ↗ / from obˈserving exˈperienced ˈcolleagues ↗ / ˈhandle ˈdifficult ˈclients in ˈperson. ↘ // ˈTherefore, ↗ / a ˈhybrid ˈmodel ↗ / ˈoffering ˈthree ˈoffice ˈdays and ˈtwo reˈmote ˈdays ↗ / ˈstrikes the iˈdeal ˈbalance beˈtween ˈmentorship and ˈpersonal auˈtonomy. ↘',
        meaningEn: 'Proposing a balanced hybrid arrangement with strong collocations.',
        meaningVi: 'Đề xuất mô hình kết hợp 3 ngày công sở / 2 ngày từ xa cân bằng cố vấn và tự chủ.',
        mouthTipEn: 'Stretch /iː/ in "colleagues" (/ˈkɒl.iːɡz/) and stress "au-TON-o-my".',
        mouthTipVi: 'Kéo dài âm /iː/ ở "colleagues" và nhấn "au-TON-o-my".',
        keyPhrases: ['strikes the ideal balance', 'personal autonomy']
      }
    ]
  }
];

/**
 * Splits prose into sentences safely without breaking on abbreviations (Dr., Mr., e.g., U.K.)
 * or decimal numbers (7.5).
 */
export function splitIntoSentencesSafe(text = '') {
  const raw = String(text || '').trim();
  if (!raw) return [];

  const DOT_PLACEHOLDER = '__ABBR_DOT__';
  const protectedText = raw
    .replace(/(\d)\.(\d)/g, `$1${DOT_PLACEHOLDER}$2`)
    .replace(/\b(e\.g|i\.e|a\.m|p\.m|U\.S|U\.K)\./gi, (m) => m.replace(/\./g, DOT_PLACEHOLDER))
    .replace(/\b(Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St|vs)\./gi, (_, abbr) => `${abbr}${DOT_PLACEHOLDER}`)
    .replace(/\betc\.(?=\s+[a-z,])/gi, () => `etc${DOT_PLACEHOLDER}`);

  return protectedText
    .split(/(?<=[.!?])\s+/)
    .map(s => s.replace(new RegExp(DOT_PLACEHOLDER, 'g'), '.').trim())
    .filter(Boolean);
}

/**
 * Resolves a task's segments according to the selected chunk mode:
 * - 'auto': preserves the author's natural mix of 1-sentence & paragraph segments
 * - 'sentence': splits paragraph segments into single sentences (keeps prompt_only cues intact)
 * - 'paragraph': groups consecutive non-prompt segments into multi-sentence paragraphs
 */
export function resolveShadowingSegments(task, chunkMode = 'auto') {
  const baseSegments = Array.isArray(task?.segments) ? task.segments : [];
  if (baseSegments.length === 0) return [];
  if (chunkMode === 'auto') return baseSegments;

  if (chunkMode === 'sentence') {
    const out = [];
    baseSegments.forEach((seg) => {
      if (seg.unitType === 'prompt_only') {
        out.push(seg);
        return;
      }
      const sentences = splitIntoSentencesSafe(seg.text || '');

      if (sentences.length <= 1) {
        out.push({ ...seg, unitType: 'sentence' });
        return;
      }

      sentences.forEach((sentenceText, idx) => {
        out.push({
          ...seg,
          id: `${seg.id}_s${idx + 1}`,
          unitType: 'sentence',
          phaseLabelEn: `${seg.phaseLabelEn || 'Sentence'} (${idx + 1}/${sentences.length})`,
          phaseLabelVi: `${seg.phaseLabelVi || 'Câu'} (${idx + 1}/${sentences.length})`,
          text: sentenceText,
          intonationText: buildAutoIntonation(sentenceText)
        });
      });
    });
    return out;
  }

  // 'paragraph': merge consecutive non-prompt segments up to ~55 words
  const merged = [];
  let bucket = [];

  const flushBucket = () => {
    if (bucket.length === 0) return;
    if (bucket.length === 1) {
      merged.push({
        ...bucket[0],
        unitType: splitIntoSentencesSafe(bucket[0].text || '').length > 1 ? 'paragraph' : bucket[0].unitType
      });
      bucket = [];
      return;
    }
    const first = bucket[0];
    const combinedText = bucket.map(b => b.text).join(' ');
    const combinedIntonation = bucket.map(b => b.intonationText || buildAutoIntonation(b.text)).join(' // ');
    const combinedPhrases = [...new Set(bucket.flatMap(b => b.keyPhrases || []))];

    merged.push({
      ...first,
      id: bucket.map(b => b.id).join('_'),
      unitType: 'paragraph',
      phaseLabelEn: `${first.phaseLabelEn || 'Paragraph'} (Combined)`,
      phaseLabelVi: `${first.phaseLabelVi || 'Đoạn gộp'} (${bucket.length} phần)`,
      text: combinedText,
      intonationText: combinedIntonation,
      keyPhrases: combinedPhrases
    });
    bucket = [];
  };

  baseSegments.forEach((seg) => {
    if (seg.unitType === 'prompt_only') {
      flushBucket();
      merged.push(seg);
      return;
    }
    const bucketWords = bucket.reduce((sum, b) => sum + b.text.split(/\s+/).filter(Boolean).length, 0);
    const segWords = String(seg.text || '').split(/\s+/).filter(Boolean).length;
    if (bucket.length > 0 && bucketWords + segWords > 58) {
      flushBucket();
    }
    bucket.push(seg);
  });
  flushBucket();

  return merged;
}

/**
 * Evaluates a learner's shadowed utterance against the active threshold (default 75%).
 */
export function evaluateShadowingSegment({
  targetText = '',
  spokenText = '',
  confidence = 0.88,
  streak = 0,
  alternatives = [],
  acousticMetrics = null,
  threshold = SHADOWING_DEFAULT_THRESHOLD,
  unitType = 'sentence'
}) {
  const baseEval = evaluatePronunciationAttempt({
    targetText,
    spokenText,
    confidence,
    itemType: 'sentences',
    streak,
    alternatives,
    acousticMetrics
  });

  const safeThreshold = Number(threshold) || SHADOWING_DEFAULT_THRESHOLD;
  const isPassed = baseEval.overallAccuracy >= safeThreshold;
  const paragraphBonus = isPassed && unitType === 'paragraph' ? 5 : 0;

  return {
    ...baseEval,
    xpEarned: (baseEval.xpEarned || 0) + paragraphBonus,
    spokenTranscript: String(spokenText || '').trim(),
    threshold: safeThreshold,
    unitType,
    isPassed
  };
}

/**
 * Splits overly long pasted paragraphs (> 60 words) into 2-sentence chunks for reliable STT grading.
 */
function splitLongTextIntoReadableBlocks(text = '') {
  const sentences = splitIntoSentencesSafe(text);
  if (sentences.length <= 2) return [sentences.join(' ')].filter(Boolean);

  const blocks = [];
  let buffer = [];
  let bufferWords = 0;

  for (const s of sentences) {
    const wc = s.split(/\s+/).filter(Boolean).length;
    if (buffer.length > 0 && (buffer.length >= 2 || bufferWords + wc > 50)) {
      blocks.push(buffer.join(' '));
      buffer = [s];
      bufferWords = wc;
    } else {
      buffer.push(s);
      bufferWords += wc;
    }
  }
  if (buffer.length > 0) blocks.push(buffer.join(' '));
  return blocks;
}

/**
 * Builds an extensible Speaking Shadowing task from raw text or structured segments.
 * Supports blank-line paragraph separation and optional `Examiner:` / `Q:` prompt lines.
 */
export function buildCustomShadowingTask({
  title = '',
  part = 'part2',
  bandLevel = '7.5',
  prompt = '',
  rawText = '',
  segments: providedSegments = null
}) {
  const resolvedPart = ['part1', 'part2', 'part3'].includes(part) ? part : 'part2';
  let segments = [];

  if (Array.isArray(providedSegments) && providedSegments.length > 0) {
    segments = providedSegments.map((seg, i) => ({
      id: seg.id || `cs-${i + 1}`,
      unitType: seg.unitType || (splitIntoSentencesSafe(seg.text || '').length > 1 ? 'paragraph' : 'sentence'),
      phaseLabelEn: seg.phaseLabelEn || `Segment ${i + 1}`,
      phaseLabelVi: seg.phaseLabelVi || `Đoạn ${i + 1}`,
      text: String(seg.text || '').trim(),
      intonationText: seg.intonationText || buildAutoIntonation(seg.text || ''),
      meaningEn: seg.meaningEn || '',
      meaningVi: seg.meaningVi || '',
      mouthTipEn: seg.mouthTipEn || 'Keep steady phrasing and articulate ending consonants clearly.',
      mouthTipVi: seg.mouthTipVi || 'Giữ nhịp đều theo cụm từ và bật rõ phụ âm cuối.',
      keyPhrases: seg.keyPhrases || []
    })).filter(s => s.text.length > 0);
  } else {
    const rawBlocks = String(rawText || '')
      .split(/\r?\n\s*\r?\n/)
      .map(b => b.trim())
      .filter(Boolean);

    let segCounter = 0;
    rawBlocks.forEach((block) => {
      const lines = block.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const candidateLines = [];

      const flushCandidateLines = () => {
        if (candidateLines.length === 0) return;
        const joined = candidateLines.join(' ').replace(/\s+/g, ' ').trim();
        candidateLines.length = 0;
        const subBlocks = splitLongTextIntoReadableBlocks(joined);
        subBlocks.forEach((txt) => {
          segCounter += 1;
          const sentCount = splitIntoSentencesSafe(txt).length;
          const unitType = sentCount >= 2 ? 'paragraph' : 'sentence';
          segments.push({
            id: `cs-${segCounter}`,
            unitType,
            phaseLabelEn: unitType === 'paragraph' ? `Paragraph ${segCounter}` : `Sentence ${segCounter}`,
            phaseLabelVi: unitType === 'paragraph' ? `Đoạn ${segCounter}` : `Câu ${segCounter}`,
            text: txt,
            intonationText: buildAutoIntonation(txt),
            meaningEn: '',
            meaningVi: '',
            mouthTipEn: 'Articulate stressed syllables and final consonants cleanly.',
            mouthTipVi: 'Nhấn rõ trọng âm từ khóa và bật gọn phụ âm cuối.',
            keyPhrases: []
          });
        });
      };

      lines.forEach((line) => {
        const examinerMatch = line.match(/^(Examiner|Q|Question)\s*:\s*(.+)$/i);
        if (examinerMatch) {
          flushCandidateLines();
          segCounter += 1;
          const qText = examinerMatch[2].trim();
          segments.push({
            id: `cs-${segCounter}`,
            unitType: 'prompt_only',
            phaseLabelEn: 'Examiner Prompt',
            phaseLabelVi: 'Câu hỏi Giám khảo',
            text: qText,
            intonationText: buildAutoIntonation(qText),
            meaningEn: 'Examiner prompt question.',
            meaningVi: 'Câu hỏi gợi mở từ Giám khảo.',
            mouthTipEn: 'Listen carefully before shadowing the response.',
            mouthTipVi: 'Lắng nghe câu hỏi trước khi nhại lại câu trả lời.',
            keyPhrases: []
          });
          return;
        }
        const candMatch = line.match(/^(Candidate|A|Answer)\s*:\s*(.+)$/i);
        candidateLines.push(candMatch ? candMatch[2].trim() : line);
      });

      flushCandidateLines();
    });
  }

  const cleanTitle = String(title || '').trim() || 'Custom Speaking Shadowing';
  const cleanPrompt = String(prompt || '').trim() || 'Shadow each sentence or paragraph clearly to unlock the next part.';
  const shadowCount = segments.filter(s => s.unitType !== 'prompt_only').length;

  return {
    id: `shad-custom-${Date.now()}`,
    part: resolvedPart,
    bandLevel: String(bandLevel || '7.5'),
    topicEn: 'Custom Speaking Sample',
    topicVi: 'Bài Mẫu Tự Nhập',
    titleEn: cleanTitle,
    titleVi: cleanTitle,
    promptEn: cleanPrompt,
    promptVi: cleanPrompt,
    sourceTag: 'Custom Sample',
    xpReward: Math.max(50, shadowCount * 25),
    isCustom: true,
    segments
  };
}

/**
 * Summarizes a completed Speech Shadowing session (compatible with ConversationSummaryCard).
 */
export function summarizeShadowingSession({
  task,
  segments = [],
  segmentResults = {},
  segmentAttempts = {}
}) {
  const shadowSegments = (segments || []).filter(s => s.unitType !== 'prompt_only');
  const completedItems = shadowSegments
    .map(seg => ({ seg, res: segmentResults[seg.id], attempts: segmentAttempts[seg.id] || 1 }))
    .filter(item => Boolean(item.res));

  const scoredItems = completedItems.filter(item => !item.res.skipped);
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

  const bonusXp = scoredItems.length > 0 && scoredItems.length === shadowSegments.length ? 35 : 0;
  const totalXp = scoredItems.reduce((sum, item) => sum + (item.res.xpEarned || 0), 0) + bonusXp;
  const struggledWords = extractStruggledWordsFromSession(segmentResults);

  return {
    totalUserTurns: shadowSegments.length,
    completedTurns: completedItems.length,
    skippedTurns: completedItems.length - scoredItems.length,
    avgAccuracy,
    estimatedBand,
    firstTryRate,
    bonusXp,
    totalXp,
    struggledWords,
    taskId: task?.id || ''
  };
}

let cachedSpeakingShadowTasks = null;

/**
 * Lazily adapts existing IELTS Speaking Bank topics (Part 1, Part 2 Cue Cards, Part 3)
 * into Speech Shadowing tasks with mixed sentence & paragraph segments.
 */
export async function loadSpeakingBankShadowingTasks() {
  if (cachedSpeakingShadowTasks) return cachedSpeakingShadowTasks;

  const tasks = [];
  try {
    const mod = await import('./speakingTopics.js');

    // 1. Adapt Part 2 Cue Cards (rich 4-paragraph model speeches)
    (mod.SPEAKING_PART2_CUECARDS || []).forEach((card) => {
      if (!card?.sampleAnswer) return;
      const rawParas = String(card.sampleAnswer)
        .split(/\n\s*\n/)
        .map(p => p.trim())
        .filter(Boolean);

      const phaseNames = [
        { en: 'Opening Hook', vi: 'Mở đầu & Giới thiệu' },
        { en: 'Background & Context', vi: 'Bối cảnh & Hoàn cảnh' },
        { en: 'Core Highlights', vi: 'Chi tiết & Cao trào' },
        { en: 'Reflection & Impact', vi: 'Đúc kết & Cảm xúc' }
      ];

      const segments = [];
      let segIdx = 0;
      rawParas.forEach((paraText, pIdx) => {
        const blocks = splitLongTextIntoReadableBlocks(paraText);
        blocks.forEach((blk, bIdx) => {
          segIdx += 1;
          const sentCount = blk.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
          const unitType = sentCount >= 2 ? 'paragraph' : 'sentence';
          const phaseMeta = phaseNames[Math.min(pIdx, phaseNames.length - 1)];
          segments.push({
            id: `${card.id}-seg${segIdx}`,
            unitType,
            phaseLabelEn: blocks.length > 1 ? `${phaseMeta.en} (${bIdx + 1}/${blocks.length})` : phaseMeta.en,
            phaseLabelVi: blocks.length > 1 ? `${phaseMeta.vi} (${bIdx + 1}/${blocks.length})` : phaseMeta.vi,
            text: blk,
            intonationText: buildAutoIntonation(blk),
            meaningEn: `${card.category || 'Speaking Part 2'} model segment`,
            meaningVi: `Đoạn bài mẫu Speaking Part 2 (${card.topic || card.category || ''})`,
            mouthTipEn: 'Match natural Part 2 pacing, pausing cleanly at commas and thought groups.',
            mouthTipVi: 'Giữ nhịp kể chuyện Part 2 tự nhiên, ngắt nhẹ ở dấu phẩy và cụm ý.',
            keyPhrases: pIdx === 0 ? (card.vocabHints || []).slice(0, 3).map(v => v.phrase) : []
          });
        });
      });

      if (segments.length >= 2) {
        tasks.push({
          id: `shad-bank-${card.id}`,
          part: 'part2',
          bandLevel: '8.0',
          topicEn: card.topic || card.category || 'Part 2 Cue Card',
          topicVi: card.topic || card.category || 'Part 2 Cue Card',
          titleEn: `Cue Card: ${card.title}`,
          titleVi: `Cue Card: ${card.title}`,
          promptEn: card.title,
          promptVi: card.title,
          cueBulletsEn: card.cueCard?.bullets || [],
          cueBulletsVi: card.cueCard?.bullets || [],
          sourceTag: 'Speaking Bank',
          xpReward: 125,
          segments
        });
      }
    });

    // 2. Adapt Part 1 Topics (first 3 topics -> Examiner prompt_only + Candidate sentence/paragraph)
    (mod.SPEAKING_PART1_TOPICS || []).slice(0, 3).forEach((topic) => {
      const segments = [];
      (topic.questions || []).slice(0, 3).forEach((q, idx) => {
        if (!q?.question || !q?.sampleAnswer) return;
        segments.push({
          id: `${topic.id}-q${idx + 1}`,
          unitType: 'prompt_only',
          phaseLabelEn: `Examiner Question ${idx + 1}`,
          phaseLabelVi: `Câu hỏi Giám khảo ${idx + 1}`,
          text: q.question,
          intonationText: buildAutoIntonation(q.question),
          meaningEn: q.focus || 'Speaking Part 1 question',
          meaningVi: q.strategy || q.focus || 'Câu hỏi Speaking Part 1',
          mouthTipEn: 'Listen to the question stress before shadowing the model answer.',
          mouthTipVi: 'Nghe trọng âm câu hỏi trước khi nhại câu trả lời mẫu.'
        });

        const blocks = splitLongTextIntoReadableBlocks(q.sampleAnswer);
        blocks.slice(0, 1).forEach((blk) => {
          const sentCount = blk.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
          segments.push({
            id: `${topic.id}-a${idx + 1}`,
            unitType: sentCount >= 2 ? 'paragraph' : 'sentence',
            phaseLabelEn: `Model Answer ${idx + 1}`,
            phaseLabelVi: `Trả lời mẫu ${idx + 1}`,
            text: blk,
            intonationText: buildAutoIntonation(blk),
            meaningEn: 'Band 7.5+ Speaking Part 1 sample response',
            meaningVi: 'Câu trả lời mẫu Speaking Part 1 Band 7.5+',
            mouthTipEn: 'Articulate collocations smoothly and preserve final consonants.',
            mouthTipVi: 'Đọc mượt các cụm collocations và bật rõ phụ âm cuối.',
            keyPhrases: (q.vocabHints || []).slice(0, 3).map(v => v.phrase)
          });
        });
      });

      if (segments.length >= 4) {
        tasks.push({
          id: `shad-bank-${topic.id}`,
          part: 'part1',
          bandLevel: '7.5',
          topicEn: topic.category || 'Part 1',
          topicVi: topic.category || 'Part 1',
          titleEn: `Speaking Part 1: ${topic.title}`,
          titleVi: `Speaking Part 1: ${topic.title}`,
          promptEn: `Examiner interview on ${topic.title}.`,
          promptVi: `Phỏng vấn Speaking Part 1 chủ đề ${topic.title}.`,
          sourceTag: 'Speaking Bank',
          xpReward: 100,
          segments
        });
      }
    });

    // 3. Adapt Part 3 Discussion Sets (first 2 sets; note Part 3 items use `topic`, fallback to `title`)
    (mod.SPEAKING_PART3_QUESTIONS || []).slice(0, 2).forEach((set, sIdx) => {
      const setTitle = set.topic || set.title || `Part 3 Topic ${sIdx + 1}`;
      const segments = [];
      (set.questions || []).slice(0, 3).forEach((q, idx) => {
        if (!q?.question || !q?.sampleAnswer) return;
        segments.push({
          id: `${set.linkedPart2Id || `p3-${sIdx}`}-q${idx + 1}`,
          unitType: 'prompt_only',
          phaseLabelEn: `Examiner Prompt ${idx + 1}`,
          phaseLabelVi: `Câu hỏi Part 3 #${idx + 1}`,
          text: q.question,
          intonationText: buildAutoIntonation(q.question),
          meaningEn: q.analysisType || 'Part 3 analytical question',
          meaningVi: q.strategy || q.analysisType || 'Câu hỏi phân tích Part 3',
          mouthTipEn: 'Listen for analytical emphasis.',
          mouthTipVi: 'Nghe nhấn trọng âm lập luận.'
        });

        const blocks = splitLongTextIntoReadableBlocks(q.sampleAnswer);
        blocks.slice(0, 1).forEach((blk) => {
          const sentCount = blk.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
          segments.push({
            id: `${set.linkedPart2Id || `p3-${sIdx}`}-a${idx + 1}`,
            unitType: sentCount >= 2 ? 'paragraph' : 'sentence',
            phaseLabelEn: `Analytical Answer ${idx + 1}`,
            phaseLabelVi: `Luận điểm mẫu ${idx + 1}`,
            text: blk,
            intonationText: buildAutoIntonation(blk),
            meaningEn: 'Band 8.0+ Part 3 analytical response',
            meaningVi: 'Câu trả lời phân tích Band 8.0+ Part 3',
            mouthTipEn: 'Pause cleanly after discourse markers and keep steady rhythm.',
            mouthTipVi: 'Ngắt nhẹ sau từ nối học thuật và giữ nhịp đều.',
            keyPhrases: (q.vocabHints || []).slice(0, 3).map(v => v.phrase)
          });
        });
      });

      if (segments.length >= 4) {
        tasks.push({
          id: `shad-bank-p3-${set.linkedPart2Id || sIdx + 1}`,
          part: 'part3',
          bandLevel: '8.0',
          topicEn: setTitle,
          topicVi: setTitle,
          titleEn: `Part 3: ${setTitle}`,
          titleVi: `Part 3: ${setTitle}`,
          promptEn: `Abstract two-way discussion on ${setTitle}.`,
          promptVi: `Thảo luận chuyên sâu Part 3 chủ đề ${setTitle}.`,
          sourceTag: 'Speaking Bank',
          xpReward: 125,
          segments
        });
      }
    });
  } catch (err) {
    console.warn('[ShadowingData] Failed to adapt Speaking Bank topics:', err);
  }

  cachedSpeakingShadowTasks = tasks;
  return tasks;
}

/**
 * Validates & normalizes an external/bulk-ingested IELTS Speaking sample task so it works seamlessly
 * with open access, bilingual labels, Smart Flow chunking, and pass-gated scoring.
 */
export function normalizeShadowingTask(rawTask = {}, fallbackIndex = 0) {
  const partRaw = String(rawTask.part || '').toLowerCase().trim();
  const part =
    partRaw === '1' || partRaw === 'part1' || partRaw === 'part 1'
      ? 'part1'
      : partRaw === '3' || partRaw === 'part3' || partRaw === 'part 3'
      ? 'part3'
      : 'part2';

  const titleEn = String(rawTask.titleEn || rawTask.title || rawTask.topic || `Speaking Sample #${fallbackIndex + 1}`).trim();
  const titleVi = String(rawTask.titleVi || titleEn).trim();
  const topicEn = String(rawTask.topicEn || rawTask.category || 'IELTS Speaking').trim();
  const topicVi = String(rawTask.topicVi || topicEn).trim();
  const promptEn = String(rawTask.promptEn || rawTask.prompt || rawTask.question || titleEn).trim();
  const promptVi = String(rawTask.promptVi || promptEn).trim();

  let segments = [];
  if (Array.isArray(rawTask.segments) && rawTask.segments.length > 0) {
    segments = rawTask.segments
      .map((seg, i) => {
        const cleanText = String(seg?.text || '').trim();
        if (!cleanText) return null;
        const inferredType =
          seg.unitType ||
          (splitIntoSentencesSafe(cleanText).length >= 2 ? 'paragraph' : 'sentence');
        return {
          id: String(seg.id || `seg-${i + 1}`),
          unitType: ['prompt_only', 'sentence', 'paragraph'].includes(inferredType)
            ? inferredType
            : 'sentence',
          phaseLabelEn: String(seg.phaseLabelEn || (inferredType === 'paragraph' ? `Paragraph ${i + 1}` : `Sentence ${i + 1}`)).trim(),
          phaseLabelVi: String(seg.phaseLabelVi || seg.phaseLabelEn || (inferredType === 'paragraph' ? `Đoạn ${i + 1}` : `Câu ${i + 1}`)).trim(),
          text: cleanText,
          intonationText: seg.intonationText || buildAutoIntonation(cleanText),
          meaningEn: String(seg.meaningEn || '').trim(),
          meaningVi: String(seg.meaningVi || seg.meaningEn || '').trim(),
          mouthTipEn: String(seg.mouthTipEn || 'Articulate stressed syllables and final consonants cleanly.').trim(),
          mouthTipVi: String(seg.mouthTipVi || seg.mouthTipEn || 'Nhấn rõ trọng âm và bật gọn phụ âm cuối.').trim(),
          keyPhrases: Array.isArray(seg.keyPhrases) ? seg.keyPhrases : []
        };
      })
      .filter(Boolean);
  } else {
    if (rawTask.question) {
      const qText = String(rawTask.question).trim();
      segments.push({
        id: 'seg-q1',
        unitType: 'prompt_only',
        phaseLabelEn: 'Examiner Question',
        phaseLabelVi: 'Câu hỏi Giám khảo',
        text: qText,
        intonationText: buildAutoIntonation(qText),
        meaningEn: 'Examiner prompt question.',
        meaningVi: 'Câu hỏi gợi mở từ Giám khảo.',
        mouthTipEn: 'Listen carefully before shadowing.',
        mouthTipVi: 'Lắng nghe câu hỏi trước khi nhại lại.'
      });
    }
    const rawBody = String(rawTask.sampleAnswer || rawTask.answer || rawTask.text || '').trim();
    const rawParas = rawBody.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    let idx = 0;
    rawParas.forEach((p) => {
      splitLongTextIntoReadableBlocks(p).forEach((blk) => {
        idx += 1;
        const unitType = splitIntoSentencesSafe(blk).length >= 2 ? 'paragraph' : 'sentence';
        segments.push({
          id: `seg-${idx}`,
          unitType,
          phaseLabelEn: unitType === 'paragraph' ? `Paragraph ${idx}` : `Sentence ${idx}`,
          phaseLabelVi: unitType === 'paragraph' ? `Đoạn ${idx}` : `Câu ${idx}`,
          text: blk,
          intonationText: buildAutoIntonation(blk),
          meaningEn: `${part.toUpperCase()} model segment`,
          meaningVi: `Đoạn bài mẫu ${part.toUpperCase()}`,
          mouthTipEn: 'Keep natural pacing and crisp ending consonants.',
          mouthTipVi: 'Giữ nhịp tự nhiên và bật rõ âm cuối.',
          keyPhrases: []
        });
      });
    });
  }

  const shadowableCount = segments.filter(s => s.unitType !== 'prompt_only').length;
  return {
    id: String(rawTask.id || `shad-ext-${fallbackIndex + 1}`),
    part,
    bandLevel: String(rawTask.bandLevel || rawTask.band || '7.5'),
    requiresAuth: false,
    topicEn,
    topicVi,
    titleEn,
    titleVi,
    promptEn,
    promptVi,
    cueBulletsEn: Array.isArray(rawTask.cueBulletsEn) ? rawTask.cueBulletsEn : (Array.isArray(rawTask.cueBullets) ? rawTask.cueBullets : []),
    cueBulletsVi: Array.isArray(rawTask.cueBulletsVi) ? rawTask.cueBulletsVi : (Array.isArray(rawTask.cueBullets) ? rawTask.cueBullets : []),
    sourceTag: String(rawTask.sourceTag || 'Official Bank').trim(),
    xpReward: Number(rawTask.xpReward) || Math.max(60, shadowableCount * 25),
    segments
  };
}
