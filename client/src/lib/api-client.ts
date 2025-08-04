export interface ApiResponse {
  id: string;
  url: string;
  method: string;
  timestamp: Date;
  data: any;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  duration: number;
}

export interface ApiRequestConfig {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: string;
  params?: Record<string, string>;
}

export async function makeApiRequest(config: ApiRequestConfig): Promise<ApiResponse> {
  const startTime = Date.now();
  
  try {
    // Use the proxy endpoint to avoid CORS issues
    const response = await fetch('/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    const result = await response.json();
    const duration = Date.now() - startTime;

    return {
      id: generateId(),
      url: config.url,
      method: config.method,
      timestamp: new Date(),
      data: result.data,
      status: result.status,
      statusText: result.statusText,
      headers: result.headers || {},
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    
    return {
      id: generateId(),
      url: config.url,
      method: config.method,
      timestamp: new Date(),
      data: { error: error instanceof Error ? error.message : 'Unknown error' },
      status: 0,
      statusText: 'Network Error',
      headers: {},
      duration,
    };
  }
}

export async function getRequestHistory(): Promise<ApiResponse[]> {
  try {
    const response = await fetch('/api/history');
    if (!response.ok) {
      throw new Error('Failed to fetch history');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching request history:', error);
    return [];
  }
}

export async function saveRequestToHistory(request: ApiResponse): Promise<void> {
  try {
    await fetch('/api/history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
  } catch (error) {
    console.error('Error saving request to history:', error);
  }
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}