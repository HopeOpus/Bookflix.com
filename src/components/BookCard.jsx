import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Download, Star, Book } from 'lucide-react';
import { utils } from '../services/api';

const BookCard = ({ book, source = 'googlebooks' }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const getBookData = () => {
    if (source === 'archive') {
      return {
        title: book.title || 'Unknown Title',
        author: utils.formatAuthors(book.creator),
        year: book.date ? new Date(book.date).getFullYear() : null,
        coverUrl: null,
        key: book.identifier,
        downloads: book.downloads || 0,
        description: book.description ? utils.truncateText(book.description) : null
      };
    } else {
      // Google Books
      const volumeInfo = book.volumeInfo || {};
      return {
        title: volumeInfo.title || 'Unknown Title',
        author: utils.formatAuthors(volumeInfo.authors),
        year: volumeInfo.publishedDate ? new Date(volumeInfo.publishedDate).getFullYear() : null,
        coverUrl: utils.getGoogleBooksCover(book),
        key: book.id,
        downloads: null,
        description: volumeInfo.description ? utils.truncateText(volumeInfo.description) : null,
        pageCount: volumeInfo.pageCount,
        categories: volumeInfo.categories
      };
    }
  };

  const bookData = getBookData();
  const bookUrl = source === 'archive' 
    ? `/book/archive/${bookData.key}`
    : `/book/google/${bookData.key}`;

  return (
    <div className="card group overflow-hidden animate-fade-in">
      <Link to={bookUrl} className="block">
        {/* Book Cover */}
        <div className="relative aspect-[3/4] bg-neutral-700 overflow-hidden">
          {bookData.coverUrl && !imageError ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 bg-neutral-700 animate-pulse flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-neutral-600 border-t-primary-500 rounded-full animate-spin"></div>
                </div>
              )}
              <img
                src={bookData.coverUrl}
                alt={bookData.title}
                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
              />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center">
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Book className="w-8 h-8 text-primary-400" />
                </div>
                <p className="text-xs text-neutral-400 font-medium">No Cover</p>
              </div>
            </div>
          )}
          
          {/* Download badge for Archive books */}
          {source === 'archive' && bookData.downloads && (
            <div className="absolute top-2 right-2 bg-accent-500/90 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
              <Download className="w-3 h-3" />
              <span>{bookData.downloads}</span>
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="p-4">
          <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
            {bookData.title}
          </h3>
          
          <div className="space-y-1 text-xs text-neutral-400">
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span className="truncate">{bookData.author}</span>
            </div>
            
            {bookData.year && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{bookData.year}</span>
              </div>
            )}

            {bookData.pageCount && (
              <div className="flex items-center space-x-1">
                <Book className="w-3 h-3" />
                <span>{bookData.pageCount} pages</span>
              </div>
            )}
          </div>

          {bookData.description && (
            <p className="text-xs text-neutral-500 mt-2 line-clamp-2">
              {bookData.description}
            </p>
          )}

          {/* Source badge */}
          <div className="mt-3 flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded-full ${
              source === 'archive' 
                ? 'bg-secondary-500/20 text-secondary-400' 
                : 'bg-primary-500/20 text-primary-400'
            }`}>
              {source === 'archive' ? 'Archive.org' : 'Google Books'}
            </span>
            
            {source === 'googlebooks' && (
              <div className="flex items-center space-x-1 text-accent-400">
                <Star className="w-3 h-3" />
                <span className="text-xs">Featured</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;