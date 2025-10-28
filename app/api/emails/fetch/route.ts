import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { google } from "googleapis";
import { authOptions } from "../../auth/[...nextauth]/route";
import { Email, FetchEmailsResponse } from "@/types/email";

/**
 * Classify emails using OpenAI GPT-4o
 */
async function classifyEmails(
  emails: Email[],
  apiKey: string
): Promise<Email[]> {
  try {
    const emailsToClassify = emails.map((email, index) => ({
      index: index,
      id: email.id,
      from: email.sender,
      subject: email.subject,
      preview: email.snippet,
    }));

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are an expert email classifier. Analyze each email and classify it into exactly ONE of these categories:\n\n" +
              "**Important**: Personal or work-related emails requiring immediate attention (e.g., exam reminders, payment confirmations, security alerts from banks)\n" +
              "**Promotional**: Sales, discounts, special offers, and promotional campaigns from retailers\n" +
              "**Social**: Social networks, friends, family, and personal communications\n" +
              "**Marketing**: Product updates, newsletters, company announcements, and marketing content from tech companies or services\n" +
              "**Spam**: Unwanted, unsolicited, or suspicious emails\n" +
              "**General**: Everything else that doesn't fit the above categories\n\n" +
              "Respond with a JSON object containing a 'classifications' array. Each item must have 'id' and 'category' fields.\n" +
              "Example: {\"classifications\": [{\"id\": \"abc123\", \"category\": \"Important\"}, {\"id\": \"def456\", \"category\": \"Marketing\"}]}",
          },
          {
            role: "user",
            content: `Classify these ${emails.length} emails:\n\n${JSON.stringify(emailsToClassify, null, 2)}`,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      return emails.map((email) => ({ ...email, category: "General" }));
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      console.error("No content in OpenAI response");
      return emails.map((email) => ({ ...email, category: "General" }));
    }

    console.log("OpenAI raw response:", content);
    const parsed = JSON.parse(content);
    console.log("Parsed classifications:", parsed);

    // Build a map of email ID to category
    const categoryMap = new Map<string, string>();
    
    if (parsed.classifications && Array.isArray(parsed.classifications)) {
      for (const item of parsed.classifications) {
        if (item.id && item.category) {
          categoryMap.set(item.id, item.category);
        }
      }
    }

    console.log("Category map size:", categoryMap.size);

    // Apply classifications to emails
    const result = emails.map((email) => {
      const category = categoryMap.get(email.id) || "General";
      console.log(`Email ${email.id.substring(0, 8)}... -> ${category}`);
      return {
        ...email,
        category,
      };
    });

    return result;
  } catch (error) {
    console.error("Classification error:", error);
    return emails.map((email) => ({ ...email, category: "General" }));
  }
}

/**
 * POST /api/emails/fetch
 * Fetches the 15 most recent emails from the user's Gmail account
 */
