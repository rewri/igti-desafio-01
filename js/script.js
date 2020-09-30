'use strict';

const globalState = {
    allDevs: [],
    filteredDevs: [],
    currentFilter: "",
};

const globalDivDevs    = document.querySelector("#divDevs");
const globalInputName  = document.querySelector("#inputSearch");
const globalCheckboxes = document.querySelector("#checkboxes");
const globalRadioAnd   = document.querySelector("#radioAnd");
const globalRadioOr    = document.querySelector("#radioOr");

window.addEventListener('load', () => {

    async function start() {
        globalInputName.addEventListener("input", handleInputChange);
        await fetchAll();
        filterDevs();
    }

    async function fetchAll() {
        const url = "http://localhost:3001/devs";
        const resource = await fetch(url);
        const json = await resource.json();

        globalState.allDevs = [...json];
        globalState.filteredDevs = [...json];
    }

    function handleInputChange({ target }) {
        globalState.currentFilter = target.value.toLocaleLowerCase().trim();
        filterDevs();
    }

    function filterDevs() {
        // const { allDevs, radioOr, currentFilter, checkboxes } = globalState;
        // let filteredDevs = [];
        // if (currentFilter) {
        //     filteredDevs = filteredDevs.filter(({ searchName }) =>
        //         searchName.includes(currentFilter)
        //     );
        // }
        // globalState.filteredDevs = filteredDevs;
        renderDevs();
    }

    function renderDevs() {

        const { filteredDevs } = globalState;

        const devsToShow = filteredDevs
            .map((dev) => {
                return renderDev(dev);
            })
            .join("");

        const renderedHTML = `
            <div class="col-xs-12">
                <h2>${filteredDevs.length} (s) encontrado(s)</h2>
            </div>       
            <div>
                ${devsToShow}
            </div>
        `;
        globalDivDevs.innerHTML = renderedHTML;
    }

    function renderDev(dev) {
        const { id, name, picture, programmingLanguages } = dev;

        return `
            <div class='col-xs-3 dev-card'>
                <img class='profile' src="${picture}" alt="${name}" />
                <div class='data'>
                    <span>${name}</span>
                    <span class='programmingLanguages'>
                        
                    </span>
                </div>
            </div>
        `;
    }

    function renderProgrammingLanguages(languages) {
        const { checkboxes } = globalState;
        return languages
            .map((language) => {
                return checkboxes.find((item) => item.filter === language).language;
            })
            .join(", ");
    }

    start();

});