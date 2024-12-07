import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react-swc';
// import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/poshlina-dev',
  plugins: [
    // Позволяет использовать React dev server наряду с созданием приложения React с помощью Vite.
    // https://npmjs.com/package/@vitejs/plugin-react-swc
    react(),
    // Позволяет использовать свойство compiler Options.paths в файле tsconfig.json.
    // https://www.npmjs.com/package/vite-tsconfig-paths
    tsconfigPaths(),
    // Позволяет использовать самозаверяющие сертификаты для запуска сервера разработки по протоколу HTTPS.
    // https://www.npmjs.com/package/@vitejs/plugin-basic-ssl
    // basicSsl(),
  ],
  publicDir: './public',
  server: {
    // Предоставляет доступ к вашему серверу разработки и делает его доступным для устройств в той же сети.
    host: true,
  },
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          //if (id.includes('react-bootstrap-icons')) {
          //  return 'reactbicons';
          //} else if (id.includes('antd-mobile-icons')) {
          //  return 'antdmicons';
          //} else if (id.includes('antd-mobile')) {
          //  return 'antdm';
          //} else if (id.includes('@ant-design') || id.includes('antd')) {
          //  return 'antd';
          //} else if (id.includes('lodash')) {
          //  return 'lodash';
          //} else if (
          //  id.includes('rc-slider') ||
          //  id.includes('rc-select') ||
          //  id.includes('rc-picker') ||
          //  id.includes('rc-notification') ||
          //  id.includes('rc-util') ||
          //  id.includes('rc-image') ||
          //  id.includes('rc-input') ||
          //  id.includes('rc-textarea') ||
          //  id.includes('rc-dropdown') ||
          //  id.includes('rc-tooltip') ||
          //  id.includes('rc-tree-select') ||
          //  id.includes('rc-upload') ||
          //  id.includes('rc-field-form') ||
          //  id.includes('rc-cascader') ||
          //  id.includes('rc-dialog') ||
          //  id.includes('rc-drawer') ||
          //  id.includes('rc-pagination') ||
          //  id.includes('rc-tabs') ||
          //  id.includes('rc-tree') ||
          //  id.includes('rc-menu') ||
          //  id.includes('rc-rate') ||
          //  id.includes('rc-steps') ||
          //  id.includes('rc-mentions') ||
          //  id.includes('rc-collapse') ||
          //  id.includes('rc-motion') ||
          //  id.includes('rc-resize-observer') ||
          //  id.includes('rc-virtual-list') ||
          //  id.includes('rc-progress') ||
          //  id.includes('rc-overflow') ||
          //  id.includes('rc-checkbox') ||
          //  id.includes('rc-switch') ||
          //  id.includes('rc-segmented') ||
          //  id.includes('rc-table')
          //) {
          //  return 'rc';
          //} else if (id.includes('@rc-component')) {
          //  return 'rcc';
          //} else if (id.includes('ahooks')) {
          //  return 'ahooks';
          //} else if (id.includes('primereact')) {
          //  return 'prime';
          //} else if (id.includes('telegram-ui')) {
          //  return 'tgui';
          //} else if (id.includes('@telegram-apps')) {
          //  return 'tma';
          //} else if (id.includes('@tonconnect')) {
          //  return 'tconnect';
          //} else if (id.includes('@radix-ui')) {
          //  return 'radix';
          //} else if (id.includes('@floating-ui')) {
          //  return 'fui';
          //} else if (id.includes('@babel')) {
          //  return 'babel';
          //} else 
          //if (id.includes('react')) {
          //  return 'react';
          //} else if (id.includes('use-')) {
          //  return 'use';
          //} else if (id.includes('dayjs')) {
          //  return 'dayjs';
          //} else if (id.includes('@swc')) {
          //  return 'swc';
          //} else if (id.includes('@ctrl')) {
          //  return 'ctrl';
          //} else if (id.includes('stylis')) {
          //  return 'stylis';
          //} else if (id.includes('webrtc-adapter')) {
          //  return 'webrtc-adapter';
          //} else
          if (id.includes('node_modules')) {
            console.log('%cid: %o', 'color: cyan;', id);
            return 'vendor';
          }
        }
      }
      
    }
  }
});

