import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, TrendingUp, Users, Globe, ArrowRight } from 'lucide-react';
import { googleBooksAPI, archiveAPI } from '../services/api';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ComingSoon from '../components/ComingSoon';

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedBooks();
  }, []);

  const loadFeaturedBooks = async () => {
    try {
      setLoading(true);
      
      // Load featured books from Google Books
      const featuredResponse = await googleBooksAPI.searchBooks('fiction bestsellers', 0, 8);
      setFeaturedBooks(featuredResponse.items || []);

      // Load recent popular books from Archive.org
      const recentResponse = await archiveAPI.searchBooks('programming', 1, 6);
      setRecentBooks(recentResponse.response?.docs || []);
      
    } catch (error) {
      console.error('Error loading featured books:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Search,
      title: 'Advanced Search',
      description: 'Find books by title, author, subject, or year with powerful search filters.'
    },
    {
      icon: BookOpen,
      title: 'Vast Collection',
      description: 'Access millions of books from Google Books and Archive.org databases.'
    },
    {
      icon: TrendingUp,
      title: 'Popular Downloads',
      description: 'Discover trending books and most downloaded titles in every genre.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built on open-source platforms with community contributions.'
    }
  ];

  const stats = [
    { number: '40M+', label: 'Books Available' },
    { number: '1M+', label: 'Authors' },
    { number: '100+', label: 'Languages' },
    { number: '50+', label: 'Subjects' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
              Discover the World's
              <span className="text-gradient block">Largest Digital Library</span>
            </h1>
            <p className="text-xl text-neutral-300 mb-8 max-w-3xl mx-auto">
              Search, explore, and download millions of ebooks from the most comprehensive 
              collections on the internet. All free, all accessible, all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/search" className="btn-primary px-8 py-3 text-lg">
                Start Exploring
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Link>
              <Link to="/browse" className="btn-secondary px-8 py-3 text-lg">
                Browse Categories
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary-400 mb-2">{stat.number}</div>
                <div className="text-neutral-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-neutral-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose Bookflix?</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Built for book lovers, by book lovers. Access the world's knowledge with ease.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="card p-6 text-center group hover:border-primary-500/50">
                <feature.icon className="w-12 h-12 text-primary-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-neutral-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Featured Books</h2>
            <Link to="/search?q=fiction bestsellers" className="text-primary-400 hover:text-primary-300 font-medium">
              View All →
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading featured books..." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredBooks.slice(0, 8).map((book, index) => (
                <BookCard key={book.id || index} book={book} source="googlebooks" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent & Popular */}
      <section className="py-16 bg-neutral-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Popular Downloads</h2>
            <Link to="/search?q=programming" className="text-secondary-400 hover:text-secondary-300 font-medium">
              View All →
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading popular books..." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentBooks.slice(0, 6).map((book, index) => (
                <BookCard key={book.identifier || index} book={book} source="archive" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* AI Feature Preview */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ComingSoon />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Reading?</h2>
          <p className="text-primary-100 text-lg mb-8">
            Join millions of readers who trust Bookflix for their digital library needs.
          </p>
          <Link to="/search" className="bg-white text-primary-600 hover:bg-neutral-100 font-bold py-3 px-8 rounded-lg transition-colors">
            Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;