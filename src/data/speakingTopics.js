/**
 * speakingTopics.js - Authentic IELTS Speaking Topic & Question Bank
 * Structured strictly to Cambridge & IDP/BC Assessment Standards.
 * Covers:
 * - Part 1: Introduction & Interview (Daily Topics, Personal Habits, Work/Study)
 * - Part 2: Long Turn (Cue Cards with Prompts, 1-min Note Guidelines, 2-min Speaking)
 * - Part 3: Two-Way Discussion (Abstract, Societal, Critical Thinking & Follow-ups)
 * - Curated Full Mock Test Packs (11-14 min complete exam sessions)
 */

export const SPEAKING_EXAMINER_PROFILES = [
  {
    id: 'examiner-arthur',
    name: 'Mr. Arthur Pendelton',
    accent: 'British English (RP - London)',
    gender: 'male',
    role: 'Senior Cambridge Examiner',
    avatar: '👨‍💼',
    desc: 'Giọng Anh chuẩn Received Pronunciation, ngữ điệu điềm đạm, khảo thí khách quan chuẩn mực.',
    speechVoiceHint: 'en-GB'
  },
  {
    id: 'examiner-eleanor',
    name: 'Ms. Eleanor Vance',
    accent: 'British English (Oxford)',
    gender: 'female',
    role: 'IDP Certified Senior Examiner',
    avatar: '👩‍💼',
    desc: 'Giọng Nữ Anh truyền cảm, phát âm rõ ràng, nhịp độ vừa phải giúp thí sinh tự tin.',
    speechVoiceHint: 'en-GB'
  },
  {
    id: 'examiner-oliver',
    name: 'Mr. Oliver Hayes',
    accent: 'North American (New York)',
    gender: 'male',
    role: 'Academic Speaking Specialist',
    avatar: '👨‍🏫',
    desc: 'Giọng Bắc Mỹ hiện đại, năng động, phong thái phỏng vấn tự nhiên và linh hoạt.',
    speechVoiceHint: 'en-US'
  }
];

