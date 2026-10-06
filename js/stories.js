/* ───────── COUNTRY STORIES ─────────
   Editorial text shown under the stats in a country's modal, keyed by country name (as in COUNTRIES).
   One string per paragraph. Countries without an entry show no story. */
const STORIES = {
  "Finland": [
    "Finland has topped the World Happiness Report every year since 2018. The foundations are real: universal healthcare, free education through university, generous parental leave, and one of the world's strongest social safety nets mean few Finns face catastrophe alone. Researchers argue this is exactly why Finland wins: not ecstatic joy, but the near-absence of the insecurity that drags a life rating down.",
    "But the #1 ranking is based on a single question: rate your life today, zero to ten. Ask a different question, and Finland falls. When asked how people actually felt yesterday, Finland placed 47th of 164 on positive affect. Only 68% felt well-rested — rank 73 and 35.4% experienced worry, rank 79.",
    "Digging further, roughly 1,600 alcohol-related deaths a year, and a suicide rate halved since the 1990s yet still high for Western Europe. Students born abroad face discrimination at 51%, against 31% of Finnish-born peers. In the EU's survey of Black residents, Finland recorded the highest rate of racist violence of any country measured.",
    "There is also sisu — the national virtue of enduring hardship without complaint. A culture that prizes not complaining will score well on a survey that asks people to complain.",
  ],
  "Taiwan": [
    "Taiwan ranks #1 of 164 on the Wellbeing Rankings. Taiwan reports the lowest sadness in the world at 7.3%, second-lowest worry at 17.8%, and second-lowest physical pain at 17.3%. Enjoyment and laughter both sit near 84%. Universal health insurance since 1995 and a life expectancy of 81.2 years underwrite it.",
    "But Taiwan's own data undercuts this ranking. Suicide returned to Taiwan's top ten causes of death in 2024 for the first time in fourteen years, at 17.4 per 100,000 — nearly double the global average of nine. Among those 65 and older, 25.5. Antidepressant use reached 1.65 million people, up 320,000 in five years, yet only 1.92% of the population is recorded as having treated depression and roughly 20% of those with depression seek help at all. Taiwanese work 2,008 hours a year against an OECD average of 1,683; overwork-related cardiovascular disease accounts for 10% of occupational illness cases but up to 81% of occupational deaths. The fertility rate is 0.695, the world's lowest.",
  ],
  "Bhutan": [
    "Bhutan built a state around the idea that happiness should be measured. Gross National Happiness surveys 11,052 citizens across 33 indicators — housing, schooling, literacy, service access, cultural participation — and counts someone happy only if they reach sufficiency across many domains at once, not one good score offsetting the rest. It is a more serious instrument than the single ladder question. The index rose from 0.743 in 2010 to 0.781 in 2022. Life expectancy has gone from 32 years in 1960 to roughly 70. Asked by outside pollsters how they felt yesterday, Bhutanese rank 6th of 164 on positive affect and 1st in the world on feeling well-rested, at 84.1%.",
    "But the headline figure is a choice. The same survey yields 93.6% happy or 48.1% happy depending on where the sufficiency threshold is drawn. Digging further, Bhutan ranks 145th of 164 on anger and 117th on physical pain, with life satisfaction at 5.196 out of 10 — rank 86. Recorded mental health cases rose from 2,878 in 2011 to 7,004 in 2015. Alcohol is a leading cause of death; alcoholic liver disease alone accounted for 15% of all deaths. In 2023, 1.5% of the population left for Australia in a single year, and 53% of recent migrants hold degrees against 7% of those who stayed.",
  ],
};

/* ───────── WINDOW STORIES ─────────
   Content for a specific window in a country's modal: WINDOW_STORIES[country][windowIndex].
   measure → label above the headline and the hover tooltip on the window; title → headline;
   paras → body paragraphs (bullets: true shows them as a bulleted list); chart → key into WINDOW_CHARTS (modal.js); sources → source line. */
