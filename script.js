import fetchCountries from './fetchCountries.js';
const inputEl = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;
inputEl.addEventListener('input', _.debounce(onInput, DEBOUNCE_DELAY));
function onInput(e) {
  const query = e.target.value.trim();
  clearResults();
  if (!query) return;

  fetchCountries(query)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
      } else if (countries.length >= 2 && countries.length <= 10) {
        renderCountryList(countries);
      } else if (countries.length === 1) {
        renderCountryInfo(countries[0]);
      }
    })
    .catch(() => {
      Notiflix.Notify.failure('Oops, there is no country with that name.');
    });
}
function renderCountryList(countries) {
  const markup = countries
    .map(country => `
      <li>
        <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="30" />
        <span>${country.name.official}</span>
      </li>
    `)
    .join('');
  countryList.innerHTML = markup;
}
function renderCountryInfo(country) {
  const markup = `
    <div>
      <h2>
        <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="40" />
        ${country.name.official}
      </h2>
      <p><strong>Capital:</strong> ${country.capital}</p>
      <p><strong>Population:</strong> ${country.population}</p>
      <p><strong>Languages:</strong> ${Object.values(country.languages).join(', ')}</p>
    </div>
  `;
  countryInfo.innerHTML = markup;
}
function clearResults() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
