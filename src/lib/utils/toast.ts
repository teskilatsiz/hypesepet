import { createElement } from 'react';
import toast from 'react-hot-toast';
import { toastConfig, toastStyles } from '../constants/toastStyles';

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      ...toastConfig,
      icon: toastStyles.success.icon && createElement(toastStyles.success.icon),
      style: toastStyles.success.style
    });
  },
  
  error: (message: string) => {
    toast.error(message, {
      ...toastConfig,
      icon: toastStyles.error.icon && createElement(toastStyles.error.icon),
      style: toastStyles.error.style
    });
  },
  
  info: (message: string) => {
    toast(message, {
      ...toastConfig,
      icon: toastStyles.info.icon && createElement(toastStyles.info.icon),
      style: toastStyles.info.style
    });
  },
};