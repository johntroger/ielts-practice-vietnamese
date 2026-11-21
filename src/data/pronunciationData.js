/**
 * src/data/pronunciationData.js
 *
 * Cambridge IELTS Pronunciation & Intonation Exercise Bank + Phonetic Scoring Engine.
 * Supports 3 progressive practice tracks:
 * 1. Words (Individual Academic Words, Word Stress & Difficult Phonemes)
 * 2. Phrases (Collocations, Connected Speech, Linking & Weak Forms)
 * 3. Sentences (Full IELTS Speaking Part 1-3 Sentences, Thought Groups & Intonation Contours)
 *
 * Strictly complies with Global English UI Rule (100% English when isEn === true).
 */

export const PRONUNCIATION_TRACKS = [
  {
    id: 'ipa',
    labelEn: 'IPA Sounds (44)',
    labelVi: 'Bảng Âm IPA (44)',
    shortDescEn: '44 IPA vowels, diphthongs & consonants with minimal pairs',
    shortDescVi: '44 nguyên âm đơn, nguyên âm đôi & phụ âm IPA kèm cặp âm dễ nhầm',
    baseXp: 15,
    perfectXp: 20,
    badgeColor: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'words',
    labelEn: 'Single Words',
    labelVi: 'Từ Đơn Học Thuật',
    shortDescEn: 'Word stress, silent letters & difficult phonemes',
    shortDescVi: 'Trọng âm từ, âm câm & các âm khó phát âm',
    baseXp: 15,
    perfectXp: 20,
    badgeColor: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'phrases',
    labelEn: 'Phrases & Linking',
    labelVi: 'Cụm Từ & Nối Âm',
    shortDescEn: 'Academic collocations, linking & weak forms',
    shortDescVi: 'Collocations học thuật, nối âm & giảm âm tự nhiên',
    baseXp: 25,
    perfectXp: 30,
    badgeColor: 'from-violet-500 to-purple-600'
  },
  {
    id: 'sentences',
    labelEn: 'Full Sentences',
    labelVi: 'Câu & Ngữ Điệu',
    shortDescEn: 'Chunking, nuclear stress & rising/falling intonation',
    shortDescVi: 'Ngắt nhịp cụm tư duy, nhấn từ khóa & ngữ điệu câu',
    baseXp: 35,
    perfectXp: 45,
    badgeColor: 'from-rose-500 to-amber-500'
  }
];

export const PRONUNCIATION_WORD_DRILLS = [
  {
    id: 'pron-w-01',
    type: 'words',
    targetText: 'phenomenon',
    ipaUk: '/fəˈnɒm.ɪ.nən/',
    ipaUs: '/fəˈnɑː.mə.nɑːn/',
    syllables: 'phe • NOM • e • non',
    stressPattern: '○ ● ○ ○',
    bandLevel: '7.0',
    categoryEn: 'Word Stress Shift',
    categoryVi: 'Trọng Âm Học Thuật',
    topicEn: 'Science & Society',
    topicVi: 'Khoa học & Xã hội',
    meaningEn: 'A fact or situation that is observed to exist or happen',
    meaningVi: 'Hiện tượng, sự việc đặc biệt trong tự nhiên hoặc xã hội',
    trapEn: 'Stressing the first syllable (*PHE-no-me-non) instead of the second syllable (-NOM-).',
    trapVi: 'Nhấn nhầm trọng âm vào âm tiết đầu (*PHE-no-me-non) thay vì âm tiết thứ 2 (-NOM-).',
    mouthTipEn: 'Start with a weak schwa /fə/, then open your jaw wide on NOM with primary stress.',
    mouthTipVi: 'Bắt đầu nhẹ bằng âm schwa /fə/, sau đó mở rộng hàm nhấn mạnh vào âm NOM.',
    exampleEn: 'Urbanization is a global phenomenon that reshapes modern economies.',
    exampleVi: 'Đô thị hóa là một hiện tượng toàn cầu định hình lại các nền kinh tế hiện đại.',
    xpReward: 15
  },
  {
    id: 'pron-w-02',
    type: 'words',
    targetText: 'sustainable',
    ipaUk: '/səˈsteɪ.nə.bəl/',
    ipaUs: '/səˈsteɪ.nə.bəl/',
    syllables: 'sus • TAIN • a • ble',
    stressPattern: '○ ● ○ ○',
    bandLevel: '6.5',
    categoryEn: 'Academic Vowel Traps',
    categoryVi: 'Nguyên Âm Học Thuật',
    topicEn: 'Environment',
    topicVi: 'Môi trường',
    meaningEn: 'Able to be maintained at a certain rate or level without depleting resources',
    meaningVi: 'Bền vững, có thể duy trì lâu dài không gây hại môi trường',
    trapEn: 'Pronouncing the first syllable as /sʌs/ instead of /sə/ and dropping the final dark /l/.',
    trapVi: 'Đọc âm đầu quá nặng thành "sắt-x" thay vì /sə/ nhẹ và bỏ quên âm /l/ uốn lưỡi ở cuối.',
    mouthTipEn: 'Glide smoothly through the diphthong /eɪ/ in -TAIN- and touch your tongue tip behind upper teeth for -ble.',
    mouthTipVi: 'Lướt mượt nguyên âm đôi /eɪ/ ở âm -TAIN- và chạm đầu lưỡi lên chân răng hàm trên ở âm -ble.',
    exampleEn: 'Governments must invest in sustainable energy sources.',
    exampleVi: 'Chính phủ cần đầu tư vào các nguồn năng lượng bền vững.',
    xpReward: 15
  },
  {
    id: 'pron-w-03',
    type: 'words',
    targetText: 'hierarchy',
    ipaUk: '/ˈhaɪə.rɑː.ki/',
    ipaUs: '/ˈhaɪ.rɑːr.ki/',
    syllables: 'HI • er • ar • chy',
    stressPattern: '● ○ ○ ○',
    bandLevel: '7.5',
    categoryEn: 'Consonant Clusters',
    categoryVi: 'Tổ Hợp Phụ Âm Khó',
    topicEn: 'Business & Management',
    topicVi: 'Kinh doanh & Quản trị',
    meaningEn: 'A system in which members of an organization or society are ranked according to status',
    meaningVi: 'Hệ thống cấp bậc, thứ bậc trong tổ chức hoặc xã hội',
    trapEn: 'Pronouncing "ch" as /tʃ/ (like church) instead of hard /k/ (/ki/).',
    trapVi: 'Phát âm nhầm đuôi "-chy" thành âm /tʃ/ (như chữ "ch" tiếng Việt) thay vì âm /k/ (/ki/).',
    mouthTipEn: 'Open wide on /ˈhaɪə/, transition to /rɑː/, and finish crisply with a hard /ki/ sound.',
    mouthTipVi: 'Mở khẩu hình rõ ở /ˈhaɪə/, chuyển qua /rɑː/ và kết thúc dứt khoát bằng âm /ki/.',
    exampleEn: 'A flat corporate hierarchy encourages faster decision-making.',
    exampleVi: 'Cơ cấu cấp bậc doanh nghiệp phẳng khuyến khích việc ra quyết định nhanh hơn.',
    xpReward: 20
  },
  {
    id: 'pron-w-04',
    type: 'words',
    targetText: 'subtle',
    ipaUk: '/ˈsʌt.əl/',
    ipaUs: '/ˈsʌt̬.əl/',
    syllables: 'SUB • tle',
    stressPattern: '● ○',
    bandLevel: '7.0',
    categoryEn: 'Silent Letters',
    categoryVi: 'Âm Câm Kinh Điển',
    topicEn: 'General Academic',
    topicVi: 'Học thuật tổng quát',
    meaningEn: 'Delicate or precise as to be difficult to analyze or describe',
    meaningVi: 'Tinh tế, phảng phất, khó nhận thấy ngay',
    trapEn: 'Pronouncing the silent letter "b" (*sub-tle). The "b" is completely silent.',
    trapVi: 'Đọc rõ âm "b" (*sắp-bồ). Chữ "b" trong từ này là âm câm hoàn toàn.',
    mouthTipEn: 'Skip the "b" entirely—move directly from /sʌ/ to /təl/.',
    mouthTipVi: 'Bỏ qua hoàn toàn chữ "b", chuyển thẳng từ /sʌ/ sang /təl/.',
    exampleEn: 'There is a subtle distinction between the two economic policies.',
    exampleVi: 'Có một sự khác biệt tinh tế giữa hai chính sách kinh tế này.',
    xpReward: 15
  },
  {
    id: 'pron-w-05',
    type: 'words',
    targetText: 'entrepreneur',
    ipaUk: '/ˌɒn.trə.prəˈnɜːr/',
    ipaUs: '/ˌɑːn.trə.prəˈnɝː/',
    syllables: 'en • tre • pre • NEUR',
    stressPattern: '◐ ○ ○ ●',
    bandLevel: '7.5',
    categoryEn: 'Word Stress Shift',
    categoryVi: 'Trọng Âm Học Thuật',
    topicEn: 'Economy & Startups',
    topicVi: 'Kinh tế & Khởi nghiệp',
    meaningEn: 'A person who sets up a business or businesses, taking on financial risks',
    meaningVi: 'Doanh nhân khởi nghiệp',
    trapEn: 'Starting with /en/ instead of /ɒn/ (or /ɑːn/) and misplacing primary stress away from the final syllable -NEUR.',
    trapVi: 'Đọc âm đầu là /en/ thay vì /ɒn/ và không nhấn trọng âm chính vào âm tiết cuối -NEUR.',
    mouthTipEn: 'Round your lips slightly on the final stressed syllable /ˈnɜːr/ and hold it longer.',
    mouthTipVi: 'Tròn môi nhẹ ở âm tiết cuối được nhấn trọng âm /ˈnɜːr/ và ngân dài hơn các âm trước.',
    exampleEn: 'Every successful entrepreneur must adapt to market volatility.',
    exampleVi: 'Mỗi doanh nhân khởi nghiệp thành công đều phải thích ứng với biến động thị trường.',
    xpReward: 20
  },
  {
    id: 'pron-w-06',
    type: 'words',
    targetText: 'ubiquitous',
    ipaUk: '/juːˈbɪk.wɪ.təs/',
    ipaUs: '/juːˈbɪk.wə.t̬əs/',
    syllables: 'u • BIQ • ui • tous',
    stressPattern: '○ ● ○ ○',
    bandLevel: '8.0',
    categoryEn: 'Word Stress Shift',
    categoryVi: 'Trọng Âm Học Thuật',
    topicEn: 'Technology',
    topicVi: 'Công nghệ',
    meaningEn: 'Present, appearing, or found everywhere',
    meaningVi: 'Phổ biến khắp mọi nơi, có mặt ở khắp nơi',
    trapEn: 'Pronouncing the initial "u" as /ʌ/ (*uh-biquitous) instead of /juː/ (you-BIQ-wi-tous).',
    trapVi: 'Đọc chữ "u" đầu tiên thành /ʌ/ thay vì /juː/ (như từ "you").',
    mouthTipEn: 'Start with a clear /juː/, punch the stress on /ˈbɪk/, and end with a light /təs/ including the final /s/.',
    mouthTipVi: 'Bắt đầu bằng /juː/ rõ ràng, bật mạnh trọng âm /ˈbɪk/ và không quên âm /s/ cuối.',
    exampleEn: 'Smartphones have become ubiquitous in contemporary society.',
    exampleVi: 'Điện thoại thông minh đã trở nên phổ biến khắp mọi nơi trong xã hội đương đại.',
    xpReward: 20
  },
  {
    id: 'pron-w-07',
    type: 'words',
    targetText: 'schedule',
    ipaUk: '/ˈʃed.juːl/',
    ipaUs: '/ˈskedʒ.uːl/',
    syllables: 'SCHED • ule',
    stressPattern: '● ○',
    bandLevel: '5.5',
    categoryEn: 'Consonant Clusters',
    categoryVi: 'Tổ Hợp Phụ Âm Khó',
    topicEn: 'Daily Life & Work',
    topicVi: 'Đời sống & Công việc',
    meaningEn: 'A plan for carrying out a process or procedure, giving lists of intended events and times',
    meaningVi: 'Lịch trình, thời gian biểu',
    trapEn: 'Mixing up the middle consonant or dropping the final /l/ sound.',
    trapVi: 'Nuốt mất âm /dʒ/ ở giữa hoặc âm /l/ ở cuối từ.',
    mouthTipEn: 'Choose either UK /ˈʃed.juːl/ or US /ˈskedʒ.uːl/ consistently and keep the first syllable stressed.',
    mouthTipVi: 'Chọn nhất quán cách đọc Anh-Anh /ˈʃed.juːl/ hoặc Anh-Mỹ /ˈskedʒ.uːl/ và nhấn âm đầu.',
    exampleEn: 'Maintaining a balanced study schedule prevents academic burnout.',
    exampleVi: 'Duy trì lịch học cân bằng giúp ngăn ngừa tình trạng kiệt sức học tập.',
    xpReward: 15
  },
  {
    id: 'pron-w-08',
    type: 'words',
    targetText: 'consequences',
    ipaUk: '/ˈkɒn.sɪ.kwən.sɪz/',
    ipaUs: '/ˈkɑːn.sə.kwen.sɪz/',
    syllables: 'CON • se • quen • ces',
    stressPattern: '● ○ ○ ○',
    bandLevel: '6.0',
    categoryEn: 'Consonant Clusters',
    categoryVi: 'Tổ Hợp Phụ Âm Khó',
    topicEn: 'Environment & Policy',
    topicVi: 'Môi trường & Chính sách',
    meaningEn: 'A result or effect of an action or condition',
    meaningVi: 'Hệ quả, hậu quả',
    trapEn: 'Omitting the plural ending syllable /-sɪz/ or mispronouncing "-quen-" as /kən/.',
    trapVi: 'Bỏ sót âm tiết số nhiều /-sɪz/ ở cuối hoặc đọc nhầm "-quen-" thành /kən/.',
    mouthTipEn: 'Hit primary stress on CON-, round lips for /kwən/, and pronounce the plural /-sɪz/ clearly.',
    mouthTipVi: 'Nhấn mạnh âm CON- đầu tiên, tròn môi ở /kwən/ và bật rõ đuôi số nhiều /-sɪz/.',
    exampleEn: 'Deforestation leads to severe ecological consequences.',
    exampleVi: 'Nạn phá rừng dẫn đến những hệ quả sinh thái nghiêm trọng.',
    xpReward: 15
  },
  {
    id: 'pron-w-09',
    type: 'words',
    targetText: 'infrastructure',
    ipaUk: '/ˈɪn.frəˌstrʌk.tʃər/',
    ipaUs: '/ˈɪn.frəˌstrʌk.tʃɚ/',
    syllables: 'IN • fra • struc • ture',
    stressPattern: '● ○ ◐ ○',
    bandLevel: '6.5',
    categoryEn: 'Consonant Clusters',
    categoryVi: 'Tổ Hợp Phụ Âm Khó',
    topicEn: 'Urbanization',
    topicVi: 'Đô thị hóa',
    meaningEn: 'The basic physical and organizational structures and facilities (e.g. buildings, roads)',
    meaningVi: 'Cơ sở hạ tầng',
    trapEn: 'Dropping the /r/ in "-fra-" or "-struc-" and misplacing stress on "-struc-".',
    trapVi: 'Làm rơi âm /r/ trong cụm "-fra-" hoặc "-struc-" và nhấn nhầm trọng âm chính vào âm 3.',
    mouthTipEn: 'Place primary stress on IN-, reduce "-fra-" to /frə/, and release /-tʃər/ smoothly.',
    mouthTipVi: 'Đặt trọng âm chính ở IN-, lướt nhẹ "-fra-" thành /frə/ và bật âm /-tʃər/ ở cuối.',
    exampleEn: 'Modernizing public transport infrastructure reduces traffic congestion.',
    exampleVi: 'Hiện đại hóa cơ sở hạ tầng giao thông công cộng giúp giảm ùn tắc giao thông.',
    xpReward: 15
  },
  {
    id: 'pron-w-10',
    type: 'words',
    targetText: 'deteriorate',
    ipaUk: '/dɪˈtɪə.ri.ə.reɪt/',
    ipaUs: '/dɪˈtɪr.i.ə.reɪt/',
    syllables: 'de • TE • ri • o • rate',
    stressPattern: '○ ● ○ ○ ◐',
    bandLevel: '7.5',
    categoryEn: 'Academic Vowel Traps',
    categoryVi: 'Nguyên Âm Học Thuật',
    topicEn: 'Health & Environment',
    topicVi: 'Sức khỏe & Môi trường',
    meaningEn: 'Become progressively worse',
    meaningVi: 'Xấu đi, suy thoái, xuống cấp theo thời gian',
    trapEn: 'Swallowing the middle syllables "-ri-o-" or failing to stress the second syllable -TE-.',
    trapVi: 'Nuốt mất cụm âm tiết giữa "-ri-o-" hoặc không nhấn trọng âm vào âm tiết thứ 2 (-TE-).',
    mouthTipEn: 'Articulate all 5 syllables rhythmically: dɪ - ˈtɪə - ri - ə - reɪt.',
    mouthTipVi: 'Phát âm đủ và rõ nhịp 5 âm tiết: dɪ - ˈtɪə - ri - ə - reɪt.',
    exampleEn: 'Air quality in industrial zones continues to deteriorate rapidly.',
    exampleVi: 'Chất lượng không khí tại các khu công nghiệp tiếp tục suy giảm nhanh chóng.',
    xpReward: 20
  },
  {
    id: 'pron-w-11',
    type: 'words',
    targetText: 'enthusiastic',
    ipaUk: '/ɪnˌθjuː.ziˈæs.tɪk/',
    ipaUs: '/ɪnˌθuː.ziˈæs.tɪk/',
    syllables: 'en • thu • si • AS • tic',
    stressPattern: '○ ◐ ○ ● ○',
    bandLevel: '6.5',
    categoryEn: 'Consonant Clusters',
    categoryVi: 'Tổ Hợp Phụ Âm Khó',
    topicEn: 'Personality & Work',
    topicVi: 'Tính cách & Công việc',
    meaningEn: 'Having or showing intense and eager enjoyment, interest, or approval',
    meaningVi: 'Nhiệt huyết, hào hứng, đam mê',
    trapEn: 'Replacing the unvoiced /θ/ ("th") with /t/ or /s/, and missing the /z/ sound in "-si-".',
    trapVi: 'Đọc nhầm âm /θ/ ("th") thành âm "thờ" tiếng Việt và đọc "-si-" thành /s/ thay vì /zi/.',
    mouthTipEn: 'Place your tongue lightly between your teeth for /θ/, vibrate your vocal cords for /zi/, and stress -AS-.',
    mouthTipVi: 'Đặt nhẹ đầu lưỡi giữa hai hàm răng cho âm /θ/, rung dây thanh quản ở /zi/ và nhấn mạnh -AS-.',
    exampleEn: 'Young graduates are often enthusiastic about international career opportunities.',
    exampleVi: 'Sinh viên mới tốt nghiệp thường rất hào hứng với các cơ hội nghề nghiệp quốc tế.',
    xpReward: 15
  },
  {
    id: 'pron-w-12',
    type: 'words',
    targetText: 'unprecedented',
    ipaUk: '/ʌnˈpres.ɪ.den.tɪd/',
    ipaUs: '/ʌnˈpres.ə.den.t̬ɪd/',
    syllables: 'un • PRE • ce • den • ted',
    stressPattern: '○ ● ○ ○ ○',
    bandLevel: '8.0',
    categoryEn: 'Word Stress Shift',
    categoryVi: 'Trọng Âm Học Thuật',
    topicEn: 'Global Trends',
    topicVi: 'Xu hướng toàn cầu',
    meaningEn: 'Never done or known before',
    meaningVi: 'Chưa từng có tiền lệ',
    trapEn: 'Pronouncing "-pre-" as /priː/ instead of short /pres/, or stressing "-den-" instead of "-PRE-".',
    trapVi: 'Đọc nhầm âm "-pre-" thành /priː/ thay vì /pres/, hoặc đặt sai trọng âm sang âm "-den-".',
    mouthTipEn: 'Keep the vowel in -PRE- short (/e/ as in dress) and finish with a clean /-tɪd/ ending.',
    mouthTipVi: 'Giữ nguyên âm trong -PRE- ngắn gọn (/e/) và kết thúc rõ bằng đuôi /-tɪd/.',
    exampleEn: 'Artificial intelligence is advancing at an unprecedented pace.',
    exampleVi: 'Trí tuệ nhân tạo đang phát triển với tốc độ chưa từng có tiền lệ.',
    xpReward: 20
  },
  {
    id: 'pron-w-13',
    type: 'words',
    targetText: 'environment',
    ipaUk: '/ɪnˈvaɪ.rən.mənt/',
    ipaUs: '/ɪnˈvaɪ.rən.mənt/',
    syllables: 'en • VI • ron • ment',
    stressPattern: '○ ● ○ ○',
    bandLevel: '6.0',
    categoryEn: 'Silent Letters',
    categoryVi: 'Âm Câm Kinh Điển',
    topicEn: 'Environment',
    topicVi: 'Môi trường',
    meaningEn: 'The natural world, as a whole or in a particular geographical area',
    meaningVi: 'Môi trường tự nhiên',
    trapEn: 'Pronouncing the silent "n" after "vi-" (*en-vi-ron-ment).',
    trapVi: 'Đọc dư chữ "n" ở giữa (*en-vai-rờn-mần). Chữ "n" thứ 2 thường lướt cực nhẹ hoặc câm.',
    mouthTipEn: 'Hit stress on -VI- (/ˈvaɪ/), glide smoothly through /rən/, and close on /-mənt/.',
    mouthTipVi: 'Nhấn mạnh -VI- (/ˈvaɪ/), lướt nhẹ /rən/ và đóng âm cuối /-mənt/ rõ ràng.',
    exampleEn: 'Protecting the marine environment is a shared global responsibility.',
    exampleVi: 'Bảo vệ môi trường biển là trách nhiệm chung của toàn cầu.',
    xpReward: 15
  },
  {
    id: 'pron-w-14',
    type: 'words',
    targetText: 'colleague',
    ipaUk: '/ˈkɒl.iːɡ/',
    ipaUs: '/ˈkɑː.liːɡ/',
    syllables: 'COL • league',
    stressPattern: '● ○',
    bandLevel: '6.0',
    categoryEn: 'Academic Vowel Traps',
    categoryVi: 'Nguyên Âm Học Thuật',
    topicEn: 'Work & Career',
    topicVi: 'Công việc & Sự nghiệp',
    meaningEn: 'A person with whom one works in a profession or business',
    meaningVi: 'Đồng nghiệp',
    trapEn: 'Confusing "colleague" (/ˈkɒl.iːɡ/) with "college" (/ˈkɒl.ɪdʒ/).',
    trapVi: 'Đọc nhầm từ "colleague" (đồng nghiệp) thành "college" (cao đẳng/đại học).',
    mouthTipEn: 'Stretch the long /iː/ in "-league" and finish with a voiced /ɡ/ sound.',
    mouthTipVi: 'Kéo dài âm /iː/ ở âm tiết thứ hai (-league) và kết thúc bằng âm /ɡ/ hữu thanh.',
    exampleEn: 'I collaborated closely with a senior colleague on the quarterly report.',
    exampleVi: 'Tôi đã phối hợp chặt chẽ với một đồng nghiệp cấp cao trong báo cáo quý.',
    xpReward: 15
  },
  {
    id: 'pron-w-15',
    type: 'words',
    targetText: 'resilience',
    ipaUk: '/rɪˈzɪl.i.əns/',
    ipaUs: '/rɪˈzɪl.jəns/',
    syllables: 're • SIL • ience',
    stressPattern: '○ ● ○',
    bandLevel: '7.5',
    categoryEn: 'Consonant Clusters',
    categoryVi: 'Tổ Hợp Phụ Âm Khó',
    topicEn: 'Psychology & Mindset',
    topicVi: 'Tâm lý & Tư duy',
    meaningEn: 'The capacity to recover quickly from difficulties; toughness',
    meaningVi: 'Khả năng phục hồi, sự kiên cường vượt khó',
    trapEn: 'Pronouncing "-sil-" with /s/ instead of voiced /z/ and dropping the final /s/.',
    trapVi: 'Đọc âm "-sil-" thành /s/ vô thanh thay vì /z/ rung thanh quản và quên âm /s/ cuối.',
    mouthTipEn: 'Vibrate your throat on /zɪl/ and finish crisply with /-əns/.',
    mouthTipVi: 'Rung dây thanh ở âm /zɪl/ và kết thúc gọn bằng âm /-əns/.',
    exampleEn: 'Mental resilience helps students cope with academic pressure.',
    exampleVi: 'Sự kiên cường tinh thần giúp sinh viên vượt qua áp lực học tập.',
    xpReward: 20
  },
  {
    id: 'pron-w-16',
    type: 'words',
    targetText: 'conscientious',
    ipaUk: '/ˌkɒn.ʃiˈen.ʃəs/',
    ipaUs: '/ˌkɑːn.ʃiˈen.ʃəs/',
    syllables: 'con • sci • EN • tious',
    stressPattern: '◐ ○ ● ○',
    bandLevel: '8.0',
    requiresAuth: true,
    categoryEn: 'Consonant Clusters',
    categoryVi: 'Tổ Hợp Phụ Âm Khó',
    topicEn: 'Personality & Work',
    topicVi: 'Tính cách & Công việc',
    meaningEn: 'Wishing to do one’s work or duty well and thoroughly',
    meaningVi: 'Tận tâm, chu đáo, có trách nhiệm cao',
    trapEn: 'Pronouncing "-sci-" as /saɪ/ (like science) instead of /ʃi/.',
    trapVi: 'Đọc nhầm cụm "-sci-" thành /saɪ/ (như từ science) thay vì âm /ʃi/.',
    mouthTipEn: 'Round your lips for both /ʃ/ sounds: con-shi-EN-shus.',
    mouthTipVi: 'Chu môi tròn cho cả hai âm /ʃ/: con-shi-EN-shus.',
    exampleEn: 'She is a conscientious researcher who verifies every data source.',
    exampleVi: 'Cô ấy là một nhà nghiên cứu tận tâm luôn kiểm chứng mọi nguồn dữ liệu.',
    xpReward: 20
  },
  {
    id: 'pron-w-17',
    type: 'words',
    targetText: 'exacerbate',
    ipaUk: '/ɪɡˈzæs.ə.beɪt/',
    ipaUs: '/ɪɡˈzæs.ɚ.beɪt/',
    syllables: 'ex • AC • er • bate',
    stressPattern: '○ ● ○ ◐',
    bandLevel: '8.0',
    requiresAuth: true,
    categoryEn: 'Word Stress Shift',
    categoryVi: 'Trọng Âm Học Thuật',
    topicEn: 'Society & Policy',
    topicVi: 'Xã hội & Chính sách',
    meaningEn: 'Make a problem, bad situation, or negative feeling worse',
    meaningVi: 'Làm trầm trọng thêm (một vấn đề/tình trạng xấu)',
    trapEn: 'Stressing the first syllable or pronouncing "ex-" as /eks/ instead of /ɪɡz/.',
    trapVi: 'Đọc âm đầu thành /eks/ thay vì /ɪɡz/ nối sang -ZAS-.',
    mouthTipEn: 'Voice the /ɡz/ cluster and punch -ZAS- on the second syllable.',
    mouthTipVi: 'Rung rõ cụm /ɡz/ và bật trọng âm vào âm tiết thứ 2 (-ZAS-).',
    exampleEn: 'Rising housing costs continue to exacerbate urban inequality.',
    exampleVi: 'Chi phí nhà ở tăng cao tiếp tục làm trầm trọng thêm bất bình đẳng đô thị.',
    xpReward: 20
  },
  {
    id: 'pron-w-18',
    type: 'words',
    targetText: 'mitigate',
    ipaUk: '/ˈmɪt.ɪ.ɡeɪt/',
    ipaUs: '/ˈmɪt̬.ə.ɡeɪt/',
    syllables: 'MIT • i • gate',
    stressPattern: '● ○ ◐',
    bandLevel: '7.5',
    requiresAuth: true,
    categoryEn: 'Academic Vowel Traps',
    categoryVi: 'Nguyên Âm Học Thuật',
    topicEn: 'Environment & Risk',
    topicVi: 'Môi trường & Rủi ro',
    meaningEn: 'Make less severe, serious, or painful',
    meaningVi: 'Giảm nhẹ, làm dịu bớt hậu quả',
    trapEn: 'Pronouncing "-mi-" as long /maɪ/ instead of short /mɪt/.',
    trapVi: 'Đọc nhầm âm đầu thành /maɪ/ thay vì /mɪt/ ngắn.',
    mouthTipEn: 'Keep /mɪt/ crisp, reduce middle /ɪ/, and glide the diphthong /eɪ/ in -gate.',
    mouthTipVi: 'Đọc âm đầu /mɪt/ gọn, lướt nhẹ âm giữa và kéo nguyên âm đôi /eɪ/ ở -gate.',
    exampleEn: 'Green spaces help mitigate the urban heat island effect.',
    exampleVi: 'Không gian xanh giúp giảm nhẹ hiệu ứng đảo nhiệt đô thị.',
    xpReward: 20
  },
  {
    id: 'pron-w-19',
    type: 'words',
    targetText: 'bureaucracy',
    ipaUk: '/bjʊəˈrɒk.rə.si/',
    ipaUs: '/bjʊˈrɑː.krə.si/',
    syllables: 'bu • REAU • cra • cy',
    stressPattern: '○ ● ○ ○',
    bandLevel: '8.0',
    requiresAuth: true,
    categoryEn: 'Word Stress Shift',
    categoryVi: 'Trọng Âm Học Thuật',
    topicEn: 'Government & Law',
    topicVi: 'Chính phủ & Hành chính',
    meaningEn: 'A system of government in which most important decisions are made by state officials',
    meaningVi: 'Bộ máy hành chính, thủ tục quan liêu',
    trapEn: 'Mispronouncing "bureau-" as /buːrəʊ/ instead of /bjʊəˈrɒk/.',
    trapVi: 'Đọc sai cụm đầu thành "bu-râu" thay vì /bjʊəˈrɒk/.',
    mouthTipEn: 'Start with /bjʊə/, place strong stress on -ROC-, and finish lightly on -rə-si.',
    mouthTipVi: 'Bắt đầu bằng /bjʊə/, nhấn mạnh trọng âm ở -ROC- và lướt nhẹ -rə-si.',
    exampleEn: 'Digitalization can significantly streamline excessive bureaucracy.',
    exampleVi: 'Số hóa có thể tinh giản đáng kể các thủ tục hành chính rườm rà.',
    xpReward: 20
  },
  {
    id: 'pron-w-20',
    type: 'words',
    targetText: 'aesthetic',
    ipaUk: '/iːsˈθet.ɪk/',
    ipaUs: '/esˈθet̬.ɪk/',
    syllables: 'aes • THET • ic',
    stressPattern: '○ ● ○',
    bandLevel: '7.5',
    requiresAuth: true,
    categoryEn: 'Consonant Clusters',
    categoryVi: 'Tổ Hợp Phụ Âm Khó',
    topicEn: 'Art & Design',
    topicVi: 'Nghệ thuật & Thiết kế',
    meaningEn: 'Concerned with beauty or the appreciation of beauty',
    meaningVi: 'Thuộc về thẩm mỹ, cái đẹp',
    trapEn: 'Replacing /θ/ with /t/ (*es-tet-ic) and dropping the /s/ before /θ/.',
    trapVi: 'Đọc âm "th" thành /t/ tiếng Việt (*ét-tê-tích) hoặc bỏ mất âm /s/ trước âm /θ/.',
    mouthTipEn: 'Hiss /s/ first, then slide tongue between teeth for /θ/ on -THET-.',
    mouthTipVi: 'Xì nhẹ âm /s/ trước, sau đó đưa đầu lưỡi ra giữa hai răng cho âm /θ/ ở -THET-.',
    exampleEn: 'Minimalist architecture prioritizes both functionality and aesthetic appeal.',
    exampleVi: 'Kiến trúc tối giản ưu tiên cả công năng lẫn sức hút thẩm mỹ.',
    xpReward: 20
  },
  {
    id: 'pron-w-21',
    type: 'words',
    targetText: 'proliferate',
    ipaUk: '/prəˈlɪf.ər.eɪt/',
    ipaUs: '/prəˈlɪf.ə.reɪt/',
    syllables: 'pro • LIF • er • ate',
    stressPattern: '○ ● ○ ◐',
    bandLevel: '8.0',
    requiresAuth: true,
    categoryEn: 'Word Stress Shift',
    categoryVi: 'Trọng Âm Học Thuật',
    topicEn: 'Technology & Trends',
    topicVi: 'Công nghệ & Xu hướng',
    meaningEn: 'Increase rapidly in numbers; multiply',
    meaningVi: 'Sinh sôi nảy nở, gia tăng nhanh chóng về số lượng',
    trapEn: 'Stressing "PRO-" instead of "-LIF-".',
    trapVi: 'Nhấn nhầm trọng âm vào âm đầu PRO- thay vì -LIF-.',
    mouthTipEn: 'Reduce "pro-" to weak /prə/ and punch "-LIF-" clearly.',
    mouthTipVi: 'Giảm nhẹ âm đầu thành /prə/ và nhấn mạnh vào -LIF-.',
    exampleEn: 'Online learning platforms have proliferated over the past decade.',
    exampleVi: 'Các nền tảng học trực tuyến đã phát triển ồ ạt trong thập kỷ qua.',
    xpReward: 20
  },
  {
    id: 'pron-w-22',
    type: 'words',
    targetText: 'vulnerable',
    ipaUk: '/ˈvʌl.nər.ə.bəl/',
    ipaUs: '/ˈvʌl.nɚ.ə.bəl/',
    syllables: 'VUL • ner • a • ble',
    stressPattern: '● ○ ○ ○',
    bandLevel: '7.0',
    requiresAuth: true,
    categoryEn: 'Consonant Clusters',
    categoryVi: 'Tổ Hợp Phụ Âm Khó',
    topicEn: 'Health & Society',
    topicVi: 'Sức khỏe & Xã hội',
    meaningEn: 'Exposed to the possibility of being attacked or harmed, physically or emotionally',
    meaningVi: 'Dễ bị tổn thương, yếu thế',
    trapEn: 'Dropping the dark /l/ in "VUL-" (*vun-er-a-ble).',
    trapVi: 'Làm rơi mất âm /l/ ở âm tiết đầu (*vân-nơ-rờ-bồ).',
    mouthTipEn: 'Touch tongue tip to alveolar ridge for /l/ in VUL- before moving to /n/.',
    mouthTipVi: 'Chạm đầu lưỡi lên chân răng trên cho âm /l/ ở VUL- trước khi sang /n/.',
    exampleEn: 'Elderly residents are particularly vulnerable to extreme heatwaves.',
    exampleVi: 'Người cao tuổi đặc biệt dễ bị tổn thương trước các đợt nắng nóng cực đoan.',
    xpReward: 15
  },
  {
    id: 'pron-w-23',
    type: 'words',
    targetText: 'paradigm',
    ipaUk: '/ˈpær.ə.daɪm/',
    ipaUs: '/ˈper.ə.daɪm/',
    syllables: 'PAR • a • digm',
    stressPattern: '● ○ ◐',
    bandLevel: '8.5',
    requiresAuth: true,
    categoryEn: 'Silent Letters',
    categoryVi: 'Âm Câm Kinh Điển',
    topicEn: 'Science & Education',
    topicVi: 'Khoa học & Giáo dục',
    meaningEn: 'A typical example or pattern of something; a model',
    meaningVi: 'Hệ hình, mô hình tư duy chuẩn mực',
    trapEn: 'Pronouncing the silent "g" in "-digm" (*pa-ra-dig-m).',
    trapVi: 'Đọc nhầm chữ "g" câm ở cuối (*pa-ra-đíc-m). Chữ "g" hoàn toàn câm.',
    mouthTipEn: 'Skip the "g" and glide smoothly from /daɪ/ directly to /m/ (/daɪm/).',
    mouthTipVi: 'Bỏ hoàn toàn chữ "g", đọc mượt từ /daɪ/ sang âm /m/ (/daɪm/).',
    exampleEn: 'Remote work triggered a paradigm shift in corporate culture.',
    exampleVi: 'Làm việc từ xa đã tạo ra một bước chuyển hệ hình trong văn hóa doanh nghiệp.',
    xpReward: 20
  },
  {
    id: 'pron-w-24',
    type: 'words',
    targetText: 'fluctuate',
    ipaUk: '/ˈflʌk.tʃu.eɪt/',
    ipaUs: '/ˈflʌk.tʃu.eɪt/',
    syllables: 'FLUC • tu • ate',
    stressPattern: '● ○ ◐',
    bandLevel: '7.0',
    requiresAuth: true,
    categoryEn: 'Consonant Clusters',
    categoryVi: 'Tổ Hợp Phụ Âm Khó',
    topicEn: 'Writing Task 1 & Data',
    topicVi: 'Dữ liệu & Biểu đồ Task 1',
    meaningEn: 'Rise and fall irregularly in number or amount',
    meaningVi: 'Dao động lên xuống thất thường',
    trapEn: 'Pronouncing "-tu-" as /tuː/ instead of /tʃu/ or dropping the /k/ before /tʃ/.',
    trapVi: 'Đọc "-tu-" thành /tuː/ thay vì /tʃu/ hoặc nuốt âm /k/ trong FLUC-.',
    mouthTipEn: 'Keep /k/ crisp at the end of FLUC- and release /-tʃu.eɪt/ cleanly.',
    mouthTipVi: 'Giữ âm /k/ ở cuối FLUC- rồi bật nhẹ /-tʃu.eɪt/.',
    exampleEn: 'Fuel prices tend to fluctuate sharply during geopolitical instability.',
    exampleVi: 'Giá nhiên liệu thường dao động mạnh trong giai đoạn bất ổn địa chính trị.',
    xpReward: 15
  },
  {
    id: 'pron-w-25',
    type: 'words',
    targetText: 'indispensable',
    ipaUk: '/ˌɪn.dɪˈspen.sə.bəl/',
    ipaUs: '/ˌɪn.dɪˈspen.sə.bəl/',
    syllables: 'in • di • SPEN • sa • ble',
    stressPattern: '◐ ○ ● ○ ○',
    bandLevel: '7.5',
    requiresAuth: true,
    categoryEn: 'Word Stress Shift',
    categoryVi: 'Trọng Âm Học Thuật',
    topicEn: 'General Academic',
    topicVi: 'Học thuật tổng quát',
    meaningEn: 'Absolutely necessary; impossible to do without',
    meaningVi: 'Không thể thiếu được, tối quan trọng',
    trapEn: 'Misplacing stress onto "-pen-" incorrectly or pronouncing "-sable" as /seɪbəl/.',
    trapVi: 'Đọc đuôi "-sable" thành /seɪbəl/ (như từ able) thay vì /sə.bəl/ nhẹ.',
    mouthTipEn: 'Hit primary stress on -SPEN- and keep -sa-ble light (/sə.bəl/).',
    mouthTipVi: 'Nhấn mạnh ở -SPEN- và lướt nhẹ đuôi /sə.bəl/.',
    exampleEn: 'Critical thinking has become an indispensable skill in the AI era.',
    exampleVi: 'Tư duy phản biện đã trở thành kỹ năng không thể thiếu trong kỷ nguyên AI.',
    xpReward: 20
  },
  {
    id: 'pron-w-26',
    type: 'words',
    targetText: 'psychological',
    ipaUk: '/ˌsaɪ.kəˈlɒdʒ.ɪ.kəl/',
    ipaUs: '/ˌsaɪ.kəˈlɑː.dʒɪ.kəl/',
    syllables: 'psy • cho • LOG • i • cal',
    stressPattern: '◐ ○ ● ○ ○',
    bandLevel: '7.0',
    requiresAuth: true,
    categoryEn: 'Silent Letters',
    categoryVi: 'Âm Câm Kinh Điển',
    topicEn: 'Health & Psychology',
    topicVi: 'Sức khỏe & Tâm lý',
    meaningEn: 'Of, affecting, or arising in the mind; related to the mental and emotional state',
    meaningVi: 'Thuộc về tâm lý học, tinh thần',
    trapEn: 'Pronouncing the silent "p" at the start or using /tʃ/ instead of /k/ in "-cho-".',
    trapVi: 'Đọc chữ "p" câm ở đầu hoặc đọc "-cho-" sai thành /tʃ/.',
    mouthTipEn: 'Start directly with /saɪ/, say /kə/, and place primary stress on -LOG-.',
    mouthTipVi: 'Bắt đầu thẳng bằng /saɪ/, đọc /kə/ và nhấn trọng âm chính ở -LOG-.',
    exampleEn: 'Chronic sleep deprivation causes severe psychological fatigue.',
    exampleVi: 'Thiếu ngủ kéo dài gây ra sự mệt mỏi tâm lý nghiêm trọng.',
    xpReward: 15
  },
  {
    id: 'pron-w-27',
    type: 'words',
    targetText: 'catalyst',
    ipaUk: '/ˈkæt.əl.ɪst/',
    ipaUs: '/ˈkæt̬.əl.ɪst/',
    syllables: 'CAT • a • lyst',
    stressPattern: '● ○ ○',
    bandLevel: '8.0',
    requiresAuth: true,
    categoryEn: 'Consonant Clusters',
    categoryVi: 'Tổ Hợp Phụ Âm Khó',
    topicEn: 'Innovation & Change',
    topicVi: 'Đổi mới & Phát triển',
    meaningEn: 'A person or thing that precipitates an event or change',
    meaningVi: 'Chất xúc tác, nhân tố thúc đẩy sự thay đổi',
    trapEn: 'Dropping the final /-st/ cluster (*ca-ta-lys).',
    trapVi: 'Nuốt mất cụm phụ âm cuối /-st/ (*ca-ta-lít).',
    mouthTipEn: 'Stress CAT- crisply and finish with a clear /s/ + /t/ release.',
    mouthTipVi: 'Nhấn âm đầu CAT- và bật đủ cả hai âm cuối /s/ và /t/.',
    exampleEn: 'High-speed internet acted as a catalyst for e-commerce growth.',
    exampleVi: 'Internet tốc độ cao đóng vai trò chất xúc tác cho tăng trưởng thương mại điện tử.',
    xpReward: 20
  },
  {
    id: 'pron-w-28',
    type: 'words',
    targetText: 'controversial',
    ipaUk: '/ˌkɒn.trəˈvɜː.ʃəl/',
    ipaUs: '/ˌkɑːn.trəˈvɝː.ʃəl/',
    syllables: 'con • tro • VER • sial',
    stressPattern: '◐ ○ ● ○',
    bandLevel: '7.0',
    requiresAuth: true,
    categoryEn: 'Word Stress Shift',
    categoryVi: 'Trọng Âm Học Thuật',
    topicEn: 'Media & Debate',
    topicVi: 'Truyền thông & Tranh luận',
    meaningEn: 'Giving rise or likely to give rise to public disagreement',
    meaningVi: 'Gây tranh cãi, nhiều ý kiến trái chiều',
    trapEn: 'Pronouncing "-sial" as /si.əl/ instead of /ʃəl/.',
    trapVi: 'Đọc đuôi "-sial" thành /si-ồ/ thay vì /ʃəl/ cong lưỡi.',
    mouthTipEn: 'Stretch /ɜː/ in -VER- and finish smoothly with /ʃəl/.',
    mouthTipVi: 'Ngân âm /ɜː/ ở -VER- và kết thúc mượt bằng /ʃəl/.',
    exampleEn: 'Implementing a congestion charge remains a controversial proposal.',
    exampleVi: 'Áp dụng phí ùn tắc giao thông vẫn là một đề xuất gây nhiều tranh cãi.',
    xpReward: 15
  },
  {
    id: 'pron-w-29',
    type: 'words',
    targetText: 'prerequisite',
    ipaUk: '/ˌpriːˈrek.wɪ.zɪt/',
    ipaUs: '/ˌpriːˈrek.wə.zɪt/',
    syllables: 'pre • REQ • ui • site',
    stressPattern: '◐ ● ○ ○',
    bandLevel: '8.0',
    requiresAuth: true,
    categoryEn: 'Academic Vowel Traps',
    categoryVi: 'Nguyên Âm Học Thuật',
    topicEn: 'Education & Skills',
    topicVi: 'Giáo dục & Kỹ năng',
    meaningEn: 'A thing that is required as a prior condition for something else to happen',
    meaningVi: 'Điều kiện tiên quyết',
    trapEn: 'Pronouncing "-site" as /saɪt/ (like website) instead of short /zɪt/.',
    trapVi: 'Đọc đuôi "-site" thành /saɪt/ (như website) thay vì /zɪt/.',
    mouthTipEn: 'Hit stress on -REQ-, voice the /z/, and end with crisp /ɪt/.',
    mouthTipVi: 'Nhấn mạnh -REQ-, rung âm /z/ và kết thúc gọn bằng /ɪt/.',
    exampleEn: 'Digital literacy is a prerequisite for modern employability.',
    exampleVi: 'Năng lực số là điều kiện tiên quyết cho cơ hội việc làm hiện đại.',
    xpReward: 20
  },
  {
    id: 'pron-w-30',
    type: 'words',
    targetText: 'equitable',
    ipaUk: '/ˈek.wɪ.tə.bəl/',
    ipaUs: '/ˈek.wɪ.t̬ə.bəl/',
    syllables: 'EQ • ui • ta • ble',
    stressPattern: '● ○ ○ ○',
    bandLevel: '8.0',
    requiresAuth: true,
    categoryEn: 'Academic Vowel Traps',
    categoryVi: 'Nguyên Âm Học Thuật',
    topicEn: 'Society & Economics',
    topicVi: 'Xã hội & Kinh tế',
    meaningEn: 'Fair and impartial',
    meaningVi: 'Công bằng, bình đẳng hợp lý',
    trapEn: 'Pronouncing the first syllable as /iː/ (like equal) instead of short /ek/.',
    trapVi: 'Đọc âm đầu là /iː/ (giống từ equal) thay vì /ek/ ngắn.',
    mouthTipEn: 'Start with a short crisp /ek/ and stress the very first syllable.',
    mouthTipVi: 'Bắt đầu bằng âm /ek/ ngắn gọn và nhấn trọng âm ngay âm tiết đầu tiên.',
    exampleEn: 'Subsidies ensure a more equitable distribution of healthcare resources.',
    exampleVi: 'Trợ cấp đảm bảo sự phân bổ công bằng hơn về nguồn lực y tế.',
    xpReward: 20
  }
];

