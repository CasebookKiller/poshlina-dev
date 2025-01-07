export const TCLR = import.meta.env.VITE_TXT_COLOR;
import { init, isTMA, miniApp, MiniAppHeaderColor, themeParams } from "@telegram-apps/sdk-react";

console.log('%cИнициализация приложения...', `color: ${TCLR}`);

export function isMobile() {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/mobile|android|iphone|ipad|ipod|windows phone/.test(userAgent)) {
    return true;
  } else {
    return false;
  }
}

export const MOBILE = isMobile();
console.log('%cMOBILE: %o', `color: ${TCLR}`, MOBILE);

let isDark = false;
const MA = miniApp; console.log('%cminiApp: %o', `color: ${TCLR}`, MA);
const TP = themeParams; console.log('%cthemeParams: %o', `color: ${TCLR}`, TP);

try {
  init();

  isTMA().then((isTMA) => {
    console.log('%cisTMA: %o', `color: ${TCLR}`, isTMA);
  }).catch((error) => {
    console.log('%cerror: %o', `color: ${TCLR}`, error);
  });
  
  if (MA.isSupported() &&!MA.isMounted()) MA.mount();

  isDark = MA.isDark(); console.log('%cDark Mode: ', `color: ${TCLR}`, isDark);
  
  if (!MA.isCssVarsBound()) MA.bindCssVars();

  if (!TP.isMounted()) TP.mount();
  if (!TP.isCssVarsBound()) TP.bindCssVars();

} catch (error) {
  console.log('%cОшибка инициализации приложения: %o', `color: ${TCLR}`, error);
  document.getElementById('root')!.remove();
}

export const accentTextColorHex = TP.accentTextColor(); console.log('%caccentTextColor: %o', `color: ${accentTextColorHex}`, accentTextColorHex);
export const destructiveColorHex = TP.destructiveTextColor(); console.log('%cdestructiveColor: %o', `color: ${destructiveColorHex}`, destructiveColorHex);
export const backgroundColorHex = TP.backgroundColor(); console.log('%cbackgroundColor: %o', `color: ${backgroundColorHex}`, backgroundColorHex);
export const secondaryBgColorHex = TP.secondaryBackgroundColor(); console.log('%csecondaryBgColor: %o', `color: ${secondaryBgColorHex}`, secondaryBgColorHex);
export const headerBgColorHex = TP.headerBackgroundColor(); console.log('%cheaderBgColor: %o', `color: ${headerBgColorHex}`, headerBgColorHex);
export const textColorHex = TP.textColor(); console.log('%ctextColor: %o', `color: ${textColorHex}`, textColorHex);
export const buttonColorHex = TP.buttonColor(); console.log('%cbuttonColor: %o', `color: ${buttonColorHex}`, buttonColorHex);
export const buttonTextColorHex = TP.buttonTextColor(); console.log('%cbuttonTextColor: %o', `color: ${buttonTextColorHex}`, buttonTextColorHex);
export const hintColorHex = TP.hintColor(); console.log('%chintColor: %o', `color: ${hintColorHex}`, hintColorHex);
export const subtitleTextColorHex = TP.subtitleTextColor(); console.log('%csubtitleTextColor: %o', `color: ${subtitleTextColorHex}`, subtitleTextColorHex);
export const linkColorHex = TP.linkColor(); console.log('%clinkColor: %o', `color: ${linkColorHex}`, linkColorHex);
export const sectionHeaderTextColorHex = TP.sectionHeaderTextColor(); console.log('%csectionHeaderTextColor: %o', `color: ${sectionHeaderTextColorHex}`, sectionHeaderTextColorHex);
export const sectionBgColorHex = TP.sectionBackgroundColor(); console.log('%csectionBgColor: %o', `color: ${sectionBgColorHex}`, sectionBgColorHex);
export const sectionSeparatorColorHex = TP.sectionSeparatorColor(); console.log('%csectionSeparatorColor: %o', `color: ${sectionSeparatorColorHex}`, sectionSeparatorColorHex);
export const buttonBarBgColorHex = TP.bottomBarBgColor(); console.log('%cbuttonBarBgColor: %o', `color: ${buttonBarBgColorHex}`, buttonBarBgColorHex);