// =========================================================================
// PART 1 TOPIC BANK (12 Authenticated Forecast & Classic Topics)
// =========================================================================
export const SPEAKING_PART1_TOPICS = [
  {
    id: 'p1-work-study',
    title: 'Work & Studies',
    category: 'Daily Life & Occupation',
    tag: 'Classic Essential',
    questions: [
      {
        qId: 'p1-ws-1',
        question: 'Do you currently work or are you a student?',
        focus: 'Direct Identification & Present State',
        strategy: 'A.R.E.A: Trả lời trực diện công việc/ngành học -> Nêu lý do chọn -> Chi tiết nhiệm vụ/môn học yêu thích -> Cảm nghĩ ngắn gọn.',
        vocabHints: [
          { phrase: 'pursue an undergraduate degree in', meaningVi: 'theo đuổi bằng cử nhân ngành...' },
          { phrase: 'heavy workload', meaningVi: 'khối lượng công việc/bài vở lớn' },
          { phrase: 'intellectually stimulating', meaningVi: 'kích thích trí tuệ / bổ ích' },
          { phrase: 'climb the corporate ladder', meaningVi: 'thăng tiến trong sự nghiệp' }
        ],
        sampleAnswer: 'At the moment, I am pursuing an undergraduate degree in Computer Science at a reputable local university. What captivates me most about this discipline is that it is intellectually stimulating; it challenges me to devise algorithmic solutions to complex real-world dilemmas on a daily basis.'
      },
      {
        qId: 'p1-ws-2',
        question: 'Why did you choose that particular field of study or career path?',
        focus: 'Reasoning & Personal Motivation',
        strategy: 'Nêu động lực cốt lõi (đam mê sâu sắc hoặc tiềm năng phát triển sự nghiệp trong tương lai).',
        vocabHints: [
          { phrase: 'have a deep-seated passion for', meaningVi: 'có niềm đam mê sâu sắc với...' },
          { phrase: 'promising career prospects', meaningVi: 'triển vọng nghề nghiệp hứa hẹn' },
          { phrase: 'align seamlessly with my core strengths', meaningVi: 'phù hợp hoàn hảo với điểm mạnh cốt lõi' }
        ],
        sampleAnswer: 'Well, to be perfectly candid, I have harboured a deep-seated fascination with cutting-edge digital technologies since my formative teenage years. Furthermore, this vocation offers exceptionally promising career prospects in our increasingly automated global economy.'
      },
      {
        qId: 'p1-ws-3',
        question: 'What do you find most demanding about your work or study?',
        focus: 'Overcoming Daily Challenges',
        strategy: 'Đưa ra khó khăn cụ thể (áp lực deadline, cân bằng cuộc sống) kèm cách bạn giải quyết nó.',
        vocabHints: [
          { phrase: 'meet tight deadlines', meaningVi: 'kịp thời hạn gấp gáp' },
          { phrase: 'burnout', meaningVi: 'kiệt sức vì công việc' },
          { phrase: 'strike a healthy work-life balance', meaningVi: 'cân bằng giữa công việc và đời sống' }
        ],
        sampleAnswer: 'Undoubtedly, the most grueling aspect is learning how to strike a healthy work-life balance. With demanding assignments and tight deadlines constantly looming, warding off mental burnout requires rigorous self-discipline and astute time management.'
      }
    ]
  },
  {
    id: 'p1-hometown',
    title: 'Hometown & Living Environment',
    category: 'Personal Background',
    tag: 'Classic Essential',
    questions: [
      {
        qId: 'p1-ht-1',
        question: 'Where is your hometown located?',
        focus: 'Geographical Location & Vibe',
        strategy: 'Xác định vị trí địa lý kèm 1 tính từ miêu tả đặc sắc (bustling metropolis, coastal haven, tranquil countryside).',
        vocabHints: [
          { phrase: 'bustling coastal metropolis', meaningVi: 'đô thị duyên hải sầm uất' },
          { phrase: 'situated in the heart of', meaningVi: 'tọa lạc ngay tại trung tâm của...' },
          { phrase: 'vibrant culinary landscape', meaningVi: 'bức tranh ẩm thực sôi động' }
        ],
        sampleAnswer: 'I was born and brought up in Da Nang, which is a bustling coastal metropolis situated in central Vietnam. It is internationally celebrated for its pristine sandy beaches and picturesque architectural bridges.'
      },
      {
        qId: 'p1-ht-2',
        question: 'What do you cherish most about living in your hometown?',
        focus: 'Special Highlights & Affection',
        strategy: 'Nhấn mạnh vào con người (hospitable), nhịp sống (laid-back pace) hoặc tiện ích đô thị.',
        vocabHints: [
          { phrase: 'laid-back pace of life', meaningVi: 'nhịp sống thư thái, không xô bồ' },
          { phrase: 'warm-hearted and hospitable', meaningVi: 'nồng hậu và hiếu khách' },
          { phrase: 'strong sense of community', meaningVi: 'tình làng nghĩa xóm gắn kết' }
        ],
        sampleAnswer: 'What I cherish above all else is the harmonious equilibrium between modern urban convenience and an unhurried, laid-back pace of life. The residents are remarkably warm-hearted and hospitable, fostering a comforting sense of community.'
      },
      {
        qId: 'p1-ht-3',
        question: 'Has your hometown changed noticeably in recent years?',
        focus: 'Past vs Present Contrast',
        strategy: 'Sử dụng thì Hiện tại hoàn thành (has undergone radical transformation) để so sánh xưa và nay.',
        vocabHints: [
          { phrase: 'undergone radical transformations', meaningVi: 'trải qua những chuyển biến sâu sắc' },
          { phrase: 'commercial complexes and skyscrapers', meaningVi: 'trung tâm thương mại và tòa nhà chọc trời' },
          { phrase: 'bolster public infrastructure', meaningVi: 'tăng cường hạ tầng công cộng' }
        ],
        sampleAnswer: 'Tremendously, in fact! Over the preceding decade, my hometown has undergone radical transformations. Where sleepy lanes once stood, contemporary commercial complexes and soaring skyscrapers have sprung up, vastly bolstering public infrastructure.'
      }
    ]
  },
  {
    id: 'p1-technology',
    title: 'Technology & Artificial Intelligence',
    category: 'Modern Trends',
    tag: 'Hot Forecast 2026',
    questions: [
      {
        qId: 'p1-tech-1',
        question: 'What technological gadget do you use most frequently?',
        focus: 'Usage Habits & Necessity',
        strategy: 'Chỉ ra thiết bị quen thuộc và lý do nó trở thành vật bất ly thân.',
        vocabHints: [
          { phrase: 'indispensable asset', meaningVi: 'tài sản / vật dụng không thể thiếu' },
          { phrase: 'streamline daily productivity', meaningVi: 'tối ưu hóa năng suất hàng ngày' },
          { phrase: 'seamless synchronization', meaningVi: 'đồng bộ hóa liền mạch' }
        ],
        sampleAnswer: 'Without a shadow of a doubt, it is my smartphone. It has evolved into an indispensable asset that I rely upon not merely for communication, but also for streamlining my academic productivity, calendar scheduling, and cloud navigation.'
      },
      {
        qId: 'p1-tech-2',
        question: 'Do you believe Artificial Intelligence is beneficial for modern students?',
        focus: 'Opinion & Educational Evaluation',
        strategy: 'Đưa ra quan điểm tích cực nhưng nêu mặt hai lưỡi (a double-edged sword) nếu quá phụ thuộc.',
        vocabHints: [
          { phrase: 'tailor personalized learning paths', meaningVi: 'cá nhân hóa lộ trình học' },
          { phrase: 'democratize educational materials', meaningVi: 'bình đẳng hóa tài nguyên học tập' },
          { phrase: 'intellectual complacency', meaningVi: 'sự tự mãn / lười biếng về trí tuệ' }
        ],
        sampleAnswer: 'I firmly subscribe to the view that AI holds tremendous promise for education, as it can tailor personalized learning paths for individual students. Nevertheless, learners must beware of intellectual complacency and avoid delegating critical thinking entirely to algorithms.'
      },
      {
        qId: 'p1-tech-3',
        question: 'Did you use computers as much when you were a child?',
        focus: 'Past Habits vs Childhood Contrast',
        strategy: 'Dùng cấu trúc Used to / Would để miêu tả quá khứ và đối chiếu với hiện tại.',
        vocabHints: [
          { phrase: 'rudimentary desktop terminal', meaningVi: 'máy tính bàn thô sơ thời trước' },
          { phrase: 'digital native generation', meaningVi: 'thế hệ sinh ra trong thời đại số' },
          { phrase: 'infrequent educational games', meaningVi: 'trò chơi giáo dục thi thoảng' }
        ],
        sampleAnswer: 'Nowhere near as much as the current digital native generation. In my childhood, our household merely possessed a rudimentary desktop terminal, which I operated only on weekends for school typing assignments and infrequent educational games.'
      }
    ]
  },
  {
    id: 'p1-music',
    title: 'Music & Leisure',
    category: 'Lifestyle & Hobbies',
    tag: 'Classic Essential',
    questions: [
      {
        qId: 'p1-mu-1',
        question: 'What genre of music do you enjoy listening to most?',
        focus: 'Personal Taste & Emotional Resonance',
        strategy: 'Nêu thể loại yêu thích (Acoustic, Jazz, Classical) và cảm xúc nó mang lại (unwind, de-stress).',
        vocabHints: [
          { phrase: 'eclectic musical palate', meaningVi: 'gu âm nhạc đa dạng, phong phú' },
          { phrase: 'soothing acoustic melodies', meaningVi: 'giai điệu acoustic êm dịu' },
          { phrase: 'decompress after an exhausting day', meaningVi: 'xả hơi, giải tỏa căng thẳng' }
        ],
        sampleAnswer: 'I pride myself on possessing an eclectic musical palate, though I am particularly partial to soothing acoustic indie tunes. These gentle melodies serve as an indispensable sanctuary for me to decompress after an exhausting day at university.'
      },
      {
        qId: 'p1-mu-2',
        question: 'Can you play any musical instrument?',
        focus: 'Skill & Past Experience',
        strategy: 'Nếu có: kể kinh nghiệm; Nếu không: nêu lý do và nhạc cụ mong muốn học trong tương lai.',
        vocabHints: [
          { phrase: 'strum chords comfortably', meaningVi: 'gảy hợp âm dễ dàng' },
          { phrase: 'musical inclination', meaningVi: 'năng khiếu âm nhạc' },
          { phrase: 'acoustic guitar fundamentals', meaningVi: 'các kỹ thuật cơ bản đàn guitar acoustic' }
        ],
        sampleAnswer: 'I have mastered the acoustic guitar fundamentals. While I wouldn\'t profess to being a virtuoso, I can strum chords comfortably and accompany close friends during impromptu weekend campfire sessions.'
      }
    ]
  },
  {
    id: 'p1-sports-health',
    title: 'Sports, Fitness & Physical Health',
    category: 'Health & Well-being',
    tag: 'High Frequency',
    questions: [
      {
        qId: 'p1-sp-1',
        question: 'Do you engage in any regular physical exercise?',
        focus: 'Fitness Routine & Habit',
        strategy: 'Khẳng định thói quen (gym, jogging, swimming) và tần suất mỗi tuần.',
        vocabHints: [
          { phrase: 'maintain a disciplined fitness regimen', meaningVi: 'duy trì chế độ tập luyện kỷ luật' },
          { phrase: 'cardiovascular endurance', meaningVi: 'sức bền tim mạch' },
          { phrase: 'sedentary lifestyle', meaningVi: 'lối sống ít vận động, ngồi nhiều' }
        ],
        sampleAnswer: 'Yes indeed, I make a conscious effort to maintain a disciplined fitness regimen. Roughly three to four times a week, I go for early morning jogs around the park, which bolsters my cardiovascular endurance and prevents a sedentary lifestyle.'
      },
      {
        qId: 'p1-sp-2',
        question: 'Did you participate in sports when you were younger?',
        focus: 'Childhood Memories & School Sports',
        strategy: 'Kể về môn thể thao ở trường học (football, badminton) và tinh thần đồng đội.',
        vocabHints: [
          { phrase: 'avid football enthusiast', meaningVi: 'người đam mê bóng đá cuồng nhiệt' },
          { phrase: 'camaraderie and team spirit', meaningVi: 'tình đồng đội và tinh thần tập thể' },
          { phrase: 'intramural competitions', meaningVi: 'các giải đấu thể thao nội bộ trường' }
        ],
        sampleAnswer: 'Back in primary and secondary school, I was an avid football enthusiast. I frequently represented our class in intramural competitions, which not only sharpened my physical agility but also instilled in me a deep appreciation for camaraderie and team spirit.'
      }
    ]
  },
  {
    id: 'p1-daily-routine',
    title: 'Daily Routine & Time Management',
    category: 'Daily Life',
    tag: 'High Frequency',
    questions: [
      {
        qId: 'p1-dr-1',
        question: 'What is your typical morning routine like?',
        focus: 'Chronological Progression of Morning',
        strategy: 'Miêu tả từ lúc thức dậy, bữa sáng, đến lúc bắt đầu làm việc/học tập.',
        vocabHints: [
          { phrase: 'early riser / morning lark', meaningVi: 'người có thói quen dậy sớm' },
          { phrase: 'invigorating cup of brew', meaningVi: 'tách cà phê đánh thức năng lượng' },
          { phrase: 'map out daily priorities', meaningVi: 'lập kế hoạch các ưu tiên trong ngày' }
        ],
        sampleAnswer: 'I am naturally an early riser. I usually wake up at around six o\'clock, perform a brief stretching session, and brew an invigorating cup of pour-over coffee. Before opening my laptop, I spend ten minutes mapping out my daily priorities in a planner.'
      },
      {
        qId: 'p1-dr-2',
        question: 'Do you prefer having a planned schedule or being spontaneous?',
        focus: 'Personality & Approach to Time',
        strategy: 'Đưa ra phong cách quản lý thời gian của bản thân, kết hợp tính kỷ luật và sự linh hoạt.',
        vocabHints: [
          { phrase: 'structured timetable', meaningVi: 'thời gian biểu có cấu trúc rõ ràng' },
          { phrase: 'allow for flexibility', meaningVi: 'dành chỗ cho sự linh hoạt' },
          { phrase: 'unforeseen contingencies', meaningVi: 'những tình huống phát sinh bất ngờ' }
        ],
        sampleAnswer: 'On balance, I lean towards following a structured timetable because it protects me from procrastination. That being said, I always leave breathing room in my afternoon for spontaneity and unforeseen contingencies.'
      }
    ]
  }
];

