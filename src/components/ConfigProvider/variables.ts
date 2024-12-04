const TCLR = import.meta.env.VITE_TXT_COLOR;

import { init, miniApp, themeParams } from "@telegram-apps/sdk";

init();

const MA = miniApp;
console.log('%cminiApp: %o', `color: ${TCLR}`, MA);
let isDark = false;

if (MA.isSupported() && !MA.isMounted()) {
  MA.mount();
  isDark = MA.isDark();
}

console.log('Dark Mode: ', isDark);

const TP = themeParams;

try {
  if (!TP.isMounted()) TP.mount();
  if (!TP.isCssVarsBound) TP.bindCssVars();

} catch (error) {
  console.log('%cerror: %o', `color: ${TCLR}`, error);
}

/*
  //--tgui--bg_color: var(--tg-theme-bg-color,#213035);
  //--tgui--text_color: var(--tg-theme-text-color,#ffffff);
  //--tgui--hint_color: var(--tg-theme-hint-color,#7b8d92);
  //--tgui--link_color: var(--tg-theme-link-color,#63b7c4);
  //--tgui--button_color: var(--tg-theme-button-color,#59bccd);
  //--tgui--button_text_color: var(--tg-theme-button-text-color,#ffffff);
  //--tgui--secondary_bg_color: var(--tg-theme-secondary-bg-color,#152023);
  //--tgui--header_bg_color: var(--tg-theme-header-bg-color,#242f34);
  //--tgui--accent_text_color: var(--tg-theme-accent-text-color,#69c2d0);
  //--tgui--section_bg_color: var(--tg-theme-section-bg-color,#1d292e);
  //--tgui--section_header_text_color: var(--tg-theme-section-header-text-color,#7acedc);
  //--tgui--subtitle_text_color: var(--tg-theme-subtitle-text-color,#7b888a);
  //--tgui--destructive_text_color: var(--tg-theme-destructive-text-color,#ee686f);
    --tgui--skeleton: hsla(0,0%,100%,.03);
    --tgui--divider: hsla(0,0%,100%,.05);
    --tgui--outline: hsla(0,0%,100%,.1);
    --tgui--surface_primary: hsla(0,0%,9%,.95);
    --tgui--tertiary_bg_color: #2a2a2a;
    --tgui--quartenary_bg_color: #2f2f2f;
    --tgui--segmented_control_active_bg: #2f2f2f;
    --tgui--card_bg_color: #242424;
    --tgui--secondary_hint_color: #78797e;
    --tgui--secondary_fill: rgba(41,144,255,.15);
    --tgui--green: #32e55e;
    --tgui--destructive_background: rgba(255,35,35,.02);
    --tgui--primary_code_highlight: #69c2d0;
    --tgui--secondary_code_highlight: #e937ed;
    --tgui--tertiary_code_highlight: #5ae536;
    --tgui--plain_background: hsla(0,0%,100%,.08);
    --tgui--plain_foreground: hsla(0,0%,100%,.95);
*/

export const accentTextColor = !isDark ? '#69c2d0': TP.accentTextColor();//
console.log('%caccentTextColor: %o', 'color: ' + accentTextColor, accentTextColor);
console.log('%caccentTextColor: %o', 'color: ' + TP.accentTextColor(), TP.accentTextColor());
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