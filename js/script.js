'use strict';

const globalState = {
    allDevs      : [],
    filteredDevs : [],
    currentFilter: "",
};

const globalDivDevs    = document.querySelector("#divDevs");
const globalInputName  = document.querySelector("#inputName");

// const globalCheckboxes = document.querySelector("#checkboxes");
// const globalRadioAnd   = document.querySelector("#radioAnd");
// const globalRadioOr    = document.querySelector("#radioOr");

window.addEventListener('load', () => {

    async function start() {
        globalInputName.addEventListener("input", handleInputChange);
        await fetchAll();
        filterDevs();
    }

    function handleInputChange({ target }) {
        globalState.currentFilter = target.value.toLocaleLowerCase().trim();
        filterDevs();
    }

    async function fetchAll() {
        const url      = "http://localhost:3001/devs";
        const resource = await fetch(url);
        const json     = await resource.json();
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
        globalState.allDevs = [...jsonWithImprovedSearch];
        globalState.filteredDevs = [...jsonWithImprovedSearch];
    }

    function filterDevs() {
        const { allDevs, currentFilter } = globalState;
        let filteredDevs = allDevs;
        if (currentFilter) {
            filteredDevs = allDevs.filter(({ searchName }) =>
                searchName.includes(currentFilter)
            );
        }
        globalState.filteredDevs = filteredDevs;
        renderDevs();
    }

    function renderDevs() {
        const { filteredDevs } = globalState;
        const devsToShow = filteredDevs.map((dev) => {
            return renderDev(dev);
        }).join("");
        const renderedHTML = `
            <div class="row">
                <div class="col-xs-12">
                    <h2>${filteredDevs.length} (s) encontrado(s)</h2>
                </div>
                ${devsToShow}
            </div>    
        `;
        globalDivDevs.innerHTML = renderedHTML;
    }

    function renderDev(dev) {
        const { name, picture, programmingLanguages } = dev;
        return `
            <div class='col-xs-3 dev-card'>
                <img class='profile' src="${picture}" alt="${name}" />
                <div class='data'>
                    <span>${name}</span>
                    <span class='programmingLanguages'>
                        ${renderProgrammingLanguages(programmingLanguages)}
                    </span>
                </div>
            </div>
        `;
    }

    function renderProgrammingLanguages(languages) {
        return languages.map((language) => {
            return language.language;
        }).join(", ");
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
            }).join("");
        return newText;
    }

    function getOnlyLanguagesFrom(languages) {
        return languages.map((language) => language.language.toLocaleLowerCase()).sort();
    }

    start();

});