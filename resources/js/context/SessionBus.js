let showMessage = null;

export const registerSessionHandler = (fn) => {
  showMessage = fn;
};

export const triggerSessionMessage = (type, text) => {
  if (showMessage) showMessage(type, text);
};
