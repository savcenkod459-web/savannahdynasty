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
    let selectionTimeout: NodeJS.Timeout | null = null;

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

    const checkSelection = () => {
      if (menuRef.current && document.activeElement && menuRef.current.contains(document.activeElement)) {
        return;
      }

      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (text && text.length > 0) {
        try {
          const range = selection?.getRangeAt(0);
          const rect = range?.getBoundingClientRect();

          if (rect && rect.width > 0 && rect.height > 0) {
            const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            
            setSelectedText(text);
            setMenuPosition({
              x: rect.left + scrollX,
              y: rect.bottom + scrollY + 10
            });
            setShowMenu(true);
          }
        } catch (e) {
          console.log('Selection error:', e);
        }
      }
    };

    const handleSelectionChange = () => {
      if (selectionTimeout) {
        clearTimeout(selectionTimeout);
      }
      
      selectionTimeout = setTimeout(() => {
        checkSelection();
      }, 100);
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (menuRef.current && menuRef.current.contains(e.target as Node)) {
        return;
      }

      setTimeout(() => {
        checkSelection();
        isSelecting = false;
      }, 50);
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

    document.addEventListener('mousedown', handleMouseDown, true);
    document.addEventListener('mousemove', handleMouseMove, true);
    document.addEventListener('click', handleClick, true);
    document.addEventListener('mouseup', handleMouseUp, true);
    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      if (selectionTimeout) {
        clearTimeout(selectionTimeout);
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