// =========================================================================
// PART 2 CUE CARDS (LONG TURN - 10 Authentic Cards across 4 Classic Themes)
// =========================================================================
export const SPEAKING_PART2_CUECARDS = [
  {
    id: 'p2-tech-device',
    title: 'Describe an electronic device or technology that you find extremely useful',
    category: 'Objects & Technology',
    tag: 'Hot Forecast 2026',
    topic: 'Useful Technology',
    cueCard: {
      intro: 'You should say:',
      bullets: [
        'What the device or technology is',
        'How often and when you use it',
        'What specific features make it so beneficial to you',
        'And explain how your daily life would be different without it'
      ]
    },
    preparationTime: 60,
    speakingTime: 120,
    mindmapNotes: [
      'Device: Sony WH-1000XM5 wireless noise-cancelling headphones',
      'Usage: Daily, during noisy bus commutes & deep focused study sessions',
      'Key features: Active Noise Cancellation (ANC), 30h battery, ergonomic fit',
      'Impact: Shields from urban noise pollution, skyrockets intellectual productivity'
    ],
    vocabHints: [
      { phrase: 'state-of-the-art gadget', meaningVi: 'thiết bị tối tân, hiện đại' },
      { phrase: 'active noise-cancellation (ANC)', meaningVi: 'khử tiếng ồn chủ động' },
      { phrase: 'enter a deep-work flow state', meaningVi: 'bước vào trạng thái tập trung cao độ' },
      { phrase: 'cacophony of urban traffic', meaningVi: 'âm thanh hỗn loạn của giao thông đô thị' },
      { phrase: 'drastically boost efficiency', meaningVi: 'gia tăng hiệu suất rõ rệt' }
    ],
    sampleAnswer: 'I would like to talk about my noise-cancelling wireless headphones, which I consider to be an absolute game-changer in my daily routine.\n\nI acquired this state-of-the-art gadget approximately a year ago, primarily to help me cope with the relentless cacophony of living in a bustling metropolitan area. I use it practically every single day, whether I am commuting on crowded public buses, exercising at the gym, or sitting in open-plan office spaces trying to meet strict deadlines.\n\nWhat makes this device profoundly beneficial is its cutting-edge active noise-cancellation technology. By generating inverted sound waves, it virtually eliminates low-frequency ambient chatter and traffic rumble at the flip of a switch. This sensory isolation creates an instantaneous sanctuary of silence, allowing me to enter a deep-work flow state where my intellectual productivity and reading comprehension skyrocket. Additionally, the ergonomic design and 30-hour battery life ensure seamless all-day comfort.\n\nWere I to be deprived of this device, my daily productivity would suffer substantially. I would constantly fall prey to workplace distractions and auditory fatigue. In short, it is far more than an entertainment accessory; it is an indispensable psychological sanctuary that empowers me to work with unprecedented clarity and focus.',
    examinerFollowUp: 'Do you think elderly people find it harder to adopt such advanced gadgets?'
  },
  {
    id: 'p2-challenging-decision',
    title: 'Describe a difficult or challenging decision you made that led to a positive result',
    category: 'Events & Experiences',
    tag: 'Classic Essential',
    topic: 'Life Decisions',
    cueCard: {
      intro: 'You should say:',
      bullets: [
        'What the decision was and when you made it',
        'Why it was difficult or stressful to decide',
        'What choices or alternatives you had',
        'And explain why this decision ultimately yielded a positive outcome'
      ]
    },
    preparationTime: 60,
    speakingTime: 120,
    mindmapNotes: [
      'Decision: Pivoting career path from banking to tech / software design',
      'When: 2 years ago, midst of economic uncertainty',
      'Difficulty: Leaving stable lucrative salary vs starting anew as a junior',
      'Outcome: Found genuine intellectual fulfillment, higher growth & mental well-being'
    ],
    vocabHints: [
      { phrase: 'career crossroads', meaningVi: 'ngã rẽ sự nghiệp' },
      { phrase: 'leap of faith', meaningVi: 'bước nhảy liều lĩnh nhưng đặt trọn niềm tin' },
      { phrase: 'leave my comfort zone', meaningVi: 'bước ra khỏi vùng an toàn' },
      { phrase: 'lucrative yet soul-draining', meaningVi: 'lương cao nhưng vắt kiệt tinh thần' },
      { phrase: 'reap substantial rewards', meaningVi: 'gặt hái thành quả to lớn' }
    ],
    sampleAnswer: 'I am going to recount a pivotal moment in my life when I had to make the nerve-wracking decision to execute a complete career transition.\n\nThis occurred roughly two years ago when I was at a profound career crossroads. At the time, I was employed in corporate banking, a position that granted a stable and lucrative income, yet felt profoundly monotonous and emotionally draining. I was wrestling with whether to maintain my secure corporate role or take a daring leap of faith into software product management.\n\nThe decision was agonising because everyone around me advised against forfeiting financial security in an uncertain economic climate. Taking this step meant stepping outside my comfort zone, taking a considerable pay cut, and enduring months of rigorous self-study and sleepless nights mastering digital methodologies.\n\nNevertheless, I chose to trust my intuition. Looking back, that calculated risk yielded extraordinarily rewarding dividends. Not only did I rediscover my genuine intellectual passion, but I also landed a dynamic role at a fast-growing tech venture with boundless growth opportunities. This experience reinforced the timeless adage that meaningful personal growth is invariably forged in moments of profound uncertainty.',
    examinerFollowUp: 'Do you typically consult your parents before making major life choices?'
  },
  {
    id: 'p2-memorable-journey',
    title: 'Describe an unforgettable journey or trip that you took',
    category: 'Places & Travel',
    tag: 'Classic Essential',
    topic: 'Memorable Trip',
    cueCard: {
      intro: 'You should say:',
      bullets: [
        'Where you went and who accompanied you',
        'How you travelled there',
        'What activities you engaged in during the trip',
        'And explain why this particular journey remains so memorable'
      ]
    },
    preparationTime: 60,
    speakingTime: 120,
    mindmapNotes: [
      'Place: Ha Giang Loop in northern mountainous Vietnam',
      'Who: Two close university confidants',
      'Travel: Motorbike road trip traversing perilous mountain passes (Ma Pi Leng)',
      'Memories: Magnificent limestone karst landscapes, ethnic hospitality, self-discovery'
    ],
    vocabHints: [
      { phrase: 'breathtaking panoramic vistas', meaningVi: 'cảnh quan toàn cảnh ngoạn mục' },
      { phrase: 'perilous hairpin turns', meaningVi: 'những khúc cua tay áo nguy hiểm' },
      { phrase: 'immerse oneself in indigenous culture', meaningVi: 'đắm mình vào văn hóa bản địa' },
      { phrase: 'unvarnished natural splendor', meaningVi: 'vẻ đẹp tự nhiên hoang sơ' },
      { phrase: 'etch indelibly in my memory', meaningVi: 'khắc sâu không bao giờ phai mờ' }
    ],
    sampleAnswer: 'I would like to reminisce about an exhilarating road trip I took through the breathtaking Ha Giang Loop in the northern highlands of Vietnam.\n\nThis adventure took place last autumn alongside two of my closest university confidants. Rather than opting for a mundane packaged tour, we rented rugged motorbikes to traverse the legendary mountain passes independently.\n\nThe route is globally famed for its perilous hairpin turns and sheer cliff faces, particularly the awe-inspiring Ma Pi Leng Pass. Riding beneath the towering limestone peaks while overlooking the emerald Nho Que River winding below was an ethereal experience. Along the journey, we stayed at traditional ethnic homestays, savoured local delicacies cooked over open hearths, and interacted with radiant local children whose smiles were contagious.\n\nWhat makes this expedition etched indelibly in my memory was not merely the unvarnished natural splendour, but the intense feeling of liberation and self-reliance. Overcoming the physical fatigue of navigating treacherous mountain terrains bonded us for life and reminded me of the transformative power of venturing off the beaten track.',
    examinerFollowUp: 'Do you prefer travelling alone or with a group of companions?'
  },
  {
    id: 'p2-inspiring-person',
    title: 'Describe an inspiring person you know or admire',
    category: 'People & Personalities',
    tag: 'High Frequency',
    topic: 'Role Models',
    cueCard: {
      intro: 'You should say:',
      bullets: [
        'Who this person is and how you know them',
        'What exceptional qualities or achievements they possess',
        'How they overcome adversity in their life',
        'And explain why this person serves as an inspiration to you'
      ]
    },
    preparationTime: 60,
    speakingTime: 120,
    mindmapNotes: [
      'Person: My maternal grandmother',
      'Background: Lived through wartime hardships, raised 5 children alone',
      'Qualities: Unwavering resilience, boundless compassion, insatiable curiosity',
      'Inspiration: Taught me fortitude, optimism, and grace in the face of adversity'
    ],
    vocabHints: [
      { phrase: 'unwavering emotional fortitude', meaningVi: 'nghị lực tinh thần kiên cường bất khuất' },
      { phrase: 'beacon of wisdom and warmth', meaningVi: 'ngọn hải đăng của trí tuệ và sự ấm áp' },
      { phrase: 'weather countless life storms', meaningVi: 'vượt qua muôn vàn giông bão cuộc đời' },
      { phrase: 'instill moral values', meaningVi: 'thấm nhuần các giá trị đạo đức' }
    ],
    sampleAnswer: 'I would like to speak about a person who has exerted a profound influence on my worldview: my maternal grandmother.\n\nNow in her late seventies, she is the venerable matriarch of our extended family. Having lived through the harrowing tribulations of post-war reconstruction, she had to raise five children virtually single-handedly under extreme economic austerity. Despite possessing no formal higher education, her boundless practical wisdom and emotional intelligence surpass anyone I have ever encountered.\n\nWhat renders her extraordinarily inspiring is her unwavering fortitude and radiant optimism. No matter how devastating the circumstances, she never succumbed to cynicism. Instead, she treated neighbors and strangers alike with unreserved kindness, regularly volunteering at community food kitchens even into her old age.\n\nHer life story serves as my personal compass whenever I confront academic or personal setbacks. She demonstrated that true greatness is not measured by material wealth or social accolades, but by the resilience of one\'s character and the warmth one imparts to those around them.',
    examinerFollowUp: 'Do young people today look up to celebrities more than family elders?'
  }
];

