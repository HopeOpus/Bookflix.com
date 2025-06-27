import { Brain, Sparkles, Clock } from 'lucide-react';

const ComingSoon = () => {
  return (
    <div className="card p-8 text-center border-dashed border-2 border-accent-500/30 bg-gradient-to-br from-accent-500/5 to-secondary-500/5">
      <div className="relative">
        <div className="absolute inset-0 animate-pulse-slow">
          <Sparkles className="w-6 h-6 text-accent-400 absolute top-0 left-1/4" />
          <Sparkles className="w-4 h-4 text-secondary-400 absolute top-8 right-1/4" />
          <Sparkles className="w-5 h-5 text-primary-400 absolute bottom-0 left-1/3" />
        </div>
        
        <Brain className="w-16 h-16 text-accent-500 mx-auto mb-4" />
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2">AI Book Summarization</h3>
      <p className="text-neutral-400 mb-4">
        Get intelligent summaries of any book using advanced AI technology. 
        Extract key insights and main points in seconds.
      </p>
      
      <div className="flex items-center justify-center space-x-2 text-accent-400">
        <Clock className="w-4 h-4" />
        <span className="text-sm font-medium">Coming Soon</span>
      </div>
      
      <div className="mt-6 p-4 bg-neutral-800/50 rounded-lg">
        <h4 className="font-semibold text-white mb-2">What to expect:</h4>
        <ul className="text-sm text-neutral-400 space-y-1">
          <li>• Chapter-by-chapter summaries</li>
          <li>• Key themes and concepts</li>
          <li>• Character analysis (for fiction)</li>
          <li>• Actionable insights (for non-fiction)</li>
        </ul>
      </div>
    </div>
  );
};

export default ComingSoon;