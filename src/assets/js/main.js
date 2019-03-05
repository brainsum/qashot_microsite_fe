import validator from 'validator';
import Wallop from 'wallop';
import axios from 'axios';
import RModal from 'rmodal';

import PubSub from './pubsub';
import Config from '../../../config';

const pubsub = new PubSub();

document.getElementById('input-send').addEventListener('click', () => {
  var errorCount = 0;
  var inputs = [];

  const inputWebsite1 = document.getElementById('input-website-1');
  const inputWebsite2 = document.getElementById('input-website-2');
  const inputEmail = document.getElementById('input-email');
  const inputCheckboxPolicy = document.getElementById('input-checkbox-agree-policy');
  const inputCheckboxNews = document.getElementById('input-checkbox-agree-news');

  if (!validator.isURL(inputWebsite1.value, { require_protocol: true })) { inputs.push({ error: true, id: 'input-website-1', message: 'Not a valid URL' }); } else { inputs.push({ error: false, id: 'input-website-1' }); }
  if (!validator.isURL(inputWebsite2.value, { require_protocol: true })) { inputs.push({ error: true, id: 'input-website-2', message: 'Not a valid URL' }); } else { inputs.push({ error: false, id: 'input-website-2' }); }
  if (!validator.isEmail(inputEmail.value)) { inputs.push({ error: true, id: 'input-email', message: 'Not a valid E-mail' }); } else { inputs.push({ error: false, id: 'input-email' }); }
  if (!inputCheckboxPolicy.checked) { inputs.push({ error: true, id: 'input-checkbox-agree-policy', message: 'Must be checked' }); } else { inputs.push({ error: false, id: 'input-checkbox-agree-policy' }); }

  // Form loading subscriptions
  (() => {
    const form1 = document.getElementById('form1');
    const form2 = document.getElementById('form2');

    function showFormLoading() {
      form1.classList.add('loading');
    }

    pubsub.subscribe('showFormLoading', showFormLoading);

    function removeFormLoading() {
      form1.classList.remove('loading');
    }

    pubsub.subscribe('removeFormLoading', removeFormLoading);

    function showFormAfter() {
      form1.classList.remove('loading');
      form1.style = 'display: none;';
      form2.style = 'display: initial;';
    }

    pubsub.subscribe('showFormAfter', showFormAfter);
  })();

  inputs.forEach((input) => {
    if (input.error) {
      errorCount += 1;
      document.getElementById(input.id).style = 'border: 3px solid red';
      document.querySelector(`#${input.id} ~ .error`).textContent = input.message;
    } else {
      document.getElementById(input.id).style = 'border: none';
      document.querySelector(`#${input.id} ~ .error`).innerHTML = '';
    }
  });

  // There was no validation erro, so we send data.
  if (errorCount <= 0) {
    pubsub.publish('showFormLoading');

    axios.post(Config.serviceProtocol + Config.serviceDomain + Config.servicePath, {
      reference_url: inputWebsite1.value,
      test_url: inputWebsite2.value,
      newsletter: inputCheckboxNews.checked,
      privacy_policy: inputCheckboxPolicy.checked,
      email: inputEmail.value
    }).then((response) => {
      if (response.status >= 200 && response.status < 300) {
        document.getElementById('output-website-1').textContent = inputWebsite1.value;
        document.getElementById('output-website-2').textContent = inputWebsite2.value;
        document.getElementById('output-email').textContent = inputEmail.value;
        document.getElementById('output-email').href = `mailto:${inputEmail.value}`;

        pubsub.publish('showFormAfter');
      }
    }).catch(() => {
      pubsub.publish('removeFormLoading');
      document.getElementById('output-error').textContent = 'There was an error while processing your request!';
    });
  }
});

// We create an other request. Crearing previous data.
document.getElementById('input-again').addEventListener('click', () => {
  const inputs = ['input-website-1', 'input-website-2', 'input-email', 'input-checkbox-agree-policy', 'input-checkbox-agree-news'];

  inputs.forEach((input) => {
    const elem = document.getElementById(input);
    elem.style = 'border: none';
    elem.value = '';
    elem.checked = false;
    document.querySelector(`#${input} ~ .error`).innerHTML = '&nbsp;';
  });

  document.getElementById('form1').style = 'display: initial;';
  document.getElementById('form2').style = 'display: none;';
});


// Image slider (wallop)
(function imageSlider() {
  const tabs = document.getElementsByClassName('tab');

  function removeTabBorders() {
    Array.prototype.forEach.call(tabs, (tab) => {
      tab.classList.remove('active');
    });
  }

  const slider = new Wallop(document.querySelector('.Wallop'));

  const interval = setInterval(() => {
    slider.next();
  }, 2000);

  slider.on('change', (e) => {
    removeTabBorders();
    tabs[e.detail.currentItemIndex].classList.add('active');
  });

  Array.prototype.forEach.call(tabs, (tab) => {
    tab.addEventListener('click', (event) => {
      clearInterval(interval);
      slider.goTo(event.target.dataset.tabIndex);
    });
  });
}());


// Modal
(function rModal() {
  var modal = new RModal(
    document.getElementById('modal')
  );

  document.querySelectorAll('.agree-policy-modal').forEach((elem) => {
    elem.addEventListener('click', (e) => {
      e.preventDefault();
      modal.open();
    }, false);
  });

  document.getElementById('close-modal')
    .addEventListener('click', (e) => {
      e.preventDefault();
      modal.close();
    }, false);

  window.modal = modal;
}());
