import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { ClassifiedEmail, EmailCategory } from '@/types/email';

export async function POST(request: NextRequest) {
  let provider: string = 'openai'; // Default provider for error messages
  
  try {
    const body = await request.json();
    const { emails, openaiKey, geminiKey, provider: requestProvider = 'openai' } = body;
    provider = requestProvider;
    
    console.log('=== Classification Request ===');
    console.log('Provider:', provider);
    console.log('Number of emails:', emails?.length);
    console.log('Has OpenAI key:', !!openaiKey);
    console.log('Has Gemini key:', !!geminiKey);

    // Validate request body
    if (!emails || !Array.isArray(emails)) {
      return NextResponse.json(
        { success: false, error: 'Invalid emails array' },
        { status: 400 }
      );
    }



    // Validate API key based on provider
    if (provider === 'openai') {
      if (!openaiKey || typeof openaiKey !== 'string') {
        return NextResponse.json(
          { success: false, error: 'OpenAI API key is required' },
          { status: 400 }
        );
      }
    } else if (provider === 'gemini') {
      if (!geminiKey || typeof geminiKey !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Gemini API key is required' },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid provider. Use "openai" or "gemini"' },
        { status: 400 }
      );
    }

    // Initialize the appropriate model based on provider
    let model;
    
    if (provider === 'openai') {
      // Initialize ChatOpenAI model with GPT-4o
      model = new ChatOpenAI({
        model: 'gpt-4o',
        apiKey: openaiKey,
        temperature: 0.2,
      });
      console.log('Using OpenAI GPT-4o for classification');
    } else {
      // Initialize Gemini model
      model = new ChatGoogleGenerativeAI({
        model: 'gemini-2.0-flash-exp',
        apiKey: geminiKey,
        temperature: 0.2,
      });
      console.log('Using Google Gemini 2.0 Flash for classification');
    }

    // Create classification prompt template
    const classificationPrompt = PromptTemplate.fromTemplate(`Classify this email into ONE category.

Email:
From: {sender}
Subject: {subject}
Content: {snippet}

Categories:
- Important: Certifications, exams, payments, security alerts, urgent work/personal matters
- Promotional: Sales, discounts, shopping deals from retailers
- Social: Facebook, LinkedIn, Twitter, Instagram, friend/family messages
- Marketing: Tech company updates, newsletters, product announcements, tips
- Spam: Phishing, scams, suspicious content
- General: Welcome emails, account setup, generic notifications

Rules:
- Certification emails (Salesforce, exams) = Important
- Payment confirmations = Important
- Security/storage alerts = Important
- Product updates from tech companies = Marketing
- Sales/discounts from stores = Promotional
- Social network notifications = Social

Output ONLY the category name (Important, Promotional, Social, Marketing, Spam, or General).
No explanation. One word only.

Category:`);

    // Set up chain with model
    const chain = classificationPrompt.pipe(model);

    // Process each email through the classification chain
    const classifiedEmails: ClassifiedEmail[] = [];
    
    console.log(`Starting classification of ${emails.length} emails...`);

    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      try {
        console.log(`\nClassifying email ${i + 1}/${emails.length}:`);
        console.log(`  Subject: ${email.subject}`);
        console.log(`  From: ${email.sender}`);
        
        const response: any = await chain.invoke({
          sender: email.sender,
          subject: email.subject,
          snippet: email.snippet,
        });

        // Parse category from model response
        const content = response.content.toString().trim();
        
        let category: EmailCategory = 'General';

        // Match the category from the response (case-insensitive, flexible matching)
        const validCategories: EmailCategory[] = [
          'Important',
          'Promotional',
          'Social',
          'Marketing',
          'Spam',
          'General',
        ];

        // Clean the response - remove any extra punctuation, whitespace, and newlines
        const cleanedContent = content
          .replace(/[.,!?;:\n\r\t]/g, '')
          .replace(/\s+/g, ' ')
          .trim();

        // Try exact match first (case-insensitive)
        let matchedCategory = validCategories.find(
          (cat) => cleanedContent.toLowerCase() === cat.toLowerCase()
        );
        
        // If no exact match, try partial match (in case AI adds extra text)
        if (!matchedCategory) {
          matchedCategory = validCategories.find(
            (cat) => cleanedContent.toLowerCase().includes(cat.toLowerCase())
          );
        }

        // If still no match, try word-by-word matching
        if (!matchedCategory) {
          const words = cleanedContent.toLowerCase().split(/\s+/);
          matchedCategory = validCategories.find(
            (cat) => words.includes(cat.toLowerCase())
          );
        }

        if (matchedCategory) {
          category = matchedCategory;
        } else {
          console.log(`  ⚠️  Warning: Could not match category from response: "${content}"`);
          console.log(`  ⚠️  Defaulting to "General" category`);
        }
        
        console.log(`  ✓ Final Category: ${category}`);

        // Create classified email object
        classifiedEmails.push({
          ...email,
          category,
        });
      } catch (error) {
        // Assign "General" category if parsing fails
        console.error(`Error classifying email ${email.id}:`, error);
        classifiedEmails.push({
          ...email,
          category: 'General',
        });
      }
    }
    
    // Log summary
    const categoryCounts = classifiedEmails.reduce((acc, email) => {
      acc[email.category] = (acc[email.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('\nClassification Summary:');
    console.log(categoryCounts);

    // Return ClassifiedEmail objects array
    return NextResponse.json({
      success: true,
      classifiedEmails,
    });
  } catch (error: any) {
    console.error('=== Classification Error ===');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error status:', error.status);
    console.error('Full error:', error);

    // Handle 401 Unauthorized errors (invalid API key)
    if (
      error.status === 401 ||
      error.code === 'invalid_api_key' ||
      error.message?.includes('Incorrect API key') ||
      error.message?.includes('Invalid API key') ||
      error.message?.includes('authentication') ||
      error.message?.includes('API key not valid')
    ) {
      const providerName = provider === 'gemini' ? 'Gemini' : 'OpenAI';
      return NextResponse.json(
        {
          success: false,
          error: `Invalid ${providerName} API key. Please check your API key and try again.`,
        },
        { status: 401 }
      );
    }

    // Handle 429 Rate Limit errors (quota exceeded)
    if (
      error.status === 429 ||
      error.code === 'rate_limit_exceeded' ||
      error.message?.includes('rate limit') ||
      error.message?.includes('quota') ||
      error.message?.includes('Rate limit')
    ) {
      const providerName = provider === 'gemini' ? 'Gemini' : 'OpenAI';
      return NextResponse.json(
        {
          success: false,
          error: `${providerName} API rate limit exceeded. Please try again later or check your quota.`,
        },
        { status: 429 }
      );
    }

    // Handle 500 Server errors (service issues)
    if (
      error.status === 500 ||
      error.status === 502 ||
      error.status === 503 ||
      error.message?.includes('server error') ||
      error.message?.includes('service unavailable')
    ) {
      const providerName = provider === 'gemini' ? 'Gemini' : 'OpenAI';
      return NextResponse.json(
        {
          success: false,
          error: `${providerName} service is currently unavailable. Please try again later.`,
        },
        { status: 500 }
      );
    }

    // Handle network errors
    if (
      error.code === 'ECONNREFUSED' ||
      error.code === 'ETIMEDOUT' ||
      error.message?.includes('network') ||
      error.message?.includes('timeout')
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Network error occurred. Please check your connection and try again.',
        },
        { status: 503 }
      );
    }

    // Handle all other errors
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to classify emails. Please try again.',
      },
      { status: 500 }
    );
  }
}