// =========================================================================
// PART 3 TWO-WAY DISCUSSION QUESTIONS (Linked with Part 2 Cue Cards)
// =========================================================================
export const SPEAKING_PART3_QUESTIONS = [
  {
    linkedPart2Id: 'p2-tech-device',
    topic: 'Technology, Automation & Society',
    questions: [
      {
        qId: 'p3-tech-1',
        question: 'How has modern technology transformed interpersonal communication among younger generations?',
        analysisType: 'Societal Impact & Two-sided Evaluation',
        strategy: 'Dùng cấu trúc PEEL: Khẳng định công nghệ thu hẹp khoảng cách địa lý nhưng làm xói mòn chất lượng tương tác trực tiếp (virtual intimacy vs real-world detachment).',
        vocabHints: [
          { phrase: 'virtual interconnectedness', meaningVi: 'sự kết nối ảo xuyên biên giới' },
          { phrase: 'superficial digital exchanges', meaningVi: 'những tương tác kỹ thuật số hời hợt' },
          { phrase: 'diminish empathetic engagement', meaningVi: 'làm suy giảm sự gắn kết thấu cảm' }
        ],
        sampleAnswer: 'In my assessment, technology has exerted a distinctly paradoxical impact. On one hand, instant messaging applications facilitate seamless virtual interconnectedness across continents. Conversely, however, excessive reliance on digital screens often degrades the depth of human empathy, replacing meaningful face-to-face dialogues with superficial text exchanges and curated online personas.'
      },
      {
        qId: 'p3-tech-2',
        question: 'Do you believe Artificial Intelligence will lead to widespread unemployment in the foreseeable future?',
        analysisType: 'Prediction & Economic Forecasting',
        strategy: 'Tránh câu trả lời tuyệt đối hóa. Đưa ra quan điểm: AI sẽ thay thế công việc lặp lại (routine tasks) nhưng đồng thời tạo ra các ngành nghề mới đòi hỏi tư duy sáng tạo và đạo đức.',
        vocabHints: [
          { phrase: 'paradigm shift in the labor market', meaningVi: 'sự chuyển dịch căn bản của thị trường lao động' },
          { phrase: 'obsolete routine vocations', meaningVi: 'các nghề lặp lại lỗi thời' },
          { phrase: 'upskill and adapt', meaningVi: 'nâng cao kỹ năng và thích nghi' }
        ],
        sampleAnswer: 'While concerns regarding technological redundancy are certainly legitimate, I lean toward the view that AI will catalyze a fundamental restructuring of the workforce rather than an outright apocalypse of jobs. Highly repetitive manual and administrative vocations will inevitably become obsolete; nevertheless, new sectors will emerge, requiring workers to continuously upskill in emotional intelligence, complex problem-solving, and AI governance.'
      },
      {
        qId: 'p3-tech-3',
        question: 'Should governments impose stricter regulatory oversight on tech conglomerates regarding data privacy?',
        analysisType: 'Policy & Ethical Evaluation',
        strategy: 'Đưa ra lập luận bảo vệ quyền công dân trước sức mạnh độc quyền của các tập đoàn Big Tech.',
        vocabHints: [
          { phrase: 'stringent regulatory oversight', meaningVi: 'sự giám sát pháp lý chặt chẽ' },
          { phrase: 'monetize sensitive behavioral data', meaningVi: 'thương mại hóa dữ liệu hành vi nhạy cảm' },
          { phrase: 'safeguard digital sovereignty', meaningVi: 'bảo vệ chủ quyền dữ liệu số' }
        ],
        sampleAnswer: 'Unquestionably, stringent regulatory oversight is imperative. In the absence of comprehensive legal frameworks, multinational tech conglomerates are prone to exploiting and monetizing sensitive behavioral data without transparent user consent. Enacting robust data protection laws is essential to safeguarding personal privacy and upholding public trust.'
      }
    ]
  },
  {
    linkedPart2Id: 'p2-challenging-decision',
    topic: 'Decision-Making, Risk & Maturity',
    questions: [
      {
        qId: 'p3-dec-1',
        question: 'Why do some individuals experience severe anxiety when confronted with major life choices?',
        analysisType: 'Psychological Analysis',
        strategy: 'Phân tích hội chứng sợ bỏ lỡ (FOMO), chứng tê liệt vì quá nhiều lựa chọn (analysis paralysis) và nỗi sợ thất bại.',
        vocabHints: [
          { phrase: 'analysis paralysis', meaningVi: 'hội chứng tê liệt do phân tích quá mức' },
          { phrase: 'dread of unintended consequences', meaningVi: 'nỗi sợ các hậu quả ngoài ý muốn' },
          { phrase: 'abundance of viable alternatives', meaningVi: 'sự thừa thãi các lựa chọn khả dĩ' }
        ],
        sampleAnswer: 'Chiefly, it stems from a psychological phenomenon known as analysis paralysis. When confronted with an overwhelming abundance of viable alternatives, individuals tend to over-scrutinize potential drawbacks and harbor an intense dread of regret, thereby becoming mentally incapacitated from committing to any single path.'
      },
      {
        qId: 'p3-dec-2',
        question: 'In your country, who traditionally exerts the greatest influence over young people’s career decisions?',
        analysisType: 'Cultural & Generational Comparison',
        strategy: 'So sánh truyền thống gia đình Á Đông (hiếu đạo, mong muốn ổn định của cha mẹ) với xu hướng tự chủ của giới trẻ Gen Z ngày nay.',
        vocabHints: [
          { phrase: 'familial expectations', meaningVi: 'kỳ vọng từ phía gia đình' },
          { phrase: 'filial piety', meaningVi: 'đạo hiếu, sự phục tùng cha mẹ' },
          { phrase: 'pursuit of self-actualization', meaningVi: 'mưu cầu sự khẳng định bản thân' }
        ],
        sampleAnswer: 'Historically in Vietnamese culture, parental guidance and familial expectations have reigned supreme, with elders steering youngsters toward traditionally secure vocations like medicine, law, or civil service. However, the contemporary generation is increasingly asserting independence, prioritizing personal passions and self-actualization over familial compliance.'
      }
    ]
  },
  {
    linkedPart2Id: 'p2-memorable-journey',
    topic: 'Tourism, Cultural Preservation & Economy',
    questions: [
      {
        qId: 'p3-tour-1',
        question: 'What detrimental repercussions can mass commercial tourism inflict upon fragile indigenous communities?',
        analysisType: 'Environmental & Sociological Impact',
        strategy: 'Phân tích thương mại hóa văn hóa (cultural commodification), ô nhiễm môi trường và xáo trộn nếp sống cư dân bản địa.',
        vocabHints: [
          { phrase: 'cultural commodification', meaningVi: 'sự thương mại hóa văn hóa' },
          { phrase: 'strains on fragile ecosystems', meaningVi: 'áp lực lên các hệ sinh thái mỏng manh' },
          { phrase: 'influx of commercialized tourism', meaningVi: 'làn sóng du lịch thương mại hóa ồ ạt' }
        ],
        sampleAnswer: 'While mass tourism generates immediate economic windfalls, it frequently exacts a grievous toll on indigenous cultures. Sacred customs risk being reduced to commercial spectacles for tourist amusement, while the sudden influx of crowds exerts severe strain on fragile local ecosystems and inflates the cost of living for indigenous residents.'
      },
      {
        qId: 'p3-tour-2',
        question: 'How can national governments strike a sustainable equilibrium between tourism revenue and heritage conservation?',
        analysisType: 'Policy Recommendation',
        strategy: 'Đề xuất giải pháp: Giới hạn lưu lượng khách (visitor quotas), thu thuế sinh thái để tái đầu tư bảo tồn.',
        vocabHints: [
          { phrase: 'enforce daily visitor quotas', meaningVi: 'áp đặt hạn ngạch lượng khách hàng ngày' },
          { phrase: 'reinvest eco-tourism revenues', meaningVi: 'tái đầu tư doanh thu du lịch sinh thái' },
          { phrase: 'sustainable conservation model', meaningVi: 'mô hình bảo tồn bền vững' }
        ],
        sampleAnswer: 'A viable strategy entails enforcing strict daily visitor quotas at sensitive heritage sites and levying eco-taxes on travel operators. The accrued revenues should subsequently be earmarked directly for the continuous preservation of ecological and historical landmarks, ensuring long-term sustainability.'
      }
    ]
  },
  {
    linkedPart2Id: 'p2-inspiring-person',
    topic: 'Leadership, Values & Modern Role Models',
    questions: [
      {
        qId: 'p3-lead-1',
        question: 'What essential qualities distinguish an admirable leader from a mere manager?',
        analysisType: 'Conceptual Comparison',
        strategy: 'So sánh giữa Manager (chú trọng quy trình, số liệu) và Leader (tầm nhìn, sự thấu cảm, truyền cảm hứng).',
        vocabHints: [
          { phrase: 'visionary leadership', meaningVi: 'khả năng lãnh đạo có tầm nhìn xa' },
          { phrase: 'inspire collective commitment', meaningVi: 'truyền cảm hứng cam kết tập thể' },
          { phrase: 'empathetic mentorship', meaningVi: 'sự dìu dắt đầy thấu cảm' }
        ],
        sampleAnswer: 'While a capable manager focuses primarily on operational efficiency and maintaining procedural status quo, a truly admirable leader embodies visionary thinking and empathetic mentorship. Leaders inspire collective commitment not through authoritarian decrees, but by empowering team members to realize their fullest latent potential.'
      },
      {
        qId: 'p3-lead-2',
        question: 'Do you believe modern media elevates celebrities for trivial reasons rather than genuine merit?',
        analysisType: 'Media Criticism & Cultural Critique',
        strategy: 'Phân tích văn hóa influencer, giật gân câu view (clickbait) so với các nhà khoa học, bác sĩ âm thầm cống hiến.',
        vocabHints: [
          { phrase: 'sensationalist media coverage', meaningVi: 'sự đưa tin giật gân, phóng đại' },
          { phrase: 'ephemeral internet fame', meaningVi: 'sự nổi tiếng phù du trên mạng xã hội' },
          { phrase: 'substantive societal contributions', meaningVi: 'những đóng góp xã hội thực chất' }
        ],
        sampleAnswer: 'Regrettably, modern algorithmic media platforms frequently prioritize sensationalist drama over substantive societal contributions. Influencers achieving ephemeral viral fame often command far greater public adulation than scientists, educators, or frontline medical professionals whose quiet contributions genuinely propel civilization forward.'
      }
    ]
  }
];

