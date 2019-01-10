const capitalize = function (str) {
  const strings = str.split(' ');
  let toReturn = '';
  for (let i = 0; i < strings.length; i++) {
    toReturn += strings[i].charAt(0).toUpperCase();
    toReturn += strings[i].substring(1);
    toReturn += ' ';
  }
  return toReturn.trim();
}

const setClassList = function (element, classList) {
  for (let i = 0; i < classList.length; i++) {
    element.classList.add(classList[i]); 
  }
}

const createListGroupItemProExp = function ({
  title,
  dates,
  description,
}) {
  const li = document.createElement('LI');
  const div = document.createElement('DIV');
  const h5Title = document.createElement('H5');
  const h5Date = document.createElement('H5');
  const smallDate = document.createElement('SMALL');
  const p = document.createElement('P');
  
  setClassList(li, [
    'list-group-item',
    'flex-column',
    'align-items-start'
  ]);
  li.appendChild(div);
  li.appendChild(p)

  setClassList(div, [
    'd-flex',
    'w-100',
    'justify-content-between'
  ]);
  div.appendChild(h5Title);
  div.appendChild(h5Date);

  setClassList(h5Title, ['mb-1']);
  h5Title.textContent = title;

  h5Date.appendChild(smallDate);

  smallDate.textContent = dates.start + ' - ' + dates.end;

  p.innerHTML = description;
  setClassList(p, ['mb-1']);

  return li;
}

const createDivLanguage = function (levels, skill, icon = { solid: '', regular: '' }) {
  const div = document.createElement('DIV');
  const img = document.createElement('IMG');
  const span = document.createElement('SPAN');

  setClassList(div, ['div-languages']);
  div.appendChild(img);
  div.appendChild(span);

  img.src = skill.image;
  img.alt = skill.language;
  img.title = skill.language;

  for (let i = 0; i < levels.length; i++) {
    const italic = document.createElement('I');
    italic.classList.add('fa');
    if (i === skill.level) span.title = capitalize(levels[i]);
    if (i > skill.level) {
      italic.innerHTML = icon.regular;
      italic.classList.add('star-regular');
    } else {
      italic.innerHTML = icon.solid;
      italic.classList.add('star-solid')
    }
    span.appendChild(italic);
  }

  return div;
}

const createLiEducation = function ({
  title,
  dates,
  description,
  certificate
}) {
  const li = document.createElement('LI');
  const div = document.createElement('DIV');
  const h5Title = document.createElement('H5');
  const h5Date = document.createElement('H5');
  const smallDate = document.createElement('SMALL');
  const p = document.createElement('p');

  setClassList(li, [
    'list-group-item',
    'flex-column',
    'align-items-start'
  ]);
  li.appendChild(div);
  li.appendChild(p)

  setClassList(div, [
    'd-flex',
    'w-100',
    'justify-content-between'
  ]);
  div.appendChild(h5Title);
  div.appendChild(h5Date);

  setClassList(h5Title, ['mb-1']);
  if (certificate === null) {
    h5Title.textContent = title;
  } else {
    const anchor = document.createElement('A');
    anchor.textContent = title;
    anchor.target = '_blank';
    anchor.href = certificate;
    h5Title.appendChild(anchor);
  }

  h5Date.appendChild(smallDate);
  smallDate.textContent = dates.start + ' - ' + dates.end;

  p.innerHTML = description;

  return li;
}

const createLiInterest = function ({
  title,
  list
}) {
  const li = document.createElement('LI');
  const div = document.createElement('DIV');
  const h5 = document.createElement('H5');
  const ul = document.createElement('UL');
  
  setClassList(li, [
    'list-group-item',
    'flex-column',
    'align-items-start'
  ]);
  li.appendChild(div);
  li.appendChild(ul);

  setClassList(div, [
    'd-flex',
    'w-100',
    'justify-content-between'
  ]);
  div.appendChild(h5);

  setClassList(h5, ['mb-1']);
  h5.textContent = title;

  setClassList(ul, ['mb-1']);
  for (let i = 0; i < list.length; i++) {
    const subLi = document.createElement('LI');
    subLi.innerHTML = list[i];
    ul.appendChild(subLi);
  }

  return li;
}

const removeAllChildren = function (DOMElement) {
  while (DOMElement.hasChildNodes()) {
    DOMElement.removeChild(DOMElement.firstChild);
  }
}

const getIcons = function (paths) {
  const types = Object.keys(paths);
  let nodes = [];
  let urls = [];

  for (let i = 0; i < types.length; i++) {
    nodes = nodes.concat(...document.querySelectorAll(`i.${types[i]}`));
  }

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (urls.indexOf(node) === -1) {
      urls.push(`${paths[node.classList.item(0)] + node.classList.item(1)}.svg`)
    }
  }

  Promise.all(urls.map(url => ajaxGetPromise(url))).then((icons) => {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const index = urls.indexOf(`${paths[node.classList.item(0)] + node.classList.item(1)}.svg`);
      node.innerHTML = icons[index];
    }
  })
}
