import { getDb } from "./lib/db";

interface Testimonial {
  name: string;
  title: string;
  quote: string;
  rating: number;
}

interface BlogSection {
  heading: string;
  body: string;
}

interface BlogPost {
  title: string;
  slug: string;
  description: string;
  tag: string;
  sections: BlogSection[];
  meta_title: string;
  meta_description: string;
  read_time: string;
}

interface PageBlock {
  id: string;
  type: string;
  order: number;
  data: {
    html?: string;
    text?: string;
    heading?: string;
  };
}

interface Page {
  slug: string;
  title: string;
  meta_description: string;
  blocks: PageBlock[];
}

async function seedDemoContent() {
  const db = getDb();

  console.log("Starting demo content seeding...\n");

  // ============ TESTIMONIALS ============
  const testimonials: Testimonial[] = [
    {
      name: "Sarah Mitchell",
      title: "Marketing Executive, Age 38",
      quote:
        "After six months, I've noticed a meaningful shift in my energy levels and how I approach meals. The supplement fits naturally into my routine, and I feel more in control of my health journey.",
      rating: 5,
    },
    {
      name: "James Chen",
      title: "Tech Professional, Age 42",
      quote:
        "I was skeptical at first, but the combination of ingredients and the research behind them convinced me. I've felt more consistent throughout the day, and my digestion has improved noticeably.",
      rating: 5,
    },
    {
      name: "Priya Patel",
      title: "Wellness Coach, Age 35",
      quote:
        "As someone who works in health, I appreciate NutraGLP's evidence-based approach. My clients have seen real changes in their wellness markers, and I feel confident recommending it.",
      rating: 5,
    },
    {
      name: "Michael Torres",
      title: "Fitness Trainer, Age 40",
      quote:
        "The metabolic support has been a game-changer for my training regimen. Combined with consistent exercise, I've hit goals I wasn't sure were realistic. Highly impressed with the quality.",
      rating: 4,
    },
    {
      name: "Emma Richardson",
      title: "Nutrition Student, Age 28",
      quote:
        "The transparency around formulation and peer-reviewed research is rare in the supplement space. I started using it to complement my studies on metabolic health, and I've been genuinely surprised by the results.",
      rating: 5,
    },
  ];

  console.log("Inserting testimonials...");
  for (const testimonial of testimonials) {
    const query = `
      INSERT OR IGNORE INTO testimonials
      (name, title, quote, rating, published)
      VALUES (?, ?, ?, ?, 1)
    `;
    await db.execute(query, [
      testimonial.name,
      testimonial.title,
      testimonial.quote,
      testimonial.rating,
    ]);
  }
  console.log(`✓ Inserted ${testimonials.length} testimonials\n`);

  // ============ BLOG POSTS ============
  const blogPosts: BlogPost[] = [
    {
      title: "Understanding GLP-1: The Science Behind Metabolic Health",
      slug: "understanding-glp-1-science",
      description:
        "Explore the research behind GLP-1 technology and how it supports your body's natural metabolic processes. A comprehensive primer on the science powering modern wellness.",
      tag: "Science",
      meta_title: "GLP-1 Science Explained | NutraGLP",
      meta_description:
        "Learn the peer-reviewed science behind GLP-1 and how it supports metabolic health. Evidence-based insights for informed wellness decisions.",
      read_time: "8 min read",
      sections: [
        {
          heading: "What is GLP-1?",
          body: '<p>GLP-1, or glucagon-like peptide-1, is a naturally occurring hormone in your body that plays a crucial role in metabolic regulation. Discovered in the 1980s, GLP-1 has become the focus of significant scientific research due to its effects on glucose metabolism, appetite signaling, and overall metabolic health.</p><p>Your body produces GLP-1 in response to nutrient intake, particularly glucose. This hormone works by interacting with receptors throughout your body, influencing how your digestive system processes nutrients and how your brain receives satiety signals.</p>',
        },
        {
          heading: "The Research Foundation",
          body: '<p>Over 10,000 peer-reviewed studies have been published on GLP-1 in the past decade alone. Research in journals like Nature Metabolism and Diabetes Care consistently shows that supporting optimal GLP-1 function may contribute to healthier metabolic markers.</p><p>Studies suggest that individuals with optimized GLP-1 pathways tend to experience more stable energy levels, improved digestive comfort, and better metabolic flexibility. This research foundation informed the development of supplement formulations designed to complement your body\'s natural GLP-1 system.</p>',
        },
        {
          heading: "Beyond Weight Management",
          body: '<p>While much of the popular discussion focuses on one application, the metabolic science around GLP-1 is broader. Research indicates potential benefits for energy regulation, digestive health, cellular health, and sustained wellness across multiple systems.</p><p>The comprehensive approach to GLP-1 support through nutrition and lifestyle means you\'re not pursuing a single outcome, but rather supporting overall metabolic resilience and long-term wellness.</p>',
        },
        {
          heading: "NutraGLP\'s Approach to Support",
          body: '<p>Rather than attempting to artificially manipulate GLP-1 levels, NutraGLP formulations are designed using ingredients that may support your body\'s natural GLP-1 production and sensitivity. This evidence-based approach respects your body\'s intelligence while providing targeted nutritional support.</p><p>Our formulations combine plant-derived compounds, amino acids, and micronutrients that research suggests work synergistically to optimize metabolic pathways. This represents a sustainable, natural approach to modern wellness.</p>',
        },
      ],
    },
    {
      title: "Nutrition Strategy: Foods That Support Metabolic Health",
      slug: "nutrition-strategy-metabolic-health",
      description:
        "Discover evidence-based nutrition strategies that complement metabolic wellness supplements. Learn which foods and eating patterns support your body's natural processes.",
      tag: "Nutrition",
      meta_title: "Foods for Metabolic Health | NutraGLP Nutrition Guide",
      meta_description:
        "Practical nutrition strategies to support metabolic wellness. Evidence-based food choices that work with your body's natural systems.",
      read_time: "10 min read",
      sections: [
        {
          heading: "Protein and Metabolic Signaling",
          body: '<p>Adequate protein intake does more than build muscle—it also supports satiety hormones and metabolic signaling. Research suggests that consuming 25-40 grams of protein per meal may optimize how your body\'s hunger and fullness signals function.</p><p>Plant-based proteins like lentils, chickpeas, and hemp seeds work alongside animal sources. The variety supports different micronutrient profiles and digestive adaptations, creating nutritional resilience.</p>',
        },
        {
          heading: "Fiber-Rich Carbohydrates",
          body: '<p>Not all carbohydrates affect metabolism equally. Soluble fiber from oats, barley, and legumes may support healthy glucose metabolism and provide nourishment to your microbiome. Research in the American Journal of Clinical Nutrition suggests fiber intake directly influences metabolic markers.</p><p>Aim for 25-35 grams of fiber daily from whole food sources. This supports stable energy throughout the day and creates an optimal environment for metabolic wellness.</p>',
        },
        {
          heading: "Micronutrient Density",
          body: '<p>Chromium, berberine-rich foods, and compounds found in cruciferous vegetables support glucose metabolism at the cellular level. Leafy greens, Brussels sprouts, and broccoli contain sulforaphane and other phytonutrients with metabolic benefits documented in peer-reviewed research.</p><p>Colorful vegetables aren\'t just aesthetically pleasing—they provide a spectrum of micronutrients that support metabolic enzymes and cellular function.</p>',
        },
        {
          heading: "Sustainable Eating Patterns",
          body: '<p>Consistency matters more than perfection. Intermittent eating patterns, when structured appropriately, may support metabolic adaptation. However, the best eating pattern is one you can sustain long-term while maintaining nutritional adequacy.</p><p>Consider your lifestyle, preferences, and individual response when developing your nutrition strategy. A personalized approach typically yields better adherence and results than generic diet recommendations.</p>',
        },
      ],
    },
    {
      title: "Exercise and Metabolic Wellness: Building Your Routine",
      slug: "exercise-metabolic-wellness-routine",
      description:
        "Learn how to structure physical activity to maximize metabolic benefits. Combining exercise with proper supplementation creates a powerful wellness foundation.",
      tag: "Lifestyle",
      meta_title: "Exercise for Metabolic Health | Fitness & Wellness Guide",
      meta_description:
        "Build an exercise routine that supports metabolic wellness. Evidence-based fitness strategies to combine with proper nutrition and supplementation.",
      read_time: "9 min read",
      sections: [
        {
          heading: "Metabolic Impact of Different Exercise Types",
          body: '<p>Resistance training builds lean muscle tissue, which is metabolically active and supports resting metabolic rate. Studies show that three sessions weekly of strength training can meaningfully impact metabolic markers within 8-12 weeks.</p><p>Cardiovascular exercise, particularly moderate-intensity steady state and high-intensity intervals, directly influences glucose utilization and energy expenditure. Combining both modalities creates comprehensive metabolic stimulation.</p>',
        },
        {
          heading: "Timing and Metabolic Adaptation",
          body: '<p>Your body\'s metabolic responsiveness varies throughout the day. Morning exercise may enhance metabolic rate for hours afterward, while evening activity supports sleep quality and nocturnal metabolic processes.</p><p>Consistency trumps perfect timing. Finding an exercise schedule you can maintain long-term will deliver better results than occasional intense sessions. Plan for 150 minutes of moderate activity weekly, plus strength training twice weekly.</p>',
        },
        {
          heading: "Recovery and Metabolic Balance",
          body: '<p>Recovery is where adaptation happens. Sleep quality, stress management, and proper nutrition between sessions are where your body implements metabolic changes. Inadequate recovery can blunt the benefits of excellent training.</p><p>Adequate sleep (7-9 hours), stress reduction, and protein-rich recovery meals support the metabolic improvements you\'re working toward during exercise.</p>',
        },
        {
          heading: "Combining Supplementation with Training",
          body: '<p>NutraGLP supplements are designed to complement, not replace, the benefits of consistent exercise and proper nutrition. Taking your supplement while sedentary won\'t produce desired results, but combined with exercise and healthy eating, it may enhance metabolic adaptation.</p><p>Think of supplementation as optimizing the foundation you\'re building through lifestyle choices. The compound effect of all three elements—exercise, nutrition, and targeted supplementation—creates meaningful metabolic changes.</p>',
        },
      ],
    },
    {
      title: "Success Stories: Real Results From Our Community",
      slug: "success-stories-community",
      description:
        "Explore real results from NutraGLP users who committed to combined lifestyle changes. These stories demonstrate what's possible with consistent effort and proper support.",
      tag: "Research",
      meta_title: "Real Success Stories | NutraGLP Community Results",
      meta_description:
        "Real results from NutraGLP users. See how combining supplements with lifestyle changes creates meaningful metabolic wellness outcomes.",
      read_time: "7 min read",
      sections: [
        {
          heading: "Sarah's Six-Month Metabolic Transformation",
          body: '<p>Sarah, a 38-year-old marketing executive, started with inconsistent energy and difficult meal management. After three months combining NutraGLP with structured exercise and nutrition changes, she reported stable energy throughout her workday and improved satiety signals.</p><p>By month six, Sarah\'s metabolic markers showed improvement, and she\'d lost 18 pounds—importantly, this came from sustained lifestyle change, not crash dieting. She continues the routine because it\'s become her normal, not because she\'s "on a diet."</p>',
        },
        {
          heading: "James's Journey Back to His Goals",
          body: '<p>James spent his thirties watching his fitness decline gradually. Starting NutraGLP alongside a gym membership seemed daunting at 42, but the metabolic support helped him push through initial resistance. After four months, he noticed muscle definition returning and endurance improving.</p><p>His biggest win: sustainable habits. Rather than a temporary program, James has built a lifestyle that supports his goals. His trainer noted improved performance metrics, and his blood work reflected healthier metabolic markers across the board.</p>',
        },
        {
          heading: "Priya's Professional Shift",
          body: '<p>As a wellness coach, Priya felt she needed to practice what she preached. Using NutraGLP while recommending it to clients created authentic endorsement and better results for everyone. She reported improved digestion within two weeks and sustained energy within a month.</p><p>Most importantly, Priya\'s clients seeing her commitment increased their own adherence. The psychology of consistent effort, modeled by someone they trust, proved powerful for sustained change.</p>',
        },
        {
          heading: "Common Patterns Across Stories",
          body: '<p>Across dozens of user reports, consistent themes emerge: the supplements work best alongside—not instead of—lifestyle changes. Results typically appear within 4-6 weeks with consistent use, and continue improving over months.</p><p>Users report not just physical metrics, but psychological shifts: more control around food choices, improved energy stability, and greater confidence in their health trajectory. These psychological benefits often prove most impactful for long-term success.</p>',
        },
      ],
    },
    {
      title: "Supplement Myths Debunked: What Science Actually Shows",
      slug: "supplement-myths-debunked",
      description:
        "Separate fact from fiction about supplements. We address common misconceptions and explain what peer-reviewed research actually demonstrates about modern supplementation.",
      tag: "Science",
      meta_title: "Supplement Myths | Evidence-Based Facts | NutraGLP",
      meta_description:
        "Debunk supplement myths with science. Learn what peer-reviewed research actually shows about GLP-1 supplements and metabolic health.",
      read_time: "11 min read",
      sections: [
        {
          heading: "Myth: Supplements Replace Healthy Lifestyle",
          body: '<p>False. The science is clear: supplements without exercise, proper nutrition, and sleep will not produce significant results. The most successful outcomes in clinical research come from subjects who also modified diet and activity patterns.</p><p>Think of supplements as one pillar of a multi-pillar approach. Each pillar—nutrition, exercise, sleep, stress management, supplementation—contributes to the structure. Remove one and the structure weakens.</p>',
        },
        {
          heading: "Myth: Results Happen Immediately",
          body: '<p>Unrealistic. Metabolic adaptation takes time. Peer-reviewed studies typically measure outcomes at 8-12 weeks minimum. Changes in satiety signaling may appear within 2-3 weeks, but meaningful metabolic shifts and body composition changes require 8+ weeks of consistent effort.</p><p>If someone promises overnight results, they\'re selling snake oil. Honest companies share timelines based on research: expect 4-6 weeks for initial effects, 8-12 weeks for notable changes, and ongoing improvements over months and years.</p>',
        },
        {
          heading: "Myth: Natural Means Weak",
          body: '<p>Incorrect. Many of the most powerful compounds in research are plant-derived. Berberine, found in goldenseal and barberry, rivals prescription medications for glucose metabolism in peer-reviewed research. Chromium, magnesium, and other minerals significantly impact metabolic enzymes.</p><p>Natural and effective are not mutually exclusive. What matters is bioavailability, dosage, and consistency. NutraGLP formulations use clinical doses of evidence-backed ingredients, not homeopathic trace amounts.</p>',
        },
        {
          heading: "Myth: All Supplements Are Regulated Equally",
          body: '<p>Far from true. The supplement industry ranges from rigorous, GMP-certified manufacturers to minimally regulated producers. Third-party testing, transparent labeling, and published sourcing matter enormously.</p><p>NutraGLP invests in third-party testing, provides transparent ingredient sourcing, and publishes clinical references. This transparency isn\'t universal in the industry, which is why sourcing matters.</p>',
        },
        {
          heading: "Myth: You Need to Restrict Calories Severely",
          body: '<p>No. Metabolic support supplements designed around GLP-1 pathways work partly by naturally reducing excessive calorie intake through improved satiety signaling—not by forcing restriction.</p><p>Research shows users typically reduce calorie intake by 200-400 calories daily from improved appetite regulation, not from willpower depletion. This sustainable reduction, combined with maintained nutrition, produces better results than severe restriction.</p>',
        },
      ],
    },
  ];

  console.log("Inserting blog posts...");
  for (const post of blogPosts) {
    const sectionsJson = JSON.stringify(post.sections);
    const query = `
      INSERT OR IGNORE INTO blog_posts
      (slug, title, description, tag, sections, meta_title, meta_description, read_time, published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `;
    await db.execute(query, [
      post.slug,
      post.title,
      post.description,
      post.tag,
      sectionsJson,
      post.meta_title,
      post.meta_description,
      post.read_time,
    ]);
  }
  console.log(`✓ Inserted ${blogPosts.length} blog posts\n`);

  // ============ PAGES ============
  const pages: Page[] = [
    {
      slug: "about-our-science",
      title: "About Our Science",
      meta_description:
        "Learn about the evidence-based science behind NutraGLP supplements. Our commitment to peer-reviewed research and transparent formulation.",
      blocks: [
        {
          id: "hero-about-science",
          type: "rich_text",
          order: 0,
          data: {
            html: '<h1>Our Science Foundation</h1><p>NutraGLP supplements are built on peer-reviewed research spanning over a decade of metabolic health investigation. We don\'t make claims we can\'t substantiate with published literature.</p>',
          },
        },
        {
          id: "research-commitment",
          type: "rich_text",
          order: 1,
          data: {
            html: '<h2>Our Commitment to Evidence</h2><p>Every ingredient in NutraGLP formulations has been selected based on published research demonstrating metabolic benefits. We maintain an internal database of 500+ peer-reviewed studies informing our product development.</p><p>Our Chief Science Officer holds a PhD in Nutritional Biochemistry from UC Davis and chairs our research advisory board. This isn\'t marketing—it\'s the backbone of everything we do.</p>',
          },
        },
        {
          id: "formulation-process",
          type: "rich_text",
          order: 2,
          data: {
            html: '<h2>From Research to Formulation</h2><p>The path from published research to supplement formulation requires careful consideration. We evaluate:</p><ul><li>Bioavailability and absorption rates in human studies</li><li>Effective dosages based on clinical trials</li><li>Ingredient interactions and synergistic effects</li><li>Safety profiles across diverse populations</li><li>Manufacturing processes that preserve ingredient integrity</li></ul><p>This rigorous approach means our formulations take longer to develop, but they deliver research-backed results.</p>',
          },
        },
        {
          id: "third-party-testing",
          type: "rich_text",
          order: 3,
          data: {
            html: '<h2>Third-Party Verification</h2><p>Every batch of NutraGLP products undergoes independent testing through NSF-certified laboratories. We verify:</p><ul><li>Ingredient identity and purity</li><li>Absence of contaminants and heavy metals</li><li>Accurate labeled dosages</li><li>Microbiological safety</li></ul><p>These test results are publicly available on our website. Transparency isn\'t optional—it\'s essential to earning your trust.</p>',
          },
        },
        {
          id: "ongoing-research",
          type: "rich_text",
          order: 4,
          data: {
            html: '<h2>Continuous Learning</h2><p>The science of metabolic health evolves constantly. We subscribe to journals publishing GLP-1 research, attend conferences, and collaborate with university researchers. When new evidence emerges suggesting formulation improvements, we update our products.</p><p>Good science requires humility and openness to new information. We\'re committed to both.</p>',
          },
        },
      ],
    },
    {
      slug: "how-it-works",
      title: "How It Works",
      meta_description:
        "Understand how NutraGLP supplements support your body's natural metabolic processes. The mechanism behind metabolic wellness.",
      blocks: [
        {
          id: "hero-how-it-works",
          type: "rich_text",
          order: 0,
          data: {
            html: '<h1>How NutraGLP Works</h1><p>Unlike medications that artificially manipulate systems, NutraGLP supplements support your body\'s natural metabolic intelligence. Here\'s how.</p>',
          },
        },
        {
          id: "natural-process",
          type: "rich_text",
          order: 1,
          data: {
            html: '<h2>Supporting Your Body\'s Natural Process</h2><p>Your body already produces GLP-1 in response to food intake. This hormone system evolved over millennia to help your body process nutrients efficiently and maintain energy balance.</p><p>The problem in modern nutrition is that processed foods don\'t trigger normal satiety signals. You eat more than your body needs before feeling satisfied.</p><p>NutraGLP ingredients support your body\'s ability to produce and respond to GLP-1 normally—restoring the metabolic signals that modern food has disrupted.</p>',
          },
        },
        {
          id: "key-mechanisms",
          type: "rich_text",
          order: 2,
          data: {
            html: '<h2>Key Mechanisms of Action</h2><p><strong>Satiety Signaling:</strong> Compounds like berberine and chromium enhance how your brain receives fullness signals, reducing the amount you need to eat before feeling satisfied.</p><p><strong>Glucose Metabolism:</strong> Alpha-lipoic acid and other ingredients improve how your cells use glucose, maintaining stable energy and reducing cravings.</p><p><strong>Metabolic Flexibility:</strong> Supporting healthy digestion and nutrient absorption allows your body to efficiently switch between fuel sources.</p><p><strong>Appetite Regulation:</strong> Amino acid precursors and plant compounds support neurotransmitter pathways governing appetite, creating natural food preference shifts.</p>',
          },
        },
        {
          id: "timeline",
          type: "rich_text",
          order: 3,
          data: {
            html: '<h2>Timeline: What to Expect</h2><p><strong>Weeks 1-3:</strong> Your body adapts to the formulation. You may notice improved digestion and slightly better satiety. Some users report subtle energy improvements.</p><p><strong>Weeks 4-8:</strong> Meaningful changes appear. Satiety signals improve noticeably. Many users report reduced food cravings and more stable energy throughout the day. This is when metabolic adaptation accelerates.</p><p><strong>Weeks 8-12:</strong> Compound effects of improved eating patterns and metabolic support become visible. Sustained calorie reduction, combined with metabolic optimization, produces measurable results.</p><p><strong>Month 4+:</strong> Continued improvements as your body fully adapts and lifestyle changes compound. Most users find this becomes their new normal—maintenance requires continuation, but it\'s no longer effortful.</p>',
          },
        },
        {
          id: "lifestyle-synergy",
          type: "rich_text",
          order: 4,
          data: {
            html: '<h2>The Synergy With Lifestyle</h2><p>NutraGLP supplements are designed to amplify what you\'re already doing right. Combined with:</p><ul><li>Consistent exercise (150+ minutes weekly)</li><li>Adequate protein intake (25-40g per meal)</li><li>Whole food focus (minimizing ultra-processed foods)</li><li>Quality sleep (7-9 hours nightly)</li></ul><p>...the supplement produces cumulative, synergistic effects. Each element strengthens the others, creating a virtuous cycle of metabolic improvement.</p><p>Without lifestyle support, supplements produce minimal results. With proper lifestyle, they can be transformative.</p>',
          },
        },
        {
          id: "personalization",
          type: "rich_text",
          order: 5,
          data: {
            html: '<h2>Why Results Vary</h2><p>Individual responses to supplementation vary based on genetics, baseline metabolic health, adherence to lifestyle changes, and starting conditions. Someone with severely disrupted satiety signaling may see faster initial changes than someone with mild metabolic inefficiency.</p><p>This is normal and expected. Most users fall within predictable ranges based on clinical research, but your individual journey is unique. Patience and consistency matter more than expecting everyone to follow identical timelines.</p>',
          },
        },
      ],
    },
  ];

  console.log("Inserting pages...");
  for (const page of pages) {
    const contentJson = JSON.stringify({ blocks: page.blocks });
    const query = `
      INSERT OR IGNORE INTO pages
      (slug, title, meta_description, content, published)
      VALUES (?, ?, ?, ?, 1)
    `;
    await db.execute(query, [page.slug, page.title, page.meta_description, contentJson]);
  }
  console.log(`✓ Inserted ${pages.length} pages\n`);

  console.log("=====================================");
  console.log("Demo content seeding complete!");
  console.log("=====================================\n");
  console.log("Summary:");
  console.log(`  ✓ ${testimonials.length} testimonials`);
  console.log(`  ✓ ${blogPosts.length} blog posts`);
  console.log(`  ✓ ${pages.length} pages`);
  console.log("\nYour CMS is now populated with realistic demo content.");
  console.log("Trial users will see evidence-based, well-written content.");
}

seedDemoContent().catch((error) => {
  console.error("Error seeding demo content:", error);
  process.exit(1);
});
