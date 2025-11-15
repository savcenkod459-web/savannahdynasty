import { useState, useEffect, ReactNode } from 'react';
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

  useEffect(() => {
    if (!isAdmin) return;

    const handleTextSelection = () => {
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
      } else {
        setShowMenu(false);
      }
    };

    // Добавляем слушатель на mouseup для отслеживания выделения
    document.addEventListener('mouseup', handleTextSelection);

    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
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
        <TranslationSelectionMenu
          selectedText={selectedText}
          position={menuPosition}
          onClose={handleCloseMenu}
        />
      )}
    </>
  );
};