export const PRONUNCIATION_PHRASE_DRILLS = [
  {
    id: 'pron-p-01',
    type: 'phrases',
    targetText: 'play an important role in',
    connectedText: 'play‿an‿imˈportant ˈrole‿in',
    ipaUk: '/pleɪ‿ən‿ɪmˈpɔː.tənt ˈrəʊl‿ɪn/',
    ipaUs: '/pleɪ‿ən‿ɪmˈpɔːr.tənt ˈroʊl‿ɪn/',
    stressPattern: '● ○ ○ ● ○ ● ○',
    bandLevel: '6.0',
    categoryEn: 'Consonant-Vowel Linking',
    categoryVi: 'Nối Âm Phụ Âm - Nguyên Âm',
    topicEn: 'Academic Linking',
    topicVi: 'Liên kết câu học thuật',
    meaningEn: 'To be a significant factor or contributor in something',
    meaningVi: 'Đóng vai trò quan trọng trong việc gì',
    trapEn: 'Pausing choppily between every word instead of linking "an_important" and "role_in".',
    trapVi: 'Đọc ngắt quãng từng từ rời rạc thay vì nối mượt "an‿important" và "role‿in".',
    mouthTipEn: 'Reduce "an" to weak /ən/, link /n/ directly into /ɪmˈpɔːtənt/, and link the /l/ of "role" into "in" (/ˈrəʊ.lɪn/).',
    mouthTipVi: 'Giảm âm "an" thành /ən/, nối âm /n/ thẳng sang /ɪmˈpɔːtənt/ và nối âm /l/ của "role" sang "in" (/ˈrəʊ.lɪn/).',
    exampleEn: 'Renewable energy will play an important role in reducing carbon emissions.',
    exampleVi: 'Năng lượng tái tạo sẽ đóng vai trò quan trọng trong việc giảm phát thải carbon.',
    xpReward: 25
  },
  {
    id: 'pron-p-02',
    type: 'phrases',
    targetText: 'on the other hand',
    connectedText: 'on the‿ˈother ˈhand',
    ipaUk: '/ɒn ði‿ˈʌð.ə ˈhænd/',
    ipaUs: '/ɑːn ði‿ˈʌð.ɚ ˈhænd/',
    stressPattern: '○ ○ ● ○ ●',
    bandLevel: '6.0',
    categoryEn: 'Consonant-Vowel Linking',
    categoryVi: 'Nối Âm Phụ Âm - Nguyên Âm',
    topicEn: 'Discourse Markers',
    topicVi: 'Từ nối chuyển ý',
    meaningEn: 'Used to introduce a contrasting point of view',
    meaningVi: 'Mặt khác (dùng để đưa ra góc nhìn đối lập)',
    trapEn: 'Pronouncing "the" as /ðə/ before a vowel instead of /ði/ linked with /j/ into "other".',
    trapVi: 'Đọc "the" là /ðə/ trước nguyên âm thay vì chuyển thành /ði/ nối liền sang "other".',
    mouthTipEn: 'Say /ði‿ˈʌðə/ as one smooth unit with voiced /ð/ (tongue between teeth).',
    mouthTipVi: 'Đọc /ði‿ˈʌðə/ liền thành một khối mượt mà với âm /ð/ hữu thanh.',
    exampleEn: 'On the other hand, remote working can blur the boundary between work and personal life.',
    exampleVi: 'Mặt khác, làm việc từ xa có thể làm mờ ranh giới giữa công việc và đời tư.',
    xpReward: 25
  },
  {
    id: 'pron-p-03',
    type: 'phrases',
    targetText: 'take it into account',
    connectedText: 'ˈtake‿it‿into‿acˈcount',
    ipaUk: '/ˈteɪ.kɪ.tɪn.tu‿əˈkaʊnt/',
    ipaUs: '/ˈteɪ.kɪ.t̬ɪn.tu‿əˈkaʊnt/',
    stressPattern: '● ○ ● ○ ○ ●',
    bandLevel: '7.0',
    categoryEn: 'Consonant-Vowel Linking',
    categoryVi: 'Nối Âm Phụ Âm - Nguyên Âm',
    topicEn: 'Decision Making',
    topicVi: 'Ra quyết định & Phân tích',
    meaningEn: 'To consider something along with other factors before reaching a decision',
    meaningVi: 'Cân nhắc, tính đến yếu tố nào đó',
    trapEn: 'Over-pronouncing "it" separately instead of linking "take_it_into" as a single flowing rhythm.',
    trapVi: 'Tách rời từ "it" quá cứng thay vì đọc nối chuỗi "take‿it‿into" thành một dòng âm thanh.',
    mouthTipEn: 'Link the /k/ of "take" to "it" (/teɪ.kɪt/) and glide directly into "account" (/əˈkaʊnt/).',
    mouthTipVi: 'Nối âm /k/ của "take" sang "it" (/teɪ.kɪt/) rồi lướt mượt vào trọng âm /əˈkaʊnt/.',
    exampleEn: 'Policymakers should take it into account when designing urban housing.',
    exampleVi: 'Các nhà hoạch định chính sách nên cân nhắc yếu tố này khi quy hoạch nhà ở đô thị.',
    xpReward: 25
  },
  {
    id: 'pron-p-04',
    type: 'phrases',
    targetText: 'a double-edged sword',
    connectedText: 'a ˈdouble-edged ˈsword',
    ipaUk: '/ə ˌdʌb.əl.edʒd ˈsɔːd/',
    ipaUs: '/ə ˌdʌb.əl.edʒd ˈsɔːrd/',
    stressPattern: '○ ● ○ ● ●',
    bandLevel: '7.5',
    categoryEn: 'Band 7.5+ Idiomatic Chunks',
    categoryVi: 'Cụm Học Thuật Band 7.5+',
    topicEn: 'Evaluation & Argument',
    topicVi: 'Đánh giá đa chiều',
    meaningEn: 'Something that has both favorable and unfavorable consequences',
    meaningVi: 'Con dao hai lưỡi (vừa có lợi vừa có hại)',
    trapEn: 'Pronouncing the silent "w" in "sword" (*s-word) or adding an extra syllable to "edged" (*ed-ged).',
    trapVi: 'Phát âm chữ "w" câm trong từ "sword" (*sờ-guốt) hoặc đọc "edged" thành 2 âm tiết.',
    mouthTipEn: 'Keep the "w" in "sword" 100% silent (/sɔːd/) and blend "double-edged" (/dʌb.əl.edʒd/).',
    mouthTipVi: 'Giữ âm "w" trong "sword" câm tuyệt đối (/sɔːd/) và nối mượt /dʌb.əl.edʒd/.',
    exampleEn: 'Social media is widely regarded as a double-edged sword for teenagers.',
    exampleVi: 'Mạng xã hội được xem rộng rãi như một con dao hai lưỡi đối với thanh thiếu niên.',
    xpReward: 25
  },
  {
    id: 'pron-p-05',
    type: 'phrases',
    targetText: 'from my perspective',
    connectedText: 'from ˈmy perˈspective',
    ipaUk: '/frəm ˈmaɪ pəˈspek.tɪv/',
    ipaUs: '/frəm ˈmaɪ pɚˈspek.tɪv/',
    stressPattern: '○ ● ○ ● ○',
    bandLevel: '6.5',
    categoryEn: 'Weak Forms & Reduction',
    categoryVi: 'Âm Yếu & Giảm Âm',
    topicEn: 'Expressing Opinions',
    topicVi: 'Nêu quan điểm Speaking',
    meaningEn: 'In my view; from my point of view',
    meaningVi: 'Theo góc nhìn / quan điểm của tôi',
    trapEn: 'Stressing "from" and "per-" heavily instead of reducing them to weak schwa sounds (/frəm/, /pə/).',
    trapVi: 'Đọc quá nặng từ "from" và âm "per-" thay vì giảm nhẹ thành âm schwa (/frəm/, /pə/).',
    mouthTipEn: 'Merge the double /m/ in "from my" into a single slightly held /m/ and punch -SPEC-tive.',
    mouthTipVi: 'Gộp hai âm /m/ ở cuối "from" và đầu "my" thành một âm /m/ liền mạch, nhấn mạnh -SPEC-.',
    exampleEn: 'From my perspective, practical experience outweighs theoretical knowledge.',
    exampleVi: 'Theo góc nhìn của tôi, kinh nghiệm thực tiễn quan trọng hơn kiến thức lý thuyết.',
    xpReward: 25
  },
  {
    id: 'pron-p-06',
    type: 'phrases',
    targetText: 'in the foreseeable future',
    connectedText: 'in the forˈseeable ˈfuture',
    ipaUk: '/ɪn ðə fɔːˈsiː.ə.bəl ˈfjuː.tʃər/',
    ipaUs: '/ɪn ðə fɔːrˈsiː.ə.bəl ˈfjuː.tʃɚ/',
    stressPattern: '○ ○ ○ ● ○ ○ ● ○',
    bandLevel: '7.5',
    categoryEn: 'Band 7.5+ Idiomatic Chunks',
    categoryVi: 'Cụm Học Thuật Band 7.5+',
    topicEn: 'Future Predictions (Part 3)',
    topicVi: 'Dự đoán tương lai (Part 3)',
    meaningEn: 'As far ahead in time as can reasonably be predicted',
    meaningVi: 'Trong tương lai gần có thể dự đoán được',
    trapEn: 'Stressing "fore-" instead of "-SEE-" in foreseeable.',
    trapVi: 'Nhấn nhầm trọng âm vào âm "fore-" thay vì nhấn vào "-SEE-" trong từ foreseeable.',
    mouthTipEn: 'Highlight the long /iː/ in for-SEE-a-ble and transition cleanly into /ˈfjuː.tʃər/.',
    mouthTipVi: 'Nhấn rõ âm /iː/ kéo dài ở for-SEE-a-ble rồi chuyển sang /ˈfjuː.tʃər/.',
    exampleEn: 'Cashless payments will dominate retail transactions in the foreseeable future.',
    exampleVi: 'Thanh toán không tiền mặt sẽ thống lĩnh giao dịch bán lẻ trong tương lai gần.',
    xpReward: 25
  },
  {
    id: 'pron-p-07',
    type: 'phrases',
    targetText: 'strike a balance between',
    connectedText: 'ˈstrike‿a ˈbalance beˈtween',
    ipaUk: '/ˈstraɪ.kə ˈbæl.əns bɪˈtwiːn/',
    ipaUs: '/ˈstraɪ.kə ˈbæl.əns bɪˈtwiːn/',
    stressPattern: '● ○ ● ○ ○ ●',
    bandLevel: '7.0',
    categoryEn: 'Consonant-Vowel Linking',
    categoryVi: 'Nối Âm Phụ Âm - Nguyên Âm',
    topicEn: 'Work-Life & Policy',
    topicVi: 'Cân bằng cuộc sống & Chính sách',
    meaningEn: 'To find a middle course or compromise between two extremes',
    meaningVi: 'Tìm điểm cân bằng hài hòa giữa hai yếu tố',
    trapEn: 'Dropping the /s/ at the end of "balance" or breaking the triple consonant cluster /str/ in "strike".',
    trapVi: 'Bỏ quên âm /s/ cuối từ "balance" hoặc phát âm rời rạc cụm phụ âm /str/ trong "strike".',
    mouthTipEn: 'Link /k/ of "strike" into "a" (/ˈstraɪ.kə/) and make sure the /s/ in "balance" is audible before "between".',
    mouthTipVi: 'Nối âm /k/ của "strike" sang "a" (/ˈstraɪ.kə/) và giữ âm /s/ cuối từ "balance" rõ ràng.',
    exampleEn: 'Students need to strike a balance between academic achievement and mental wellbeing.',
    exampleVi: 'Học sinh cần giữ sự cân bằng giữa thành tích học tập và sức khỏe tinh thần.',
    xpReward: 25
  },
  {
    id: 'pron-p-08',
    type: 'phrases',
    targetText: 'a pressing global issue',
    connectedText: 'a ˈpressing ˈglobal‿ˈissue',
    ipaUk: '/ə ˈpres.ɪŋ ˈɡləʊ.bəl‿ˈɪʃ.uː/',
    ipaUs: '/ə ˈpres.ɪŋ ˈɡloʊ.bəl‿ˈɪʃ.uː/',
    stressPattern: '○ ● ○ ● ○ ● ○',
    bandLevel: '7.0',
    categoryEn: 'Assimilation & Elision',
    categoryVi: 'Đồng Hóa Âm & Nối Âm',
    topicEn: 'Global Challenges',
    topicVi: 'Thách thức toàn cầu',
    meaningEn: 'An urgent problem affecting the whole world that requires immediate attention',
    meaningVi: 'Một vấn đề toàn cầu cấp bách',
    trapEn: 'Pronouncing "issue" with a plain /s/ instead of /ʃ/ (/ˈɪʃ.uː/).',
    trapVi: 'Đọc từ "issue" bằng âm /s/ nhẹ thay vì âm /ʃ/ cong môi (/ˈɪʃ.uː/).',
    mouthTipEn: 'Link the dark /l/ of "global" directly into the /ɪ/ of "issue" (/ˈɡləʊ.bə.lɪʃ.uː/).',
    mouthTipVi: 'Nối âm /l/ cuối từ "global" trực tiếp sang nguyên âm /ɪ/ của "issue" (/ˈɡləʊ.bə.lɪʃ.uː/).',
    exampleEn: 'Climate change remains a pressing global issue that demands international cooperation.',
    exampleVi: 'Biến đổi khí hậu vẫn là một vấn đề toàn cầu cấp bách đòi hỏi sự hợp tác quốc tế.',
    xpReward: 25
  },
  {
    id: 'pron-p-09',
    type: 'phrases',
    targetText: 'as a matter of fact',
    connectedText: 'as‿a ˈmatter‿of ˈfact',
    ipaUk: '/əz‿ə ˈmæt.ər‿əv ˈfækt/',
    ipaUs: '/əz‿ə ˈmæt̬.ɚ‿əv ˈfækt/',
    stressPattern: '○ ○ ● ○ ○ ●',
    bandLevel: '6.5',
    categoryEn: 'Consonant-Vowel Linking',
    categoryVi: 'Nối Âm Phụ Âm - Nguyên Âm',
    topicEn: 'Discourse Markers',
    topicVi: 'Từ nối hội thoại',
    meaningEn: 'In reality; used to emphasize the truth of an assertion',
    meaningVi: 'Trên thực tế là (dùng để nhấn mạnh hoặc bổ sung thực tế)',
    trapEn: 'Pronouncing "as", "a", and "of" with full vowels instead of weak forms linked together (/əz‿ə/, /ər‿əv/).',
    trapVi: 'Đọc rõ từng chữ "as", "a", "of" rời rạc thay vì giảm âm nhẹ và nối liền (/əz‿ə/, /ər‿əv/).',
    mouthTipEn: 'Link "as_a" (/ə.zə/) and "matter_of" (/ˈmæt.ə.rəv/), then finish with a crisp /kt/ in "fact".',
    mouthTipVi: 'Nối mượt "as‿a" (/ə.zə/) và "matter‿of" (/ˈmæt.ə.rəv/), sau đó bật gọn cụm âm cuối /kt/ của "fact".',
    exampleEn: 'As a matter of fact, public libraries are evolving into digital community hubs.',
    exampleVi: 'Trên thực tế, các thư viện công cộng đang chuyển mình thành trung tâm cộng đồng số.',
    xpReward: 25
  },
  {
    id: 'pron-p-10',
    type: 'phrases',
    targetText: 'Bridge the socioeconomic gap',
    connectedText: 'ˈbridge the ˌsocioecoˈnomic ˈgap',
    ipaUk: '/ˈbrɪdʒ ðə ˌsəʊ.si.əʊ.iː.kəˈnɒm.ɪk ˈɡæp/',
    ipaUs: '/ˈbrɪdʒ ðə ˌsoʊ.si.oʊ.iː.kəˈnɑː.mɪk ˈɡæp/',
    stressPattern: '● ○ ◐ ○ ○ ○ ● ○ ●',
    bandLevel: '8.0',
    categoryEn: 'Band 7.5+ Idiomatic Chunks',
    categoryVi: 'Cụm Học Thuật Band 7.5+',
    topicEn: 'Society & Equality',
    topicVi: 'Xã hội & Bình đẳng',
    meaningEn: 'To reduce disparities in wealth and social status between groups',
    meaningVi: 'Thu hẹp khoảng cách kinh tế - xã hội',
    trapEn: 'Losing rhythm inside the 7-syllable word "socioeconomic" or dropping the /dʒ/ in "bridge".',
    trapVi: 'Mất nhịp khi đọc từ dài 7 âm tiết "socioeconomic" hoặc bỏ quên âm cuối /dʒ/ của "bridge".',
    mouthTipEn: 'Use secondary stress on SO-ci-o and primary stress on -NOM-ic (/ˌsəʊ.si.əʊ.iː.kəˈnɒm.ɪk/).',
    mouthTipVi: 'Đặt trọng âm phụ ở SO-ci-o và nhấn trọng âm chính dứt khoát ở -NOM-ic.',
    exampleEn: 'Equal access to higher education helps bridge the socioeconomic gap.',
    exampleVi: 'Tiếp cận bình đẳng với giáo dục đại học giúp thu hẹp khoảng cách kinh tế - xã hội.',
    xpReward: 30
  },
  {
    id: 'pron-p-11',
    type: 'phrases',
    targetText: 'raise public awareness of',
    connectedText: 'ˈraise ˈpublic‿aˈwareness‿of',
    ipaUk: '/ˈreɪz ˈpʌb.lɪk‿əˈweə.nəs‿əv/',
    ipaUs: '/ˈreɪz ˈpʌb.lɪk‿əˈwer.nəs‿əv/',
    stressPattern: '● ● ○ ○ ● ○ ○',
    bandLevel: '6.5',
    requiresAuth: true,
    categoryEn: 'Consonant-Vowel Linking',
    categoryVi: 'Nối Âm Phụ Âm - Nguyên Âm',
    topicEn: 'Environment & Society',
    topicVi: 'Môi trường & Xã hội',
    meaningEn: 'To increase people’s understanding and consciousness of an issue',
    meaningVi: 'Nâng cao nhận thức cộng đồng về một vấn đề',
    trapEn: 'Dropping the /z/ in "raise" or pronouncing "of" heavily as /ɒv/ instead of weak /əv/.',
    trapVi: 'Quên âm /z/ cuối từ "raise" hoặc đọc quá nặng từ "of" thay vì giảm âm /əv/ nối với "awareness".',
    mouthTipEn: 'Link /k/ of "public" into "awareness" (/ˈpʌb.lɪ.kəˈweə.nəs/) and /s/ into "of" (/nə.səv/).',
    mouthTipVi: 'Nối /k/ của "public" sang "awareness" và /s/ của "awareness" sang "of".',
    exampleEn: 'Educational campaigns can raise public awareness of plastic pollution.',
    exampleVi: 'Các chiến dịch giáo dục có thể nâng cao nhận thức cộng đồng về ô nhiễm nhựa.',
    xpReward: 25
  },
  {
    id: 'pron-p-12',
    type: 'phrases',
    targetText: 'have a profound impact on',
    connectedText: 'ˈhave‿a proˈfound‿ˈimpact‿on',
    ipaUk: '/ˈhæv‿ə prəˈfaʊnd‿ˈɪm.pækt‿ɒn/',
    ipaUs: '/ˈhæv‿ə prəˈfaʊnd‿ˈɪm.pækt‿ɑːn/',
    stressPattern: '● ○ ○ ● ● ○ ●',
    bandLevel: '7.5',
    requiresAuth: true,
    categoryEn: 'Band 7.5+ Idiomatic Chunks',
    categoryVi: 'Cụm Học Thuật Band 7.5+',
    topicEn: 'Cause & Effect',
    topicVi: 'Nguyên nhân & Hệ quả',
    meaningEn: 'To strongly influence or change something in a deep way',
    meaningVi: 'Tạo ra tác động sâu sắc lên điều gì',
    trapEn: 'Stressing the second syllable of the noun "impact" (*im-PACT) instead of the first syllable (IM-pact).',
    trapVi: 'Nhấn nhầm trọng âm danh từ "impact" vào âm 2 (*im-PACT) thay vì âm đầu (IM-pact).',
    mouthTipEn: 'Link "have_a" (/ˈhæ.və/) and punch the first syllable of IM-pact.',
    mouthTipVi: 'Nối mượt "have‿a" (/ˈhæ.və/) và nhấn trọng âm đầu ở danh từ IM-pact.',
    exampleEn: 'Early childhood nutrition has a profound impact on cognitive development.',
    exampleVi: 'Dinh dưỡng đầu đời có tác động sâu sắc đến sự phát triển nhận thức.',
    xpReward: 25
  },
  {
    id: 'pron-p-13',
    type: 'phrases',
    targetText: 'keep pace with technological change',
    connectedText: 'ˈkeep ˈpace with ˌtechnoˈlogical ˈchange',
    ipaUk: '/ˈkiːp ˈpeɪs wɪð ˌtek.nəˈlɒdʒ.ɪ.kəl ˈtʃeɪndʒ/',
    ipaUs: '/ˈkiːp ˈpeɪs wɪð ˌtek.nəˈlɑː.dʒɪ.kəl ˈtʃeɪndʒ/',
    stressPattern: '● ● ○ ◐ ○ ● ○ ○ ●',
    bandLevel: '7.5',
    requiresAuth: true,
    categoryEn: 'Consonant Clusters',
    categoryVi: 'Tổ Hợp Phụ Âm Khó',
    topicEn: 'Technology & Work',
    topicVi: 'Công nghệ & Việc làm',
    meaningEn: 'To move or develop at the same speed as modern technological advances',
    meaningVi: 'Bắt kịp tốc độ thay đổi của công nghệ',
    trapEn: 'Dropping the /s/ in "pace" or the /-dʒ/ ending in "change".',
    trapVi: 'Nuốt mất âm /s/ cuối từ "pace" hoặc âm /-dʒ/ cuối từ "change".',
    mouthTipEn: 'Hold the long /iː/ in "keep", hiss /s/ in "pace", and finish cleanly on /tʃeɪndʒ/.',
    mouthTipVi: 'Ngân rõ /iː/ trong "keep", xì nhẹ /s/ ở "pace" và kết thúc rõ bằng /-dʒ/ ở "change".',
    exampleEn: 'Older workers often struggle to keep pace with technological change.',
    exampleVi: 'Người lao động lớn tuổi thường gặp khó khăn để bắt kịp thay đổi công nghệ.',
    xpReward: 30
  },
  {
    id: 'pron-p-14',
    type: 'phrases',
    targetText: 'it goes without saying that',
    connectedText: 'it ˈgoes wiˈthout ˈsaying that',
    ipaUk: '/ɪt ˈɡəʊz wɪˈðaʊt ˈseɪ.ɪŋ ðæt/',
    ipaUs: '/ɪt ˈɡoʊz wɪˈðaʊt ˈseɪ.ɪŋ ðæt/',
    stressPattern: '○ ● ○ ● ● ○ ○',
    bandLevel: '7.0',
    requiresAuth: true,
    categoryEn: 'Weak Forms & Reduction',
    categoryVi: 'Âm Yếu & Giảm Âm',
    topicEn: 'Discourse Markers',
    topicVi: 'Cụm dẫn ý tự nhiên',
    meaningEn: 'Used to mean that something is obvious and needs no explanation',
    meaningVi: 'Không cần phải nói cũng biết rằng, hiển nhiên là',
    trapEn: 'Saying "without" with unvoiced /θ/ instead of voiced /ð/ and dropping /z/ in "goes".',
    trapVi: 'Đọc "without" thiếu rung âm /ð/ hoặc quên âm /z/ cuối từ "goes".',
    mouthTipEn: 'Slide smoothly through /ˈɡəʊz wɪˈðaʊt/ and stress "SAY-ing".',
    mouthTipVi: 'Lướt mượt qua /ˈɡəʊz wɪˈðaʊt/ và nhấn vào trọng âm "SAY-ing".',
    exampleEn: 'It goes without saying that clean water is fundamental to public health.',
    exampleVi: 'Hiển nhiên là nước sạch đóng vai trò nền tảng cho sức khỏe cộng đồng.',
    xpReward: 25
  },
  {
    id: 'pron-p-15',
    type: 'phrases',
    targetText: 'weigh the pros and cons',
    connectedText: 'ˈweigh the ˈpros‿and ˈcons',
    ipaUk: '/ˈweɪ ðə ˈprəʊz‿ən ˈkɒnz/',
    ipaUs: '/ˈweɪ ðə ˈproʊz‿ən ˈkɑːnz/',
    stressPattern: '● ○ ● ○ ●',
    bandLevel: '7.0',
    requiresAuth: true,
    categoryEn: 'Weak Forms & Reduction',
    categoryVi: 'Âm Yếu & Giảm Âm',
    topicEn: 'Evaluation & Decision',
    topicVi: 'Đánh giá lợi hại',
    meaningEn: 'To carefully consider the advantages and disadvantages of something',
    meaningVi: 'Cân nhắc kỹ mặt lợi và mặt hại',
    trapEn: 'Pronouncing "and" fully as /ænd/ instead of reducing it to /ən/ ("pros n cons").',
    trapVi: 'Đọc từ "and" quá nặng thay vì giảm âm thành /ən/ ("pros ’n cons").',
    mouthTipEn: 'Link the /z/ of "pros" directly into weak /ən/ and end with voiced /z/ in "cons".',
    mouthTipVi: 'Nối âm /z/ của "pros" sang /ən/ rồi bật âm /z/ cuối từ "cons".',
    exampleEn: 'Graduates should weigh the pros and cons before relocating abroad.',
    exampleVi: 'Sinh viên tốt nghiệp nên cân nhắc kỹ lợi hại trước khi ra nước ngoài làm việc.',
    xpReward: 25
  },
  {
    id: 'pron-p-16',
    type: 'phrases',
    targetText: 'a sense of belonging',
    connectedText: 'a ˈsense‿of beˈlonging',
    ipaUk: '/ə ˈsens‿əv bɪˈlɒŋ.ɪŋ/',
    ipaUs: '/ə ˈsens‿əv bɪˈlɔːŋ.ɪŋ/',
    stressPattern: '○ ● ○ ○ ● ○',
    bandLevel: '7.0',
    requiresAuth: true,
    categoryEn: 'Consonant-Vowel Linking',
    categoryVi: 'Nối Âm Phụ Âm - Nguyên Âm',
    topicEn: 'Community & Culture',
    topicVi: 'Cộng đồng & Văn hóa',
    meaningEn: 'A feeling of being accepted, connected, and valued within a group',
    meaningVi: 'Cảm giác gắn kết, thuộc về một cộng đồng',
    trapEn: 'Omitting the /s/ in "sense" or pronouncing "-ng" in "belonging" with a hard /ɡ/ click.',
    trapVi: 'Quên nối âm /s/ của "sense" sang "of" hoặc bật âm /g/ quá cứng ở "belonging".',
    mouthTipEn: 'Link "sense_of" (/ˈsen.səv/) smoothly and keep /ŋ/ nasal in be-LONG-ing.',
    mouthTipVi: 'Nối mượt "sense‿of" (/ˈsen.səv/) và giữ âm mũi /ŋ/ tự nhiên ở be-LONG-ing.',
    exampleEn: 'Community festivals foster a strong sense of belonging among neighbors.',
    exampleVi: 'Các lễ hội cộng đồng nuôi dưỡng cảm giác gắn kết mạnh mẽ giữa hàng xóm.',
    xpReward: 25
  },
  {
    id: 'pron-p-17',
    type: 'phrases',
    targetText: 'at the expense of',
    connectedText: 'at the‿exˈpense‿of',
    ipaUk: '/ət ði‿ɪkˈspens‿əv/',
    ipaUs: '/ət ði‿ɪkˈspens‿əv/',
    stressPattern: '○ ○ ○ ● ○',
    bandLevel: '8.0',
    requiresAuth: true,
    categoryEn: 'Band 7.5+ Idiomatic Chunks',
    categoryVi: 'Cụm Học Thuật Band 7.5+',
    topicEn: 'Trade-offs & Policy',
    topicVi: 'Đánh đổi & Chính sách',
    meaningEn: 'With loss or damage to something else in order to achieve an objective',
    meaningVi: 'Đánh đổi bằng cái giá của điều gì',
    trapEn: 'Saying /ðə/ instead of /ði/ before "expense" and pausing before "of".',
    trapVi: 'Đọc "the" là /ðə/ trước nguyên âm của "expense" thay vì /ði/.',
    mouthTipEn: 'Glide /ði‿ɪkˈspen.səv/ as one seamless rhythmic phrase.',
    mouthTipVi: 'Lướt mượt cả cụm /ði‿ɪkˈspen.səv/ như một khối liền mạch.',
    exampleEn: 'Economic growth should not come at the expense of environmental sustainability.',
    exampleVi: 'Tăng trưởng kinh tế không nên đánh đổi bằng sự bền vững của môi trường.',
    xpReward: 30
  },
  {
    id: 'pron-p-18',
    type: 'phrases',
    targetText: 'in the long run',
    connectedText: 'in the ˈlong ˈrun',
    ipaUk: '/ɪn ðə ˈlɒŋ ˈrʌn/',
    ipaUs: '/ɪn ðə ˈlɔːŋ ˈrʌn/',
    stressPattern: '○ ○ ● ●',
    bandLevel: '6.5',
    requiresAuth: true,
    categoryEn: 'Weak Forms & Reduction',
    categoryVi: 'Âm Yếu & Giảm Âm',
    topicEn: 'Future & Planning',
    topicVi: 'Tương lai & Kế hoạch',
    meaningEn: 'Over a long period of time in the future; eventually',
    meaningVi: 'Về lâu dài',
    trapEn: 'Dropping the nasal /ŋ/ in "long" or failing to curl the tongue for /r/ in "run".',
    trapVi: 'Đọc lướt âm mũi /ŋ/ ở "long" hoặc chưa tròn môi nhẹ cho âm /r/ ở "run".',
    mouthTipEn: 'Keep "in the" quick and light, then stress both "LONG" and "RUN".',
    mouthTipVi: 'Lướt nhanh "in the" rồi nhấn đều cả hai từ khóa "LONG" và "RUN".',
    exampleEn: 'Investing in preventative healthcare saves billions in the long run.',
    exampleVi: 'Đầu tư vào y tế dự phòng sẽ tiết kiệm hàng tỷ đô la về lâu dài.',
    xpReward: 25
  },
  {
    id: 'pron-p-19',
    type: 'phrases',
    targetText: 'broaden one’s horizons',
    connectedText: 'ˈbroaden one’s hoˈrizons',
    ipaUk: '/ˈbrɔː.dən wʌnz həˈraɪ.zənz/',
    ipaUs: '/ˈbrɔː.dən wʌnz həˈraɪ.zənz/',
    stressPattern: '● ○ ● ○ ● ○',
    bandLevel: '7.5',
    requiresAuth: true,
    categoryEn: 'Band 7.5+ Idiomatic Chunks',
    categoryVi: 'Cụm Học Thuật Band 7.5+',
    topicEn: 'Travel & Education',
    topicVi: 'Du lịch & Giáo dục',
    meaningEn: 'To expand one’s range of interests, knowledge, and experiences',
    meaningVi: 'Mở rộng tầm nhìn, kiến thức và trải nghiệm',
    trapEn: 'Dropping the final /z/ in "horizons" or stressing "ho-" instead of "-RI-".',
    trapVi: 'Quên âm /z/ cuối từ "horizons" hoặc nhấn nhầm trọng âm vào âm đầu "ho-".',
    mouthTipEn: 'Stress BROAD-en, voice /z/ in "one’s", and hit -RI- in ho-RI-zons.',
    mouthTipVi: 'Nhấn BROAD-en, rung /z/ ở "one’s" và nhấn mạnh vào -RI- trong ho-RI-zons.',
    exampleEn: 'Studying abroad allows students to broaden their cultural horizons.',
    exampleVi: 'Du học giúp sinh viên mở rộng tầm nhìn văn hóa.',
    xpReward: 30
  },
  {
    id: 'pron-p-20',
    type: 'phrases',
    targetText: 'exert a significant influence on',
    connectedText: 'exˈert‿a sigˈnificant‿ˈinfluence‿on',
    ipaUk: '/ɪɡˈzɜːt‿ə sɪɡˈnɪf.ɪ.kənt‿ˈɪn.flu.əns‿ɒn/',
    ipaUs: '/ɪɡˈzɝːt‿ə sɪɡˈnɪf.ɪ.kənt‿ˈɪn.flu.əns‿ɑːn/',
    stressPattern: '○ ● ○ ○ ● ○ ○ ● ○ ○ ●',
    bandLevel: '8.0',
    requiresAuth: true,
    categoryEn: 'Consonant-Vowel Linking',
    categoryVi: 'Nối Âm Phụ Âm - Nguyên Âm',
    topicEn: 'Academic Collocations',
    topicVi: 'Collocation Học Thuật',
    meaningEn: 'To have a strong effect on someone’s decisions or behavior',
    meaningVi: 'Tạo ra ảnh hưởng đáng kể lên ai/cái gì',
    trapEn: 'Pronouncing "exert" with /eks/ instead of /ɪɡˈzɜːt/ and stressing "in-FLU-ence" instead of "IN-flu-ence".',
    trapVi: 'Đọc "exert" thành /eks/ thay vì /ɪɡˈzɜːt/ và nhấn nhầm trọng âm 2 ở "influence".',
    mouthTipEn: 'Link /t/ of "exert" into "a" (/zɜː.tə/) and stress the first syllable of IN-flu-ence.',
    mouthTipVi: 'Nối /t/ của "exert" sang "a" và nhấn trọng âm đầu của IN-flu-ence.',
    exampleEn: 'Peer groups exert a significant influence on adolescent consumer choices.',
    exampleVi: 'Nhóm bạn đồng trang lứa tạo ảnh hưởng đáng kể lên lựa chọn tiêu dùng của thanh thiếu niên.',
    xpReward: 30
  }
];

