import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SortAsc, Grid, List } from 'lucide-react';
import { googleBooksAPI, archiveAPI } from '../services/api';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [archiveResults, setArchiveResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    author: '',
    year: '',
    subject: '',
    source: 'all' // 'all', 'googlebooks', 'archive'
  });
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [searchParams]);

  const performSearch = async (query) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const promises = [];
      
      if (filters.source === 'all' || filters.source === 'googlebooks') {
        promises.push(googleBooksAPI.searchBooks(buildSearchQuery(query), 0, 20));
      }
      
      if (filters.source === 'all' || filters.source === 'archive') {
        promises.push(archiveAPI.searchBooks(buildSearchQuery(query), 1, 20));
      }

      const results = await Promise.allSettled(promises);
      
      if (filters.source === 'all') {
        const [googleResult, archiveResult] = results;
        setSearchResults(googleResult.status === 'fulfilled' ? googleResult.value.items || [] : []);
        setArchiveResults(archiveResult.status === 'fulfilled' ? archiveResult.value.response?.docs || [] : []);
      } else if (filters.source === 'googlebooks') {
        setSearchResults(results[0].status === 'fulfilled' ? results[0].value.items || [] : []);
        setArchiveResults([]);
      } else {
        setSearchResults([]);
        setArchiveResults(results[0].status === 'fulfilled' ? results[0].value.response?.docs || [] : []);
      }
      
    } catch (err) {
      setError('Failed to search books. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const buildSearchQuery = (baseQuery) => {
    let query = baseQuery;
    
    if (filters.author) {
      query += ` inauthor:"${filters.author}"`;
    }
    
    if (filters.year) {
      query += ` publishedDate:${filters.year}`;
    }
    
    if (filters.subject) {
      query += ` subject:"${filters.subject}"`;
    }
    
    return query;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
  };

  const totalResults = searchResults.length + archiveResults.length;

  const subjects = [
    'Fiction', 'Science', 'History', 'Biography', 'Technology',
    'Business', 'Philosophy', 'Programming', 'Art', 'Psychology'
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for books, authors, subjects..."
                className="input-field pl-12 pr-4 w-full text-lg h-14"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 btn-primary px-6 h-10"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </h3>
              
              <div className="space-y-4">
                {/* Source Filter */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Source
                  </label>
                  <select
                    value={filters.source}
                    onChange={(e) => handleFilterChange('source', e.target.value)}
                    className="input-field w-full"
                  >
                    <option value="all">All Sources</option>
                    <option value="googlebooks">Google Books</option>
                    <option value="archive">Archive.org</option>
                  </select>
                </div>

                {/* Author Filter */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    value={filters.author}
                    onChange={(e) => handleFilterChange('author', e.target.value)}
                    placeholder="Enter author name"
                    className="input-field w-full"
                  />
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Publication Year
                  </label>
                  <input
                    type="number"
                    value={filters.year}
                    onChange={(e) => handleFilterChange('year', e.target.value)}
                    placeholder="e.g., 2020"
                    min="1800"
                    max={new Date().getFullYear()}
                    className="input-field w-full"
                  />
                </div>

                {/* Subject Filter */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Subject
                  </label>
                  <select
                    value={filters.subject}
                    onChange={(e) => handleFilterChange('subject', e.target.value)}
                    className="input-field w-full"
                  >
                    <option value="">All Subjects</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject.toLowerCase()}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={applyFilters}
                  className="btn-primary w-full"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Search Results
                </h2>
                {!loading && (
                  <p className="text-neutral-400 mt-1">
                    {totalResults} books found {searchQuery && `for "${searchQuery}"`}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort Options */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field"
                >
                  <option value="relevance">Sort by Relevance</option>
                  <option value="year">Sort by Year</option>
                  <option value="title">Sort by Title</option>
                  <option value="author">Sort by Author</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex bg-neutral-800 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-neutral-400'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-neutral-400'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && <LoadingSpinner text="Searching books..." />}

            {/* Error State */}
            {error && (
              <ErrorMessage 
                message={error} 
                onRetry={() => performSearch(searchQuery)}
              />
            )}

            {/* Results */}
            {!loading && !error && (
              <div className="space-y-8">
                {/* Google Books Results */}
                {searchResults.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <span className="w-3 h-3 bg-primary-500 rounded-full mr-2"></span>
                      Google Books ({searchResults.length})
                    </h3>
                    <div className={viewMode === 'grid' 
                      ? 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                      : 'space-y-4'
                    }>
                      {searchResults.map((book, index) => (
                        <BookCard 
                          key={book.id || index} 
                          book={book} 
                          source="googlebooks"
                          viewMode={viewMode}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Archive.org Results */}
                {archiveResults.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <span className="w-3 h-3 bg-secondary-500 rounded-full mr-2"></span>
                      Archive.org ({archiveResults.length})
                    </h3>
                    <div className={viewMode === 'grid' 
                      ? 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                      : 'space-y-4'
                    }>
                      {archiveResults.map((book, index) => (
                        <BookCard 
                          key={book.identifier || index} 
                          book={book} 
                          source="archive"
                          viewMode={viewMode}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {totalResults === 0 && searchQuery && (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No books found</h3>
                    <p className="text-neutral-400 mb-6">
                      Try adjusting your search terms or filters
                    </p>
                    <button
                      onClick={() => {
                        setFilters({
                          author: '',
                          year: '',
                          subject: '',
                          source: 'all'
                        });
                        performSearch(searchQuery);
                      }}
                      className="btn-primary"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;