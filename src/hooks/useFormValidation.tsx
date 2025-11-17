import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useFormValidation = () => {
  const { t } = useTranslation();

  useEffect(() => {
    const validateField = (target: HTMLInputElement | HTMLTextAreaElement) => {
      // Сбрасываем любое предыдущее кастомное сообщение
      target.setCustomValidity('');
      
      // Проверяем валидность после сброса
      if (!target.validity.valid) {
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
        }
      }
      return target.validity.valid;
    };

    const handleInvalid = (e: Event) => {
      e.preventDefault();
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      validateField(target);
      target.reportValidity();
    };

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      target.setCustomValidity('');
    };

    const handleSubmit = (e: Event) => {
      const form = e.target as HTMLFormElement;
      const inputs = form.querySelectorAll('input[required], input[type="email"], input[type="tel"], input[minlength], input[maxlength], textarea[required], textarea[minlength], textarea[maxlength]');
      
      inputs.forEach((input) => {
        validateField(input as HTMLInputElement | HTMLTextAreaElement);
      });
    };

    // Добавляем обработчики ко всем полям формы
    const inputs = document.querySelectorAll('input[required], input[type="email"], input[type="tel"], input[minlength], input[maxlength], textarea[required], textarea[minlength], textarea[maxlength]');
    const forms = document.querySelectorAll('form');
    
    inputs.forEach((input) => {
      input.addEventListener('invalid', handleInvalid);
      input.addEventListener('input', handleInput);
    });

    forms.forEach((form) => {
      form.addEventListener('submit', handleSubmit);
    });

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener('invalid', handleInvalid);
        input.removeEventListener('input', handleInput);
      });
      forms.forEach((form) => {
        form.removeEventListener('submit', handleSubmit);
      });
    };
  }, [t]);

  return null;
};
