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
   paras → body paragraphs; chart → key into WINDOW_CHARTS (modal.js); sources → source line. */
const WINDOW_STORIES = {
  "Finland": {
    0: {
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
  },
};
