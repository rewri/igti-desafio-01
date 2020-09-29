'use strict';

const globalDivDevs = document.querySelector("#divDevs");

window.addEventListener('load', () => {

    async function start() {
        await fetchAll();
    }

    async function fetchAll() {
        const url = "http://localhost:3001/devs";
        const resource = await fetch(url);
        const json = await resource.json();

        return json;
    }

    function renderDevs() {
        const renderedHTML = `
            <div class="col-xs-12">
                <h2>dev(s) encontrado(s)</h2>
            </div>       
            <div class="col-xs-12">
                render
            </div>
        `;
        globalDivDevs.innerHTML = renderedHTML;
    }

    renderDevs();


});