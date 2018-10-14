(function () {
  const bornDate = new Date(1998, 2, 23);
  const dateDiff = new Date(Date.now() - bornDate.getTime());

  getIcons()
  translateAll(getLanguage()).then(language => {
    const selectLanguages = document.querySelector('#select-languages');
    const optionLanguages = availableLanguages.filter(lang => lang.value !== language);
    optionLanguages.push(availableLanguages.find(lang => lang.value === language));
    for (let i = optionLanguages.length - 1; i > -1 ; i--) {
      const opt = document.createElement('OPTION');
      opt.value = optionLanguages[i].value;
      opt.textContent = optionLanguages[i].text;
      selectLanguages.appendChild(opt);
    }

    selectLanguages.addEventListener('change', evt => {
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      translateAll(evt.target.value).then(() => {
        window.scroll(scrollX, scrollY);
      });
    });
  }).catch((err) => {
    console.error(err);
  });

  document.querySelector('#span-years-old').textContent = dateDiff.getUTCFullYear() - 1970;
})()
