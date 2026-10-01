/**
 * cambridgeWritingTasks.js - Official Cambridge IELTS Writing Test Collection
 * Covers authentic Academic & General Training Writing tasks from Cambridge 10 to 19.
 * 
 * Every task is explicitly tagged with:
 * - isCambridge: true
 * - source: 'cambridge'
 * - cambridgeBook: <number>
 * - cambridgeTest: <number>
 */

import { ensureTaskIllustration } from '../services/processMapSvgEngine.js';

const RAW_CAMBRIDGE_WRITING_TASKS = [
  // =========================================================================
  // CAMBRIDGE IELTS 19
  // =========================================================================
  {
    id: 'cam-19-t1-robots',
    taskNumber: 1,
    type: 'bar',
    topic: 'tech',
    isCambridge: true,
    source: 'cambridge',
    cambridgeBook: 19,
    cambridgeTest: 1,
    title: 'Cambridge 19 Test 1: Industrial Robot Density per 10,000 Employees',
    prompt: 'The chart below shows the number of industrial robots per 10,000 employees in six countries in 2019 and 2023.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    minWords: 150,
    timeLimit: 20,
    keywords: ['Industrial robots', 'robot density', 'manufacturing automation', 'South Korea', 'Singapore', 'Japan', 'Germany', 'USA', 'China'],
    chartData: {
      type: 'bar',
      labels: ['South Korea', 'Singapore', 'Japan', 'Germany', 'USA', 'China'],
      datasets: [
        { label: '2019', data: [850, 780, 360, 340, 230, 180], backgroundColor: '#3B82F6' },
        { label: '2023', data: [1000, 920, 420, 390, 290, 320], backgroundColor: '#10B981' }
      ]
    },
    outline: {
      introduction: 'Paraphrase the prompt describing the concentration of industrial robots per 10,000 workers across six nations between 2019 and 2023.',
      overview: 'Highlight that all countries experienced increases over the 4-year period; South Korea and Singapore maintained commanding leads, while China recorded the fastest proportional expansion.',
      body1: 'Detail the two frontrunners (South Korea and Singapore): starting above 750 and rising past 900-1000 units.',
      body2: 'Detail the remaining nations (Japan, Germany, USA, China): steady increments, with China nearly doubling its robot density to surpass the USA by 2023.'
    },
    modelAnswer: `The bar chart delineates the concentration of industrial robots per 10,000 manufacturing personnel across six distinct nations in 2019 and 2023.

Overall, it is readily observable that all surveyed countries witnessed progressive increments in robotic adoption over the four-year timeframe. Furthermore, South Korea and Singapore consistently maintained commanding leads over their counterparts, whereas China experienced the most rapid proportional acceleration.

In 2019, South Korea possessed the highest robot density at approximately 850 units per 10,000 employees, closely followed by Singapore at 780. Over the ensuing four years, both Asian nations consolidated their technological superiority, with South Korea reaching an unprecedented 1,000 units and Singapore escalating to 920.

By contrast, the remaining economies exhibited considerably lower automation figures. Japan and Germany began at 360 and 340 robots per 10,000 laborers respectively in 2019, climbing moderately to 420 and 390 by 2023. Notably, while the United States progressed modestly from 230 to 290, China demonstrated an extraordinary surge, leaping from 180 to 320 and successfully eclipsing the American figure by the conclusion of the period.`,
    vocabularyHighlights: [
      { word: 'concentration of industrial robots', meaning: 'mật độ robot công nghiệp' },
      { word: 'commanding leads', meaning: 'khoảng cách dẫn đầu áp đảo' },
      { word: 'consolidated their technological superiority', meaning: 'củng cố ưu thế công nghệ vượt trội' },
      { word: 'rapid proportional acceleration', meaning: 'sự gia tốc tỷ lệ nhanh nhất' },
      { word: 'eclipsing the American figure', meaning: 'vượt qua con số của Hoa Kỳ' }
    ]
  },
  {
    id: 'cam-19-t2-competition',
    taskNumber: 2,
    type: 'discussion',
    topic: 'edu',
    isCambridge: true,
    source: 'cambridge',
    cambridgeBook: 19,
    cambridgeTest: 1,
    title: 'Cambridge 19 Test 1: Competition vs Cooperation in Education',
    prompt: 'Some people believe that competition in universities and schools should be encouraged, while others argue that cooperation is more important.\n\nDiscuss both views and give your own opinion.',
    minWords: 250,
    timeLimit: 40,
    keywords: ['Academic rivalry', 'peer collaboration', 'pedagogy', 'interpersonal skills', 'competitive drive', 'synergy'],
    outline: {
      introduction: 'Introduce the dichotomy between competition and collaboration in academic institutions. State thesis: while competition motivates individual excellence, cooperation is fundamentally more vital for career and societal harmony.',
      body1: 'Arguments for competition: fosters perseverance, sharpens individual problem-solving, prepares students for market reality.',
      body2: 'Arguments for cooperation: mirrors complex modern workplaces, develops empathy and communication, reduces toxic anxiety.',
      conclusion: 'Reiterate that while healthy competition has merit, institutional emphasis must prioritize collaborative aptitude.'
    },
    modelAnswer: `The pedagogical debate regarding whether academic institutions should prioritize competitive rivalry or cooperative collaboration remains intensely contested. While proponents argue that competition instills resilience and drives individual achievement, I firmly concur with the perspective that cooperative learning is far more crucial for both personal fulfillment and modern professional success.

On the one hand, advocates of competitive schooling maintain that scholastic rivalry serves as a potent motivational catalyst. Striving for top rankings, scholarships, or academic accolades compels students to push past intellectual boundaries, cultivating rigorous self-discipline and an appetite for excellence. Furthermore, proponents contend that the global economy is intrinsically competitive; therefore, exposing young individuals to meritocratic evaluation early in life acclimates them to high-pressure environments, such as corporate recruitment and performance benchmarks.

Nevertheless, an overemphasis on competition frequently breeds psychological distress, interpersonal isolation, and a zero-sum mentality where one student's triumph requires another's defeat. Conversely, collaborative pedagogy fosters soft skills that are indispensable in the twenty-first century. Contemporary global dilemmas—ranging from climate engineering to biomedical research—are far too complex for solitary geniuses; they necessitate multidisciplinary synergy. Working in collaborative teams cultivates empathetic listening, conflict negotiation, and collective responsibility. Students who learn to harness diverse perspectives consistently outperform solitary high-achievers when navigating complex corporate ecosystems.

In conclusion, although healthy competition undeniably incentivizes personal diligence, educational frameworks must not prioritize individual contest over communal synergy. Instilling collaborative competence equips students with the emotional intelligence and cooperative aptitude required to thrive in an interconnected global community.`,
    vocabularyHighlights: [
      { word: 'motivational catalyst', meaning: 'chất xúc tác tạo động lực' },
      { word: 'scholastic rivalry', meaning: 'sự cạnh tranh trong học tập' },
      { word: 'zero-sum mentality', meaning: 'tư duy kẻ thắng - người thua (được mất ngang nhau)' },
      { word: 'multidisciplinary synergy', meaning: 'sự hiệp đồng đa ngành nghề' },
      { word: 'communal synergy', meaning: 'sự cộng hưởng tập thể' }
    ]
  },
  {
    id: 'cam-19-t1-household-internet',
    taskNumber: 1,
    type: 'line',
    topic: 'tech',
    isCambridge: true,
    source: 'cambridge',
    cambridgeBook: 19,
    cambridgeTest: 2,
    title: 'Cambridge 19 Test 2: Household Internet Access in Europe (2012–2022)',
    prompt: 'The graph below shows the percentage of households with Internet access in five European countries from 2012 to 2022.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    minWords: 150,
    timeLimit: 20,
    keywords: ['Internet access', 'European households', 'digital connectivity', 'Finland', 'Netherlands', 'Germany', 'Spain', 'Greece'],
    chartData: {
      type: 'line',
      labels: ['2012', '2014', '2016', '2018', '2020', '2022'],
      datasets: [
        { label: 'Netherlands', data: [94, 95, 97, 98, 99, 99], borderColor: '#10B981', backgroundColor: 'transparent' },
        { label: 'Finland', data: [87, 90, 93, 95, 96, 98], borderColor: '#3B82F6', backgroundColor: 'transparent' },
        { label: 'Germany', data: [82, 85, 88, 91, 93, 95], borderColor: '#8B5CF6', backgroundColor: 'transparent' },
        { label: 'Spain', data: [65, 70, 78, 86, 92, 96], borderColor: '#F59E0B', backgroundColor: 'transparent' },
        { label: 'Greece', data: [53, 60, 68, 76, 80, 85], borderColor: '#EF4444', backgroundColor: 'transparent' }
      ]
    },
    outline: {
      introduction: 'Paraphrase the prompt specifying domestic internet connectivity rates across five European nations over a 10-year period.',
      overview: 'All nations displayed upward trends; Netherlands and Finland were high and stable; Spain and Greece registered the most dramatic expansion, narrowing the connectivity gap.',
      body1: 'Detail the leading nations (Netherlands, Finland, Germany): starting high and reaching near-universal coverage (95%-99%).',
      body2: 'Detail the emerging nations (Spain, Greece): Spain rose by 31 percentage points to reach 96%, Greece surged from 53% to 85%.'
    },
    modelAnswer: `The line graph tracks the proportion of households with access to the Internet across five European nations between 2012 and 2022.

Overall, domestic Internet penetration experienced sustained upward trajectories in every examined country over the decade. While northern European states maintained high, near-saturated connectivity levels throughout, southern European nations recorded the steepest increases, significantly closing the digital divide.

In 2012, the Netherlands already enjoyed near-universal coverage at 94%, followed closely by Finland at 87% and Germany at 82%. Over the subsequent ten years, both the Netherlands and Finland experienced gradual, plateauing growth to finish at 99% and 98% respectively. Germany exhibited a similarly steady ascent, culminating at 95% by 2022.

In stark contrast, Spain and Greece began with substantially lower connectivity at the outset, standing at 65% and 53% respectively. However, Spain demonstrated an extraordinary acceleration, surging by over 30 percentage points to attain 96% in 2022, effectively matching the rates of Germany and Finland. Although Greece recorded the lowest proportion across the entire timeframe, it nevertheless showed substantial progress, climbing steadily to reach 85% by the end of the period.`,
    vocabularyHighlights: [
      { word: 'domestic Internet penetration', meaning: 'độ phủ Internet hộ gia đình' },
      { word: 'sustained upward trajectories', meaning: 'quỹ đạo đi lên bền vững' },
      { word: 'near-saturated connectivity levels', meaning: 'mức độ kết nối gần như bão hòa' },
      { word: 'closing the digital divide', meaning: 'thu hẹp khoảng cách số' }
    ]
  },
  {
    id: 'cam-19-t2-longevity',
    taskNumber: 2,
    type: 'problems_solutions',
    topic: 'society',
    isCambridge: true,
    source: 'cambridge',
    cambridgeBook: 19,
    cambridgeTest: 2,
    title: 'Cambridge 19 Test 2: An Ageing Population - Consequences and Solutions',
    prompt: 'In many countries, people are living longer lives. What problems does this cause for individuals and society? What measures should be taken to address these problems?',
    minWords: 250,
    timeLimit: 40,
    keywords: ['Ageing population', 'demographic shift', 'pension deficits', 'geriatric healthcare', 'retirement age', 'silver economy'],
    outline: {
      introduction: 'Introduce the phenomenon of increased human life expectancy. State that while this reflects medical progress, it causes fiscal and social dilemmas that necessitate systemic policy interventions.',
      body1: 'Problems: Healthcare strain from chronic degenerative illnesses, financial burden on state pension schemes, shrinking working-age workforce.',
      body2: 'Solutions: Raising the statutory retirement age, incentivizing elderly workplace participation (silver economy), investing in preventive healthcare and eldercare automation.',
      conclusion: 'Reiterate that longevity is a societal achievement that requires proactive structural reorganization.'
    },
    modelAnswer: `The continuous expansion of human life expectancy stands as one of modern medicine’s most commendable achievements; however, this demographic transition poses formidable socioeconomic challenges. This essay will examine the principal repercussions of an ageing populace for both individual welfare and broader societal cohesion, before proposing pragmatic remedial measures.

The primary complication stemming from increased longevity relates to escalating fiscal and medical strain. On an individual level, extending life spans does not automatically equate to prolonged health spans. Many elderly individuals endure protracted periods of chronic, degenerative conditions such as dementia or cardiovascular illnesses, which can severely deplete personal savings and impose immense psychological caregiving burdens on their families. Societally, an inverted demographic pyramid induces crippling pension deficits and overburdens public healthcare infrastructure. As the ratio of active tax-paying workers to non-working retirees shrinks precipitously, state budgets are stretched, risking economic stagnation and generational friction.

To counteract these adverse dynamics, governments must implement multidimensional policies. First, statutory retirement ages should be progressively indexed to average life expectancy, allowing healthy seniors to remain economically active while alleviating pressure on pension reserves. Concurrently, public institutions should foster a "silver economy" by offering flexible, part-time consultancy roles and digital reskilling programs tailored to older demographics. Furthermore, governments ought to invest substantially in preventive geriatric healthcare and community-based robotic care technologies, which preserve autonomy and drastically diminish long-term hospitalization costs.

In conclusion, although unprecedented longevity generates acute strains on healthcare systems and fiscal sustainability, these complications are manageable. By adjusting retirement frameworks and promoting healthy, active ageing, societies can transform an ageing population from a demographic burden into a reservoir of seasoned wisdom and social capital.`,
    vocabularyHighlights: [
      { word: 'demographic transition', meaning: 'sự chuyển dịch nhân khẩu học' },
      { word: 'prolonged health spans', meaning: 'kéo dài thời gian sống khỏe mạnh' },
      { word: 'inverted demographic pyramid', meaning: 'kim tự tháp dân số đảo ngược' },
      { word: 'silver economy', meaning: 'nền kinh tế người cao tuổi' },
      { word: 'reservoir of seasoned wisdom', meaning: 'kho tàng trí tuệ dày dạn kinh nghiệm' }
    ]
  },
  {
    id: 'cam-19-t1-plastic-recycling',
    taskNumber: 1,
    type: 'process',
    topic: 'env',
    isCambridge: true,
    source: 'cambridge',
    cambridgeBook: 19,
    cambridgeTest: 3,
    title: 'Cambridge 19 Test 3: Recycling Plastic Bottles into Polyester Fleece',
    prompt: 'The diagram below shows the process of recycling plastic bottles into polyester fleece jackets.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    minWords: 150,
    timeLimit: 20,
    keywords: ['Plastic recycling', 'collection', 'shredding', 'polymer chips', 'spinning yarn', 'fleece textile'],
    processSteps: [
      { step: 1, name: 'Collection & Sorting', desc: 'Used PET bottles are collected from recycling bins and sorted by plastic grade' },
      { step: 2, name: 'Washing & Crushing', desc: 'Bottles are sterilized, stripped of labels, and crushed into flat bales' },
      { step: 3, name: 'Shredding', desc: 'Bales are fed into high-speed shredders to create small plastic flakes' },
      { step: 4, name: 'Melting & Extrusion', desc: 'Flakes are heated into molten polymer and extruded into fine filaments' },
      { step: 5, name: 'Spinning & Weaving', desc: 'Filaments are drawn into yarn and woven into durable fleece fabric' },
      { step: 6, name: 'Tailoring', desc: 'Fabric is cut and stitched into commercial polyester fleece jackets' }
    ],
    outline: {
      introduction: 'Paraphrase the mechanical and chemical transformation of post-consumer plastic bottles into finished fleece outerwear.',
      overview: 'The process involves six primary stages, beginning with refuse collection and culminating in garment assembly.',
      body1: 'Describe mechanical preparatory stages: collecting, washing, label removal, and shredding into flakes.',
      body2: 'Describe conversion and manufacturing: melting, extrusion into synthetic filaments, spinning into yarn, and final stitching.'
    },
    modelAnswer: `The diagram delineates the sequential industrial stages through which discarded plastic bottles are repurposed and converted into fleece garments.

Overall, the procedure encompasses six key phases, categorized into two broad stages: the mechanical reclamation of plastic waste, followed by its chemical conversion into synthetic yarn and eventual garment manufacturing.

In the initial stage, post-consumer PET bottles are gathered from designated recycling depositories and transported to processing facilities. Here, bottles are thoroughly washed with high-pressure water to eradicate contaminants, stripped of paper labels, and compressed into dense bales. Subsequently, these compressed units are fed into industrial shredding machinery, which pulverises the plastic into microscopic polymer flakes.

The second half of the cycle involves thermal and textile fabrication. The polymer flakes are subjected to extreme heat until melted into a viscous liquid, which is then forced through a spinneret plate to produce ultra-fine continuous synthetic filaments. These filaments are cooled, stretched, and mechanically spun into durable polyester yarn. In the final phase, the yarn is machine-knitted into soft fleece textile rolls, which are subsequently cut and tailored into finished fleece jackets for consumer distribution.`,
    vocabularyHighlights: [
      { word: 'sequential industrial stages', meaning: 'các giai đoạn công nghiệp tuần tự' },
      { word: 'mechanical reclamation', meaning: 'quá trình thu hồi cơ học' },
      { word: 'post-consumer PET bottles', meaning: 'chai nhựa PET đã qua sử dụng' },
      { word: 'forced through a spinneret plate', meaning: 'ép qua đĩa tạo sợi' },
      { word: 'viscous liquid', meaning: 'chất lỏng sánh sệt' }
    ]
  },
  {
    id: 'cam-19-t2-sugar-regulation',
    taskNumber: 2,
    type: 'opinion',
    topic: 'health',
    isCambridge: true,
    source: 'cambridge',
    cambridgeBook: 19,
    cambridgeTest: 3,
    title: 'Cambridge 19 Test 3: Government Regulation on Sugar in Food and Drinks',
    prompt: 'Some people think that the government should strictly regulate the amount of sugar in manufactured food and drinks. Others believe that consumers should have the freedom to choose what they eat.\n\nTo what extent do you agree or disagree?',
    minWords: 250,
    timeLimit: 40,
    keywords: ['Sugar regulation', 'public health', 'consumer autonomy', 'obesity crisis', 'sin tax', 'nanny state'],
    outline: {
      introduction: 'Introduce the debate on food sovereignty versus public health intervention. State thesis: strictly regulating sugar content is essential to stem global obesity and healthcare collapse.',
      body1: 'Counter-argument & consumer autonomy: people have the right to personal dietary discretion; risk of intrusive "nanny state" overreach.',
      body2: 'Why state regulation is vital: hidden sugars in processed foods, addictive neurological impact, catastrophic public healthcare costs incurred by taxpayers.',
      conclusion: 'Reiterate that legislative caps on industrial sugar protect vulnerable consumers and stabilize healthcare systems.'
    },
    modelAnswer: `The alarming escalation of diet-related chronic conditions has ignited fierce debate over whether authorities should legally restrict the sugar content in manufactured foods and beverages, or if dietary choice should remain an inviolable personal liberty. While I acknowledge the importance of consumer autonomy, I firmly contend that statutory caps on industrial sugar are imperative to mitigate an unfolding public health catastrophe.

Opponents of government intervention argue that adult citizens possess the intellectual agency to dictate their nutritional intake. From this perspective, state-mandated recipe alterations or punitive taxes represent paternalistic overreach, bordering on a "nanny state." Furthermore, critics contend that consumers should simply be empowered through clearer front-of-package labelling and public awareness campaigns, thereby allowing market dynamics and informed personal responsibility to govern dietary trends.

However, relying solely on individual willpower is fundamentally flawed in the face of modern corporate food engineering. Food conglomerates routinely infuse processed goods—ranging from bread and pasta sauces to fruit yoghurts—with copious quantities of hidden sugar specifically engineered to exploit human neurological reward systems and trigger addictive consumption. Vulnerable demographics, particularly children and lower-income families who lack nutritional literacy or access to unadulterated whole foods, are disproportionately victimized. Crucially, the astronomical healthcare expenditures required to treat diabetes, hypertension, and dental decay are ultimately underwritten by public taxpayers. Therefore, treating excessive sugar consumption merely as a private affair ignores its massive societal externalities.

In conclusion, although individual liberty is a cherished value, it cannot supersede public health imperatives. Implementing stringent regulatory limits on sugar in mass-manufactured food is not an infringement of freedom, but a necessary safeguard that protects society from preventable epidemics and preserves public healthcare viability.`,
    vocabularyHighlights: [
      { word: 'inviolable personal liberty', meaning: 'quyền tự do cá nhân bất khả xâm phạm' },
      { word: 'paternalistic overreach', meaning: 'sự can thiệp bao bọc thái quá của nhà nước' },
      { word: 'copious quantities of hidden sugar', meaning: 'lượng đường ẩn khổng lồ' },
      { word: 'neurological reward systems', meaning: 'hệ thống phần thưởng thần kinh (gây nghiện)' },
      { word: 'societal externalities', meaning: 'những hệ lụy ngoại ứng xã hội' }
    ]
  },
  {
    id: 'cam-19-t1-norbiton-redevelopment',
    taskNumber: 1,
    type: 'map',
    topic: 'urban',
    isCambridge: true,
    source: 'cambridge',
    cambridgeBook: 19,
    cambridgeTest: 4,
    title: 'Cambridge 19 Test 4: Redevelopment of Norbiton Industrial Area',
    prompt: 'The maps below show the town of Norbiton as it is now and the planned future development of the area.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    minWords: 150,
    timeLimit: 20,
    keywords: ['Norbiton', 'industrial estate', 'residential transformation', 'roundabout', 'housing', 'educational zone'],
    mapChanges: [
      { feature: 'Central Factories', past: 'Industrial factory estate with gravel yard', present: 'Demolished to make way for modern residential housing' },
      { feature: 'Eastern Boundary', past: 'Vacant open fields', present: 'Construction of a community school and medical clinic' },
      { feature: 'River Frontage (North)', past: 'Heavy industrial docks along the river', present: 'Bridge built linking to a new riverside university campus' },
      { feature: 'Southern Access', past: 'Single road running east-west', present: 'Creation of circular roundabouts and interconnected residential streets' }
    ],
    outline: {
      introduction: 'Paraphrase the two maps showing the present industrial layout of Norbiton and its proposed residential transformation.',
      overview: 'Highlight the total eradication of industrial infrastructure in favor of an integrated residential, commercial, and educational precinct.',
      body1: 'Describe changes in the center and south: factory demolition, housing construction, and roundabout additions.',
      body2: 'Describe northern and eastern additions: new bridge across the river, university campus, medical center, and school.'
    },
    modelAnswer: `The two maps illustrate the current layout of the Norbiton industrial district alongside proposed plans for its comprehensive urban regeneration.

Overall, it is readily apparent that the entire area will undergo a radical transformation from an exclusively industrial zone into a modern, amenity-rich residential and educational community. The most conspicuous modifications involve the demolition of all existing factories and the construction of extensive housing accompanied by newly integrated transport links.

Presently, the central zone is dominated by multiple industrial plants clustered around an east-west arterial road that terminates at a roundabout in the west. In the future, every factory will be dismantled and replaced by private housing estates. The road network will be significantly upgraded through the addition of a secondary roundabout to the east, feeding smaller residential cul-de-sacs that provide access to newly built homes, retail shops, and a medical healthcare centre.

To the north across the river, where uncultivated land currently sits isolated, a new bridge will span the waterway to connect the town directly to a newly erected university campus, ringed by student accommodation. Furthermore, the empty farmland situated on the eastern perimeter will be repurposed to construct a community school, thereby completing the town’s transition into a self-sustaining residential quarter.`,
    vocabularyHighlights: [
      { word: 'comprehensive urban regeneration', meaning: 'quá trình tái thiết đô thị toàn diện' },
      { word: 'radical transformation', meaning: 'sự biến đổi triệt để' },
      { word: 'conspicuous modifications', meaning: 'những sự thay đổi dễ thấy nhất' },
      { word: 'residential cul-de-sacs', meaning: 'các con đường ngõ cụt yên tĩnh trong khu dân cư' },
      { word: 'self-sustaining residential quarter', meaning: 'khu dân cư tự cung tự cấp tiện ích' }
    ]
  },
  {
    id: 'cam-19-t2-environmental-responsibility',
    taskNumber: 2,
    type: 'opinion',
    topic: 'env',
    isCambridge: true,
    source: 'cambridge',
    cambridgeBook: 19,
    cambridgeTest: 4,
    title: 'Cambridge 19 Test 4: Individual vs Government Action on Climate Change',
    prompt: 'Some people argue that environmental problems are too big for individual people to address, and only governments and large corporations can make a difference.\n\nTo what extent do you agree or disagree?',
    minWords: 250,
    timeLimit: 40,
    keywords: ['Environmental degradation', 'climate change', 'macro intervention', 'individual civic responsibility', 'carbon taxation', 'grassroots action'],
    outline: {
      introduction: 'Introduce the debate on climate responsibility. State thesis: while macro institutional power is indispensable, grassroots individual action is equally essential to drive policy and market demand.',
      body1: 'Why governments and corporations hold primary structural leverage: legislative mandates, carbon pricing, funding green grid infrastructure, industrial scale.',
      body2: 'Why individual agency remains indispensable: consumer demand dictates corporate supply, lifestyle choices reduce domestic footprints, voting shapes political will.',
      conclusion: 'Reiterate that climate mitigation requires reciprocal synergy between institutional authority and public civic engagement.'
    },
    modelAnswer: `The overwhelming scale of contemporary ecological crises—manifested in rampant global warming, ocean acidification, and biodiversity collapse—has led many to assert that individual efforts are inconsequential, leaving governments and transnational corporations as the sole entities capable of effecting meaningful change. While I concede that institutional bodies wield the macro financial and regulatory apparatus necessary to alter environmental trajectories, I disagree with the notion that individuals are powerless.

Undoubtedly, state governments and commercial enterprises possess unmatched structural leverage. Meaningful planetary decarbonization requires systemic interventions that transcend private citizen capacity, such as shutting down coal-fired generation, subsidizing nuclear and renewable energy grids, and enforcing stringent industrial emissions ceilings. Furthermore, only legislative authorities can institute carbon taxation mechanisms and ban hazardous chemicals, compelling multinational conglomerates to re-engineer their international supply chains. In isolation, personal actions like turning off light switches or recycling household refuse are negligible against corporate pollution that accounts for the vast majority of greenhouse emissions.

Nonetheless, attributing exclusive agency to institutional actors overlooks the fundamental dynamic between public demand and corporate conduct. Corporations operate to maximize profits; they alter their operational ethics only when consumer spending shifts. The burgeoning global markets for electric vehicles, plant-based diets, and zero-waste packaging emerged directly from millions of deliberate individual lifestyle choices. Moreover, in democratic frameworks, progressive environmental legislation is rarely enacted spontaneously by politicians; rather, it is catalyzed by citizen activism, electoral voting, and grassroots civil demonstrations.

In conclusion, although governments and major corporations shoulder the legislative and industrial burden of climate mitigation, declaring individual action futile is dangerously reductive. True environmental resilience requires a symbiotic partnership: top-down institutional enforcement propelled and validated by bottom-up civic responsibility.`,
    vocabularyHighlights: [
      { word: 'ecological crises', meaning: 'khủng hoảng sinh thái' },
      { word: 'macro financial and regulatory apparatus', meaning: 'bộ máy tài chính và pháp lý quy mô vĩ mô' },
      { word: 'systemic interventions', meaning: 'những can thiệp mang tính hệ thống' },
      { word: 'burgeoning global markets', meaning: 'các thị trường toàn cầu đang nở rộ' },
      { word: 'symbiotic partnership', meaning: 'mối quan hệ hợp tác cộng sinh' }
    ]
  },

  // =========================================================================
  // CAMBRIDGE IELTS 18
  // =========================================================================
  {
    id: 'cam-18-t1-car-trips',
    taskNumber: 1,
    type: 'line',
    topic: 'urban',
    isCambridge: true,
    source: 'cambridge',
    cambridgeBook: 18,
    cambridgeTest: 1,
    title: 'Cambridge 18 Test 1: Car Journey Purposes in the UK (1990–2020)',
    prompt: 'The graph below shows the average number of car journeys made per person each year for different purposes in the UK between 1990 and 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    minWords: 150,
    timeLimit: 20,
    keywords: ['Car journeys', 'UK transportation', 'commuting', 'shopping', 'leisure', 'education'],
    chartData: {
      type: 'line',
      labels: ['1990', '1995', '2000', '2005', '2010', '2015', '2020'],
      datasets: [
        { label: 'Commuting', data: [380, 370, 360, 350, 330, 310, 240], borderColor: '#EF4444', backgroundColor: 'transparent' },
        { label: 'Shopping', data: [220, 230, 245, 250, 260, 270, 280], borderColor: '#10B981', backgroundColor: 'transparent' },
        { label: 'Leisure', data: [170, 180, 190, 200, 210, 215, 220], borderColor: '#3B82F6', backgroundColor: 'transparent' },
        { label: 'School Runs', data: [80, 95, 120, 140, 160, 175, 185], borderColor: '#F59E0B', backgroundColor: 'transparent' }
      ]
    },
    outline: {
      introduction: 'Paraphrase the line graph tracking annual car trips per person for 4 activities in the UK across 30 years.',
      overview: 'Shopping, leisure, and school runs showed upward trends; commuting was historically dominant but plummeted drastically; shopping took over as the top reason by 2020.',
      body1: 'Detail commuting: started at 380, declined steadily, then crashed to 240 in 2020.',
      body2: 'Detail other categories: shopping surpassed commuting in 2017 to finish at 280; school trips more than doubled from 80 to 185.'
    },
    modelAnswer: `The line graph illustrates the average number of car journeys undertaken per person annually for four distinct purposes in the United Kingdom from 1990 to 2020.

Overall, it is immediately apparent that commuting was the predominant motivation for driving throughout the majority of the timeframe, before suffering a substantial downturn. Conversely, vehicular trips for shopping, leisure, and school escorting all experienced consistent growth, with shopping ultimately overtaking commuting as the primary travel purpose.

In 1990, commuting stood unmatched at approximately 380 journeys per individual per year. It initiated a gradual downward drift over the next two decades, sliding to 330 by 2010, before plunging precipitously between 2015 and 2020 to conclude at just 240 journeys.

In sharp contrast, trips designated for shopping commenced at 220 journeys and followed an unwavering upward trajectory, overtaking commuting around 2017 and cresting at 280 in 2020. Similarly, leisure travel rose progressively from 170 to 220 journeys over the thirty-year span. Most noticeably, taking children to school witnessed the steepest relative surge, more than doubling from a modest 80 journeys in 1990 to reach 185 by 2020.`,
    vocabularyHighlights: [
      { word: 'predominant motivation for driving', meaning: 'động cơ lái xe chủ đạo' },
      { word: 'gradual downward drift', meaning: 'xu hướng giảm dần từ từ' },
      { word: 'plunging precipitously', meaning: 'lao dốc thê thảm' },
      { word: 'unwavering upward trajectory', meaning: 'quỹ đạo đi lên kiên định không dao động' }
    ]
  },
  {
    id: 'cam-18-t2-consumer-waste',
    taskNumber: 2,
    type: 'opinion',
    topic: 'env',
    isCambridge: true,
    source: 'cambridge',
    cambridgeBook: 18,
    cambridgeTest: 1,
    title: 'Cambridge 18 Test 1: Responsibility for Consumer Waste and Environmental Damage',
    prompt: 'The increase in the production of consumer goods results in damage to the natural environment. What can the government do to solve this problem? What can individual people do?',
    minWords: 250,
    timeLimit: 40,
    keywords: ['Consumer goods', 'environmental damage', 'e-waste', 'extended producer responsibility', 'circular economy', 'conscious consumerism'],
    outline: {
      introduction: 'Acknowledge the environmental toll of rampant consumerism. State that resolving this requires robust governmental regulation combined with responsible consumer behavior.',
      body1: 'Governmental solutions: Extended Producer Responsibility (EPR), imposing eco-taxes, subsidizing circular economy infrastructure, enforcing right-to-repair.',
      body2: 'Individual solutions: Practicing conscious consumerism, rejecting fast fashion, repairing instead of replacing, participating in community recycling.',
      conclusion: 'Reiterate that systemic legislative enforcement and mindful citizen choices must act in concert.'
    },
    modelAnswer: `The insatiable global appetite for manufactured consumer goods has unleashed severe environmental degradation, characterized by resource depletion, toxic industrial effluents, and mountainous landfill waste. Addressing this ecological crisis demands synchronized action from both institutional policymakers and private consumers.

State authorities possess powerful legislative and fiscal mechanisms to curb industrial overproduction. First, governments should institute Extended Producer Responsibility (EPR) mandates, legally obliging electronics and garment manufacturers to fund the end-of-life recycling and reclamation of their products. This economic incentive compels corporations to design durable, easily repairable goods rather than practicing planned obsolescence. Additionally, imposing graduated eco-taxes on single-use plastics and carbon-intensive manufacturing while subsidizing circular-economy startups would drastically diminish the ecological footprint of consumer goods. Legislative bodies must also ratify "Right to Repair" acts, ensuring affordable spare parts and dismantling corporate monopolies over repairs.

Simultaneously, private citizens must transition from passive consumption towards mindful stewardship. Consumers can dramatically curtail industrial waste by adopting the "reduce, reuse, and repair" philosophy. This entails repudiating the hyper-wasteful culture of fast fashion and disposable consumer electronics in favor of pre-owned or modular merchandise. Furthermore, public choices have direct market impact; by deliberately boycotting heavily packaged commodities and patronizing environmentally certified brands, ordinary shoppers send unambiguous economic signals that force businesses to reform their manufacturing paradigms.

In conclusion, mitigating the environmental wreckage precipitated by hyper-consumerism is not an insurmountable dilemma. By combining stringent state regulations with conscious, disciplined individual buying habits, societies can successfully decouple economic vitality from ecological devastation.`,
    vocabularyHighlights: [
      { word: 'insatiable global appetite', meaning: 'cơn thèm muốn tiêu dùng không đáy của toàn cầu' },
      { word: 'planned obsolescence', meaning: 'sự lỗi thời có chủ đích của sản phẩm' },
      { word: 'mindful stewardship', meaning: 'tinh thần quản lý và gìn giữ có trách nhiệm' },
      { word: 'repudiating hyper-wasteful culture', meaning: 'bài trừ văn hóa siêu lãng phí' },
      { word: 'decouple economic vitality from devastation', meaning: 'tách rời sự thịnh vượng kinh tế khỏi sự tàn phá môi trường' }
    ]
  },
  {
    id: 'cam-18-t1-bioethanol',
    taskNumber: 1,
    type: 'process',
    topic: 'tech',
    isCambridge: true,
    source: 'cambridge',
    cambridgeBook: 18,
    cambridgeTest: 2,
    title: 'Cambridge 18 Test 2: Production of Bioethanol Fuel from Biomass',
    prompt: 'The diagram below shows the process of making bioethanol from plant biomass (corn and sugar cane).\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    minWords: 150,
    timeLimit: 20,
    keywords: ['Bioethanol', 'biomass', 'harvesting', 'fermentation', 'distillation', 'renewable biofuel'],
    processSteps: [
      { step: 1, name: 'Cultivation & Harvest', desc: 'Corn or sugarcane is cultivated and harvested using agricultural combines' },
      { step: 2, name: 'Pre-treatment & Milling', desc: 'Raw crops are shredded and milled into a granular mash' },
      { step: 3, name: 'Enzyme Liquefaction', desc: 'Enzymes and water are added to convert starch into fermentable sugars' },
      { step: 4, name: 'Yeast Fermentation', desc: 'Microbial yeast is introduced to ferment sugars into crude bioethanol' },
      { step: 5, name: 'Distillation & Dehydration', desc: 'Mixture is distilled and dehydrated to produce 99.5% pure anhydrous fuel ethanol' },
      { step: 6, name: 'Distribution', desc: 'Fuel is loaded into tanker trucks and delivered to commercial fuel stations' }
    ],
    outline: {
      introduction: 'Paraphrase the flow diagram showing the biological and chemical transformation of agricultural crops into bioethanol fuel.',
      overview: 'The process involves six primary stages, proceeding from initial crop farming to enzyme breakdown, fermentation, distillation, and distribution.',
      body1: 'Detail initial agricultural and mechanical phases: crop harvesting, mechanical milling, and enzyme liquefaction.',
      body2: 'Detail biochemical refinement and distribution: yeast fermentation, thermal distillation, and tanker transport.'
    },
    modelAnswer: `The flow chart illustrates the multi-stage biochemical process by which bioethanol fuel is manufactured from agricultural biomass such as corn and sugar cane.

Overall, the production cycle comprises six main phases, progressing from the initial cultivation and mechanical harvesting of raw crops to biological enzymatic breakdown, microbial fermentation, distillation, and final distribution.

The process commences in the agricultural fields, where mature crops are gathered using mechanical harvesters. Once transported to the bio-refinery, the raw vegetation undergoes initial pre-treatment, where it is thoroughly cleaned and fed into an industrial mill to be ground into a coarse mash. In the third phase, this plant mash is blended with water and specialized enzymes inside a thermal chamber, which breaks down complex carbohydrates and converts starch into soluble fermentable sugars.

During the fourth stage, the sweetened liquid is transferred into large fermentation vats, where active yeast cultures are introduced. Over several hours, the yeast metabolizes the glucose, generating a crude ethanol-water solution alongside carbon dioxide. This mixture is subsequently directed into a fractional distillation tower and dehydration unit, which separates the water content and purifies the fuel to over 99% purity. In the ultimate phase, the refined bioethanol is pumped into specialized tanker trucks for delivery to commercial fuel stations.`,
    vocabularyHighlights: [
      { word: 'biochemical process', meaning: 'quy trình hóa sinh' },
      { word: 'enzymatic breakdown', meaning: 'sự phân hủy bằng enzyme' },
      { word: 'fractional distillation tower', meaning: 'tháp chưng cất phân đoạn' },
      { word: 'coarse mash', meaning: 'hỗn hợp bột nghiền thô' }
    ]
  },
  {
    id: 'cam-18-t2-university-function',
    taskNumber: 2,
    type: 'discussion',
    topic: 'edu',
    isCambridge: true,
    source: 'cambridge',
    cambridgeBook: 18,
    cambridgeTest: 2,
    title: 'Cambridge 18 Test 2: Vocational Training vs Pure Knowledge at Universities',
    prompt: 'Some people think that universities should provide graduates with the knowledge and skills needed in the workplace, while others think that the true function of a university should be to give access to knowledge for its own sake, regardless of whether the course is useful to an employer.\n\nDiscuss both views and give your own opinion.',
    minWords: 250,
    timeLimit: 40,
    keywords: ['University function', 'vocational utility', 'pure academia', 'theoretical knowledge', 'workplace readiness', 'intellectual pursuit'],
    outline: {
      introduction: 'Introduce the dichotomy between utilitarian vocationalism and pure academic inquiry. State thesis: while job readiness is pragmatically necessary, the foundational spirit of tertiary education must preserve intellectual curiosity.',
      body1: 'Arguments for workplace orientation: high tuition costs, economic competitiveness, immediate employment transition for students.',
      body2: 'Arguments for knowledge for its own sake: philosophical inquiry, foundational scientific breakthroughs, fostering enlightened critical citizens.',
      conclusion: 'Reiterate that universities must strike a symbiotic balance between practical employability and unfettered theoretical inquiry.'
    },
    modelAnswer: `The debate concerning the fundamental purpose of higher education—whether it should serve as an incubator for pragmatic workplace skills or as a sanctuary for pure, unconstrained intellectual inquiry—has garnered widespread attention. While I acknowledge the imperative for graduates to secure gainful employment, I firmly contend that subordinating universities exclusively to corporate utility undermines their highest civic and intellectual mission.

On the one hand, proponents of vocational orientation present compelling economic arguments. In an era marked by soaring tuition fees and competitive labor markets, students and their families view university enrollment as a substantial financial investment. Consequently, educational curricula that impart immediately marketable competencies—such as computer software development, financial auditing, or clinical nursing—ensure seamless transitions into high-paying industries and safeguard graduates against underemployment. Furthermore, national economies require specialized, technically adept workforces to sustain industrial productivity and attract foreign direct investment.

Conversely, reducing universities to mere corporate training grounds ignores the transformative power of knowledge pursued for its own intrinsic merit. Disciplines such as theoretical physics, philosophy, archaeology, and literature may not yield immediate commercial dividends; however, they expand human understanding and nurture profound critical thinking. History demonstrates that groundbreaking innovations often originate from pure, curiosity-driven research rather than commercially dictated projects. Moreover, studying abstract humanities instills ethical discernment, cultural empathy, and skepticism of dogma—attributes that are indispensable for democratic citizens navigating an increasingly complex global landscape.

In conclusion, although tertiary institutions must equip students with foundational vocational competencies to thrive economically, their ultimate raison d'être must never be reduced solely to serving corporate employers. The most prestigious universities preserve a harmonious synthesis: cultivating practical vocational efficacy while zealously safeguarding the pursuit of knowledge for its own sake.`,
    vocabularyHighlights: [
      { word: 'sanctuary for unconstrained intellectual inquiry', meaning: 'thánh đường cho nghiên cứu học thuật thuần túy' },
      { word: 'subordinating universities to corporate utility', meaning: 'hạ thấp đại học thành công cụ phục vụ doanh nghiệp' },
      { word: 'commercial dividends', meaning: 'lợi nhuận thương mại' },
      { word: 'ethical discernment', meaning: 'sự sáng suốt về mặt đạo đức' },
      { word: 'ultimate raison d\'être', meaning: 'lý do tồn tại tối thượng' }
    ]
  },
  {
    id: 'cam-18-t1-stokeford-village',
    taskNumber: 1,
    type: 'map',
    topic: 'urban',
    isCambridge: true,
    source: 'cambridge',
    cambridgeBook: 18,
    cambridgeTest: 3,
    title: 'Cambridge 18 Test 3: Transformation of the Village of Stokeford (1930 vs 2010)',
    prompt: 'The maps below show the village of Stokeford in 1930 and 2010.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    minWords: 150,
    timeLimit: 20,
    keywords: ['Stokeford', 'village modernization', 'farmland conversion', 'primary school', 'retirement home', 'residential density'],
    mapChanges: [
      { feature: 'Farmland', past: 'Vast agricultural farmland in north and south', present: 'Completely converted into modern housing estates' },
      { feature: 'Primary School', past: 'Small single-story school building', present: 'Expanded with double-story modern extensions and sports facilities' },
      { feature: 'Large House', past: 'Private estate with extensive gardens in center', present: 'Reconstructed into a large commercial retirement home' },
      { feature: 'Shops & Amenities', past: 'Cluster of small local shops along main road', present: 'Demolished and replaced by residential properties' }
    ],
    outline: {
      introduction: 'Introduce the map comparisons of Stokeford village over an 80-year interval from 1930 to 2010.',
      overview: 'Highlight the comprehensive residential densification, total eradication of agricultural land, and expansion of communal facilities.',
      body1: 'Describe farmland conversion into housing cul-de-sacs flanking the main thoroughfare.',
      body2: 'Describe changes to specific structures: primary school expansion, conversion of large house to retirement home, and disappearance of shops.'
    },
    modelAnswer: `The two maps illustrate the architectural and geographical developments that occurred in the rural village of Stokeford over an 80-year span between 1930 and 2010.

Overall, it is readily apparent that Stokeford underwent significant residential densification, transitioning from a peaceful agricultural settlement into a populated suburban community. The most conspicuous changes were the total elimination of farmland in favor of housing and the expansion of educational facilities.

In 1930, the landscape on both sides of the central north-south road was dominated by two sprawling parcels of farmland. By 2010, both tracts of agricultural land had been entirely replaced by an intricate network of residential side streets and cul-de-sacs lined with modern houses. Interestingly, the local shops that previously stood midway along the main street in 1930 were demolished and converted into residential buildings by 2010.

Regarding social and educational infrastructure, the primary school situated in the northeast quadrant witnessed substantial enlargement, with new buildings constructed adjacent to the original structure to accommodate the growing population. Meanwhile, the large private manor house and expansive gardens located in the village center were repurposed and enlarged into a specialized retirement home.`,
    vocabularyHighlights: [
      { word: 'residential densification', meaning: 'sự tập trung mật độ dân cư cao' },
      { word: 'peaceful agricultural settlement', meaning: 'khu định cư nông nghiệp yên bình' },
      { word: 'sprawling parcels of farmland', meaning: 'những thửa đất nông nghiệp trải rộng' },
      { word: 'repurposed and enlarged into', meaning: 'được cải tạo công năng và mở rộng thành' }
    ]
  },
  {
    id: 'cam-18-t2-fossil-fuels',
    taskNumber: 2,
    type: 'opinion',
    topic: 'env',
    isCambridge: true,
    source: 'cambridge',
    cambridgeBook: 18,
    cambridgeTest: 3,
    title: 'Cambridge 18 Test 3: Reliance on Fossil Fuels and Green Alternatives',
    prompt: 'Fossil fuels are the main source of energy around the world. In some countries, the use of alternative sources such as solar and wind energy is encouraged. To what extent do you agree that alternative energy should completely replace fossil fuels?',
    minWords: 250,
    timeLimit: 40,
    keywords: ['Fossil fuels', 'renewable energy', 'grid decarbonization', 'intermittency', 'baseload power', 'transition phase'],
    outline: {
      introduction: 'Introduce the global energy dilemma between fossil reliance and clean alternatives. State thesis: while a complete replacement is ecologically imperative, it must be executed through a pragmatic transitional phase.',
      body1: 'Why fossil fuels must be phased out: accelerating climate chaos, toxic air pollution, finite depletion.',
      body2: 'Current hurdles and why complete overnight replacement is unfeasible: renewable intermittency, grid storage bottlenecks, heavy industrial thermal demands (steel, cement).',
      conclusion: 'Reiterate that full substitution is the necessary ultimate objective, achievable via nuclear bridging and smart grid investments.'
    },
    modelAnswer: `The catastrophic ecological ramifications of burning fossil fuels have catalyzed an urgent global discourse regarding whether renewable alternatives—principally solar, wind, and hydroelectric power—should entirely supplant hydrocarbons. While I wholeheartedly agree that complete decarbonization is an existential imperative for planetary survival, I contend that this replacement must follow a phased, technologically pragmatic trajectory rather than an precipitous overnight ban.

The rationale for completely dismantling fossil fuel infrastructure is incontrovertible. Coal, petroleum, and natural gas combustion accounts for the preponderance of global greenhouse gas emissions, driving ocean warming, catastrophic climatic volatility, and lethal metropolitan smog. Furthermore, hydrocarbons are finite geological reserves; persistent reliance on depleting deposits guarantees volatile geopolitical conflicts and unsustainable energy shocks. Transitioning toward inexhaustible clean alternatives eliminates carbon emissions at the point of generation, fosters domestic energy sovereignty, and protects public health from respiratory epidemics.

Nevertheless, an instantaneous and total prohibition on fossil fuels remains technically and economically unviable in the immediate term. Renewable sources like solar radiation and wind currents suffer from chronic intermittency; during protracted overcast or windless periods, power grids risk debilitating brownouts unless backed by astronomical utility-scale battery reserves that modern supply chains cannot yet manufacture at scale. Moreover, foundational heavy industries—such as blast-furnace steel manufacturing, aviation, and transoceanic shipping—require immense thermal and energy densities that current electric batteries cannot feasibly deliver. Consequently, natural gas and modern nuclear power must serve as transitional baseload buffers while green hydrogen and grid-scale storage mature.

In conclusion, I firmly support the total obsolescence of fossil fuels as humanity’s ultimate energy destination. However, to avert severe socioeconomic collapse, this transition must proceed through strategic capital investment in renewable infrastructure and grid modernization, ultimately phasing out hydrocarbons completely as clean technologies achieve baseload parity.`,
    vocabularyHighlights: [
      { word: 'catastrophic ecological ramifications', meaning: 'những hệ lụy sinh thái thảm khốc' },
      { word: 'existential imperative', meaning: 'mệnh lệnh sống còn' },
      { word: 'chronic intermittency', meaning: 'tính chập chờn / không liên tục kinh niên' },
      { word: 'debilitating brownouts', meaning: 'tình trạng sụt giảm điện áp làm tê liệt lưới điện' },
      { word: 'transitional baseload buffers', meaning: 'nguồn điện phụ tải nền chuyển tiếp' }
    ]
  },

  // =========================================================================
  // CAMBRIDGE IELTS 17
  // =========================================================================
  {
    id: 'cam-17-t1-grange-park',
    taskNumber: 1,
    type: 'map',
    topic: 'urban',
    isCambridge: true,
    source: 'cambridge',
    cambridgeBook: 17,
    cambridgeTest: 1,
    title: 'Cambridge 17 Test 1: Redevelopment of Grange Park (1920 vs Today)',
    prompt: 'The plans below show Grange Park in 1920 and how it looks today.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    minWords: 150,
    timeLimit: 20,
    keywords: ['Grange Park', 'amphitheatre', 'rose garden', 'water feature', 'café', 'park modernization'],
    mapChanges: [
      { feature: 'Bandstand', past: 'Centrally located musical bandstand', present: 'Replaced by a large open-air amphitheatre for concerts' },
      { feature: 'Fountain', past: 'Ornamental fountain in northeast', present: 'Converted into a modern glass café with outdoor seating' },
      { feature: 'Glasshouse', past: 'Victorian glasshouse in southeast', present: 'Demolished to install a children’s adventure water play area' },
      { feature: 'Rose Gardens', past: 'Separated rose gardens in northern corners', present: 'Consolidated into a central landscaped rose promenade' }
    ],
    outline: {
      introduction: 'Paraphrase the two park plans depicting Grange Park in 1920 compared with its contemporary layout.',
      overview: 'Highlight the park’s evolution from a formal, quiet Edwardian garden into an active, amenity-rich recreational venue for families and live entertainment.',
      body1: 'Detail central and northern changes: replacement of the bandstand by an amphitheater, and replacement of the fountain by a café.',
      body2: 'Detail southern alterations: demolition of the glasshouse for a children’s water park and reorganization of seating and rose gardens.'
    },
    modelAnswer: `The two maps illustrate the structural and recreational modifications undertaken in Grange Park from its opening in 1920 to the present day.

Overall, it is readily noticeable that the park has evolved from a traditional, tranquil Victorian stroll garden into a dynamic, family-oriented recreational space featuring modern catering and entertainment amenities.

In 1920, the heart of the park was occupied by a circular musical bandstand surrounded by shaded benches. Today, this structure has been entirely superseded by a substantially larger amphitheatre designed for live acoustic concerts and theatrical performances. Concurrently, the ornamental water fountain situated on the northeastern boundary was dismantled to construct a contemporary glass café with open-air terrace seating.

Turning to the southern half, the Victorian glasshouse that previously bordered the southeastern entrance was removed to facilitate the installation of an interactive children’s water playground. Furthermore, while the rose gardens were originally segregated into isolated quadrants flanking the northern gates in 1920, they have now been consolidated into an elongated, landscaped central rose promenade. Finally, an underground car parking lot was added beneath the western entrance to accommodate motorized visitors.`,
    vocabularyHighlights: [
      { word: 'family-oriented recreational space', meaning: 'không gian giải trí hướng tới gia đình' },
      { word: 'superseded by a substantially larger amphitheatre', meaning: 'được thay thế bằng một khán đài biểu diễn lớn hơn đáng kể' },
      { word: 'interactive water playground', meaning: 'sân chơi nước tương tác cho trẻ nhỏ' },
      { word: 'consolidated into an elongated promenade', meaning: 'hợp nhất thành một lối đi dạo kéo dài' }
    ]
  },
  {
    id: 'cam-17-t2-risk-taking',
    taskNumber: 2,
    type: 'opinion',
    topic: 'psychology',
    isCambridge: true,
    source: 'cambridge',
    cambridgeBook: 17,
    cambridgeTest: 1,
    title: 'Cambridge 17 Test 1: Taking Risks in Professional and Personal Life',
    prompt: 'It is important for people to take risks, both in their professional lives and their personal lives. Do you think the advantages of taking risks outweigh the disadvantages?',
    minWords: 250,
    timeLimit: 40,
    keywords: ['Calculated risks', 'career stagnation', 'entrepreneurship', 'comfort zone', 'personal growth', 'downside mitigation'],
    outline: {
      introduction: 'Introduce the concept of risk-taking versus risk-aversion. State thesis: while uncalculated recklessness is harmful, calculated risk-taking is indispensable for innovation and self-actualization, outweighing the downsides.',
      body1: 'Disadvantages of risks: potential financial insolvency, psychological anxiety from failure, relationship strains.',
      body2: 'Advantages of calculated risks: breaking career stagnation, fostering revolutionary entrepreneurial breakthroughs, expanding personal resilience.',
      conclusion: 'Reiterate that calculated risks are the fundamental catalysts for personal growth and societal advancement.'
    },
    modelAnswer: `The willingness to embrace uncertainty and undertake risks is frequently regarded as a defining catalyst for both career advancement and personal maturity. While reckless gambles undeniably invite severe pitfalls, I firmly believe that the transformative advantages of calculated risk-taking substantially outweigh the potential disadvantages.

On the one hand, risk-taking carries tangible vulnerabilities that cannot be trivialized. In professional spheres, venturing into speculative business enterprises or making volatile investments without rigorous due diligence can lead to catastrophic financial insolvency and professional ruin. Personally, sudden and ill-considered decisions—such as uprooting one’s family to relocate abroad without financial reserves—can fracture familial stability and induce chronic psychological stress. When individuals confuse courageous ambition with sheer impetuousness, failure can result in irreversible setbacks.

Nevertheless, remaining entrenched within one’s psychological "comfort zone" guarantees professional stagnation and regret. In dynamic global markets, breakthrough innovations—exemplified by disruptive tech startups and medical discoveries—arise exclusively because visionaries took bold leaps of faith despite the likelihood of failure. On an individual level, pursuing unfamiliar vocations or learning challenging skills fosters mental resilience and adaptive problem-solving. Even when high-stakes endeavors fail, the experiential wisdom gained inevitably fortifies character, enabling individuals to navigate subsequent challenges with enhanced strategic acumen.

In conclusion, although reckless risk-taking entails legitimate dangers of failure and financial distress, these downsides can be prudently mitigated through meticulous planning and contingency frameworks. Ultimately, deliberate, calculated risks are indispensable engines of human progress, conferring rewards that vastly surpass the illusory security of perpetual caution.`,
    vocabularyHighlights: [
      { word: 'defining catalyst', meaning: 'chất xúc tác mang tính định hình' },
      { word: 'catastrophic financial insolvency', meaning: 'sự phá sản tài chính thảm khốc' },
      { word: 'comfort zone', meaning: 'vùng an toàn tâm lý' },
      { word: 'disruptive tech startups', meaning: 'các công ty khởi nghiệp công nghệ đột phá' },
      { word: 'experiential wisdom', meaning: 'trí tuệ rút ra từ trải nghiệm thực tế' }
    ]
  },

  // =========================================================================
  // CAMBRIDGE IELTS 16
  // =========================================================================
  {
    id: 'cam-16-t1-housing-tenure',
    taskNumber: 1,
    type: 'bar',
    topic: 'society',
    isCambridge: true,
    source: 'cambridge',
    cambridgeBook: 16,
    cambridgeTest: 1,
    title: 'Cambridge 16 Test 1: Owned vs Rented Accommodation in England and Wales',
    prompt: 'The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    minWords: 150,
    timeLimit: 20,
    keywords: ['Home ownership', 'rented accommodation', 'housing tenure', 'England and Wales', 'demographic century'],
    chartData: {
      type: 'bar',
      labels: ['1918', '1939', '1953', '1971', '1991', '2001', '2011'],
      datasets: [
        { label: 'Owned Accommodation (%)', data: [22, 32, 32, 50, 67, 69, 64], backgroundColor: '#3B82F6' },
        { label: 'Rented Accommodation (%)', data: [78, 68, 68, 50, 33, 31, 36], backgroundColor: '#F59E0B' }
      ]
    },
    outline: {
      introduction: 'Paraphrase the bar chart showing home ownership versus tenancy in England and Wales from 1918 to 2011.',
      overview: 'Rented housing plummeted from overwhelming dominance in 1918; home ownership rose steadily to peak in 2001 before dipping slightly; parity occurred in 1971.',
      body1: 'Detail early century (1918-1971): rental dropped from 78% to 50%, while ownership rose from 22% to reach an exact 50-50 parity in 1971.',
      body2: 'Detail late period (1991-2011): ownership crested at 69% in 2001, before rentals rebounded modestly to 36% in 2011.'
    },
    modelAnswer: `The bar chart examines shifts in housing tenure across England and Wales over nearly a century, spanning from 1918 to 2011.

Overall, it is readily apparent that the housing landscape underwent an inversion over the surveyed era. While renting was overwhelmingly predominant at the end of the First World War, home ownership experienced sustained growth to become the majority tenure by the late twentieth century, with exact parity achieved in 1971.

In 1918, nearly four-fifths (78%) of all households lived in rented properties, whereas a mere 22% possessed their own homes. Over the ensuing five decades, tenancy figures fell progressively to 68% in 1939 and 1953, before declining to exactly 50% in 1971. Concurrently, home ownership mirrored this shift by escalating steadily to match the rental proportion at 50% in the same year.

Following 1971, home ownership consolidated its dominance, surging to 67% in 1991 and reaching a historic peak of 69% in 2001. However, during the final decade, this upward trajectory reversed slightly, as ownership dipped to 64% in 2011, while rented accommodation recorded a modest resurgence to close at 36%.`,
    vocabularyHighlights: [
      { word: 'housing tenure', meaning: 'hình thức sở hữu nhà ở' },
      { word: 'underwent an inversion', meaning: 'trải qua một sự đảo ngược vị thế' },
      { word: 'exact parity achieved', meaning: 'đạt được sự cân bằng tuyệt đối (50-50)' },
      { word: 'modest resurgence', meaning: 'sự trỗi dậy khiêm tốn trở lại' }
    ]
  },
  {
    id: 'cam-16-t2-sugar-tax',
    taskNumber: 2,
    type: 'opinion',
    topic: 'health',
    isCambridge: true,
    source: 'cambridge',
    cambridgeBook: 16,
    cambridgeTest: 3,
    title: 'Cambridge 16 Test 3: Taxing Sugary Manufactured Foods to Improve Public Health',
    prompt: 'Many manufactured food and drink products contain high levels of sugar, which causes many health problems. Some people say that sugary products should be made more expensive so that people are encouraged to consume less sugar.\n\nDo you agree or disagree?',
    minWords: 250,
    timeLimit: 40,
    keywords: ['Sugar tax', 'manufactured foods', 'obesity', 'fiscal health policy', 'regressive taxation', 'subsidies'],
    outline: {
      introduction: 'Introduce the proposal to elevate the cost of sugary products via taxes. State thesis: while price hikes are effective, they must be coupled with subsidies for healthy foods to avoid regressive inequality.',
      body1: 'Why sugar taxes work: proved effective in UK/Mexico soft drink industry reformulation and consumption reduction.',
      body2: 'Limitations and fairness: regressive burden on low-income demographics; need for subsidizing fresh produce and mandatory public school nutrition standards.',
      conclusion: 'Reiterate that financial disincentives on sugar succeed best when paired with accessible healthy alternatives.'
    },
    modelAnswer: `The rampant ubiquity of refined sugar in commercially processed foods has fueled widespread health crises, encompassing adolescent obesity, dental caries, and type 2 diabetes. To counteract these alarming epidemics, it has been proposed that governments artificially elevate the price of sugary goods through specialized taxation. While I support fiscal disincentives on sugar, I argue that price hikes must be accompanied by subsidies on nutritious staples to ensure equitable public health outcomes.

Empirical evidence demonstrates that targeted "sugar taxes" provide potent economic disincentives that alter consumer habits. When governments in nations like the United Kingdom and Mexico imposed levies on high-sugar carbonated beverages, soft drink manufacturers voluntarily reformulated their recipes to circumvent the tax bracket, removing thousands of tons of sugar from national food supplies. Furthermore, price-sensitive shoppers—particularly teenagers and young adults who consume high volumes of confectionery and energy drinks—drastically reduced their intake in response to higher shelf prices, successfully suppressing caloric consumption.

However, relying exclusively on punitive pricing carries regressive economic drawbacks. Lower-income families spend a disproportionate percentage of their household income on food; imposing indiscriminate taxes on accessible groceries can exacerbate financial hardship without guaranteeing that families can afford fresh produce. Therefore, fiscal policy must function as a dual-action mechanism: tax revenues derived from sugary snacks should be ring-fenced to subsidize organic fruits, vegetables, and whole grains. Furthermore, governments should implement mandatory bans on junk-food advertising aimed at children and reform public school lunch standards.

In conclusion, elevating the cost of sugary manufactured items is a commendable and clinically verified strategy to curb excessive sugar consumption. However, to maximize efficacy and social equity, financial penalties on harmful foods must be married to positive subsidies that make wholesome nutrition universally affordable.`,
    vocabularyHighlights: [
      { word: 'rampant ubiquity of refined sugar', meaning: 'sự tràn lan phổ biến của đường tinh luyện' },
      { word: 'potent economic disincentives', meaning: 'những rào cản kinh tế hữu hiệu' },
      { word: 'circumvent the tax bracket', meaning: 'né tránh khung áp thuế' },
      { word: 'regressive economic drawbacks', meaning: 'những bất cập kinh tế đánh nặng lên người nghèo' },
      { word: 'ring-fenced to subsidize', meaning: 'được quy hoạch riêng để trợ cấp' }
    ]
  },

  // =========================================================================
  // CAMBRIDGE IELTS 15 & 10 CLASSICS
  // =========================================================================
  {
    id: 'cam-15-t1-coffee-tea',
    taskNumber: 1,
    type: 'bar',
    topic: 'society',
    isCambridge: true,
    source: 'cambridge',
    cambridgeBook: 15,
    cambridgeTest: 1,
    title: 'Cambridge 15 Test 1: Coffee and Tea Buying Habits in Australian Cities',
    prompt: 'The chart below shows the results of a survey on coffee and tea buying and drinking habits in five Australian cities.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    minWords: 150,
    timeLimit: 20,
    keywords: ['Coffee habits', 'tea consumption', 'café culture', 'Sydney', 'Melbourne', 'Brisbane', 'Adelaide', 'Hobart'],
    chartData: {
      type: 'bar',
      labels: ['Sydney', 'Melbourne', 'Brisbane', 'Adelaide', 'Hobart'],
      datasets: [
        { label: 'Bought instant coffee in last 4 weeks (%)', data: [46, 48, 53, 50, 54], backgroundColor: '#F59E0B' },
        { label: 'Bought fresh coffee in last 4 weeks (%)', data: [44, 43, 34, 34, 38], backgroundColor: '#3B82F6' },
        { label: 'Went to a café for coffee or tea in last 4 weeks (%)', data: [61, 63, 55, 49, 63], backgroundColor: '#10B981' }
      ]
    },
    outline: {
      introduction: 'Paraphrase the bar chart illustrating coffee and tea consumption and purchasing behaviors across 5 Australian metropolitan centers.',
      overview: 'Visiting a café was the most popular activity in almost all cities except Adelaide; instant coffee was preferred over fresh coffee everywhere.',
      body1: 'Detail café attendance: highest in Melbourne and Hobart (63%), followed by Sydney (61%), while Adelaide was the only city under 50%.',
      body2: 'Detail instant versus fresh coffee: instant buying hovered around 46%-54%, whereas fresh coffee was lowest in Brisbane and Adelaide (34%).'
    },
    modelAnswer: `The bar chart compares the beverage-purchasing and drinking patterns of residents in five Australian urban centers—Sydney, Melbourne, Brisbane, Adelaide, and Hobart—over a four-week period.

Overall, it is readily apparent that patronizing cafés for coffee or tea was the predominant activity in four out of the five surveyed cities. Furthermore, consumer preference for instant coffee consistently exceeded that for fresh coffee across all metropolitan areas.

Café attendance was highest in Melbourne and Hobart, where exactly 63% of residents reported visiting a café, followed closely by Sydney at 61%. Brisbane also recorded a robust café culture at 55%. In stark contrast, Adelaide was the sole city where café patronage was not the leading category, registering just under half (49%) of the population.

Regarding packaged purchases, buying instant coffee proved consistently popular across all five cities, ranging from 46% in Sydney to peaks of 53% in Brisbane and 54% in Hobart. Conversely, fresh coffee was the least common habit, with Brisbane and Adelaide recording the lowest proportions at 34% each, while Sydney and Melbourne saw higher uptake at 44% and 43% respectively.`,
    vocabularyHighlights: [
      { word: 'beverage-purchasing patterns', meaning: 'các thói quen mua đồ uống' },
      { word: 'patronizing cafés', meaning: 'lui tới các quán cà phê' },
      { word: 'robust café culture', meaning: 'văn hóa cà phê sôi động' },
      { word: 'uptake', meaning: 'mức độ tiếp nhận / tham gia' }
    ]
  },
  {
    id: 'cam-10-t1-brick-manufacturing',
    taskNumber: 1,
    type: 'process',
    topic: 'tech',
    isCambridge: true,
    source: 'cambridge',
    cambridgeBook: 10,
    cambridgeTest: 1,
    title: 'Cambridge 10 Test 1: The Manufacturing of Bricks for the Building Industry',
    prompt: 'The diagram below shows the process by which bricks are manufactured for the building industry.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    minWords: 150,
    timeLimit: 20,
    keywords: ['Brick manufacturing', 'clay excavation', 'metal grid', 'moulding', 'drying kiln', 'cooling chamber'],
    processSteps: [
      { step: 1, name: 'Clay Excavation', desc: 'Clay is excavated from the ground using a mechanical digger' },
      { step: 2, name: 'Crushing & Filtering', desc: 'Clay is passed through a metal grid and roller crushers with sand and water' },
      { step: 3, name: 'Shaping', desc: 'Clay is extruded and wire-cut into blocks or pressed into moulds' },
      { step: 4, name: 'Drying', desc: 'Fresh bricks are dried in a drying oven for 24 to 48 hours' },
      { step: 5, name: 'Kiln Firing', desc: 'Bricks undergo moderate heat (200-980°C) and high heat (870-1300°C) in a kiln' },
      { step: 6, name: 'Cooling & Packaging', desc: 'Bricks cool for 48 to 72 hours in a chamber before being stacked and delivered' }
    ],
    outline: {
      introduction: 'Paraphrase the multi-step linear industrial procedure for brick manufacturing from clay extraction to delivery.',
      overview: 'The process comprises seven primary stages, beginning with raw earth excavation and concluding with final transportation.',
      body1: 'Detail initial mechanical phases: clay excavation, metal grid filtering, roller crushing, and wire cutting/moulding.',
      body2: 'Detail thermal treatment and delivery: oven drying for 24-48 hours, kiln firing up to 1300°C, chamber cooling, and truck delivery.'
    },
    modelAnswer: `The diagram illustrates the sequential linear procedure involved in the industrial production of bricks for the construction sector.

Overall, the manufacturing process encompasses seven continuous stages, progressing from the extraction of raw geological clay to mechanical moulding, thermal treatment, cooling, and ultimate distribution.

In the initial stage, clay is excavated from the earth using a large mechanical digger. The raw material is then placed onto a vibrating metal grid to remove large debris before passing through heavy roller crushers, where it is thoroughly blended with water and sand. Next, the malleable mixture is either fed into an extruder and cut into uniform blocks with a wire cutter, or pressed directly into rectangular moulds.

Following the shaping phase, the moist bricks are transferred to a drying oven, where they cure for 24 to 48 hours. Subsequently, the dried bricks enter a two-phase kiln firing process: first undergoing moderate heating between 200°C and 980°C, followed by extreme thermal hardening reaching up to 1300°C. In the final phases, the fired bricks are placed into a cooling chamber for 48 to 72 hours, after which they are packaged on pallets and transported by delivery trucks to construction sites.`,
    vocabularyHighlights: [
      { word: 'sequential linear procedure', meaning: 'quy trình tuyến tính tuần tự' },
      { word: 'malleable mixture', meaning: 'hỗn hợp dễ uốn nắn / tạo hình' },
      { word: 'two-phase kiln firing', meaning: 'quá trình nung lò 2 giai đoạn' },
      { word: 'ultimate distribution', meaning: 'khâu phân phối cuối cùng' }
    ]
  }
];

export const CAMBRIDGE_WRITING_TASKS = RAW_CAMBRIDGE_WRITING_TASKS.map(task => {
  const withIllus = ensureTaskIllustration(task);
  return {
    ...withIllus,
    sampleAnswer: withIllus.sampleAnswer || withIllus.modelAnswer || '',
    modelAnswer: withIllus.modelAnswer || withIllus.sampleAnswer || ''
  };
});
