import { useState, useEffect, ReactNode, useRef } from 'react';
import { useAdminRole } from '@/hooks/useAdminRole';
import { TranslationSelectionMenu } from './TranslationSelectionMenu';

interface AdminTranslationWrapperProps {
  children: ReactNode;
}

export const AdminTranslationWrapper = ({ children }: AdminTranslationWrapperProps) => {
  const { isAdmin, loading } = useAdminRole();
  const [selectedText, setSelectedText] = useState('');
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Добавляем CSS класс к body для разрешения выделения текста админу
  useEffect(() => {
    if (isAdmin) {
      document.body.classList.add('admin-text-selection-enabled');
    } else {
      document.body.classList.remove('admin-text-selection-enabled');
    }
    return () => {
      document.body.classList.remove('admin-text-selection-enabled');
    };
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;

    let isSelecting = false;
    let startX = 0;
    let startY = 0;
    let checkTimeout: NodeJS.Timeout | null = null;

    const handleMouseDown = (e: MouseEvent) => {
      startX = e.clientX;
      startY = e.clientY;
      isSelecting = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (e.buttons === 1) {
        const deltaX = Math.abs(e.clientX - startX);
        const deltaY = Math.abs(e.clientY - startY);
        if (deltaX > 3 || deltaY > 3) {
          isSelecting = true;
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (isSelecting) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    };

    const checkAndShowMenu = () => {
      console.log('[Translation] Checking selection...');
      
      // Проверяем, не внутри ли меню
      if (menuRef.current && document.activeElement && menuRef.current.contains(document.activeElement)) {
        console.log('[Translation] Inside menu, skipping');
        return;
      }

      const selection = window.getSelection();
      const text = selection?.toString().trim();
      
      console.log('[Translation] Selection text:', text?.substring(0, 100));

      if (text && text.length > 0) {
        try {
          const range = selection?.getRangeAt(0);
          const rect = range?.getBoundingClientRect();

          console.log('[Translation] Rect:', {
            width: rect?.width,
            height: rect?.height,
            top: rect?.top,
            left: rect?.left
          });

          // Убираем проверку на ширину и высоту - rect может быть странным для многострочного текста
          if (rect) {
            const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            
            const posX = rect.left + scrollX;
            const posY = rect.bottom + scrollY + 10;

            console.log('[Translation] ✅ Opening menu at:', { x: posX, y: posY });
            
            setSelectedText(text);
            setMenuPosition({ x: posX, y: posY });
            setShowMenu(true);
          } else {
            console.log('[Translation] ❌ No rect available');
          }
        } catch (e) {
          console.error('[Translation] ❌ Error:', e);
        }
      } else {
        console.log('[Translation] No text selected');
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (menuRef.current && menuRef.current.contains(e.target as Node)) {
        console.log('[Translation] Mouse up inside menu');
        return;
      }

      console.log('[Translation] Mouse up detected');
      
      if (checkTimeout) {
        clearTimeout(checkTimeout);
      }

      // Увеличиваем задержку для надежности
      checkTimeout = setTimeout(() => {
        checkAndShowMenu();
        isSelecting = false;
      }, 200);
    };

    const handleSelectionChange = () => {
      console.log('[Translation] Selection change event');
      
      if (checkTimeout) {
        clearTimeout(checkTimeout);
      }
      
      checkTimeout = setTimeout(() => {
        checkAndShowMenu();
      }, 200);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        const selection = window.getSelection();
        const text = selection?.toString().trim();
        if (!text || text.length === 0) {
          setShowMenu(false);
        }
      }
    };

    console.log('[Translation] ✅ Event listeners installed for admin');

    document.addEventListener('mousedown', handleMouseDown, true);
    document.addEventListener('mousemove', handleMouseMove, true);
    document.addEventListener('click', handleClick, true);
    document.addEventListener('mouseup', handleMouseUp, true);
    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      console.log('[Translation] Removing event listeners');
      if (checkTimeout) {
        clearTimeout(checkTimeout);
      }
      document.removeEventListener('mousedown', handleMouseDown, true);
      document.removeEventListener('mousemove', handleMouseMove, true);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('mouseup', handleMouseUp, true);
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAdmin]);

  const handleCloseMenu = () => {
    setShowMenu(false);
    setSelectedText('');
    
    // Снимаем выделение текста
    const selection = window.getSelection();
    selection?.removeAllRanges();
  };

  if (loading) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      {isAdmin && showMenu && (
        <div ref={menuRef}>
          <TranslationSelectionMenu
            selectedText={selectedText}
            position={menuPosition}
            onClose={handleCloseMenu}
          />
        </div>
      )}
    </>
  );
};
