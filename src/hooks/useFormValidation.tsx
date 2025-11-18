import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useFormValidation = () => {
  const { t } = useTranslation();

  useEffect(() => {
    const validateField = (input: HTMLInputElement | HTMLTextAreaElement): boolean => {
      let errorMessage = '';

      if (input.validity.valueMissing) {
        errorMessage = t('auth.validation.required');
      } else if (input.validity.typeMismatch && input.type === 'email') {
        errorMessage = t('auth.validation.emailInvalid');
      } else if (input.validity.patternMismatch && input.type === 'tel') {
        errorMessage = t('auth.validation.phoneInvalid');
      } else if (input.validity.tooShort) {
        const minLength = input.getAttribute('minlength') || '8';
        const currentLength = input.value.length;
        errorMessage = t('auth.validation.minLength', { 
          min: minLength, 
          current: currentLength.toString() 
        });
      } else if (input.validity.tooLong) {
        const maxLength = input.getAttribute('maxlength') || '100';
        errorMessage = t('auth.validation.maxLength', { max: maxLength });
      }

      input.setCustomValidity(errorMessage);
      return input.validity.valid;
    };

    const handleInvalid = (e: Event) => {
      e.preventDefault();
      const input = e.target as HTMLInputElement | HTMLTextAreaElement;
      validateField(input);
      
      // Показываем сообщение об ошибке
      const errorSpan = input.parentElement?.querySelector('.validation-error');
      if (errorSpan) {
        errorSpan.textContent = input.validationMessage;
      } else {
        // Создаем элемент для отображения ошибки
        const span = document.createElement('span');
        span.className = 'validation-error text-sm text-destructive mt-1 block';
        span.textContent = input.validationMessage;
        input.parentElement?.appendChild(span);
      }
    };

    const handleInput = (e: Event) => {
      const input = e.target as HTMLInputElement | HTMLTextAreaElement;
      input.setCustomValidity('');
      
      // Убираем сообщение об ошибке
      const errorSpan = input.parentElement?.querySelector('.validation-error');
      if (errorSpan) {
        errorSpan.remove();
      }
      
      // Проверяем валидность после ввода
      if (input.value.length > 0) {
        validateField(input);
      }
    };

    const handleSubmit = (e: Event) => {
      const form = e.target as HTMLFormElement;
      const inputs = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
        'input[required], input[type="email"], input[type="tel"], input[minlength], input[maxlength], textarea[required], textarea[minlength], textarea[maxlength]'
      );
      
      let isValid = true;
      inputs.forEach((input) => {
        if (!validateField(input)) {
          isValid = false;
          // Показываем ошибку для невалидных полей
          const errorSpan = input.parentElement?.querySelector('.validation-error');
          if (!errorSpan && input.validationMessage) {
            const span = document.createElement('span');
            span.className = 'validation-error text-sm text-destructive mt-1 block';
            span.textContent = input.validationMessage;
            input.parentElement?.appendChild(span);
          }
        }
      });
      
      if (!isValid) {
        e.preventDefault();
      }
    };

    // Добавляем novalidate ко всем формам
    const forms = document.querySelectorAll('form');
    forms.forEach((form) => {
      form.setAttribute('novalidate', 'true');
      form.addEventListener('submit', handleSubmit);
    });

    // Добавляем обработчики ко всем полям формы
    const inputs = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      'input[required], input[type="email"], input[type="tel"], input[minlength], input[maxlength], textarea[required], textarea[minlength], textarea[maxlength]'
    );
    
    inputs.forEach((input) => {
      input.addEventListener('invalid', handleInvalid);
      input.addEventListener('input', handleInput);
      input.addEventListener('blur', () => {
        if (input.value.length > 0) {
          validateField(input);
        }
      });
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
