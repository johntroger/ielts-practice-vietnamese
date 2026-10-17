/**
 * IELTS Listening Practice: Comparing Space Missions & Project Decisions (Track 24)
 * Audio hosted on Cloudflare R2:
 * https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track24-space-missions-comparison.mp3
 * 
 * Standard Cambridge IELTS Section 3 Simulation:
 * - Part 1: Note Completion on Planetary Expedition Research Options (Questions 1–5)
 * - Part 2: Multiple Choice on Academic Feasibility, Crew Nature & Research Priority (Questions 6–10)
 */

export const track24SpaceComparison = {
  id: 'ielts-listening-track24-space-comparison',
  title: 'IELTS Listening Practice: Comparing Space Missions & Project Decisions (Track 24)',
  titleEn: 'IELTS Listening Practice: Comparing Space Missions & Project Decisions (Track 24)',
  titleVi: 'Luyện đề IELTS Listening: So sánh các dự án không gian & Ra quyết định nghiên cứu (Track 24)',
  description: 'Bộ luyện thi IELTS Listening Section 3 học thuật: Cuộc thảo luận giữa giảng viên hướng dẫn Dr. Thornton và hai sinh viên Simon, Maria nhằm đánh giá các phương án nghiên cứu khoa học vũ trụ (sứ mệnh Sao Diêm Vương Pluto, mô phỏng sinh tồn Sao Hỏa tại sa mạc Arizona, hay dự án thám hiểm Mặt Trăng tự hành của Trung Quốc).',
  descriptionEn: 'Authentic Cambridge IELTS Section 3 academic tutorial: University students Simon and Maria confer with their academic supervisor Dr. Thornton to evaluate three prospective space science projects (the Pluto flyby, the Arizona desert Mars human isolation simulation, or the Chinese automated lunar expedition).',
  descriptionVi: 'Bộ luyện thi IELTS Listening Section 3 học thuật: Cuộc thảo luận giữa giảng viên hướng dẫn Dr. Thornton và hai sinh viên Simon, Maria nhằm đánh giá các phương án nghiên cứu khoa học vũ trụ (sứ mệnh Sao Diêm Vương Pluto, mô phỏng sinh tồn Sao Hỏa tại sa mạc Arizona, hay dự án thám hiểm Mặt Trăng tự hành của Trung Quốc).',
  totalQuestions: 10,
  timeLimitMinutes: 15,
  isPublic: true,
  isCambridge: false,
  source: 'cloudflare_r2',
  audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track24-space-missions-comparison.mp3',
  fallbackAudioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track24-space-missions-comparison.mp3',
  parts: [
    {
      partNumber: 1,
      title: 'Part 1: Planetary Expedition Project Evaluation',
      titleEn: 'Part 1: Planetary Expedition Project Evaluation',
      titleVi: 'Phần 1: Đánh giá đề tài nghiên cứu thám hiểm hành tinh',
      context: 'Listen to university students Simon and Maria discussing space research options with their tutor Dr. Thornton.',
      contextEn: 'Listen to university students Simon and Maria discussing space research options with their tutor Dr. Thornton.',
      contextVi: 'Lắng nghe hai sinh viên Simon và Maria thảo luận về các lựa chọn đề tài nghiên cứu không gian cùng giảng viên hướng dẫn Dr. Thornton.',
      audioTimestampStart: 0,
      audioTimestampEnd: 101,
      speakers: [
        { name: 'Dr. Thornton', gender: 'Female', accent: 'British' },
        { name: 'Maria', gender: 'Female', accent: 'British' },
        { name: 'Simon', gender: 'Male', accent: 'British' }
      ],
      transcript: `[00:00] Track 24.
[00:02] Dr. Thornton: That would be ideal. Six months is just right for you. You could follow their progress and how the project develops. From what I know, the Pluto project is already a success, but with the Mars one, you can assess how successful it is as it progresses, and you can write it up for your final report.
[00:23] Maria: Hmm, yeah. That sounds promising.
[00:26] Simon: Okay, but before we decide, I'd just like to mention one more. I heard that the Chinese are planning an expedition to the Moon.
[00:35] Maria: What? Another man or woman on the Moon? That's already been done. I don't think the Moon's particularly interesting these days.
[00:44] Dr. Thornton: Simon has a point. I mean, the Chinese are coming up now and they've got some new ideas. I don't think they're sending any astronauts, I think it's just an expedition with robots and machines to find the best place to start a colony.
[01:01] Maria: Yes, but I don't think that's particularly interesting. I mean, no one has ever seen Pluto close up, and no one has tried to go to Mars, so I think they'd be more interesting expeditions to do.
[01:14] Simon: You have a point. Perhaps it would be better to focus on one of the other two.
[01:20] Dr. Thornton: Okay. If you ask me, I'd prefer to see how a group of people get along living together in a difficult situation, like they'll be doing in Arizona in preparation for their trip. I think you'd get far more out of that. But the final decision is yours. What do you think?`,
      questionGroups: [
        {
          id: 'qg-t24-p1',
          type: 'form_completion',
          title: 'Questions 1–5: Space Research Project Comparison Table',
          titleEn: 'Questions 1–5: Space Research Project Comparison Table',
          titleVi: 'Câu hỏi 1–5: Bảng so sánh các dự án nghiên cứu vũ trụ',
          instruction: 'Complete the notes below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          instructionEn: 'Complete the notes below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          instructionVi: 'Hoàn thành các ghi chú dưới đây.\nViết KHÔNG QUÁ HAI TỪ VÀ/HOẶC MỘT SỐ cho mỗi câu trả lời.',
          headerTitle: 'SPACE RESEARCH PROPOSAL PROFILES',
          headerTitleEn: 'SPACE RESEARCH PROPOSAL PROFILES',
          headerTitleVi: 'HỒ SƠ CÁC ĐỀ XUẤT ĐỀ TÀI VŨ TRỤ',
          questions: [
            {
              id: 1,
              order: 1,
              questionText: 'Timeline Feasibility: The Mars preparation project provides a duration of [six months / 6 months] which Dr. Thornton considers ideal for observing project progress.',
              questionTextEn: 'Timeline Feasibility: The Mars preparation project provides a duration of ................ which Dr. Thornton considers ideal for observing project progress.',
              questionTextVi: 'Tính khả thi về thời gian: Dự án chuẩn bị cho Sao Hỏa có thời lượng là ................ mà Dr. Thornton đánh giá là lý tưởng để theo dõi tiến độ.',
              answer: 'six months',
              acceptableAnswers: ['six months', '6 months'],
              explanation: 'Dr. Thornton nhận xét thời gian 6 tháng là vừa vặn: "Six months is just right for you. You could follow their progress..."',
              explanationEn: 'Dr. Thornton specifies the duration: "Six months is just right for you. You could follow their progress and how the project develops."',
              audioTimestamp: 4
            },
            {
              id: 2,
              order: 2,
              questionText: 'Pluto Expedition Status: Unlike an ongoing mission, the Pluto venture is already acknowledged as an established [success].',
              questionTextEn: 'Pluto Expedition Status: Unlike an ongoing mission, the Pluto venture is already acknowledged as an established ................',
              questionTextVi: 'Hiện trạng sứ mệnh Pluto: Khác với một nhiệm vụ đang tiếp diễn, dự án Pluto đã được công nhận là một ................',
              answer: 'success',
              acceptableAnswers: ['success', 'a success'],
              explanation: 'Dr. Thornton chỉ ra sứ mệnh Pluto đã thành công: "From what I know, the Pluto project is already a success..."',
              explanationEn: 'Dr. Thornton highlights that Pluto is completed: "From what I know, the Pluto project is already a success..."',
              audioTimestamp: 13
            },
            {
              id: 3,
              order: 3,
              questionText: 'Chinese Lunar Mission Technology: Rather than deploying astronauts, the Chinese expedition will be conducted exclusively using [robots and machines / robots, machines].',
              questionTextEn: 'Chinese Lunar Mission Technology: Rather than deploying astronauts, the Chinese expedition will be conducted exclusively using ................',
              questionTextVi: 'Công nghệ sứ mệnh Mặt Trăng của Trung Quốc: Thay vì đưa phi hành gia, nhiệm vụ này sẽ được thực hiện hoàn toàn bằng ................',
              answer: 'robots and machines',
              acceptableAnswers: ['robots and machines', 'robots, machines', 'machines and robots'],
              explanation: 'Dr. Thornton làm rõ: "I don\'t think they\'re sending any astronauts, I think it\'s just an expedition with robots and machines..."',
              explanationEn: 'Dr. Thornton clarifies: "I don\'t think they\'re sending any astronauts, I think it\'s just an expedition with robots and machines..."',
              audioTimestamp: 55
            },
            {
              id: 4,
              order: 4,
              questionText: 'Lunar Mission Goal: The automated equipment seeks to identify an optimum location to establish a future [colony].',
              questionTextEn: 'Lunar Mission Goal: The automated equipment seeks to identify an optimum location to establish a future ................',
              questionTextVi: 'Mục tiêu sứ mệnh Mặt Trăng: Các thiết bị tự hành tìm kiếm địa điểm tối ưu để thành lập một ................ trong tương lai.',
              answer: 'colony',
              acceptableAnswers: ['colony', 'human colony'],
              explanation: 'Mục đích nhiệm vụ là tìm kiếm vị trí lập thuộc địa/khu định cư: "...to find the best place to start a colony."',
              explanationEn: 'The tutor states the core purpose: "...to find the best place to start a colony."',
              audioTimestamp: 59
            },
            {
              id: 5,
              order: 5,
              questionText: 'Simulated Environment: The isolation trial examining how crew members cope with challenging cohabitation is being held in [Arizona].',
              questionTextEn: 'Simulated Environment: The isolation trial examining how crew members cope with challenging cohabitation is being held in ................',
              questionTextVi: 'Môi trường mô phỏng: Thử nghiệm cách ly khảo sát cách các thành viên sống chung trong điều kiện khắc nghiệt đang được tổ chức tại bang ................',
              answer: 'Arizona',
              acceptableAnswers: ['Arizona', 'arizona'],
              explanation: 'Dr. Thornton đề cập đến thử nghiệm sống chung tại sa mạc Arizona: "...like they\'ll be doing in Arizona in preparation for their trip."',
              explanationEn: 'Dr. Thornton specifies the simulation location: "...like they\'ll be doing in Arizona in preparation for their trip."',
              audioTimestamp: 87
            }
          ]
        }
      ]
    },
    {
      partNumber: 2,
      title: 'Part 2: Academic Deliberation & Decision Making',
      titleEn: 'Part 2: Academic Deliberation & Decision Making',
      titleVi: 'Phần 2: Thảo luận học thuật & Ra quyết định lựa chọn đề tài',
      context: 'Listen to the remaining conversation where the students debate the scientific novelty of each mission and receive their tutor\'s recommendation.',
      contextEn: 'Listen to the remaining conversation where the students debate the scientific novelty of each mission and receive their tutor\'s recommendation.',
      contextVi: 'Lắng nghe phần tiếp theo của cuộc đối thoại khi các sinh viên tranh luận về tính mới lạ khoa học của từng sứ mệnh và nhận lời khuyên của giảng viên.',
      audioTimestampStart: 15,
      audioTimestampEnd: 101,
      speakers: [
        { name: 'Dr. Thornton', gender: 'Female', accent: 'British' },
        { name: 'Maria', gender: 'Female', accent: 'British' },
        { name: 'Simon', gender: 'Male', accent: 'British' }
      ],
      transcript: `[00:15] Dr. Thornton: ...but with the Mars one, you can assess how successful it is as it progresses, and you can write it up for your final report.
[00:23] Maria: Hmm, yeah. That sounds promising.
[00:26] Simon: Okay, but before we decide, I'd just like to mention one more. I heard that the Chinese are planning an expedition to the Moon.
[00:35] Maria: What? Another man or woman on the Moon? That's already been done. I don't think the Moon's particularly interesting these days.
[00:44] Dr. Thornton: Simon has a point. I mean, the Chinese are coming up now and they've got some new ideas. I don't think they're sending any astronauts, I think it's just an expedition with robots and machines to find the best place to start a colony.
[01:01] Maria: Yes, but I don't think that's particularly interesting. I mean, no one has ever seen Pluto close up, and no one has tried to go to Mars, so I think they'd be more interesting expeditions to do.
[01:14] Simon: You have a point. Perhaps it would be better to focus on one of the other two.
[01:20] Dr. Thornton: Okay. If you ask me, I'd prefer to see how a group of people get along living together in a difficult situation, like they'll be doing in Arizona in preparation for their trip. I think you'd get far more out of that. But the final decision is yours. What do you think?`,
      questionGroups: [
        {
          id: 'qg-t24-p2',
          type: 'multiple_choice',
          title: 'Questions 6–10: Academic Feasibility & Research Decisions',
          titleEn: 'Questions 6–10: Academic Feasibility & Research Decisions',
          titleVi: 'Câu hỏi 6–10: Tính khả thi học thuật & Ra quyết định nghiên cứu',
          instruction: 'Choose the correct letter, A, B, or C.',
          instructionEn: 'Choose the correct letter, A, B, or C.',
          instructionVi: 'Chọn chữ cái đúng, A, B, hoặc C.',
          questions: [
            {
              id: 6,
              order: 6,
              questionText: 'Why does Dr. Thornton advise choosing an ongoing initiative like the Mars project over the Pluto mission?',
              questionTextEn: 'Why does Dr. Thornton advise choosing an ongoing initiative like the Mars project over the Pluto mission?',
              questionTextVi: 'Tại sao Dr. Thornton khuyên nên chọn một dự án đang diễn ra như dự án Sao Hỏa thay vì sứ mệnh Pluto?',
              options: [
                { letter: 'A', text: 'It allows students to evaluate outcomes in real time as the project unfolds.', textEn: 'It allows students to evaluate outcomes in real time as the project unfolds.', textVi: 'Nó cho phép sinh viên đánh giá kết quả theo thời gian thực khi dự án đang diễn ra.' },
                { letter: 'B', text: 'It involves significantly lower logistical costs for data acquisition.', textEn: 'It involves significantly lower logistical costs for data acquisition.', textVi: 'Chi phí hậu cần để thu thập dữ liệu thấp hơn đáng kể.' },
                { letter: 'C', text: 'It has already received extensive academic peer-review approval.', textEn: 'It has already received extensive academic peer-review approval.', textVi: 'Nó đã nhận được sự phê duyệt bình duyệt học thuật rộng rãi.' }
              ],
              correctAnswer: 'A',
              explanation: 'Dr. Thornton giải thích: "...with the Mars one, you can assess how successful it is as it progresses, and you can write it up for your final report."',
              explanationEn: 'Dr. Thornton explicitly emphasizes real-time evaluation: "...with the Mars one, you can assess how successful it is as it progresses, and you can write it up for your final report."',
              audioTimestamp: 16
            },
            {
              id: 7,
              order: 7,
              questionText: 'What is Maria\'s initial objection when Simon suggests the Chinese lunar expedition?',
              questionTextEn: 'What is Maria\'s initial objection when Simon suggests the Chinese lunar expedition?',
              questionTextVi: 'Ý kiến phản bác ban đầu của Maria là gì khi Simon đề xuất sứ mệnh thám hiểm Mặt Trăng của Trung Quốc?',
              options: [
                { letter: 'A', text: 'She believes human exploration of the Moon has already been accomplished and lacks novelty.', textEn: 'She believes human exploration of the Moon has already been accomplished and lacks novelty.', textVi: 'Cô cho rằng việc con người khám phá Mặt Trăng đã từng được làm và không còn tính mới mẻ.' },
                { letter: 'B', text: 'She doubts the technological competence of robotic navigation rovers.', textEn: 'She doubts the technological competence of robotic navigation rovers.', textVi: 'Cô hoài nghi năng lực công nghệ của các robot tự hành.' },
                { letter: 'C', text: 'She fears that mission data will remain confidential and inaccessible.', textEn: 'She fears that mission data will remain confidential and inaccessible.', textVi: 'Cô lo sợ dữ liệu nhiệm vụ sẽ được bảo mật và không thể tiếp cận.' }
              ],
              correctAnswer: 'A',
              explanation: 'Maria thốt lên phản đối vì Mặt Trăng đã có người đặt chân tới: "Another man or woman on the Moon? That\'s already been done. I don\'t think the Moon\'s particularly interesting these days."',
              explanationEn: 'Maria immediately objects due to lack of novelty: "What? Another man or woman on the Moon? That\'s already been done. I don\'t think the Moon\'s particularly interesting these days."',
              audioTimestamp: 35
            },
            {
              id: 8,
              order: 8,
              questionText: 'How does Dr. Thornton correct Maria\'s misconception about the Chinese lunar program?',
              questionTextEn: 'How does Dr. Thornton correct Maria\'s misconception about the Chinese lunar program?',
              questionTextVi: 'Dr. Thornton đính chính nhận thức sai của Maria về chương trình Mặt Trăng của Trung Quốc như thế nào?',
              options: [
                { letter: 'A', text: 'By noting that it is an unmanned robotic venture rather than a crewed flight.', textEn: 'By noting that it is an unmanned robotic venture rather than a crewed flight.', textVi: 'Bằng cách chỉ ra rằng đây là dự án robot không người lái chứ không phải chuyến bay chở người.' },
                { letter: 'B', text: 'By emphasizing that it is an international coalition backed by several nations.', textEn: 'By emphasizing that it is an international coalition backed by several nations.', textVi: 'Bằng cách nhấn mạnh đây là liên minh quốc tế được nhiều quốc gia hậu thuẫn.' },
                { letter: 'C', text: 'By revealing that it will deploy advanced nuclear-powered propulsion.', textEn: 'By revealing that it will deploy advanced nuclear-powered propulsion.', textVi: 'Bằng cách tiết lộ tàu sẽ sử dụng động cơ đẩy hạt nhân tiên tiến.' }
              ],
              correctAnswer: 'A',
              explanation: 'Dr. Thornton giải thích đoàn thám hiểm không cử phi hành gia mà dùng robot và máy móc: "I don\'t think they\'re sending any astronauts, I think it\'s just an expedition with robots and machines..."',
              explanationEn: 'Dr. Thornton clarifies crew status: "I don\'t think they\'re sending any astronauts, I think it\'s just an expedition with robots and machines to find the best place to start a colony."',
              audioTimestamp: 51
            },
            {
              id: 9,
              order: 9,
              questionText: 'Why does Maria maintain that Pluto and Mars are intellectually superior topics to the Moon?',
              questionTextEn: 'Why does Maria maintain that Pluto and Mars are intellectually superior topics to the Moon?',
              questionTextVi: 'Vì sao Maria vẫn giữ quan điểm rằng Pluto và Mars là đề tài học thuật hấp dẫn hơn Mặt Trăng?',
              options: [
                { letter: 'A', text: 'Both targets involve unprecedented exploration that humans have never achieved up close.', textEn: 'Both targets involve unprecedented exploration that humans have never achieved up close.', textVi: 'Cả hai mục tiêu đều là sự thám hiểm chưa từng có tiền lệ mà con người chưa từng tiếp cận cự ly gần.' },
                { letter: 'B', text: 'They offer higher chances of discovering extraterrestrial microbiological life.', textEn: 'They offer higher chances of discovering extraterrestrial microbiological life.', textVi: 'Chúng có khả năng cao hơn trong việc phát hiện vi sinh vật ngoài hành tinh.' },
                { letter: 'C', text: 'Academic literature on these two planets is far more plentiful.', textEn: 'Academic literature on these two planets is far more plentiful.', textVi: 'Tài liệu học thuật về hai hành tinh này phong phú hơn nhiều.' }
              ],
              correctAnswer: 'A',
              explanation: 'Maria nhấn mạnh tính tiên phong chưa từng có: "...no one has ever seen Pluto close up, and no one has tried to go to Mars, so I think they\'d be more interesting expeditions to do."',
              explanationEn: 'Maria highlights the unprecedented nature: "...no one has ever seen Pluto close up, and no one has tried to go to Mars, so I think they\'d be more interesting expeditions to do."',
              audioTimestamp: 65
            },
            {
              id: 10,
              order: 10,
              questionText: 'Which aspect of the Arizona simulation does Dr. Thornton personally recommend studying?',
              questionTextEn: 'Which aspect of the Arizona simulation does Dr. Thornton personally recommend studying?',
              questionTextVi: 'Khía cạnh nào của mô phỏng tại Arizona mà Dr. Thornton đích thân khuyên sinh viên nên nghiên cứu?',
              options: [
                { letter: 'A', text: 'Interpersonal relationships and behavioral dynamics among individuals confined under stressful conditions.', textEn: 'Interpersonal relationships and behavioral dynamics among individuals confined under stressful conditions.', textVi: 'Mối quan hệ ứng xử và động lực hành vi giữa những cá nhân sống chung trong hoàn cảnh ngặt nghèo.' },
                { letter: 'B', text: 'The technological resilience of the artificial oxygen generating equipment.', textEn: 'The technological resilience of the artificial oxygen generating equipment.', textVi: 'Độ bền công nghệ của các thiết bị tạo oxy nhân tạo.' },
                { letter: 'C', text: 'The biological impact of solar radiation on astronauts during space journeys.', textEn: 'The biological impact of solar radiation on astronauts during space journeys.', textVi: 'Tác động sinh học của bức xạ mặt trời đối với phi hành gia trong không gian.' }
              ],
              correctAnswer: 'A',
              explanation: 'Dr. Thornton khuyên nên tập trung vào khía cạnh tâm lý nhóm sống chung: "...I\'d prefer to see how a group of people get along living together in a difficult situation, like they\'ll be doing in Arizona in preparation for their trip."',
              explanationEn: 'Dr. Thornton pinpoints team dynamics: "...I\'d prefer to see how a group of people get along living together in a difficult situation, like they\'ll be doing in Arizona in preparation for their trip. I think you\'d get far more out of that."',
              audioTimestamp: 82
            }
          ]
        }
      ]
    }
  ]
};