// =========================================================================
// CURATED FULL MOCK TEST PACKAGES (11 - 14 MINUTE COMPLETE SESSIONS)
// =========================================================================
export const SPEAKING_MOCK_TEST_PACKS = [
  {
    id: 'mock-spk-tech-future',
    title: 'Full Mock Test 01: Công Nghệ, Kỹ Thuật Số & Xã Hội Tương Lai',
    difficulty: 'Medium - Hard',
    targetBand: '7.0 - 8.5',
    estTime: '12 - 14 phút',
    summary: 'Bài thi thử toàn diện mô phỏng phòng thi IDP/BC xoay quanh chủ đề Công nghệ, Thiết bị số và Chuyển dịch việc làm.',
    isPublic: true,
    part1TopicId: 'p1-technology',
    part2CueCardId: 'p2-tech-device',
    part3DiscussionId: 'p2-tech-device'
  },
  {
    id: 'mock-spk-growth-decisions',
    title: 'Full Mock Test 02: Sự Nghiệp, Ngã Rẽ Cuộc Đời & Trưởng Thành',
    difficulty: 'Medium',
    targetBand: '6.5 - 8.0',
    estTime: '11 - 13 phút',
    summary: 'Phòng thi thử tập trung vào kỹ năng phản biện, lập luận về các quyết định quan trọng, công việc và áp lực cuộc sống.',
    isPublic: true,
    part1TopicId: 'p1-work-study',
    part2CueCardId: 'p2-challenging-decision',
    part3DiscussionId: 'p2-challenging-decision'
  },
  {
    id: 'mock-spk-travel-culture',
    title: 'Full Mock Test 03: Du Lịch Khám Phá, Bản Sắc & Phát Triển Bền Vững',
    difficulty: 'Medium',
    targetBand: '6.5 - 8.0',
    estTime: '12 - 14 phút',
    summary: 'Thử thách khả năng kể chuyện biểu cảm (Storytelling) và phân tích các vấn đề du lịch đại chúng, bảo tồn di sản.',
    isPublic: true,
    part1TopicId: 'p1-hometown',
    part2CueCardId: 'p2-memorable-journey',
    part3DiscussionId: 'p2-memorable-journey'
  },
  {
    id: 'mock-spk-role-models',
    title: 'Full Mock Test 04: Hình Mẫu Lý Tưởng, Lãnh Đạo & Giá Trị Xã Hội',
    difficulty: 'Medium - Hard',
    targetBand: '7.0 - 8.5',
    estTime: '12 - 14 phút',
    summary: 'Mô phỏng phòng thi chuyên sâu về con người truyền cảm hứng, phẩm chất lãnh đạo và văn hóa truyền thông hiện đại.',
    isPublic: true,
    part1TopicId: 'p1-daily-routine',
    part2CueCardId: 'p2-inspiring-person',
    part3DiscussionId: 'p2-inspiring-person'
  }
];

