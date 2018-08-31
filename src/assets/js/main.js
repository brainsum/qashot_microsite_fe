import validator from 'validator';
import { getSlider } from 'simple-slider';


document.getElementById('input-send').addEventListener('click', () => {
  var errorCount = 0;
  var inputs = [];

  const inputWebsite1 = document.getElementById('input-website-1');
  const inputWebsite2 = document.getElementById('input-website-2');
  const inputEmail = document.getElementById('input-email');
  const inputCheckbox = document.getElementById('input-checkbox-agree');

  if (!validator.isURL(inputWebsite1.value)) { inputs.push({ error: true, id: 'input-website-1', message: 'Not a valid URL' }); } else { inputs.push({ error: false, id: 'input-website-1' }); }
  if (!validator.isURL(inputWebsite2.value)) { inputs.push({ error: true, id: 'input-website-2', message: 'Not a valid URL' }); } else { inputs.push({ error: false, id: 'input-website-2' }); }
  if (!validator.isEmail(inputEmail.value)) { inputs.push({ error: true, id: 'input-email', message: 'Not a valid E-mail' }); } else { inputs.push({ error: false, id: 'input-email' }); }
  if (!inputCheckbox.checked) { inputs.push({ error: true, id: 'input-checkbox-agree', message: 'Must be checked' }); } else { inputs.push({ error: false, id: 'input-checkbox-agree' }); }

  inputs.forEach((input) => {
    if (input.error) {
      errorCount += 1;
      document.getElementById(input.id).style = 'border: 3px solid red';
      document.querySelector(`#${input.id} ~ .error`).textContent = input.message;
    } else {
      document.getElementById(input.id).style = 'border: none';
      document.querySelector(`#${input.id} ~ .error`).innerHTML = '&nbsp;';
    }
  });

  if (errorCount <= 0) {
    document.getElementById('form1').style = 'display: none;';
    document.getElementById('form2').style = 'display: initial;';
  }
});

document.getElementById('input-again').addEventListener('click', () => {
  const inputs = ['input-website-1', 'input-website-2', 'input-email', 'input-checkbox-agree'];

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


// Image Slider

(function imgeSlider() {
  const tabs = document.getElementsByClassName('tab');

  function removeTabBorders() {
    Array.prototype.forEach.call(tabs, (tab) => {
      tab.classList.remove('active');
    });
  }

  const imgSlider = getSlider({
    container: document.getElementById('slides-slider'),
    prop: 'right',
    duration: 0.4,
    onChange: (prevIndex, nextIndex) => {
      removeTabBorders();
      tabs[nextIndex].classList.add('active');
    }
  });

  Array.prototype.forEach.call(tabs, (tab) => {
    tab.addEventListener('click', (event) => {
      console.log(event.target.dataset.tabIndex);
      imgSlider.pause();
      imgSlider.change(event.target.dataset.tabIndex);
    });
  });
}());
