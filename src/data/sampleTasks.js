import { PROCESS_AND_MAP_TASKS } from './processAndMapTasks.js';

export const INITIAL_TASKS = [
  {
    id: 't2-ai-workplace-2025',
    taskNumber: 2,
    type: 'opinion',
    topic: 'tech',
    title: 'Artificial Intelligence and Future Employment',
    prompt: 'Some people believe that artificial intelligence (AI) will replace human jobs to such an extent that it will cause widespread unemployment and economic distress. Others argue that AI will create new industries and enhance human productivity.\n\nTo what extent do you agree or disagree?',
    minWords: 250,
    timeLimit: 40,
    keywords: ['Artificial intelligence', 'automation', 'redundancy', 'productivity', 'job creation', 'workforce disruption'],
    outline: {
      introduction: 'Paraphrase the prompt & clear thesis: While AI may disrupt traditional roles, it will ultimately foster new job categories and boost economic efficiency.',
      body1: 'Acknowledge short-term risks: Routine manual and clerical jobs (data entry, manufacturing) face obsolescence, causing transitional friction for low-skilled workers.',
      body2: 'Present counter-arguments & benefits: Emergence of tech-driven vocations (AI prompt engineering, robotics maintenance), shift toward creative/strategic human skills, improved healthcare/scientific research.',
      conclusion: 'Restate thesis: Governments must invest in reskilling; AI is an augmentative tool rather than a catastrophic replacement.'
    },
    modelAnswer: `The relentless advancement of artificial intelligence (AI) has sparked intense debate regarding its implications for the global workforce. While some commentators foresee catastrophic levels of unemployment resulting from automation, I firmly believe that AI will ultimately catalyze novel industries and augment human capabilities rather than cause irreversible joblessness.

Admittedly, the rapid adoption of algorithmic systems poses tangible threats to specific employment sectors. Routine, predictable responsibilities—ranging from assembly-line manufacturing to data entry and basic administrative roles—can be executed by automated programs with greater precision and substantially lower operating costs. Consequently, vulnerable demographics, particularly low-skilled laborers who lack technical versatility, risk sudden obsolescence. If institutional support and educational retraining fail to keep pace with technological disruption, short-term economic friction and localized unemployment spikes appear inevitable.

Nevertheless, historical precedent demonstrates that industrial revolutions consistently generate more employment opportunities than they extinguish. The proliferation of AI is creating entirely unprecedented vocational niches, including machine learning engineering, algorithm ethics auditing, and prompt engineering. Furthermore, by automating mundane, repetitive workflows, intelligent software liberates human professionals to concentrate on tasks requiring high-level critical thinking, emotional intelligence, and inventive design—attributes that algorithms cannot authentically replicate. In fields such as healthcare and environmental management, AI acts as an intellectual multiplier, accelerating diagnostic accuracy and scientific breakthroughs.

In conclusion, although the transition towards an AI-dominated economy will undoubtedly displace workers in susceptible professions, it does not spell the demise of human labor. Provided that governments and corporations proactively invest in comprehensive reskilling initiatives, artificial intelligence will serve as a powerful engine for economic expansion and productivity enhancement.`,
    vocabularyHighlights: [
      { word: 'catalyze novel industries', meaning: 'thúc đẩy các ngành công nghiệp mới phát triển' },
      { word: 'augment human capabilities', meaning: 'gia tăng và bổ trợ cho năng lực con người' },
      { word: 'routine, predictable responsibilities', meaning: 'các công việc lặp đi lặp lại và dễ đoán' },
      { word: 'sudden obsolescence', meaning: 'sự lỗi thời đột ngột' },
      { word: 'historical precedent', meaning: 'tiền lệ lịch sử' },
      { word: 'intellectual multiplier', meaning: 'đòn bẩy khuếch đại trí tuệ' },
      { word: 'reskilling initiatives', meaning: 'các sáng kiến đào tạo lại kỹ năng' }
    ]
  },
  {
    id: 't1-renewable-energy-chart',
    taskNumber: 1,
    type: 'line',
    topic: 'env',
    title: 'Share of Electricity Generation from Renewable Sources (2010 - 2024)',
    prompt: 'The chart below shows the proportion of total electricity generated from renewable energy sources in four European countries between 2010 and 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    minWords: 150,
    timeLimit: 20,
    keywords: ['Renewable sources', 'electricity generation', 'Germany', 'Spain', 'UK', 'Denmark', 'upward trend', 'fluctuation'],
    chartData: {
      type: 'line',
      labels: ['2010', '2012', '2014', '2016', '2018', '2020', '2022', '2024'],
      datasets: [
        {
          label: 'Denmark (%)',
          data: [32, 41, 48, 55, 62, 70, 78, 85],
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
        },
        {
          label: 'Germany (%)',
          data: [17, 23, 27, 32, 38, 45, 47, 52],
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
        },
        {
          label: 'Spain (%)',
          data: [35, 30, 38, 36, 40, 43, 45, 50],
          borderColor: '#F59E0B',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
        },
        {
          label: 'UK (%)',
          data: [7, 12, 19, 24, 33, 40, 42, 48],
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
        },
      ]
    },
    outline: {
      introduction: 'Paraphrase the prompt (proportion of green electricity produced in 4 nations over 14 years).',
      overview: 'Highlight Denmark as the clear leader throughout; all nations experienced upward trajectories; the UK recorded the steepest surge.',
      body1: 'Detail Denmark and Germany: Denmark started at 32% and climbed steadily to 85%; Germany rose steadily from 17% to 52%.',
      body2: 'Detail Spain and UK: Spain fluctuated initially before reaching 50%; UK started lowest at 7% but grew almost sevenfold to 48%.'
    },
    modelAnswer: `The line graph illustrates the percentage of electricity produced from renewable energy alternatives across Denmark, Germany, Spain, and the United Kingdom from 2010 to 2024.

Overall, it is readily apparent that all four countries witnessed significant upward trends in renewable electricity output over the 14-year timeframe. Furthermore, Denmark maintained an undisputed dominance throughout, whereas the UK demonstrated the most dramatic proportional expansion.

In 2010, Denmark already generated the second-highest share of renewable power at approximately 32%, quickly surpassing Spain to lead the chart. By 2024, Danish renewable electricity production had surged progressively to reach an impressive peak of 85%. Meanwhile, Germany commenced at 17% and followed a consistently ascending trajectory, ultimately breaking the half-mark threshold at 52% in the final year.

Turning to Spain and the UK, Spain originally stood at the forefront in 2010 with 35%. Despite minor fluctuations between 2012 and 2016, Spain maintained gradual progress to finish at exactly 50%. In striking contrast, the United Kingdom accounted for a meager 7% at the outset. However, through aggressive adoption, the UK experienced exponential growth, nearly matching Spain and Germany by closing at 48% in 2024.`,
    vocabularyHighlights: [
      { word: 'witnessed significant upward trends', meaning: 'chứng kiến xu hướng tăng trưởng rõ rệt' },
      { word: 'undisputed dominance', meaning: 'sự thống trị không thể bàn cãi' },
      { word: 'dramatic proportional expansion', meaning: 'sự tăng trưởng tỷ lệ ấn tượng' },
      { word: 'ascending trajectory', meaning: 'quỹ đạo đi lên liên tục' },
      { word: 'meager', meaning: 'ít ỏi, khiêm tốn' },
      { word: 'exponential growth', meaning: 'sự tăng trưởng nhảy vọt' }
    ]
  },
  {
    id: 't2-education-free-university',
    taskNumber: 2,
    type: 'discussion',
    topic: 'edu',
    title: 'Free University Education for All Students',
    prompt: 'Some people argue that tertiary education should be fully funded by the government for all citizens. Others believe that students should bear the cost themselves because higher education primarily benefits the individual.\n\nDiscuss both views and give your own opinion.',
    minWords: 250,
    timeLimit: 40,
    keywords: ['Tertiary education', 'tuition fees', 'state subsidy', 'social mobility', 'personal investment', 'economic burden'],
    outline: {
      introduction: 'Introduce the debate on higher education tuition and state your position (balanced approach / partial subsidy).',
      body1: 'Arguments for free tuition: equal opportunities, social mobility, cultivating a highly skilled workforce that elevates national GDP.',
      body2: 'Arguments for tuition fees: personal career payoff, avoiding unsustainable strain on taxpayers, risk of degree devaluation.',
      conclusion: 'Conclude that merit-based scholarships combined with income-contingent loans offer a fairer compromise.'
    },
    modelAnswer: `The debate over whether university tuition should be completely subsidized by the state or funded independently by attendees has gained substantial traction. While proponents argue that free tertiary education democratizes social mobility and fosters national innovation, opponents contend that the primary return on investment accrues to the individual student. In my assessment, although governments should guarantee access for disadvantaged demographics, fully state-funded tuition places an unsustainable burden on public expenditure.

On the one hand, universal funding advocates maintain that higher education constitutes a public good rather than an exclusive privilege. When university access is contingent purely on academic merit rather than socioeconomic background, talented individuals from underprivileged households can break intergenerational cycles of poverty. Moreover, an educated populace elevates civic engagement, spurs scientific research, and furnishes the national economy with specialized human capital. European nations like Norway and Germany demonstrate that public investment in university infrastructure yields substantial long-term tax revenues by broadening the high-income bracket.

Conversely, detractors present compelling economic rationale regarding fiscal responsibility. A college degree fundamentally functions as a private asset that dramatically magnifies an individual’s lifetime earning potential compared to non-graduates. Expecting the broader taxpaying public—many of whom did not attend university themselves—to underwrite this lucrative career advancement can be perceived as socially regressive. Furthermore, completely abolishing tuition can lead to budgetary bottlenecks, compelling universities to compromise on pedagogical quality, research facilities, and instructor compensation.

In conclusion, while eliminating financial barriers for high-achieving, underprivileged candidates is a social imperative, offering indiscriminate free tuition to all students is fiscally imprudent. A pragmatic equilibrium involves state-sponsored scholarships and income-contingent loans, ensuring equitable opportunity without exhausting public treasuries.`,
    vocabularyHighlights: [
      { word: 'democratizes social mobility', meaning: 'bình đẳng hóa cơ hội dịch chuyển xã hội' },
      { word: 'socioeconomic background', meaning: 'bối cảnh kinh tế - xã hội' },
      { word: 'intergenerational cycles of poverty', meaning: 'vòng luẩn quẩn đói nghèo qua các thế hệ' },
      { word: 'specialized human capital', meaning: 'nguồn nhân lực có trình độ chuyên môn cao' },
      { word: 'socially regressive', meaning: 'bất công / đi lùi về mặt xã hội' },
      { word: 'pragmatic equilibrium', meaning: 'trạng thái cân bằng mang tính thực tiễn' }
    ]
  },
  ...PROCESS_AND_MAP_TASKS
];