export const accentTextColor = MOBILE ? accentTextColorHex : 'var(--tg-theme-accent-text-color)';//TP ? TP.accentTextColor() : isDark ? '#69c2d0': '#1c93e3';//
export const destructiveColor = MOBILE ? destructiveColorHex : 'var(--tg-theme-destructive-text-color)';//TP ? TP.destructiveTextColor() : isDark ? '#ee686f': '#cc2929';//
export const backgroundColor = MOBILE ? backgroundColorHex : 'var(--tg-theme-bg-color)';//TP ? TP.backgroundColor() : isDark ? '#213035': '#ffffff';//
export const secondaryBgColor = MOBILE ? secondaryBgColorHex : 'var(--tg-theme-secondary-bg-color)';//TP ? TP.secondaryBackgroundColor() : isDark ? '#152023': '#f0f0f0';//
export const headerBgColor = MOBILE ? headerBgColorHex : 'var(--tg-theme-header-bg-color)';//TP ? TP.headerBackgroundColor() : isDark ? '#242f34': '#527da3';//
export const textColor = MOBILE ? textColorHex : 'var(--tg-theme-text-color)';//TP ? TP.textColor() : isDark ? '#ffffff': '#222222';//
export const buttonColor = MOBILE ? buttonColorHex : 'var(--tg-theme-button-color)';//TP ? TP.buttonColor() : isDark ? '#59bccd': '#50a8eb';//
export const buttonTextColor = MOBILE ? buttonTextColorHex : 'var(--tg-theme-button-text-color)';//TP ? TP.buttonTextColor() : isDark ? '#ffffff': '#ffffff';//
export const hintColor = MOBILE ? hintColorHex : 'var(--tg-theme-hint-color)';//TP ? TP.hintColor() : isDark ? '#7b8d92': '#a8a8a8';//
export const subtitleTextColor = MOBILE ? subtitleTextColorHex : 'var(--tg-theme-subtitle-text-color)';//TP ? TP.subtitleTextColor() : isDark ? '#7b888a': '#82868a';//
export const linkColor = MOBILE ? linkColorHex : 'var(--tg-theme-link-color)';//TP ? TP.linkColor() : isDark ? '#63b7c4': '#2678b6';//
export const sectionHeaderTextColor = MOBILE ? sectionHeaderTextColorHex : 'var(--tg-theme-section-header-text-color)';//TP ? TP.sectionHeaderTextColor() : isDark ? '#7acedc': '#3a95d5';//
export const sectionBgColor = MOBILE ? sectionBgColorHex : 'var(--tg-theme-section-bg-color)';//TP ? TP.sectionBackgroundColor() : isDark ? '#1d292e': '#ffffff';//
export const sectionSeparatorColor = MOBILE ? sectionSeparatorColorHex : 'var(--tg-theme-section-separator-color)';//TP ? TP.sectionSeparatorColor() : isDark ? '#0d1316': '#d9d9d9';//
export const buttonBarBgColor = MOBILE ? buttonBarBgColorHex : 'var(--tg-theme-button-bar-bg-color)';//TP ? TP.bottomBarBgColor() : isDark ? '#152023': '#f0f0f0';//

/*
export const accentTextColor = !isDark ? '#69c2d0': TP.accentTextColor();//
export const destructiveColor = !isDark ? '#ee686f': TP.destructiveTextColor();//
export const backgroundColor = !isDark ? '#213035': TP.backgroundColor();//
export const secondaryBgColor = !isDark ? '#232e3c': TP.secondaryBackgroundColor();//
export const headerBgColor = !isDark ? '#242f34': TP.headerBackgroundColor();//
export const textColor = !isDark ? '#ffffff': TP.textColor();//
export const buttonColor = !isDark ? '#59bccd': TP.buttonColor();//
export const buttonTextColor = !isDark ? '#ffffff': TP.buttonTextColor();//
export const hintColor = !isDark ? '#7b8d92': TP.hintColor();//
export const subtitleTextColor = !isDark ? '#7b888a': TP.subtitleTextColor();//
export const linkColor = !isDark ? '#63b7c4': TP.linkColor();//
export const sectionHeaderTextColor = !isDark ? '#7acedc': TP.sectionHeaderTextColor();//
export const sectionBgColor = !isDark ? '#1d292e': TP.sectionBackgroundColor();//
export const sectionSeparatorColor = !isDark ? '#0d1316': TP.sectionSeparatorColor();
export const buttonBarBgColor = !isDark ? '#152023': TP.bottomBarBgColor();
*/

