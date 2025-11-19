import { useState, memo } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { VideoPlayer } from "./VideoPlayer";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
interface CatDetailModalProps {
  images: string[];
  video?: string;
  isOpen: boolean;
  onClose: () => void;
}
const CatDetailModalComponent = ({
  images,
  video,
  isOpen,
  onClose
}: CatDetailModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);
  const goToNextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };
  const goToPreviousImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
  };
  const handleImageClick = () => {
    setIsImageFullscreen(true);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isImageFullscreen) {
      if (e.key === "ArrowRight") goToNextImage();
      if (e.key === "ArrowLeft") goToPreviousImage();
      if (e.key === "Escape") setIsImageFullscreen(false);
    }
  };
  return <>
      <Dialog open={isOpen && !isImageFullscreen && !isVideoFullscreen} onOpenChange={onClose}>
        <DialogContent className="max-w-[90vw] md:max-w-[85vw] max-h-[90vh] p-0 bg-background border-primary/20">
          <VisuallyHidden.Root>
            <DialogTitle>Просмотр фото и видео</DialogTitle>
            <DialogDescription>Галерея изображений и видео кота</DialogDescription>
          </VisuallyHidden.Root>
          <div className="relative w-full h-[90vh] flex flex-col md:flex-row">
            {/* Close button */}
            

            {/* Left panel - Images */}
            <div className="w-full md:w-1/2 h-[45vh] md:h-full relative md:border-r border-b md:border-b-0 border-primary/20">
              <div className="h-full flex items-center justify-center p-4 md:p-6">
                <div className="relative w-full h-full">
                  <img 
                    src={images[currentImageIndex]} 
                    alt={`Gallery ${currentImageIndex + 1}`} 
                    className="w-full h-full object-contain cursor-pointer rounded-lg" 
                    onClick={handleImageClick} 
                    loading="lazy"
                    decoding="async"
                  />
                  
                  {images.length > 1 && <>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={goToPreviousImage} 
                        className="!absolute !left-2 !top-[50%] !-translate-y-1/2 !z-[60] hover:bg-white/30 rounded-full text-white bg-black/50 backdrop-blur-sm p-3 transition-all hover:scale-110"
                        style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', zIndex: 60 }}
                      >
                        <ChevronLeft className="h-10 w-10" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={goToNextImage} 
                        className="!absolute !right-2 !top-[50%] !-translate-y-1/2 !z-[60] hover:bg-white/30 rounded-full text-white bg-black/50 backdrop-blur-sm p-3 transition-all hover:scale-110"
                        style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', zIndex: 60 }}
                      >
                        <ChevronRight className="h-10 w-10" />
                      </Button>

                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm z-30">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>}
                </div>
              </div>
            </div>

            {/* Right panel - Video */}
            <div className="w-full md:w-1/2 h-[45vh] md:h-full p-4 md:p-6 flex items-center justify-center bg-black/5">
              {video ? <div className="w-full h-full flex items-center justify-center">
                  <VideoPlayer videoUrl={video} isOpen={true} onClose={() => {}} onToggleFullscreen={() => setIsVideoFullscreen(true)} />
                </div> : <div className="text-center text-muted-foreground">
                  <p>Видео не загружено</p>
                </div>}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Fullscreen Image Gallery */}
      <Dialog open={isImageFullscreen} onOpenChange={setIsImageFullscreen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none [&>button]:top-4 [&>button]:right-4 [&>button]:text-white [&>button]:hover:bg-white/20" onKeyDown={handleKeyDown}>
          <VisuallyHidden.Root>
            <DialogTitle>Полноэкранный просмотр</DialogTitle>
            <DialogDescription>Изображение в полноэкранном режиме</DialogDescription>
          </VisuallyHidden.Root>
          <div className="relative w-full h-[95vh] flex items-center justify-center">
            {images.length > 1 && <Button 
              variant="ghost" 
              size="icon" 
              className="!absolute !left-4 !top-[50%] !-translate-y-1/2 !z-[60] text-white hover:bg-white/30 rounded-full bg-black/50 backdrop-blur-sm p-3 transition-all hover:scale-110" 
              onClick={goToPreviousImage}
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 60 }}
            >
                <ChevronLeft className="h-10 w-10" />
              </Button>}

            <img src={images[currentImageIndex]} alt={`Gallery ${currentImageIndex + 1}`} className="max-w-full max-h-full object-contain" />

            {images.length > 1 && <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="!absolute !right-4 !top-[50%] !-translate-y-1/2 !z-[60] text-white hover:bg-white/30 rounded-full bg-black/50 backdrop-blur-sm p-3 transition-all hover:scale-110" 
                  onClick={goToNextImage}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 60 }}
                >
                  <ChevronRight className="h-10 w-10" />
                </Button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm z-30">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>}
          </div>
        </DialogContent>
      </Dialog>

      {/* Fullscreen Video */}
      <VideoPlayer videoUrl={video || ""} isOpen={isVideoFullscreen} onClose={() => setIsVideoFullscreen(false)} isFullscreen={true} onToggleFullscreen={() => setIsVideoFullscreen(false)} />
    </>;
};

export const CatDetailModal = memo(CatDetailModalComponent);