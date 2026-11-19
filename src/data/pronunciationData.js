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
 * Evaluates a user's spoken pronunciation attempt against the target drill item.
 * Computes word-by-word accuracy breakdown, IELTS Pronunciation Band (5.0 - 9.0),
 * constructive coaching feedback, and XP reward.
 */
export function evaluatePronunciationAttempt({
  targetText = '',
  spokenText = '',
  confidence = 0.88,
  itemType = 'words',
  streak = 0
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
      coachFeedbackEn: 'No target text provided.',
      coachFeedbackVi: 'Chưa có nội dung mục tiêu.'
    };
  }

  const usedSpokenIndices = new Set();

  const wordBreakdown = rawTargetWords.map((rawWord, targetIdx) => {
    const cleanTarget = normalizePhoneticWord(rawWord);
    if (!cleanTarget) {
      return {
        word: rawWord,
        cleanWord: '',
        status: 'correct',
        similarity: 1,
        spokenMatch: rawWord
      };
    }

    let bestSim = 0;
    let bestSpokenIdx = -1;

    // Search within a reasonable window around targetIdx first, then fallback to whole array
    spokenWords.forEach((sw, sIdx) => {
      if (usedSpokenIndices.has(sIdx)) return;
      const sim = computeWordSimilarity(cleanTarget, sw);
      // Slight positional proximity bonus to prevent greedy mismatch in long sentences
      const distancePenalty = Math.min(0.12, Math.abs(targetIdx - sIdx) * 0.02);
      const effectiveSim = sim - (sim === 1 ? 0 : distancePenalty);
      if (effectiveSim > bestSim) {
        bestSim = sim;
        bestSpokenIdx = sIdx;
      }
    });

    if (bestSpokenIdx !== -1 && bestSim >= 0.45) {
      usedSpokenIndices.add(bestSpokenIdx);
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
      spokenMatch: matchedWord
    };
  });

  // Compute weighted accuracy
  const avgWordSimilarity =
    wordBreakdown.reduce((sum, w) => sum + w.similarity, 0) / wordBreakdown.length;

  // Blend lexical phonetic match (82%) with acoustic STT confidence (18%)
  const safeConfidence = Math.max(0.6, Math.min(1.0, Number(confidence) || 0.88));
  const rawScore = spokenWords.length === 0
    ? 0
    : Math.round(avgWordSimilarity * 0.85 + safeConfidence * 100 * 0.15);

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

  if (overallAccuracy >= 90) {
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
