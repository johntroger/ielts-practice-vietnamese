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
 * Converts an English word into an approximate phonetic skeleton for acoustic comparison.
 * Handles silent letters, digraphs (ph->f, tion->shn, th->T, sh->S, ch->C), and double consonants.
 */
export function toPhoneticSkeleton(word) {
  const clean = normalizePhoneticWord(word);
  if (!clean) return '';
  return clean
    .replace(/^kn/, 'n')
    .replace(/^wr/, 'r')
    .replace(/^ps/, 's')
    .replace(/^wh/, 'w')
    .replace(/bt$/, 't')
    .replace(/mb$/, 'm')
    .replace(/tion$|sion$/g, 'shn')
    .replace(/tious$|cious$/g, 'shs')
    .replace(/ph/g, 'f')
    .replace(/qu/g, 'kw')
    .replace(/sh/g, 'S')
    .replace(/ch/g, 'C')
    .replace(/th/g, 'T')
    .replace(/ng/g, 'N')
    .replace(/ck/g, 'k')
    .replace(/([a-z])\1+/g, '$1');
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
 * Evaluates a user's spoken pronunciation attempt against the target drill item.
 * Layer 1 Engine: Combines Lexical Similarity + Phonetic Skeleton (Onset/Nucleus/Coda)
 * + N-Best Acoustic Hypotheses Cross-Check + Web Audio Energy Metrics.
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

  const normalizedSpoken = normalizePhoneticWord(spokenText);
  const spokenWords = normalizedSpoken ? normalizedSpoken.split(/\s+/).filter(Boolean) : [];

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

  const usedSpokenIndices = new Set();
  const codaIssues = [];

  // Flatten N-best alternative words for weak-ending detection
  const altWordSet = new Set();
  if (Array.isArray(alternatives) && alternatives.length > 1) {
    alternatives.slice(1, 5).forEach(alt => {
      normalizePhoneticWord(alt).split(/\s+/).filter(Boolean).forEach(w => altWordSet.add(w));
    });
  }

  const wordBreakdown = rawTargetWords.map((rawWord, targetIdx) => {
    const cleanTarget = normalizePhoneticWord(rawWord);
    if (!cleanTarget) {
      return {
        word: rawWord,
        cleanWord: '',
        status: 'correct',
        similarity: 100,
        spokenMatch: rawWord,
        missingCoda: false
      };
    }

    let bestSim = 0;
    let bestSpokenIdx = -1;
    let bestMissingCoda = false;

    spokenWords.forEach((sw, sIdx) => {
      if (usedSpokenIndices.has(sIdx)) return;
      const { score, missingCoda } = computePhoneticOnsetNucleusCoda(cleanTarget, sw);
      const distancePenalty = Math.min(0.12, Math.abs(targetIdx - sIdx) * 0.02);
      const effectiveSim = score - (score === 1 ? 0 : distancePenalty);
      if (effectiveSim > bestSim) {
        bestSim = score;
        bestSpokenIdx = sIdx;
        bestMissingCoda = missingCoda;
      }
    });

    if (bestSpokenIdx !== -1 && bestSim >= 0.45) {
      usedSpokenIndices.add(bestSpokenIdx);
    }

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

    const matchedWord = bestSpokenIdx !== -1 ? spokenWords[bestSpokenIdx] : '';

    return {
      word: rawWord,
      cleanWord: cleanTarget,
      status,
      similarity: Math.round(bestSim * 100),
      spokenMatch: matchedWord,
      missingCoda: bestMissingCoda || nBestWeakEnding
    };
  });

  // Compute weighted accuracy
  const avgWordSimilarity =
    wordBreakdown.reduce((sum, w) => sum + w.similarity, 0) / wordBreakdown.length;

  // Blend lexical phonetic match (85%) with acoustic STT confidence (15%)
  const safeConfidence = Math.max(0.6, Math.min(1.0, Number(confidence) || 0.88));
  let rawScore = spokenWords.length === 0
    ? 0
    : Math.round(avgWordSimilarity * 0.85 + safeConfidence * 100 * 0.15);

  // Strict single-word gate: if a single word is mispronounced (< 95% match, e.g. phenomena vs phenomenon),
  // prevent high STT confidence from inflating it past the 80% passing threshold.
  if (spokenWords.length > 0 && rawTargetWords.length === 1 && avgWordSimilarity < 95) {
    rawScore = Math.min(76, Math.round(avgWordSimilarity * 0.9));
  }

  // Penalize excessive filler/extra words beyond target length
  const allowedSlack = rawTargetWords.length === 1 ? 0 : 1;
  const extraWordsCount = Math.max(0, spokenWords.length - rawTargetWords.length - allowedSlack);
  if (extraWordsCount > 0 && rawScore > 0) {
    rawScore -= Math.min(20, extraWordsCount * 8);
  }

  // Acoustic Prosody / Stress Energy check (if Web Audio Analyser metrics available)
  let lowDynamicEnergy = false;
  if (acousticMetrics && acousticMetrics.sampleCount > 4) {
    if (acousticMetrics.dynamicRange < 6 && rawTargetWords.length >= 4 && rawScore > 75) {
      rawScore -= 4;
      lowDynamicEnergy = true;
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
    coachFeedbackEn = `Clear core pronunciation, but watch out for weak ending consonants (coda) on: "${codaList}".`;
    coachFeedbackVi = `Âm chính khá tốt, nhưng chú ý bật rõ phụ âm cuối (âm đuôi) ở từ: "${codaList}".`;
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