export const PRONUNCIATION_SENTENCE_DRILLS = [
  {
    id: 'pron-s-01',
    type: 'sentences',
    targetText: 'While technological progress undoubtedly boosts productivity, it can also erode interpersonal bonds.',
    intonationText: 'While technoˈlogical ˈprogress ↗ / unˈdoubtedly boosts producˈtivity, ↗ // it can ˈalso eˈrode ↘ / interˈpersonal ˈbonds. ↘',
    ipaUk: '/waɪl ˌtek.nəˈlɒdʒ.ɪ.kəl ˈprəʊ.ɡres ʌnˈdaʊ.tɪd.li buːsts ˌprɒd.ʌkˈtɪv.ə.ti / ɪt kən ˈɔːl.səʊ ɪˈrəʊd ˌɪn.təˈpɜː.sən.əl bɒndz/',
    ipaUs: '/waɪl ˌtek.nəˈlɑː.dʒɪ.kəl ˈprɑː.ɡres ʌnˈdaʊ.t̬ɪd.li buːsts ˌprɑː.dʌkˈtɪv.ə.t̬i / ɪt kən ˈɑːl.soʊ ɪˈroʊd ˌɪn.t̬ɚˈpɝː.sən.əl bɑːndz/',
    bandLevel: '8.0',
    categoryEn: 'Part 3 Contrast & Hedging',
    categoryVi: 'Ngữ Điệu Tương Phản Part 3',
    topicEn: 'Technology & Society',
    topicVi: 'Công nghệ & Xã hội',
    meaningEn: 'A balanced Band 8.0 complex sentence contrasting productivity gains against social isolation.',
    meaningVi: 'Câu phức Band 8.0 đối chiếu sự gia tăng năng suất với hệ lụy làm phai nhạt gắn kết con người.',
    trapEn: 'Reading in a flat monotone without rising intonation on "productivity ↗" at the clause boundary.',
    trapVi: 'Đọc đều đều một giọng mà không lên giọng nhẹ ở cuối mệnh đề phụ "productivity ↗" trước khi chuyển ý.',
    mouthTipEn: 'Use rising intonation (↗) on "productivity" to signal incomplete thought, pause briefly (//), then fall decisively (↘) on "bonds".',
    mouthTipVi: 'Lên giọng nhẹ (↗) ở "productivity", ngắt nhịp ngắn (//), sau đó hạ giọng dứt khoát (↘) ở từ khóa "bonds".',
    xpReward: 35
  },
  {
    id: 'pron-s-02',
    type: 'sentences',
    targetText: 'To be perfectly honest, I have always been fascinated by how architecture reflects cultural identity.',
    intonationText: 'To be ˈperfectly ˈhonest, ↗ / I’ve ˈalways been ˈfascinated ↘ / by how ˈarchitecture reˈflects ↗ / ˈcultural iˈdentity. ↘',
    ipaUk: '/tə bi ˈpɜː.fekt.li ˈɒn.ɪst / aɪv ˈɔːl.weɪz biːn ˈfæs.ɪ.neɪ.tɪd / baɪ haʊ ˈɑː.kɪ.tek.tʃə rɪˈflekts ˈkʌl.tʃər.əl aɪˈden.tə.ti/',
    ipaUs: '/tə bi ˈpɝː.fekt.li ˈɑː.nɪst / aɪv ˈɑːl.weɪz bɪn ˈfæs.ə.neɪ.t̬ɪd / baɪ haʊ ˈɑːr.kə.tek.tʃɚ rɪˈflekts ˈkʌl.tʃɚ.əl aɪˈden.t̬ə.t̬i/',
    bandLevel: '7.5',
    categoryEn: 'Part 1 Natural Rhythm',
    categoryVi: 'Nhịp Điệu Tự Nhiên Part 1',
    topicEn: 'Art & Culture',
    topicVi: 'Nghệ thuật & Văn hóa',
    meaningEn: 'A natural, fluent Part 1/2 opener expressing personal enthusiasm with high-scoring lexical chunks.',
    meaningVi: 'Câu mở đầu Part 1/2 tự nhiên thể hiện niềm yêu thích cá nhân với cấu trúc từ vựng ăn điểm.',
    trapEn: 'Pronouncing the silent "h" in "honest" or saying "architecture" with /tʃ/ instead of /k/ in the first syllable.',
    trapVi: 'Phát âm chữ "h" câm trong "honest" hoặc đọc nhầm âm đầu của "architecture" thành /tʃ/ thay vì /k/.',
    mouthTipEn: 'Keep "To be" weak and fast (/tə bi/), emphasize "FAScinated", and drop pitch smoothly on "cultural iDENtity ↘".',
    mouthTipVi: 'Lướt nhanh cụm "To be" (/tə bi/), nhấn rõ trọng âm "FAScinated" và hạ giọng ấm ở cuối câu "iDENtity ↘".',
    xpReward: 35
  },
  {
    id: 'pron-s-03',
    type: 'sentences',
    targetText: 'What really stood out to me was the serene atmosphere of the coastal village at sunrise.',
    intonationText: 'What ˈreally stood ˈout to me ↗ / was the seˈrene ˈatmosphere ↘ / of the ˈcoastal ˈvillage ↗ / at ˈsunrise. ↘',
    ipaUk: '/wɒt ˈrɪə.li stʊd ˈaʊt tə mi / wəz ðə səˈriːn ˈæt.məs.fɪər / əv ðə ˈkəʊ.stəl ˈvɪl.ɪdʒ ət ˈsʌn.raɪz/',
    ipaUs: '/wɑːt ˈrɪə.li stʊd ˈaʊt tə mi / wəz ðə səˈriːn ˈæt.məs.fɪr / əv ðə ˈkoʊ.stəl ˈvɪl.ɪdʒ ət ˈsʌn.raɪz/',
    bandLevel: '7.5',
    categoryEn: 'Part 2 Storytelling Intonation',
    categoryVi: 'Ngữ Điệu Kể Chuyện Part 2',
    topicEn: 'Memorable Places (Part 2)',
    topicVi: 'Địa điểm đáng nhớ (Part 2)',
    meaningEn: 'A cleft sentence ("What really stood out to me was...") ideal for highlighting key impressions in Speaking Part 2.',
    meaningVi: 'Câu chẻ nhấn mạnh ấn tượng sâu sắc nhất, cực kỳ hữu dụng khi miêu tả địa điểm/trải nghiệm ở Part 2.',
    trapEn: 'Stressing "was", "of", and "at" instead of reducing them to weak forms (/wəz/, /əv/, /ət/).',
    trapVi: 'Đọc quá mạnh các hư từ "was", "of", "at" thay vì giảm âm nhẹ (/wəz/, /əv/, /ət/) để tôn từ khóa lên.',
    mouthTipEn: 'Link "stood_out" (/stʊˈdaʊt/), stretch the long vowel in "seRENE", and end calmly on "SUNrise ↘".',
    mouthTipVi: 'Nối âm "stood‿out" (/stʊˈdaʊt/), ngân nhẹ âm /iː/ trong "seRENE" và kết câu êm ái ở "SUNrise ↘".',
    xpReward: 35
  },
  {
    id: 'pron-s-04',
    type: 'sentences',
    targetText: 'Had the government invested earlier in public transit, urban congestion would not be so severe today.',
    intonationText: 'Had the ˈgovernment inˈvested ˈearlier ↗ / in ˈpublic ˈtransit, ↗ // ˈurban conˈgestion ↘ / would ˈnot be so seˈvere toˈday. ↘',
    ipaUk: '/həd ðə ˈɡʌv.ən.mənt ɪnˈves.tɪd ˈɜː.li.ər ɪn ˈpʌb.lɪk ˈtræn.zɪt / ˈɜː.bən kənˈdʒes.tʃən wʊd ˈnɒt bi səʊ sɪˈvɪə təˈdeɪ/',
    ipaUs: '/həd ðə ˈɡʌv.ɚn.mənt ɪnˈves.tɪd ˈɝː.li.ɚ ɪn ˈpʌb.lɪk ˈtræn.zɪt / ˈɝː.bən kənˈdʒes.tʃən wʊd ˈnɑːt bi soʊ sɪˈvɪr təˈdeɪ/',
    bandLevel: '8.5',
    categoryEn: 'Complex Clauses & Thought Groups',
    categoryVi: 'Câu Đảo Ngữ & Ngắt Cụm Tư Duy',
    topicEn: 'Urban Planning & Policy',
    topicVi: 'Quy hoạch đô thị & Chính sách',
    meaningEn: 'An inverted third-conditional sentence demonstrating Band 8.5 grammatical range and authoritative pacing.',
    meaningVi: 'Câu điều kiện loại 3 đảo ngữ thể hiện ngữ pháp Band 8.5 và nhịp điệu lập luận đĩnh đạc.',
    trapEn: 'Rushing through the comma break after "public transit" without a clear thought-group pause.',
    trapVi: 'Đọc lướt qua dấu phẩy sau "public transit" mà không có nhịp nghỉ (pause) để tách hai mệnh đề.',
    mouthTipEn: 'Keep pitch rising slightly through "public transit ↗", pause 0.3s, then emphasize "NOT" and "seVERE ↘".',
    mouthTipVi: 'Giữ ngữ điệu hướng lên ở mệnh đề điều kiện "public transit ↗", nghỉ 0.3 giây rồi nhấn rõ "NOT" và "seVERE ↘".',
    xpReward: 40
  },
  {
    id: 'pron-s-05',
    type: 'sentences',
    targetText: 'It is widely acknowledged that lifelong learning is essential for thriving in an automated economy.',
    intonationText: 'It‿is ˈwidely acˈknowledged ↗ / that ˈlifelong ˈlearning ↗ / is eˈssential for ˈthriving ↘ / in‿an ˈautomated eˈconomy. ↘',
    ipaUk: '/ɪ.tɪz ˈwaɪd.li əkˈnɒl.ɪdʒd / ðət ˈlaɪf.lɒŋ ˈlɜː.nɪŋ / ɪz ɪˈsen.ʃəl fə ˈθraɪ.vɪŋ / ɪn‿ən ˈɔː.tə.meɪ.tɪd iˈkɒn.ə.mi/',
    ipaUs: '/ɪ.t̬ɪz ˈwaɪd.li əkˈnɑː.lɪdʒd / ðət ˈlaɪf.lɔːŋ ˈlɝː.nɪŋ / ɪz ɪˈsen.ʃəl fɚ ˈθraɪ.vɪŋ / ɪn‿ən ˈɑː.t̬ə.meɪ.t̬ɪd iˈkɑː.nə.mi/',
    bandLevel: '7.5',
    categoryEn: 'Part 3 Contrast & Hedging',
    categoryVi: 'Ngữ Điệu Lập Luận Part 3',
    topicEn: 'Education & Future of Work',
    topicVi: 'Giáo dục & Tương lai việc làm',
    meaningEn: 'An academic topic sentence with passive hedging and strong collocations ("lifelong learning", "automated economy").',
    meaningVi: 'Câu chủ đề học thuật sử dụng cấu trúc khách quan và collocation đắt giá ("lifelong learning", "automated economy").',
    trapEn: 'Mispronouncing the /-dʒd/ ending in "acknowledged" or the /θr/ cluster in "thriving".',
    trapVi: 'Bỏ sót âm đuôi /-dʒd/ trong "acknowledged" hoặc phát âm chưa chuẩn cụm /θr/ trong "thriving".',
    mouthTipEn: 'Link "It_is" (/ɪ.tɪz/) and "in_an" (/ɪ.nən/), and stress the second syllable of e-CON-o-my.',
    mouthTipVi: 'Nối âm "It‿is" (/ɪ.tɪz/) và "in‿an" (/ɪ.nən/), đồng thời nhấn đúng trọng âm hai của e-CON-o-my.',
    xpReward: 35
  },
  {
    id: 'pron-s-06',
    type: 'sentences',
    targetText: 'Whenever I feel overwhelmed by deadlines, taking a brisk walk in the park helps me recharge my batteries.',
    intonationText: 'Whenˈever I feel overˈwhelmed by ˈdeadlines, ↗ // ˈtaking a ˈbrisk ˈwalk in the ˈpark ↗ / ˈhelps me reˈcharge my ˈbatteries. ↘',
    ipaUk: '/wenˈev.ər aɪ fiːl ˌəʊ.vəˈwelmd baɪ ˈded.laɪnz / ˈteɪ.kɪŋ ə ˈbrɪsk ˈwɔːk ɪn ðə ˈpɑːk / ˈhelps mi ˌriːˈtʃɑːdʒ maɪ ˈbæt.ər.iz/',
    ipaUs: '/wenˈev.ɚ aɪ fiːl ˌoʊ.vɚˈwelmd baɪ ˈded.laɪnz / ˈteɪ.kɪŋ ə ˈbrɪsk ˈwɑːk ɪn ðə ˈpɑːrk / ˈhelps mi ˌriːˈtʃɑːrdʒ maɪ ˈbæt̬.ɚ.iz/',
    bandLevel: '7.0',
    categoryEn: 'Part 1 Natural Rhythm',
    categoryVi: 'Nhịp Điệu Tự Nhiên Part 1',
    topicEn: 'Health & Leisure',
    topicVi: 'Sức khỏe & Thư giãn',
    meaningEn: 'A natural, idiomatic Part 1 response about stress management ("brisk walk", "recharge my batteries").',
    meaningVi: 'Câu trả lời Part 1 tự nhiên, giàu thành ngữ về cách giải tỏa căng thẳng ("brisk walk", "recharge my batteries").',
    trapEn: 'Forgetting the /s/ in "helps" or the plural /z/ in "deadlines" and "batteries".',
    trapVi: 'Quên âm /s/ trong "helps" hoặc âm /z/ số nhiều ở cuối từ "deadlines" và "batteries".',
    mouthTipEn: 'Rise slightly on "deadlines ↗", keep "brisk walk" crisp, and fall warmly on "recharge my batteries ↘".',
    mouthTipVi: 'Lên giọng ở "deadlines ↗", bật gọn cụm "brisk walk" và hạ giọng tự nhiên ở "recharge my batteries ↘".',
    xpReward: 35
  },
  {
    id: 'pron-s-07',
    type: 'sentences',
    targetText: 'Not only does reading broaden our horizons, but it also cultivates critical thinking skills.',
    intonationText: 'Not ˈonly does ˈreading ˈbroaden our hoˈrizons, ↗ // but‿it ˈalso ˈcultivates ↘ / ˈcritical ˈthinking ˈskills. ↘',
    ipaUk: '/nɒt ˈəʊn.li dʌz ˈriː.dɪŋ ˈbrɔː.dən aʊə həˈraɪ.zənz / bʌt‿ɪt ˈɔːl.səʊ ˈkʌl.tɪ.veɪts ˈkrɪt.ɪ.kəl ˈθɪŋ.kɪŋ skɪlz/',
    ipaUs: '/nɑːt ˈoʊn.li dʌz ˈriː.dɪŋ ˈbrɔː.dən aʊɚ həˈraɪ.zənz / bʌt‿ɪt ˈɑːl.soʊ ˈkʌl.tə.veɪts ˈkrɪt̬.ɪ.kəl ˈθɪŋ.kɪŋ skɪlz/',
    bandLevel: '7.5',
    categoryEn: 'Complex Clauses & Thought Groups',
    categoryVi: 'Câu Đảo Ngữ & Ngắt Cụm Tư Duy',
    topicEn: 'Reading & Education',
    topicVi: 'Đọc sách & Giáo dục',
    meaningEn: 'A Band 7.5+ "Not only... but also..." inverted structure showcasing strong rhythm and nuclear stress.',
    meaningVi: 'Cấu trúc đảo ngữ "Not only... but also..." Band 7.5+ giúp tăng điểm Grammatical Range và ngữ điệu nhấn.',
    trapEn: 'Dropping the /z/ in "horizons" and "skills" or failing to stress "ONLY" and "ALSO".',
    trapVi: 'Quên âm /z/ cuối từ "horizons" và "skills" hoặc không nhấn giọng vào cặp từ tương ứng "ONLY" và "ALSO".',
    mouthTipEn: 'Pitch rises on "hoRIzons ↗", links "but_it" (/bʌ.tɪt/), and falls firmly on "critical THINKing skills ↘".',
    mouthTipVi: 'Lên giọng ở cuối vế đầu "hoRIzons ↗", nối âm "but‿it" và hạ giọng chắc chắn ở "critical THINKing skills ↘".',
    xpReward: 35
  },
  {
    id: 'pron-s-08',
    type: 'sentences',
    targetText: 'Although preserving historical buildings is costly, they serve as an irreplaceable link to our heritage.',
    intonationText: 'Alˈthough preˈserving hisˈtorical ˈbuildings is ˈcostly, ↗ // they ˈserve‿as an ˌirreˈplaceable ˈlink ↘ / to our ˈheritage. ↘',
    ipaUk: '/ɔːlˈðəʊ prɪˈzɜː.vɪŋ hɪˈstɒr.ɪ.kəl ˈbɪl.dɪŋz ɪz ˈkɒst.li / ðeɪ ˈsɜːv‿əz ən ˌɪr.ɪˈpleɪ.sə.bəl ˈlɪŋk tu aʊə ˈher.ɪ.tɪdʒ/',
    ipaUs: '/ɔːlˈðoʊ prɪˈzɝː.vɪŋ hɪˈstɔːr.ɪ.kəl ˈbɪl.dɪŋz ɪz ˈkɑːst.li / ðeɪ ˈsɝːv‿əz ən ˌɪr.ɪˈpleɪ.sə.bəl ˈlɪŋk tu aʊɚ ˈher.ə.t̬ɪdʒ/',
    bandLevel: '8.0',
    categoryEn: 'Part 3 Contrast & Hedging',
    categoryVi: 'Ngữ Điệu Tương Phản Part 3',
    topicEn: 'History & Architecture',
    topicVi: 'Lịch sử & Kiến trúc',
    meaningEn: 'A concessive complex sentence ideal for IELTS Speaking Part 3 debates on heritage conservation.',
    meaningVi: 'Câu phức nhượng bộ lý tưởng khi trả lời câu hỏi tranh biện Speaking Part 3 về bảo tồn di sản.',
    trapEn: 'Stressing "HIS-to-ry" pattern onto "his-TOR-i-cal" (stress shifts to the second syllable -TOR-).',
    trapVi: 'Giữ nguyên trọng âm của từ "history" khi đọc "historical" (trọng âm phải dịch chuyển sang âm thứ 2: his-TOR-i-cal).',
    mouthTipEn: 'Emphasize "-PLACE-" in irreplaceable and finish with a clean /-tɪdʒ/ in "heritage ↘".',
    mouthTipVi: 'Nhấn mạnh âm "-PLACE-" trong irreplaceable và kết thúc rõ bằng âm /-tɪdʒ/ ở cuối từ "heritage ↘".',
    xpReward: 40
  },
  {
    id: 'pron-s-09',
    type: 'sentences',
    targetText: 'From my perspective, governments should subsidize public transit rather than widening urban highways.',
    intonationText: 'From ˈmy perˈspective, ↗ / ˈgovernments should ˈsubsidize ˈpublic ˈtransit ↗ // ˈrather than ˈwidening ˈurban ˈhighways. ↘',
    ipaUk: '/frəm ˈmaɪ pəˈspek.tɪv / ˈɡʌv.ən.mənts ʃəd ˈsʌb.sɪ.daɪz ˈpʌb.lɪk ˈtræn.zɪt / ˈrɑː.ðə ðən ˈwaɪ.dən.ɪŋ ˈɜː.bən ˈhaɪ.weɪz/',
    ipaUs: '/frəm ˈmaɪ pɚˈspek.tɪv / ˈɡʌv.ɚn.mənts ʃəd ˈsʌb.sə.daɪz ˈpʌb.lɪk ˈtræn.zɪt / ˈræð.ɚ ðən ˈwaɪ.dən.ɪŋ ˈɝː.bən ˈhaɪ.weɪz/',
    bandLevel: '7.5',
    requiresAuth: true,
    categoryEn: 'Part 3 Policy Argument',
    categoryVi: 'Lập Luận Chính Sách Part 3',
    topicEn: 'Transport & Urban Policy',
    topicVi: 'Giao thông & Đô thị',
    meaningEn: 'A clear Part 3 opinion statement contrasting public transit investment against highway expansion.',
    meaningVi: 'Câu nêu quan điểm Part 3 sắc nét đề xuất trợ giá giao thông công cộng thay vì mở rộng cao tốc.',
    trapEn: 'Stressing "sub-SI-dize" instead of "SUB-si-dize" or dropping the plural /z/ in "highways".',
    trapVi: 'Nhấn sai trọng âm từ "subsidize" (phải nhấn âm đầu SUB-) hoặc quên âm /z/ cuối từ "highways".',
    mouthTipEn: 'Rise slightly on "perspective ↗", contrast "public transit" vs "urban highways ↘".',
    mouthTipVi: 'Lên giọng nhẹ ở "perspective ↗", nhấn đối lập "public transit" với "urban highways ↘".',
    xpReward: 35
  },
  {
    id: 'pron-s-10',
    type: 'sentences',
    targetText: 'If I had known how demanding the curriculum was, I would have managed my time far more effectively.',
    intonationText: 'If‿I’d ˈknown how deˈmanding the curˈriculum was, ↗ // I would‿have ˈmanaged my ˈtime ↘ / ˈfar more efˈfectively. ↘',
    ipaUk: '/ɪ.faɪd ˈnəʊn haʊ dɪˈmɑːn.dɪŋ ðə kəˈrɪk.jə.ləm wɒz / aɪ wʊ.dəv ˈmæn.ɪdʒd maɪ taɪm fɑː mɔːr‿ɪˈfek.tɪv.li/',
    ipaUs: '/ɪ.faɪd ˈnoʊn haʊ dɪˈmæn.dɪŋ ðə kəˈrɪk.jə.ləm wɑːz / aɪ wʊ.dəv ˈmæn.ɪdʒd maɪ taɪm fɑːr mɔːr‿ɪˈfek.tɪv.li/',
    bandLevel: '8.0',
    requiresAuth: true,
    categoryEn: 'Complex Clauses & Thought Groups',
    categoryVi: 'Câu Điều Kiện & Ngắt Nhịp',
    topicEn: 'Education & Reflection',
    topicVi: 'Giáo dục & Chiêm nghiệm',
    meaningEn: 'A Band 8.0 third-conditional reflection ideal for Speaking Part 2/3 follow-up questions.',
    meaningVi: 'Câu điều kiện loại 3 Band 8.0 rất hay dùng khi hồi tưởng kinh nghiệm học tập ở Part 2/3.',
    trapEn: 'Pronouncing "would have" stiffly word-by-word instead of blending /wʊ.dəv/.',
    trapVi: 'Đọc tách rời "would have" quá cứng thay vì nối mượt thành /wʊ.dəv/.',
    mouthTipEn: 'Link "If_I’d" (/ɪ.faɪd/), pause briefly after "was ↗ //", and emphasize "FAR more efFECtively ↘".',
    mouthTipVi: 'Nối "If‿I’d", nghỉ ngắn sau "was ↗ //" và nhấn mạnh cụm "FAR more efFECtively ↘".',
    xpReward: 40
  },
  {
    id: 'pron-s-11',
    type: 'sentences',
    targetText: 'One major drawback of remote work is that it blurs the boundary between professional duties and personal life.',
    intonationText: 'One ˈmajor ˈdrawback of reˈmote ˈwork ↗ / is that‿it ˈblurs the ˈboundary ↘ / beˈtween proˈfessional ˈduties ↗ / and ˈpersonal ˈlife. ↘',
    ipaUk: '/wʌn ˈmeɪ.dʒə ˈdrɔː.bæk əv rɪˈməʊt wɜːk / ɪz ðæt‿ɪt ˈblɜːz ðə ˈbaʊn.dri / bɪˈtwiːn prəˈfeʃ.ən.əl ˈdʒuː.tiz ənd ˈpɜː.sən.əl laɪf/',
    ipaUs: '/wʌn ˈmeɪ.dʒɚ ˈdrɔː.bæk əv rɪˈmoʊt wɝːk / ɪz ðæt‿ɪt ˈblɝːz ðə ˈbaʊn.dri / bɪˈtwiːn prəˈfeʃ.ən.əl ˈduː.t̬iz ənd ˈpɝː.sən.əl laɪf/',
    bandLevel: '7.5',
    requiresAuth: true,
    categoryEn: 'Part 3 Contrast & Hedging',
    categoryVi: 'Ngữ Điệu Lập Luận Part 3',
    topicEn: 'Work & Lifestyle',
    topicVi: 'Công việc & Đời sống',
    meaningEn: 'An articulate Part 3 argument explaining work-life boundary erosion in remote jobs.',
    meaningVi: 'Câu lập luận Part 3 mạch lạc về nhược điểm làm mờ ranh giới công việc - đời tư khi làm từ xa.',
    trapEn: 'Omitting the /z/ in "blurs" or pronouncing "boundary" with 4 heavy syllables.',
    trapVi: 'Quên âm /z/ cuối từ "blurs" hoặc đọc "boundary" quá nặng nề.',
    mouthTipEn: 'Keep "that_it" linked (/ðæt‿ɪt/) and contrast "proFESsional duties ↗" with "PERsonal life ↘".',
    mouthTipVi: 'Nối "that‿it" và đọc đối lập ngữ điệu giữa "proFESsional duties ↗" và "PERsonal life ↘".',
    xpReward: 35
  },
  {
    id: 'pron-s-12',
    type: 'sentences',
    targetText: 'Despite rapid economic expansion, many rural regions still grapple with inadequate healthcare infrastructure.',
    intonationText: 'Deˈspite ˈrapid ecoˈnomic exˈpansion, ↗ // ˈmany ˈrural ˈregions ↗ / still ˈgrapple with inˈadequate ˈhealthcare ˈinfrastructure. ↘',
    ipaUk: '/dɪˈspaɪt ˈræp.ɪd ˌiː.kəˈnɒm.ɪk ɪkˈspæn.ʃən / ˈmen.i ˈrʊə.rəl ˈriː.dʒənz stɪl ˈɡræp.əl wɪð ɪnˈæd.ɪ.kwət ˈhelθ.keər ˈɪn.frə.strʌk.tʃər/',
    ipaUs: '/dɪˈspaɪt ˈræp.ɪd ˌek.əˈnɑː.mɪk ɪkˈspæn.ʃən / ˈmen.i ˈrʊr.əl ˈriː.dʒənz stɪl ˈɡræp.əl wɪð ɪnˈæd.ə.kwət ˈhelθ.ker ˈɪn.frə.strʌk.tʃɚ/',
    bandLevel: '8.5',
    requiresAuth: true,
    categoryEn: 'Complex Clauses & Thought Groups',
    categoryVi: 'Cụm Tư Duy Band 8.5',
    topicEn: 'Economy & Healthcare',
    topicVi: 'Kinh tế & Y tế',
    meaningEn: 'A Band 8.5 concessive sentence combining high-level lexis ("grapple with", "inadequate infrastructure").',
    meaningVi: 'Câu nhượng bộ Band 8.5 kết hợp từ vựng đắt giá ("grapple with", "inadequate infrastructure").',
    trapEn: 'Mispronouncing "rural" (/ˈrʊə.rəl/) or stressing "in-ad-e-QUATE" instead of "in-AD-e-quate".',
    trapVi: 'Đọc vấp từ "rural" hoặc nhấn sai trọng âm của "inadequate" (phải nhấn ở -AD-).',
    mouthTipEn: 'Rise on "exPANsion ↗", articulate /ˈrʊə.rəl/ smoothly, and stress in-AD-e-quate.',
    mouthTipVi: 'Lên giọng ở "exPANsion ↗", đọc mượt /ˈrʊə.rəl/ và nhấn mạnh -AD- trong in-AD-e-quate.',
    xpReward: 45
  },
  {
    id: 'pron-s-13',
    type: 'sentences',
    targetText: 'I would argue that hands-on workshops spark far more curiosity than passive textbook memorization.',
    intonationText: 'I would ˈargue that ˈhands-on ˈworkshops ↗ / ˈspark ˈfar more curiˈosity ↘ / than ˈpassive ˈtextbook memoriˈzation. ↘',
    ipaUk: '/aɪ wʊd ˈɑː.ɡjuː ðət ˈhændz.ɒn ˈwɜːk.ʃɒps / ˈspɑːk fɑː mɔː ˌkjʊə.riˈɒs.ə.ti / ðən ˈpæs.ɪv ˈtekst.bʊk ˌmem.ə.raɪˈzeɪ.ʃən/',
    ipaUs: '/aɪ wʊd ˈɑːr.ɡjuː ðət ˈhændz.ɑːn ˈwɝːk.ʃɑːps / ˈspɑːrk fɑːr mɔːr ˌkjʊr.iˈɑː.sə.t̬i / ðən ˈpæs.ɪv ˈtekst.bʊk ˌmem.ɚ.əˈzeɪ.ʃən/',
    bandLevel: '7.5',
    requiresAuth: true,
    categoryEn: 'Part 3 Policy Argument',
    categoryVi: 'Lập Luận Giáo Dục Part 3',
    topicEn: 'Education & Learning',
    topicVi: 'Giáo dục & Phương pháp học',
    meaningEn: 'A persuasive comparative sentence contrasting experiential learning with rote memorization.',
    meaningVi: 'Câu so sánh thuyết phục đối chiếu học thực hành với học vẹt thụ động.',
    trapEn: 'Dropping the /z/ in "hands-on" or stressing "curi-O-si-ty" on the wrong syllable.',
    trapVi: 'Quên âm /z/ nối ở "hands-on" hoặc nhấn sai trọng âm của "curiosity" (nhấn -OS-).',
    mouthTipEn: 'Link "hands-on" (/ˈhænd.zɒn/) and punch -OS- in curi-OS-i-ty and -ZA- in memori-ZA-tion.',
    mouthTipVi: 'Nối âm "hands-on" và nhấn rõ -OS- trong curi-OS-i-ty, -ZA- trong memori-ZA-tion.',
    xpReward: 35
  },
  {
    id: 'pron-s-14',
    type: 'sentences',
    targetText: 'Looking back, that volunteer expedition taught me empathy and resilience that no classroom could ever offer.',
    intonationText: 'ˈLooking ˈback, ↗ / that volunˈteer expeˈdition ↗ / ˈtaught me ˈempathy and reˈsilience ↘ / that ˈno ˈclassroom could ˈever ˈoffer. ↘',
    ipaUk: '/ˈlʊk.ɪŋ bæk / ðət ˌvɒl.ənˈtɪər ˌek.spəˈdɪʃ.ən / ˈtɔːt mi ˈem.pə.θi ənd rɪˈzɪl.i.əns / ðət nəʊ ˈklɑːs.rʊm kʊd ˈev.ər ˈɒf.ər/',
    ipaUs: '/ˈlʊk.ɪŋ bæk / ðət ˌvɑː.lənˈtɪr ˌek.spəˈdɪʃ.ən / ˈtɑːt mi ˈem.pə.θi ənd rɪˈzɪl.jəns / ðət noʊ ˈklæs.rʊm kʊd ˈev.ɚ ˈɑː.fɚ/',
    bandLevel: '8.0',
    requiresAuth: true,
    categoryEn: 'Part 2 Storytelling Intonation',
    categoryVi: 'Ngữ Điệu Kể Chuyện Part 2',
    topicEn: 'Personal Growth (Part 2)',
    topicVi: 'Trải nghiệm trưởng thành (Part 2)',
    meaningEn: 'A heartfelt, high-scoring concluding reflection for IELTS Speaking Part 2 personal stories.',
    meaningVi: 'Câu kết bài Part 2 giàu cảm xúc và chiều sâu từ vựng ("empathy", "resilience").',
    trapEn: 'Stressing "VOL-un-teer" instead of "vol-un-TEER" or rushing past "taught me".',
    trapVi: 'Nhấn nhầm trọng âm đầu của "volunteer" (phải nhấn âm cuối -TEER).',
    mouthTipEn: 'Pause cleanly after "Looking back, ↗", stress -TEER in volunteer and -SIL- in resilience.',
    mouthTipVi: 'Ngắt nhịp sau "Looking back, ↗", nhấn -TEER trong volunteer và -SIL- trong resilience.',
    xpReward: 40
  },
  {
    id: 'pron-s-15',
    type: 'sentences',
    targetText: 'Unless strict regulations are enforced, irresponsible tourism could irreversibly damage fragile ecosystems.',
    intonationText: 'Unˈless ˈstrict reguˈlations are‿enˈforced, ↗ // ˌirreˈsponsible ˈtourism ↗ / could ˌirreˈversibly ˈdamage ˈfragile ˈecosystems. ↘',
    ipaUk: '/ənˈles ˈstrɪkt ˌreɡ.jəˈleɪ.ʃənz ɑːr‿ɪnˈfɔːst / ˌɪr.ɪˈspɒn.sə.bəl ˈtʊə.rɪ.zəm / kʊd ˌɪr.ɪˈvɜː.sə.bli ˈdæm.ɪdʒ ˈfrædʒ.aɪl ˈiː.kəʊˌsɪs.təmz/',
    ipaUs: '/ənˈles ˈstrɪkt ˌreɡ.jəˈleɪ.ʃənz ɑːr‿ɪnˈfɔːrst / ˌɪr.ɪˈspɑːn.sə.bəl ˈtʊr.ɪ.zəm / kʊd ˌɪr.ɪˈvɝː.sə.bli ˈdæm.ɪdʒ ˈfrædʒ.əl ˈiː.koʊˌsɪs.təmz/',
    bandLevel: '8.5',
    requiresAuth: true,
    categoryEn: 'Complex Clauses & Thought Groups',
    categoryVi: 'Cụm Tư Duy Band 8.5',
    topicEn: 'Tourism & Ecology',
    topicVi: 'Du lịch & Hệ sinh thái',
    meaningEn: 'A conditional warning sentence showcasing advanced adverbial control ("irreversibly damage").',
    meaningVi: 'Câu điều kiện cảnh báo sử dụng trạng từ học thuật Band 8.5 ("irreversibly damage").',
    trapEn: 'Stumbling over the double-r /r/ in "irresponsible" and "irreversibly", or dropping /s/ in "ecosystems".',
    trapVi: 'Đọc vấp hai từ dài "irresponsible" và "irreversibly", hoặc quên âm /s/ cuối từ "ecosystems".',
    mouthTipEn: 'Stress -SPON- in irresponsible, -VER- in irreversibly, and finish clearly on /z/ in ecosystems.',
    mouthTipVi: 'Nhấn -SPON- trong irresponsible, -VER- trong irreversibly và bật /z/ cuối từ ecosystems.',
    xpReward: 45
  },
  {
    id: 'pron-s-16',
    type: 'sentences',
    targetText: 'Admittedly, artificial intelligence streamlines routine tasks, yet human empathy remains irreplaceable.',
    intonationText: 'Adˈmittedly, ↗ / ˌartiˈficial inˈtelligence ˈstreamlines rouˈtine ˈtasks, ↗ // yet ˈhuman ˈempathy ↘ / reˈmains ˌirreˈplaceable. ↘',
    ipaUk: '/ədˈmɪt.ɪd.li / ˌɑː.tɪˈfɪʃ.əl ɪnˈtel.ɪ.dʒəns ˈstriːm.laɪnz ruːˈtiːn tɑːsks / jet ˈhjuː.mən ˈem.pə.θi rɪˈmeɪnz ˌɪr.ɪˈpleɪ.sə.bəl/',
    ipaUs: '/ədˈmɪt̬.ɪd.li / ˌɑːr.t̬əˈfɪʃ.əl ɪnˈtel.ə.dʒəns ˈstriːm.laɪnz ruːˈtiːn tæsks / jet ˈhjuː.mən ˈem.pə.θi rɪˈmeɪnz ˌɪr.ɪˈpleɪ.sə.bəl/',
    bandLevel: '8.0',
    requiresAuth: true,
    categoryEn: 'Part 3 Contrast & Hedging',
    categoryVi: 'Ngữ Điệu Tương Phản Part 3',
    topicEn: 'AI & Future of Work',
    topicVi: 'Trí tuệ nhân tạo & Việc làm',
    meaningEn: 'A balanced Band 8.0 concession-and-contrast structure for technology & employment topics.',
    meaningVi: 'Câu nhượng bộ tương phản Band 8.0 cực kỳ đắt giá cho chủ đề AI & việc làm.',
    trapEn: 'Stressing "ROU-tine" on the first syllable instead of "rou-TINE", or dropping /-sks/ in "tasks".',
    trapVi: 'Nhấn nhầm trọng âm đầu của "routine" (phải nhấn rou-TINE) hoặc nuốt cụm /-sks/ ở cuối "tasks".',
    mouthTipEn: 'Keep pitch up on "tasks ↗", pause briefly, then fall firmly on "ir-re-PLACE-a-ble ↘".',
    mouthTipVi: 'Giữ giọng hướng lên ở "tasks ↗", nghỉ nhẹ rồi hạ giọng chắc chắn ở "ir-re-PLACE-a-ble ↘".',
    xpReward: 40
  }
];

