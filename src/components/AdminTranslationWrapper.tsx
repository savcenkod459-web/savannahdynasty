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
    let mouseDownTarget: EventTarget | null = null;

    const handleMouseDown = (e: MouseEvent) => {
      mouseDownTarget = e.target;
      isSelecting = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Если мышь движется с нажатой кнопкой, это выделение текста
      if (e.buttons === 1) {
        isSelecting = true;
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Если был процесс выделения, отменяем клик по ссылкам/кнопкам
      if (isSelecting) {
        const selection = window.getSelection();
        const text = selection?.toString().trim();
        if (text && text.length > 0) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    const handleTextSelection = (e: MouseEvent) => {
      // Проверяем, был ли клик внутри меню перевода
      if (menuRef.current && menuRef.current.contains(e.target as Node)) {
        return;
      }

      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (text && text.length > 0) {
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();

        if (rect) {
          setSelectedText(text);
          setMenuPosition({
            x: rect.left + window.scrollX,
            y: rect.bottom + window.scrollY + 10
          });
          setShowMenu(true);
        }
      } else if (!menuRef.current?.contains(e.target as Node)) {
        setShowMenu(false);
      }

      // Сбрасываем флаг выделения
      isSelecting = false;
    };

    // Добавляем все слушатели
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
