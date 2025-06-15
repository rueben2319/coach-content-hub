
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Image, Download, CheckCircle } from 'lucide-react';

interface CourseContent {
  id: string;
  title: string;
  content_type: 'video' | 'audio' | 'text' | 'pdf' | 'image' | 'interactive';
  content_url?: string;
  content_text?: string;
}

interface ContentViewerProps {
  content: CourseContent;
  onProgressUpdate: (progress: number, completed: boolean) => void;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ 
  content, 
  onProgressUpdate 
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [viewStartTime] = useState(Date.now());

  useEffect(() => {
    // Track viewing time for completion
    const timer = setTimeout(() => {
      if (!isCompleted) {
        markAsCompleted();
      }
    }, 30000); // Mark as complete after 30 seconds of viewing

    return () => clearTimeout(timer);
  }, []);

  const markAsCompleted = () => {
    setIsCompleted(true);
    onProgressUpdate(100, true);
  };

  const renderContent = () => {
    switch (content.content_type) {
      case 'text':
        return (
          <div className="prose max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: content.content_text || '' }}
              className="text-gray-800 leading-relaxed"
            />
          </div>
        );
      
      case 'pdf':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">PDF Document</p>
                <Button asChild>
                  <a href={content.content_url} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" />
                    Open PDF
                  </a>
                </Button>
              </div>
            </div>
            {content.content_url && (
              <iframe
                src={content.content_url}
                className="w-full h-96 border rounded-lg"
                title={content.title}
              />
            )}
          </div>
        );
      
      case 'image':
        return (
          <div className="text-center">
            {content.content_url ? (
              <img
                src={content.content_url}
                alt={content.title}
                className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
                onLoad={() => {
                  // Mark as viewed after image loads
                  setTimeout(markAsCompleted, 3000);
                }}
              />
            ) : (
              <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <Image className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Image content not available</p>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'interactive':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Interactive Content</h3>
              <p className="text-gray-700 mb-4">
                This is an interactive lesson. Engage with the content below to complete this section.
              </p>
              {content.content_text && (
                <div 
                  dangerouslySetInnerHTML={{ __html: content.content_text }}
                  className="prose max-w-none"
                />
              )}
              {content.content_url && (
                <iframe
                  src={content.content_url}
                  className="w-full h-64 border rounded-lg mt-4"
                  title={content.title}
                />
              )}
            </div>
          </div>
        );
      
      case 'video':
      case 'audio':
        return (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">This content type is handled by specialized players</p>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Content type not supported</p>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        {renderContent()}
        
        {/* Completion Button */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {isCompleted ? 'Completed' : 'Mark as complete when finished reading'}
            </span>
            <Button
              onClick={markAsCompleted}
              disabled={isCompleted}
              variant={isCompleted ? 'secondary' : 'default'}
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Completed
                </>
              ) : (
                'Mark Complete'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentViewer;
