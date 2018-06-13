"use strict";
function main() {
    const LIST_CONTAINER = document.querySelector("#list-container");
    const SE_LIST = document.querySelector("ul#search-list");
    const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="16"><path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"/></svg>`;

    // kinda self-explanatory, right?
    function applySVG(svg, node) {
        node.innerHTML = svg;
    }

    const DB_URL_INPUT = document.querySelector("#dbUrlInput");
    const DB_URL_SEARCH = document.querySelector("#dbUrlSearch");
    const DB_URL_STATUS = document.querySelector("#database-url-status");
    let CURRENT_URL;
    applySVG(SVG, DB_URL_SEARCH);

    function getListFromJSON(URL) {
        fetch(URL)
            .then(response => {
                CURRENT_URL = response.url;
                console.log(`${response.url} is ${response.status} (${response.statusText})`)

                function prependStatusText(response) {
                    return `Status ${response.status}: ${response.statusText} <br>`
                }

                switch (response.status) {
                    case 200:
                    DB_URL_STATUS.innerHTML = `${prependStatusText(response)} JSON file from <i>${CURRENT_URL}</i> has been loaded.`;
                    break;
                    case 403:
                    DB_URL_STATUS.innerHTML = `${prependStatusText(response)} Forbidden access to the specified file.`
                    break;
                    case 404:
                    DB_URL_STATUS.innerHTML = `${prependStatusText(response)} File not found.`
                    break;
                }
                DB_URL_STATUS.style.visibility = "visible";
                return response;
            })
            .then(response => response.json())
            .then(json => {
                const SE_DATA_LIST = json;
                SE_DATA_LIST.sort(sortID);
                createList(SE_DATA_LIST);
                console.log(SE_DATA_LIST);
            })
            .catch(error => {
                return null;
            })
        }

    function retrieveJSON() {
        const urlRegex = /https?\:\/\/[\w|\W|\d]+[.][\w]+/gi;
        const urlString = DB_URL_INPUT.value.match(urlRegex) ? new URL(DB_URL_INPUT.value) : new URL(document.URL + DB_URL_INPUT.value);
        if (urlString.href === document.URL) getListFromJSON("./se-list.json");
        else if (urlString.href.split("/").pop().indexOf("se-list.json") === 0) {
            getListFromJSON(DB_URL_INPUT.value)
            DB_URL_INPUT.value = '';
        } else {
            DB_URL_STATUS.innerHTML = `JSON should be named as <code>se-list</code>.`
            DB_URL_STATUS.style.visibility = "visible";
        }
    }
   
    DB_URL_SEARCH.addEventListener("click", retrieveJSON);
    DB_URL_INPUT.addEventListener("keypress", (event) => {
        if (event.key === "Enter") retrieveJSON();
    });

    function sortID(current, next) {
        if (current.id > next.id) return 1
        else if (current.id < next.id) return -1
        else return 0;
    }

    function createList(querylist) {
        function updateList(listNode) {
            while (listNode.firstElementChild) {listNode.removeChild(listNode.firstElementChild)}
        }

        function openSearchPage(eventListener) {
            const TARGET_INPUT = document.querySelector(`input#${obj.id}`);

            if (!TARGET_INPUT.value) eventListener.preventDefault()
            else if (TARGET_INPUT.value.trim() !== TARGET_INPUT.value) eventListener.preventDefault()
            else {
                const FULLSEARCH_URL = `${obj.url}?${obj.param ? obj.param : "q"}=${TARGET_INPUT.value}`;

                window.open(FULLSEARCH_URL, "_blank");
                TARGET_INPUT.value = '';
            }
        }

        updateList(SE_LIST);
        
        querylist.forEach((obj, index) => {
            if (obj.hasOwnProperty("id") && obj.hasOwnProperty("url")) {
                const SE_LIST_ITEM = document.createElement("li");
                SE_LIST_ITEM.setAttribute("class", "search-engine");

                const SE_ITEM_GRID = document.createElement("div");
                SE_ITEM_GRID.setAttribute("class", "search-engine-item-grid");

                const SE_NAME = document.createElement("div");
                SE_NAME.setAttribute("class", "search-engine-name");
                
                const SE_NAME_HEADER = document.createElement("label");
                SE_NAME_HEADER.setAttribute("for", obj.id)
                SE_NAME_HEADER.textContent = obj.name ? obj.name : obj.id;

                const SE_INPUT_ITEM = document.createElement("div");
                SE_INPUT_ITEM.setAttribute("class", "search-engine-input-item");

                const SE_INPUT = document.createElement("input");
                SE_INPUT.setAttribute("class", "search-engine-input");
                SE_INPUT.setAttribute("id", obj.id);
                SE_INPUT.setAttribute("tabindex", 3);
                SE_INPUT.addEventListener("keypress", (event) => {
                    if (event.key === "Enter") {
                        const TARGET_INPUT = document.querySelector(`input#${obj.id}`);

                    if (!TARGET_INPUT.value) eventListener.preventDefault()
                    else if (TARGET_INPUT.value.trim() !== TARGET_INPUT.value) eventListener.preventDefault()
                    else {
                        const FULLSEARCH_URL = `${obj.url}?${obj.param ? obj.param : "q"}=${TARGET_INPUT.value}`;

                        window.open(FULLSEARCH_URL, "_blank");
                        TARGET_INPUT.value = '';
                        }
                    }
                })
                SE_INPUT.addEventListener("focus", () => DB_URL_STATUS.textContent = '');

                const SE_INPUT_BTN = document.createElement("button");
                SE_INPUT_BTN.setAttribute("type", "button");
                SE_INPUT_BTN.setAttribute("class", "search-engine-input-button");
                applySVG(SVG, SE_INPUT_BTN)
                SE_INPUT_BTN.addEventListener("click", (event) => {
                    const TARGET_INPUT = document.querySelector(`input#${obj.id}`);

                    if (!TARGET_INPUT.value) event.preventDefault()
                    else if (TARGET_INPUT.value.trim() !== TARGET_INPUT.value) event.preventDefault()
                    else {
                        const FULLSEARCH_URL = `${obj.url}?${obj.param ? obj.param : "q"}=${TARGET_INPUT.value}`;

                        window.open(FULLSEARCH_URL, "_blank");
                        TARGET_INPUT.value = '';
                    }
                });

                // placed here for easier view of hierarchy of things
                SE_INPUT_ITEM.appendChild(SE_INPUT);
                SE_INPUT_ITEM.appendChild(SE_INPUT_BTN);

                SE_NAME.appendChild(SE_NAME_HEADER);

                SE_ITEM_GRID.appendChild(SE_NAME);
                SE_ITEM_GRID.appendChild(SE_INPUT_ITEM);

                SE_LIST_ITEM.appendChild(SE_ITEM_GRID);

                SE_LIST.appendChild(SE_LIST_ITEM);
            } else if (obj.hasOwnProperty("id") && !obj.hasOwnProperty("url")) {console.log(`Object #${index + 1} with ID ${obj.id} does not have a URL field.`)}
            else if (!obj.hasOwnProperty("id") && obj.hasOwnProperty("url")) {console.log(`Object #${index + 1} with URL ${obj.url} does not have an ID field.`)}
            else {console.log(`Object #${index + 1} has none of the required data.`)}
        });

        LIST_CONTAINER.appendChild(SE_LIST);
    }
}

main();