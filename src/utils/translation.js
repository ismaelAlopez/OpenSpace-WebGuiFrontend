export const getTranslation = (language, key) => {
  const translation = {
    en: {
      Scene: 'Scene',
      Settings: 'Settings',
      About: 'About OpenSpace',
      Tutorial: 'Open Web Tutorials',
      Hide: 'Hide',
      Show: 'Show',
      keybindings: 'keybindings',
      Feedback: 'Send Feedback',
      started: 'Open Getting Started Tour',
      open: 'Open GUI in browser',
      GUIDevMode: 'GUI running in dev mode',
      console: 'Toggle console',
      native: 'Toggle native GUI',
      quit: 'Quit OpenSpace',
      Language: 'Language: ',
      English: 'English',
      Spanish: 'Spanish'
    },
    es: {
      Scene: 'Escena',
      Settings: 'Configuración',
      About: 'Acerca de OpenSpace',
      Tutorial: 'Tutoriales en la web',
      Hide: 'Ocultar',
      Show: 'Mostrar',
      keybindings: 'teclas de acceso rápido',
      Feedback: 'Enviar comentarios',
      started: 'Abrir recorrido de inicio',
      open: 'Abrir GUI en el navegador',
      GUIDevMode: 'GUI en modo de desarrollo',
      console: 'Mostrar/ocultar consola',
      native: 'Mostrar/ocultar GUI nativa',
      quit: 'Cerrar OpenSpace',
      Language: 'Idioma: ',
      English: 'Inglés',
      Spanish: 'Español'
    }
  };
  return translation[language][key];
};
