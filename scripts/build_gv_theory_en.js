/**
 * scripts/build_gv_theory_en.js
 * Generates src/data/theoryHandbook/grammarVocabTheoryDataEn.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const GRAMMAR_VOCAB_THEORY_ARTICLES_EN = {
  'README': {
    title: '📚 IELTS Core Grammar & Academic Vocabulary Guide',
    summary: '**Who is this for?** Learners at all levels (Band 4.5 → 8.0+) seeking quick reference for essential grammar structures and academic vocabulary frequently evaluated in the IELTS test.',
    stage: 'Core Grammar & Vocab Guide',
    content: `## 1. Why Grammar and Vocabulary Matter So Much

In IELTS Writing and Speaking, Grammar and Vocabulary account for **2 out of 4 official scoring criteria**, comprising approximately **50% of your total band score**:

| CRITERION | FULL NAME | WHAT EXAMINERS LOOK FOR |
| :--- | :--- | :--- |
| **LR** | Lexical Resource | Range, accuracy, natural collocations, spelling, and word formation |
| **GRA** | Grammatical Range and Accuracy | Structural diversity, complex clause mastery, and proportion of error-free sentences |

---

## 2. Handbook Roadmap (A1 – A7 & B1 – B6)

### Module A: Core Grammar Modules
- **A1. Sentence Structures**: Simple, compound, complex sentences and relative clauses.
- **A2. Tense Selection**: Choosing the right tenses by task and question type.
- **A3. Passive Voice**: Standard and impersonal passive constructions.
- **A4. Conditionals**: Zero to Third conditionals and inverted conditionals.
- **A5. Comparisons**: Comparative degrees and proportional formulations (*The more... the more...*).
- **A6. Advanced Grammar (Band 8.0+)**: Inversion, cleft sentences, participle clauses, and nominalization.
- **A7. Common ESL Pitfalls**: Typical errors and a 5-minute pre-submission checklist.

### Module B: High-Yield Vocabulary & Error Management
- **B1. Cohesive Devices**: Transition markers categorized by argumentative function.
- **B2. Task 1 Data Lexis**: Verbs, adverbs, and proportions for charts and diagrams.
- **B3. Academic Collocations**: High-frequency collocations across 8 classic IELTS topics.
- **B4. Academic Word List (AWL)**: Word families and paraphrasing via part-of-speech shifts.
- **B5. Speaking Functional Language**: Natural speech acts and conversational fillers.
- **B6. Error Log & Paraphrase Journal**: Template and methodology to track and eliminate recurring errors.

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'grammar-sentence-structures': {
    title: 'A1. Simple, Compound, Complex Sentences & Relative Clauses',
    summary: 'Mastering syntactic hierarchy: simple sentences, compound linkers (FANBOYS), complex subordinating clauses, and defining vs non-defining relative clauses.',
    stage: 'A1. Core Sentence Structures',
    content: `## 1. The Four Syntactic Sentence Types

Cambridge examiners assess your ability to balance simple and complex structures. Relying exclusively on simple sentences caps GRA at Band 5.0, while convoluted, fragmented clauses lead to incoherence.

### 1. Simple Sentence (One Independent Clause)
- *Structure*: Subject + Verb + Object.
- *Example*: *"Renewable energy sources reduce carbon emissions."*

### 2. Compound Sentence (Two Independent Clauses)
- *Structure*: Independent Clause + Coordinating Conjunction (FANBOYS: For, And, Nor, But, Or, Yet, So) + Independent Clause.
- *Example*: *"Public transit is affordable, **so** many commuters utilize it daily."*
- *Crucial Rule*: Never join two independent clauses with only a comma (avoid Comma Splices).

### 3. Complex Sentence (Independent Clause + Dependent Clause)
- *Structure*: Subordinating conjunction (*Although, Because, Whereas, While, Since, If*) + Clause.
- *Example*: *"Although electric vehicles incur higher initial costs, their operational efficiency yields long-term savings."*

### 4. Compound-Complex Sentence
- *Structure*: At least two independent clauses and one dependent clause.
- *Example*: *"Although urbanization fuels economic prosperity, it escalates municipal living costs, and low-income families often suffer the most."*

---

## 2. Relative Clauses (Defining vs Non-Defining)

### Defining Relative Clauses (Essential Information - No Commas):
- *"Students **who participate in extracurricular activities** develop enhanced interpersonal competencies."*

### Non-Defining Relative Clauses (Extra Information - Commas Mandatory):
- *"Solar energy, **which is entirely renewable**, represents a sustainable long-term solution."*

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'grammar-tenses-by-task': {
    title: 'A2. Choosing the Right Tenses by Task & Module',
    summary: 'Strategic tense selection for Task 1, Task 2, and Speaking Parts 1-3: past simple for historical data, prospective modals for future charts, and narrative tenses.',
    stage: 'A2. Tense Selection Rules',
    content: `## 1. Tense Selection in IELTS Writing Task 1

The tense in Task 1 is strictly dictated by the **time markers in the visual prompt**:

| Time Context | Appropriate Tenses | Example |
| :--- | :--- | :--- |
| **Past Years Only** (e.g., 1990 - 2010) | Past Simple, Past Perfect | *\"Consumer spending surged before leveling off in 2005.\"* |
| **No Time Markers / Current** | Present Simple | *\"The diagram illustrates the sequential stages of paper recycling.\"* |
| **Future Projections** (e.g., 2030 - 2050) | Modals of Projection, Future Passive | *\"Solar power is projected to account for 35% of total generation.\"* |
| **Spanning Past to Future** | Past Simple + Present Perfect + Prospective Modals | *\"While oil consumption peaked in 2010, it is anticipated to decline.\"* |

---

## 2. Tense Selection in Writing Task 2 & Speaking
- **Present Simple**: Default tense for general truths, societal phenomena, and sustained opinions.
- **Present Perfect**: Bridges past developments to current reality (*"Technological advances have revolutionized pedagogy"*).
- **Speaking Part 2 (Storytelling)**: Dominantly Past Simple and Past Continuous for narrative vividness.

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'grammar-passive-voice': {
    title: 'A3. Passive & Impersonal Passive Voice in Academic Contexts',
    summary: 'Academic distancing and objective register: manufacturing process diagrams, impersonal passive constructions (It is argued that...), and when to avoid overusing passives.',
    stage: 'A3. Passive Voice Strategy',
    content: `## 1. When to Use the Passive Voice

In academic writing, the passive voice shifts emphasis from the actor (the agent) to the **action, process, or object receiving the action**.

### Core IELTS Use Cases:
1. **Task 1 Manufacturing Processes**: The human actor is irrelevant; only the mechanical progression matters (*"Raw limestone is extracted, crushed, and heated in a rotary kiln"*).
2. **Task 2 Impersonal Stances**: Creating scholarly distance (*"It is widely contended that higher tuition fees disincentivize underprivileged students"*).

---

## 2. Impersonal Passive Reporting Structures (Band 7.5+)
- *It is widely acknowledged that...*
- *It can be argued that...*
- *It has long been recognized that...*
- *[Subject] is believed / observed / estimated to + verb...*
  - Example: *"Urban sprawl is observed to exacerbate environmental degradation."*

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'grammar-conditionals': {
    title: 'A4. Comprehensive Conditionals & Inversions',
    summary: 'First, Second, Third, and Mixed conditionals with academic inversion patterns (Were it not for, Had they implemented) to maximize GRA.',
    stage: 'A4. Conditionals & Inversions',
    content: `## 1. Overview of Conditionals in IELTS

Conditionals allow you to evaluate hypotheticals, propose policy consequences, and demonstrate sophisticated syntactic control.

### Type 1: Realistic Future Condition
- *Formula*: If + Present Simple, will + Verb.
- *Example*: *"If municipal authorities invest in light rail, vehicular congestion will abate."*

### Type 2: Hypothetical Present Condition
- *Formula*: If + Past Simple, would + Verb.
- *Example*: *"If governments imposed prohibitive levies on fossil fuels, industries would accelerate decarbonization."*

### Type 3: Counterfactual Past Condition
- *Formula*: If + Past Perfect, would have + Past Participle.
- *Example*: *"If strict containment protocols had been enforced earlier, the contagion would not have spread so precipitously."*

---

## 2. Inverted Conditionals for Band 8.0+
- **Inverted Type 2**: *"**Were governments to allocate** greater capital toward scientific research, long-term economic prosperity would follow."*
- **Inverted Type 3**: *"**Had timely measures been adopted**, the ecological disaster could have been averted."*

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'grammar-comparison-structures': {
    title: 'A5. Diverse Comparative Structures',
    summary: 'Comparative degrees, proportional structures (The more... the more...), and quantitative comparisons in Task 1 and Task 2.',
    stage: 'A5. Comparative Structures',
    content: `## 1. Varied Comparative Structures for Task 1 & Task 2

Examiners evaluate your ability to compare data points without repeating simple "more than" phrases.

### 1. Proportional Parallel Comparison (The... The...)
- *Formula*: The + Comparative Adj/Adv + Clause, The + Comparative Adj/Adv + Clause.
- *Example*: *"The more extensively public transit is subsidized, the more willingly commuters abandon private automobiles."*

### 2. Multiplicative Comparisons (Twice, Three Times, Fold)
- *"Consumption of poultry was **three times as high as** that of beef."*
- *"Expenditure on digital subscriptions **increased fourfold** over the decade."*

### 3. Degree Modification Adverbs
- *Substantial difference*: *substantially higher, considerably greater, markedly lower.*
- *Minor difference*: *marginally superior, slightly below, virtually indistinguishable from.*

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'grammar-advanced-structures': {
    title: 'A6. Inversions, Cleft Sentences, Participle Clauses & Nominalization',
    summary: 'Four elite structures to break into Band 7.5+: negative adverbial inversions, cleft sentences, reduced participle clauses, and nominalized noun phrases.',
    stage: 'A6. Advanced Grammar Band 8.0+',
    content: `## 1. Negative Inversions
- *Formula*: Negative Adverbial + Auxiliary Verb + Subject + Main Verb.
- *Examples*:
  - *"**Not only does** excessive screen time impair eyesight, **but it also disrupts** cognitive development."*
  - *"**Seldom do** market forces alone address systemic environmental degradation."*

---

## 2. 'It' Cleft Sentences (Focus & Emphasis)
- *Formula*: It is/was + [Emphasized Subject/Complement] + that/who...
- *Example*: *"It is structural economic inequality, rather than personal apathy, that drives high crime rates in urban slums."*

---

## 3. Reduced Participle Clauses
- *Formula*: Participle phrase replacing an adverbial or relative clause.
- *Example*: *"Having exhausted their finite domestic budgets, emerging economies must rely on multilateral assistance."*
- *Example*: *"Automakers have intensified research into solid-state batteries, thereby accelerating the transition to zero-emission mobility."*

---

## 4. Nominalization (Transforming Verbs into Academic Nouns)
- *Informal*: *"Because cities are growing very fast, they need more water and electricity."*
- *Nominalized (Band 8.0+)*: *"Rapid urban expansion has catalyzed unprecedented municipal demand for utility infrastructure."*

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'grammar-common-errors-vietnamese': {
    title: 'A7. Typical Vietnamese ESL Grammar Errors & Correction Checklist',
    summary: 'Eradicating persistent ESL errors: subject-verb disagreement, comma splices, countable/uncountable noun confusion, preposition misuse, and double conjunctions.',
    stage: 'A7. Common Errors Checklist',
    content: `## 1. Top 5 Persistent Grammar Slips

### 1. Double Conjunction Trap (Because... So / Although... But)
- ❌ *Incorrect*: *Because tuition is expensive, so many students drop out.*
- ✅ *Correct*: *Because tuition is expensive, many students drop out.* (Never pair Because with So).

### 2. Subject-Verb Agreement with Complex Noun Phrases
- ❌ *Incorrect*: *The number of vehicles on urban roads have increased.*
- ✅ *Correct*: *The number of vehicles on urban roads **has** increased.* ("The number" is singular).

### 3. Countable vs Uncountable Noun Pitfalls
- Uncountable words that never take plural '-s': *information, equipment, advice, evidence, software, infrastructure, furniture.*

### 4. Comma Splice Errors
- ❌ *Incorrect*: *Public parks improve air quality, they provide recreational spaces.*
- ✅ *Correct*: *Public parks improve air quality; furthermore, they provide recreational spaces.*

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'vocab-linking-devices': {
    title: 'B1. Cohesive Devices & Transition Linkers by Function',
    summary: 'Functional transition markers: addition, contrast, concession, cause & effect, exemplification, and summary linkers.',
    stage: 'B1. Cohesive Devices',
    content: `## 1. Categorized Functional Linkers

Examiners penalize essays that overuse generic linkers like "Firstly, Secondly, Furthermore". Vary your cohesive repertoire according to argumentative function:

| Function | High-Scoring Academic Linkers |
| :--- | :--- |
| **Addition** | *Furthermore, In addition, Additionally, Moreover, Not to mention* |
| **Contrast** | *Conversely, In stark contrast, By comparison, On the other hand* |
| **Concession** | *Admittedly, Notwithstanding, Despite this, Albeit, Even so* |
| **Cause & Effect** | *Consequently, As a consequence, As a result, Thereby (+ V-ing), Precipitating* |
| **Exemplification** | *A case in point is..., To illustrate, As demonstrated by, Specifically* |
| **Summary** | *In summary, To synthesize, All things considered, In the final analysis* |

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'vocab-task1-data-language': {
    title: 'B2. Task 1 Data Reporting & Trend Lexis',
    summary: 'Comprehensive vocabulary for trends, degrees of change, mathematical approximations, and fractional equivalents.',
    stage: 'B2. Task 1 Data Vocabulary',
    content: `## 1. Trend Verbs and Degree Adverbs

### Verbs for Increases:
- *Moderate*: rise, increase, climb, grow, advance.
- *Dramatic*: surge, soar, rocket, escalate.

### Verbs for Decreases:
- *Moderate*: decrease, drop, decline, fall, contract.
- *Dramatic*: plummet, plunge, slump, tumble.

### Modifying Adverbs:
- *Sharp / Sudden*: dramatically, precipitously, sharply, markedly.
- *Steady / Gradual*: steadily, consistently, progressively, incrementally.
- *Marginal / Slight*: marginally, negligibly, slightly, insignificantly.

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'vocab-topic-collocations': {
    title: 'B3. Academic Collocations Across 8 Core Topics',
    summary: 'High-yield academic collocations across Education, Environment, Technology, Healthcare, Society, Crime, Economy, and Global Culture.',
    stage: 'B3. Topic Collocations',
    content: `## 1. High-Yield Collocations by Core Topic

### 1. Education
- *Academic matriculation* | *Rote learning* | *Inculcate moral integrity* | *Pedagogical methodology*

### 2. Environment
- *Deplete finite fossil reserves* | *Carbon-intensive industrial practices* | *Ecological equilibrium* | *Mitigate climate vulnerability*

### 3. Technology
- *Ubiquitous digital integration* | *Algorithmic bias* | *Disruptive artificial intelligence* | *Automate manual operations*

### 4. Healthcare & Wellbeing
- *Sedentary lifestyle* | *Preventative medical intervention* | *Psychological distress* | *Equitable healthcare access*

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'vocab-academic-word-families': {
    title: 'B4. Academic Word List (AWL) & Part-of-Speech Paraphrasing',
    summary: 'AWL root families and paraphrasing through morphological shifts (verb <-> noun <-> adjective <-> adverb).',
    stage: 'B4. AWL Word Families',
    content: `## 1. Paraphrasing Through Morphological Shifts

A sophisticated method to paraphrase without searching for obscure synonyms is **changing the part of speech** of core words:

| Base Verb | Abstract Noun | Adjective Form | Adverb Form |
| :--- | :--- | :--- | :--- |
| *analyze* | *analysis* | *analytical* | *analytically* |
| *consume* | *consumption* | *consumable* | *consumingly* |
| *deteriorate*| *deterioration* | *deteriorative*| — |
| *innovate* | *innovation* | *innovative* | *innovatively* |
| *sustain* | *sustainability*| *sustainable* | *sustainably* |

- *Original*: *"The climate deteriorated rapidly."*
- *Paraphrase*: *"There was a rapid deterioration in climatic conditions."*

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'vocab-speaking-functional-language': {
    title: 'B5. Functional Language for IELTS Speaking',
    summary: 'Essential speech acts: expressing nuanced opinions, buying time with natural fillers, conceding opposing views, and speculating.',
    stage: 'B5. Speaking Functional Language',
    content: `## 1. Functional Speech Acts in IELTS Speaking

### 1. Buying Time When Surprised by a Prompt
- *"That is an intriguing question; I have never contemplated it from that angle before."*
- *"Off the top of my head, I would argue that..."*
- *"Let me reflect upon that for a brief moment..."*

### 2. Nuanced Stance & Hedging
- *"I am inclined to believe that..."*
- *"It is predominantly a matter of personal perspective, but in my view..."*

### 3. Concession & Pivoting
- *"While there is certainly validity in that perspective, on balance I believe..."*
- *"I can see why people hold that view; however, my personal experience suggests otherwise."*

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'error-log-and-paraphrase-journal': {
    title: 'B6. IELTS Error Log & Paraphrase Journal Template',
    summary: 'A systematic error-management template applying Root-Cause Analysis to permanently eradicate recurring lexical and grammatical errors.',
    stage: 'B6. Error Log & Paraphrase Journal',
    content: `## 1. The Root-Cause Error Management System

High-scoring test takers maintain an **Error Log** to identify their personal error blind spots before test day.

### The 4-Column Error Tracking Matrix:
| Error Category | What I Wrote (Mistake) | Why It Is Wrong (Root Cause) | Flawless Academic Correction |
| :--- | :--- | :--- | :--- |
| **Punctuation** | *Cars emit gases, they pollute.* | Comma splice between independent clauses. | *Cars emit gases; consequently, they pollute.* |
| **Collocation** | *Make more money for living.* | Unnatural phrasing in academic context. | *Earn a sustainable livelihood.* |
| **Grammar** | *Because X, so Y.* | Double conjunction forbidden in English. | *Because X, Y.* |

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  }
};

const targetFile = path.resolve(__dirname, '../src/data/theoryHandbook/grammarVocabTheoryDataEn.js');
const fileHeader = `/**
 * src/data/theoryHandbook/grammarVocabTheoryDataEn.js
 * Complete English edition of all 14 Grammar & Vocabulary Theory articles.
 */

export const GRAMMAR_VOCAB_THEORY_ARTICLES_EN = ${JSON.stringify(GRAMMAR_VOCAB_THEORY_ARTICLES_EN, null, 2)};
`;

fs.writeFileSync(targetFile, fileHeader, 'utf-8');
console.log(`Generated: ${targetFile} (${Object.keys(GRAMMAR_VOCAB_THEORY_ARTICLES_EN).length} articles)`);
