/**
 * IELTS Listening Practice: Mars Habitat Psychological Conflict (Track 26)
 * Audio hosted on Cloudflare R2:
 * https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track26-mars-crew-psychological-crisis.mp3
 * 
 * Standard Cambridge IELTS Section 3 Simulation:
 * - Part 1: Note Completion on Crew Altercation & Incident Details (Questions 1–5)
 * - Part 2: Multiple Choice on Psychological Strain & Confinement Pathology (Questions 6–10)
 */

export const track26PsychologicalCrisis = {
  id: 'ielts-listening-track26-psychological-crisis',
  title: 'IELTS Listening Practice: Mars Habitat Psychological Conflict (Track 26)',
  titleEn: 'IELTS Listening Practice: Mars Habitat Psychological Conflict (Track 26)',
  titleVi: 'Luyện đề IELTS Listening: Xung đột tâm lý trong khu sinh tồn Sao Hỏa (Track 26)',
  description: 'Bộ luyện thi IELTS Listening Section 3 học thuật: Cuộc trao đổi giữa Simon và Maria về sự cố bạo lực bất ngờ tại trạm mô phỏng Sao Hỏa ở Arizona (thành viên Joe bất ngờ tấn công Martin do hội chứng tâm lý phát sinh từ sự cô lập kéo dài trong môi trường khép kín không lối thoát).',
  descriptionEn: 'Authentic Cambridge IELTS Section 3 academic tutorial: University students Simon and Maria analyze an unexpected violent breakdown within the Arizona Mars habitat (crew member Joe assaulting Martin due to acute psychological distress and sensory confinement resulting from prolonged isolation without escape).',
  descriptionVi: 'Bộ luyện thi IELTS Listening Section 3 học thuật: Cuộc trao đổi giữa Simon và Maria về sự cố bạo lực bất ngờ tại trạm mô phỏng Sao Hỏa ở Arizona (thành viên Joe bất ngờ tấn công Martin do hội chứng tâm lý phát sinh từ sự cô lập kéo dài trong môi trường khép kín không lối thoát).',
  totalQuestions: 10,
  timeLimitMinutes: 15,
  isPublic: true,
  isCambridge: false,
  source: 'cloudflare_r2',
  audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track26-mars-crew-psychological-crisis.mp3',
  fallbackAudioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track26-mars-crew-psychological-crisis.mp3',
  parts: [
    {
      partNumber: 1,
      title: 'Part 1: Incident Breakdown & Conflict Manifestation',
      titleEn: 'Part 1: Incident Breakdown & Conflict Manifestation',
      titleVi: 'Phần 1: Diễn biến sự cố & Biểu hiện xung đột',
      context: 'Listen to university students Simon and Maria discussing the shocking news of an altercation inside the Arizona Mars isolation facility.',
      contextEn: 'Listen to university students Simon and Maria discussing the shocking news of an altercation inside the Arizona Mars isolation facility.',
      contextVi: 'Lắng nghe hai sinh viên Simon và Maria bàn luận về tin tức chấn động liên quan đến một vụ xô xát bên trong khu cách ly Sao Hỏa tại Arizona.',
      audioTimestampStart: 0,
      audioTimestampEnd: 32,
      speakers: [
        { name: 'Simon', gender: 'Male', accent: 'British' },
        { name: 'Maria', gender: 'Female', accent: 'British' }
      ],
      transcript: `[00:00] Track 26.
[00:02] Simon: Okay, so the latest from the project is that one of the people taking part, Joe, attacked another person on the team, Martin, and hit him. I really can't believe that Joe would do something like that. He's been the quietest up until now.
[00:18] Maria: Sometimes that's what happens. You think someone is okay, but it turns out that they're not. Why did he do it? Is it anything to do with personality problems, or is it just a disagreement about something?`,
      questionGroups: [
        {
          id: 'qg-t26-p1',
          type: 'form_completion',
          title: 'Questions 1–5: Incident Case File & Environmental Factors',
          titleEn: 'Questions 1–5: Incident Case File & Environmental Factors',
          titleVi: 'Câu hỏi 1–5: Hồ sơ sự cố & Các yếu tố môi trường',
          instruction: 'Complete the notes below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          instructionEn: 'Complete the notes below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          instructionVi: 'Hoàn thành các ghi chú dưới đây.\nViết KHÔNG QUÁ HAI TỪ VÀ/HOẶC MỘT SỐ cho mỗi câu trả lời.',
          headerTitle: 'ARIZONA MARS SIMULATION CONFLICT LOG',
          headerTitleEn: 'ARIZONA MARS SIMULATION CONFLICT LOG',
          headerTitleVi: 'NHẬT KÝ XUNG ĐỘT MÔ PHỎNG SAO HỎA ARIZONA',
          questions: [
            {
              id: 1,
              order: 1,
              questionText: 'Aggressor Identity: The crew member who instigated the physical confrontation was [Joe].',
              questionTextEn: 'Aggressor Identity: The crew member who instigated the physical confrontation was ................',
              questionTextVi: 'Danh tính người tấn công: Thành viên phi hành đoàn khơi mào cuộc ẩu đả là ................',
              answer: 'Joe',
              acceptableAnswers: ['Joe', 'joe'],
              explanation: 'Simon nêu rõ tên người phát động vụ tấn công: "...one of the people taking part, Joe, attacked another person..."',
              explanationEn: 'Simon identifies the perpetrator of the assault: "...one of the people taking part, Joe, attacked another person on the team..."',
              audioTimestamp: 7
            },
            {
              id: 2,
              order: 2,
              questionText: 'Victim Identity: The fellow teammate who was struck during the violent outburst was [Martin].',
              questionTextEn: 'Victim Identity: The fellow teammate who was struck during the violent outburst was ................',
              questionTextVi: 'Danh tính nạn nhân: Người đồng đội bị đánh trong vụ bộc phát bạo lực là ................',
              answer: 'Martin',
              acceptableAnswers: ['Martin', 'martin'],
              explanation: 'Simon xác nhận người bị đánh là Martin: "...attacked another person on the team, Martin, and hit him."',
              explanationEn: 'Simon states who was hit: "...attacked another person on the team, Martin, and hit him."',
              audioTimestamp: 10
            },
            {
              id: 3,
              order: 3,
              questionText: 'Prior Demeanor: Simon finds the violence astonishing because Joe had previously shown the [quietest] personality among the crew.',
              questionTextEn: 'Prior Demeanor: Simon finds the violence astonishing because Joe had previously shown the ................ personality among the crew.',
              questionTextVi: 'Tính cách trước đó: Simon cảm thấy vụ bạo lực khó tin vì trước đây Joe luôn là người ................ nhất trong nhóm.',
              answer: 'quietest',
              acceptableAnswers: ['quietest', 'most quiet'],
              explanation: 'Simon nhận định tính cách trước đó của Joe: "He\'s been the quietest up until now."',
              explanationEn: 'Simon highlights Joe\'s previous behavioral baseline: "He\'s been the quietest up until now."',
              audioTimestamp: 16
            },
            {
              id: 4,
              order: 4,
              questionText: 'Root Psychological Mechanism: The medical and psychological breakdown is primarily attributed to enduring prolonged [isolation].',
              questionTextEn: 'Root Psychological Mechanism: The medical and psychological breakdown is primarily attributed to enduring prolonged ................',
              questionTextVi: 'Cơ chế tâm lý gốc rễ: Sự suy sụp về y tế và tâm lý được quy cho việc phải chịu đựng sự ................ kéo dài.',
              answer: 'isolation',
              acceptableAnswers: ['isolation', 'being isolated'],
              explanation: 'Simon chỉ ra nguyên nhân gốc rễ là sự cô lập: "...which result from being isolated for so long."',
              explanationEn: 'Simon pinpoints the root cause: "...which result from being isolated for so long."',
              audioTimestamp: 38
            },
            {
              id: 5,
              order: 5,
              questionText: 'Environmental Vulnerability: Maria emphasizes that psychological distress becomes acute when participants experience [no escape] from confinement.',
              questionTextEn: 'Environmental Vulnerability: Maria emphasizes that psychological distress becomes acute when participants experience ................ from confinement.',
              questionTextVi: 'Yếu tố môi trường ngặt nghèo: Maria nhấn mạnh áp lực tâm lý trở nên gay gắt khi các thành viên rơi vào cảnh ................ khỏi hoàn cảnh.',
              answer: 'no escape',
              acceptableAnswers: ['no escape'],
              explanation: 'Maria nhận xét về môi trường sống kín: "...where there\'s no escape from the situation."',
              explanationEn: 'Maria highlights the claustrophobic nature of the habitat: "...where there\'s no escape from the situation."',
              audioTimestamp: 52
            }
          ]
        }
      ]
    },
    {
      partNumber: 2,
      title: 'Part 2: Confinement Pathology & Stress Attribution',
      titleEn: 'Part 2: Confinement Pathology & Stress Attribution',
      titleVi: 'Phần 2: Bệnh lý giam hãm & Phân tích căn nguyên căng thẳng',
      context: 'Listen to Maria and Simon delving deeper into the psychological implications of simulated space confinement.',
      contextEn: 'Listen to Maria and Simon delving deeper into the psychological implications of simulated space confinement.',
      contextVi: 'Lắng nghe Maria và Simon phân tích sâu hơn về những tác động tâm lý của môi trường mô phỏng giam hãm không gian.',
      audioTimestampStart: 32,
      audioTimestampEnd: 57,
      speakers: [
        { name: 'Simon', gender: 'Male', accent: 'British' },
        { name: 'Maria', gender: 'Female', accent: 'British' }
      ],
      transcript: `[00:32] Simon: Well, there are strong signs that there've been some emotional or psychological problems, which result from being isolated for so long.
[00:40] Maria: Isolation? What, so you're saying that Joe might be suffering some kind of psychological problems? Hmm, I can see how that can happen in an environment like that, where there's no escape from the situation.`,
      questionGroups: [
        {
          id: 'qg-t26-p2',
          type: 'multiple_choice',
          title: 'Questions 6–10: Behavioral Analysis & Space Psychology',
          titleEn: 'Questions 6–10: Behavioral Analysis & Space Psychology',
          titleVi: 'Câu hỏi 6–10: Phân tích hành vi & Tâm lý học không gian',
          instruction: 'Choose the correct letter, A, B, or C.',
          instructionEn: 'Choose the correct letter, A, B, or C.',
          instructionVi: 'Chọn chữ cái đúng, A, B, hoặc C.',
          questions: [
            {
              id: 6,
              order: 6,
              questionText: 'Why does Simon express extreme disbelief regarding Joe\'s violent action?',
              questionTextEn: 'Why does Simon express extreme disbelief regarding Joe\'s violent action?',
              questionTextVi: 'Vì sao Simon bày tỏ sự hoài nghi tột độ trước hành vi bạo lực của Joe?',
              options: [
                { letter: 'A', text: 'Joe had never exhibited aggressive behavior and was considered the quietest individual on the team.', textEn: 'Joe had never exhibited aggressive behavior and was considered the quietest individual on the team.', textVi: 'Joe chưa từng biểu hiện tính hung hăng và được coi là người trầm lặng nhất trong cả nhóm.' },
                { letter: 'B', text: 'Joe had signed a legally binding non-violence contract prior to entry.', textEn: 'Joe had signed a legally binding non-violence contract prior to entry.', textVi: 'Joe đã ký hợp đồng cam kết không bạo lực có tính ràng buộc pháp lý trước khi vào khu sinh tồn.' },
                { letter: 'C', text: 'Martin was Joe\'s closest family relative within the simulation.', textEn: 'Martin was Joe\'s closest family relative within the simulation.', textVi: 'Martin là người thân ruột thịt gần gũi nhất của Joe trong khu mô phỏng.' }
              ],
              correctAnswer: 'A',
              explanation: 'Simon không tin nổi vì Joe luôn trầm tĩnh: "I really can\'t believe that Joe would do something like that. He\'s been the quietest up until now."',
              explanationEn: 'Simon is taken aback because Joe was historically reserved: "I really can\'t believe that Joe would do something like that. He\'s been the quietest up until now."',
              audioTimestamp: 14
            },
            {
              id: 7,
              order: 7,
              questionText: 'What two potential explanations does Maria initially wonder about before hearing Simon\'s diagnosis?',
              questionTextEn: 'What two potential explanations does Maria initially wonder about before hearing Simon\'s diagnosis?',
              questionTextVi: 'Hai khả năng ban đầu nào mà Maria tự hỏi trước khi nghe chẩn đoán của Simon?',
              options: [
                { letter: 'A', text: 'Whether it was rooted in underlying personality flaws or a specific concrete disagreement.', textEn: 'Whether it was rooted in underlying personality flaws or a specific concrete disagreement.', textVi: 'Liệu nguyên nhân bắt nguồn từ khuyết điểm tính cách hay chỉ là một bất đồng cụ thể.' },
                { letter: 'B', text: 'Whether it was provoked by food rationing or contaminated drinking water.', textEn: 'Whether it was provoked by food rationing or contaminated drinking water.', textVi: 'Liệu vụ việc do chế độ phân phối khẩu phần ăn hay do nước uống bị nhiễm bẩn.' },
                { letter: 'C', text: 'Whether it involved athletic rivalry or sleep schedule violations.', textEn: 'Whether it involved athletic rivalry or sleep schedule violations.', textVi: 'Liệu đó là sự cạnh tranh thể lực hay vi phạm lịch trình giờ ngủ.' }
              ],
              correctAnswer: 'A',
              explanation: 'Maria đặt ra câu hỏi phân loại nguyên nhân: "Is it anything to do with personality problems, or is it just a disagreement about something?"',
              explanationEn: 'Maria initially hypothesizes between dispositional friction and situational dispute: "Is it anything to do with personality problems, or is it just a disagreement about something?"',
              audioTimestamp: 28
            },
            {
              id: 8,
              order: 8,
              questionText: 'What does Simon identify as the actual trigger for the altercation?',
              questionTextEn: 'What does Simon identify as the actual trigger for the altercation?',
              questionTextVi: 'Simon xác định đâu mới là ngòi nổ thực sự dẫn tới vụ xô xát?',
              options: [
                { letter: 'A', text: 'Emotional and psychological distress stemming directly from prolonged social isolation.', textEn: 'Emotional and psychological distress stemming directly from prolonged social isolation.', textVi: 'Khủng hoảng cảm xúc và căng thẳng tâm lý bắt nguồn trực tiếp từ việc bị cô lập xã hội kéo dài.' },
                { letter: 'B', text: 'A technical dispute regarding the calibration of solar panels.', textEn: 'A technical dispute regarding the calibration of solar panels.', textVi: 'Một tranh chấp kỹ thuật liên quan đến việc hiệu chỉnh các tấm pin mặt trời.' },
                { letter: 'C', text: 'Jealousy over unequal public media exposure in weekly television news broadcasts.', textEn: 'Jealousy over unequal public media exposure in weekly television news broadcasts.', textVi: 'Sự ghen tị do việc xuất hiện không đồng đều trên các bản tin truyền hình hàng tuần.' }
              ],
              correctAnswer: 'A',
              explanation: 'Simon nêu rõ: "...there\'ve been some emotional or psychological problems, which result from being isolated for so long."',
              explanationEn: 'Simon points to isolation-induced strain: "...there\'ve been some emotional or psychological problems, which result from being isolated for so long."',
              audioTimestamp: 36
            },
            {
              id: 9,
              order: 9,
              questionText: 'What environmental factor does Maria point to when accepting the plausibility of Joe\'s breakdown?',
              questionTextEn: 'What environmental factor does Maria point to when accepting the plausibility of Joe\'s breakdown?',
              questionTextVi: 'Yếu tố môi trường nào mà Maria chỉ ra khi đồng ý với tính hợp lý của sự suy sụp ở Joe?',
              options: [
                { letter: 'A', text: 'The complete absence of any physical or psychological exit from the confined living space.', textEn: 'The complete absence of any physical or psychological exit from the confined living space.', textVi: 'Sự vắng bóng hoàn toàn của bất kỳ lối thoát vật lý hay tâm lý nào khỏi không gian sống chật hẹp.' },
                { letter: 'B', text: 'The excessive ambient desert temperature exceeding tolerance levels.', textEn: 'The excessive ambient desert temperature exceeding tolerance levels.', textVi: 'Nhiệt độ sa mạc xung quanh quá cao vượt quá ngưỡng chịu đựng.' },
                { letter: 'C', text: 'The lack of proper recreational video entertainment equipment.', textEn: 'The lack of proper recreational video entertainment equipment.', textVi: 'Sự thiếu thốn các trang thiết bị giải trí video phù hợp.' }
              ],
              correctAnswer: 'A',
              explanation: 'Maria nhận ra bản chất khép kín không lối thoát: "...in an environment like that, where there\'s no escape from the situation."',
              explanationEn: 'Maria acknowledges the oppressive inescapable confinement: "...in an environment like that, where there\'s no escape from the situation."',
              audioTimestamp: 50
            },
            {
              id: 10,
              order: 10,
              questionText: 'What broader psychological conclusion does Maria articulate about observing individuals in stressful experiments?',
              questionTextEn: 'What broader psychological conclusion does Maria articulate about observing individuals in stressful experiments?',
              questionTextVi: 'Kết luận tâm lý học rộng hơn nào mà Maria đưa ra khi quan sát các cá nhân trong các thử nghiệm áp lực cao?',
              options: [
                { letter: 'A', text: 'An outwardly calm and healthy demeanor can mask severe deteriorating mental strain.', textEn: 'An outwardly calm and healthy demeanor can mask severe deteriorating mental strain.', textVi: 'Vẻ ngoài điềm tĩnh và bình thường có thể che giấu những áp lực tinh thần đang suy sụp nghiêm trọng bên trong.' },
                { letter: 'B', text: 'Quiet participants are inherently unsuited for scientific research.', textEn: 'Quiet participants are inherently unsuited for scientific research.', textVi: 'Những người ít nói về bản chất không phù hợp với nghiên cứu khoa học.' },
                { letter: 'C', text: 'Physical aggression is inevitable in any space mission within the first month.', textEn: 'Physical aggression is inevitable in any space mission within the first month.', textVi: 'Bạo lực thể chất là điều tất yếu trong bất kỳ chuyến bay vũ trụ nào ngay trong tháng đầu tiên.' }
              ],
              correctAnswer: 'A',
              explanation: 'Maria chiêm nghiệm: "You think someone is okay, but it turns out that they\'re not."',
              explanationEn: 'Maria reflects on deceptive outward calm: "Sometimes that\'s what happens. You think someone is okay, but it turns out that they\'re not."',
              audioTimestamp: 21
            }
          ]
        }
      ]
    }
  ]
};
