import { ForumCategory, ForumTopic, ForumPost } from "../../shared/schema";

export const mockForumCategories: Partial<ForumCategory>[] = [
  {
    id: 1,
    name: "UK Financial Basics",
    description: "Discussions about fundamental UK financial concepts, banking, and money management",
    icon: "pound-sign",
    color: "#3B82F6",
    slug: "uk-financial-basics",
    order: 1
  },
  {
    id: 2,
    name: "Budgeting & Saving",
    description: "Tips and strategies for effective budgeting and saving money in the UK",
    icon: "piggy-bank",
    color: "#10B981",
    slug: "budgeting-saving",
    order: 2
  },
  {
    id: 3,
    name: "UK Investing",
    description: "All about UK investment options, ISAs, pensions, and wealth building",
    icon: "trending-up",
    color: "#F59E0B",
    slug: "uk-investing",
    order: 3
  },
  {
    id: 4,
    name: "Student Finance",
    description: "Information about UK student loans, university funding, and managing money as a student",
    icon: "graduation-cap",
    color: "#EC4899",
    slug: "student-finance",
    order: 4
  },
  {
    id: 5,
    name: "Financial News",
    description: "Discussions about current financial news and events affecting UK finances",
    icon: "newspaper",
    color: "#6366F1",
    slug: "financial-news",
    order: 5
  }
];