/**
 * Pre-populated Public Community Tasks Bank
 * Available immediately to all website visitors without needing to log in.
 */
export const COMMUNITY_DEFAULT_TASKS = [
  {
    id: 'comm-task-remote-work',
    taskNumber: 2,
    type: 'discussion',
    topic: 'tech',
    title: 'Remote Work vs. Traditional Office Environments',
    prompt: 'In many countries, an increasing number of employees now work remotely from home rather than commuting to a traditional workplace. Some people argue that this model enhances work-life balance and worker productivity, while others believe it diminishes corporate collaboration and employee mental wellbeing.\n\nDiscuss both views and give your own opinion.',
    minWords: 250,
    timeLimit: 40,
    isPublic: true,
    isCommunity: true,
    isAiGenerated: true,
    creatorEmail: 'Cộng Đồng IELTS Việt Nam',
    keywords: ['Telecommuting', 'remote work', 'work-life balance', 'corporate cohesion', 'isolation', 'productivity'],
    outline: {
      introduction: 'Introduce the remote work revolution and state balanced thesis: while virtual setups pose interpersonal challenges, flexible hybrid structures offer substantial benefits.',
      body1: 'Advantages: elimination of commuting stress, temporal autonomy, reduced carbon footprint, geographic flexibility.',
      body2: 'Disadvantages: blurring of professional and personal boundaries, loneliness, reduction in spontaneous collaborative problem-solving.',
      conclusion: 'Reiterate that a balanced hybrid framework maximizes productivity while preserving organizational culture.'
    },
    modelAnswer: `The global proliferation of telecommuting has fundamentally restructured the contemporary employment paradigm. While critics contend that remote work erodes organizational cohesion and precipitates psychological isolation, proponents maintain that it significantly augments employee autonomy and productivity. In my view, although remote models present distinct interpersonal hurdles, they offer undeniable advantages that make a hybrid working structure the optimal modern solution.
    
On the one hand, traditionalists rightly observe that physical colocation nurtures spontaneous innovation and esprit de corps. Serendipitous interactions—such as informal corridor discussions or impromptu brainstorming sessions—frequently trigger breakthrough ideas that structured digital video conferences cannot authentically replicate. Furthermore, protracted periods of working in isolation can blur the demarcation between professional responsibilities and domestic life, predisposing employees to chronic burnout and disconnection from corporate culture. For junior associates who rely heavily on osmotic learning and direct mentorship, the absence of an in-person office environment can tangibly impede professional maturation.

On the other hand, the merits of remote working are compelling and far-reaching. Foremost among these is the eradication of grueling daily commutes, which saves workers hundreds of productive hours annually and mitigates urban traffic congestion. This newly acquired temporal sovereignty allows individuals to allocate greater time to familial commitments, physical exercise, and restorative sleep, thereby enhancing overall mental equilibrium. Empirically, numerous knowledge-based enterprises have reported heightened output and reduced operational overheads following the transition to decentralized workflows, as employees can focus deeply without conventional open-plan office distractions.

In conclusion, while total remote isolation carries genuine risks of professional stagnation and social alienation, returning entirely to rigid office confines is retrograde. A forward-thinking synthesis—embodied by flexible hybrid arrangements—preserves collective solidarity while granting employees the autonomy essential for sustainable, high-level productivity.`,
    vocabularyHighlights: [
      { word: 'restructured the contemporary employment paradigm', meaning: 'tái cấu trúc hình thái việc làm đương đại' },
      { word: 'temporal sovereignty', meaning: 'quyền tự chủ về mặt thời gian' },
      { word: 'osmotic learning and direct mentorship', meaning: 'học hỏi tự nhiên qua quan sát và được kèm cặp trực tiếp' },
      { word: 'mitigates urban traffic congestion', meaning: 'giảm thiểu ùn tắc giao thông đô thị' },
      { word: 'serendipitous interactions', meaning: 'các tương tác tình cờ đầy ngẫu hứng và may mắn' }
    ]
  },
  {
    id: 'comm-task-fast-fashion',
    taskNumber: 2,
    type: 'problems_solutions',
    topic: 'env',
    title: 'Environmental Footprint of the Fast Fashion Industry',
    prompt: 'The global popularity of "fast fashion"—cheap, mass-produced clothing following seasonal trends—has led to severe environmental degradation and excessive textile waste.\n\nWhat are the primary causes of this phenomenon, and what measures can governments and consumers take to mitigate its environmental impact?',
    minWords: 250,
    timeLimit: 40,
    isPublic: true,
    isCommunity: true,
    isAiGenerated: true,
    creatorEmail: 'Cộng Đồng IELTS Việt Nam',
    keywords: ['Fast fashion', 'textile waste', 'carbon footprint', 'consumerism', 'circular economy', 'synthetic microfibers'],
    outline: {
      introduction: 'State the growing crisis of disposable clothing and outline causes (aggressive marketing, consumer impatience) and dual solutions (state regulation, mindful consumption).',
      body1: 'Root causes: algorithmic social media advertising promoting throwaway consumer culture, ultra-cheap synthetic materials (polyester, nylon).',
      body2: 'Solutions: governmental carbon tariffs, extended producer responsibility (EPR), consumer adoption of circular fashion (thrift shopping, textile repair).',
      conclusion: 'Summarize that systemic legal accountability and individual conscientiousness must coalesce to curb textile pollution.'
    },
    modelAnswer: `The meteoric expansion of the fast fashion industry has revolutionized clothing retail while exacting a devastating toll on global ecosystems. Driven by aggressive algorithmic marketing and consumer obsession with rapid novelty, this culture of disposable apparel generates immense chemical effluents and landfill waste. Remedying this crisis requires a multi-tiered approach combining stringent governmental regulation with conscious consumer stewardship.

The root causes of escalating textile pollution are multifaceted. Modern garment conglomerates exploit hyper-optimized supply chains to replicate runway designs within days, relying on synthetic petrochemical fibers such as polyester and acrylic that shed non-biodegradable microplastics upon washing. Concurrently, targeted social media algorithms induce compulsive purchasing behaviors among younger demographics, framing garments as single-use items destined for the trash after appearing on a digital feed. Because retail price points fail to internalize ecological damages, consumers treat apparel as ephemeral novelties rather than durable assets.

To combat this systemic degradation, legislative intervention is paramount. Governments must enforce Extended Producer Responsibility (EPR) mandates, requiring fashion brands to finance garment recycling infrastructures and imposing heavy tariffs on virgin plastic textiles. Furthermore, national advertising standards should restrict misleading greenwashing campaigns, mandating transparent lifecycle carbon disclosures on retail labels. Simultaneously, consumers must cultivate a circular economy ethos by embracing thrifting, participating in garment swapping, and prioritizing durable, ethically produced organic apparel over ephemeral trends.

In conclusion, the environmental devastation wrought by fast fashion stems from unsustainable manufacturing paradigms and unchecked consumerism. By implementing rigorous corporate compliance measures and nurturing mindful purchasing habits, society can steer the apparel sector toward an ecologically viable future.`,
    vocabularyHighlights: [
      { word: 'exacting a devastating toll', meaning: 'gây ra tổn hại tàn khốc' },
      { word: 'synthetic petrochemical fibers', meaning: 'các sợi hóa dầu tổng hợp' },
      { word: 'internalize ecological damages', meaning: 'tính toán cả chi phí tổn hại môi trường vào giá thành' },
      { word: 'circular economy ethos', meaning: 'tinh thần / triết lý kinh tế tuần hoàn' },
      { word: 'ephemeral novelties', meaning: 'những món đồ mới lạ chóng tàn' }
    ]
  },
  {
    id: 'comm-task-clean-energy-investment',
    taskNumber: 1,
    type: 'bar',
    topic: 'env',
    title: 'Global Investment in Clean Energy Technologies (2018 - 2024)',
    prompt: 'The bar chart below details total annual capital investments (in billions of US dollars) allocated to clean energy technologies across three major economic regions between 2018 and 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    minWords: 150,
    timeLimit: 20,
    isPublic: true,
    isCommunity: true,
    isAiGenerated: true,
    creatorEmail: 'Cộng Đồng IELTS Việt Nam',
    keywords: ['Clean energy', 'capital investment', 'Asia-Pacific', 'Europe', 'North America', 'renewable expansion'],
    chartData: {
      type: 'bar',
      labels: ['2018', '2020', '2022', '2024'],
      datasets: [
        {
          label: 'Asia-Pacific ($ Billion)',
          data: [150, 210, 320, 480],
          backgroundColor: '#3B82F6'
        },
        {
          label: 'Europe ($ Billion)',
          data: [110, 160, 220, 310],
          backgroundColor: '#10B981'
        },
        {
          label: 'North America ($ Billion)',
          data: [80, 120, 190, 280],
          backgroundColor: '#F59E0B'
        }
      ]
    },
    modelAnswer: `The bar chart delineates annual capital expenditures in clean energy innovations across the Asia-Pacific region, Europe, and North America between 2018 and 2024, measured in billions of US dollars.

Overall, it is manifest that clean energy investments experienced substantial upward trajectories across all three geographical jurisdictions throughout the six-year duration. Furthermore, the Asia-Pacific territory consistently attracted the highest volume of financial capital, while North America occupied the third position despite recording notable acceleration.

Focusing on the frontrunner, Asia-Pacific commanded $150 billion in 2018, substantially eclipsing its continental counterparts. This expenditure demonstrated persistent exponential expansion, scaling to $210 billion in 2020 and subsequently accelerating to a staggering peak of $480 billion by 2024—more than tripling its original figure.

A comparable ascending pattern was evident in Europe and North America. European allocations grew steadily from $110 billion in 2018 to $220 billion in 2022, ultimately culminating at $310 billion. Meanwhile, North America commenced with a modest $80 billion at the outset. Nonetheless, bolstered by aggressive green industrial incentives, North American investments climbed robustly to $190 billion in 2022 before finishing at $280 billion in 2024, nearly matching Europe.`,
    vocabularyHighlights: [
      { word: 'delineates annual capital expenditures', meaning: 'phác họa chi tiêu vốn hàng năm' },
      { word: 'substantial upward trajectories', meaning: 'các quỹ đạo đi lên mạnh mẽ' },
      { word: 'substantially eclipsing', meaning: 'vượt trội đáng kể' },
      { word: 'staggering peak', meaning: 'đỉnh điểm đáng kinh ngạc' },
      { word: 'bolstered by aggressive green industrial incentives', meaning: 'được thúc đẩy bởi các chính sách khuyến khích công nghiệp xanh mạnh mẽ' }
    ]
  }
];

