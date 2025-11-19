import { useState, useRef, useEffect, memo } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Play, Pause, Volume2, VolumeX, Maximize, Loader2, Square } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMediaOptimization } from "@/hooks/useMediaOptimization";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

// Определение типа видео по расширению
const getVideoType = (url: string): string => {
  const extension = url.split('.').pop()?.toLowerCase();
  const typeMap: { [key: string]: string } = {
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'ogg': 'video/ogg',
    'mov': 'video/quicktime',
    'm4v': 'video/x-m4v'
  };
  return typeMap[extension || 'mp4'] || 'video/mp4';
};

// Генерация альтернативных источников для лучшей совместимости
const generateVideoSources = (url: string): Array<{ src: string; type: string }> => {
  const baseUrl = url.substring(0, url.lastIndexOf('.'));
  const currentType = getVideoType(url);
  
  // Возвращаем текущий URL и возможные альтернативы
  const sources = [{ src: url, type: currentType }];
  
  // Если это MP4, предлагаем WebM как альтернативу и наоборот
  if (currentType === 'video/mp4') {
    sources.push({ src: `${baseUrl}.webm`, type: 'video/webm' });
  } else if (currentType === 'video/webm') {
    sources.push({ src: `${baseUrl}.mp4`, type: 'video/mp4' });
  }
  
  return sources;
};

interface VideoPlayerProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  posterImage?: string;
}
export const VideoPlayer = memo(({
  videoUrl,
  isOpen,
  onClose,
  isFullscreen = false,
  onToggleFullscreen,
  posterImage
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { enableAdaptiveBitrate } = useMediaOptimization();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isInFullscreen, setIsInFullscreen] = useState(false);
  const videoSources = generateVideoSources(videoUrl);
  
  // Отслеживание изменения fullscreen состояния
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsInFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);
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
  const handleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;
    
    try {
      if (!document.fullscreenElement) {
        // Входим в fullscreen
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if ((container as any).webkitRequestFullscreen) {
          await (container as any).webkitRequestFullscreen();
        } else if ((container as any).mozRequestFullScreen) {
          await (container as any).mozRequestFullScreen();
        } else if ((container as any).msRequestFullscreen) {
          await (container as any).msRequestFullscreen();
        }
      } else {
        // Выходим из fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
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
            {shouldLoadVideo && <video 
              ref={videoRef} 
              poster={posterImage}
              className="max-w-full max-h-full object-contain" 
              onClick={togglePlay} 
              preload="metadata"
              playsInline
              webkit-playsinline="true"
              x-webkit-airplay="allow"
              controlsList="nodownload"
              disablePictureInPicture={false}
            >
              {videoSources.map((source, index) => (
                <source key={index} src={source.src} type={source.type} />
              ))}
              Ваш браузер не поддерживает воспроизведение видео.
            </video>}

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
  return <div 
    ref={containerRef}
    className={`relative w-full h-full bg-black/5 rounded-lg overflow-hidden touch-auto ${isInFullscreen ? 'bg-black' : ''}`}
  >
      {/* Poster image placeholder */}
      {!shouldLoadVideo && posterImage && <img src={posterImage} alt="Video preview" className="w-full h-full object-contain rounded-lg blur-sm" loading="lazy" />}
      
      {/* Video element - lazy load on play */}
      {shouldLoadVideo && <video 
        ref={videoRef} 
        className="w-full h-full object-contain rounded-lg touch-none" 
        preload="metadata"
        playsInline 
        webkit-playsinline="true"
        onClick={togglePlay}
        x-webkit-airplay="allow"
        controlsList="nodownload"
        disablePictureInPicture={false}
      >
        {videoSources.map((source, index) => (
          <source key={index} src={source.src} type={source.type} />
        ))}
        Ваш браузер не поддерживает воспроизведение видео.
      </video>}

      {/* Loading spinner */}
      {isLoading && <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>}
      
      {/* Initial Play button - shown before video loads */}
      {!shouldLoadVideo && <div className="absolute inset-0 flex items-center justify-center z-30">
          <Button variant="ghost" size="icon" onClick={handlePlayClick} className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-black/70 hover:bg-black/80 text-white backdrop-blur-sm active:scale-95 transition-transform">
            <Play className="h-8 w-8 md:h-10 md:w-10" />
          </Button>
        </div>}
      
      {/* Desktop: Progress bar at bottom, controls unified */}
      {/* Mobile: Centered play button */}
      {shouldLoadVideo && <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/90 to-transparent z-40 touch-auto">
          {/* Progress bar */}
          <div className="mb-3">
            <Slider value={[currentTime]} max={duration || 100} step={0.1} onValueChange={handleSeek} className="cursor-pointer touch-auto" />
          </div>
          
          {/* Mobile: Centered play button and fullscreen */}
          <div className="flex md:hidden items-center justify-center gap-4">
            <Button variant="ghost" size="icon" onClick={togglePlay} className="hover:bg-white/20 active:scale-95 w-12 h-12 rounded-full touch-auto transition-transform text-white">
              {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleFullscreen} className="hover:bg-white/20 active:scale-95 w-12 h-12 rounded-full touch-auto transition-transform text-white">
              <Maximize className="h-7 w-7" />
            </Button>
          </div>
          
          {/* Desktop: Full controls row */}
          <div className="hidden md:flex items-center gap-3 text-white">
            {/* Play button */}
            <Button variant="ghost" size="icon" onClick={togglePlay} className="hover:bg-white/20 active:scale-95 w-10 h-10 rounded-full touch-auto transition-transform">
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            
            {/* Time display */}
            <div className="text-sm font-medium whitespace-nowrap">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            
            {/* Spacer */}
            <div className="flex-1" />
            
            {/* Volume control */}
            <Button variant="ghost" size="icon" onClick={toggleMute} className="hover:bg-white/20 active:scale-95 w-10 h-10 rounded-full touch-auto transition-transform">
              {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
            </Button>
            
            {/* Volume slider - desktop only */}
            <div className="w-20">
              <Slider value={[isMuted ? 0 : volume]} max={1} step={0.01} onValueChange={handleVolumeChange} className="cursor-pointer touch-auto" />
            </div>
            
            {/* Fullscreen button */}
            <Button variant="ghost" size="icon" onClick={handleFullscreen} className="hover:bg-white/20 active:scale-95 w-10 h-10 rounded-full touch-auto transition-transform">
              <Maximize className="h-6 w-6" />
            </Button>
          </div>
        </div>}
    </div>;
});