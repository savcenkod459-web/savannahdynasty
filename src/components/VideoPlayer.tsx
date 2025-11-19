import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Play, Pause, Volume2, VolumeX, Maximize, Loader2, Square } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useIsMobile } from "@/hooks/use-mobile";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
interface VideoPlayerProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  posterImage?: string;
}
export const VideoPlayer = ({
  videoUrl,
  isOpen,
  onClose,
  isFullscreen = false,
  onToggleFullscreen,
  posterImage
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoadVideo) return;
    setIsLoading(true);
    const handleTimeUpdate = () => {
      if (video.duration && isFinite(video.duration) && video.currentTime <= video.duration) {
        setCurrentTime(video.currentTime);
      }
    };
    const handleLoadedMetadata = () => {
      if (video.duration && isFinite(video.duration)) {
        setDuration(video.duration);
      }
      setIsLoading(false);
      setIsVideoLoaded(true);
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
      setIsLoading(false);
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
    const handleWaiting = () => {
      setIsLoading(true);
    };
    const handlePlaying = () => {
      setIsLoading(false);
    };
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);

    // Force load and update
    video.load();
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
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
    };
  }, [videoUrl, isOpen, isFullscreen, shouldLoadVideo]);
  const handlePlayClick = () => {
    if (!shouldLoadVideo) {
      setShouldLoadVideo(true);
      // Wait a moment for video to start loading
      setTimeout(() => {
        togglePlay();
      }, 100);
    } else {
      togglePlay();
    }
  };
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };
  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  const handleFullscreen = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (!document.fullscreenElement) {
      videoElement.requestFullscreen().catch((err) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };
  const handleSeek = (value: number[]) => {
    if (videoRef.current && duration > 0) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };
  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.volume = value[0];
      setVolume(value[0]);
      setIsMuted(value[0] === 0);
    }
  };
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  const formatTime = (time: number): string => {
    if (!isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  if (isFullscreen && isOpen) {
    return <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-black/95 border-primary/20">
          <VisuallyHidden.Root>
            <DialogTitle>Video Player</DialogTitle>
            <DialogDescription>Fullscreen video player</DialogDescription>
          </VisuallyHidden.Root>
          
          <div className="relative w-full h-full flex items-center justify-center">
            <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full">
              <X className="h-6 w-6" />
            </Button>

            {/* Poster image placeholder */}
            {!shouldLoadVideo && posterImage && <div className="absolute inset-0 flex items-center justify-center">
                <img src={posterImage} alt="Video preview" className="max-w-full max-h-full object-contain blur-sm" />
              </div>}

            {/* Video element */}
            {shouldLoadVideo && <video ref={videoRef} src={videoUrl} className="max-w-full max-h-full object-contain" onClick={togglePlay} preload={isMobile ? "none" : "metadata"} playsInline />}

            {/* Loading spinner */}
            {isLoading && <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-white animate-spin" />
              </div>}

            {/* Video controls */}
            {isVideoLoaded && <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                <div className="flex items-center gap-4 text-white">
                  <Button variant="ghost" size="icon" onClick={togglePlay} className="hover:bg-white/20">
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  
                  <Button variant="ghost" size="icon" onClick={handleStop} className="hover:bg-white/20">
                    <Square className="h-6 w-6" />
                  </Button>

                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm min-w-[45px]">{formatTime(currentTime)}</span>
                    <Slider value={[currentTime]} max={duration || 100} step={0.1} onValueChange={handleSeek} className="flex-1" />
                    <span className="text-sm min-w-[45px]">{formatTime(duration)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={toggleMute} className="hover:bg-white/20">
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                    <Slider value={[isMuted ? 0 : volume]} max={1} step={0.01} onValueChange={handleVolumeChange} className="w-24" />
                  </div>
                </div>
              </div>}
          </div>
        </DialogContent>
      </Dialog>;
  }
  return <div className="relative w-full h-full group bg-black/5 rounded-lg overflow-hidden">
      {/* Poster image placeholder */}
      {!shouldLoadVideo && posterImage && <img src={posterImage} alt="Video preview" className="w-full h-full object-contain rounded-lg blur-sm" />}
      
      {/* Video element - lazy load on play */}
      {shouldLoadVideo && <video ref={videoRef} src={videoUrl} className="w-full h-full object-contain rounded-lg" preload={isMobile ? "none" : "metadata"} playsInline />}

      {/* Loading spinner */}
      {isLoading && <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>}
      
      {/* Play button and time display - positioned at bottom left */}
      <div className="absolute bottom-4 left-4 z-30 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={handlePlayClick} className="text-white hover:bg-white/20 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm">
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
        {isVideoLoaded && (
          <div className="text-white text-sm font-medium bg-black/50 backdrop-blur-sm px-3 py-2 rounded-full">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        )}
      </div>
      
      {/* Fullscreen button - positioned at bottom right */}
      <div className="absolute bottom-4 right-4 z-30">
        <Button variant="ghost" size="icon" onClick={handleFullscreen} className="text-white hover:bg-white/20 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm">
          <Maximize className="h-6 w-6" />
        </Button>
      </div>

      {/* Pause button - appears in center when playing */}
      {isPlaying && <Button variant="ghost" size="icon" onClick={togglePlay} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm z-10">
          <Pause className="h-8 w-8" />
        </Button>}

      {/* Video controls */}
      {isVideoLoaded && <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-3 text-white">
            <Button variant="ghost" size="icon" onClick={handleStop} className="hover:bg-white/20">
              <Square className="h-4 w-4" />
            </Button>
            
            
          </div>
        </div>}
    </div>;
};