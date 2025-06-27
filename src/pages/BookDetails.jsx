import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Download, Calendar, User, BookOpen, 
  Globe, FileText, Star, ExternalLink, Heart 
} from 'lucide-react';
import { googleBooksAPI, archiveAPI, utils } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ComingSoon from '../components/ComingSoon';

const BookDetails = () => {
  const { source, id } = useParams();
  const [book, setBook] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadBookDetails();
  }, [source, id]);

  const loadBookDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      if (source === 'archive') {
        // Load Archive.org book
        const response = await archiveAPI.getBookMetadata(id);
        setMetadata(response);
        setBook(response.metadata);
      } else {
        // Load Google Books book
        const response = await googleBooksAPI.getBookDetails(id);
        setBook(response);
      }
    } catch (err) {
      setError('Failed to load book details. Please try again.');
      console.error('Error loading book details:', err);
    } finally {
      setLoading(false);
    }
  };

  const getBookData = () => {
    if (!book) return null;

    if (source === 'archive') {
      // Ensure subjects is always an array
      let subjects = [];
      if (book.subject) {
        if (Array.isArray(book.subject)) {
          subjects = book.subject;
        } else if (typeof book.subject === 'string') {
          subjects = [book.subject];
        }
      }

      return {
        title: book.title?.[0] || 'Unknown Title',
        author: utils.formatAuthors(book.creator),
        description: book.description?.[0] || 'No description available.',
        publishDate: book.date?.[0],
        subjects: subjects,
        language: book.language?.[0] || 'Unknown',
        pages: book.pages?.[0],
        publisher: book.publisher?.[0],
        isbn: book.isbn?.[0],
        coverUrl: null,
        downloadUrls: getDownloadUrls()
      };
    } else {
      // Google Books
      const volumeInfo = book.volumeInfo || {};
      return {
        title: volumeInfo.title || 'Unknown Title',
        author: utils.formatAuthors(volumeInfo.authors),
        description: volumeInfo.description || 'No description available.',
        publishDate: volumeInfo.publishedDate,
        subjects: volumeInfo.categories || [],
        language: volumeInfo.language || 'Unknown',
        pages: volumeInfo.pageCount,
        publisher: volumeInfo.publisher,
        isbn: volumeInfo.industryIdentifiers?.[0]?.identifier,
        coverUrl: utils.getGoogleBooksCover(book),
        downloadUrls: getGoogleBooksDownloadUrls(),
        previewLink: volumeInfo.previewLink,
        infoLink: volumeInfo.infoLink
      };
    }
  };

  const getDownloadUrls = () => {
    if (!metadata?.files) return [];
    
    const downloadableFormats = ['PDF', 'EPUB', 'MOBI', 'TXT'];
    
    return Object.entries(metadata.files)
      .filter(([filename, fileData]) => {
        const format = filename.split('.').pop()?.toUpperCase();
        return downloadableFormats.includes(format);
      })
      .map(([filename, fileData]) => ({
        filename,
        format: filename.split('.').pop()?.toUpperCase(),
        size: utils.formatFileSize(fileData.size),
        url: archiveAPI.getDownloadUrl(id, filename)
      }));
  };

  const getGoogleBooksDownloadUrls = () => {
    if (!book?.accessInfo) return [];
    
    const downloadUrls = [];
    const accessInfo = book.accessInfo;
    
    // Check for PDF download
    if (accessInfo.pdf?.downloadLink) {
      downloadUrls.push({
        format: 'PDF',
        url: accessInfo.pdf.downloadLink,
        filename: `${book.volumeInfo?.title || 'book'}.pdf`
      });
    }
    
    // Check for EPUB download
    if (accessInfo.epub?.downloadLink) {
      downloadUrls.push({
        format: 'EPUB',
        url: accessInfo.epub.downloadLink,
        filename: `${book.volumeInfo?.title || 'book'}.epub`
      });
    }
    
    return downloadUrls;
  };

  const handleDownload = async (downloadUrl, filename) => {
    try {
      setDownloading(true);
      await utils.downloadFile(downloadUrl, filename);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner text="Loading book details..." />
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorMessage 
            message={error || 'Book not found'}
            onRetry={loadBookDetails}
          />
        </div>
      </div>
    );
  }

  const bookData = getBookData();

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          to="/search" 
          className="inline-flex items-center text-primary-400 hover:text-primary-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Book Cover & Download Section */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              {/* Cover Image */}
              <div className="aspect-[3/4] bg-neutral-700 rounded-lg mb-6 overflow-hidden">
                {bookData.coverUrl && !imageError ? (
                  <img
                    src={bookData.coverUrl}
                    alt={bookData.title}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center">
                    <div className="text-center p-6">
                      <BookOpen className="w-16 h-16 text-primary-400 mx-auto mb-4" />
                      <p className="text-neutral-400 font-medium">No Cover Available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Download Section */}
              {bookData.downloadUrls.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Download className="w-5 h-5 mr-2 text-accent-400" />
                    Download Options
                  </h3>
                  <div className="space-y-2">
                    {bookData.downloadUrls.map((download, index) => (
                      <button
                        key={index}
                        onClick={() => handleDownload(download.url, download.filename)}
                        disabled={downloading}
                        className="flex items-center justify-between p-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors group w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="text-left">
                          <div className="font-medium text-white">{download.format}</div>
                          {download.size && (
                            <div className="text-xs text-neutral-400">{download.size}</div>
                          )}
                        </div>
                        <Download className="w-4 h-4 text-neutral-400 group-hover:text-white" />
                      </button>
                    ))}
                  </div>
                  {downloading && (
                    <p className="text-sm text-accent-400 mt-2">Downloading...</p>
                  )}
                </div>
              )}

              {/* External Links */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">External Links</h3>
                <div className="space-y-2">
                  {source === 'archive' ? (
                    <a
                      href={`https://archive.org/details/${id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full flex items-center justify-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Archive.org
                    </a>
                  ) : (
                    <>
                      {bookData.previewLink && (
                        <a
                          href={bookData.previewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary w-full flex items-center justify-center mb-2"
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          Preview Book
                        </a>
                      )}
                      {bookData.infoLink && (
                        <a
                          href={bookData.infoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary w-full flex items-center justify-center"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View on Google Books
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Source Badge */}
              <div className="mt-6 pt-4 border-t border-neutral-700">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                  source === 'archive' 
                    ? 'bg-secondary-500/20 text-secondary-400' 
                    : 'bg-primary-500/20 text-primary-400'
                }`}>
                  <Globe className="w-3 h-3 mr-1" />
                  {source === 'archive' ? 'Archive.org' : 'Google Books'}
                </div>
              </div>
            </div>
          </div>

          {/* Book Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Basic Info */}
            <div className="card p-6">
              <h1 className="text-3xl font-bold text-white mb-4">{bookData.title}</h1>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-neutral-300">
                  <User className="w-4 h-4 mr-2 text-neutral-400" />
                  <span>{bookData.author}</span>
                </div>
                
                {bookData.publishDate && (
                  <div className="flex items-center text-neutral-300">
                    <Calendar className="w-4 h-4 mr-2 text-neutral-400" />
                    <span>{bookData.publishDate}</span>
                  </div>
                )}
                
                {bookData.pages && (
                  <div className="flex items-center text-neutral-300">
                    <FileText className="w-4 h-4 mr-2 text-neutral-400" />
                    <span>{bookData.pages} pages</span>
                  </div>
                )}
                
                <div className="flex items-center text-neutral-300">
                  <Globe className="w-4 h-4 mr-2 text-neutral-400" />
                  <span>{bookData.language}</span>
                </div>
              </div>

              {/* Additional Details */}
              {(bookData.publisher || bookData.isbn) && (
                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-700">
                  {bookData.publisher && (
                    <div>
                      <span className="text-neutral-400 text-sm">Publisher:</span>
                      <p className="text-white">{bookData.publisher}</p>
                    </div>
                  )}
                  
                  {bookData.isbn && (
                    <div>
                      <span className="text-neutral-400 text-sm">ISBN:</span>
                      <p className="text-white font-mono">{bookData.isbn}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
              <div className="prose prose-invert max-w-none">
                <div 
                  className="text-neutral-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: bookData.description }}
                />
              </div>
            </div>

            {/* Subjects/Categories */}
            {bookData.subjects.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Categories</h2>
                <div className="flex flex-wrap gap-2">
                  {bookData.subjects.slice(0, 10).map((subject, index) => (
                    <Link
                      key={index}
                      to={`/search?q=subject:"${subject}"`}
                      className="px-3 py-1 bg-neutral-700 hover:bg-primary-600 text-neutral-300 hover:text-white rounded-full text-sm transition-colors"
                    >
                      {subject}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* AI Summary Coming Soon */}
            <ComingSoon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;