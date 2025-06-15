
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface VideoPlayerProps {
  src: string;
  contentId: string;
  onProgressUpdate: (progress: number, completed: boolean) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  src, 
  contentId, 
  onProgressUpdate 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [resumePosition, setResumePosition] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    loadProgress();
  }, [contentId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      const progressPercent = (video.currentTime / video.duration) * 100;
      setProgress(progressPercent);
      
      // Auto-save progress every 10 seconds
      if (Math.floor(video.currentTime) % 10 === 0) {
        saveProgress(video.currentTime);
      }
      
      // Mark as completed when 90% watched
      const completed = progressPercent >= 90;
      onProgressUpdate(progressPercent, completed);
    };

    const updateDuration = () => {
      setDuration(video.duration);
      // Resume from saved position
      if (resumePosition > 0) {
        video.currentTime = resumePosition;
      }
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', () => {
      onProgressUpdate(100, true);
      saveProgress(video.duration);
    });

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [resumePosition, onProgressUpdate]);

  const loadProgress = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('course_progress')
        .select('resume_position, speed_preference')
        .eq('content_id', contentId)
        .eq('enrollment_id', user.id) // This should be the actual enrollment_id
        .maybeSingle();
      
      if (data) {
        setResumePosition(data.resume_position || 0);
        setPlaybackRate(data.speed_preference || 1);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const saveProgress = async (position: number) => {
    if (!user) return;
    
    try {
      await supabase
        .from('course_progress')
        .upsert({
          content_id: contentId,
          enrollment_id: user.id, // This should be the actual enrollment_id
          resume_position: Math.floor(position),
          speed_preference: playbackRate,
          progress_percentage: Math.floor((position / duration) * 100),
          last_accessed: new Date().toISOString(),
        });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (value: number) => {
    const video = videoRef.current;
    if (!video) return;

    const seekTime = (value / 100) * duration;
    video.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="relative bg-black rounded-lg overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-auto"
        onClick={togglePlay}
      />
      
      {/* Controls Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Play/Pause Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="lg"
            onClick={togglePlay}
            className="text-white hover:bg-white/20 w-16 h-16 rounded-full"
          >
            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
          </Button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <Progress
              value={progress}
              className="h-2 cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = ((e.clientX - rect.left) / rect.width) * 100;
                handleSeek(percent);
              }}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={togglePlay}>
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              
              <Button variant="ghost" size="sm" onClick={toggleMute}>
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>

              <span className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {/* Playback Speed */}
              <select
                value={playbackRate}
                onChange={(e) => changePlaybackRate(Number(e.target.value))}
                className="bg-transparent text-white text-sm border border-white/20 rounded px-2 py-1"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>

              <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
