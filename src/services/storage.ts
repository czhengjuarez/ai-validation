import { Playbook } from '@/data/templates';

const LOCAL_STORAGE_KEY = 'ai-validation-playbooks';

/**
 * Storage service for managing playbooks
 * Falls back to localStorage if R2 API is not available
 */
export class StorageService {
  private baseUrl: string;

  constructor() {
    // For now, we'll use a simple REST API endpoint
    // In production, this would be your backend API that interfaces with R2
    this.baseUrl = (import.meta as any).env?.VITE_API_URL || '/api';
  }

  /**
   * Get all playbooks from localStorage
   */
  private getLocalPlaybooks(): Playbook[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  /**
   * Save all playbooks to localStorage
   */
  private setLocalPlaybooks(playbooks: Playbook[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(playbooks));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }

  /**
   * Save a playbook to R2 storage (with localStorage fallback)
   */
  async savePlaybook(playbook: Playbook): Promise<Playbook> {
    try {
      const response = await fetch(`${this.baseUrl}/playbooks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playbook),
      });

      if (!response.ok) {
        throw new Error(`Failed to save playbook: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.log('API not available, using localStorage fallback');
      
      // Fallback to localStorage
      const playbooks = this.getLocalPlaybooks();
      playbooks.push(playbook);
      this.setLocalPlaybooks(playbooks);
      
      return playbook;
    }
  }

  /**
   * Update an existing playbook in R2 storage (with localStorage fallback)
   */
  async updatePlaybook(id: string, playbook: Partial<Playbook>): Promise<Playbook> {
    try {
      const response = await fetch(`${this.baseUrl}/playbooks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playbook),
      });

      if (!response.ok) {
        throw new Error(`Failed to update playbook: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.log('API not available, using localStorage fallback');
      
      // Fallback to localStorage
      const playbooks = this.getLocalPlaybooks();
      const index = playbooks.findIndex(p => p.id === id);
      
      if (index === -1) {
        throw new Error('Playbook not found');
      }
      
      const updatedPlaybook = {
        ...playbooks[index],
        ...playbook,
        id,
        updatedAt: new Date().toISOString(),
      };
      
      playbooks[index] = updatedPlaybook;
      this.setLocalPlaybooks(playbooks);
      
      return updatedPlaybook;
    }
  }

  /**
   * Fetch a playbook by ID from R2 storage (with localStorage fallback)
   */
  async getPlaybook(id: string): Promise<Playbook> {
    try {
      const response = await fetch(`${this.baseUrl}/playbooks/${id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch playbook: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.log('API not available, using localStorage fallback');
      
      // Fallback to localStorage
      const playbooks = this.getLocalPlaybooks();
      const playbook = playbooks.find(p => p.id === id);
      
      if (!playbook) {
        throw new Error('Playbook not found');
      }
      
      return playbook;
    }
  }

  /**
   * Fetch all playbooks from R2 storage (with localStorage fallback)
   */
  async getAllPlaybooks(): Promise<Playbook[]> {
    try {
      const response = await fetch(`${this.baseUrl}/playbooks`);

      if (!response.ok) {
        throw new Error(`Failed to fetch playbooks: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.log('API not available, using localStorage fallback');
      
      // Fallback to localStorage
      return this.getLocalPlaybooks();
    }
  }

  /**
   * Delete a playbook from R2 storage (with localStorage fallback)
   */
  async deletePlaybook(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/playbooks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete playbook: ${response.statusText}`);
      }
    } catch (error) {
      console.log('API not available, using localStorage fallback');
      
      // Fallback to localStorage
      const playbooks = this.getLocalPlaybooks();
      const filtered = playbooks.filter(p => p.id !== id);
      this.setLocalPlaybooks(filtered);
    }
  }
}

// Export a singleton instance
export const storageService = new StorageService();
