/**
 * IELTS Listening Practice: Environmental Engineer & Psychological Isolation (Track 27)
 * Audio hosted on Cloudflare R2:
 * https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track27-environmental-engineer-isolation.mp3
 * 
 * Standard Cambridge IELTS Section 3 Simulation:
 * - Part 1: Note Completion on Academic Psychology & Habitat Sustainability (Questions 1–5)
 * - Part 2: Multiple Choice on Crew Confinement & Vital Environmental Engineering (Questions 6–10)
 */

export const track27EnvironmentalEngineer = {
  id: 'ielts-listening-track27-environmental-engineer',
  title: 'IELTS Listening Practice: Environmental Engineer & Psychological Isolation (Track 27)',
  titleEn: 'IELTS Listening Practice: Environmental Engineer & Psychological Isolation (Track 27)',
  titleVi: 'Luyện đề IELTS Listening: Kỹ sư môi trường & Tâm lý học cách ly (Track 27)',
  description: 'Bộ luyện thi IELTS Listening Section 3 học thuật: Cuộc thảo luận giữa Tiến sĩ Thornton, Simon và Maria về tâm lý học cách ly trong trạm mô phỏng Sao Hỏa ở Arizona, tầm quan trọng sống còn của kỹ sư môi trường Joe và bài toán xử lý khủng hoảng nhân sự khi hệ thống sinh tồn phụ thuộc hoàn toàn vào anh.',
  descriptionEn: 'Authentic Cambridge IELTS Section 3 academic tutorial: Dr. Thornton, Simon, and Maria discuss the psychological implications of long-term isolation in the Arizona Mars project, evaluating why environmental engineer Joe is irreplaceable despite an emotional altercation because habitat life support hinges entirely upon his technical expertise.',
  descriptionVi: 'Bộ luyện thi IELTS Listening Section 3 học thuật: Cuộc thảo luận giữa Tiến sĩ Thornton, Simon và Maria về tâm lý học cách ly trong trạm mô phỏng Sao Hỏa ở Arizona, tầm quan trọng sống còn của kỹ sư môi trường Joe và bài toán xử lý khủng hoảng nhân sự khi hệ thống sinh tồn phụ thuộc hoàn toàn vào anh.',
  totalQuestions: 10,
  timeLimitMinutes: 15,
  isPublic: true,
  isCambridge: false,
  source: 'cloudflare_r2',
  audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track27-environmental-engineer-isolation.mp3',
  fallbackAudioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track27-environmental-engineer-isolation.mp3',
  parts: [
    {
      partNumber: 1,
      title: 'Part 1: Research Perspectives & Isolation Framework',
      titleEn: 'Part 1: Research Perspectives & Isolation Framework',
      titleVi: 'Phần 1: Góc nhìn nghiên cứu & Khuôn khổ cách ly',
      context: 'Listen to university tutor Dr. Thornton and students Simon and Maria exploring the psychological dynamics of isolation and the scientific reality of the Arizona Mars simulation.',
      contextEn: 'Listen to university tutor Dr. Thornton and students Simon and Maria exploring the psychological dynamics of isolation and the scientific reality of the Arizona Mars simulation.',
      contextVi: 'Lắng nghe giảng viên hướng dẫn Tiến sĩ Thornton và hai sinh viên Simon cùng Maria trao đổi về cơ chế tâm lý học cách ly và bản chất khoa học của dự án mô phỏng tại Arizona.',
      audioTimestampStart: 0,
      audioTimestampEnd: 65,
      speakers: [
        { name: 'Dr. Thornton', gender: 'Female', accent: 'British' },
        { name: 'Simon', gender: 'Male', accent: 'British' },
        { name: 'Maria', gender: 'Female', accent: 'British' }
      ],
      transcript: `[00:00] Track 27.
[00:02] Dr. Thornton: Well, as a psychology tutor, I find that really interesting. Many types of people participate in projects studying the effects of isolation. We all know that one of the main issues with a project like this is how people will get on when they are locked away together for such a long time. It can produce all kinds of psychological and emotional problems. That's what I'm particularly interested in, and one of the reasons why I wanted you to do this particular project.
[00:34] Simon: Me too. That will be one of the most important things to come out of this project: how people can control their emotions and feelings over a long time when they can't get away from each other.
[00:45] Maria: True, but we have to remember that this is a science project and not some soap opera or television series with lots of silly people locked up in a big house or something.`,
      questionGroups: [
        {
          id: 'qg-t27-p1',
          type: 'form_completion',
          title: 'Questions 1–5: Academic Research Notes & Crew Dynamics',
          titleEn: 'Questions 1–5: Academic Research Notes & Crew Dynamics',
          titleVi: 'Câu hỏi 1–5: Ghi chú nghiên cứu học thuật & Động lực học nhóm',
          instruction: 'Complete the notes below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          instructionEn: 'Complete the notes below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          instructionVi: 'Hoàn thành các ghi chú dưới đây.\nViết KHÔNG QUÁ HAI TỪ VÀ/HOẶC MỘT SỐ cho mỗi câu trả lời.',
          headerTitle: 'ARIZONA MARS RESEARCH SYNOPSIS',
          headerTitleEn: 'ARIZONA MARS RESEARCH SYNOPSIS',
          headerTitleVi: 'TÓM TẮT NGHIÊN CỨU DỰ ÁN SAO HỎA ARIZONA',
          questions: [
            {
              id: 1,
              order: 1,
              type: 'form_completion',
              prefix: "Dr. Thornton's academic vantage point: Specializes as a",
              prefixEn: "Dr. Thornton's academic vantage point: Specializes as a",
              prefixVi: 'Góc nhìn học thuật của Tiến sĩ Thornton: Đóng vai trò là giảng viên',
              suffix: 'tutor investigating human behavioral responses.',
              suffixEn: 'tutor investigating human behavioral responses.',
              suffixVi: 'nghiên cứu phản ứng hành vi của con người.',
              answer: 'psychology',
              acceptableAnswers: ['psychology'],
              wordLimit: 2,
              questionText: "Dr. Thornton's academic vantage point: Specializes as a [psychology] tutor investigating human behavioral responses.",
              questionTextEn: "Dr. Thornton's academic vantage point: Specializes as a ......... tutor investigating human behavioral responses.",
              questionTextVi: 'Góc nhìn học thuật của Tiến sĩ Thornton: Đóng vai trò là giảng viên ......... nghiên cứu phản ứng hành vi của con người.',
              explanation: 'Tiến sĩ Thornton tự giới thiệu vai trò chuyên môn của mình ngay phần mở đầu: "as a psychology tutor, I find that really interesting".',
              explanationEn: 'Direct factual retrieval: Dr. Thornton explicitly describes her academic position as "a psychology tutor".',
              audioTimestamp: 4
            },
            {
              id: 2,
              order: 2,
              type: 'form_completion',
              prefix: 'Core operational issue: Assessing how personnel interact when',
              prefixEn: 'Core operational issue: Assessing how personnel interact when',
              prefixVi: 'Thách thức vận hành cốt lõi: Đánh giá cách các thành viên hòa hợp khi bị',
              suffix: 'together for extended periods.',
              suffixEn: 'together for extended periods.',
              suffixVi: 'cùng nhau trong suốt một thời gian dài.',
              answer: 'locked away',
              acceptableAnswers: ['locked away', 'locked'],
              wordLimit: 2,
              questionText: 'Core operational issue: Assessing how personnel interact when [locked away] together for extended periods.',
              questionTextEn: 'Core operational issue: Assessing how personnel interact when ......... together for extended periods.',
              questionTextVi: 'Thách thức vận hành cốt lõi: Đánh giá cách các thành viên hòa hợp khi bị ......... cùng nhau trong suốt một thời gian dài.',
              explanation: 'Tiến sĩ Thornton xác định vấn đề trọng tâm là cách mọi người hòa hợp khi bị giam giữ/cách ly cùng nhau: "how people will get on when they are locked away together for such a long time".',
              explanationEn: 'Locational phrase retrieval: Dr. Thornton highlights "how people will get on when they are locked away together".',
              audioTimestamp: 19
            },
            {
              id: 3,
              order: 3,
              type: 'form_completion',
              prefix: 'Research integrity distinction: Must not be trivialized as a sensationalist',
              prefixEn: 'Research integrity distinction: Must not be trivialized as a sensationalist',
              prefixVi: 'Phân định tính khoa học nghiêm túc: Tuyệt đối không được tầm thường hóa như một bộ phim',
              suffix: 'or broadcast reality program.',
              suffixEn: 'or broadcast reality program.',
              suffixVi: 'truyền hình giật gân hay chương trình thực tế giải trí.',
              answer: 'soap opera',
              acceptableAnswers: ['soap opera'],
              wordLimit: 2,
              questionText: 'Research integrity distinction: Must not be trivialized as a sensationalist [soap opera] or broadcast reality program.',
              questionTextEn: 'Research integrity distinction: Must not be trivialized as a sensationalist ......... or broadcast reality program.',
              questionTextVi: 'Phân định tính khoa học nghiêm túc: Tuyệt đối không được tầm thường hóa như một bộ phim ......... truyền hình giật gân hay chương trình thực tế giải trí.',
              explanation: 'Maria nhấn mạnh dự án là một nghiên cứu khoa học chứ không phải phim truyền hình giật gân rẻ tiền ("not some soap opera or television series").',
              explanationEn: 'Comparative distinction: Maria emphasizes that this is a rigorous science project, "not some soap opera or television series".',
              audioTimestamp: 51
            },
            {
              id: 4,
              order: 4,
              type: 'form_completion',
              prefix: 'Positive psychological milestone: First severe outburst of anger was delayed until after',
              prefixEn: 'Positive psychological milestone: First severe outburst of anger was delayed until after',
              prefixVi: 'Dấu mốc tâm lý tích cực: Đợt bùng nổ tức giận nghiêm trọng đầu tiên đã được kiềm chế đến tận sau',
              suffix: 'of confinement.',
              suffixEn: 'of confinement.',
              suffixVi: 'cách ly trong môi trường giam giữ.',
              answer: 'three months',
              acceptableAnswers: ['three months', '3 months'],
              wordLimit: 2,
              questionText: 'Positive psychological milestone: First severe outburst of anger was delayed until after [three months] of confinement.',
              questionTextEn: 'Positive psychological milestone: First severe outburst of anger was delayed until after ......... of confinement.',
              questionTextVi: 'Dấu mốc tâm lý tích cực: Đợt bùng nổ tức giận nghiêm trọng đầu tiên đã được kiềm chế đến tận sau ......... cách ly trong môi trường giam giữ.',
              explanation: 'Tiến sĩ Thornton chỉ ra điều tích cực là trong 3 tháng đầu tiên mới chỉ có đúng một người nổi giận: "the first time someone has got really angry in the first three months".',
              explanationEn: 'Numerical/temporal duration: Dr. Thornton views as positive that anger only flared after "the first three months".',
              audioTimestamp: 110
            },
            {
              id: 5,
              order: 5,
              type: 'form_completion',
              prefix: "Joe's indispensable technical appointment: Serves as the team's vital",
              prefixEn: "Joe's indispensable technical appointment: Serves as the team's vital",
              prefixVi: 'Vai trò kỹ thuật không thể thay thế của Joe: Đảm nhận vị trí',
              suffix: 'governing life support.',
              suffixEn: 'governing life support.',
              suffixVi: 'then chốt điều hành toàn bộ hệ thống sinh quyển.',
              answer: 'environmental engineer',
              acceptableAnswers: ['environmental engineer', 'engineer'],
              wordLimit: 2,
              questionText: "Joe's indispensable technical appointment: Serves as the team's vital [environmental engineer] governing life support.",
              questionTextEn: "Joe's indispensable technical appointment: Serves as the team's vital ......... governing life support.",
              questionTextVi: 'Vai trò kỹ thuật không thể thay thế của Joe: Đảm nhận vị trí ......... then chốt điều hành toàn bộ hệ thống sinh quyển.',
              explanation: 'Simon giải thích Joe không thể bị loại khỏi trạm vì anh là kỹ sư môi trường phụ trách hệ sinh thái tòa nhà: "as the environmental engineer, Joe is an essential member of the team".',
              explanationEn: 'Occupational title: Simon identifies Joe specifically as "the environmental engineer".',
              audioTimestamp: 124
            }
          ]
        }
      ]
    },
    {
      partNumber: 2,
      title: 'Part 2: Confinement Pressures & Critical Habitat Systems',
      titleEn: 'Part 2: Confinement Pressures & Critical Habitat Systems',
      titleVi: 'Phần 2: Áp lực phòng giam & Hệ thống sinh tồn thiết yếu',
      context: 'Listen to the continuation of the discussion as Simon, Maria, and Dr. Thornton analyze the technical dependency on Joe and how environmental risks mandate resolving internal crew tension.',
      contextEn: 'Listen to the continuation of the discussion as Simon, Maria, and Dr. Thornton analyze the technical dependency on Joe and how environmental risks mandate resolving internal crew tension.',
      contextVi: 'Tiếp tục lắng nghe cuộc thảo luận khi Simon, Maria và Tiến sĩ Thornton phân tích sự phụ thuộc kỹ thuật vào Joe và các rủi ro sinh tồn buộc phi hành đoàn phải tự giải quyết xung đột.',
      audioTimestampStart: 56,
      audioTimestampEnd: 113,
      speakers: [
        { name: 'Dr. Thornton', gender: 'Female', accent: 'British' },
        { name: 'Simon', gender: 'Male', accent: 'British' },
        { name: 'Maria', gender: 'Female', accent: 'British' }
      ],
      transcript: `[00:56] Dr. Thornton: I can see what both of you are saying, but there are always going to be problems like these, so it's not surprising when they happen. In fact, this is the first time someone has got really angry in the first three months, so I think that's quite a positive thing.
[01:14] Maria: So what do you think will happen? Will they make him leave?
[01:17] Simon: I don't think they can. It's all part of the program, and anyway, as the environmental engineer, Joe is an essential member of the team. If he left, then the whole environment of the building would go wrong. So I think they'll just have to work the situation out. Remember last month when the ventilation system broke down? They almost lost all their fresh air. He only had a couple of hours to fix it, and he managed to do it.
[01:45] Dr. Thornton: I'm sure they'll work it out. So, what else have you found out?`,
      questionGroups: [
        {
          id: 'qg-t27-p2',
          type: 'multiple_choice',
          title: 'Questions 6–10: Multiple Choice Analysis',
          titleEn: 'Questions 6–10: Multiple Choice Analysis',
          titleVi: 'Câu hỏi 6–10: Trắc nghiệm phân tích đa phương án',
          instruction: 'Choose the correct letter, A, B, or C.',
          instructionEn: 'Choose the correct letter, A, B, or C.',
          instructionVi: 'Chọn chữ cái chính xác, A, B, hoặc C.',
          questions: [
            {
              id: 6,
              order: 6,
              type: 'multiple_choice',
              questionText: "What constitutes Dr. Thornton's primary academic curiosity regarding the simulation?",
              questionTextEn: "What constitutes Dr. Thornton's primary academic curiosity regarding the simulation?",
              questionTextVi: 'Điều gì cấu thành sự tò mò học thuật lớn nhất của Tiến sĩ Thornton đối với dự án mô phỏng?',
              options: [
                { letter: 'A', text: 'The psychological and emotional problems provoked by prolonged shared confinement', textEn: 'The psychological and emotional problems provoked by prolonged shared confinement', textVi: 'Các vấn đề tâm lý và cảm xúc phát sinh do việc bị giam giữ chung kéo dài' },
                { letter: 'B', text: 'The structural stress limits of subterranean habitat dome composites', textEn: 'The structural stress limits of subterranean habitat dome composites', textVi: 'Giới hạn chịu lực cấu trúc của vật liệu vòm trạm dưới lòng đất' },
                { letter: 'C', text: 'The mathematical distribution of caloric energy in hydroponic produce', textEn: 'The mathematical distribution of caloric energy in hydroponic produce', textVi: 'Sự phân bố năng lượng calo theo công thức toán học từ nông sản thủy canh' }
              ],
              answer: 'A',
              correctAnswer: 'A',
              explanation: 'Tiến sĩ Thornton khẳng định bà đặc biệt quan tâm đến các vấn đề cảm xúc và tâm lý khi con người bị giam giữ lâu ngày: "It can produce all kinds of psychological and emotional problems. That\'s what I\'m particularly interested in".',
              explanationEn: 'Direct acoustic correlation: Dr. Thornton states that prolonged isolation produces "all kinds of psychological and emotional problems. That\'s what I\'m particularly interested in".',
              audioTimestamp: 25
            },
            {
              id: 7,
              order: 7,
              type: 'multiple_choice',
              questionText: 'What key insight does Simon highlight as the most vital outcome from observing the crew?',
              questionTextEn: 'What key insight does Simon highlight as the most vital outcome from observing the crew?',
              questionTextVi: 'Thông tin cốt lõi nào được Simon nhấn mạnh là kết quả quan trọng nhất thu được từ việc quan sát đội ngũ?',
              options: [
                { letter: 'A', text: 'How individuals regulate their internal emotions when escape is impossible', textEn: 'How individuals regulate their internal emotions when escape is impossible', textVi: 'Cách các cá nhân điều hòa cảm xúc nội tâm khi không thể rời đi hay trốn thoát' },
                { letter: 'B', text: 'How software automation minimizes friction between differing nationalities', textEn: 'How software automation minimizes friction between differing nationalities', textVi: 'Cách tự động hóa phần mềm giảm thiểu xung đột giữa các quốc tịch khác nhau' },
                { letter: 'C', text: 'How physical athletic exercise intervals alleviate sleep deprivation', textEn: 'How physical athletic exercise intervals alleviate sleep deprivation', textVi: 'Cách các khoảng thời gian tập thể dục làm thuyên giảm tình trạng thiếu ngủ' }
              ],
              answer: 'A',
              correctAnswer: 'A',
              explanation: 'Simon cho rằng phát hiện quan trọng nhất là cách mọi người kiểm soát cảm xúc khi không thể tránh mặt nhau: "how people can control their emotions and feelings over a long time when they can\'t get away from each other".',
              explanationEn: 'Simon specifies: "That will be one of the most important things... how people can control their emotions and feelings over a long time when they can\'t get away from each other."',
              audioTimestamp: 41
            },
            {
              id: 8,
              order: 8,
              type: 'multiple_choice',
              questionText: 'Why does Dr. Thornton view the interpersonal altercation as a positive development rather than a catastrophe?',
              questionTextEn: 'Why does Dr. Thornton view the interpersonal altercation as a positive development rather than a catastrophe?',
              questionTextVi: 'Tại sao Tiến sĩ Thornton lại đánh giá vụ xô xát là một dấu hiệu tích cực thay vì một thảm họa?',
              options: [
                { letter: 'A', text: 'It took three whole months before anyone exhibited severe anger inside the station', textEn: 'It took three whole months before anyone exhibited severe anger inside the station', textVi: 'Phải mất đến tận 3 tháng trọn vẹn mới xuất hiện người đầu tiên thực sự nổi giận' },
                { letter: 'B', text: 'Both participants promptly signed formal reconciliation statements', textEn: 'Both participants promptly signed formal reconciliation statements', textVi: 'Cả hai thành viên đã nhanh chóng ký cam kết hòa giải chính thức' },
                { letter: 'C', text: 'The altercation occurred within an area equipped with medical emergency monitors', textEn: 'The altercation occurred within an area equipped with medical emergency monitors', textVi: 'Vụ ẩu đả diễn ra tại khu vực có lắp đặt thiết bị giám sát y tế cấp cứu' }
              ],
              answer: 'A',
              correctAnswer: 'A',
              explanation: 'Tiến sĩ Thornton lý giải điều này là tích cực vì phải sau 3 tháng đầu mới có người bùng nổ tức giận: "this is the first time someone has got really angry in the first three months, so I think that\'s quite a positive thing".',
              explanationEn: 'Dr. Thornton reasons that enduring three months prior to the first major flare-up is evidence of commendable baseline resilience.',
              audioTimestamp: 109
            },
            {
              id: 9,
              order: 9,
              type: 'multiple_choice',
              questionText: "Why is it virtually impossible for mission directors to dismiss Joe from the facility?",
              questionTextEn: "Why is it virtually impossible for mission directors to dismiss Joe from the facility?",
              questionTextVi: 'Tại sao ban chỉ huy nhiệm vụ hầu như không thể trục xuất Joe ra khỏi cơ sở?',
              options: [
                { letter: 'A', text: "The entire building's ecological and life-support stability relies upon his role", textEn: "The entire building's ecological and life-support stability relies upon his role", textVi: 'Sự ổn định sinh quyển và hỗ trợ sinh tồn của cả tòa nhà phụ thuộc vào vai trò của anh' },
                { letter: 'B', text: 'He is the sole person authorized to operate external communications', textEn: 'He is the sole person authorized to operate external communications', textVi: 'Anh là người duy nhất được cấp phép vận hành hệ thống thông tin liên lạc ra ngoài' },
                { letter: 'C', text: 'Expulsion would breach the municipal labor laws of the state of Arizona', textEn: 'Expulsion would breach the municipal labor laws of the state of Arizona', textVi: 'Việc trục xuất sẽ vi phạm luật lao động hiện hành của bang Arizona' }
              ],
              answer: 'A',
              correctAnswer: 'A',
              explanation: 'Simon giải thích nếu Joe rời đi thì toàn bộ môi trường sống trong tòa nhà sẽ hỏng: "If he left, then the whole environment of the building would go wrong. So I think they\'ll just have to work the situation out".',
              explanationEn: 'Functional dependency: Simon warns that without Joe, "the whole environment of the building would go wrong".',
              audioTimestamp: 128
            },
            {
              id: 10,
              order: 10,
              type: 'multiple_choice',
              questionText: 'What past critical malfunction proved Joe had exceptional emergency engineering skills?',
              questionTextEn: 'What past critical malfunction proved Joe had exceptional emergency engineering skills?',
              questionTextVi: 'Sự cố nguy cấp nào trong quá khứ đã chứng minh Joe sở hữu kỹ năng kỹ thuật xử lý khẩn cấp xuất sắc?',
              options: [
                { letter: 'A', text: 'He repaired the failed ventilation network within hours to avoid fresh air deprivation', textEn: 'He repaired the failed ventilation network within hours to avoid fresh air deprivation', textVi: 'Anh đã sửa chữa hệ thống thông gió hỏng chỉ trong vài giờ để cứu trạm khỏi nguy cơ cạn kiệt khí tươi' },
                { letter: 'B', text: 'He synthesized emergency potable water after the primary filter froze', textEn: 'He synthesized emergency potable water after the primary filter froze', textVi: 'Anh đã điều chế nước uống khẩn cấp sau khi bộ lọc chính bị đóng băng' },
                { letter: 'C', text: 'He restored power after desert lightning severed the primary solar grid line', textEn: 'He restored power after desert lightning severed the primary solar grid line', textVi: 'Anh đã khôi phục điện sau khi sét sa mạc đánh đứt đường dây điện mặt trời chính' }
              ],
              answer: 'A',
              correctAnswer: 'A',
              explanation: 'Simon nhắc lại sự cố tháng trước khi hệ thống thông gió hỏng ("ventilation system broke down") và suýt mất hết không khí sạch, Joe đã sửa xong chỉ trong vài tiếng ("only had a couple of hours to fix it, and he managed to do it").',
              explanationEn: 'Simon recalls the ventilation system failure where crew members "almost lost all their fresh air" and Joe resolved it in "a couple of hours".',
              audioTimestamp: 137
            }
          ]
        }
      ]
    }
  ]
};