const WINDOW_STORIES = {
  "Finland": {
    0: {
      measure: "Youth mental health",
      title: "Mental health gaps among children and teens are wide",
      paras: [
        "Among students in grades 8 and 9, 51% of those born abroad reported discrimination or bullying, compared with 31% of those whose parents were both born in Finland. In upper secondary school, 18% of boys born abroad reported at least moderate anxiety, against 7% of boys with a Finnish background. Across groups, girls report anxiety, school burnout, life dissatisfaction, and loneliness clearly more often than boys.",
      ],
      sources: ["Finnish Institute for Health and Welfare (THL), School Health Promotion Study 2025"],
    },
    1: {
      measure: "Proximity to nature",
      title: "Nature is never far away",
      paras: [
        "More than three-quarters of Finland is forest, the highest share in Europe, and another 10% is lakes, rivers and other water. Under the principle of jokamiehenoikeus — Every Person's Right — anyone may hike, camp and pick berries and mushrooms in any forest, regardless of who owns it. The Ministry of the Environment recommends that schools sit no more than 300 metres from a green area.",
      ],
      sources: ["Finnish Ministry of Agriculture and Forestry", "Finland Toolbox (Ministry for Foreign Affairs)"],
    },
    3: {
      measure: "Alcohol consumption",
      title: "Monthly binge drinking reaches one in five",
      paras: [
        "In 2023, 21% of Finns reported heavy episodic drinking at least once a month — six or more standard drinks on a single occasion. Overall, 28% exceeded the risk threshold on the AUDIT, a screening test for alcohol-related problems.",
      ],
      sources: ["Finnish Institute for Health and Welfare"],
    },
    4: {
      measure: "Trust",
      title: "Finns trust their institutions",
      paras: [
        "In 2025, 89% of people in Finland trusted the police and 75% trusted the courts. Trust in the civil service stood at 68%, against an OECD average of 45%, and trust in the national government at 49%, above the OECD average of 40%.",
      ],
      sources: ["OECD Survey on Drivers of Trust in Public Institutions 2026"],
    },
    6: {
      measure: "Youth life satisfaction",
      title: "Young people's life satisfaction is at a record low",
      paras: [
        "The Youth Barometer 2025 surveyed about 2,300 people aged 15 to 29 for the State Youth Council. Only 30% rated their life satisfaction 9 or 10 — the lowest since the survey began in 1994, and down from more than half a decade earlier. The national average hides a widening gap between generations.",
      ],
      sources: ["Yle"],
    },
    8: {
      measure: "Violence against women",
      title: "Violence against women is among the highest in the EU",
      paras: [
        "In the 2024 EU Gender-Based Violence Survey, 57.1% of Finnish women aged 18 to 74 reported experiencing physical or sexual violence or threats in their lifetime. 37.3% reported sexual violence, against an EU average of 17.2%. And 12% experienced violence from an intimate partner in the past year — the highest rate in the EU.",
      ],
      sources: ["EU Gender-Based Violence Survey (Eurostat, FRA, EIGE)", "Helsinki Times"],
    },
    10: {
      measure: "Antidepressant use",
      title: "Antidepressant use is rising, fastest among the young",
      paras: [
        "Antidepressant consumption in Finland has climbed roughly 75% since 2006, from about 56 daily doses per 1,000 people to 97.6. The rise stalled through the early 2010s, then resumed in 2016 and has continued every year since.",
        "The pattern is sharpest among young adults where usage had nearly doubled in the past 10 years. In 2024, close to 20% of Finnish women aged 18 to 29 were taking antidepressants, against 7.5% of men the same age — a significant gender gap that has widened as women's use climbed far faster than men's.",
        "Finland's under-30s now take more antidepressants and ADHD medication than young people anywhere else in the Nordics. According to Kela researcher Miika Vuori, fifteen years ago, Finland sat below its neighbours on both.",
      ],
      chart: "fi-antidepressants",
      sources: ["Finnish Statistics on Medicines 2024", "Helsinki Times"],
    },
    11: {
      measure: "Social infrastructure",
      title: "The state shares the work of raising children",
      paras: [
        "In 1948, Finland became the first country to serve free meals to every schoolchild, and roughly 900,000 students still receive one each school day — the world's longest-running universal school meal programme. Since a 2022 reform, each parent receives 160 days of paid parental allowance, and fathers of children born under the new rules have taken an average of 78 days.",
      ],
      sources: ["Finland Toolbox", "Kela"],
    },
    13: {
      measure: "Racism",
      title: "Minorities, especially Black immigrants, face severe racism",
      paras: [
        "In the EU Fundamental Rights Agency's 2023 survey Being Black in the EU, 63% of Black respondents in Finland reported racial discrimination in the past five years — the third highest of the countries surveyed. 54% reported racist harassment, and 11% racist violence, the highest of any country in the survey.",
      ],
      sources: ["EU Agency for Fundamental Rights, Being Black in the EU"],
    },
    14: {
      measure: "Death by suicide",
      title: "Suicide and alcohol deaths are still deep-rooted problems",
      paras: [
        "Finland has halved its suicide rate since the 1990s, yet it remains relatively high for Western Europe, where the EU average is 10.4 deaths per 100,000 people. In 2024, death rates fell for most major causes — but the suicide rate held flat. The same year saw about 1,600 alcohol-related deaths.",
      ],
      sources: ["Statistics Finland", "Eurostat", "The Conversation"],
    },
  },
  "Taiwan": {
    0: {
      measure: "Death by suicide",
      title: "Suicide is rising, and the reasons shift with age",
      paras: [
        "Suicide returned to Taiwan's ten leading causes of death in 2024",
        "Taiwan's crude rate is 16.9 per 100,000 (2025) — compared to a global average of 9.2 and Western Pacific's average of 9.5",
        "Rates are highest among the elderly, at 25.5 per 100,000",
        "Among 15- to 24-year-olds, the rate has nearly doubled in a decade",
        "The drivers differ by age: school, relationships and job prospects for the young; workplace stress and financial pressure in middle age; loneliness and illness in old age",
      ],
      chart: "tw-suicide",
      sources: ["Taiwan News", "Taipei Times", "WHO", "Chen et al.", "2024 Taiwan Health and Welfare Report – Ministry of Health and Welfare", "Chart: Ministry of Health and Welfare, national suicide statistics (2025 update)"],
    },
    2: {
      measure: "Depression",
      title: "Depression is on the rise but remains significantly underreported",
      paras: [
        "Only 1.92% of Taiwanese were recorded as having a depressive disorder in 2016 — a figure that likely reflects how few people seek treatment rather than how few need it. Among people over 50, just 27% with depression seek medical help, and only four in ten of those receive effective treatment. In Europe and the United States, by comparison, about half of people with depression seek care. Among the young, antidepressant use has doubled in the past decade for people under 30, and more than a quarter of college students show signs of depression.",
      ],
      sources: ["OCAC News", "CNA", "Taiwan News", "Wang et al."],
    },
    5: {
      measure: "Overwork",
      title: "Long hours carry a measurable risk",
      paras: [
        "Taiwanese workers average 2,008 hours a year — about 167 a month — the sixth-longest of 39 economies tracked by the OECD. The toll shows up in the heart and brain: as industry-average monthly hours rise from 169 to 187, the risk of overwork-related cardiovascular and cerebrovascular disease nearly quadruples.",
      ],
      sources: ["Taipei Times", "Lin et al."],
    },
    7: {
      measure: "Academic pressure",
      title: "School is driving adverse mental health experiences among the young",
      paras: [
        "Seven in ten Taiwanese high school students report high levels of stress, and 57% experience moderate to severe fatigue. The pressure starts early: 30% of junior high students have had thoughts of self-harm linked to their studies. Over the past decade, the suicide rate among 15- to 24-year-olds has nearly doubled.",
      ],
      sources: ["Broken Chalk", "Child Welfare League Foundation"],
    },
    10: {
      measure: "Loneliness",
      title: "Loneliness deepens with age",
      paras: [
        "Across studies, the average prevalence of loneliness in Taiwan is 12.6%. Among adults over 65, it rises to between 18% and 27%, depending on how it is measured.",
      ],
      sources: ["Hung et al.", "Tiunn et al."],
    },
  },
  "Bhutan": {
    0: {
      measure: "Alcohol consumption",
      bullets: true, // body shown as a bulleted list
      title: "Alcohol use is high, and a leading cause of death",
      paras: [
        "Alcohol consumption is socially accepted in Bhutan, with a prevalence of 42.4%",
        "More than 22% of consumers engage in heavy episodic drinking",
        "Harmful alcohol use is a top cause of mortality in Bhutan",
        "Among adolescents, 24.2% use alcohol and 16% use other substances",
      ],
      sources: ["Dendup et al."],
    },
  },
};
