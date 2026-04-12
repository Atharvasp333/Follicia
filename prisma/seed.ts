import { PrismaClient, FeedbackCategory, FeedbackSentiment, FeedbackStatus } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Prisma with Neon adapter
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
  log: ['error', 'warn'],
});

// Mock user data
const mockUsers = [
  { name: 'Customer 1', email: 'customer1@example.com' },
  { name: 'John Doe', email: 'john.doe@example.com' },
  { name: 'Jane Smith', email: 'jane.smith@example.com' },
  { name: 'Priya Sharma', email: 'priya.sharma@example.com' },
  { name: 'Rahul Kumar', email: 'rahul.kumar@example.com' },
  { name: 'Ananya Patel', email: 'ananya.patel@example.com' },
  { name: 'Vikram Singh', email: 'vikram.singh@example.com' },
  { name: 'Sneha Reddy', email: 'sneha.reddy@example.com' },
  { name: 'Arjun Mehta', email: 'arjun.mehta@example.com' },
  { name: 'Kavya Iyer', email: 'kavya.iyer@example.com' },
  { name: 'Rohan Gupta', email: 'rohan.gupta@example.com' },
  { name: 'Meera Nair', email: 'meera.nair@example.com' },
  { name: 'Aditya Joshi', email: 'aditya.joshi@example.com' },
  { name: 'Ishita Desai', email: 'ishita.desai@example.com' },
  { name: 'Karthik Rao', email: 'karthik.rao@example.com' },
];

