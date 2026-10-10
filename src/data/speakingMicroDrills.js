/**
 * Curated Dataset of IELTS Speaking Micro-Drills
 * 4 Specialized Interactive Training Rooms:
 * 1. speaking-area: Công Thức Mở Rộng A.R.E.A (Answer -> Reason -> Example -> Alternative)
 * 2. speaking-fillers: Từ Đệm & Mua Thời Gian Tự Nhiên (Natural Fillers & Signposting)
 * 3. speaking-collocations: Collocations & Idioms Giao Tiếp Tự Nhiên (Lexical Resource 7.5+)
 * 4. speaking-part3-counter: Phản Biện Đa Chiều Part 3 (Two-Sided Analytical Reflex)
 */

export const SPEAKING_MICRO_DRILLS = [
  // ==========================================
  // 1. CÔNG THỨC MỞ RỘNG A.R.E.A (PART 1 & 3)
  // ==========================================
  {
    id: 'sdrill-area-1',
    type: 'speaking-area',
    title: 'A.R.E.A Reflex 1: Nơi Ở - Căn Hộ hay Nhà Riêng?',
    titleEn: 'A.R.E.A Reflex 1: Accommodation - Apartment or House?',
    topic: 'Accommodation & Home Life',
    part: 'Part 1',
    question: 'Do you prefer living in a house or an apartment?',
    difficulty: 'Band 7.0 - 8.5',
    tip: 'Đừng chỉ trả lời "I prefer apartment because it is cheap". Hãy vận dụng A.R.E.A để tạo câu trả lời 30s mạch lạc, tự nhiên.',
    tipEn: 'Do not just say "I prefer an apartment because it is cheap". Use A.R.E.A to craft a fluent, spontaneous 30-second response.',
    formula: {
      answer: {
        label: 'A - Answer',
        prompt: 'Directly state your preference using a natural academic collocation',
        sample: 'Personally, I would definitely opt for living in an apartment rather than a traditional standalone house.',
        keywords: ['opt for', 'apartment', 'standalone house']
      },
      reason: {
        label: 'R - Reason',
        prompt: 'Provide key justifications (convenience, security, integrated amenities)',
        sample: 'The primary rationale is sheer convenience; modern residential complexes offer 24/7 security and integrated amenities like gyms and mini-marts right downstairs.',
        keywords: ['primary rationale', 'sheer convenience', 'integrated amenities', '24/7 security']
      },
      example: {
        label: 'E - Example',
        prompt: 'Give a concrete personal experience or scenario',
        sample: 'For instance, in my current flat, if there is a plumbing malfunction or power outage, the building maintenance team resolves it in a heartbeat.',
        keywords: ['for instance', 'maintenance team', 'in a heartbeat']
      },
      alternative: {
        label: 'A - Alternative',
        prompt: 'Offer an alternative perspective or future consideration',
        sample: 'Having said that, if I decide to start a larger family down the road, I might consider moving to a suburban house for more outdoor greenery and privacy.',
        keywords: ['having said that', 'down the road', 'suburban house', 'greenery']
      }
    },
    modelAnswerBand8: 'Personally, I would definitely opt for living in an apartment rather than a traditional standalone house. The primary rationale is sheer convenience; modern complexes offer 24/7 security and integrated amenities like fitness centers right downstairs. For instance, in my current flat, any maintenance malfunction is resolved in a heartbeat by the building management. Having said that, if I start a family down the road, I might consider a suburban house for greater outdoor greenery and personal space.',
    lexicalHighlights: ['opt for', 'standalone house', 'primary rationale', 'sheer convenience', 'integrated amenities', 'in a heartbeat', 'down the road']
  },
  {
    id: 'sdrill-area-2',
    type: 'speaking-area',
    title: 'A.R.E.A Reflex 2: Thói Quen Đọc Sách',
    titleEn: 'A.R.E.A Reflex 2: Reading Habits',
    topic: 'Reading Habits & Leisure',
    part: 'Part 1',
    question: 'How often do you read books?',
    difficulty: 'Band 7.0 - 8.5',
    tip: 'Tránh dùng "I read books every day". Hãy nói về thể loại yêu thích và thời điểm đọc bằng các cụm từ phong phú.',
    tipEn: 'Avoid generic phrases like "I read books every day". Discuss your favorite genres and reading occasions with varied vocabulary.',
    formula: {
      answer: {
        label: 'A - Answer',
        prompt: 'State your reading frequency and general interest',
        sample: 'To be perfectly frank, I am an avid reader, so I try to delve into a book almost on a daily basis.',
        keywords: ['avid reader', 'delve into', 'on a daily basis']
      },
      reason: {
        label: 'R - Reason',
        prompt: 'Explain mental wellness and cognitive benefits',
        sample: 'Reading serves as an unbeatable way for me to unwind and decompress after an intense day at work, while simultaneously broadening my intellectual horizons.',
        keywords: ['unbeatable way', 'decompress', 'broaden intellectual horizons']
      },
      example: {
        label: 'E - Example',
        prompt: 'Mention a recent book or current reading habit',
        sample: 'At the moment, I am flipping through a non-fiction book about behavioral psychology right before hitting the sack every night.',
        keywords: ['flipping through', 'non-fiction', 'hitting the sack']
      },
      alternative: {
        label: 'A - Alternative',
        prompt: 'Contrast with exceptionally busy or hectic circumstances',
        sample: 'On exceptionally busy weeks when time is at a premium, though, I tend to switch to audiobooks during my daily commute instead.',
        keywords: ['at a premium', 'daily commute', 'audiobooks']
      }
    },
    modelAnswerBand8: 'To be perfectly frank, I consider myself an avid reader, so I make a conscious effort to delve into a book almost on a daily basis. It serves as an unbeatable way to unwind and decompress after an exhausting day, while simultaneously broadening my intellectual horizons. Right now, I am flipping through a fascinating book on behavioral economics before hitting the sack. On hectic weeks when free time is at a premium, though, I usually switch to audiobooks during my daily commute.',
    lexicalHighlights: ['avid reader', 'delve into', 'decompress', 'broaden intellectual horizons', 'flipping through', 'hitting the sack', 'at a premium']
  },
  {
    id: 'sdrill-area-3',
    type: 'speaking-area',
    title: 'A.R.E.A Reflex 3: Học Tập Một Mình hay Theo Nhóm?',
    titleEn: 'A.R.E.A Reflex 3: Studying Solo vs in Groups',
    topic: 'Education & Study Methods',
    part: 'Part 1',
    question: 'Do you prefer studying alone or in a group?',
    difficulty: 'Band 7.0 - 8.5',
    tip: 'Làm nổi bật khả năng tập trung (deep focus) khi học một mình nhưng vẫn thừa nhận giá trị của thảo luận nhóm (brainstorming).',
    tipEn: 'Highlight the capacity for deep focus when studying solo while acknowledging the brainstorming value of group study.',
    formula: {
      answer: {
        label: 'A - Answer',
        prompt: 'Clearly state your study environment preference',
        sample: 'Without a shadow of a doubt, I lean heavily towards studying in solitude rather than in a group setting.',
        keywords: ['without a shadow of a doubt', 'lean towards', 'in solitude']
      },
      reason: {
        label: 'R - Reason',
        prompt: 'Explain deep focus, fewer distractions, and personalized pacing',
        sample: 'Working alone allows me to enter a state of deep focus without constant interruptions, enabling me to digest complex materials at my own natural pace.',
        keywords: ['deep focus', 'interruptions', 'at my own natural pace']
      },
      example: {
        label: 'E - Example',
        prompt: 'Give an example during high-stakes exam revision or research',
        sample: 'For instance, when cramming for difficult exams, I can effortlessly lock myself in my study room for hours and absorb high-density information.',
        keywords: ['cramming for', 'effortlessly', 'absorb high-density information']
      },
      alternative: {
        label: 'A - Alternative',
        prompt: 'Acknowledge situations where collaborative teamwork is vital',
        sample: 'That being said, if a project requires creative brainstorming and diverse viewpoints, group discussions are undeniably indispensable.',
        keywords: ['that being said', 'brainstorming', 'indispensable']
      }
    },
    modelAnswerBand8: 'Without a shadow of a doubt, I lean heavily towards studying in solitude rather than in a group environment. Working alone allows me to enter a state of deep focus without minor distractions, enabling me to absorb complex academic material at my own natural pace. For instance, when preparing for challenging exams, I usually lock myself in a quiet library corner for uninterrupted revision. That being said, if a project involves multidisciplinary brainstorming, group discussions are undeniably indispensable.',
    lexicalHighlights: ['without a shadow of a doubt', 'in solitude', 'deep focus', 'at my own natural pace', 'uninterrupted revision', 'brainstorming', 'indispensable']
  },
  {
    id: 'sdrill-area-4',
    type: 'speaking-area',
    title: 'A.R.E.A Reflex 4: Nấu Ăn Tại Nhà',
    titleEn: 'A.R.E.A Reflex 4: Home Cooking',
    topic: 'Food, Cooking & Lifestyle',
    part: 'Part 1',
    question: 'Do you enjoy cooking for yourself?',
    difficulty: 'Band 7.0 - 8.5',
    tip: 'Khai thác khía cạnh dinh dưỡng (nutritional value) và niềm vui sáng tạo (culinary experiment).',
    tipEn: 'Explore both nutritional value and the creative joy of culinary experimentation.',
    formula: {
      answer: {
        label: 'A - Answer',
        prompt: 'Express your overall attitude and enthusiasm toward home cooking',
        sample: 'I would say I am thoroughly passionate about whipping up meals in my own kitchen whenever time permits.',
        keywords: ['thoroughly passionate', 'whipping up meals', 'time permits']
      },
      reason: {
        label: 'R - Reason',
        prompt: 'Highlight nutritional control and therapeutic decompression',
        sample: 'Preparing home-cooked dishes gives me complete control over nutritional value and hygiene, while also acting as a surprisingly therapeutic hobby.',
        keywords: ['home-cooked dishes', 'nutritional value', 'therapeutic']
      },
      example: {
        label: 'E - Example',
        prompt: 'Illustrate with a recent dish or weekend cooking session',
        sample: 'Over the weekend, for example, I spent a couple of hours concocting an authentic Italian pasta from scratch, which turned out delicious.',
        keywords: ['concocting', 'from scratch', 'turned out delicious']
      },
      alternative: {
        label: 'A - Alternative',
        prompt: 'Contrast with exhausting weekdays when quick takeout is needed',
        sample: 'However, on hectic weekdays when I am running on empty, I occasionally resort to grabbing takeout or ordering via food delivery apps.',
        keywords: ['running on empty', 'resort to', 'takeout']
      }
    },
    modelAnswerBand8: 'I would say I am thoroughly passionate about whipping up meals in my own kitchen whenever time permits. Preparing home-cooked food gives me absolute control over nutritional value and food safety, while also acting as a surprisingly therapeutic outlet after stressful days. Just last weekend, for example, I spent a couple of hours concocting a traditional pasta dish from scratch with fresh herbs. However, on grueling weekdays when I am running on empty, I occasionally resort to ordering quick takeout.',
    lexicalHighlights: ['whipping up meals', 'home-cooked', 'nutritional value', 'therapeutic outlet', 'concocting', 'from scratch', 'running on empty', 'resort to']
  },
  {
    id: 'sdrill-area-5',
    type: 'speaking-area',
    title: 'A.R.E.A Reflex 5: Trẻ Em Dùng Thiết Bị Điện Tử',
    titleEn: 'A.R.E.A Reflex 5: Screen Time & Young Children',
    topic: 'Technology & Parenting',
    part: 'Part 3',
    question: 'Should young children be allowed to use smartphones and tablets freely?',
    difficulty: 'Band 7.5 - 8.5',
    tip: 'Ở Part 3, quan điểm cần mang tính xã hội và có tính cân nhắc hai chiều sâu sắc.',
    tipEn: 'In Part 3, opinions should be societal in scale and reflect deep, balanced consideration of both perspectives.',
    formula: {
      answer: {
        label: 'A - Answer',
        prompt: 'Assert a firm stance on regulating screen time for toddlers',
        sample: 'From my vantage point, letting children have unrestricted access to smart gadgets is an extremely hazardous practice that should be avoided.',
        keywords: ['from my vantage point', 'unrestricted access', 'hazardous practice']
      },
      reason: {
        label: 'R - Reason',
        prompt: 'Analyze adverse impacts on cognitive development and sleep patterns',
        sample: 'Excessive screen exposure at an impressionable age can severely impair cognitive development, disrupt sleep patterns, and induce digital addiction.',
        keywords: ['excessive screen exposure', 'impressionable age', 'impair cognitive development', 'digital addiction']
      },
      example: {
        label: 'E - Example',
        prompt: 'Provide medical evidence or observable childhood behavior',
        sample: 'For instance, numerous pediatric studies indicate that toddlers with high screen time demonstrate pronounced deficits in speech acquisition and social empathy.',
        keywords: ['pediatric studies', 'high screen time', 'speech acquisition', 'social empathy']
      },
      alternative: {
        label: 'A - Alternative',
        prompt: 'Propose regulated or supervised digital educational engagement',
        sample: 'Instead of outright prohibition, parents should enforce strict time limits and engage exclusively with curated educational applications together.',
        keywords: ['outright prohibition', 'enforce strict time limits', 'curated educational applications']
      }
    },
    modelAnswerBand8: 'From my vantage point, allowing young children unrestricted access to smartphones and tablets is a hazardous practice that should be curtailed. Excessive screen exposure at such an impressionable age can impair cognitive development, disrupt restorative sleep cycles, and induce early digital addiction. Pediatric research confirms that toddlers glued to screens show marked delays in linguistic acquisition. Instead of blanket bans, parents ought to enforce stringent daily time limits and co-view curated educational content.',
  },

  // ==========================================
  // 2. TỪ ĐỆM & MUA THỜI GIAN TỰ NHIÊN (FILLERS)
  // ==========================================
  {
    id: 'sdrill-filler-1',
    type: 'speaking-fillers',
    title: 'Từ Đệm 1: Hồi Tưởng Sự Việc Trong Quá Khứ Xa Xôi',
    category: 'Buying Time & Recalling Past',
    situation: 'The examiner asks about a childhood event that you cannot recall instantaneously.',
    question: 'Can you remember a game you played a lot when you were in primary school?',
    taskPrompt: 'Select the most natural signpost filler to buy 2-3 seconds of thinking time without losing fluency:',
    options: [
      {
        text: 'Well, to be quite honest, that was ages ago, but off the top of my head, I would say...',
        isCorrect: true,
        explanation: 'Rất tự nhiên! "Off the top of my head" và "that was ages ago" là cách người bản xứ mở đầu khi phải lục lại trí nhớ, vừa tự nhiên vừa đúng tiêu chí Fluency & Coherence 7.5+.'
      },
      {
        text: 'Wait a second please, I am thinking right now...',
        isCorrect: false,
        explanation: 'Không tự nhiên trong giao tiếp học thuật và thể hiện sự ấp úng vụng về.'
      },
      {
        text: 'I don\'t know because my memory is not good.',
        isCorrect: false,
        explanation: 'Câu trả lời cộc lốc, tự nhận vốn từ và khả năng phản xạ yếu, làm tụt điểm Band nhanh chóng.'
      },
      {
        text: 'First and foremost, in accordance with the childhood history...',
        isCorrect: false,
        explanation: 'Dùng văn phong viết luận (Writing) một cách khiên cưỡng vào bài Speaking.'
      }
    ],
    targetFiller: 'Well, to be quite honest, that was ages ago, but off the top of my head...',
    sampleContinuation: 'Well, that was ages ago, but off the top of my head, I used to be absolutely obsessed with hide-and-seek with my neighborhood peers every single afternoon.'
  },
  {
    id: 'sdrill-filler-2',
    type: 'speaking-fillers',
    title: 'Từ Đệm 2: Suy Đoán Về Tương Lai Không Chắc Chắn',
    category: 'Speculating & Forecasting',
    situation: 'The examiner asks a speculative question forecasting trends 20-30 years into the future.',
    question: 'Do you think robots will completely replace human teachers in the future?',
    taskPrompt: 'Choose the most natural academic speculative filler suitable for Band 8.0+:',
    options: [
      {
        text: 'That is a rather intriguing question. It is hard to say with absolute certainty, but I would hazard a guess that...',
        isCorrect: true,
        explanation: 'Cụm "hazard a guess" (liều đoán) và "with absolute certainty" là Academic Hedging đỉnh cao trong Speaking, thể hiện sự chín chắn trong tư duy.'
      },
      {
        text: 'I 100% sure that yes because AI is very smart.',
        isCorrect: false,
        explanation: 'Khẳng định cực đoan thiếu cơ sở khoa học, ngữ pháp đơn sơ (Band 5.0).'
      },
      {
        text: 'Let me translate from Vietnamese to English first...',
        isCorrect: false,
        explanation: 'Tối kỵ trong phòng thi IELTS!'
      },
      {
        text: 'In conclusion, the future of robot is good...',
        isCorrect: false,
        explanation: 'Dùng "In conclusion" ngay câu mở đầu là sai lệch hoàn toàn ngữ cảnh giao tiếp.'
      }
    ],
    targetFiller: 'It is hard to say with absolute certainty, but I would hazard a guess that...',
    sampleContinuation: 'It is hard to say with absolute certainty, but I would hazard a guess that while AI will handle grading and curriculum delivery, the human element of empathy and mentorship can never be truly automated.'
  },
  {
    id: 'sdrill-filler-3',
    type: 'speaking-fillers',
    title: 'Từ Đệm 3: Thừa Nhận Một Thực Tế Ngược Đời / Khó Xử',
    category: 'Concession & Honest Reflection',
    situation: 'The examiner asks a question requiring you to admit an imperfect habit honestly.',
    question: 'Do you always manage to lead a healthy lifestyle?',
    taskPrompt: 'Select the optimal starter demonstrating candid authenticity and strong lexical resource:',
    options: [
      {
        text: 'To be brutally honest with you, although I strive to maintain healthy habits, more often than not...',
        isCorrect: true,
        explanation: '"To be brutally honest" và "more often than not" tạo sự chân thành, uyển chuyển và phô diễn cấu trúc phức tự nhiên.'
      },
      {
        text: 'No, I am lazy and eat fast food every day.',
        isCorrect: false,
        explanation: 'Quá cụt và thiếu sự phát triển ý tưởng.'
      },
      {
        text: 'Health is the most important thing in the world according to doctors...',
        isCorrect: false,
        explanation: 'Né tránh trả lời câu hỏi trực tiếp vào bản thân.'
      },
      {
        text: 'On the one hand yes, on the other hand no...',
        isCorrect: false,
        explanation: 'Cấu trúc On the one hand chỉ dùng khi phân tích 2 mặt đối lập của một hiện tượng xã hội, không tự nhiên cho câu hỏi thói quen cá nhân.'
      }
    ],
    targetFiller: 'To be brutally honest with you, although I strive to maintain healthy habits, more often than not...',
    sampleContinuation: 'To be brutally honest with you, although I strive to stay active, more often than not my hectic deadlines force me to skip workouts and survive on quick takeout.'
  },
  {
    id: 'sdrill-filler-4',
    type: 'speaking-fillers',
    title: 'Từ Đệm 4: Câu Hỏi Về Lĩnh Vực Bạn Không Rành Lắm',
    category: 'Unfamiliar Topics & Deflecting',
    situation: 'The examiner asks about an unfamiliar topic that you rarely engage with (e.g. classical sculpture).',
    question: 'Are you interested in ancient historical artifacts?',
    taskPrompt: 'Choose the smartest spoken strategy to navigate an unfamiliar subject naturally:',
    options: [
      {
        text: 'To be fair, historical artifacts are not really my cup of tea, but if I had to pick something interesting...',
        isCorrect: true,
        explanation: 'Thừa nhận "not my cup of tea" (không phải sở thích) rồi chủ động chuyển hướng trả lời giả định "if I had to pick" là chiến thuật cứu điểm Speaking xuất sắc!'
      },
      {
        text: 'I don\'t know anything about this, please change question.',
        isCorrect: false,
        explanation: 'Không bao giờ được yêu cầu giám khảo đổi câu hỏi trong phòng thi!'
      },
      {
        text: 'Uhm... uhm... yes, very nice... artifact is old...',
        isCorrect: false,
        explanation: 'Ngập ngừng ấp úng, vốn từ lặp lại.'
      },
      {
        text: 'Nobody cares about ancient things in modern era.',
        isCorrect: false,
        explanation: 'Thái độ tiêu cực và phát biểu phiến diện.'
      }
    ],
    targetFiller: 'To be fair, it is not really my cup of tea, but if I had to pick...',
    sampleContinuation: 'To be fair, ancient artifacts are not really my cup of tea, but if I had to pick, I do find traditional pottery and royal jewelry quite intriguing from a design standpoint.'
  },

  // ==========================================
  // 3. COLLOCATIONS & IDIOMS TỰ NHIÊN
  // ==========================================
  {
    id: 'sdrill-colloc-1',
    type: 'speaking-collocations',
    title: 'Idiom 1: Vui Mừng Tột Cùng Khi Nhận Tin Tốt',
    category: 'Emotions & Celebrations',
    context: 'Expressing sheer excitement upon achieving an outstanding test score or winning a dream scholarship.',
    prompt: 'Select the most natural English idiom to complete the blank:',
    questionSentence: 'When I received the letter confirming my overseas scholarship, I was absolutely ______.',
    options: [
      {
        text: 'over the moon',
        isCorrect: true,
        explanation: '"Over the moon" là thành ngữ kinh điển của người bản xứ chỉ niềm vui sướng tột độ, được giám khảo IELTS đánh giá rất cao về tính tự nhiên.'
      },
      {
        text: 'very happy with high sky',
        isCorrect: false,
        explanation: 'Dịch từng chữ từ tiếng Việt ("vui lên tận trời"), hoàn toàn sai ngữ pháp tiếng Anh.'
      },
      {
        text: 'laughing loudly and loudly',
        isCorrect: false,
        explanation: 'Lặp từ vụng về, không phải thành ngữ.'
      },
      {
        text: 'in a full smile state',
        isCorrect: false,
        explanation: 'Diễn đạt gượng gạo không tự nhiên.'
      }
    ],
    idiom: 'Over the moon',
    meaning: 'Extremely pleased and delighted',
    speakingExample: 'When I saw that I achieved an overall 8.0 in my IELTS test, I was genuinely over the moon!'
  },
  {
    id: 'sdrill-colloc-2',
    type: 'speaking-collocations',
    title: 'Idiom 2: Giá Cả Quá Đắt Đỏ (Part 1/2)',
    category: 'Shopping & Expenses',
    context: 'Discussing premium tech gadgets or skyrocketing real estate prices in major metropolitan centers.',
    prompt: 'Select the native idiomatic expression meaning "exorbitantly expensive":',
    questionSentence: 'Buying an apartment in downtown Hanoi or Ho Chi Minh City costs an ______ nowadays.',
    options: [
      {
        text: 'arm and a leg',
        isCorrect: true,
        explanation: '"Cost an arm and a leg" là idiom chuẩn mực Band 7.5+ để nói về chi phí quá đắt đỏ.'
      },
      {
        text: 'expensive mountain of gold',
        isCorrect: false,
        explanation: 'Dịch word-by-word từ "núi vàng", người bản xứ không nói như vậy.'
      },
      {
        text: 'eye and a head',
        isCorrect: false,
        explanation: 'Bịa đặt thành ngữ sai bộ phận cơ thể.'
      },
      {
        text: 'unlimited money',
        isCorrect: false,
        explanation: 'Vốn từ đơn giản Band 5.0.'
      }
    ],
    idiom: 'Cost an arm and a leg',
    meaning: 'Be extremely expensive',
    speakingExample: 'Flagship smartphones nowadays cost an arm and a leg, so I usually wait for discounts.'
  },
  {
    id: 'sdrill-colloc-3',
    type: 'speaking-collocations',
    title: 'Idiom 3: Dậy Cực Kỳ Sớm Vào Buổi Sáng',
    category: 'Daily Routine & Habits',
    context: 'Describing the habit of waking up very early for exam preparation, morning exercise, or catching a flight.',
    prompt: 'Select the idiomatic phrase meaning "to wake up extremely early at sunrise":',
    questionSentence: 'During exam season, I usually wake up at the ______ to review key formulas before the test.',
    options: [
      {
        text: 'crack of dawn',
        isCorrect: true,
        explanation: '"At the crack of dawn" nghĩa là thức dậy lúc rạng đông / gà gáy, thể hiện phong cách nói rất bản xứ.'
      },
      {
        text: 'open of morning',
        isCorrect: false,
        explanation: 'Sai cấu trúc ngữ pháp.'
      },
      {
        text: 'sun start',
        isCorrect: false,
        explanation: 'Văn phong bồi không chuẩn xác.'
      },
      {
        text: 'first second of day',
        isCorrect: false,
        explanation: 'Diễn đạt ngô nghê.'
      }
    ],
    idiom: 'At the crack of dawn',
    meaning: 'Very early in the morning, as the sun is rising',
    speakingExample: 'My grandfather is an early bird; he always heads out for a stroll at the crack of dawn.'
  },
  {
    id: 'sdrill-colloc-4',
    type: 'speaking-collocations',
    title: 'Idiom 4: Nạp Lại Năng Lượng Sau Chuỗi Ngày Mệt Mỏi',
    category: 'Health, Wellness & Relaxation',
    context: 'Discussing weekend getaways, outdoor travels, or resting to regain physical and mental strength.',
    prompt: 'Select the natural collocation meaning "to rest and regain energy":',
    questionSentence: 'Going camping in nature over the weekend really helps me ______ my batteries after grueling project deadlines.',
    options: [
      {
        text: 'recharge',
        isCorrect: true,
        explanation: '"Recharge my batteries" là ẩn dụ tự nhiên rất được ưa chuộng trong IELTS Speaking khi nói về thư giãn phục hồi.'
      },
      {
        text: 'refill energy into',
        isCorrect: false,
        explanation: 'Gượng gạo và sai kết hợp từ (collocation).'
      },
      {
        text: 'make full electricity',
        isCorrect: false,
        explanation: 'Dịch sai nghĩa đen của pin.'
      },
      {
        text: 'boost power up',
        isCorrect: false,
        explanation: 'Nghe giống thuật ngữ trong game điện tử, không phù hợp ngữ cảnh sinh hoạt.'
      }
    ],
    idiom: 'Recharge one\'s batteries',
    meaning: 'Regain one\'s strength and energy by resting',
    speakingExample: 'A weekend getaway to the beach is the ultimate way for me to recharge my batteries.'
  },

  // ==========================================
  // 4. PHẢN BIỆN ĐA CHIỀU PART 3 (TWO-SIDED REFLEX)
  // ==========================================
  {
    id: 'sdrill-part3-1',
    type: 'speaking-part3-counter',
    title: 'Phản Biện Part 3: Công Nghệ Kết Nối hay Cô Lập Con Người?',
    titleEn: 'Part 3 Rebuttal: Technology – Connecting or Isolating People?',
    topic: 'Technology & Human Relations',
    question: 'Does modern communication technology bring people closer together, or does it isolate them?',
    category: 'Two-Sided Societal Debate',
    difficulty: 'Band 7.5 - 8.5',
    tip: 'Tại Part 3, điểm mấu chốt là không được nhìn nhận vấn đề một chiều đen-trắng. Hãy phân tích tác động hai mặt và đưa ra kết luận trung dung có chiều sâu.',
    tipEn: 'In Part 3, the key is avoiding black-and-white perspectives. Analyze both sides and deliver a balanced, nuanced conclusion.',
    sideA: {
      perspective: 'Counter perspective: Digital estrangement & superficial ties',
      starter: 'On the one hand, it cannot be denied that...',
      points: 'Over-reliance on digital messaging fosters superficial virtual bonds while substantially eroding authentic face-to-face interpersonal skills.'
    },
    sideB: {
      perspective: 'Affirmative perspective: Bridging geographic divides',
      starter: 'On the flip side, however, it is equally undeniable that...',
      points: 'Geographical boundaries are effortlessly bridged, allowing cross-border families and global remote teams to maintain synchronous collaboration.'
    },
    synthesis: {
      starter: 'So on balance, I would argue that...',
      conclusion: 'Technology itself is fundamentally neutral; its ultimate societal impact boils down to whether individuals use it to supplement or substitute real-world human interactions.'
    },
    modelAnswerBand8: 'Well, that is undeniably a multi-faceted dilemma. On the one hand, it cannot be denied that excessive reliance on digital screens often breeds superficial connections and erodes spontaneous face-to-face social skills. On the flip side, however, video conferencing tools effortlessly bridge continental divides, enabling families separated by continents to maintain strong emotional bonds. So on balance, I would argue that technology itself is fundamentally neutral; its impact boils down to whether people treat it as a supplement or a substitute for real-world interactions.',
    highBandVocab: ['multi-faceted dilemma', 'excessive reliance', 'superficial connections', 'erode spontaneous social skills', 'bridge continental divides', 'on balance', 'boil down to', 'supplement or substitute']
  },
  {
    id: 'sdrill-part3-2',
    type: 'speaking-part3-counter',
    title: 'Phản Biện Part 3: Bảo Tồn Lịch Sử vs Phát Triển Đô Thị Hiện Đại',
    titleEn: 'Part 3 Rebuttal: Historic Preservation vs Modern Urban Development',
    topic: 'Urban Planning & Heritage Preservation',
    question: 'Should governments invest heavily in preserving historic heritage buildings, or prioritize modern infrastructure?',
    category: 'Public Expenditure & Cultural Heritage',
    difficulty: 'Band 7.5 - 8.5',
    tip: 'Phân tích giữa giá trị bản sắc văn hóa / du lịch và nhu cầu thực tiễn về hạ tầng nhà ở / giao thông.',
    tipEn: 'Analyze the trade-off between cultural identity/tourism value and pragmatic infrastructure demands for housing/transport.',
    sideA: {
      perspective: 'Heritage focus: Cultural lineage & tourism value',
      starter: 'From one perspective, preserving heritage is paramount because...',
      points: 'Historic architecture embodies a nation\'s cultural identity and acts as a potent magnet for high-revenue international tourism.'
    },
    sideB: {
      perspective: 'Modernization focus: Urban density & economic growth',
      starter: 'Conversely, proponents of modernization argue that...',
      points: 'Skyrocketing urban populations desperately require modern high-density housing, advanced transportation grids, and commercial hubs to stimulate economic growth.'
    },
    synthesis: {
      starter: 'Consequently, the most prudent approach is...',
      conclusion: 'Adaptive reuse — retrofitting historical facades with modern interior utilities rather than outright demolishing or blindly freezing urban development.'
    },
    modelAnswerBand8: 'From one perspective, allocating public funds to preserve ancient structures is paramount because historic architecture embodies a nation\'s cultural lineage and serves as a major driver for international tourism revenue. Conversely, proponents of modernization rightly point out that burgeoning urban populations urgently need expanded subway networks and affordable high-rise housing. Consequently, I believe the most prudent approach is adaptive reuse—sympathetically integrating modern internal utilities into historic buildings rather than demolishing them or stagnating urban growth.',
    highBandVocab: ['cultural lineage', 'major driver for revenue', 'burgeoning urban populations', 'prudent approach', 'adaptive reuse', 'sympathetically integrating', 'stagnating urban growth']
  }
];