export const outlineColor = !isDark ? '#ffffff1a': '#ffffff1a';

export const fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Roboto", "Apple Color Emoji", "Helvetica Neue", sans-serif';
export const fontWeightAccent3 = 400;
export const fontWeightAccent2 = 600;

export const opacityCodes = {
  100: 'FF', 99: 'FC', 98: 'FA', 97: 'F7', 96: 'F5',
   95: 'F2', 94: 'F0', 93: 'ED', 92: 'EB', 91: 'E8', 
   90: 'E6', 89: 'E3', 88: 'E0', 87: 'DE', 86: 'DB',
   85: 'D9', 84: 'D6', 83: 'D4', 82: 'D1', 81: 'CF',
   80: 'CC', 79: 'C9', 78: 'C7', 77: 'C4', 76: 'C2',
   75: 'BF', 74: 'BD', 73: 'BA', 72: 'B8', 71: 'B5',
   70: 'B3', 69: 'B0', 68: 'AD', 67: 'AB', 66: 'A8',
   65: 'A6', 64: 'A3', 63: 'A1', 62: '9E', 61: '9C',
   60: '99', 59: '96', 58: '94', 57: '91', 56: '8F',
   55: '8C', 54: '8A', 53: '87', 52: '85', 51: '82',
   50: '80', 49: '7D', 48: '7A', 47: '78', 46: '75',
   45: '73', 44: '70', 43: '6E', 42: '6B', 41: '69',
   40: '66', 39: '63', 38: '61', 37: '5E', 36: '5C',
   35: '59', 34: '57', 33: '54', 32: '52', 31: '4F',
   30: '4D', 29: '4A', 28: '47', 27: '45', 26: '42',
   25: '40', 24: '3D', 23: '3B', 22: '38', 21: '36',
   20: '33', 19: '30', 18: '2E', 17: '2B', 16: '29',
   15: '26', 14: '24', 13: '21', 12: '1F', 11: '1C',
   10: '1A',  9: '17',  8: '14',  7: '12',  6: '0F',
    5: '0D',  4: '0A',  3: '08',  2: '05',  1: '03',
    0: '00'
};

