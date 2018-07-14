(function () {
  const bornDate = new Date(1998, 2, 23);
  const dateDiff = Date.now() - bornDate.getTime();

  translateAll(getLanguage()).then(language => {
    const selectLanguages = document.querySelector('#select-languages');
    let optionLanguages = availableLanguages.filter(lang => lang.value !== language);
    optionLanguages.push(availableLanguages.find(lang => lang.value === language));
    for (let i = optionLanguages.length - 1; i > -1 ; i--) {
      const opt = document.createElement('OPTION'); //optionLanguages[i]
      opt.value = optionLanguages[i].value;
      opt.textContent = optionLanguages[i].text;
      selectLanguages.appendChild(opt);
    }

    selectLanguages.addEventListener('change', evt => {
      translateAll(evt.target.value);
    });
  });

  document.querySelector('#span-years-old').textContent = (new Date(dateDiff)).getUTCFullYear() - 1970;
})()