// =========================================================================
// COMMUNITY CURATED AI SPEAKING PRACTICE TOPICS & QUESTIONS (NO AUTH REQ)
// =========================================================================
export const COMMUNITY_DEFAULT_P1_TOPICS = [
  {
    id: 'p1-comm-ai-future-jobs',
    title: '✨ [AI Cộng Đồng] Artificial Intelligence & Future Jobs',
    category: 'Technology & Employment',
    tag: 'AI Forecast',
    isPublic: true,
    isCommunity: true,
    isAiGenerated: true,
    creatorEmail: 'AI Community Generator',
    questions: [
      {
        qId: 'p1-comm-ai-1',
        question: 'Do you believe artificial intelligence will significantly transform your chosen career path?',
        focus: 'Direct Career Prediction',
        strategy: 'A.R.E.A: Khẳng định mức độ ảnh hưởng -> Nêu tác vụ cụ thể sẽ tự động hóa -> Nêu kỹ năng con người vẫn giữ vai trò quyết định.',
        vocabHints: [
          { phrase: 'streamline administrative workflows', meaningVi: 'tinh gọn quy trình hành chính' },
          { phrase: 'irreplaceable human empathy', meaningVi: 'sự đồng cảm của con người không thể thay thế' }
        ],
        sampleAnswer: 'Undoubtedly yes. In my prospective field, routine analytical tasks are increasingly handled by machine learning models, allowing professionals to focus on creative problem-solving and interpersonal leadership.'
      },
      {
        qId: 'p1-comm-ai-2',
        question: 'What skills do you think young professionals must acquire to remain competitive alongside AI?',
        focus: 'Adaptability & Core Competencies',
        strategy: 'A.R.E.A: Nêu 2 kỹ năng cốt lõi (Tư duy phản biện + Trí tuệ cảm xúc) -> Đưa ví dụ thực tế.',
        vocabHints: [
          { phrase: 'cognitive adaptability', meaningVi: 'khả năng thích ứng nhận thức' },
          { phrase: 'cross-disciplinary literacy', meaningVi: 'hiểu biết liên ngành' }
        ],
        sampleAnswer: 'I am convinced that cognitive adaptability and emotional intelligence are paramount. While algorithms excel at pattern recognition, synthesizing complex moral decisions remains distinctly human.'
      },
      {
        qId: 'p1-comm-ai-3',
        question: 'How frequently do you personally employ generative AI tools in your daily study or work routine?',
        focus: 'Personal Frequency & Utility',
        strategy: 'A.R.E.A: Nêu tần suất -> Kể tên công cụ/mục đích -> Đánh giá mức độ hữu ích.',
        vocabHints: [
          { phrase: 'indispensable virtual assistant', meaningVi: 'trợ lý ảo không thể thiếu' },
          { phrase: 'synthesize lengthy academic articles', meaningVi: 'tổng hợp các bài báo học thuật dài' }
        ],
        sampleAnswer: 'On an almost daily basis. I utilize generative language models as brainstorming partners to outline complex essays and summarize dense scientific papers.'
      }
    ]
  },
  {
    id: 'p1-comm-green-living',
    title: '✨ [AI Cộng Đồng] Eco-friendly Lifestyle & Green Habits',
    category: 'Environment & Sustainability',
    tag: 'Trending Forecast',
    isPublic: true,
    isCommunity: true,
    isAiGenerated: true,
    creatorEmail: 'AI Community Generator',
    questions: [
      {
        qId: 'p1-comm-green-1',
        question: 'What daily habits have you adopted to reduce your ecological footprint?',
        focus: 'Personal Eco Action',
        strategy: 'A.R.E.A: Nêu thói quen cụ thể (hạn chế đồ nhựa dùng 1 lần, tiết kiệm điện) -> Giải thích lý do.',
        vocabHints: [
          { phrase: 'curtail single-use plastics', meaningVi: 'cắt giảm đồ nhựa dùng một lần' },
          { phrase: 'conscientious consumerism', meaningVi: 'tiêu dùng có ý thức môi trường' }
        ],
        sampleAnswer: 'I have made a conscious effort to curtail single-use plastics by carrying a reusable flask and opting for public transit whenever feasible.'
      },
      {
        qId: 'p1-comm-green-2',
        question: 'Do you find it effortless or inconvenient to practice household recycling in your hometown?',
        focus: 'Infrastructure & Feasibility',
        strategy: 'A.R.E.A: Nêu thực trạng hạ tầng phân loại rác -> Đánh giá sự thuận tiện.',
        vocabHints: [
          { phrase: 'segregated waste disposal bins', meaningVi: 'thùng rác phân loại riêng biệt' },
          { phrase: 'municipal recycling infrastructure', meaningVi: 'hạ tầng tái chế của đô thị' }
        ],
        sampleAnswer: 'To be candid, municipal recycling infrastructure in my city remains somewhat fragmented, requiring citizens to exert extra effort to locate designated sorting stations.'
      }
    ]
  }
];