if (MA.isMounted()) {
  if (MA.setHeaderColor.isAvailable() && MA.setHeaderColor.supports.rgb()) {
    const color: MiniAppHeaderColor = `#${String(secondaryBgColor).replace('#', '')}`;
    const bg: MiniAppHeaderColor = `#${String(backgroundColor).replace('#', '')}`;
    MA.setHeaderColor(color);
    MA.setBackgroundColor(bg);
    MA.setBottomBarColor(color);

    const bindCustomCss = true;

    if (bindCustomCss) {
      // Замена переменных CSS для TGUI
      const style = document.documentElement.style;
      // выглядит не очень красиво, поскольку добавляются стили в свойство html style
      // вероятно лучше переписать index css
      
      console.log('%c--- style: %o', `color: ${TCLR}`, headerBgColor);

      style.setProperty('--tg-theme-tertiary-bg-color', isDark ? sectionBgColorHex + opacityCodes['10'] : secondaryBgColor || '');
      
      const tguiBgColor = `var(--tg-theme-bg-color, ${backgroundColor})`; const tguiBgColorHex = backgroundColorHex || '';
      const tguiTextColor = `var(--tg-theme-text-color, ${textColor})`; const tguiTextColorHex = textColorHex || '';
      const tguiHintColor = `var(--tg-theme-hint-color, ${hintColor})`; const tguiHintColorHex = hintColorHex || '';
      const tguiLinkColor = `var(--tg-theme-link-color, ${linkColor})`; const tguiLinkColorHex = linkColorHex || '';
      const tguiButtonColor = `var(--tg-theme-button-color, ${buttonColor})`; const tguiButtonColorHex = buttonColorHex || '';
      const tguiButtonTextColor = `var(--tg-theme-button-text-color, ${buttonTextColor})`; const tguiButtonTextColorHex = buttonTextColorHex || '';
      const tguiSecondaryBgColor = `var(--tg-theme-secondary-bg-color, ${secondaryBgColor})`; const tguiSecondaryBgColorHex = secondaryBgColorHex || '';
      const tguiHeaderBgColor = `var(--tg-theme-header-bg-color, ${headerBgColor})`; const tguiHeaderBgColorHex = headerBgColorHex || '';
      const tguiAccentTextColor = `var(--tg-theme-accent-text-color, ${accentTextColor})`; const tguiAccentTextColorHex = accentTextColorHex || '';
      const tguiSectionBgColor = `var(--tg-theme-section-bg-color, ${sectionBgColor})`; const tguiSectionBgColorHex = sectionBgColorHex || '';
      const tguiSectionHeaderTextColor = `var(--tg-theme-section-header-text-color, ${sectionHeaderTextColor})`; const tguiSectionHeaderTextColorHex = sectionHeaderTextColorHex || '';
      const tguiSubtitleTextColor = `var(--tg-theme-subtitle-text-color, ${subtitleTextColor})`; const tguiSubtitleTextColorHex = subtitleTextColorHex || '';
      const tguiDestructiveTextColor = `var(--tg-theme-destructive-text-color, ${destructiveColor})`; const tguiDestructiveTextColorHex = destructiveColorHex || '';

      style.setProperty('--tgui--bg_color', MOBILE ? tguiBgColorHex : tguiBgColor);
      style.setProperty('--tgui--text_color', MOBILE ? tguiTextColorHex : tguiTextColor);
      style.setProperty('--tgui--hint_color', MOBILE ? tguiHintColorHex : tguiHintColor);
      style.setProperty('--tgui--link_color', MOBILE ? tguiLinkColorHex : tguiLinkColor);
      style.setProperty('--tgui--button_color', MOBILE ? tguiButtonColorHex : tguiButtonColor);
      style.setProperty('--tgui--button_text_color', MOBILE ? tguiButtonTextColorHex : tguiButtonTextColor);
      style.setProperty('--tgui--secondary_bg_color', MOBILE ? tguiSecondaryBgColorHex : tguiSecondaryBgColor);
      style.setProperty('--tgui--header_bg_color', MOBILE ? tguiHeaderBgColorHex : tguiHeaderBgColor);
      style.setProperty('--tgui--accent_text_color', MOBILE ? tguiAccentTextColorHex : tguiAccentTextColor);
      style.setProperty('--tgui--section_bg_color', MOBILE ? tguiSectionBgColorHex : tguiSectionBgColor);
      style.setProperty('--tgui--section_header_text_color', MOBILE ? tguiSectionHeaderTextColorHex : tguiSectionHeaderTextColor);
      style.setProperty('--tgui--subtitle_text_color', MOBILE ? tguiSubtitleTextColorHex : tguiSubtitleTextColor);
      style.setProperty('--tgui--destructive_text_color', MOBILE ? tguiDestructiveTextColorHex : tguiDestructiveTextColor);

      style.setProperty('--tgui--skeleton','#ffffff' + opacityCodes['3']);
      style.setProperty('--tgui--divider','#ffffff' + opacityCodes['5']);
      style.setProperty('--tgui--outline',outlineColor);
      style.setProperty('--tgui--surface_primary','#171717' + opacityCodes['95']);
      style.setProperty('--tgui--tertiary_bg_color', MOBILE ? tguiSecondaryBgColorHex : tguiSecondaryBgColor);
      style.setProperty('--tgui--quartenary_bg_color','#2f2f2f');
      style.setProperty('--tgui--segmented_control_active_bg','#2f2f2f');
      style.setProperty('--tgui--card_bg_color','#242424');
      style.setProperty('--tgui--secondary_hint_color','#78797e');
      style.setProperty('--tgui--secondary_fill','#2990ff' + opacityCodes['15']);
      style.setProperty('--tgui--green','#32e55e');
      style.setProperty('--tgui--destructive_background','#ff2323' + opacityCodes['2']);
      style.setProperty('--tgui--primary_code_highlight','#69c2d0');
      style.setProperty('--tgui--secondary_code_highlight','#e937ed');
      style.setProperty('--tgui--tertiary_code_highlight','#5ae536');
      style.setProperty('--tgui--plain_background','#ffffff' + opacityCodes['8']);
      style.setProperty('--tgui--plain_foreground','#ffffff' + opacityCodes['95']);
      style.setProperty('--tgui--base--section--box_shadow','#000000' + opacityCodes['10']);

      style.setProperty('--adm-color-border', outlineColor);
      style.setProperty('--border-inner', 'solid 1px var(--adm-color-border)');

    }
  }
}