window.CookieConsent.init({
  categories: {
    analytics: {
      needed: false,
      wanted: false,
      checked: false,
      language: {
        locale: {
          en: {
            name: 'Analytics Cookies',
            description: 'To continuously improve our services we use exernal analytics solutions. We always use the maximum level of anonymization allowed on the 3rd party services.',
          }
        }
      }
    }
  },
  services: {
    gtm: {
      category: 'analytics',
      type: 'dynamic-script',
      search: 'googletagmanager',
      language: {
        locale: {
          en: {
            name: 'Google Tag Manager'
          }
        }
      }
    }
  }
});
