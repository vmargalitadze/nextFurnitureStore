import axios from 'axios';
import qs from 'qs';

interface BOGTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  success: boolean;
}

class BOGTokenManager {
  private static instance: BOGTokenManager;
  private currentToken: string | null = null;
  private tokenExpiry: number = 0;
  private isRefreshing: boolean = false;
  private refreshPromise: Promise<string> | null = null;

  private constructor() {}

  static getInstance(): BOGTokenManager {
    if (!BOGTokenManager.instance) {
      BOGTokenManager.instance = new BOGTokenManager();
    }
    return BOGTokenManager.instance;
  }

  private async fetchNewToken(): Promise<string> {
    const client_id = process.env.BOG_CLIENT_ID;
    const client_secret = process.env.BOG_CLIENT_SECRET;

    if (!client_id || !client_secret) {
      throw new Error('Missing BOG credentials');
    }

    const credentials = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

    try {
      console.log('🔄 Fetching new BOG token...');
      
      const response = await axios.post(
        'https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token',
        qs.stringify({ grant_type: 'client_credentials' }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${credentials}`,
          },
          timeout: 10000,
        }
      );

      const { access_token, expires_in } = response.data;
      
      // Set token expiry (subtract 60 seconds as buffer)
      this.tokenExpiry = Date.now() + (expires_in * 1000) - 60000;
      this.currentToken = access_token;
      
      console.log('✅ New BOG token fetched successfully');
      console.log('Token expires in:', expires_in, 'seconds');
      console.log('Token will be refreshed at:', new Date(this.tokenExpiry).toISOString());
      
      return access_token;
    } catch (error: any) {
      console.error('❌ Failed to fetch BOG token:', error.response?.data || error.message);
      throw new Error(`Failed to fetch BOG token: ${error.response?.data?.error || error.message}`);
    }
  }

  async getValidToken(): Promise<string> {
    // Check if current token is still valid
    if (this.currentToken && Date.now() < this.tokenExpiry) {
      return this.currentToken;
    }

    // If token is expired or doesn't exist, refresh it
    if (this.isRefreshing && this.refreshPromise) {
      // Wait for the ongoing refresh to complete
      return this.refreshPromise;
    }

    // Start a new refresh
    this.isRefreshing = true;
    this.refreshPromise = this.fetchNewToken();

    try {
      const token = await this.refreshPromise;
      return token;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  async makeAuthenticatedRequest<T>(
    requestFn: (token: string) => Promise<T>,
    maxRetries: number = 2
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const token = await this.getValidToken();
        return await requestFn(token);
      } catch (error: any) {
        lastError = error;
        
        // Check if it's an authentication error
        if (error.response?.status === 401) {
          console.log(`🔄 Attempt ${attempt}: Token expired, refreshing...`);
          
          // Clear current token to force refresh
          this.currentToken = null;
          this.tokenExpiry = 0;
          
          if (attempt < maxRetries) {
            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
        }
        
        // For non-auth errors or max retries reached, throw the error
        throw error;
      }
    }
    
    throw lastError;
  }

  // Method to manually refresh token (useful for testing)
  async forceRefresh(): Promise<string> {
    this.currentToken = null;
    this.tokenExpiry = 0;
    return this.getValidToken();
  }

  // Method to get token info for debugging
  getTokenInfo() {
    return {
      hasToken: !!this.currentToken,
      expiresAt: this.tokenExpiry ? new Date(this.tokenExpiry).toISOString() : null,
      isExpired: this.tokenExpiry ? Date.now() >= this.tokenExpiry : true,
      timeUntilExpiry: this.tokenExpiry ? this.tokenExpiry - Date.now() : null,
    };
  }
}

export const bogTokenManager = BOGTokenManager.getInstance();
export default bogTokenManager;
