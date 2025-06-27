import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Search from './pages/Search';
import BookDetails from './pages/BookDetails';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-900">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/browse" element={<Search />} />
            <Route path="/subjects" element={<Search />} />
            <Route path="/authors" element={<Search />} />
            <Route path="/book/:source/:id" element={<BookDetails />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="bg-neutral-800 border-t border-neutral-700 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Bookflix</h3>
                <p className="text-neutral-400 text-sm">
                  Your gateway to the world's largest digital library. 
                  Discover, read, and download millions of ebooks.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-3">Browse</h4>
                <ul className="space-y-2 text-sm text-neutral-400">
                  <li><a href="/subjects" className="hover:text-white transition-colors">Popular Subjects</a></li>
                  <li><a href="/authors" className="hover:text-white transition-colors">Featured Authors</a></li>
                  <li><a href="/search" className="hover:text-white transition-colors">Advanced Search</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-3">Resources</h4>
                <ul className="space-y-2 text-sm text-neutral-400">
                  <li><a href="https://books.google.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Google Books</a></li>
                  <li><a href="https://archive.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Internet Archive</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-3">Connect</h4>
                <ul className="space-y-2 text-sm text-neutral-400">
                  <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-neutral-700 mt-8 pt-6 text-center text-neutral-400 text-sm">
              <p>&copy; 2025 Bookflix. Built with ❤️ for book lovers everywhere.</p>
              <p className="mt-1">Powered by Google Books & Internet Archive APIs</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;