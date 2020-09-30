'use strict';

const globalState = {
    allCountries: [],
    filteredCountries: [],
    loadingData: true,
    currentFilter: "",

    radioAnd: false,
    radioOr: true,

    checkboxes: [
        {
            filter: "java",
            description: "Java",
            checked: true
        },
        {
            filter: "javascript",
            description: "Javascript",
            checked: true
        },
        {
            filter: "python",
            description: "Python",
            checked: true
        }
    ]
};

const globalDivCountries = document.querySelector("#divDevs");
const globalInputName = document.querySelector("#inputName");
const globalDivCheckboxes = document.querySelector("#checkboxes");
const globalRadioAnd = document.querySelector("#radioAnd");
const globalRadioOr = document.querySelector("#radioOr");

async function start() {
    globalInputName.addEventListener("input", handleInputChange);
    globalRadioAnd.addEventListener("input", handleRadioClick);
    globalRadioOr.addEventListener("input", handleRadioClick);
    renderCheckboxes();
    await fetchAll();
    filterCountries();
}

function renderCheckboxes() {
    const { checkboxes } = globalState;
    const inputCheckboxes = checkboxes.map((checkbox) => {
        const { filter: id, description, checked } = checkbox;
        return (
            `<label class="option">
                <input id="${id}" type="checkbox" checked="${checked}" />
                <span>${description}</span>
            </label>`
        );
    });
    globalDivCheckboxes.innerHTML = inputCheckboxes.join("");
    checkboxes.forEach((checkbox) => {
        const { filter: id } = checkbox;
        const element = document.querySelector(`#${id}`);
        element.addEventListener("input", handleCheckboxClick);
    });
}

async function fetchAll() {
    const url = "http://localhost:3001/devs";
    const resource = await fetch(url);
    const json = await resource.json();
    const jsonWithImprovedSearch = json.map((item) => {
        const { name, programmingLanguages } = item;
        const lowerCaseName = name.toLocaleLowerCase();
        return {
            ...item,
            searchName: removeAccentMarksFrom(lowerCaseName)
                .split("")
                .filter((char) => char !== " ")
                .join(""),
            searchLanguages: getOnlyLanguagesFrom(programmingLanguages)
        };
    });
    globalState.allCountries = [...jsonWithImprovedSearch];
    globalState.filteredCountries = [...jsonWithImprovedSearch];
    globalState.loadingData = false;
}

function handleInputChange({ target }) {
    globalState.currentFilter = target.value.toLocaleLowerCase().trim();
    filterCountries();
}

function handleCheckboxClick({ target }) {
    const { id, checked } = target;
    const { checkboxes } = globalState;
    const checkboxToChange = checkboxes.find(
        (checkbox) => checkbox.filter === id
    );
    checkboxToChange.checked = checked;
    filterCountries();
}

function handleRadioClick({ target }) {
    const radioId = target.id;
    globalState.radioAnd = radioId === "radioAnd";
    globalState.radioOr = radioId === "radioOr";
    filterCountries();
}

function getOnlyLanguagesFrom(languages) {
    return languages.map((language) => language.language.toLocaleLowerCase()).sort();
}

function removeAccentMarksFrom(text) {
    const WITH_ACCENT_MARKS = "áãâäàéèêëíìîïóôõöòúùûüñ".split("");
    const WITHOUT_ACCENT_MARKS = "aaaaaeeeeiiiiooooouuuun".split("");
    const newText = text
        .toLocaleLowerCase()
        .split("")
        .map((char) => {
            const index = WITH_ACCENT_MARKS.indexOf(char);
            if (index > -1) {
                return WITHOUT_ACCENT_MARKS[index];
            }
            return char;
        })
        .join("");

    return newText;
}

function filterCountries() {
    const { allCountries, radioOr, currentFilter, checkboxes } = globalState;
    const filterCountries = checkboxes
        .filter(({ checked }) => checked)
        .map(({ filter }) => filter)
        .sort();

    let filteredCountries = allCountries.filter(({ searchLanguages }) => {
        return radioOr
            ? filterCountries.some((item) => searchLanguages.includes(item))
            : filterCountries.join("") === searchLanguages.join("");
    });

    if (currentFilter) {
        filteredCountries = filteredCountries.filter(({ searchName }) =>
            searchName.includes(currentFilter)
        );
    }
    globalState.filteredCountries = filteredCountries;
    renderCountries();
}

function renderCountries() {
    const { filteredCountries } = globalState;
    const countriesToShow = filteredCountries
        .map((country) => {
            return renderCountry(country);
        })
        .join("");

    const renderedHTML = `
        <div class="row">
            <div class="col-xs-12">
                <h2>${filteredCountries.length} (s) encontrado(s)</h2>
            </div>
            ${countriesToShow}
        </div> 
    `;
    globalDivCountries.innerHTML = renderedHTML;
}

function renderCountry(country) {
    const { name, picture, programmingLanguages } = country;

    return `
    <div class='col-xs-3 dev-card'>
        <img class='profile' src="${picture}" alt="${name}" />
        <div class='data'>
          <span>${name}</span>
          <span class='language'>
            <strong>${renderLanguages(programmingLanguages)}</strong>
          </span>
        </div>
    </div>
  `;
}

function renderLanguages(languages) {
    const { checkboxes } = globalState;
    return languages
        .map((language) => {
            return checkboxes.find((item) => item.filter === language.language.toLocaleLowerCase()).description;
        })
        .join(", ");
}

start();
