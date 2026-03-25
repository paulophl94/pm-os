interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: number;
  summary?: string;
  actionItems?: string[];
  participants?: string[];
}

export class FirefliesService {
  private apiKey: string;
  private baseUrl = 'https://api.fireflies.ai/graphql';

  constructor() {
    this.apiKey = process.env.FIREFLIES_API_KEY || '';
    if (!this.apiKey) {
      console.warn('⚠️ FIREFLIES_API_KEY not set');
    }
  }

  async getRecentMeetings(days: number = 7): Promise<Meeting[]> {
    if (!this.apiKey) {
      return [];
    }

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const query = `
      query GetTranscripts($fromDate: DateTime, $toDate: DateTime, $limit: Int) {
        transcripts(from_date: $fromDate, to_date: $toDate, limit: $limit) {
          id
          title
          date
          duration
          summary {
            overview
            action_items
          }
          participants
        }
      }
    `;

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          query,
          variables: {
            fromDate: fromDate.toISOString(),
            toDate: new Date().toISOString(),
            limit: 20,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Fireflies API error: ${response.status}`);
      }

      const data = await response.json() as Record<string, any>;
      const transcripts = data.data?.transcripts || [];

      // Filter out B2B meetings (based on title)
      const filteredMeetings = transcripts.filter((t: any) => {
        const title = t.title?.toLowerCase() || '';
        // Exclude meetings that are clearly B2B
        const b2bKeywords = ['b2b', 'wholesale', 'invoices', 'billing'];
        return !b2bKeywords.some(keyword => title.includes(keyword));
      });

      return filteredMeetings.map((t: any) => ({
        id: t.id,
        title: t.title,
        date: t.date,
        duration: t.duration,
        summary: t.summary?.overview,
        actionItems: t.summary?.action_items || [],
        participants: t.participants || [],
      }));
    } catch (error) {
      console.error('Error fetching Fireflies meetings:', error);
      throw error;
    }
  }

  async getMeetingSummary(transcriptId: string): Promise<any> {
    if (!this.apiKey) {
      throw new Error('Fireflies API key not configured');
    }

    const query = `
      query GetTranscript($id: String!) {
        transcript(id: $id) {
          id
          title
          date
          summary {
            overview
            action_items
            keywords
            outline
          }
        }
      }
    `;

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          query,
          variables: { id: transcriptId },
        }),
      });

      if (!response.ok) {
        throw new Error(`Fireflies API error: ${response.status}`);
      }

      const data = await response.json() as Record<string, any>;
      return data.data?.transcript;
    } catch (error) {
      console.error('Error fetching meeting summary:', error);
      throw error;
    }
  }

  /** Fetch complete transcript including full text from sentences */
  async getFullTranscript(transcriptId: string): Promise<any> {
    if (!this.apiKey) {
      throw new Error('Fireflies API key not configured');
    }

    const query = `
      query GetFullTranscript($id: String!) {
        transcript(id: $id) {
          id
          title
          date
          duration
          participants
          dateString
          transcript_url
          speakers {
            id
            name
          }
          summary {
            overview
            action_items
            keywords
            outline
            shorthand_bullet
            bullet_gist
            short_summary
            short_overview
          }
          sentences {
            index
            speaker_name
            speaker_id
            text
            raw_text
            start_time
            end_time
          }
        }
      }
    `;

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          query,
          variables: { id: transcriptId },
        }),
      });

      if (!response.ok) {
        throw new Error(`Fireflies API error: ${response.status}`);
      }

      const data = await response.json() as Record<string, any>;
      if (data.errors) {
        throw new Error(data.errors.map((e: any) => e.message).join('; '));
      }
      return data.data?.transcript;
    } catch (error) {
      console.error('Error fetching full transcript:', error);
      throw error;
    }
  }
}
