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

    const handleMouseDown = (e: MouseEvent) => {
      startX = e.clientX;
      startY = e.clientY;
      isSelecting = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Если мышь сдвинулась с нажатой кнопкой более чем на 3 пикселя, это выделение
      if (e.buttons === 1) {
        const deltaX = Math.abs(e.clientX - startX);
        const deltaY = Math.abs(e.clientY - startY);
        if (deltaX > 3 || deltaY > 3) {
          isSelecting = true;
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Блокируем клики по ссылкам/кнопкам только если был процесс выделения
      if (isSelecting) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    };

    const handleTextSelection = (e: MouseEvent) => {
      // Проверяем, был ли клик внутри меню перевода
      if (menuRef.current && menuRef.current.contains(e.target as Node)) {
        return;
      }

      // Небольшая задержка для корректного получения выделения
      setTimeout(() => {
        const selection = window.getSelection();
        const text = selection?.toString().trim();

        if (text && text.length > 0) {
          const range = selection?.getRangeAt(0);
          const rect = range?.getBoundingClientRect();

          if (rect) {
            // Вычисляем позицию меню с учетом прокрутки
            const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            
            setSelectedText(text);
            setMenuPosition({
              x: rect.left + scrollX,
              y: rect.bottom + scrollY + 10
            });
            setShowMenu(true);
          }
        } else if (!menuRef.current?.contains(e.target as Node)) {
          setShowMenu(false);
        }
      }, 10);

      // Сбрасываем флаг выделения после небольшой задержки
      setTimeout(() => {
        isSelecting = false;
      }, 100);
    };

    // Добавляем все слушатели с capture: true для перехвата событий
    document.addEventListener('mousedown', handleMouseDown, true);
    document.addEventListener('mousemove', handleMouseMove, true);
    document.addEventListener('click', handleClick, true);
    document.addEventListener('mouseup', handleTextSelection, true);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown, true);
      document.removeEventListener('mousemove', handleMouseMove, true);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('mouseup', handleTextSelection, true);
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