// Feedback templates by category and sentiment
const feedbackTemplates = {
  PAYMENT: {
    NEGATIVE: [
      'Payment failed multiple times even though my card has sufficient balance. Very frustrating experience.',
      'Razorpay gateway keeps timing out during checkout. Lost my cart items twice.',
      'Double charged on my credit card! Still waiting for refund after 5 days.',
      'Payment page shows 404 error when I click Pay Now button.',
      'UPI payment deducted money but order shows as failed. Need immediate help!',
      'Transaction stuck in pending state for 2 hours. Money debited but no confirmation.',
      'Cannot use my debit card, keeps saying invalid card details.',
      'Payment gateway crashed during sale, missed the discount.',
      'Refund process is too slow, been waiting for 10 days now.',
      'COD option not available in my area, but online payment keeps failing.',
    ],
    NEUTRAL: [
      'Payment went through but took longer than expected.',
      'Would prefer more payment options like Paytm wallet.',
      'Confirmation email arrived 30 minutes after payment.',
      'Payment interface could be more user-friendly.',
    ],
    POSITIVE: [
      'Smooth payment experience with Razorpay. Instant confirmation!',
      'Love the multiple payment options available.',
      'UPI payment was seamless and quick.',
      'Got instant invoice after payment. Very professional.',
      'Payment process is secure and trustworthy.',
    ],
  },
  PRODUCT: {
    NEGATIVE: [
      'Hair serum caused severe scalp irritation. Had to stop using after 2 days.',
      'Product quality is poor, nothing like the description on website.',
      'Shampoo made my hair more dry and frizzy instead of moisturizing.',
      'Received expired product! Expiry date was last month.',
      'Ingredients list on bottle different from what was shown online.',
      'Hair oil has a weird chemical smell, cannot use it.',
      'Product packaging was damaged, half the serum leaked out.',
      'Not suitable for sensitive scalp despite being labeled as such.',
      'Conditioner is too watery, feels diluted.',
      'Hair mask did nothing for my hair porosity issue.',
    ],
    NEUTRAL: [
      'Product is okay, but expected better results for the price.',
      'Average quality, similar to other brands in market.',
      'Works fine but nothing extraordinary.',
      'Decent product but takes too long to show results.',
    ],
    POSITIVE: [
      'Amazing hair growth serum! Visible results in 3 weeks.',
      'Best shampoo for curly hair I have ever used.',
      'Hair DNA Quiz recommended perfect products for my hair type.',
      'Scalp treatment worked wonders, dandruff completely gone.',
      'Love the natural ingredients, no harsh chemicals.',
      'Product quality is premium, worth every rupee.',
      'Hair feels softer and healthier after using the conditioner.',
      'Biotin serum is a game changer for hair thickness.',
      'Excellent for low porosity hair, highly recommend!',
      'The hair mask transformed my damaged hair.',
    ],
  },
  DELIVERY: {
    NEGATIVE: [
      'Order delayed by 10 days, no proper communication from team.',
      'Package arrived completely damaged, product bottles broken.',
      'Wrong product delivered! Ordered shampoo but got conditioner.',
      'Delivery partner was rude and unprofessional.',
      'Tracking information was not updated, had no idea where my order was.',
      'Package left outside in rain, products got wet.',
      'Delivery attempted when I was home, but no one rang the bell.',
      'Express delivery took same time as standard, waste of extra money.',
      'Missing items in my order, only received 2 out of 3 products.',
      'Delivery address was wrong despite entering correct details.',
    ],
    NEUTRAL: [
      'Delivery was on time but packaging could be better.',
      'Standard delivery took expected time, no issues.',
      'Tracking updates were minimal but order arrived safely.',
      'Delivery was okay, nothing special.',
    ],
    POSITIVE: [
      'Super fast delivery! Ordered yesterday, received today.',
      'Excellent packaging, products were well protected.',
      'Delivery person was polite and professional.',
      'Accurate tracking updates throughout the journey.',
      'Express delivery lived up to its promise.',
    ],
  },
  WEBSITE: {
    NEGATIVE: [
      'Website is very slow, takes forever to load product pages.',
      'Mobile app keeps crashing when I try to checkout.',
      'Search function does not work properly, shows irrelevant results.',
      'Cannot filter products by hair type, very inconvenient.',
      'Quiz results page shows error 500.',
      'Images not loading on product detail pages.',
      'Cart items disappear randomly.',
      'Cannot edit shipping address after placing order.',
      'Website not mobile responsive, very difficult to navigate on phone.',
      'Login page keeps redirecting to home page.',
    ],
    NEUTRAL: [
      'Website design is decent but could be more modern.',
      'Navigation is okay but search could be improved.',
      'Some pages load slowly during peak hours.',
      'User interface is functional but not very intuitive.',
    ],
    POSITIVE: [
      'Love the Hair DNA Quiz feature! Very innovative.',
      'Website is clean and easy to navigate.',
      'Product recommendations based on my quiz results were spot on.',
      'Dashboard shows all my orders clearly.',
      'Loyalty points system is a great addition.',
      'Checkout process is smooth and hassle-free.',
      'Love the detailed product descriptions and ingredient lists.',
      'Website loads fast and works great on mobile.',
    ],
  },
};

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAISummary(category: FeedbackCategory, sentiment: FeedbackSentiment, comment: string): string {
  const summaries: Record<FeedbackCategory, Record<FeedbackSentiment, string[]>> = {
    PAYMENT: {
      NEGATIVE: [
        'Critical payment gateway failure causing transaction errors',
        'Customer experiencing payment processing issues and delays',
        'Double charge incident requiring immediate refund processing',
        'Payment page technical error blocking checkout completion',
        'UPI transaction discrepancy with money deducted but order failed',
      ],
      NEUTRAL: [
        'Payment completed successfully with minor delay',
        'Customer requesting additional payment method options',
        'Confirmation email delivery timing feedback',
      ],
      POSITIVE: [
        'Seamless payment experience with instant confirmation',
        'Customer satisfied with multiple payment options',
        'Positive feedback on secure payment process',
      ],
    },
    PRODUCT: {
      NEGATIVE: [
        'Product caused adverse skin reaction requiring discontinuation',
        'Quality concerns with product not matching description',
        'Expired product received requiring immediate replacement',
        'Product packaging integrity compromised during transit',
        'Ingredient mismatch between listing and actual product',
      ],
      NEUTRAL: [
        'Product performance meets basic expectations',
        'Average satisfaction with room for improvement',
        'Product effectiveness requires extended usage period',
      ],
      POSITIVE: [
        'Excellent product results exceeding customer expectations',
        'High praise for Hair DNA Quiz accuracy and recommendations',
        'Customer reports significant improvement in hair health',
        'Premium quality ingredients delivering visible results',
        'Product perfectly matched to customer hair profile',
      ],
    },
    DELIVERY: {
      NEGATIVE: [
        'Significant delivery delay with poor communication',
        'Package arrived damaged with broken product containers',
        'Wrong item delivered requiring order correction',
        'Delivery service quality below acceptable standards',
        'Missing items in order requiring immediate resolution',
      ],
      NEUTRAL: [
        'Delivery completed within expected timeframe',
        'Standard delivery service with minor packaging concerns',
        'Tracking information adequate but could be enhanced',
      ],
      POSITIVE: [
        'Exceptional fast delivery exceeding expectations',
        'Superior packaging ensuring product safety',
        'Professional delivery service with excellent communication',
      ],
    },
    WEBSITE: {
      NEGATIVE: [
        'Critical website performance issues affecting user experience',
        'Mobile application stability problems during checkout',
        'Search functionality not returning relevant results',
        'Technical error on quiz results page blocking user flow',
        'Cart persistence issues causing item loss',
      ],
      NEUTRAL: [
        'Website functionality adequate with room for UI improvements',
        'Navigation usable but search optimization needed',
        'Performance acceptable during normal traffic periods',
      ],
      POSITIVE: [
        'Hair DNA Quiz feature highly appreciated by customer',
        'Excellent website usability and navigation experience',
        'AI-powered recommendations delivering accurate results',
        'Loyalty program integration well-received',
      ],
    },
  };

  const options = summaries[category][sentiment];
  return getRandomElement(options);
}