export const COMMUNITY_DEFAULT_P2_CARDS = [
  {
    id: 'p2-comm-smart-tool',
    title: '✨ [AI Cộng Đồng] A Smart Digital Tool or AI Assistant You Regularly Use',
    category: 'Technology & Innovation',
    tag: 'AI Forecast',
    isPublic: true,
    isCommunity: true,
    isAiGenerated: true,
    creatorEmail: 'AI Community Generator',
    cueCard: {
      intro: 'Describe a smart digital tool or AI assistant that you frequently rely on. You should say:',
      bullets: [
        'What the tool is and when you first discovered it',
        'How exactly you utilize it in your academic or professional life',
        'What specific advantages it offers compared to traditional methods',
        'And explain how it has influenced your overall productivity and learning habits'
      ]
    },
    mindmapNotes: [
      'Bối cảnh: Giới thiệu ứng dụng AI tạo sinh (Gemini/ChatGPT) & mốc bắt đầu sử dụng',
      'Công năng: Viết code, brainstorm dàn ý bài viết, sửa lỗi ngữ pháp & dịch thuật học thuật',
      'Ưu thế: Phản hồi tức thì 24/7, cá nhân hóa phản biện theo từng bước',
      'Ý nghĩa: Giải phóng thời gian khỏi việc lặp lại, nâng cao khả năng tự học độc lập'
    ],
    sampleAnswer: 'I would like to elaborate on an advanced generative AI assistant that has become an indispensable cornerstone of my daily learning routine...'
  }
];

export const COMMUNITY_DEFAULT_P3_SETS = [
  {
    linkedPart2Id: 'p2-comm-smart-tool',
    topic: '✨ [AI Cộng Đồng] Automation, Cognitive Dependency & Ethics of AI',
    isPublic: true,
    isCommunity: true,
    isAiGenerated: true,
    creatorEmail: 'AI Community Generator',
    questions: [
      {
        qId: 'p3-comm-smart-1',
        question: 'Do you think excessive reliance on artificial intelligence might diminish young people\'s critical thinking faculties?',
        analysisType: 'Tác động nhận thức & Trí tuệ phản biện',
        strategy: 'PEEL: Point -> Explanation -> Real-world Example -> Nuanced Conclusion'
      },
      {
        qId: 'p3-comm-smart-2',
        question: 'In what sectors should artificial intelligence be legally prohibited from making autonomous decisions?',
        analysisType: 'Ranh giới pháp lý & Đạo đức công nghệ',
        strategy: 'PEEL: Point -> Judicial/Medical contexts -> Rationale of accountability -> Final verdict'
      }
    ]
  }
];