export const ALL_PRONUNCIATION_DRILLS = [
  ...PRONUNCIATION_WORD_DRILLS,
  ...PRONUNCIATION_PHRASE_DRILLS,
  ...PRONUNCIATION_SENTENCE_DRILLS
];

/**
 * Helper to clean word for comparison (strips punctuation, smart quotes, intonation markers).
 */
export function normalizePhoneticWord(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .replace(/[↗↘/\\‿•●○◐ˈˌ"“”‘’'.,!?;:()[\]-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const ONES_WORDS = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
];
const TENS_WORDS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const ORDINAL_EXCEPTIONS = {
  1: 'first', 2: 'second', 3: 'third', 4: 'fourth', 5: 'fifth', 6: 'sixth', 7: 'seventh', 8: 'eighth', 9: 'ninth',
  10: 'tenth', 11: 'eleventh', 12: 'twelfth', 13: 'thirteenth', 14: 'fourteenth', 15: 'fifteenth',
  16: 'sixteenth', 17: 'seventeenth', 18: 'eighteenth', 19: 'nineteenth',
  20: 'twentieth', 30: 'thirtieth', 40: 'fortieth', 50: 'fiftieth', 60: 'sixtieth', 70: 'seventieth', 80: 'eightieth', 90: 'ninetieth'
};

export function numberToEnglishWords(rawNum, { yearStyle = false } = {}) {
  const n = Number(rawNum);
  if (!Number.isFinite(n) || n < 0 || n > 9999) return String(rawNum);
  const intVal = Math.floor(n);

  if (intVal < 20) return ONES_WORDS[intVal];
  if (intVal < 100) {
    const tens = Math.floor(intVal / 10);
    const rem = intVal % 10;
    return rem === 0 ? TENS_WORDS[tens] : `${TENS_WORDS[tens]} ${ONES_WORDS[rem]}`;
  }

  // Natural spoken year formatting (e.g. 1995 -> nineteen ninety five, 2024 -> twenty twenty four)
  if (yearStyle && intVal >= 1900 && intVal <= 2099) {
    if (intVal === 2000) return 'two thousand';
    if (intVal > 2000 && intVal < 2010) return `two thousand ${ONES_WORDS[intVal % 10]}`;
    const hi = Math.floor(intVal / 100);
    const lo = intVal % 100;
    const hiWords = numberToEnglishWords(hi);
    if (lo === 0) return `${hiWords} hundred`;
    if (lo < 10) return `${hiWords} oh ${ONES_WORDS[lo]}`;
    return `${hiWords} ${numberToEnglishWords(lo)}`;
  }

  if (intVal < 1000) {
    const hundreds = Math.floor(intVal / 100);
    const rem = intVal % 100;
    return rem === 0
      ? `${ONES_WORDS[hundreds]} hundred`
      : `${ONES_WORDS[hundreds]} hundred ${numberToEnglishWords(rem)}`;
  }

  const thousands = Math.floor(intVal / 1000);
  const rem = intVal % 1000;
  return rem === 0
    ? `${ONES_WORDS[thousands]} thousand`
    : `${ONES_WORDS[thousands]} thousand ${numberToEnglishWords(rem)}`;
}

function ordinalToEnglishWords(rawNum) {
  const n = Math.floor(Number(rawNum));
  if (!Number.isFinite(n) || n <= 0 || n > 99) return String(rawNum);
  if (ORDINAL_EXCEPTIONS[n]) return ORDINAL_EXCEPTIONS[n];
  if (n > 20 && n < 100) {
    const tens = Math.floor(n / 10) * 10;
    const rem = n % 10;
    return rem === 0
      ? ORDINAL_EXCEPTIONS[tens]
      : `${TENS_WORDS[tens / 10]} ${ORDINAL_EXCEPTIONS[rem]}`;
  }
  return `${numberToEnglishWords(n)}th`;
}

function decimalOrIntToWords(numStr, { yearStyle = false } = {}) {
  const s = String(numStr || '').trim();
  if (s.includes('.')) {
    const [whole, frac] = s.split('.');
    const wholeWords = numberToEnglishWords(Number(whole || 0));
    const fracWords = frac
      .split('')
      .map(d => ONES_WORDS[Number(d)] ?? d)
      .join(' ');
    return `${wholeWords} point ${fracWords}`.trim();
  }
  return numberToEnglishWords(Number(s), { yearStyle });
}

const UK_TO_US_SPELLING_MAP = {
  labour: 'labor',
  humour: 'humor',
  honour: 'honor',
  favour: 'favor',
  favourite: 'favorite',
  colour: 'color',
  colourful: 'colorful',
  behaviour: 'behavior',
  behavioural: 'behavioral',
  behaviours: 'behaviors',
  neighbour: 'neighbor',
  neighbours: 'neighbors',
  neighbourhood: 'neighborhood',
  neighbourhoods: 'neighborhoods',
  flavour: 'flavor',
  flavours: 'flavors',
  rumour: 'rumor',
  harbour: 'harbor',
  centre: 'center',
  centres: 'centers',
  theatre: 'theater',
  theatres: 'theaters',
  metre: 'meter',
  metres: 'meters',
  kilometre: 'kilometer',
  kilometres: 'kilometers',
  litre: 'liter',
  litres: 'liters',
  programme: 'program',
  programmes: 'programs',
  dialogue: 'dialog',
  catalogue: 'catalog',
  grey: 'gray',
  defence: 'defense',
  offence: 'offense',
  licence: 'license',
  practise: 'practice',
  practised: 'practiced',
  practising: 'practicing',
  travelling: 'traveling',
  travelled: 'traveled',
  traveller: 'traveler',
  cancelled: 'canceled',
  cancelling: 'canceling',
  modelling: 'modeling',
  modelled: 'modeled',
  fulfil: 'fulfill',
  fulfilling: 'fulfilling',
  enrol: 'enroll',
  analyse: 'analyze',
  analysed: 'analyzed',
  analysing: 'analyzing',
  recognise: 'recognize',
  recognised: 'recognized',
  organise: 'organize',
  organised: 'organized',
  organising: 'organizing',
  organisation: 'organization',
  organisations: 'organizations',
  realise: 'realize',
  realised: 'realized',
  realising: 'realizing',
  prioritise: 'prioritize',
  prioritised: 'prioritized',
  modernise: 'modernize',
  modernised: 'modernized',
  modernising: 'modernizing',
  urbanisation: 'urbanization',
  globalisation: 'globalization',
  digitalisation: 'digitalization',
  specialise: 'specialize',
  specialised: 'specialized',
  specialising: 'specializing',
  emphasise: 'emphasize',
  emphasised: 'emphasized',
  minimise: 'minimize',
  minimised: 'minimized',
  maximise: 'maximize',
  maximised: 'maximized',
  criticise: 'criticize',
  criticised: 'criticized',
  summarise: 'summarize',
  summarised: 'summarized',
  apologise: 'apologize',
  apologised: 'apologized',
  utilise: 'utilize',
  utilised: 'utilized',
  visualise: 'visualize',
  customise: 'customize',
  stabilise: 'stabilize',
  jewellery: 'jewelry',
  cheque: 'check',
  tyre: 'tire',
  pyjamas: 'pajamas',
  cosy: 'cozy',
  skilful: 'skillful',
  wilful: 'willful'
};

export function normalizeUkUsSpelling(word) {
  const clean = String(word || '').toLowerCase();
  if (!clean) return '';
  if (UK_TO_US_SPELLING_MAP[clean]) return UK_TO_US_SPELLING_MAP[clean];
  return clean.replace(/isation(s?)$/, 'ization$1');
}

const CONVERSATION_CONTRACTIONS_MAP = {
  "i'm": 'i am', "you're": 'you are', "we're": 'we are', "they're": 'they are',
  "he's": 'he is', "she's": 'she is', "it's": 'it is', "that's": 'that is',
  "there's": 'there is', "here's": 'here is', "what's": 'what is', "who's": 'who is',
  "how's": 'how is', "where's": 'where is', "when's": 'when is', "why's": 'why is',
  "don't": 'do not', "doesn't": 'does not', "didn't": 'did not',
  "can't": 'can not', "cannot": 'can not', "couldn't": 'could not', "won't": 'will not',
  "wouldn't": 'would not', "shouldn't": 'should not', "isn't": 'is not',
  "aren't": 'are not', "wasn't": 'was not', "weren't": 'were not',
  "haven't": 'have not', "hasn't": 'has not', "hadn't": 'had not',
  "i've": 'i have', "you've": 'you have', "we've": 'we have', "they've": 'they have',
  "would've": 'would have', "could've": 'could have', "should've": 'should have',
  "might've": 'might have', "must've": 'must have',
  "i'll": 'i will', "you'll": 'you will', "we'll": 'we will', "they'll": 'they will',
  "that'll": 'that will', "there'll": 'there will', "it'll": 'it will',
  "i'd": 'i would', "you'd": 'you would', "we'd": 'we would', "let's": 'let us',
  "gonna": 'going to', "wanna": 'want to',
  "ok": 'okay', "o.k.": 'okay', "mr": 'mister', "mrs": 'missus', "dr": 'doctor'
};

/**
 * Expands conversational contractions, numbers (cardinals, years, ordinals, decimals, %),
 * times (11:00 -> eleven), currencies ($5 -> five dollars), and normalizes UK/US spellings.
 */
export function expandConversationalTokens(text) {
  if (!text || typeof text !== 'string') return [];
  let s = text.toLowerCase().replace(/[’‘]/g, "'");

  // Time expressions like 11:00 or 1:45 (handle before decimal/integer expansion)
  s = s.replace(/\b(\d{1,2}):00\b/g, (_, h) => `${numberToEnglishWords(h)}`);
  s = s.replace(/\b(\d{1,2}):(\d{2})\b/g, (_, h, m) => {
    const mins = Number(m);
    const mWords = mins === 0 ? '' : mins < 10 ? `oh ${numberToEnglishWords(mins)}` : numberToEnglishWords(mins);
    return `${numberToEnglishWords(h)} ${mWords}`.trim();
  });

  // Percentages (e.g. 75%, 7.5%)
  s = s.replace(/\b(\d+(?:\.\d+)?)\s*%/g, (_, num) => `${decimalOrIntToWords(num)} percent`);

  // Currencies before plain numbers (use cardinal non-year wording)
  s = s.replace(/\$(\d+(?:\.\d+)?)/g, (_, num) => `${decimalOrIntToWords(num)} dollars`);
  s = s.replace(/£(\d+(?:\.\d+)?)/g, (_, num) => `${decimalOrIntToWords(num)} pounds`);
  s = s.replace(/€(\d+(?:\.\d+)?)/g, (_, num) => `${decimalOrIntToWords(num)} euros`);

  // Decimals (e.g. 7.5 -> seven point five) before punctuation cleanup strips periods
  s = s.replace(/\b(\d+)\.(\d+)\b/g, (_, w, f) => decimalOrIntToWords(`${w}.${f}`));

  // Ordinals (e.g. 1st, 2nd, 21st)
  s = s.replace(/\b(\d{1,2})(?:st|nd|rd|th)\b/g, (_, num) => ordinalToEnglishWords(num));

  const rawTokens = s
    .replace(/[↗↘/\\‿•●○◐ˈˌ"“”,!?;:()[\]-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);

  const expanded = [];
  for (const tok of rawTokens) {
    const cleanDot = tok.replace(/\.+$/g, '');
    if (CONVERSATION_CONTRACTIONS_MAP[cleanDot]) {
      expanded.push(...CONVERSATION_CONTRACTIONS_MAP[cleanDot].split(' '));
      continue;
    }
    const stripped = normalizePhoneticWord(tok);
    if (!stripped) continue;
    for (const part of stripped.split(' ')) {
      if (/^\d{1,4}$/.test(part)) {
        expanded.push(...numberToEnglishWords(Number(part), { yearStyle: true }).split(' '));
      } else {
        expanded.push(normalizeUkUsSpelling(part));
      }
    }
  }
  return expanded;
}

/**
 * Computes normalized character similarity (0 to 1) using Levenshtein distance.
 */
export function computeWordSimilarity(a, b) {
  const s1 = normalizePhoneticWord(a);
  const s2 = normalizePhoneticWord(b);
  if (!s1 && !s2) return 1;
  if (!s1 || !s2) return 0;
  if (s1 === s2) return 1;

  // Common phonetic/contraction equivalents
  const equivalents = {
    "i've": 'i have',
    "i'm": 'i am',
    "it's": 'it is',
    "don't": 'do not',
    "can't": 'cannot',
    "won't": 'will not',
    'colour': 'color',
    'urbanisation': 'urbanization',
    'modernising': 'modernizing',
    'organisation': 'organization'
  };
  if (equivalents[s1] === s2 || equivalents[s2] === s1) return 1;

  const m = s1.length;
  const n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  const maxLen = Math.max(m, n);
  return Math.max(0, (maxLen - dp[m][n]) / maxLen);
}

/**
 * Converts an English word into a rich Grapheme-to-Phoneme (G2P) phonetic skeleton.
 * Handles silent letters (kn, wr, ps, wh, gn, mb, bt, silent gh), soft c/g,
 * morphological endings (-ed -> /Id/, /t/, /d/; -s/-es -> /Iz/, /s/, /z/),
 * digraphs (ph, qu, sh, ch, th, ng, ck, tion/sion/tious), and vowel-pair normalization.
 */
export function toPhoneticSkeleton(word) {
  const clean = normalizePhoneticWord(word);
  if (!clean) return '';

  let s = clean
    // Silent initial & final clusters
    .replace(/^kn/, 'n')
    .replace(/^wr/, 'r')
    .replace(/^ps/, 's')
    .replace(/^wh/, 'w')
    .replace(/^gn/, 'n')
    .replace(/gn$/, 'n')
    .replace(/bt$/, 't')
    .replace(/mb$/, 'm')
    // Special -gh words (/f/) vs silent gh
    .replace(/(en|r|t)ough$/, '$1uf')
    .replace(/laugh/, 'laf')
    .replace(/cough/, 'kof')
    .replace(/([aeiou])gh/g, '$1')
    // Common academic suffixes
    .replace(/tion$|sion$/g, 'Sn')
    .replace(/tious$|cious$/g, 'Ss')
    .replace(/ture$/g, 'Cr')
    .replace(/dge/g, 'J')
    // Digraphs & consonant clusters
    .replace(/ph/g, 'f')
    .replace(/qu/g, 'kw')
    .replace(/sh/g, 'S')
    .replace(/ch/g, 'C')
    .replace(/th/g, 'T')
    .replace(/ng/g, 'N')
    .replace(/ck/g, 'k')
    .replace(/x/g, 'ks')
    // Soft vs hard c and g
    .replace(/c(?=[eiy])/g, 's')
    .replace(/c/g, 'k')
    .replace(/g(?=[eiy])/g, 'J')
    // Vowel-pair normalization
    .replace(/ee|ea/g, 'i')
    .replace(/oo/g, 'u');

  // Morphological -ed ending phonology (/Id/ after t/d, /t/ after voiceless, /d/ after voiced)
  if (s.length >= 4 && s.endsWith('ed')) {
    const stem = s.slice(0, -2);
    const last = stem.slice(-1);
    if (last === 't' || last === 'd') s = stem + 'Id';
    else if (/[pkfsSC]/.test(last)) s = stem + 't';
    else s = stem + 'd';
  }

  // Morphological -es / -s ending phonology (/Iz/ after sibilants, /s/ after voiceless, /z/ after voiced)
  if (s.length >= 4 && s.endsWith('es') && /[szSCJ]$/.test(s.slice(0, -2))) {
    s = s.slice(0, -2) + 'Iz';
  } else if (s.length >= 4 && s.endsWith('s') && !s.endsWith('ss') && !s.endsWith('Ss')) {
    const stem = s.slice(0, -1);
    const last = stem.slice(-1);
    if (/[pkftT]/.test(last)) s = stem + 's';
    else if (!/[szSCJ]/.test(last)) s = stem + 'z';
  }

  // Collapse consecutive duplicate characters
  return s.replace(/([a-zA-Z])\1+/g, '$1');
}

/**
 * Evaluates Onset (25%), Nucleus (35%), and Coda/Ending (40%) phonetic alignment.
 * Detects dropped final consonants (common ESL/Vietnamese issue with /s/, /z/, /t/, /d/, /l/, /k/).
 */
export function computePhoneticOnsetNucleusCoda(targetWord, spokenWord) {
  const tRaw = normalizePhoneticWord(targetWord);
  const sRaw = normalizePhoneticWord(spokenWord);
  if (!tRaw || !sRaw) return { score: 0, missingCoda: false };
  if (tRaw === sRaw) return { score: 1, missingCoda: false };

  const lexSim = computeWordSimilarity(tRaw, sRaw);
  const tSkel = toPhoneticSkeleton(tRaw);
  const sSkel = toPhoneticSkeleton(sRaw);
  const skelSim = computeWordSimilarity(tSkel, sSkel);

  // Check ending coda (last 2 phonetic chars)
  const tCoda = tSkel.slice(-2);
  const sCoda = sSkel.slice(-2);
  const codaSim = computeWordSimilarity(tCoda, sCoda);
  const missingCoda = tSkel.length >= 4 && codaSim < 0.5 && computeWordSimilarity(tSkel.slice(0, -2), sSkel.slice(0, Math.max(2, tSkel.length - 2))) >= 0.75;

  const blended = Math.max(lexSim, skelSim * 0.96) * 0.72 + codaSim * 0.28;
  return {
    score: Math.max(0, Math.min(1, blended)),
    missingCoda
  };
}

/**
 * Monotonic Needleman-Wunsch phonetic sequence aligner.
 * Prevents repeated words from being stolen across skipped sentences, handles natural
 * STT compound splits/merges (e.g. "e-books" <-> "ebooks"), and zeroes unmatched noise.
 */
export function alignPhoneticTokens(targetTokens = [], spokenTokens = []) {
  const m = targetTokens.length;
  const n = spokenTokens.length;
  const result = Array.from({ length: m }, () => ({
    score: 0,
    spokenMatch: '',
    missingCoda: false
  }));
  if (m === 0 || n === 0) return result;

  const DEL_PENALTY = -0.15;
  const INS_PENALTY = -0.05;

  const dp = Array.from({ length: m + 1 }, () => new Float64Array(n + 1));
  const move = Array.from({ length: m + 1 }, () => new Uint8Array(n + 1));
  // 1 = 1-to-1 match, 2 = delete target, 3 = insert spoken, 4 = 2-to-1 merge, 5 = 1-to-2 split
  const cellEval = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(null));

  for (let i = 1; i <= m; i++) {
    dp[i][0] = i * DEL_PENALTY;
    move[i][0] = 2;
  }
  for (let j = 1; j <= n; j++) {
    dp[0][j] = j * INS_PENALTY;
    move[0][j] = 3;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      let bestScore = dp[i - 1][j] + DEL_PENALTY;
      let bestMove = 2;
      let bestEval = null;

      const insScore = dp[i][j - 1] + INS_PENALTY;
      if (insScore > bestScore) {
        bestScore = insScore;
        bestMove = 3;
      }

      const phon = computePhoneticOnsetNucleusCoda(targetTokens[i - 1], spokenTokens[j - 1]);
      const matchStep = phon.score >= 0.45 ? phon.score : -0.45;
      const diagScore = dp[i - 1][j - 1] + matchStep;
      if (diagScore > bestScore) {
        bestScore = diagScore;
        bestMove = 1;
        bestEval = phon;
      }

      // 2-to-1 compound merge (e.g. "e" + "books" <-> "ebooks")
      if (i >= 2 && targetTokens[i - 2].length + targetTokens[i - 1].length <= 18) {
        const mergedTarget = targetTokens[i - 2] + targetTokens[i - 1];
        const mergePhon = computePhoneticOnsetNucleusCoda(mergedTarget, spokenTokens[j - 1]);
        if (mergePhon.score >= 0.85) {
          const mergeScore = dp[i - 2][j - 1] + mergePhon.score * 2 - 0.02;
          if (mergeScore > bestScore) {
            bestScore = mergeScore;
            bestMove = 4;
            bestEval = mergePhon;
          }
        }
      }

      // 1-to-2 compound split (e.g. "ebooks" <-> "e" + "books")
      if (j >= 2 && spokenTokens[j - 2].length + spokenTokens[j - 1].length <= 18) {
        const mergedSpoken = spokenTokens[j - 2] + spokenTokens[j - 1];
        const splitPhon = computePhoneticOnsetNucleusCoda(targetTokens[i - 1], mergedSpoken);
        if (splitPhon.score >= 0.85) {
          const splitScore = dp[i - 1][j - 2] + splitPhon.score;
          if (splitScore > bestScore) {
            bestScore = splitScore;
            bestMove = 5;
            bestEval = splitPhon;
          }
        }
      }

      dp[i][j] = bestScore;
      move[i][j] = bestMove;
      cellEval[i][j] = bestEval;
    }
  }

  let i = m;
  let j = n;
  while (i > 0 || j > 0) {
    const mv = move[i][j];
    const ev = cellEval[i][j];
    if (mv === 1 && ev) {
      const validScore = ev.score >= 0.45 ? ev.score : 0;
      result[i - 1] = {
        score: validScore,
        spokenMatch: validScore > 0 ? spokenTokens[j - 1] : '',
        missingCoda: validScore > 0 ? ev.missingCoda : false
      };
      i -= 1;
      j -= 1;
    } else if (mv === 4 && ev) {
      result[i - 1] = { score: ev.score, spokenMatch: spokenTokens[j - 1], missingCoda: ev.missingCoda };
      result[i - 2] = { score: ev.score, spokenMatch: spokenTokens[j - 1], missingCoda: false };
      i -= 2;
      j -= 1;
    } else if (mv === 5 && ev) {
      result[i - 1] = {
        score: ev.score,
        spokenMatch: `${spokenTokens[j - 2]} ${spokenTokens[j - 1]}`,
        missingCoda: ev.missingCoda
      };
      i -= 1;
      j -= 2;
    } else if (mv === 2) {
      i -= 1;
    } else {
      j -= 1;
    }
  }

  return result;
}

/**
 * Evaluates a user's spoken pronunciation attempt against the target drill item.
 * Layer 1 Engine: Combines Lexical Similarity + Phonetic Skeleton (Onset/Nucleus/Coda)
 * + Monotonic Needleman-Wunsch Alignment + N-Best Hypotheses + Web Audio Energy Metrics.
 */
export function evaluatePronunciationAttempt({
  targetText = '',
  spokenText = '',
  confidence = 0.88,
  itemType = 'words',
  streak = 0,
  alternatives = [],
  acousticMetrics = null
}) {
  const rawTargetWords = String(targetText || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const spokenWords = expandConversationalTokens(spokenText);

  if (rawTargetWords.length === 0) {
    return {
      overallAccuracy: 0,
      estimatedBand: '5.0',
      wordBreakdown: [],
      xpEarned: 0,
      streakBonusXp: 0,
      codaIssues: [],
      engineTier: 'layer1_phonetic',
      coachFeedbackEn: 'No target text provided.',
      coachFeedbackVi: 'Chưa có nội dung mục tiêu.'
    };
  }

  const codaIssues = [];
  const flatTargets = [];

  const wordMeta = rawTargetWords.map((rawWord) => {
    const cleanTarget = normalizeUkUsSpelling(normalizePhoneticWord(rawWord));
    const subTargets = expandConversationalTokens(rawWord);
    const targetsToMatch = subTargets.length > 0 ? subTargets : (cleanTarget ? [cleanTarget] : []);
    const start = flatTargets.length;
    targetsToMatch.forEach(t => flatTargets.push(t));
    return {
      rawWord,
      cleanTarget,
      targetsToMatch,
      start,
      end: flatTargets.length
    };
  });

  const expandedTargetCount = flatTargets.length;
  const alignedTokens = alignPhoneticTokens(flatTargets, spokenWords);

  // Flatten N-best alternative words for weak-ending detection
  const altWordSet = new Set();
  if (Array.isArray(alternatives) && alternatives.length > 1) {
    alternatives.slice(1, 5).forEach(alt => {
      expandConversationalTokens(alt).forEach(w => altWordSet.add(w));
    });
  }

  const wordBreakdown = wordMeta.map(({ rawWord, cleanTarget, targetsToMatch, start, end }) => {
    if (targetsToMatch.length === 0) {
      return {
        word: rawWord,
        cleanWord: '',
        status: 'correct',
        similarity: 100,
        spokenMatch: rawWord,
        missingCoda: false
      };
    }

    const tokenMatches = alignedTokens.slice(start, end);
    const totalSubSim = tokenMatches.reduce((sum, tm) => sum + (tm?.score || 0), 0);
    let bestMissingCoda = tokenMatches.some(tm => tm?.missingCoda);
    const matchedParts = tokenMatches.map(tm => tm?.spokenMatch).filter(Boolean);
    let bestSim = totalSubSim / targetsToMatch.length;

    // N-Best Acoustic Cross-Check:
    // If primary hypothesis matched exact target, check if secondary hypotheses dropped the plural/past/coda ending
    let nBestWeakEnding = false;
    if (bestSim >= 0.95 && cleanTarget.length >= 5 && altWordSet.size > 0) {
      const strippedTarget = cleanTarget.replace(/(s|es|ed|d|t|ly)$/, '');
      if (strippedTarget !== cleanTarget && altWordSet.has(strippedTarget)) {
        nBestWeakEnding = true;
        bestSim = Math.min(bestSim, 0.86);
      }
    }

    if (bestMissingCoda || nBestWeakEnding) {
      codaIssues.push(cleanTarget);
    }

    let status = 'missed';
    if (bestSim >= 0.84) {
      status = 'correct';
    } else if (bestSim >= 0.52) {
      status = 'near';
    }

    return {
      word: rawWord,
      cleanWord: cleanTarget,
      status,
      similarity: Math.round(bestSim * 100),
      spokenMatch: matchedParts.join(' '),
      missingCoda: bestMissingCoda || nBestWeakEnding
    };
  });

  // Compute weighted accuracy
  const avgWordSimilarity =
    wordBreakdown.reduce((sum, w) => sum + w.similarity, 0) / wordBreakdown.length;

  // Non-inflating acoustic confidence blend (never boosts zero/wrong words above phonetic evidence)
  const safeConfidence = Math.max(0.6, Math.min(1.0, Number(confidence) || 0.88));
  let rawScore = spokenWords.length === 0
    ? 0
    : Math.round(avgWordSimilarity * 0.88 + Math.min(avgWordSimilarity, safeConfidence * 100) * 0.12);

  // Strict single-word gate: if a single word is mispronounced (< 95% match, e.g. phenomena vs phenomenon),
  // prevent high STT confidence from inflating it past the passing threshold.
  if (spokenWords.length > 0 && rawTargetWords.length === 1 && avgWordSimilarity < 95) {
    rawScore = Math.min(76, Math.round(avgWordSimilarity * 0.9));
  }

  // Fair length-proportional slack for natural hesitations/self-corrections on long utterances
  const effectiveTargetLen = Math.max(rawTargetWords.length, expandedTargetCount);
  const allowedSlack = rawTargetWords.length === 1 ? 0 : Math.max(1, Math.floor(effectiveTargetLen * 0.1));
  const extraWordsCount = Math.max(0, spokenWords.length - effectiveTargetLen - allowedSlack);
  const perExtraPenalty = rawTargetWords.length === 1 ? 8 : effectiveTargetLen >= 15 ? 3 : 6;
  if (extraWordsCount > 0 && rawScore > 0) {
    rawScore -= Math.min(20, extraWordsCount * perExtraPenalty);
  }

  // Acoustic Prosody, Sibilant Coda & Pacing/Fluency DSP checks (when Web Audio 512-FFT metrics available)
  let lowDynamicEnergy = false;
  let weakAcousticSibilant = false;
  let choppyPacing = false;
  let rushedPacing = false;
  let wpm = null;
  let voiceActivityRatio = null;

  if (acousticMetrics && acousticMetrics.sampleCount > 4) {
    if (acousticMetrics.dynamicRange < 6 && rawTargetWords.length >= 4 && rawScore > 75) {
      rawScore -= 4;
      lowDynamicEnergy = true;
    }

    // High-Frequency Sibilant/Plosive Coda check (3kHz-8.2kHz) when target contains ending sibilants/voiceless stops
    const targetHasEndingSibilant = /[sztxk]\b|sh\b|ch\b|ed\b|es\b/i.test(targetText);
    if (
      targetHasEndingSibilant &&
      acousticMetrics.sampleCount > 6 &&
      typeof acousticMetrics.sibilantPeak === 'number' &&
      acousticMetrics.sibilantPeak < 11 &&
      (acousticMetrics.sibilantRatio || 0) < 0.06 &&
      codaIssues.length > 0 &&
      rawScore > 82
    ) {
      rawScore -= 2;
      weakAcousticSibilant = true;
    }

    // Pacing & Fluency Continuity check for sentences/dialogues (>= 6 words)
    const speechMs = acousticMetrics.speechDurationMs || acousticMetrics.activeMs || 0;
    voiceActivityRatio = typeof acousticMetrics.voiceActivityRatio === 'number' ? acousticMetrics.voiceActivityRatio : null;
    if (rawTargetWords.length >= 6 && spokenWords.length >= 5 && speechMs >= 1500) {
      wpm = Math.round(spokenWords.length / (speechMs / 60000));
      const pauseCount = acousticMetrics.pauseCount || 0;
      if ((pauseCount >= 3 && voiceActivityRatio !== null && voiceActivityRatio < 0.48) || wpm < 65) {
        if (rawScore > 78) rawScore -= 4;
        choppyPacing = true;
      } else if (wpm > 215) {
        rushedPacing = true;
      }
    }
  }

  const overallAccuracy = Math.max(0, Math.min(100, rawScore));

  // Map accuracy to IELTS Pronunciation Criterion Band (5.0 - 9.0)
  let estimatedBand = '5.0';
  if (overallAccuracy >= 95) estimatedBand = '8.5';
  else if (overallAccuracy >= 88) estimatedBand = '8.0';
  else if (overallAccuracy >= 80) estimatedBand = '7.5';
  else if (overallAccuracy >= 72) estimatedBand = '7.0';
  else if (overallAccuracy >= 64) estimatedBand = '6.5';
  else if (overallAccuracy >= 55) estimatedBand = '6.0';
  else if (overallAccuracy >= 40) estimatedBand = '5.5';

  // Calculate XP Earned
  const trackMeta = PRONUNCIATION_TRACKS.find(t => t.id === itemType) || PRONUNCIATION_TRACKS[0];
  let baseXp = 0;
  if (overallAccuracy >= 92) {
    baseXp = trackMeta.perfectXp;
  } else if (overallAccuracy >= 75) {
    baseXp = trackMeta.baseXp;
  } else if (overallAccuracy >= 50) {
    baseXp = Math.max(8, Math.round(trackMeta.baseXp * 0.65));
  } else if (overallAccuracy > 0) {
    baseXp = 5; // Participation effort XP
  }

  const streakBonusXp = overallAccuracy >= 70 ? Math.min(15, streak * 3) : 0;
  const xpEarned = baseXp + streakBonusXp;

  // Build pedagogical coaching feedback
  const missedWords = wordBreakdown.filter(w => w.status === 'missed').map(w => w.cleanWord);
  const nearWords = wordBreakdown.filter(w => w.status === 'near').map(w => w.cleanWord);

  let coachFeedbackEn = '';
  let coachFeedbackVi = '';

  if (codaIssues.length > 0 && overallAccuracy >= 70) {
    const codaList = [...new Set(codaIssues)].slice(0, 3).join(', ');
    coachFeedbackEn = weakAcousticSibilant
      ? `Core sounds were clear, but high-frequency ending bursts (/s/, /z/, /t/, /k/) were acoustically weak on: "${codaList}".`
      : `Clear core pronunciation, but watch out for weak ending consonants (coda) on: "${codaList}".`;
    coachFeedbackVi = weakAcousticSibilant
      ? `Âm chính khá tốt, nhưng cảm biến âm thanh ghi nhận âm gió/phụ âm cuối (/s/, /z/, /t/, /k/) hơi nhẹ ở từ: "${codaList}".`
      : `Âm chính khá tốt, nhưng chú ý bật rõ phụ âm cuối (âm đuôi) ở từ: "${codaList}".`;
  } else if (choppyPacing && overallAccuracy >= 72) {
    coachFeedbackEn = `Accurate words${wpm ? ` (${wpm} WPM)` : ''}, but your delivery had noticeable pauses. Try linking clauses more smoothly without stopping between words.`;
    coachFeedbackVi = `Phát âm đúng từ${wpm ? ` (${wpm} từ/phút)` : ''}, nhưng nhịp nói còn ngắt quãng giữa chừng. Hãy luyện nối liền cụm từ mượt mà hơn.`;
  } else if (rushedPacing && overallAccuracy >= 75) {
    coachFeedbackEn = `Very fast delivery${wpm ? ` (${wpm} WPM)` : ''}! Slow down slightly so key stressed syllables and endings breathe naturally.`;
    coachFeedbackVi = `Tốc độ nói hơi nhanh${wpm ? ` (${wpm} từ/phút)` : ''}! Hãy chậm lại một chút để nhấn trọng âm và bật âm đuôi rõ ràng hơn.`;
  } else if (lowDynamicEnergy && overallAccuracy >= 75) {
    coachFeedbackEn = 'Words were accurate, but your pitch/volume stayed flat. Emphasize key stressed syllables more clearly.';
    coachFeedbackVi = 'Phát âm đúng từ, nhưng ngữ điệu hơi đều. Hãy nhấn trọng âm các từ khóa rõ ràng hơn.';
  } else if (overallAccuracy >= 90) {
    coachFeedbackEn = 'Excellent clarity and phonological control! Your stress placement and ending consonants were crisp and effortless to understand.';
    coachFeedbackVi = 'Độ rõ âm và kiểm soát ngữ âm xuất sắc! Trọng âm và phụ âm cuối của bạn được bật rất rõ ràng, chuẩn tiêu chí Pronunciation Band 8.0+.';
  } else if (overallAccuracy >= 72) {
    const focusList = [...nearWords, ...missedWords].slice(0, 3).join(', ');
    coachFeedbackEn = focusList
      ? `Good intelligibility! To reach Band 8.0+, pay closer attention to vowel length and ending consonants in: "${focusList}".`
      : 'Good rhythm and pronunciation! Try linking adjacent words more smoothly on your next attempt.';
    coachFeedbackVi = focusList
      ? `Phát âm khá rõ ràng! Để chạm ngưỡng Band 8.0+, hãy chú ý bật rõ nguyên âm và âm đuôi ở các từ: "${focusList}".`
      : 'Nhịp điệu và phát âm tốt! Hãy thử nối âm mượt hơn giữa các từ ở lượt đọc tiếp theo.';
  } else if (overallAccuracy > 0) {
    const focusList = [...missedWords, ...nearWords].slice(0, 4).join(', ');
    coachFeedbackEn = `Keep practicing! Listen to the native model at 0.75x speed first, then articulate each syllable clearly${focusList ? ` (especially: "${focusList}")` : ''}.`;
    coachFeedbackVi = `Hãy nghe lại giọng mẫu ở tốc độ chậm 0.75x trước, sau đó phát âm chậm và rõ từng âm tiết${focusList ? ` (đặc biệt là: "${focusList}")` : ''}.`;
  } else {
    coachFeedbackEn = 'No clear speech was detected. Please check your microphone and speak at a steady volume.';
    coachFeedbackVi = 'Hệ thống chưa nhận diện được giọng nói. Vui lòng kiểm tra Micro và đọc rõ với âm lượng vừa phải.';
  }

  return {
    overallAccuracy,
    estimatedBand,
    wordBreakdown,
    xpEarned,
    baseXp,
    streakBonusXp,
    codaIssues,
    acousticSummary: acousticMetrics
      ? {
          wpm,
          voiceActivityRatio,
          dynamicRange: acousticMetrics.dynamicRange ?? null,
          sibilantPeak: acousticMetrics.sibilantPeak ?? null,
          pauseCount: acousticMetrics.pauseCount ?? 0
        }
      : null,
    engineTier: 'layer1_phonetic',
    coachFeedbackEn,
    coachFeedbackVi
  };
}

/**
 * Deterministically builds a custom pronunciation exercise for any word, phrase, or sentence
 * entered by the learner (100% offline capable).
 */
export function buildCustomPronunciationDrill({
  text = '',
  type = 'auto',
  bandLevel = '7.0',
  topic = 'Custom Practice',
  meaning = ''
}) {
  const cleanText = String(text || '').trim().replace(/\s+/g, ' ');
  const words = cleanText.split(' ').filter(Boolean);

  let resolvedType = type;
  if (resolvedType === 'auto' || !['words', 'phrases', 'sentences'].includes(resolvedType)) {
    const endsWithSentencePunct = /[.!?]$/.test(cleanText);
    if (words.length <= 1) resolvedType = 'words';
    else if (words.length >= 6 || (endsWithSentencePunct && words.length >= 4)) resolvedType = 'sentences';
    else resolvedType = 'phrases';
  }

  // Generate helpful visual pronunciation cues
  let syllables = cleanText;
  let connectedText = cleanText;
  let intonationText = cleanText;

  if (resolvedType === 'words') {
    // Simple syllable chunker heuristic for single words
    const parts = cleanText.match(/[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi) || [cleanText];
    syllables = parts.join(' • ');
  } else if (resolvedType === 'phrases') {
    // Mark consonant-to-vowel links with ‿
    connectedText = words.reduce((acc, word, idx) => {
      if (idx === 0) return word;
      const prev = words[idx - 1];
      const endsWithConsonant = /[bcdfghjklmnpqrstvwxz]$/i.test(prev.replace(/[^a-z]/gi, ''));
      const startsWithVowel = /^[aeiou]/i.test(word.replace(/[^a-z]/gi, ''));
      return acc + (endsWithConsonant && startsWithVowel ? '‿' : ' ') + word;
    }, '');
  } else {
    // Add natural thought-group pauses (/) after commas or conjunctions and falling intonation at end
    intonationText = cleanText
      .replace(/,\s+/g, ', ↗ / ')
      .replace(/\s+(because|although|while|whereas|which|that|and|but)\s+/gi, ' / $1 ')
      .replace(/([.!?])?$/, ' ↘');
  }

  const trackMeta = PRONUNCIATION_TRACKS.find(t => t.id === resolvedType) || PRONUNCIATION_TRACKS[0];

  return {
    id: `pron-custom-${Date.now()}`,
    type: resolvedType,
    targetText: cleanText,
    syllables,
    connectedText,
    intonationText,
    ipaUk: resolvedType === 'words' ? `/${cleanText.toLowerCase()}/` : 'Native Rhythm & Linking',
    ipaUs: resolvedType === 'words' ? `/${cleanText.toLowerCase()}/` : 'Native Rhythm & Linking',
    stressPattern: words.map((_, i) => (i % 2 === 0 ? '●' : '○')).join(' '),
    bandLevel,
    categoryEn: 'Custom Drill',
    categoryVi: 'Bài Tập Tự Tạo',
    topicEn: topic || 'Custom Practice',
    topicVi: topic || 'Luyện tập tự chọn',
    meaningEn: meaning || 'Custom pronunciation drill created for deliberate phonetic practice.',
    meaningVi: meaning || 'Bài tập phát âm tự tạo để rèn luyện khẩu hình và ngữ điệu.',
    trapEn: 'Focus on clear vowel length, final consonants (/s/, /t/, /d/), and smooth word linking.',
    trapVi: 'Chú ý độ dài nguyên âm, bật rõ phụ âm cuối (/s/, /t/, /d/) và nối âm mượt giữa các từ.',
    mouthTipEn: 'Listen to the native model at 0.75x first, then shadow at 1.0x speed.',
    mouthTipVi: 'Nghe mẫu ở tốc độ 0.75x trước, sau đó đọc nhại lại ở tốc độ 1.0x.',
    exampleEn: resolvedType === 'words' ? `Try using "${cleanText}" in an IELTS Speaking Part 3 response.` : cleanText,
    exampleVi: resolvedType === 'words' ? `Hãy áp dụng từ "${cleanText}" vào câu trả lời IELTS Speaking Part 3.` : cleanText,
    xpReward: trackMeta.baseXp,
    isCustom: true
  };
}

/**
 * Converts a logged-in user's Personal Vocabulary Notebook entries (`vocabList`)
 * into ready-to-practice Pronunciation Drills (Word + Collocation + Example Sentence),
 * deduplicating against built-in drills.
 */
export function mapVocabListToPronunciationDrills(vocabList = [], existingTargetTexts = new Set()) {
  if (!Array.isArray(vocabList) || vocabList.length === 0) return [];
  const seen = new Set(Array.from(existingTargetTexts).map(t => String(t).toLowerCase().trim()));
  const result = [];

  const pushVaultDrill = ({ rawText, forcedType, suffix, v, bandRaw, meaning, exampleText }) => {
    const clean = String(rawText || '').trim().replace(/\s+/g, ' ');
    if (!clean) return;
    const key = clean.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);

    const drill = buildCustomPronunciationDrill({
      text: clean,
      type: forcedType || 'auto',
      bandLevel: bandRaw,
      topic: v?.topic || 'Vocab Notebook',
      meaning
    });

    const baseId = v?.id || key.replace(/[^a-z0-9]/gi, '_');
    result.push({
      ...drill,
      id: `pron-vault-${baseId}-${suffix}`,
      ipaUk: suffix === 'w' ? (v?.ipa || drill.ipaUk) : drill.ipaUk,
      ipaUs: suffix === 'w' ? (v?.ipa || drill.ipaUs) : drill.ipaUs,
      exampleEn: exampleText || drill.exampleEn,
      exampleVi: exampleText || drill.exampleVi,
      categoryEn: 'Vocab Notebook',
      categoryVi: 'Sổ Tay Từ Vựng',
      topicEn: v?.topic || 'Personal Vault',
      topicVi: v?.topic || 'Sổ tay cá nhân',
      isCustom: false,
      isFromVocabVault: true
    });
  };

  for (let i = 0; i < vocabList.length; i++) {
    const v = vocabList[i];
    const bandRaw = String(v?.band || v?.bandLevel || '7.0').replace(/[^0-9.]/g, '') || '7.0';
    const meaning = String(v?.meaningVi || v?.meaningEn || v?.meaning || '').trim();
    const rawWord = String(v?.word || v?.term || v?.phrase || '').trim().replace(/\s+/g, ' ');
    const rawCollocation = String(v?.collocation || '').trim().replace(/\s+/g, ' ');
    const rawExample = String(v?.example || '').trim().replace(/\s+/g, ' ');

    if (rawWord) {
      pushVaultDrill({
        rawText: rawWord,
        forcedType: 'auto',
        suffix: 'w',
        v,
        bandRaw,
        meaning,
        exampleText: rawExample
      });
    }

    if (rawCollocation) {
      pushVaultDrill({
        rawText: rawCollocation,
        forcedType: 'phrases',
        suffix: 'p',
        v,
        bandRaw,
        meaning: meaning ? `${rawWord ? `${rawWord}: ` : ''}${meaning}` : '',
        exampleText: rawExample
      });
    }

    if (rawExample) {
      pushVaultDrill({
        rawText: rawExample,
        forcedType: 'sentences',
        suffix: 's',
        v,
        bandRaw,
        meaning: meaning ? `${rawWord ? `${rawWord} — ` : ''}${meaning}` : '',
        exampleText: rawExample
      });
    }
  }

  return result;
}

export const IPA_SOUND_GROUPS = [
  { id: 'all', labelEn: 'All 44 Sounds', labelVi: 'Tất cả 44 âm' },
  { id: 'monophthongs', labelEn: 'Monophthongs (12)', labelVi: 'Nguyên âm đơn (12)' },
  { id: 'diphthongs', labelEn: 'Diphthongs (8)', labelVi: 'Nguyên âm đôi (8)' },
  { id: 'consonants', labelEn: 'Consonants (24)', labelVi: 'Phụ âm (24)' }
];

const RAW_IPA_CHART_SPECS = [
  // ================= 12 MONOPHTHONGS =================
  {
    id: 'pron-ipa-01', symbol: '/iː/', group: 'monophthongs', sample: 'sheep',
    targetText: 'sheep, achieve, peak',
    ipaUk: '/ʃiːp/ • /əˈtʃiːv/ • /piːk/', ipaUs: '/ʃiːp/ • /əˈtʃiːv/ • /piːk/',
    voicedEn: 'Long Front Vowel', voicedVi: 'Nguyên âm đơn dài',
    pairText: 'sheep /iː/ ↔ ship /ɪ/', pairSpeak: 'sheep, ship',
    mouthEn: 'Spread your lips wide like a gentle smile, raise the front of your tongue high, and hold the vowel long.',
    mouthVi: 'Căng khóe miệng ngang như đang mỉm cười, nâng mặt lưỡi trước lên cao và ngân dài hơi.',
    trapEn: 'Cutting the vowel too short so "sheep" sounds like "ship".',
    trapVi: 'Đọc quá ngắn giống chữ "i" tiếng Việt khiến "sheep" bị nghe thành "ship".',
    exampleEn: 'We need to achieve peak efficiency this week.'
  },
  {
    id: 'pron-ipa-02', symbol: '/ɪ/', group: 'monophthongs', sample: 'ship',
    targetText: 'ship, system, build',
    ipaUk: '/ʃɪp/ • /ˈsɪs.təm/ • /bɪld/', ipaUs: '/ʃɪp/ • /ˈsɪs.təm/ • /bɪld/',
    voicedEn: 'Short Lax Vowel', voicedVi: 'Nguyên âm đơn ngắn (thả lỏng)',
    pairText: 'ship /ɪ/ ↔ sheep /iː/', pairSpeak: 'ship, sheep',
    mouthEn: 'Relax your lips and jaw slightly; keep the sound short and crisp between /iː/ and /e/.',
    mouthVi: 'Thả lỏng môi và hàm, phát âm ngắn, dứt khoát (hơi pha giữa âm "i" và "ê" nhẹ).',
    trapEn: 'Tensing the lips into a long /iː/ sound.',
    trapVi: 'Căng môi đọc thành âm "i" dài tiếng Việt.',
    exampleEn: 'This digital system will simplify citizen registration.'
  },
  {
    id: 'pron-ipa-03', symbol: '/ʊ/', group: 'monophthongs', sample: 'book',
    targetText: 'book, good, put',
    ipaUk: '/bʊk/ • /ɡʊd/ • /pʊt/', ipaUs: '/bʊk/ • /ɡʊd/ • /pʊt/',
    voicedEn: 'Short Rounded Vowel', voicedVi: 'Nguyên âm đơn ngắn tròn môi nhẹ',
    pairText: 'full /ʊ/ ↔ fool /uː/', pairSpeak: 'full, fool',
    mouthEn: 'Round your lips gently without pushing them far forward; produce a short, relaxed "uh-oo" sound.',
    mouthVi: 'Hơi tròn môi nhẹ, thả lỏng cơ miệng và bật âm ngắn gọn từ cuống họng.',
    trapEn: 'Over-rounding and lengthening into /uː/.',
    trapVi: 'Chu môi quá sâu và kéo dài thành âm "u" dài.',
    exampleEn: 'Look at this good academic guidebook.'
  },
  {
    id: 'pron-ipa-04', symbol: '/uː/', group: 'monophthongs', sample: 'food',
    targetText: 'food, school, boost',
    ipaUk: '/fuːd/ • /skuːl/ • /buːst/', ipaUs: '/fuːd/ • /skuːl/ • /buːst/',
    voicedEn: 'Long Back Rounded Vowel', voicedVi: 'Nguyên âm đơn dài tròn môi',
    pairText: 'fool /uː/ ↔ full /ʊ/', pairSpeak: 'fool, full',
    mouthEn: 'Push your lips forward into a tight small circle, raise the back of your tongue, and hold the sound.',
    mouthVi: 'Chu tròn môi ra phía trước thành vòng nhỏ, nâng cuống lưỡi và giữ âm ngân dài.',
    trapEn: 'Dropping the final consonant after a long /uː/ (e.g. school, boost).',
    trapVi: 'Ngân âm /uː/ nhưng quên bật phụ âm cuối như /l/ trong school hoặc /st/ trong boost.',
    exampleEn: 'New tools can boost food production at school.'
  },
  {
    id: 'pron-ipa-05', symbol: '/e/', group: 'monophthongs', sample: 'bed',
    targetText: 'bed, trend, effect',
    ipaUk: '/bed/ • /trend/ • /ɪˈfekt/', ipaUs: '/bed/ • /trend/ • /ɪˈfekt/',
    voicedEn: 'Short Mid-Front Vowel', voicedVi: 'Nguyên âm đơn ngắn mở vừa',
    pairText: 'bed /e/ ↔ bad /æ/', pairSpeak: 'bed, bad',
    mouthEn: 'Open your mouth moderately (about one finger width), keep your tongue mid-high, and make a short crisp /e/.',
    mouthVi: 'Mở miệng vừa phải (khoảng 1 ngón tay), đầu lưỡi chạm nhẹ răng dưới, phát âm "e" ngắn gọn.',
    trapEn: 'Opening the jaw too wide so "bed" sounds like "bad".',
    trapVi: 'Hạ hàm quá rộng khiến "bed" bị lẫn sang "bad" (/æ/).',
    exampleEn: 'This economic trend has a direct effect on employment.'
  },
  {
    id: 'pron-ipa-06', symbol: '/ə/', group: 'monophthongs', sample: 'teacher',
    targetText: 'teacher, support, about',
    ipaUk: '/ˈtiː.tʃə/ • /səˈpɔːt/ • /əˈbaʊt/', ipaUs: '/ˈtiː.tʃɚ/ • /səˈpɔːrt/ • /əˈbaʊt/',
    voicedEn: 'Schwa (Weak Neutral Vowel)', voicedVi: 'Âm Schwa (Nguyên âm lướt nhẹ nhất)',
    pairText: 'support /sə/ ↔ sport /spɔːt/', pairSpeak: 'support, sport',
    mouthEn: 'Completely relax your jaw, lips, and tongue in a neutral resting position; emit a super brief, unstressed murmur.',
    mouthVi: 'Thả lỏng hoàn toàn môi, hàm và lưỡi; lướt âm "ơ" cực nhẹ và ngắn ở các âm tiết không nhấn trọng âm.',
    trapEn: 'Stressing the schwa too heavily like a full Vietnamese "ơ" or "a".',
    trapVi: 'Đọc âm /ə/ quá mạnh và rõ như chữ "ơ" hoặc "a" có dấu trong tiếng Việt.',
    exampleEn: 'Teachers provide vital support for local communities.'
  },
  {
    id: 'pron-ipa-07', symbol: '/ɜː/', group: 'monophthongs', sample: 'bird',
    targetText: 'bird, research, urban',
    ipaUk: '/bɜːd/ • /rɪˈsɜːtʃ/ • /ˈɜː.bən/', ipaUs: '/bɝːd/ • /ˈriː.sɝːtʃ/ • /ˈɝː.bən/',
    voicedEn: 'Long Central Vowel', voicedVi: 'Nguyên âm đơn dài trung tâm (cong lưỡi US)',
    pairText: 'bird /ɜː/ ↔ bud /ʌ/', pairSpeak: 'bird, bud',
    mouthEn: 'Keep lips neutral, tense the middle of your tongue (curl the tip back slightly for US accent) and sustain /ɜː/.',
    mouthVi: 'Môi giữ tự nhiên, nâng phần giữa lưỡi và ngân dài âm "ơ" sâu (cong nhẹ đầu lưỡi nếu đọc giọng Mỹ).',
    trapEn: 'Pronouncing it too short without vowel length or r-coloring.',
    trapVi: 'Đọc thành âm "ơ" ngắn cụt, thiếu độ sâu và độ ngân.',
    exampleEn: 'Further urban research requires long-term investment.'
  },
  {
    id: 'pron-ipa-08', symbol: '/ɔː/', group: 'monophthongs', sample: 'law',
    targetText: 'law, thought, resource',
    ipaUk: '/lɔː/ • /θɔːt/ • /rɪˈzɔːs/', ipaUs: '/lɔː/ • /θɔːt/ • /ˈriː.sɔːrs/',
    voicedEn: 'Long Rounded Back Vowel', voicedVi: 'Nguyên âm đơn dài tròn môi sâu',
    pairText: 'caught /ɔː/ ↔ cot /ɒ/', pairSpeak: 'caught, cot',
    mouthEn: 'Lower your jaw slightly, round your lips into an oval shape, pull the tongue back, and hold the long /ɔː/.',
    mouthVi: 'Hạ nhẹ hàm, chu môi hình bầu dục, kéo lưỡi về sau và ngân dài âm "o" trầm.',
    trapEn: 'Reading "au/aw" as a diphthong /aʊ/ instead of a pure long /ɔː/.',
    trapVi: 'Đọc nhầm các từ có chữ "aw/au" (law, cause) thành âm "ao" thay vì /ɔː/ dài.',
    exampleEn: 'Strict laws protect natural water resources.'
  },
  {
    id: 'pron-ipa-09', symbol: '/æ/', group: 'monophthongs', sample: 'cat',
    targetText: 'cat, factor, rapid',
    ipaUk: '/kæt/ • /ˈfæk.tə/ • /ˈræp.ɪd/', ipaUs: '/kæt/ • /ˈfæk.tɚ/ • /ˈræp.ɪd/',
    voicedEn: 'Open Front Vowel (Trap-Bath)', voicedVi: 'Nguyên âm bẹt (mở rộng hàm & căng môi)',
    pairText: 'bad /æ/ ↔ bed /e/', pairSpeak: 'bad, bed',
    mouthEn: 'Drop your jaw wide open while spreading the corners of your lips sideways; blend "a" and "e" cleanly.',
    mouthVi: 'Hạ rộng hàm xuống như khi nói "a" nhưng căng khóe miệng sang hai bên như khi nói "e" (âm e bẹt).',
    trapEn: 'Replacing /æ/ with a plain Vietnamese "a" or "e".',
    trapVi: 'Đọc hẳn thành chữ "a" hoặc chữ "e" tiếng Việt thay vì mở rộng hàm kết hợp căng môi.',
    exampleEn: 'Rapid expansion is a key factor in urban traffic.'
  },
  {
    id: 'pron-ipa-10', symbol: '/ʌ/', group: 'monophthongs', sample: 'cup',
    targetText: 'cup, study, culture',
    ipaUk: '/kʌp/ • /ˈstʌd.i/ • /ˈkʌl.tʃə/', ipaUs: '/kʌp/ • /ˈstʌd.i/ • /ˈkʌl.tʃɚ/',
    voicedEn: 'Short Open-Mid Vowel', voicedVi: 'Nguyên âm đơn ngắn mở tự nhiên',
    pairText: 'cup /ʌ/ ↔ cap /æ/', pairSpeak: 'cup, cap',
    mouthEn: 'Open your mouth naturally without rounding or spreading lips, and release a short, punchy central vowel.',
    mouthVi: 'Mở miệng tự nhiên, lưỡi hạ thấp ở giữa khoang miệng, bật âm ngắn gọn gần giống âm "ă/ơ" pha nhau.',
    trapEn: 'Holding the vowel too long so it sounds like /ɑː/.',
    trapVi: 'Kéo dài âm khiến "cup" nghe giống "carp" (/ɑː/).',
    exampleEn: 'Young adults study diverse cultures at university.'
  },
  {
    id: 'pron-ipa-11', symbol: '/ɑː/', group: 'monophthongs', sample: 'car',
    targetText: 'car, market, advance',
    ipaUk: '/kɑː/ • /ˈmɑː.kɪt/ • /ədˈvɑːns/', ipaUs: '/kɑːr/ • /ˈmɑːr.kɪt/ • /ədˈvæns/',
    voicedEn: 'Long Deep Open Vowel', voicedVi: 'Nguyên âm đơn dài mở sâu',
    pairText: 'heart /ɑː/ ↔ hut /ʌ/', pairSpeak: 'heart, hut',
    mouthEn: 'Drop your jaw wide, keep your tongue low and far back (like saying "ah" at the doctor), and sustain.',
    mouthVi: 'Hạ rộng hàm dưới, hạ thấp cuống lưỡi và ngân dài âm "a" sâu từ vòm họng.',
    trapEn: 'Making the vowel flat and front instead of deep and resonant.',
    trapVi: 'Đọc âm "a" nông ở đầu miệng, thiếu độ mở vòm họng.',
    exampleEn: 'Farmers sell organic produce at the local market.'
  },
  {
    id: 'pron-ipa-12', symbol: '/ɒ/', group: 'monophthongs', sample: 'hot',
    targetText: 'hot, policy, modern',
    ipaUk: '/hɒt/ • /ˈpɒl.ə.si/ • /ˈmɒd.ən/', ipaUs: '/hɑːt/ • /ˈpɑː.lə.si/ • /ˈmɑː.dɚn/',
    voicedEn: 'Short Open Back Vowel', voicedVi: 'Nguyên âm đơn ngắn mở sau',
    pairText: 'cot /ɒ/ ↔ caught /ɔː/', pairSpeak: 'cot, caught',
    mouthEn: 'Open your jaw wide with very light lip rounding (UK /ɒ/) or open unrounded back /ɑː/ (US) — keep it short.',
    mouthVi: 'Mở rộng hàm, hơi tròn môi nhẹ và đọc ngắn gọn (giọng Anh đọc /ɒ/, giọng Mỹ mở rộng thành /ɑː/).',
    trapEn: 'Closing the jaw too much like Vietnamese "ô".',
    trapVi: 'Khép miệng đọc thành âm "ô" tiếng Việt (ví dụ đọc "policy" thành "pô-li-xi").',
    exampleEn: 'Modern fiscal policy solves complex economic problems.'
  },

  // ================= 8 DIPHTHONGS =================
  {
    id: 'pron-ipa-13', symbol: '/ɪə/', group: 'diphthongs', sample: 'here',
    targetText: 'here, theory, career',
    ipaUk: '/hɪə/ • /ˈθɪə.ri/ • /kəˈrɪə/', ipaUs: '/hɪr/ • /ˈθɪr.i/ • /kəˈrɪr/',
    voicedEn: 'Centering Diphthong', voicedVi: 'Nguyên âm đôi trượt từ /ɪ/ sang /ə/',
    pairText: 'here /ɪə/ ↔ hair /eə/', pairSpeak: 'here, hair',
    mouthEn: 'Start clearly on a short /ɪ/ and glide smoothly into a relaxed central schwa /ə/ (or /r/ in US).',
    mouthVi: 'Bắt đầu ở vị trí âm /ɪ/ rồi lướt mượt về âm /ə/ thả lỏng ở giữa miệng.',
    trapEn: 'Breaking the diphthong into two separate syllables.',
    trapVi: 'Tách rời thành 2 tiếng riêng biệt thay vì lướt liền 1 hơi.',
    exampleEn: 'His academic career is built on a clear scientific theory.'
  },
  {
    id: 'pron-ipa-14', symbol: '/eɪ/', group: 'diphthongs', sample: 'wait',
    targetText: 'wait, climate, sustain',
    ipaUk: '/weɪt/ • /ˈklaɪ.mət/ • /səˈsteɪn/', ipaUs: '/weɪt/ • /ˈklaɪ.mət/ • /səˈsteɪn/',
    voicedEn: 'Closing Front Diphthong', voicedVi: 'Nguyên âm đôi trượt từ /e/ lên /ɪ/',
    pairText: 'wait /eɪ/ ↔ wet /e/', pairSpeak: 'wait, wet',
    mouthEn: 'Begin with your jaw open for /e/, then close your jaw upward toward /ɪ/ before pronouncing the final consonant.',
    mouthVi: 'Mở miệng ở âm /e/ rồi khép dần hàm hướng lên âm /ɪ/ trước khi đóng phụ âm cuối.',
    trapEn: 'Stopping at a flat /e/ without gliding up to /ɪ/ (making "wait" sound like "wet").',
    trapVi: 'Bỏ mất âm lướt /ɪ/ ở cuối khiến "wait" nghe như "wet".',
    exampleEn: 'We cannot wait to sustain global climate action.'
  },
  {
    id: 'pron-ipa-15', symbol: '/ʊə/', group: 'diphthongs', sample: 'tour',
    targetText: 'tour, pure, secure',
    ipaUk: '/tʊə/ • /pjʊə/ • /sɪˈkjʊə/', ipaUs: '/tʊr/ • /pjʊr/ • /səˈkjʊr/',
    voicedEn: 'Centering Rounded Diphthong', voicedVi: 'Nguyên âm đôi trượt từ /ʊ/ sang /ə/',
    pairText: 'tour /ʊə/ ↔ tore /ɔː/', pairSpeak: 'tour, tore',
    mouthEn: 'Start with rounded lips on /ʊ/ and relax your lips open into schwa /ə/ in one continuous breath.',
    mouthVi: 'Khởi đầu bằng môi hơi tròn ở âm /ʊ/ rồi thả lỏng môi mở ra âm /ə/.',
    trapEn: 'Forgetting the /j/ glide before /ʊə/ in words like "pure" (/pjʊə/) and "secure" (/sɪˈkjʊə/).',
    trapVi: 'Quên âm đệm /j/ trong các từ như "pure" (/pjʊə/) hoặc "secure" (/sɪˈkjʊə/).',
    exampleEn: 'Eco-tourism helps secure pure drinking water for villages.'
  },
  {
    id: 'pron-ipa-16', symbol: '/ɔɪ/', group: 'diphthongs', sample: 'boy',
    targetText: 'boy, choice, employ',
    ipaUk: '/bɔɪ/ • /tʃɔɪs/ • /ɪmˈplɔɪ/', ipaUs: '/bɔɪ/ • /tʃɔɪs/ • /ɪmˈplɔɪ/',
    voicedEn: 'Closing Diphthong', voicedVi: 'Nguyên âm đôi trượt từ /ɔː/ sang /ɪ/',
    pairText: 'boy /ɔɪ/ ↔ buy /aɪ/', pairSpeak: 'boy, buy',
    mouthEn: 'Round your lips for /ɔː/ first, then spread them sideways as your tongue glides up to /ɪ/.',
    mouthVi: 'Tròn môi ở âm /ɔː/ trước, sau đó kéo khóe miệng sang hai bên khi lưỡi nâng lên âm /ɪ/.',
    trapEn: 'Dropping the final /s/ in "choice" after the diphthong /ɔɪ/.',
    trapVi: 'Đọc xong nguyên âm đôi /ɔɪ/ nhưng bỏ quên âm gió /s/ ở cuối từ "choice".',
    exampleEn: 'Companies employ skilled graduates who make wise choices.'
  },
  {
    id: 'pron-ipa-17', symbol: '/əʊ/', group: 'diphthongs', sample: 'go',
    targetText: 'go, global, growth',
    ipaUk: '/ɡəʊ/ • /ˈɡləʊ.bəl/ • /ɡrəʊθ/', ipaUs: '/ɡoʊ/ • /ˈɡloʊ.bəl/ • /ɡroʊθ/',
    voicedEn: 'Closing Rounded Diphthong', voicedVi: 'Nguyên âm đôi trượt từ /ə/ sang /ʊ/',
    pairText: 'goat /əʊ/ ↔ got /ɒ/', pairSpeak: 'goat, got',
    mouthEn: 'Start with a relaxed central mouth (/ə/ or /o/) and round your lips tighter toward /ʊ/ at the end.',
    mouthVi: 'Bắt đầu với miệng mở tự nhiên ở /ə/ rồi thu tròn môi dần về âm /ʊ/ ở cuối.',
    trapEn: 'Using a static Vietnamese "ô" without rounding into /ʊ/ at the end.',
    trapVi: 'Đọc thành âm "ô" đơn thuần của tiếng Việt, thiếu chuyển động khép tròn môi về /ʊ/.',
    exampleEn: 'Global economic growth depends on green innovation.'
  },
  {
    id: 'pron-ipa-18', symbol: '/eə/', group: 'diphthongs', sample: 'care',
    targetText: 'care, aware, compare',
    ipaUk: '/keə/ • /əˈweə/ • /kəmˈpeə/', ipaUs: '/ker/ • /əˈwer/ • /kəmˈper/',
    voicedEn: 'Centering Front Diphthong', voicedVi: 'Nguyên âm đôi trượt từ /e/ sang /ə/',
    pairText: 'care /eə/ ↔ car /ɑː/', pairSpeak: 'care, car',
    mouthEn: 'Begin on an open-mid /e/ and glide smoothly toward the central schwa /ə/ (or curl tongue for US /er/).',
    mouthVi: 'Bắt đầu bằng âm /e/ mở vừa rồi trượt nhẹ vào âm /ə/ ở trung tâm (hoặc cong lưỡi /r/ ở giọng Mỹ).',
    trapEn: 'Cutting off the schwa glide so "care" sounds like a short "ke".',
    trapVi: 'Đọc cụt thành chữ "ke" tiếng Việt, thiếu độ ngân chuyển âm ở cuối.',
    exampleEn: 'Consumers are increasingly aware of healthcare quality.'
  },
  {
    id: 'pron-ipa-19', symbol: '/aɪ/', group: 'diphthongs', sample: 'time',
    targetText: 'time, vital, decline',
    ipaUk: '/taɪm/ • /ˈvaɪ.təl/ • /dɪˈklaɪn/', ipaUs: '/taɪm/ • /ˈvaɪ.t̬əl/ • /dɪˈklaɪn/',
    voicedEn: 'Wide Closing Diphthong', voicedVi: 'Nguyên âm đôi trượt rộng từ /a/ lên /ɪ/',
    pairText: 'time /aɪ/ ↔ tame /eɪ/', pairSpeak: 'time, tame',
    mouthEn: 'Drop your jaw wide open on /a/, then glide your tongue and jaw smoothly upward to /ɪ/.',
    mouthVi: 'Mở rộng hàm ở âm /a/, sau đó nâng hàm và mặt lưỡi lướt mượt lên âm /ɪ/.',
    trapEn: 'Not completing the /ɪ/ glide before closing the final /m/, /l/, or /n/.',
    trapVi: 'Chưa kịp lướt lên âm /ɪ/ đã đóng miệng khiến từ "time" nghe như "tam".',
    exampleEn: 'It is vital to reverse the decline in wildlife habitats.'
  },
  {
    id: 'pron-ipa-20', symbol: '/aʊ/', group: 'diphthongs', sample: 'now',
    targetText: 'now, allow, profound',
    ipaUk: '/naʊ/ • /əˈlaʊ/ • /prəˈfaʊnd/', ipaUs: '/naʊ/ • /əˈlaʊ/ • /prəˈfaʊnd/',
    voicedEn: 'Wide Rounding Diphthong', voicedVi: 'Nguyên âm đôi trượt từ /a/ sang /ʊ/',
    pairText: 'now /aʊ/ ↔ know /əʊ/', pairSpeak: 'now, know',
    mouthEn: 'Open your mouth wide for /a/, then glide smoothly into rounded lips for /ʊ/.',
    mouthVi: 'Hạ rộng hàm ở âm /a/ rồi thu tròn môi dần về vị trí âm /ʊ/.',
    trapEn: 'Omitting the final /nd/ cluster after /aʊ/ in "profound" or "around".',
    trapVi: 'Đọc xong âm /aʊ/ nhưng bỏ sót cụm phụ âm cuối /nd/ trong "profound".',
    exampleEn: 'Artificial intelligence now has a profound impact on society.'
  },

  // ================= 24 CONSONANTS =================
  {
    id: 'pron-ipa-21', symbol: '/p/', group: 'consonants', sample: 'pen',
    targetText: 'pen, policy, impact',
    ipaUk: '/pen/ • /ˈpɒl.ə.si/ • /ˈɪm.pækt/', ipaUs: '/pen/ • /ˈpɑː.lə.si/ • /ˈɪm.pækt/',
    voicedEn: 'Voiceless Bilabial Plosive', voicedVi: 'Phụ âm bật hơi hai môi (Vô thanh)',
    pairText: 'pen /p/ ↔ ben /b/', pairSpeak: 'pen, ben',
    mouthEn: 'Press both lips together to build air pressure, then release a sharp puff of air without vibrating your vocal cords.',
    mouthVi: 'Mím nhẹ hai môi nén luồng hơi rồi bật mạnh hơi ra ngoài, dây thanh quản KHÔNG rung.',
    trapEn: 'Pronouncing /p/ flatly without aspiration (puff of air) at the start of stressed syllables.',
    trapVi: 'Đọc âm /p/ không bật hơi khiến người bản xứ nghe nhầm thành âm /b/.',
    exampleEn: 'Public policy has a powerful impact on poverty reduction.'
  },
  {
    id: 'pron-ipa-22', symbol: '/b/', group: 'consonants', sample: 'bad',
    targetText: 'bad, benefit, global',
    ipaUk: '/bæd/ • /ˈben.ɪ.fɪt/ • /ˈɡləʊ.bəl/', ipaUs: '/bæd/ • /ˈben.ə.fɪt/ • /ˈɡloʊ.bəl/',
    voicedEn: 'Voiced Bilabial Plosive', voicedVi: 'Phụ âm hai môi (Hữu thanh - rung cổ họng)',
    pairText: 'bat /b/ ↔ pat /p/', pairSpeak: 'bat, pat',
    mouthEn: 'Close both lips and vibrate your vocal cords immediately as you release the sound gently.',
    mouthVi: 'Chạm hai môi và làm rung dây thanh quản ngay khi mở môi phát âm.',
    trapEn: 'Devoicing /b/ at the end of words like "job" or "club".',
    trapVi: 'Bỏ mất âm /b/ ở cuối từ như "job" hoặc "club".',
    exampleEn: 'Global trade brings broad benefits to businesses.'
  },
  {
    id: 'pron-ipa-23', symbol: '/t/', group: 'consonants', sample: 'tea',
    targetText: 'tea, trend, climate',
    ipaUk: '/tiː/ • /trend/ • /ˈklaɪ.mət/', ipaUs: '/tiː/ • /trend/ • /ˈklaɪ.mət/',
    voicedEn: 'Voiceless Alveolar Plosive', voicedVi: 'Phụ âm đầu lưỡi chân răng bật hơi (Vô thanh)',
    pairText: 'tea /t/ ↔ dee /d/', pairSpeak: 'tea, dee',
    mouthEn: 'Tap your tongue tip firmly against the alveolar ridge behind your upper front teeth and release a crisp puff of air.',
    mouthVi: 'Đặt đầu lưỡi chạm gờ lợi ngay sau răng cửa trên, nén hơi rồi bật nhẹ đầu lưỡi ra (không rung cổ họng).',
    trapEn: 'Pronouncing English /t/ like Vietnamese "t" without aspiration, or dropping final /t/ in "climate".',
    trapVi: 'Đọc giống chữ "t" tiếng Việt không bật hơi hoặc nuốt luôn âm /t/ cuối từ "climate".',
    exampleEn: 'Technology trends transform transport networks.'
  },
  {
    id: 'pron-ipa-24', symbol: '/d/', group: 'consonants', sample: 'did',
    targetText: 'did, demand, method',
    ipaUk: '/dɪd/ • /dɪˈmɑːnd/ • /ˈmeθ.əd/', ipaUs: '/dɪd/ • /dɪˈmænd/ • /ˈmeθ.əd/',
    voicedEn: 'Voiced Alveolar Plosive', voicedVi: 'Phụ âm đầu lưỡi chân răng (Hữu thanh)',
    pairText: 'did /d/ ↔ tid /t/', pairSpeak: 'did, tid',
    mouthEn: 'Touch your tongue tip to the ridge behind your upper teeth and vibrate your vocal cords as you release.',
    mouthVi: 'Đặt đầu lưỡi chạm gờ lợi răng trên và bật âm có rung dây thanh quản.',
    trapEn: 'Omitting the final /d/ in "demand", "method", or "-ed" past tense endings.',
    trapVi: 'Quên bật âm /d/ ở cuối từ "demand", "method" hoặc các động từ chia đuôi "-ed".',
    exampleEn: 'Modern methods meet the growing demand for data.'
  },
  {
    id: 'pron-ipa-25', symbol: '/tʃ/', group: 'consonants', sample: 'chain',
    targetText: 'chain, challenge, research',
    ipaUk: '/tʃeɪn/ • /ˈtʃæl.ɪndʒ/ • /rɪˈsɜːtʃ/', ipaUs: '/tʃeɪn/ • /ˈtʃæl.ɪndʒ/ • /ˈriː.sɝːtʃ/',
    voicedEn: 'Voiceless Postalveolar Affricate', voicedVi: 'Phụ âm tắc xát tròn môi bật hơi (Vô thanh)',
    pairText: 'chain /tʃ/ ↔ jane /dʒ/', pairSpeak: 'chain, jane',
    mouthEn: 'Round your lips slightly forward, press your tongue behind the alveolar ridge like /t/, and release into /ʃ/ ("ch").',
    mouthVi: 'Hơi chu tròn môi, đặt lưỡi chặn hơi như âm /t/ rồi bật xát ra luồng gió mạnh như âm /ʃ/ (không rung họng).',
    trapEn: 'Pronouncing /tʃ/ flatly like Vietnamese "ch" without lip rounding and air burst, especially at the end of "research".',
    trapVi: 'Đọc giống chữ "ch" tiếng Việt không tròn môi bật gió, hoặc bỏ quên âm /tʃ/ ở cuối từ "research".',
    exampleEn: 'Climate change poses a major challenge for scientific research.'
  },
  {
    id: 'pron-ipa-26', symbol: '/dʒ/', group: 'consonants', sample: 'jam',
    targetText: 'jam, major, knowledge',
    ipaUk: '/dʒæm/ • /ˈmeɪ.dʒə/ • /ˈnɒl.ɪdʒ/', ipaUs: '/dʒæm/ • /ˈmeɪ.dʒɚ/ • /ˈnɑː.lɪdʒ/',
    voicedEn: 'Voiced Postalveolar Affricate', voicedVi: 'Phụ âm tắc xát tròn môi (Hữu thanh)',
    pairText: 'ridge /dʒ/ ↔ rich /tʃ/', pairSpeak: 'ridge, rich',
    mouthEn: 'Use the exact same rounded mouth position as /tʃ/, but vibrate your vocal cords strongly ("j / dge").',
    mouthVi: 'Khẩu hình chu nhẹ giống hệt âm /tʃ/ nhưng làm rung mạnh dây thanh quản (như âm "gi/d" bật mạnh).',
    trapEn: 'Dropping the final /-dʒ/ in academic words like "knowledge", "advantage", and "college".',
    trapVi: 'Bỏ sót âm /-dʒ/ ở cuối các từ học thuật quan trọng như "knowledge", "advantage", "college".',
    exampleEn: 'Sharing digital knowledge creates a major advantage.'
  },
  {
    id: 'pron-ipa-27', symbol: '/k/', group: 'consonants', sample: 'cat',
    targetText: 'cat, culture, economic',
    ipaUk: '/kæt/ • /ˈkʌl.tʃə/ • /ˌiː.kəˈnɒm.ɪk/', ipaUs: '/kæt/ • /ˈkʌl.tʃɚ/ • /ˌiː.kəˈnɑː.mɪk/',
    voicedEn: 'Voiceless Velar Plosive', voicedVi: 'Phụ âm cuống lưỡi bật hơi (Vô thanh)',
    pairText: 'back /k/ ↔ bag /ɡ/', pairSpeak: 'back, bag',
    mouthEn: 'Raise the back of your tongue against the soft palate to block air, then release a crisp voiceless burst.',
    mouthVi: 'Nâng cuống lưỡi chạm ngạc mềm để chặn hơi rồi bật mạnh luồng hơi ra (không rung cổ họng).',
    trapEn: 'Swallowing the final /k/ in words ending with "-ic" (economic, academic, public).',
    trapVi: 'Nuốt mất âm /k/ ở cuối các tính từ đuôi "-ic" (economic, academic, public).',
    exampleEn: 'Cultural tourism stimulates local economic growth.'
  },
  {
    id: 'pron-ipa-28', symbol: '/ɡ/', group: 'consonants', sample: 'get',
    targetText: 'get, govern, progress',
    ipaUk: '/ɡet/ • /ˈɡʌv.ən/ • /ˈprəʊ.ɡres/', ipaUs: '/ɡet/ • /ˈɡʌv.ɚn/ • /ˈprɑː.ɡres/',
    voicedEn: 'Voiced Velar Plosive', voicedVi: 'Phụ âm cuống lưỡi (Hữu thanh)',
    pairText: 'girl /ɡ/ ↔ curl /k/', pairSpeak: 'girl, curl',
    mouthEn: 'Raise the back of your tongue like /k/, but vibrate your vocal cords as you release the sound.',
    mouthVi: 'Nâng cuống lưỡi giống âm /k/ nhưng làm rung dây thanh quản khi bật âm.',
    trapEn: 'Confusing /ɡ/ with /k/ in clusters like "progress" or "global".',
    trapVi: 'Đọc không rõ cụm phụ âm /ɡr/ và /ɡl/ trong "progress", "global".',
    exampleEn: 'Good governance accelerates social progress.'
  },
  {
    id: 'pron-ipa-29', symbol: '/f/', group: 'consonants', sample: 'fall',
    targetText: 'fall, factor, significant',
    ipaUk: '/fɔːl/ • /ˈfæk.tə/ • /sɪɡˈnɪf.ɪ.kənt/', ipaUs: '/fɔːl/ • /ˈfæk.tɚ/ • /sɪɡˈnɪf.ə.kənt/',
    voicedEn: 'Voiceless Labiodental Fricative', voicedVi: 'Phụ âm răng môi thổi hơi (Vô thanh)',
    pairText: 'fan /f/ ↔ van /v/', pairSpeak: 'fan, van',
    mouthEn: 'Rest your upper front teeth lightly on your lower lip and blow a steady stream of air through the gap.',
    mouthVi: 'Đặt hàm răng cửa trên chạm nhẹ lên môi dưới và thổi luồng hơi đều ra ngoài (không rung cổ họng).',
    trapEn: 'Dropping internal syllables or final consonants in long words like "significant".',
    trapVi: 'Đọc lướt quá nhanh làm mất âm /f/ hoặc âm /ɡ/ trong từ "significant".',
    exampleEn: 'Financial safety is a significant factor for families.'
  },
  {
    id: 'pron-ipa-30', symbol: '/v/', group: 'consonants', sample: 'van',
    targetText: 'van, vital, preserve',
    ipaUk: '/væn/ • /ˈvaɪ.təl/ • /prɪˈzɜːv/', ipaUs: '/væn/ • /ˈvaɪ.t̬əl/ • /prɪˈzɝːv/',
    voicedEn: 'Voiced Labiodental Fricative', voicedVi: 'Phụ âm răng môi (Hữu thanh - rung môi)',
    pairText: 'vine /v/ ↔ fine /f/', pairSpeak: 'vine, fine',
    mouthEn: 'Touch your upper teeth to your lower lip just like /f/, and vibrate your vocal cords so your lower lip buzzes.',
    mouthVi: 'Răng cửa trên chạm nhẹ môi dưới giống âm /f/, đồng thời làm rung dây thanh quản tạo cảm giác rung nhẹ ở môi dưới.',
    trapEn: 'Silence at the end of words ending in "-ve" (preserve, improve, achieve,active).',
    trapVi: 'Bỏ quên hoàn toàn âm /v/ ở cuối các từ kết thúc bằng "-ve" (preserve, improve, achieve).',
    exampleEn: 'It is vital to preserve diverse natural habitats.'
  },
  {
    id: 'pron-ipa-31', symbol: '/θ/', group: 'consonants', sample: 'think',
    targetText: 'think, theory, growth',
    ipaUk: '/θɪŋk/ • /ˈθɪə.ri/ • /ɡrəʊθ/', ipaUs: '/θɪŋk/ • /ˈθɪr.i/ • /ɡroʊθ/',
    voicedEn: 'Voiceless Dental Fricative (Unvoiced TH)', voicedVi: 'Âm TH vô thanh (Đặt đầu lưỡi giữa hai hàm răng)',
    pairText: 'think /θ/ ↔ sink /s/', pairSpeak: 'think, sink',
    mouthEn: 'Place the very tip of your tongue gently between your upper and lower front teeth and blow air softly without voicing.',
    mouthVi: 'Đưa nhẹ đầu lưỡi ra giữa hai hàm răng cửa và thổi luồng hơi êm qua khe răng (cổ họng KHÔNG rung).',
    trapEn: 'Replacing /θ/ with Vietnamese "th" (a stop sound) or /s/, especially at the end of "growth", "health", "both".',
    trapVi: 'Đọc thành chữ "th" tiếng Việt (rụt lưỡi vào trong) hoặc đọc thành /s/, đặc biệt hay bỏ sót âm /θ/ cuối từ "growth", "health".',
    exampleEn: 'Economic growth requires thorough theoretical thinking.'
  },
  {
    id: 'pron-ipa-32', symbol: '/ð/', group: 'consonants', sample: 'this',
    targetText: 'this, therefore, breathe',
    ipaUk: '/ðɪs/ • /ˈðeə.fɔː/ • /briːð/', ipaUs: '/ðɪs/ • /ˈðer.fɔːr/ • /briːð/',
    voicedEn: 'Voiced Dental Fricative (Voiced TH)', voicedVi: 'Âm TH hữu thanh (Lưỡi giữa hai răng & rung họng)',
    pairText: 'they /ð/ ↔ day /d/', pairSpeak: 'they, day',
    mouthEn: 'Place your tongue tip lightly between your front teeth like /θ/, and vibrate your vocal cords continuously.',
    mouthVi: 'Đặt đầu lưỡi nhẹ giữa hai hàm răng cửa giống âm /θ/ nhưng làm rung dây thanh quản để tạo tiếng rung êm.',
    trapEn: 'Hardening /ð/ into a Vietnamese "đ" or "d" in common words like "this, that, they, therefore".',
    trapVi: 'Đọc cứng thành chữ "đ" hoặc "gi" tiếng Việt (đọc "this" thành "đít-x", "therefore" thành "đe-pho").',
    exampleEn: 'They therefore decided to bescherm and breathe clean air.'
  },
  {
    id: 'pron-ipa-33', symbol: '/s/', group: 'consonants', sample: 'see',
    targetText: 'see, system, process',
    ipaUk: '/siː/ • /ˈsɪs.təm/ • /ˈprəʊ.ses/', ipaUs: '/siː/ • /ˈsɪs.təm/ • /ˈprɑː.ses/',
    voicedEn: 'Voiceless Alveolar Sibilant', voicedVi: 'Phụ âm xát gió chân răng (Vô thanh)',
    pairText: 'see /s/ ↔ she /ʃ/', pairSpeak: 'see, she',
    mouthEn: 'Keep your teeth close together, point your tongue tip near the upper gum ridge, and hiss a thin, sharp stream of air.',
    mouthVi: 'Khép nhẹ hai hàm răng gần nhau, đầu lưỡi hướng về chân răng cửa trên và xì luồng gió mảnh, sắc.',
    trapEn: 'Dropping middle or final /s/ sounds in words like "system", "process", "success".',
    trapVi: 'Quên phát âm /s/ ở giữa từ ("system") hoặc ở cuối từ ("process", "success").',
    exampleEn: 'A simple system makes the whole process faster.'
  },
  {
    id: 'pron-ipa-34', symbol: '/z/', group: 'consonants', sample: 'zoo',
    targetText: 'zoo, result, analyze',
    ipaUk: '/zuː/ • /rɪˈzʌlt/ • /ˈæn.əl.aɪz/', ipaUs: '/zuː/ • /rɪˈzʌlt/ • /ˈæn.əl.aɪz/',
    voicedEn: 'Voiced Alveolar Sibilant', voicedVi: 'Phụ âm xát chân răng (Hữu thanh - tiếng ong kêu)',
    pairText: 'zoo /z/ ↔ sue /s/', pairSpeak: 'zoo, sue',
    mouthEn: 'Use the exact mouth position of /s/, and vibrate your vocal cords to make a buzzing "zzz" sound.',
    mouthVi: 'Giữ khẩu hình giống hệt âm /s/ nhưng làm rung dây thanh quản tạo âm thanh rè như tiếng ong bay "zzz".',
    trapEn: 'Pronouncing letter "s" between vowels as /s/ instead of /z/ (e.g. result /rɪˈzʌlt/, reason /ˈriː.zən/).',
    trapVi: 'Đọc chữ "s" trong "result", "reason", "busy" thành âm /s/ thay vì âm rung /z/.',
    exampleEn: 'Researchers analyze data to verify positive results.'
  },
  {
    id: 'pron-ipa-35', symbol: '/ʃ/', group: 'consonants', sample: 'shoe',
    targetText: 'shoe, issue, crucial',
    ipaUk: '/ʃuː/ • /ˈɪʃ.uː/ • /ˈkruː.ʃəl/', ipaUs: '/ʃuː/ • /ˈɪʃ.uː/ • /ˈkruː.ʃəl/',
    voicedEn: 'Voiceless Postalveolar Fricative', voicedVi: 'Phụ âm xát tròn môi ("s nặng" - Vô thanh)',
    pairText: 'she /ʃ/ ↔ see /s/', pairSpeak: 'she, see',
    mouthEn: 'Push your lips forward into a soft rounded shape, pull your tongue slightly back from the teeth, and blow a wide "shhh" sound.',
    mouthVi: 'Chu nhẹ hai môi ra trước, nâng mặt lưỡi gần vòm miệng và thổi luồng hơi dày như khi ra hiệu im lặng "shhh".',
    trapEn: 'Pronouncing "issue" or "crucial" with a flat /s/ instead of a rounded /ʃ/.',
    trapVi: 'Không tròn môi khiến "issue" (/ˈɪʃ.uː/) hoặc "crucial" (/ˈkruː.ʃəl/) bị đọc thành âm /s/ bẹt.',
    exampleEn: 'Social housing is a crucial issue in big cities.'
  },
  {
    id: 'pron-ipa-36', symbol: '/ʒ/', group: 'consonants', sample: 'vision',
    targetText: 'vision, measure, decision',
    ipaUk: '/ˈvɪʒ.ən/ • /ˈmeʒ.ə/ • /dɪˈsɪʒ.ən/', ipaUs: '/ˈvɪʒ.ən/ • /ˈmeʒ.ɚ/ • /dɪˈsɪʒ.ən/',
    voicedEn: 'Voiced Postalveolar Fricative', voicedVi: 'Phụ âm xát tròn môi (Hữu thanh)',
    pairText: 'vision /ʒ/ ↔ mission /ʃ/', pairSpeak: 'vision, mission',
    mouthEn: 'Keep your lips rounded in the /ʃ/ ("sh") position, and turn on your vocal cords for a smooth voiced buzz.',
    mouthVi: 'Giữ nguyên khẩu hình chu môi của âm /ʃ/ nhưng làm rung mạnh dây thanh quản.',
    trapEn: 'Replacing /ʒ/ with Vietnamese "d/gi" or unvoiced /s/ in "-sion" / "-sure" words (vision, measure, leisure, decision).',
    trapVi: 'Đọc âm /ʒ/ trong "vision, measure, decision" thành âm "gi" hoặc "x" nhẹ của tiếng Việt.',
    exampleEn: 'Wise leaders measure the long-term vision of every decision.'
  },
  {
    id: 'pron-ipa-37', symbol: '/m/', group: 'consonants', sample: 'man',
    targetText: 'man, modern, system',
    ipaUk: '/mæn/ • /ˈmɒd.ən/ • /ˈsɪs.təm/', ipaUs: '/mæn/ • /ˈmɑː.dɚn/ • /ˈsɪs.təm/',
    voicedEn: 'Voiced Bilabial Nasal', voicedVi: 'Phụ âm mũi hai môi (Hữu thanh)',
    pairText: 'some /m/ ↔ sun /n/', pairSpeak: 'some, sun',
    mouthEn: 'Close both lips completely and let the voiced sound resonate cleanly through your nose.',
    mouthVi: 'Khép kín hai môi và để luồng âm hữu thanh ngân qua khoang mũi.',
    trapEn: 'Not closing the lips at the end of words ending in /m/ (system, time, problem), turning /m/ into /n/.',
    trapVi: 'Không khép hai môi ở cuối các từ kết thúc bằng /m/ (system, time, problem) khiến âm bị biến thành /n/.',
    exampleEn: 'Modern management systems save time and money.'
  },
  {
    id: 'pron-ipa-38', symbol: '/n/', group: 'consonants', sample: 'now',
    targetText: 'now, nature, urban',
    ipaUk: '/naʊ/ • /ˈneɪ.tʃə/ • /ˈɜː.bən/', ipaUs: '/naʊ/ • /ˈneɪ.tʃɚ/ • /ˈɝː.bən/',
    voicedEn: 'Voiced Alveolar Nasal', voicedVi: 'Phụ âm mũi đầu lưỡi (Hữu thanh)',
    pairText: 'thin /n/ ↔ thing /ŋ/', pairSpeak: 'thin, thing',
    mouthEn: 'Press your tongue tip firmly against the gum ridge behind your upper front teeth while humming through your nose.',
    mouthVi: 'Đặt đầu lưỡi áp sát vào gờ lợi sau răng cửa trên, miệng hơi mở và cho âm ngân qua mũi.',
    trapEn: 'Swallowing final /n/ in unstressed syllables like "urban", "modern", "citizen".',
    trapVi: 'Nuốt âm /n/ cuối trong các từ nhiều âm tiết như "urban", "modern", "citizen".',
    exampleEn: 'Urban planners design green spaces to protect nature.'
  },
  {
    id: 'pron-ipa-39', symbol: '/ŋ/', group: 'consonants', sample: 'sing',
    targetText: 'sing, ranking, learning',
    ipaUk: '/sɪŋ/ • /ˈræŋ.kɪŋ/ • /ˈlɜː.nɪŋ/', ipaUs: '/sɪŋ/ • /ˈræŋ.kɪŋ/ • /ˈlɝː.nɪŋ/',
    voicedEn: 'Voiced Velar Nasal', voicedVi: 'Phụ âm mũi cuống lưỡi ("ng" - Hữu thanh)',
    pairText: 'sing /ŋ/ ↔ sin /n/', pairSpeak: 'sing, sin',
    mouthEn: 'Keep the front of your tongue down, raise the back of your tongue against the soft palate, and hum through your nose with lips open.',
    mouthVi: 'Hạ đầu lưỡi xuống, nâng cuống lưỡi chạm ngạc mềm và ngân âm "ng" qua mũi (KHÔNG khép môi như tiếng Việt).',
    trapEn: 'Puffing out cheeks or closing lips like Vietnamese final "-ng" after back vowels, or adding an unwanted hard /ɡ/ at the end of "-ing".',
    trapVi: 'Khép môi phồng má như âm "-ng" tiếng Việt hoặc bật thừa âm /ɡ/ cứng ở cuối đuôi "-ing".',
    exampleEn: 'Lifelong learning improves university global rankings.'
  },
  {
    id: 'pron-ipa-40', symbol: '/h/', group: 'consonants', sample: 'hat',
    targetText: 'hat, habit, enhance',
    ipaUk: '/hæt/ • /ˈhæb.ɪt/ • /ɪnˈhɑːns/', ipaUs: '/hæt/ • /ˈhæb.ɪt/ • /ɪnˈhæns/',
    voicedEn: 'Voiceless Glottal Fricative', voicedVi: 'Phụ âm khe thanh hầu thở hơi nhẹ (Vô thanh)',
    pairText: 'hat /h/ ↔ at /æ/', pairSpeak: 'hat, at',
    mouthEn: 'Open your mouth into the shape of the following vowel and exhale a clean, frictionless breath from your throat.',
    mouthVi: 'Mở miệng theo khẩu hình nguyên âm phía sau và đẩy nhẹ luồng hơi ấm từ họng ra như khi hà hơi lên mặt kính.',
    trapEn: 'Adding harsh throat friction like Vietnamese "kh", or forgetting silent "h" in "hour, honest, vehicle".',
    trapVi: 'Khạc hơi quá mạnh ở cuống họng, hoặc đọc nhầm âm /h/ câm trong các từ "hour, honest, vehicle".',
    exampleEn: 'Healthy daily habits enhance human longevity.'
  },
  {
    id: 'pron-ipa-41', symbol: '/l/', group: 'consonants', sample: 'local',
    targetText: 'local, global, skill',
    ipaUk: '/ˈləʊ.kəl/ • /ˈɡləʊ.bəl/ • /skɪl/', ipaUs: '/ˈloʊ.kəl/ • /ˈɡloʊ.bəl/ • /skɪl/',
    voicedEn: 'Voiced Alveolar Lateral Approximant (Clear & Dark L)', voicedVi: 'Phụ âm bên đầu lưỡi (L sáng đầu từ & L tối cuối từ)',
    pairText: 'light /l/ ↔ right /r/', pairSpeak: 'light, right',
    mouthEn: 'Touch the tip of your tongue firmly behind your upper front teeth. At the end of a word (Dark L: skill, global), hold your tongue tip up so the vowel resonates.',
    mouthVi: 'Chạm đầu lưỡi lên gờ lợi sau răng cửa trên. Khi /l/ đứng cuối từ (Dark L: skill, global), phải đưa đầu lưỡi chạm lên chân răng trên để giữ âm "ồ/ờ" nhẹ.',
    trapEn: 'Completely dropping Dark /l/ at the end of syllables (making "skill" sound like "skiu" or "school" like "skoo").',
    trapVi: 'Bỏ quên không cong đầu lưỡi chạm chân răng trên ở âm /l/ cuối từ khiến "skill" bị đọc thành "sờ-kiu".',
    exampleEn: 'Local workers develop vital skills for the global market.'
  },
  {
    id: 'pron-ipa-42', symbol: '/r/', group: 'consonants', sample: 'rapid',
    targetText: 'rapid, require, rural',
    ipaUk: '/ˈræp.ɪd/ • /rɪˈkwaɪə/ • /ˈrʊə.rəl/', ipaUs: '/ˈræp.ɪd/ • /rɪˈkwaɪr/ • /ˈrʊr.əl/',
    voicedEn: 'Voiced Post-Alveolar Approximant', voicedVi: 'Phụ âm cong lưỡi tròn môi (Hữu thanh)',
    pairText: 'right /r/ ↔ light /l/', pairSpeak: 'right, light',
    mouthEn: 'Round your lips slightly forward and curl your tongue tip upward toward the roof of your mouth WITHOUT touching it.',
    mouthVi: 'Hơi chu nhẹ môi ra trước và cong đầu lưỡi hướng lên vòm miệng nhưng TUYỆT ĐỐI KHÔNG chạm vào vòm miệng (không rung lưỡi như "r" tiếng Việt).',
    trapEn: 'Trilling or tapping the tongue tip against the roof of the mouth, or confusing /r/ and /l/ in "rural".',
    trapVi: 'Đánh rung đầu lưỡi chạm lợi hoặc líu lưỡi khi gặp từ có cả /r/ và /l/ như "rural".',
    exampleEn: 'Rapid rural development requires reliable roads.'
  },
  {
    id: 'pron-ipa-43', symbol: '/w/', group: 'consonants', sample: 'world',
    targetText: 'world, aware, quality',
    ipaUk: '/wɜːld/ • /əˈweə/ • /ˈkwɒl.ə.ti/', ipaUs: '/wɝːld/ • /əˈwer/ • /ˈkwɑː.lə.t̬i/',
    voicedEn: 'Voiced Labio-Velar Approximant', voicedVi: 'Bán nguyên âm tròn môi lướt nhanh (Hữu thanh)',
    pairText: 'west /w/ ↔ vest /v/', pairSpeak: 'west, vest',
    mouthEn: 'Tightly round your lips into a small circle as if saying /uː/, then quickly glide open into the next vowel.',
    mouthVi: 'Tròn khít hai môi như khi bắt đầu phát âm /uː/ rồi mở bung nhanh sang nguyên âm đứng sau (răng trên không chạm môi dưới).',
    trapEn: 'Replacing /w/ with Vietnamese "qu/gu" or confusing /w/ and /v/.',
    trapVi: 'Đọc thành âm "g/qu" tiếng Việt (đọc "world" thành "guôn") hoặc cắn môi dưới làm lẫn sang âm /v/.',
    exampleEn: 'People around the world are aware of water quality.'
  },
  {
    id: 'pron-ipa-44', symbol: '/j/', group: 'consonants', sample: 'youth',
    targetText: 'youth, future, value',
    ipaUk: '/juːθ/ • /ˈfjuː.tʃə/ • /ˈvæl.juː/', ipaUs: '/juːθ/ • /ˈfjuː.tʃɚ/ • /ˈvæl.juː/',
    voicedEn: 'Voiced Palatal Approximant', voicedVi: 'Bán nguyên âm mặt lưỡi ("y" - Hữu thanh)',
    pairText: 'yet /j/ ↔ jet /dʒ/', pairSpeak: 'yet, jet',
    mouthEn: 'Raise the middle of your tongue close to the hard palate like a brief /iː/ and glide immediately into the following vowel without friction.',
    mouthVi: 'Nâng mặt lưỡi lên gần vòm miệng như khi bắt đầu âm /iː/ rồi lướt nhanh và êm sang nguyên âm tiếp theo.',
    trapEn: 'Adding harsh friction like /dʒ/ or Vietnamese "gi/d" at the start of "youth, year, university", or dropping /j/ in "value, future".',
    trapVi: 'Xát mạnh thành âm "d/gi" tiếng Việt hoặc bỏ quên âm đệm /j/ trong "future" (/ˈfjuː.tʃə/) và "value" (/ˈvæl.juː/).',
    exampleEn: 'Education adds immense value to the future of youth.'
  }
];

export const PRONUNCIATION_IPA_DRILLS = RAW_IPA_CHART_SPECS.map((item, idx) => ({
  id: item.id,
  type: 'ipa',
  ipaSymbol: item.symbol,
  ipaGroup: item.group,
  sampleWord: item.sample,
  targetText: item.targetText,
  ipaUk: item.ipaUk,
  ipaUs: item.ipaUs,
  syllables: item.targetText.split(',').map(w => w.trim()).join(' • '),
  stressPattern: item.symbol,
  bandLevel: idx < 20 ? '6.5' : '7.0',
  categoryEn: item.voicedEn,
  categoryVi: item.voicedVi,
  topicEn: item.group === 'monophthongs' ? 'Monophthong Vowels' : item.group === 'diphthongs' ? 'Diphthong Vowels' : 'Consonants',
  topicVi: item.group === 'monophthongs' ? 'Nguyên âm đơn' : item.group === 'diphthongs' ? 'Nguyên âm đôi' : 'Phụ âm',
  meaningEn: `IPA ${item.symbol} (${item.voicedEn}) — Practice anchor words: ${item.targetText}`,
  meaningVi: `Âm IPA ${item.symbol} (${item.voicedVi}) — Từ khóa luyện âm: ${item.targetText}`,
  minimalPair: {
    pairText: item.pairText,
    speakText: item.pairSpeak
  },
  trapEn: item.trapEn,
  trapVi: item.trapVi,
  mouthTipEn: item.mouthEn,
  mouthTipVi: item.mouthVi,
  exampleEn: item.exampleEn,
  exampleVi: item.exampleEn,
  xpReward: 15,
  requiresAuth: false
}));

