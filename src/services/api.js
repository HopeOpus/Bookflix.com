import axios from 'axios';

const GOOGLE_BOOKS_BASE = 'https://www.googleapis.com/books/v1';
const ARCHIVE_BASE = 'https://archive.org';

// Create axios instance with default config
const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Google Books API functions
export const googleBooksAPI = {
  searchBooks: async (query, startIndex = 0, maxResults = 20) => {
    try {
      const response = await api.get(`${GOOGLE_BOOKS_BASE}/volumes`, {
        params: {
          q: query,
          startIndex,
          maxResults,
          printType: 'books',
          projection: 'full'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching Google Books:', error);
      throw error;
    }
  },

  getBookDetails: async (volumeId) => {
    try {
      const response = await api.get(`${GOOGLE_BOOKS_BASE}/volumes/${volumeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching book details:', error);
      throw error;
    }
  },

  searchBySubject: async (subject, startIndex = 0, maxResults = 20) => {
    try {
      const response = await api.get(`${GOOGLE_BOOKS_BASE}/volumes`, {
        params: {
          q: `subject:${subject}`,
          startIndex,
          maxResults,
          printType: 'books'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching by subject:', error);
      throw error;
    }
  },

  searchByAuthor: async (author, startIndex = 0, maxResults = 20) => {
    try {
      const response = await api.get(`${GOOGLE_BOOKS_BASE}/volumes`, {
        params: {
          q: `inauthor:${author}`,
          startIndex,
          maxResults,
          printType: 'books'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching by author:', error);
      throw error;
    }
  }
};

// Archive.org API functions
export const archiveAPI = {
  searchBooks: async (query, page = 1, rows = 20) => {
    try {
      const response = await api.get(`${ARCHIVE_BASE}/advancedsearch.php`, {
        params: {
          q: `${query} AND mediatype:texts`,
          fl: 'identifier,title,creator,description,date,subject,downloads,format,item_size',
          sort: 'downloads desc',
          page,
          rows,
          output: 'json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching Archive.org:', error);
      throw error;
    }
  },

  getBookMetadata: async (identifier) => {
    try {
      const response = await api.get(`${ARCHIVE_BASE}/metadata/${identifier}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching metadata:', error);
      throw error;
    }
  },

  getDownloadUrl: (identifier, filename) => {
    return `${ARCHIVE_BASE}/download/${identifier}/${filename}`;
  }
};

// Utility functions
export const utils = {
  getGoogleBooksCover: (book) => {
    if (book.volumeInfo?.imageLinks) {
      return book.volumeInfo.imageLinks.large || 
             book.volumeInfo.imageLinks.medium || 
             book.volumeInfo.imageLinks.small || 
             book.volumeInfo.imageLinks.thumbnail;
    }
    return null;
  },

  formatAuthors: (authors) => {
    if (!authors) return 'Unknown Author';
    if (Array.isArray(authors)) {
      return authors.join(', ');
    }
    return authors;
  },

  truncateText: (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  },

  formatFileSize: (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  },

  downloadFile: async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }
};