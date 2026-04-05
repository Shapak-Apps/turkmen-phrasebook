// src/utils/ColorUtils.ts - Исправление ошибки withOpacity

/**
 * Утилиты для работы с цветами
 */
export const ColorUtils = {
  /**
   * Добавить прозрачность к цвету
   * @param color - цвет в формате #RRGGBB
   * @param opacity - прозрачность от 0 до 1
   */
  withOpacity: (color: string, opacity: number): string => {
    // Убираем # если есть
    const hex = color.replace('#', '');
    
    // Конвертируем opacity в hex (0-255)
    const alpha = Math.round(opacity * 255);
    const alphaHex = alpha.toString(16).padStart(2, '0');
    
    // Возвращаем цвет с альфа-каналом
    return `#${hex}${alphaHex}`;
  },

  /**
   * Преобразовать HEX в RGBA
   */
  hexToRgba: (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },

  /**
   * Затемнить цвет
   */
  darken: (color: string, amount: number): string => {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.slice(0, 2), 16) - Math.round(255 * amount));
    const g = Math.max(0, parseInt(hex.slice(2, 4), 16) - Math.round(255 * amount));
    const b = Math.max(0, parseInt(hex.slice(4, 6), 16) - Math.round(255 * amount));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  },

  /**
   * Осветлить цвет
   */
  lighten: (color: string, amount: number): string => {
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.slice(0, 2), 16) + Math.round(255 * amount));
    const g = Math.min(255, parseInt(hex.slice(2, 4), 16) + Math.round(255 * amount));
    const b = Math.min(255, parseInt(hex.slice(4, 6), 16) + Math.round(255 * amount));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
};

export default ColorUtils;