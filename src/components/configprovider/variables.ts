import { miniApp, themeParams } from "@telegram-apps/sdk";

themeParams.mount();
export const accentTextColor = themeParams.accentTextColor();
export const destructiveColor = themeParams.destructiveTextColor();
export const backgroundColor = themeParams.backgroundColor();
export const secondaryBgColor = themeParams.secondaryBackgroundColor();
export const secondaryHintColor = miniApp.isDark() ? '#78797e':'#a2acb0';
export const textColor = themeParams.textColor();
export const buttonColor = themeParams.buttonColor();
export const buttonTextColor = themeParams.buttonTextColor();
export const hintColor = themeParams.hintColor();
export const subtitleTextColor = themeParams.subtitleTextColor();
export const fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Roboto", "Apple Color Emoji", "Helvetica Neue", sans-serif';
export const fontWeightAccent3 = 400;
export const fontWeightAccent2 = 600;
export const linkColor = themeParams.linkColor();
export const sectionHeaderTextColor = themeParams.sectionHeaderTextColor();