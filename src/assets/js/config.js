import merge from 'lodash/merge';

const config = {};

config.values = {
  api: {
    hosts: {
      base: {
        prod: {
          protocol: 'http://',
          domain: 'product-backend.qashot.com',
          path: ''
        }
      }
    }
  }
};

/**
 *
 * Set global config object
 *
*/
config.set = function configSet() {
  const globalValues = (typeof window.QAConfig === 'undefined') ? {} : window.QAConfig;
  const localValues = this.values;

  window.QAConfig = merge(localValues, globalValues);
};


export default config;
