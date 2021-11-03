import './css/styles.css';
import API from '../src/js/fetchCountries';
import getRefs from '../src/js/get-refs';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const DEBOUNCE_DELAY = 300;

const refs = getRefs();

refs.searchBox.value = '';

refs.searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';

  const { value } = e.target;
  if (value.trim() === '') return;

  API.fetchCountries(value.trim()).then(coutriesFilter).catch(onFetchError);
}
function coutriesFilter(data) {
  if (data.length === 1) {
    renderCountryInfo(data);
    return;
  }

  if (data.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }

  if (data.length > 1 || data.length <= 10) {
    renderCountryList(data);
    return;
  }
}

function renderCountryList(country) {
  const markup = country
    .map(element => {
      return `
      <li class="list-item">
      <span>${element.flag}</span>
      <span> ${element.name.common}</span>
      </li>`;
    })
    .join('');
  refs.countryList.innerHTML = markup;
}

function renderCountryInfo(country) {
  const markup = country.map(element => {
    return `
      <h1><span>${element.flag}</span> ${element.name.common}</h1>
      <p><b>Capital:</b> ${element.capital[0]}</p>
      <p><b>Population:</b> ${element.population}</p>
      <p><b>Languages:</b> ${Object.values(element.languages)}</p>`;
  });
  refs.countryInfo.innerHTML = markup;
}

function onFetchError() {
  Notify.failure(`Oops, there is no country with that name`);
}