export async function POST(req: NextRequest) {
  try {
    // Get OpenAI API key from request body
    const body = await req.json();
    const openaiApiKey = body.openaiApiKey;

    if (!openaiApiKey) {
      return NextResponse.json(
        {
          emails: [],
          success: false,
          error: "OpenAI API key is required",
        } as FetchEmailsResponse,
        { status: 400 }
      );
    }

    // Verify user session and extract access token
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
      return NextResponse.json(
        {
          emails: [],
          success: false,
          error: "Unauthorized: No valid session found",
        } as FetchEmailsResponse,
        { status: 401 }
      );
    }

    // Initialize Gmail API client with user's access token
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: session.accessToken,
    });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Fetch 15 most recent messages using gmail.users.messages.list
    const listResponse = await gmail.users.messages.list({
      userId: "me",
      maxResults: 15,
    });

    const messages = listResponse.data.messages || [];

    if (messages.length === 0) {
      return NextResponse.json({
        emails: [],
        success: true,
        error: undefined,
      } as FetchEmailsResponse);
    }

    // Parse and format email data
    const emails: Email[] = [];

    for (const message of messages) {
      if (!message.id) continue;

      try {
        // Fetch full message details for each message ID
        const messageDetails = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
        });

        const headers = messageDetails.data.payload?.headers || [];

        // Extract sender from headers (From field)
        const fromHeader = headers.find(
          (header) => header.name?.toLowerCase() === "from"
        );
        const sender = fromHeader?.value || "Unknown Sender";

        // Extract subject from headers (Subject field)
        const subjectHeader = headers.find(
          (header) => header.name?.toLowerCase() === "subject"
        );
        const subject = subjectHeader?.value || "(No Subject)";

        // Extract date from headers (Date field)
        const dateHeader = headers.find(
          (header) => header.name?.toLowerCase() === "date"
        );
        const date = dateHeader?.value
          ? new Date(dateHeader.value).toISOString()
          : new Date().toISOString();

        // Get email snippet
        const snippet = messageDetails.data.snippet || "";

        // Extract full email body
        let body = "";
        const payload = messageDetails.data.payload;
        
        // Function to decode base64url
        const decodeBase64 = (data: string) => {
          try {
            return Buffer.from(data, 'base64url').toString('utf-8');
          } catch (error) {
            return data;
          }
        };

        // Function to extract body from parts
        const extractBody = (parts: any[]): string => {
          let text = "";
          for (const part of parts) {
            if (part.mimeType === "text/plain" && part.body?.data) {
              text += decodeBase64(part.body.data);
            } else if (part.mimeType === "text/html" && part.body?.data && !text) {
              // Use HTML as fallback if no plain text
              const html = decodeBase64(part.body.data);
              // Simple HTML to text conversion (remove tags)
              text += html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
            } else if (part.parts) {
              text += extractBody(part.parts);
            }
          }
          return text;
        };

        // Try to get body from payload
        if (payload?.body?.data) {
          body = decodeBase64(payload.body.data);
        } else if (payload?.parts) {
          body = extractBody(payload.parts);
        }

        // If no body found, use snippet
        if (!body) {
          body = snippet;
        }

        // Create Email object
        const email: Email = {
          id: message.id,
          sender,
          subject,
          snippet,
          date,
          body: body || snippet,
        };

        emails.push(email);
      } catch (messageError) {
        console.error(`Error fetching message ${message.id}:`, messageError);
        // Continue processing other messages
        continue;
      }
    }

    // Return unclassified emails - classification will be done separately
    return NextResponse.json({
      emails: emails,
      success: true,
      error: undefined,
    } as FetchEmailsResponse);
  } catch (error: any) {
    console.error("Error fetching emails:", error);

    // Handle 401 Unauthorized errors (token refresh)
    if (error.code === 401 || error.status === 401) {
      return NextResponse.json(
        {
          emails: [],
          success: false,
          error: "Authentication failed. Please sign in again.",
        } as FetchEmailsResponse,
        { status: 401 }
      );
    }

    // Handle 403 Forbidden errors (permission issues)
    if (error.code === 403 || error.status === 403) {
      return NextResponse.json(
        {
          emails: [],
          success: false,
          error: "Permission denied. Please grant Gmail access permissions.",
        } as FetchEmailsResponse,
        { status: 403 }
      );
    }

    // Handle 429 Rate Limit errors
    if (error.code === 429 || error.status === 429) {
      return NextResponse.json(
        {
          emails: [],
          success: false,
          error: "Rate limit exceeded. Please try again later.",
        } as FetchEmailsResponse,
        { status: 429 }
      );
    }

    // Handle 500 Server errors
    if (error.code >= 500 || error.status >= 500) {
      return NextResponse.json(
        {
          emails: [],
          success: false,
          error: "Gmail service error. Please try again later.",
        } as FetchEmailsResponse,
        { status: 500 }
      );
    }

    // Return generic error for other cases
    return NextResponse.json(
      {
        emails: [],
        success: false,
        error: error.message || "Failed to fetch emails",
      } as FetchEmailsResponse,
      { status: 500 }
    );
  }
}
