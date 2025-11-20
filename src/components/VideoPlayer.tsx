import { useState, useRef, useEffect, memo } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Play, Pause, Volume2, VolumeX, Maximize, Loader2, Square, Settings } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNetworkSpeed, VideoQuality } from "@/hooks/useNetworkSpeed";
import { useDataSaver } from "@/hooks/useDataSaver";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

// Generate quality variants for video
const generateQualityVariants = (url: string): Record<VideoQuality, string> => {
  const baseUrl = url.substring(0, url.lastIndexOf('.'));
  const extension = url.substring(url.lastIndexOf('.'));
  
  return {
    '1080p': `${baseUrl}-1080p${extension}`,
    '720p': `${baseUrl}-720p${extension}`,
    '480p': `${baseUrl}-480p${extension}`,
    '360p': `${baseUrl}-360p${extension}`,
  };
};

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
  const { recommendedVideoQuality, quality: networkQuality, downlink, isSlowConnection } = useNetworkSpeed();
  const { isEnabled: isDataSaverEnabled, toggleDataSaver } = useDataSaver();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInFullscreen, setIsInFullscreen] = useState(false);
  const [currentQuality, setCurrentQuality] = useState<VideoQuality>(isDataSaverEnabled ? '360p' : recommendedVideoQuality);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isAutoQuality, setIsAutoQuality] = useState(!isDataSaverEnabled);
  
  const qualityVariants = generateQualityVariants(videoUrl);
  const currentVideoUrl = qualityVariants[currentQuality] || videoUrl;
  
  // Data Saver mode enforcement
  useEffect(() => {
    if (isDataSaverEnabled) {
      setCurrentQuality('360p');
      setIsAutoQuality(false);
    }
  }, [isDataSaverEnabled]);
  
  // Auto-adjust quality based on network speed
  useEffect(() => {
    if (isAutoQuality && !isDataSaverEnabled && recommendedVideoQuality !== currentQuality) {
      const wasPlaying = isPlaying;
      const savedTime = currentTime;
      
      setCurrentQuality(recommendedVideoQuality);
      
      // Resume playback at same position if was playing
      if (videoRef.current && wasPlaying) {
        videoRef.current.currentTime = savedTime;
        setTimeout(() => {
          videoRef.current?.play();
        }, 100);
      }
      
      console.log(`Video quality adjusted to ${recommendedVideoQuality} (Network: ${networkQuality}, Speed: ${downlink.toFixed(2)} Mbps)`);
    }
  }, [recommendedVideoQuality, networkQuality, isAutoQuality]);
  
  // Optimize video loading
  
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
    if (!video) return;
    
    // Reset loading state when quality changes
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
  }, [currentVideoUrl, isOpen, isFullscreen, currentQuality]);
  
  const handleQualityChange = (quality: VideoQuality) => {
    if (isDataSaverEnabled) return; // Prevent manual changes in data saver mode
    
    const wasPlaying = isPlaying;
    const savedTime = currentTime;
    
    setCurrentQuality(quality);
    setIsAutoQuality(false);
    setShowQualityMenu(false);
    
    // Resume playback at same position if was playing
    if (videoRef.current && wasPlaying) {
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = savedTime;
          videoRef.current.play();
        }
      }, 100);
    }
  };
  
  const toggleAutoQuality = () => {
    if (isDataSaverEnabled) return; // Prevent auto quality in data saver mode
    
    setIsAutoQuality(!isAutoQuality);
    if (!isAutoQuality) {
      setCurrentQuality(recommendedVideoQuality);
    }
    setShowQualityMenu(false);
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

            {/* Video element with optimizations */}
            <video
              ref={videoRef}
              key={currentQuality}
              poster={posterImage}
              src={currentVideoUrl}
              className="max-w-full max-h-full object-contain"
              onClick={togglePlay}
              preload={isDataSaverEnabled ? "none" : (isSlowConnection ? "metadata" : "auto")}
              playsInline
              x-webkit-airplay="allow"
              controlsList="nodownload"
              disablePictureInPicture={false}
              style={{
                willChange: 'transform',
                transform: 'translateZ(0)',
              }}
            >
              <source src={currentVideoUrl} type={getVideoType(currentVideoUrl)} />
              Ваш браузер не поддерживает воспроизведение видео.
            </video>

            {/* Loading spinner */}
            {isLoading && <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-white animate-spin" />
              </div>}

            {/* Video controls */}
            {isVideoLoaded && <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                {/* Data Saver / Network quality indicator */}
                <div className="mb-2 flex items-center gap-2 text-xs text-white/70">
                  {isDataSaverEnabled ? (
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      Режим экономии данных (360p)
                    </span>
                  ) : isAutoQuality && (
                    <>
                      <div className={`w-2 h-2 rounded-full ${
                        networkQuality === 'high' ? 'bg-green-500' :
                        networkQuality === 'medium' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`} />
                      <span>Auto ({currentQuality}) • {downlink.toFixed(1)} Mbps</span>
                    </>
                  )}
                </div>
                
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
                    {/* Quality selector */}
                    <div className="relative">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setShowQualityMenu(!showQualityMenu)} 
                        className="hover:bg-white/20"
                      >
                        <Settings className="h-5 w-5" />
                      </Button>
                      
                      {showQualityMenu && (
                        <div className="absolute bottom-full right-0 mb-2 bg-black/95 rounded-lg p-2 min-w-[160px]">
                          <div className="text-xs text-white/70 px-2 py-1 mb-1">Настройки</div>
                          
                          {/* Data Saver Toggle */}
                          <button
                            onClick={toggleDataSaver}
                            className={`w-full text-left px-2 py-1.5 text-sm rounded mb-1 ${
                              isDataSaverEnabled ? 'bg-blue-500/20 text-blue-400' : 'text-white hover:bg-white/10'
                            }`}
                          >
                            🔋 Экономия данных
                          </button>
                          
                          <div className="h-px bg-white/10 my-1" />
                          
                          <button
                            onClick={toggleAutoQuality}
                            disabled={isDataSaverEnabled}
                            className={`w-full text-left px-2 py-1.5 text-sm rounded ${
                              isDataSaverEnabled ? 'opacity-50 cursor-not-allowed' :
                              isAutoQuality ? 'bg-primary/20 text-primary' : 'text-white hover:bg-white/10'
                            }`}
                          >
                            Auto ({recommendedVideoQuality})
                          </button>
                          
                          {(['1080p', '720p', '480p', '360p'] as VideoQuality[]).map((quality) => (
                            <button
                              key={quality}
                              onClick={() => handleQualityChange(quality)}
                              disabled={isDataSaverEnabled}
                              className={`w-full text-left px-2 py-1.5 text-sm rounded ${
                                isDataSaverEnabled ? 'opacity-50 cursor-not-allowed' :
                                currentQuality === quality && !isAutoQuality
                                  ? 'bg-primary/20 text-primary'
                                  : 'text-white hover:bg-white/10'
                              }`}
                            >
                              {quality}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
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
    className={`relative w-full h-full bg-black/5 rounded-lg overflow-hidden ${isInFullscreen ? 'bg-black' : ''}`}
  >
      {/* Video element with hardware acceleration */}
      <video 
        ref={videoRef}
        key={currentQuality}
        poster={posterImage}
        src={currentVideoUrl}
        className="w-full h-full object-contain rounded-lg" 
        preload={isDataSaverEnabled ? "none" : (isSlowConnection ? "metadata" : "auto")}
        playsInline
        onClick={togglePlay}
        x-webkit-airplay="allow"
        controlsList="nodownload"
        disablePictureInPicture={false}
        style={{
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
      >
        <source src={currentVideoUrl} type={getVideoType(currentVideoUrl)} />
        Ваш браузер не поддерживает воспроизведение видео.
      </video>

      {/* Loading spinner */}
      {isLoading && <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>}
      
      {/* Desktop: Progress bar at bottom, controls unified */}
      {/* Mobile: Centered play button */}
      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/90 to-transparent z-40">
          {/* Data Saver / Network quality indicator */}
          <div className="mb-2 flex items-center gap-2 text-xs text-white/70">
            {isDataSaverEnabled ? (
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="hidden md:inline">Режим экономии данных (360p)</span>
                <span className="md:hidden">🔋 360p</span>
              </span>
            ) : isAutoQuality && (
              <>
                <div className={`w-2 h-2 rounded-full ${
                  networkQuality === 'high' ? 'bg-green-500' :
                  networkQuality === 'medium' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`} />
                <span className="hidden md:inline">Auto Quality: {currentQuality} • {downlink.toFixed(1)} Mbps</span>
                <span className="md:hidden">{currentQuality}</span>
              </>
            )}
          </div>
          
          {/* Progress bar */}
          <div className="mb-3">
            <Slider value={[currentTime]} max={duration || 100} step={0.1} onValueChange={handleSeek} className="cursor-pointer touch-auto" />
          </div>
          
          {/* Mobile: Centered play button and fullscreen */}
          <div className="flex md:hidden items-center justify-center gap-4">
            <Button variant="ghost" size="icon" onClick={togglePlay} className="hover:bg-white/20 active:scale-95 w-12 h-12 rounded-full transition-transform text-white">
              {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleFullscreen} className="hover:bg-white/20 active:scale-95 w-12 h-12 rounded-full transition-transform text-white">
              <Maximize className="h-7 w-7" />
            </Button>
          </div>
          
          {/* Desktop: Full controls row */}
          <div className="hidden md:flex items-center gap-3 text-white">
            {/* Play button */}
            <Button variant="ghost" size="icon" onClick={togglePlay} className="hover:bg-white/20 active:scale-95 w-10 h-10 rounded-full transition-transform">
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            
            {/* Time display */}
            <div className="text-sm font-medium whitespace-nowrap">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            
            {/* Spacer */}
            <div className="flex-1" />
            
            {/* Quality selector */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowQualityMenu(!showQualityMenu)} 
                className="hover:bg-white/20 active:scale-95 w-10 h-10 rounded-full transition-transform"
              >
                <Settings className="h-5 w-5" />
              </Button>
              
              {showQualityMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-black/95 rounded-lg p-2 min-w-[160px] border border-white/10">
                  <div className="text-xs text-white/70 px-2 py-1 mb-1">Настройки</div>
                  
                  {/* Data Saver Toggle */}
                  <button
                    onClick={toggleDataSaver}
                    className={`w-full text-left px-2 py-1.5 text-sm rounded mb-1 transition-colors ${
                      isDataSaverEnabled ? 'bg-blue-500/20 text-blue-400' : 'text-white hover:bg-white/10'
                    }`}
                  >
                    🔋 Экономия данных
                  </button>
                  
                  <div className="h-px bg-white/10 my-1" />
                  
                  <button
                    onClick={toggleAutoQuality}
                    disabled={isDataSaverEnabled}
                    className={`w-full text-left px-2 py-1.5 text-sm rounded transition-colors ${
                      isDataSaverEnabled ? 'opacity-50 cursor-not-allowed' :
                      isAutoQuality ? 'bg-primary/20 text-primary' : 'text-white hover:bg-white/10'
                    }`}
                  >
                    Auto ({recommendedVideoQuality})
                  </button>
                  
                  {(['1080p', '720p', '480p', '360p'] as VideoQuality[]).map((quality) => (
                    <button
                      key={quality}
                      onClick={() => handleQualityChange(quality)}
                      disabled={isDataSaverEnabled}
                      className={`w-full text-left px-2 py-1.5 text-sm rounded transition-colors ${
                        isDataSaverEnabled ? 'opacity-50 cursor-not-allowed' :
                        currentQuality === quality && !isAutoQuality
                          ? 'bg-primary/20 text-primary'
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      {quality}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Volume control */}
            <Button variant="ghost" size="icon" onClick={toggleMute} className="hover:bg-white/20 active:scale-95 w-10 h-10 rounded-full transition-transform">
              {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
            </Button>
            
            {/* Volume slider - desktop only */}
            <div className="w-20">
              <Slider value={[isMuted ? 0 : volume]} max={1} step={0.01} onValueChange={handleVolumeChange} className="cursor-pointer" />
            </div>
            
            {/* Fullscreen button */}
            <Button variant="ghost" size="icon" onClick={handleFullscreen} className="hover:bg-white/20 active:scale-95 w-10 h-10 rounded-full transition-transform">
              <Maximize className="h-6 w-6" />
            </Button>
          </div>
        </div>
    </div>;
});