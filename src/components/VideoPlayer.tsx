import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
interface VideoPlayerProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}
export const VideoPlayer = ({
  videoUrl,
  isOpen,
  onClose,
  isFullscreen = false,
  onToggleFullscreen
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration && isFinite(video.duration) && video.currentTime <= video.duration) {
        setCurrentTime(video.currentTime);
      }
    };
    
    const handleLoadedMetadata = () => {
      if (video.duration && isFinite(video.duration)) {
        setDuration(video.duration);
      }
    };

    const handleDurationChange = () => {
      if (video.duration && isFinite(video.duration)) {
        setDuration(video.duration);
      }
    };

    const handleCanPlay = () => {
      if (video.duration && isFinite(video.duration)) {
        setDuration(video.duration);
      }
    };

    const handleLoadedData = () => {
      if (video.duration && isFinite(video.duration)) {
        setDuration(video.duration);
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // Don't force load - let preload="metadata" handle it
    if (video.readyState >= 1 && video.duration && isFinite(video.duration)) {
      setDuration(video.duration);
    }

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoUrl, isOpen, isFullscreen]);
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  const handleTimeChange = (value: number[]) => {
    if (videoRef.current && value[0] <= duration) {
      videoRef.current.currentTime = Math.min(value[0], duration);
      setCurrentTime(Math.min(value[0], duration));
    }
  };
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };
  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      videoRef.current.muted = newMuted;
      if (newMuted) {
        setVolume(0);
      } else {
        setVolume(1);
        videoRef.current.volume = 1;
      }
    }
  };
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  if (isFullscreen && onToggleFullscreen) {
    return <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black border-none">
          <VisuallyHidden.Root>
            <DialogTitle>Полноэкранное видео</DialogTitle>
            <DialogDescription>Видео в полноэкранном режиме</DialogDescription>
          </VisuallyHidden.Root>
          <div className="relative w-full h-[95vh] group flex items-center justify-center">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full" onClick={onToggleFullscreen}>
              <X className="h-6 w-6" />
            </Button>

            <video 
              ref={videoRef} 
              src={videoUrl} 
              className="max-w-full max-h-full object-contain"
              onClick={togglePlay}
              preload="metadata"
              playsInline
            />

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={togglePlay} 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity w-16 h-16 rounded-full"
            >
              {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
            </Button>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="space-y-2">
                <Slider value={[Math.min(currentTime, duration)]} min={0} max={duration || 100} step={0.1} onValueChange={handleTimeChange} className="cursor-pointer" />
                <div className="flex items-center justify-center gap-3">
                  <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:bg-white/20 h-8 w-8">
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <span className="text-xs text-white whitespace-nowrap">
                    {formatTime(Math.min(currentTime, duration))} / {formatTime(duration || 0)}
                  </span>
                  <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/20 h-8 w-8">
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Slider 
                    value={[isMuted ? 0 : volume]} 
                    min={0}
                    max={1} 
                    step={0.1} 
                    onValueChange={handleVolumeChange} 
                    className="cursor-pointer w-20" 
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>;
  }
  return <div className="relative w-full h-full group flex items-center justify-center">
      <video 
        ref={videoRef} 
        src={videoUrl} 
        className="w-full h-full object-contain rounded-lg"
        preload="metadata"
        playsInline
      />
      
      {onToggleFullscreen && <Button variant="ghost" size="icon" onClick={onToggleFullscreen} className="absolute bottom-4 right-4 text-white hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-full">
          <Maximize className="h-5 w-5" />
        </Button>}

      <Button 
        variant="ghost" 
        size="icon" 
        onClick={togglePlay} 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity w-16 h-16 rounded-full"
      >
        {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
      </Button>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="space-y-2">
          <Slider value={[Math.min(currentTime, duration)]} min={0} max={duration || 100} step={0.1} onValueChange={handleTimeChange} className="cursor-pointer" />
          <div className="flex items-center justify-center gap-3">
            <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:bg-white/20 h-8 w-8">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <span className="text-xs text-white whitespace-nowrap">
              {formatTime(Math.min(currentTime, duration))} / {formatTime(duration || 0)}
            </span>
            <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/20 h-8 w-8">
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Slider 
              value={[isMuted ? 0 : volume]} 
              min={0}
              max={1} 
              step={0.1} 
              onValueChange={handleVolumeChange} 
              className="cursor-pointer w-20" 
            />
          </div>
        </div>
      </div>
    </div>;
};