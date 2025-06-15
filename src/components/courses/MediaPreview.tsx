
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, FileText, Image, Film } from 'lucide-react';

interface MediaPreviewProps {
  url: string;
  type: 'video' | 'audio' | 'image' | 'pdf' | 'text';
  title?: string;
  duration?: number;
  onPlay?: () => void;
  onPause?: () => void;
  onProgress?: (progress: number) => void;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({
  url,
  type,
  title,
  duration,
  onPlay,
  onPause,
  onProgress
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePlay = () => {
    setIsPlaying(true);
    onPlay?.();
  };

  const handlePause = () => {
    setIsPlaying(false);
    onPause?.();
  };

  const handleProgress = (e: React.SyntheticEvent<HTMLVideoElement | HTMLAudioElement>) => {
    const target = e.currentTarget;
    const progressPercent = (target.currentTime / target.duration) * 100;
    setProgress(progressPercent);
    onProgress?.(progressPercent);
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderPreview = () => {
    switch (type) {
      case 'video':
        return (
          <div className="relative">
            <video
              src={url}
              className="w-full h-auto rounded-lg"
              controls
              onPlay={handlePlay}
              onPause={handlePause}
              onTimeUpdate={handleProgress}
              muted={isMuted}
            />
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              {formatDuration(duration)}
            </div>
          </div>
        );

      case 'audio':
        return (
          <Card className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isPlaying ? handlePause : handlePlay}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{title || 'Audio File'}</div>
                <div className="text-xs text-gray-500">{formatDuration(duration)}</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
            <audio
              ref={(audio) => {
                if (audio) {
                  audio.muted = isMuted;
                  if (isPlaying) audio.play();
                  else audio.pause();
                }
              }}
              src={url}
              onTimeUpdate={handleProgress}
              className="hidden"
            />
          </Card>
        );

      case 'image':
        return (
          <div className="relative">
            <img
              src={url}
              alt={title || 'Course image'}
              className="w-full h-auto rounded-lg max-h-96 object-cover"
            />
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm flex items-center">
              <Image className="h-4 w-4 mr-1" />
              Image
            </div>
          </div>
        );

      case 'pdf':
        return (
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-red-500" />
              <div>
                <div className="font-medium">{title || 'PDF Document'}</div>
                <Button variant="link" className="p-0 h-auto" asChild>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    Open PDF
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        );

      default:
        return (
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <Film className="h-8 w-8 text-gray-500" />
              <div>
                <div className="font-medium">{title || 'Media File'}</div>
                <div className="text-sm text-gray-500">Click to preview</div>
              </div>
            </div>
          </Card>
        );
    }
  };

  return (
    <div className="media-preview">
      {renderPreview()}
    </div>
  );
};

export default MediaPreview;
