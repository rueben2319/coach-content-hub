
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AudioPlayerProps {
  src: string;
  contentId: string;
  onProgressUpdate: (progress: number, completed: boolean) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  src, 
  contentId, 
  onProgressUpdate 
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [resumePosition, setResumePosition] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    loadProgress();
  }, [contentId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      setProgress(progressPercent);
      
      // Auto-save progress every 10 seconds
      if (Math.floor(audio.currentTime) % 10 === 0) {
        saveProgress(audio.currentTime);
      }
      
      // Mark as completed when 90% listened
      const completed = progressPercent >= 90;
      onProgressUpdate(progressPercent, completed);
    };

    const updateDuration = () => {
      setDuration(audio.duration);
      // Resume from saved position
      if (resumePosition > 0) {
        audio.currentTime = resumePosition;
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => {
      onProgressUpdate(100, true);
      saveProgress(audio.duration);
      setIsPlaying(false);
    });

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [resumePosition, onProgressUpdate]);

  const loadProgress = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('user_progress')
        .select('resume_position, speed_preference')
        .eq('content_id', contentId)
        .eq('enrollment_id', user.id)
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
        .from('user_progress')
        .upsert({
          content_id: contentId,
          enrollment_id: user.id,
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
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const seekTime = (value / 100) * duration;
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds));
  };

  const changePlaybackRate = (rate: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const handleVolumeChange = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = value / 100;
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <audio ref={audioRef} src={src} />
        
        {/* Audio Visualization */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 mb-6 text-center text-white">
          <div className="flex items-center justify-center space-x-2 mb-4">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`w-1 bg-white/60 rounded-full transition-all duration-300 ${
                  isPlaying ? 'animate-pulse' : ''
                }`}
                style={{
                  height: `${Math.random() * 40 + 20}px`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
          <p className="text-lg font-medium">Audio Content</p>
        </div>

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
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <Button variant="outline" size="sm" onClick={() => skip(-10)}>
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button size="lg" onClick={togglePlay} className="w-16 h-16 rounded-full">
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => skip(10)}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Volume and Speed Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={toggleMute}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <div className="w-20">
              <Progress
                value={volume * 100}
                className="h-2 cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percent = ((e.clientX - rect.left) / rect.width) * 100;
                  handleVolumeChange(percent);
                }}
              />
            </div>
          </div>

          <select
            value={playbackRate}
            onChange={(e) => changePlaybackRate(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value={0.5}>0.5x</option>
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioPlayer;