function generateUrgencyScore(category: FeedbackCategory, sentiment: FeedbackSentiment): number {
  // High urgency for negative payment issues
  if (category === 'PAYMENT' && sentiment === 'NEGATIVE') {
    return getRandomInt(8, 10);
  }
  
  // Medium-high urgency for negative product/delivery issues
  if ((category === 'PRODUCT' || category === 'DELIVERY') && sentiment === 'NEGATIVE') {
    return getRandomInt(6, 9);
  }
  
  // Medium urgency for negative website issues
  if (category === 'WEBSITE' && sentiment === 'NEGATIVE') {
    return getRandomInt(5, 8);
  }
  
  // Low urgency for neutral feedback
  if (sentiment === 'NEUTRAL') {
    return getRandomInt(3, 5);
  }
  
  // Very low urgency for positive feedback
  if (sentiment === 'POSITIVE') {
    return getRandomInt(1, 3);
  }
  
  return 5; // Default
}

async function main() {
  console.log('🌱 Starting feedback seeding process...');
  console.log('📊 Target: 200 diverse feedback entries');
  
  const feedbackData = [];
  
  // Category distribution
  const categoryDistribution = {
    PAYMENT: 60,   // 30%
    PRODUCT: 60,   // 30%
    DELIVERY: 40,  // 20%
    WEBSITE: 40,   // 20%
  };
  
  // Sentiment distribution (40% positive, 40% negative, 20% neutral)
  const sentimentWeights = {
    POSITIVE: 0.4,
    NEGATIVE: 0.4,
    NEUTRAL: 0.2,
  };
  
  function getWeightedSentiment(): FeedbackSentiment {
    const rand = Math.random();
    if (rand < 0.4) return 'NEGATIVE';
    if (rand < 0.8) return 'POSITIVE';
    return 'NEUTRAL';
  }
  
  // Generate feedback for each category
  for (const [category, count] of Object.entries(categoryDistribution)) {
    console.log(`📝 Generating ${count} entries for ${category}...`);
    
    for (let i = 0; i < count; i++) {
      const sentiment = getWeightedSentiment();
      const user = getRandomElement(mockUsers);
      const comment = getRandomElement(feedbackTemplates[category as FeedbackCategory][sentiment]);
      const urgencyScore = generateUrgencyScore(category as FeedbackCategory, sentiment);
      const aiSummary = generateAISummary(category as FeedbackCategory, sentiment, comment);
      
      // Status distribution: 60% NEW, 30% REVIEWED, 10% RESOLVED
      let status: FeedbackStatus = 'NEW';
      const statusRand = Math.random();
      if (statusRand > 0.6 && statusRand <= 0.9) status = 'REVIEWED';
      else if (statusRand > 0.9) status = 'RESOLVED';
      
      // Rating: 1-2 for negative, 3 for neutral, 4-5 for positive
      let rating: number;
      if (sentiment === 'NEGATIVE') rating = getRandomInt(1, 2);
      else if (sentiment === 'NEUTRAL') rating = 3;
      else rating = getRandomInt(4, 5);
      
      feedbackData.push({
        userName: user.name,
        userEmail: user.email,
        rawComment: comment,
        rating,
        aiCategory: category as FeedbackCategory,
        sentiment: sentiment as FeedbackSentiment,
        aiSummary,
        urgencyScore,
        status,
        createdAt: new Date(Date.now() - getRandomInt(0, 30) * 24 * 60 * 60 * 1000), // Random date within last 30 days
      });
    }
  }
  
  // Shuffle the array for realistic distribution
  feedbackData.sort(() => Math.random() - 0.5);
  
  console.log('💾 Inserting feedback entries into database...');
  
  const result = await prisma.feedback.createMany({
    data: feedbackData,
    skipDuplicates: true,
  });
  
  console.log(`✅ Successfully seeded ${result.count} feedback entries!`);
  console.log('📈 Distribution summary:');
  console.log(`   - PAYMENT: ${categoryDistribution.PAYMENT} entries`);
  console.log(`   - PRODUCT: ${categoryDistribution.PRODUCT} entries`);
  console.log(`   - DELIVERY: ${categoryDistribution.DELIVERY} entries`);
  console.log(`   - WEBSITE: ${categoryDistribution.WEBSITE} entries`);
  console.log('🎯 Sentiment mix: ~40% Positive, ~40% Negative, ~20% Neutral');
  console.log('🚀 Feedback seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