export const mockForumTopics: Partial<ForumTopic>[] = [
  // UK Financial Basics topics
  {
    id: 1,
    title: "Getting started with UK current accounts",
    content: "I'm new to the UK banking system. Can someone explain the different types of current accounts available and what to look for when choosing one?",
    slug: "getting-started-with-uk-current-accounts",
    userId: 1,
    categoryId: 1,
    isPinned: true,
    isLocked: false,
    views: 120
  },
  {
    id: 2,
    title: "Understanding UK credit scores",
    content: "How exactly do credit scores work in the UK? What factors affect them the most and how can I improve mine?",
    slug: "understanding-uk-credit-scores",
    userId: 1,
    categoryId: 1,
    isPinned: false,
    isLocked: false,
    views: 85
  },
  {
    id: 3,
    title: "Contactless payment limits in the UK",
    content: "I noticed the contactless payment limit has increased recently. What's the current limit and are there any security concerns with higher limits?",
    slug: "contactless-payment-limits-in-the-uk",
    userId: 1,
    categoryId: 1,
    isPinned: false,
    isLocked: false,
    views: 62
  },

  // Budgeting & Saving topics
  {
    id: 4,
    title: "50/30/20 budgeting rule - Does it work in the UK?",
    content: "I've been reading about the 50/30/20 budgeting rule (50% on needs, 30% on wants, 20% on savings). Does this make sense in the UK context with our cost of living?",
    slug: "50-30-20-budgeting-rule-does-it-work-in-the-uk",
    userId: 1,
    categoryId: 2,
    isPinned: false,
    isLocked: false,
    views: 95
  },
  {
    id: 5,
    title: "Best UK apps for tracking expenses",
    content: "What are the best apps for tracking expenses in the UK that integrate well with UK banks?",
    slug: "best-uk-apps-for-tracking-expenses",
    userId: 1,
    categoryId: 2,
    isPinned: true,
    isLocked: false,
    views: 150
  },
  {
    id: 6,
    title: "Emergency fund - How much is enough?",
    content: "With the rising cost of living in the UK, how many months of expenses should we aim to have in an emergency fund? The traditional advice is 3-6 months, but is that enough?",
    slug: "emergency-fund-how-much-is-enough",
    userId: 1,
    categoryId: 2,
    isPinned: false,
    isLocked: false,
    views: 88
  },

  // UK Investing topics
  {
    id: 7,
    title: "ISA vs SIPP - Which should prioritize?",
    content: "I'm starting to invest for the long term. Should I focus on maxing out my ISA first, or contribute to my SIPP? What are the pros and cons of each approach?",
    slug: "isa-vs-sipp-which-should-prioritize",
    userId: 1,
    categoryId: 3,
    isPinned: false,
    isLocked: false,
    views: 110
  },
  {
    id: 8,
    title: "Best UK index funds for beginners",
    content: "I want to start investing in index funds. Which UK index funds are recommended for beginners with low fees?",
    slug: "best-uk-index-funds-for-beginners",
    userId: 1,
    categoryId: 3,
    isPinned: true,
    isLocked: false,
    views: 175
  },
  {
    id: 9,
    title: "Property vs stocks for long-term investment",
    content: "In the UK market, what are people's thoughts on investing in property vs stocks for long-term wealth building?",
    slug: "property-vs-stocks-for-long-term-investment",
    userId: 1,
    categoryId: 3,
    isPinned: false,
    isLocked: false,
    views: 130
  },

  // Student Finance topics
  {
    id: 10,
    title: "Repaying student loans - Should I make voluntary payments?",
    content: "I graduated a few years ago and have Plan 2 student loans. Is it worth making voluntary payments to reduce the total interest I'll pay?",
    slug: "repaying-student-loans-should-i-make-voluntary-payments",
    userId: 1,
    categoryId: 4,
    isPinned: false,
    isLocked: false,
    views: 90
  },
  {
    id: 11,
    title: "Best student bank accounts 2025",
    content: "What are the best student bank accounts in the UK this year? Looking for good overdraft terms and perks.",
    slug: "best-student-bank-accounts-2025",
    userId: 1,
    categoryId: 4,
    isPinned: true,
    isLocked: false,
    views: 200
  },
  {
    id: 12,
    title: "Part-time jobs that won't affect studies",
    content: "Does anyone have recommendations for good part-time jobs for university students that pay well but don't interfere too much with studies?",
    slug: "part-time-jobs-that-wont-affect-studies",
    userId: 1,
    categoryId: 4,
    isPinned: false,
    isLocked: false,
    views: 145
  },

  // Financial News topics
  {
    id: 13,
    title: "Impact of the latest Bank of England rate decision",
    content: "How will the Bank of England's latest interest rate decision affect mortgages, savings, and the broader economy?",
    slug: "impact-of-the-latest-bank-of-england-rate-decision",
    userId: 1,
    categoryId: 5,
    isPinned: true,
    isLocked: false,
    views: 115
  },
  {
    id: 14,
    title: "New UK tax regulations for 2025/2026",
    content: "Let's discuss the new tax regulations announced for the 2025/2026 tax year and how they might affect different income brackets.",
    slug: "new-uk-tax-regulations-for-2025-2026",
    userId: 1,
    categoryId: 5,
    isPinned: false,
    isLocked: false,
    views: 105
  },
  {
    id: 15,
    title: "The future of digital banking in the UK",
    content: "With the rise of challenger banks and fintech, how do you see the future of banking in the UK evolving over the next decade?",
    slug: "the-future-of-digital-banking-in-the-uk",
    userId: 1,
    categoryId: 5,
    isPinned: false,
    isLocked: false,
    views: 95
  }
];

