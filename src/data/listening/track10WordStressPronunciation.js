/**
 * IELTS Listening Practice: Word Stress, Syllable Patterns & Orthographic Spelling Lab (Track 10)
 * Audio hosted on Cloudflare R2:
 * https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track10-word-stress-and-pronunciation.mp3
 * 
 * Standard Cambridge IELTS Simulation:
 * - Part 1: Primary Syllable Stress & Phonetic Identification (Items 1–8)
 * - Part 2: Acoustic Spelling & Morphological Patterns (Items 9–16)
 */

export const track10WordStressPronunciation = {
  id: 'ielts-listening-track10-word-stress',
  title: 'IELTS Listening Practice: Word Stress & Pronunciation Lab (Track 10)',
  description: 'Phòng luyện phát âm và trọng âm chuyên sâu 16 từ vựng học thuật cốt lõi trong chủ đề Đô thị & Nhà ở (accommodation, architecture, inhabitants, residential, environment, geography, temperature, scenery). Giúp người học làm chủ bẫy trọng âm và chính tả trong bài thi IELTS Listening.',
  totalQuestions: 16,
  timeLimitMinutes: 15,
  isPublic: true,
  isCambridge: false,
  source: 'cloudflare_r2',
  audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track10-word-stress-and-pronunciation.mp3',
  fallbackAudioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track10-word-stress-and-pronunciation.mp3',
  parts: [
    {
      partNumber: 1,
      title: 'Part 1: Primary Syllable Stress & Transcription (Words 1–8)',
      context: 'Listen to 8 isolated vocabulary items pronounced by native speakers and write down the word heard alongside identifying the primary stress.',
      audioTimestampStart: 0,
      audioTimestampEnd: 38,
      speakers: [
        { name: 'Female Speaker', gender: 'Female', accent: 'British' },
        { name: 'Male Speaker', gender: 'Male', accent: 'British' }
      ],
      transcript: `[00:00] Track 10.
[00:01] 1. Apartment
[00:05] 2. Accommodation
[00:09] 3. Architecture
[00:14] 4. Construction
[00:18] 5. Escalator
[00:23] 6. Inhabitants
[00:28] 7. Monument
[00:32] 8. Museum`,
      questionGroups: [
        {
          id: 'qg-t10-p1',
          type: 'sentence_completion',
          title: 'Questions 1–8: Single-Word Orthographic Spelling',
          instruction: 'Write the EXACT word you hear spoken for each number.\nWrite ONLY ONE WORD for each answer.',
          headerTitle: 'URBAN VOCABULARY AUDIT (WORDS 1–8)',
          questions: [
            {
              id: 1,
              order: 1,
              questionText: 'Item 1 (Housing): ................',
              prefixText: 'Item 1 (Housing):',
              suffixText: '',
              answer: 'apartment',
              acceptableAnswers: ['apartment', 'Apartment'],
              evidenceQuote: '1. Apartment',
              evidenceTimestamp: 2,
              explanation: 'Từ phát âm là "apartment" (/əˈpɑːt.mənt/), trọng âm rơi vào âm tiết thứ 2 (PART).'
            },
            {
              id: 2,
              order: 2,
              questionText: 'Item 2 (Lodging): ................',
              prefixText: 'Item 2 (Lodging):',
              suffixText: '',
              answer: 'accommodation',
              acceptableAnswers: ['accommodation', 'Accommodation'],
              evidenceQuote: '2. Accommodation',
              evidenceTimestamp: 6,
              explanation: 'Từ phát âm là "accommodation" (/əˌkɒm.əˈdeɪ.ʃən/), có 2 chữ "c" và 2 chữ "m", trọng âm chính rơi vào âm tiết thứ 4 (DA).'
            },
            {
              id: 3,
              order: 3,
              questionText: 'Item 3 (Design): ................',
              prefixText: 'Item 3 (Design):',
              suffixText: '',
              answer: 'architecture',
              acceptableAnswers: ['architecture', 'Architecture'],
              evidenceQuote: '3. Architecture',
              evidenceTimestamp: 10,
              explanation: 'Từ phát âm là "architecture" (/ˈɑː.kɪ.tek.tʃər/), trọng âm rơi vào âm tiết thứ 1 (AR).'
            },
            {
              id: 4,
              order: 4,
              questionText: 'Item 4 (Building): ................',
              prefixText: 'Item 4 (Building):',
              suffixText: '',
              answer: 'construction',
              acceptableAnswers: ['construction', 'Construction'],
              evidenceQuote: '4. Construction',
              evidenceTimestamp: 15,
              explanation: 'Từ phát âm là "construction" (/kənˈstrʌk.ʃən/), trọng âm rơi vào âm tiết thứ 2 (STRUC).'
            },
            {
              id: 5,
              order: 5,
              questionText: 'Item 5 (Transit): ................',
              prefixText: 'Item 5 (Transit):',
              suffixText: '',
              answer: 'escalator',
              acceptableAnswers: ['escalator', 'Escalator'],
              evidenceQuote: '5. Escalator',
              evidenceTimestamp: 19,
              explanation: 'Từ phát âm là "escalator" (/ˈes.kə.leɪ.tər/), trọng âm rơi vào âm tiết thứ 1 (ES).'
            },
            {
              id: 6,
              order: 6,
              questionText: 'Item 6 (Citizens): ................',
              prefixText: 'Item 6 (Citizens):',
              suffixText: '',
              answer: 'inhabitants',
              acceptableAnswers: ['inhabitants', 'Inhabitants', 'inhabitant'],
              evidenceQuote: '6. Inhabitants',
              evidenceTimestamp: 24,
              explanation: 'Từ phát âm là "inhabitants" (/ɪnˈhæb.ɪ.tənts/), trọng âm rơi vào âm tiết thứ 2 (HAB).'
            },
            {
              id: 7,
              order: 7,
              questionText: 'Item 7 (Civic): ................',
              prefixText: 'Item 7 (Civic):',
              suffixText: '',
              answer: 'monument',
              acceptableAnswers: ['monument', 'Monument'],
              evidenceQuote: '7. Monument',
              evidenceTimestamp: 29,
              explanation: 'Từ phát âm là "monument" (/ˈmɒn.jə.mənt/), trọng âm rơi vào âm tiết thứ 1 (MON).'
            },
            {
              id: 8,
              order: 8,
              questionText: 'Item 8 (Culture): ................',
              prefixText: 'Item 8 (Culture):',
              suffixText: '',
              answer: 'museum',
              acceptableAnswers: ['museum', 'Museum'],
              evidenceQuote: '8. Museum',
              evidenceTimestamp: 33,
              explanation: 'Từ phát âm là "museum" (/mjuːˈziː.əm/), trọng âm rơi vào âm tiết thứ 2 (SE).'
            }
          ]
        }
      ]
    },
    {
      partNumber: 2,
      title: 'Part 2: Geography, Environment & Regional Lexis (Words 9–16)',
      context: 'Listen to the remaining 8 vocabulary items pronounced by native speakers and complete the word transcriptions.',
      audioTimestampStart: 38,
      audioTimestampEnd: 75,
      speakers: [
        { name: 'Female Speaker', gender: 'Female', accent: 'British' },
        { name: 'Male Speaker', gender: 'Male', accent: 'British' }
      ],
      transcript: `[00:37] 9. Residential
[00:41] 10. Stadium
[00:46] 11. Countryside
[00:50] 12. Environment
[00:55] 13. Geography
[01:00] 14. Regional
[01:04] 15. Temperature
[01:09] 16. Scenery`,
      questionGroups: [
        {
          id: 'qg-t10-p2',
          type: 'sentence_completion',
          title: 'Questions 9–16: Advanced Pronunciation & Spelling Transcription',
          instruction: 'Write the EXACT word you hear spoken for each number.\nWrite ONLY ONE WORD for each answer.',
          headerTitle: 'GEOGRAPHY & ENVIRONMENT (WORDS 9–16)',
          questions: [
            {
              id: 9,
              order: 9,
              questionText: 'Item 9 (Zoning): ................',
              prefixText: 'Item 9 (Zoning):',
              suffixText: '',
              answer: 'residential',
              acceptableAnswers: ['residential', 'Residential'],
              evidenceQuote: '9. Residential',
              evidenceTimestamp: 38,
              explanation: 'Từ phát âm là "residential" (/ˌrez.ɪˈden.ʃəl/), trọng âm rơi vào âm tiết thứ 3 (DEN).'
            },
            {
              id: 10,
              order: 10,
              questionText: 'Item 10 (Sports): ................',
              prefixText: 'Item 10 (Sports):',
              suffixText: '',
              answer: 'stadium',
              acceptableAnswers: ['stadium', 'Stadium'],
              evidenceQuote: '10. Stadium',
              evidenceTimestamp: 42,
              explanation: 'Từ phát âm là "stadium" (/ˈsteɪ.di.əm/), trọng âm rơi vào âm tiết thứ 1 (STA).'
            },
            {
              id: 11,
              order: 11,
              questionText: 'Item 11 (Rural): ................',
              prefixText: 'Item 11 (Rural):',
              suffixText: '',
              answer: 'countryside',
              acceptableAnswers: ['countryside', 'Countryside'],
              evidenceQuote: '11. Countryside',
              evidenceTimestamp: 47,
              explanation: 'Từ phát âm là "countryside" (/ˈkʌn.tri.saɪd/), danh từ ghép có trọng âm rơi vào âm tiết thứ 1 (COUN).'
            },
            {
              id: 12,
              order: 12,
              questionText: 'Item 12 (Ecology): ................',
              prefixText: 'Item 12 (Ecology):',
              suffixText: '',
              answer: 'environment',
              acceptableAnswers: ['environment', 'Environment'],
              evidenceQuote: '12. Environment',
              evidenceTimestamp: 51,
              explanation: 'Từ phát âm là "environment" (/ɪnˈvaɪ.rən.mənt/), có chữ "n" câm trước "m", trọng âm rơi vào âm tiết thứ 2 (VI).'
            },
            {
              id: 13,
              order: 13,
              questionText: 'Item 13 (Landscape): ................',
              prefixText: 'Item 13 (Landscape):',
              suffixText: '',
              answer: 'geography',
              acceptableAnswers: ['geography', 'Geography'],
              evidenceQuote: '13. Geography',
              evidenceTimestamp: 56,
              explanation: 'Từ phát âm là "geography" (/dʒiˈɒɡ.rə.fi/), đuôi "-phy" đẩy trọng âm về âm tiết thứ 2 (OG).'
            },
            {
              id: 14,
              order: 14,
              questionText: 'Item 14 (Local): ................',
              prefixText: 'Item 14 (Local):',
              suffixText: '',
              answer: 'regional',
              acceptableAnswers: ['regional', 'Regional'],
              evidenceQuote: '14. Regional',
              evidenceTimestamp: 61,
              explanation: 'Từ phát âm là "regional" (/ˈriː.dʒən.əl/), trọng âm rơi vào âm tiết thứ 1 (RE).'
            },
            {
              id: 15,
              order: 15,
              questionText: 'Item 15 (Climate): ................',
              prefixText: 'Item 15 (Climate):',
              suffixText: '',
              answer: 'temperature',
              acceptableAnswers: ['temperature', 'Temperature'],
              evidenceQuote: '15. Temperature',
              evidenceTimestamp: 65,
              explanation: 'Từ phát âm là "temperature" (/ˈtem.prə.tʃər/), trọng âm rơi vào âm tiết thứ 1 (TEM).'
            },
            {
              id: 16,
              order: 16,
              questionText: 'Item 16 (Views): ................',
              prefixText: 'Item 16 (Views):',
              suffixText: '',
              answer: 'scenery',
              acceptableAnswers: ['scenery', 'Scenery'],
              evidenceQuote: '16. Scenery',
              evidenceTimestamp: 70,
              explanation: 'Từ phát âm là "scenery" (/ˈsiː.nər.i/), có chữ "c" câm sau "s", trọng âm rơi vào âm tiết thứ 1 (SCEN).'
            }
          ]
        }
      ]
    }
  ]
};
