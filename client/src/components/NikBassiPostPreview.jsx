import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Repeat2, Send, Globe, Copy, Check } from 'lucide-react';

const NikBassiPostPreview = ({ content, authorName = "Nikit Bassi", authorTitle = "Founder @ NB Media | High-Ticket LinkedIn Ghostwriter", imageIdea }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const paragraphs = content ? content.split('\n') : ['Your generated LinkedIn post will appear here...'];

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-md text-slate-800 font-sans text-sm">
      {/* Header Bar */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-slate-200 bg-slate-50">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">LinkedIn Preview Mockup</span>
        {content && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 active:scale-95 transition-all"
          >
            {copied ? (
              <>
                <Check size={12} />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Copy Post</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Post Profile Details */}
      <div className="p-4 flex gap-3">
        <div className="h-12 w-12 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-lg border-2 border-emerald-500/40 shadow-inner shrink-0">
          NB
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="font-bold hover:underline cursor-pointer text-slate-900 text-base">{authorName}</span>
            <span className="text-xs text-slate-400 font-normal">• 1st</span>
          </div>
          <p className="text-xs text-slate-400 truncate leading-snug">{authorTitle}</p>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
            <span>1h</span>
            <span>•</span>
            <Globe size={11} />
          </div>
        </div>
      </div>

      {/* Main Spaced Content */}
      <div className="px-4 pb-4 whitespace-pre-line text-slate-800 leading-relaxed break-words tracking-normal">
        {paragraphs.map((para, index) => {
          // Render with specific line-spacing style of Nikit
          return (
            <p key={index} className={`${para.trim() === '' ? 'h-4' : 'mb-3'}`}>
              {para}
            </p>
          );
        })}
      </div>

      {/* Image Idea Display Box (If provided) */}
      {imageIdea && (
        <div className="mx-4 mb-4 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 flex flex-col gap-2.5">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
            <span className="text-xs font-semibold text-emerald-600">🎨 Visual Asset Concept</span>
            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-medium border border-slate-200">Midjourney / DALL-E</span>
          </div>
          <h4 className="font-bold text-slate-800 text-sm">{imageIdea.imageTitle}</h4>
          <p className="text-slate-600 text-xs leading-relaxed">{imageIdea.imageDescription}</p>
          <div className="mt-1 bg-white p-2.5 rounded-lg border border-slate-200 flex flex-col gap-1.5 shadow-sm">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Prompt:</span>
            <p className="text-slate-600 text-xs italic font-mono break-all leading-normal select-all select-none selection:bg-emerald-100">{imageIdea.imagePrompt}</p>
          </div>
        </div>
      )}

      {/* Reactions Metric Bar */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200">
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1">
            <span className="z-10 bg-blue-500 rounded-full h-4 w-4 flex items-center justify-center text-[10px] text-white">👍</span>
            <span className="z-0 bg-red-500 rounded-full h-4 w-4 flex items-center justify-center text-[10px] text-white">❤️</span>
          </div>
          <span>142 reactions</span>
        </div>
        <span>27 comments • 5 reposts</span>
      </div>

      {/* Action Tab Buttons */}
      <div className="grid grid-cols-4 border-t border-slate-200 py-1 text-xs text-slate-500 font-semibold bg-slate-50">
        <button className="flex items-center justify-center gap-2 py-2 hover:bg-slate-100 hover:text-slate-700 rounded-md transition-colors">
          <ThumbsUp size={16} />
          <span>Like</span>
        </button>
        <button className="flex items-center justify-center gap-2 py-2 hover:bg-slate-100 hover:text-slate-700 rounded-md transition-colors">
          <MessageSquare size={16} />
          <span>Comment</span>
        </button>
        <button className="flex items-center justify-center gap-2 py-2 hover:bg-slate-100 hover:text-slate-700 rounded-md transition-colors">
          <Repeat2 size={16} />
          <span>Repost</span>
        </button>
        <button className="flex items-center justify-center gap-2 py-2 hover:bg-slate-100 hover:text-slate-700 rounded-md transition-colors">
          <Send size={16} />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};

export default NikBassiPostPreview;