export const mockForumPosts: Partial<ForumPost>[] = [
  // For "Getting started with UK current accounts"
  {
    id: 1,
    content: "I'm new to the UK banking system. Can someone explain the different types of current accounts available and what to look for when choosing one?",
    userId: 1,
    topicId: 1,
    isEdited: false
  },
  {
    id: 2,
    content: "Welcome to UK banking! There are several types of current accounts in the UK:\n\n1. **Standard Current Accounts**: Basic accounts for everyday banking\n\n2. **Packaged Current Accounts**: Come with benefits like insurance, but charge a monthly fee\n\n3. **Student Accounts**: Designed for university students with interest-free overdrafts\n\n4. **Graduate Accounts**: For recent graduates, usually with decreasing overdraft limits\n\n5. **Basic Bank Accounts**: For those with poor credit history\n\nWhen choosing, consider:\n- Overdraft facilities and fees\n- Interest rates on positive balances\n- Monthly account fees\n- Mobile banking features\n- Switching incentives\n- Branch availability if you need in-person service\n\nHope this helps!",
    userId: 1,
    topicId: 1,
    isEdited: false
  },

  // For "Best UK apps for tracking expenses"
  {
    id: 3,
    content: "What are the best apps for tracking expenses in the UK that integrate well with UK banks?",
    userId: 1,
    topicId: 5,
    isEdited: false
  },
  {
    id: 4,
    content: "I've tried several expense tracking apps that work well with UK banks. Here are my recommendations:\n\n1. **Emma** - Great for budgeting and tracking all your accounts in one place. Works with most UK banks.\n\n2. **Money Dashboard** - Excellent for categorizing expenses and setting budgets. Good UK bank coverage.\n\n3. **Yolt** - Nice visualization of your spending habits. Works with major UK banks.\n\n4. **Monzo** or **Starling** - If you're willing to switch banks, their built-in budgeting tools are excellent.\n\n5. **YNAB (You Need A Budget)** - More complex but very powerful budgeting system. Works with UK banks through Open Banking.\n\nAll of these support Open Banking, so they can securely connect to your accounts without you sharing your credentials directly.",
    userId: 1,
    topicId: 5,
    isEdited: false
  },

  // For "Best UK index funds for beginners"
  {
    id: 5,
    content: "I want to start investing in index funds. Which UK index funds are recommended for beginners with low fees?",
    userId: 1,
    topicId: 8,
    isEdited: false
  },
  {
    id: 6,
    content: "For beginners looking to invest in index funds in the UK, here are some solid options with low fees:\n\n1. **Vanguard FTSE Global All Cap Index Fund** - Great for global exposure with a low 0.23% ongoing charge.\n\n2. **Vanguard LifeStrategy funds** - Come in different equity/bond allocations (e.g., 80/20, 60/40) for different risk tolerances. Charges around 0.22%.\n\n3. **Fidelity Index World Fund** - Tracks global developed markets with a 0.12% fee.\n\n4. **iShares UK Equity Index Fund** - If you want UK exposure, this has a low 0.05% charge.\n\n5. **L&G International Index Trust** - Good global exposure excluding the UK at around 0.13% charge.\n\nYou can invest in these through platforms like Vanguard Investor, Fidelity, AJ Bell Youinvest, or Hargreaves Lansdown. Remember that platform fees are charged in addition to fund fees, so consider the total cost.",
    userId: 1,
    topicId: 8,
    isEdited: false
  },

  // For "Best student bank accounts 2025"
  {
    id: 7,
    content: "What are the best student bank accounts in the UK this year? Looking for good overdraft terms and perks.",
    userId: 1,
    topicId: 11,
    isEdited: false
  },
  {
    id: 8,
    content: "For 2025, these student accounts stand out:\n\n1. **Santander 123 Student Account** - Free 4-year railcard worth £30/year + up to £1,500 interest-free overdraft in year 1 (increasing each year). Cashback on household bills.\n\n2. **HSBC Student Account** - Up to £1,000 overdraft in year 1, increasing to £3,000 by year 3. Offers a £100 sign-up bonus and a choice of Deliveroo, ASOS or mobile phone credit rewards.\n\n3. **Nationwide FlexStudent** - Up to £1,000 overdraft in year 1, increasing to £3,000 by year 3. No fees on spending abroad.\n\n4. **NatWest Student Account** - Choice of Amazon Prime Student membership, National Express Coachcard or a Tastecard. Up to £2,000 interest-free overdraft.\n\n5. **Barclays Student Additions** - Up to £1,500 overdraft and cashback at selected retailers through their app.\n\nLook for the longest 0% overdraft period and consider whether you value perks or better interest rates. Also check their mobile banking apps, as you'll likely use these the most.",
    userId: 1,
    topicId: 11,
    isEdited: false
  }
];