import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useFormValidation = () => {
  const { t } = useTranslation();

  useEffect(() => {
    const handleInvalid = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      
      // Предотвращаем показ стандартного сообщения браузера
      e.preventDefault();
      
      // Устанавливаем кастомное сообщение на основе типа ошибки
      if (target.validity.valueMissing) {
        target.setCustomValidity(t('auth.validation.required'));
      } else if (target.validity.typeMismatch && target.type === 'email') {
        target.setCustomValidity(t('auth.validation.emailInvalid'));
      } else if (target.validity.patternMismatch && target.type === 'tel') {
        target.setCustomValidity(t('auth.validation.phoneInvalid'));
      } else if (target.validity.tooShort) {
        const minLength = target.getAttribute('minlength') || '8';
        const currentLength = target.value.length;
        target.setCustomValidity(
          t('auth.validation.minLength', { min: minLength, current: currentLength.toString() })
        );
      } else if (target.validity.tooLong) {
        const maxLength = target.getAttribute('maxlength') || '100';
        target.setCustomValidity(
          t('auth.validation.maxLength', { max: maxLength })
        );
      } else {
        target.setCustomValidity('');
      }
      
      // Показываем сообщение
      target.reportValidity();
    };

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      // Очищаем кастомное сообщение при вводе
      target.setCustomValidity('');
    };

    // Добавляем обработчики ко всем полям формы
    const inputs = document.querySelectorAll('input[required], input[type="email"], input[type="tel"], input[minlength], input[maxlength], textarea[required], textarea[minlength], textarea[maxlength]');
    
    inputs.forEach((input) => {
      input.addEventListener('invalid', handleInvalid);
      input.addEventListener('input', handleInput);
    });

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener('invalid', handleInvalid);
        input.removeEventListener('input', handleInput);
      });
    };
  }, [t]);

  return null;
};
