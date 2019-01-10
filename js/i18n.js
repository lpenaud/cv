const translations = [];

const availableLanguages = [
  {
    value: 'en',
    text: 'English',
  },
  {
    value: 'fr',
    text: 'Français',
  },
];

const getLanguage = function () {
  const lang = (location.search && location.search.substring(1,5) === 'lang'
    ? location.search.substring(6)
    : navigator.language.split).substring(0, 2);
    console.log(lang);
    return lang
};

const getTranslation = function (language) {
  return new Promise((resolve, reject) => {
    if (availableLanguages.findIndex(lang => lang.value === language) === -1) language = 'en';
    const index = translations.findIndex(translation => translation.language === language);

    if (index === -1) {
      ajaxGetJSONPromise(`${location.origin}/i18n/${language}.json`)
        .then(translation => {
          for (let i = 0; i < translation.proExp.length; i++) {
            const { dates } = translation.proExp[i];
            const { start, end } = dates;

            translation.proExp[i].dates.start = (new Date(
              start.year, 
              start.month - 1, 
              start.day
            )).toLocaleDateString(language);
  
            translation.proExp[i].dates.end = (new Date(
              end.year,
              end.mouth - 1,
              end.day
            )).toLocaleDateString(language);
          }
          translations.push(translation);
          resolve(translation);
        })
        .catch((err) => {
          if (err.status === 404) {
            getTranslation('en').then(resolve)
          }
          reject(err);
        });
    } else {
      resolve(translations[index])
    }
  });
};

const translateAllDataText = function (language) {
  return new Promise(resolve => {
    const elements = document.querySelectorAll('[data-text]');
    getTranslation(language)
      .then(translation => {
        const { values } = translation;
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
          const attributes = element.attributes;
          for (let j = 0; j < attributes.length; j++) {
            const attr = attributes[j];
            if (attr && attr.name === 'data-text') element.textContent = values[attr.value];
          }
          
        }
        for (let i = elements.length - 1; i > -1; i--) {
          const element = elements[i]
          const attributes = element.attributes;
          for (let j = attributes.length; j > -1; j--) {
            const attr = attributes[j];
            if (attr && attr.name === 'data-text') element.textContent = values[attr.value];
          }
        }
        resolve();
      });
  })
};

const translateProExp = function translateProfessionalExperience (language) {
  return new Promise(resolve => {
    const ul = document.querySelector('#ul-professional-experience');
    removeAllChildren(ul);
    getTranslation(language)
      .then(translation => {
        const { proExp } = translation;
        for (let i = 0; i < proExp.length; i++) {
          ul.appendChild(createListGroupItemProExp(proExp[i])); 
        }
        resolve();
      });
  })
}

const translateLanguage = function (language) {
  return new Promise(resolve => {
    getStarsLanguage().then(({ regular, solid }) => {
      const div = document.querySelector('#div-parent-languages');
      removeAllChildren(div);
      getTranslation(language).then(translation => {
        const { languages } = translation;
        for (let i = 0; i < languages.skills.length; i++) {
          div.appendChild(createDivLanguage(
            languages.levels,
            languages.skills[i],
            { regular, solid }
          ));
        }
        resolve();
      });
    })
  });
}

const getStarsLanguage = function () {
  return new Promise((resolve, reject) => {
    const images = { regular: '', solid: '' };
    try {
      images.regular = document.querySelector('i.fa.star-regular').innerHTML;
      images.solid = document.querySelector('i.fa.star-solid').innerHTML;
      resolve(images);
    } catch (err) {
      if (err.name === 'TypeError') {
        Promise.all([
          ajaxGetPromise('images/fontawesome/star-regular.svg'),
          ajaxGetPromise('images/fontawesome/star-solid.svg')
        ]).then((data) => {
          images.regular = data[0];
          images.solid = data[1];
          resolve(images);
        }).catch(reject);
      } else reject(err);
    }
  });
}

const translateEducation = function (language) {
  return new Promise(resolve => {
    const ul = document.querySelector('#ul-education');
    removeAllChildren(ul);
    getTranslation(language)
      .then(translation => {
        const { education } = translation;
        for (let i = 0; i < education.length; i++) {
          ul.appendChild(createLiEducation(education[i]));
        }
        resolve();
      });
  });
}

const translateInterest = function (language) {
  return new Promise(resolve => {
    const ul = document.querySelector('#ul-interest');
    removeAllChildren(ul);
    getTranslation(language)
      .then(translation => {
        const { interest } = translation;
        for (let i = 0; i < interest.length; i++) {
          ul.appendChild(createLiInterest(interest[i]));
        }
      });
  });
}

const translateVarious = function (language) {
  return new Promise(resolve => {
    const div = document.querySelector('#div-sub-various');
    removeAllChildren(div);
    getTranslation(language)
      .then(translation => {
        const { various } = translation;
        for (let i = 0; i < various.length; i++) {
          const p = document.createElement('P');
          p.innerHTML = various[i];
          div.appendChild(p);
        }
        resolve();
      });
  })
}

const translateIntership = function (language) {
  const target = document.querySelector('#internship > h2');
  getTranslation(language)
    .then(translation => {
      const { intership } = translation;
      let { start, end } = intership;
      const sentence = intership.find.split('{}');
      if (start !== null || intership.end !== null) {
        const options = {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        };
        start = new Date(start.year, start.month - 1, start.day);
        end = new Date(end.year, end.month - 1, end.day);
        target.textContent = sentence[0] 
          + start.toLocaleDateString(language, options)
          + sentence[1]
          + end.toLocaleDateString(language, options);
        target.parentElement.classList.remove('d-none');
        document.querySelector('.container-fluid').classList.add('container-internship');
      }
    })
}

const translateAll = function (language) {
  return new Promise((resolve) => {
    const colCenterDivs = document.querySelectorAll('#div-col-center > div')
    const footer = document.querySelector('footer');
    footer.style.display = 'none';
    for (let i = 0; i < colCenterDivs.length; i++) {
      const div = colCenterDivs[i];
      div.style.display = div.id === 'div-spiner'
        ? 'inherit'
        : 'none';
    }
    translateAllDataText(language).then(() => {
      translateProExp(language);
      translateLanguage(language);
      translateEducation(language);
      translateInterest(language);
      translateVarious(language);
      translateIntership(language);
      for (let i = 0; i < colCenterDivs.length; i++) {
        const div = colCenterDivs[i];
        div.style.display = div.id === 'div-spiner'
          ? 'none'
          : 'inherit';
      }
      footer.style.display = 'inherit';
      resolve(language);
    })
  });
}
