# Оптимизация производительности для мобильных устройств

## Реализованные оптимизации

### 1. CSS Оптимизация (автоматическая)

#### Отключение тяжелых анимаций на мобильных
```css
@media (max-width: 768px) {
  .animate-float,
  .animate-gold-pulse,
  .animate-rotate-slow {
    animation: none !important;
  }
}
```

#### Упрощение эффектов размытия
- `blur-3xl` → упрощается до `blur(40px)`
- `blur-2xl` → упрощается до `blur(24px)`

#### Отключение декоративных элементов
- Элементы с `opacity-5` скрываются на мобильных
- Экономия ресурсов GPU

#### Упрощение эффектов при наведении
- `hover-lift` и `hover-scale` отключены
- Уменьшение нагрузки на рендеринг

#### Оптимизация теней
- Сложные тени (`shadow-glow`, `shadow-elegant`) заменяются простыми
- Меньше нагрузки на композитинг

#### Отключение backdrop-filter
- `backdrop-blur` отключается на мобильных
- Значительное улучшение производительности

### 2. Хуки для условных анимаций

#### useOptimizedAnimation
```typescript
const { shouldAnimate, getAnimationClasses } = useOptimizedAnimation();

// Условный рендеринг тяжелых анимаций
{shouldAnimate('heavy') && (
  <div className="animate-float blur-3xl" />
)}
```

#### useDevicePerformance (улучшен)
- Определяет мобильные устройства как low-end по умолчанию
- Проверяет количество ядер CPU
- Анализирует доступную память
- Учитывает качество сети

### 3. Поддержка prefers-reduced-motion

Автоматическое отключение всех анимаций для пользователей с настройкой "Уменьшить движение":
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 4. Утилиты производительности

Файл `src/utils/performanceOptimization.ts` содержит:
- `debounce` - для оптимизации частых вызовов
- `throttle` - для ограничения частоты вызовов
- `supportsHardwareAcceleration` - проверка GPU
- `getNetworkQuality` - определение качества сети
- `getOptimizedImageSize` - оптимизация размеров изображений

## Результаты оптимизации

### Мобильные устройства
- ✅ Отключены тяжелые анимации (float, pulse)
- ✅ Упрощены эффекты размытия (blur)
- ✅ Скрыты декоративные элементы
- ✅ Отключен backdrop-filter
- ✅ Упрощены тени
- ✅ Сокращена длительность transitions

### Десктоп
- ✅ Все анимации работают в полном объеме
- ✅ Красивые эффекты сохранены
- ✅ Плавные переходы

## Как использовать

### Автоматическая оптимизация
Большинство оптимизаций применяются автоматически через CSS media queries. Не требуется изменений в коде компонентов.

### Ручная оптимизация
Для особо тяжелых элементов используйте хук:

```typescript
import { useOptimizedAnimation } from '@/hooks/useOptimizedAnimation';

const MyComponent = () => {
  const { shouldAnimate } = useOptimizedAnimation();
  
  return (
    <>
      {/* Условный рендеринг тяжелых элементов */}
      {shouldAnimate('heavy') && (
        <HeavyAnimatedElement />
      )}
      
      {/* Легкие анимации всегда показываются */}
      {shouldAnimate('light') && (
        <LightAnimatedElement />
      )}
    </>
  );
};
```

## Рекомендации

1. **Используйте CSS анимации** вместо JavaScript
2. **Применяйте transform и opacity** для анимаций (GPU-accelerated)
3. **Избегайте изменения layout** свойств (width, height, top, left)
4. **Используйте will-change** с осторожностью
5. **Lazy load** изображения и тяжелые компоненты
6. **Debounce/throttle** обработчики событий scroll и resize

## Тестирование производительности

### Chrome DevTools
1. Откройте DevTools (F12)
2. Performance → Record
3. Выполните действия на странице
4. Analyze → Проверьте FPS, scripting time, rendering

### Lighthouse
1. Откройте DevTools (F12)
2. Lighthouse → Mobile
3. Performance audit
4. Цель: 90+ score

### Mobile Testing
- Тестируйте на реальных устройствах
- Используйте Chrome Remote Debugging
- Проверяйте на разных версиях iOS/Android
