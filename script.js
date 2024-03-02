var confirmButton = document.getElementById("submit");
var toggleFiltering = document.getElementById("toggle-filtering");
var toggleSorting = document.getElementById("toggle-sorting");
var divFilter = document.getElementById("filter");
var divSort = document.getElementById("sort");
const ANIMAL_CONTAINER = document.getElementById("animal-data");
document.getElementById("loading").style.display = "none";
var option = {
    method: 'GET',
    headers: { "x-api-key": "2BGDCUp+y4KhZwPCwm4Bkw==u84FY4DYGbpX8Jv2" } // replace if naubos na number of tries (create a new account)
}
var animalInfo = "";
var currentPage = 1;
const resultsPerPage = 5;
var tempAnimal = "";
var animalSearchData;

let paginationContainer = document.getElementById("pagination-container");

// When the page loads, check if there's a "page" parameter in the URL and set the current page accordingly.
window.addEventListener("DOMContentLoaded", (event) => {
    const params = new URLSearchParams(location.search);
    const page = params.get("page");
    if (page) {
        currentPage = parseInt(page);
    }
});

/**
 * A function that creates or updates the pagination buttons according to the total number of data
 * fetched from the API. It also contains a click event listener to determine which page the user
 * wants to visit.
 * @param {*} data animal data provided by the API
 * @param {*} totalResults contains the total amount of search results that was fetched from the API.
 * author/s: Jay Ron Imbuido
 */
function updatePaginationButtons(data, totalResults) {
    paginationContainer.innerHTML = ""; // Clear existing buttons
    const totalPages = Math.ceil(totalResults / resultsPerPage);

    for (let page = 1; page <= totalPages; page++) {
        const button = document.createElement("button");
        button.id = page;
        button.textContent = page;
        button.addEventListener("click", () => {
            currentPage = page;
            updateURL(page); // Update the URL with the current page number  
            ANIMAL_CONTAINER.innerHTML = "";
            displayAnimals(data, page);
            //scroll to search results
            document.getElementById("search-results").scrollIntoView({ behavior: "smooth", block: "start" });
        });
        paginationContainer.appendChild(button);
    }

    const active = document.getElementById(currentPage);
    active.id = 'active';

}

/**
 * A function that updates the URL with the current page as a query parameter
 * @param {*} page the current page number 
 * author/s: Jay Ron Imbuido
 */
function updateURL(page) {
    const params = new URLSearchParams(location.search);
    params.set("page", page);
    const newURL = `${location.pathname}?${params.toString()}`;
    window.history.pushState({}, "", newURL);
}
updateURL("search");

/**
 * This function utilizes the fetch api in order to retrieve that data from the animal api we have selected
 * The function will then assign the animal data to a variable called animalSearchData since the variable will be utilized by
 * different functions. Once the data is fetch, initially show the first page of the animal data, the filtering system will also
 * be then populated.
 * author/s: Jan Ivan Ezra D. Paguyo
 */
function searchAnimal() {
    let animalSearch = document.getElementById("animal-input").value;
    if (animalSearch !== ""  && animalSearch.trim()!="") {
        toggleFiltering.style.display = "none";
        toggleSorting.style.display = "none";
        paginationContainer.style.display = "none";
        paginationContainer.style.display = "none";
        document.getElementById("search-results").style.display = "block";
        document.getElementById("search-results").textContent = "Processing...";
        document.getElementById("loading").style.display = "inline";
        divFilter.style.display = "none";
        divSort.style.display = "none";

        currentPage = 1;
        updateURL(currentPage);
        ANIMAL_CONTAINER.innerHTML = ""; // Clear the result container
        paginationContainer.innerHTML = "";
        animalInfo = ""
        var apiLink = "https://api.api-ninjas.com/v1/animals?name=" + animalSearch;

        fetch(apiLink, option)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network error");
                }
                return response.json();
            })
            .then(data => {
                if (data.length >= 1) {
                    document.getElementById("loading").style.display = "none";
                    animalSearchData = data;
                    displayAnimals(animalSearchData);
                    toggleFiltering.style.display = "inline";
                    divFilter.style.display = "none";
                    toggleFiltering.textContent = "Show Filtering Options ▼"
                    updateFilterData(animalSearchData); //updates filter options based on search results

                    toggleSorting.style.display = "inline";
                    divSort.style.display = "none";
                    toggleSorting.textContent = "Show Sorting Options ▼"
                    updateSortingData();
                    //scroll to search results
                    document.getElementById("search-results").scrollIntoView({ behavior: "smooth", block: "start" });
                    paginationContainer.style.display = "block";
                } else {
                    document.getElementById("loading").style.display = "none";
                    document.getElementById("search-results").textContent = "Nothing Found";
                    ANIMAL_CONTAINER.innerHTML = "";
                    animalInfo = "";
                    ANIMAL_CONTAINER.innerHTML = animalInfo;
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }
}

/**
 * A function that will take in animal data and adds it to the HTML element that will contain search results.
 * @param {} data animal data provided by the API.
 * author/s: Jan Ivan Ezra D. Paguyo
 */
function displayAnimals(data) {
    ANIMAL_CONTAINER.innerHTML = "";
    animalInfo = "";
    let start = (currentPage - 1) * resultsPerPage;
    let end = Math.min(start + resultsPerPage, data.length);
    for (let i = start; i < end; i++) {
        let animalName = data[i].name;
        animalInfo += `
            <div id="${animalName}" class="animal-section">
                <div class="content">
                    <p class="animal-name">Name: ${animalName}</p>
                    <p>Class: ${data[i].taxonomy.class}</p>
                    <p>Order: ${data[i].taxonomy.order}</p>
                    <p>Family: ${data[i].taxonomy.family}</p>
                    <p>Genus: ${data[i].taxonomy.genus}</p>
                    <p>Scientific Name: ${data[i].taxonomy.scientific_name}</p>
                    <p>Locations: ${data[i].locations.toString()}</p>
                </div>
                <div class="content" id="${animalName}-video">
                </div>
            </div>
        `;
        ANIMAL_CONTAINER.innerHTML = animalInfo;
        displayAnimalVideo(animalName);
    }

    //displays the number of search results
    document.getElementById("search-results").textContent = "SEARCH RESULTS (" + data.length + " Total):";
    updatePaginationButtons(data, data.length);
}

confirmButton.addEventListener("click", searchAnimal);
document.getElementById("animal-input").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        confirmButton.click();
    }
});

// The following lines of code displays the toggle menu of the Filerting Feature
// author/s: Carl Joshua Lalwet
toggleFiltering.addEventListener("click", function () {

    if (divFilter.style.display === "none" || divFilter.style.display === "") {
        divFilter.style.display = "block";
        toggleFiltering.textContent = "Hide Filtering Options ▲"

        let applyFilters = document.getElementById("apply-filters");

        //apply filtering
        applyFilters.addEventListener("click", function () {
            currentPage = 1;
            updateURL(currentPage);
            displayAnimals(implementFiltering(animalSearchData));
            //scroll to search results
            document.getElementById("search-results").scrollIntoView({ behavior: "smooth", block: "start" });

        });
    } else {
        divFilter.style.display = "none";
        toggleFiltering.textContent = "Show Filtering Options ▼"
    }
});

// The following lines of code displays the toggle menu of the Sorting Feature
// author/s: Carl Joshua Lalwet
toggleSorting.addEventListener("click", function () {

    if (divSort.style.display === "none" || divSort.style.display === "") {
        divSort.style.display = "block";
        toggleSorting.textContent = "Hide Sorting Options ▲"

        let applySorting = document.getElementById("apply-sort");

        //apply sorting
        applySorting.addEventListener("click", function () {
            currentPage = 1;
            updateURL(currentPage);
            displayAnimals(implementSorting(animalSearchData));
            document.getElementById("search-results").scrollIntoView({ behavior: "smooth", block: "start" });
        });
    } else {
        divSort.style.display = "none";
        toggleSorting.textContent = "Show Sorting Options ▼"
    }
});

/**
 * This function takes in animal data, applies filters based on what are checked in the options, then returns an array of animals that passed the filters.
 * @param {} data unfiltered array of animals
 * @returns Filtered array of animals
 * author/s: Carl Joshua Lalwet
 */
function implementFiltering(data) {
    let checkedClass = getCheckedFilters(document.getElementById("class"));
    let checkedOrder = getCheckedFilters(document.getElementById("order"));
    let checkedFamily = getCheckedFilters(document.getElementById("family"));
    let checkedGenus = getCheckedFilters(document.getElementById("genus"));
    let checkedLocations = getCheckedFilters(document.getElementById("locations"));

    //populates array with animal data that passed the filters
    let filteredData = [];
    for (let i = 0; i < data.length; i++) {
        if (checkedClass.includes(data[i].taxonomy.class)) {
            filteredData.push(data[i]);
        }
        if (checkedOrder.includes(data[i].taxonomy.order)) {
            filteredData.push(data[i]);
        }
        if (checkedFamily.includes(data[i].taxonomy.family)) {
            filteredData.push(data[i]);
        }
        if (checkedGenus.includes(data[i].taxonomy.genus)) {
            filteredData.push(data[i]);
        }
        for (let j = 0; j < data[i].locations.length; j++) {
            if (checkedLocations.includes(data[i].locations[j])) {
                filteredData.push(data[i]);
            }
        }
    }

    //if no filters are selected. Returns the unfiltered array.
    if (checkedClass.length == 0 && checkedOrder.length == 0 && checkedFamily.length == 0 && checkedGenus.length == 0 && checkedLocations.length == 0) {
        return data;
    } else {
        return filteredData = [...new Set(filteredData)];
    }
}

/**
 * A function that determines which checkboxes in the div are checked.
 * @param {*} div the div that contains the checkboxes
 * @returns array of checked checkboxes
 * author/s: Carl Joshua Lalwet
 */
function getCheckedFilters(div) {
    let labelElements = div.querySelectorAll("label");
    let checkedArray = [];
    labelElements.forEach(function (label) {
        if (label.firstChild.checked) {
            checkedArray.push(label.textContent.trim());
        }
    });
    return checkedArray;
}

/**
 * Iterates through the entirety of the search results, recording animal data and classifying them into their respective arrays, 
 * while preventing duplicate entries. Afterwards, this will update the search filters (class, order, family, genus, locations) 
 * based on the animal data provided by the search results. 
 * @param {*} data animal data provided by the API based on the search keywords.
 * author/s: Carl Joshua Lalwet
 */
function updateFilterData(data) {
    //arrays to store data for filtering
    let classArray = [];
    let orderArray = [];
    let familyArray = [];
    let genusArray = [];
    let locationsArray = [];

    //iterates through data and stores occurences into organized arrays. No duplicates are allowed.
    for (let i = 0; i < data.length; i++) {
        if (!classArray.includes(data[i].taxonomy.class)) {
            classArray.push(data[i].taxonomy.class);
        }
        if (!orderArray.includes(data[i].taxonomy.order)) {
            orderArray.push(data[i].taxonomy.order);
        }
        if (!familyArray.includes(data[i].taxonomy.family)) {
            familyArray.push(data[i].taxonomy.family);
        }
        if (!genusArray.includes(data[i].taxonomy.genus)) {
            genusArray.push(data[i].taxonomy.genus);
        }
        for (let j = 0; j < data[i].locations.length; j++) {
            if (!locationsArray.includes(data[i].locations[j])) {
                locationsArray.push(data[i].locations[j]);
            }
        }
    }

    //Creates new HTML elements which serve as filter options based on search results
    function createFilters(filterDiv, filterArray) {
        while (filterDiv.firstChild) { //clears prior elements stored in the filter
            filterDiv.removeChild(filterDiv.firstChild);
        }

        for (let u = 0; u < filterArray.length; u++) { //adds animal data as new filter options
            var newCheckbox = document.createElement("input");
            newCheckbox.type = "checkbox";
            var newLabel = document.createElement("label");
            newLabel.appendChild(newCheckbox);
            newLabel.appendChild(document.createTextNode(filterArray[u]));
            filterDiv.appendChild(newLabel);
        }
    }

    createFilters(document.getElementById("class"), classArray);
    createFilters(document.getElementById("order"), orderArray);
    createFilters(document.getElementById("family"), familyArray);
    createFilters(document.getElementById("genus"), genusArray);
    createFilters(document.getElementById("locations"), locationsArray);
}

/**
 * A function that sorts the animal data according to the user's chosen filters.
 * @param {*} data animal data provided by the API based on the search keywords.
 * @returns the sorted animal data
 * author/s: Maxwell John A. Arzadon
 */
function implementSorting(data) {
    let sortedData;
    let checkedSort = getCheckedFilters(document.getElementById("sort-by"));
    let checkedName = getCheckedFilters(document.getElementById("properties"));

    if (checkedSort.includes('A-Z') && checkedName.includes('Name')) {
        sortedData = data.sort(compareByNameAscending);
    }

    if (checkedSort.includes('Z-A') && checkedName.includes('Name')) {
        sortedData = data.sort(compareByNameDescending);
    }

    if (checkedSort.includes('A-Z') && checkedName.includes('Scientific Name')) {
        sortedData = data.sort(compareBySciNameAscending);
    }

    if (checkedSort.includes('Z-A') && checkedName.includes('Scientific Name')) {
        sortedData = data.sort(compareBySciNameDescending);
    }

    if (checkedSort.length != 1 || checkedName.length != 1) {
        alert("Cannot Sort with the chosen sorting filters");
        return data;
    } else {
        return sortedData;
    }
}

/**
 * A function that sorts the data using the animal's scientific name in Ascending order.
 * @param {*} a the first element to be compared
 * @param {*} b the second element to be compared
 * @returns the sorted animal data
 * author/s: Maxwell John A. Arzadon
 */
function compareBySciNameAscending(a, b){
    try {
        return a.taxonomy.scientific_name.localeCompare(b.taxonomy.scientific_name);
    } catch {
        return null;
    }
}

/**
 * A function that sorts the data using the animal's scientific name in Descending order.
 * @param {*} a the first element to be compared
 * @param {*} b the second element to be compared
 * @returns the sorted animal data
 * author/s: Maxwell John A. Arzadon
 */
function compareBySciNameDescending(a, b){
    try {
        return b.taxonomy.scientific_name.localeCompare(a.taxonomy.scientific_name);
    } catch {
        return null;
    }
}

/**
 * A function that sorts the data using the animal's name in Ascending order.
 * @param {*} a the first element to be compared
 * @param {*} b the second element to be compared
 * @returns the sorted animal data
 * author/s: Maxwell John A. Arzadon
 */
function compareByNameAscending(a, b) {
    return a.name.localeCompare(b.name);
}

/**
 * A function that sorts the data using the animal's name in Descending order.
 * @param {*} a the first element to be compared
 * @param {*} b the second element to be compared
 * @returns the sorted animal data
 * author/s: Maxwell John A. Arzadon
 */
function compareByNameDescending(a, b) {
    return b.name.localeCompare(a.name);
}

/**
 * A function that displays the available sorting choices for the user.
 * author/s: Carliah Beatriz Del Rosario
 */
function updateSortingData() {
    let sortingDiv = document.getElementById("sort-by");
    let propertiesDiv = document.getElementById("properties");

    while (sortingDiv.firstChild) { //clears prior elements stored in the sort
        sortingDiv.removeChild(sortingDiv.firstChild);
    }
    while (propertiesDiv.firstChild) { //clears prior elements stored in the sort
        propertiesDiv.removeChild(propertiesDiv.firstChild);
    }

    var sortDiv = document.getElementById("sort-by");
    var newCheckbox1 = document.createElement("input");
    newCheckbox1.type = "checkbox";
    var newLabel1 = document.createElement("label");
    newLabel1.appendChild(newCheckbox1);
    newLabel1.appendChild(document.createTextNode("A-Z"));
    sortDiv.appendChild(newLabel1);

    var newCheckbox2 = document.createElement("input");
    newCheckbox2.type = "checkbox";
    var newLabel2 = document.createElement("label");
    newLabel2.appendChild(newCheckbox2);
    newLabel2.appendChild(document.createTextNode("Z-A"));
    sortDiv.appendChild(newLabel2);

    var sortProp = document.getElementById("properties");
    var newCheckbox3 = document.createElement("input");
    newCheckbox3.type = "checkbox";
    var newLabel3 = document.createElement("label");
    newLabel3.appendChild(newCheckbox3);
    newLabel3.appendChild(document.createTextNode("Name"));
    sortProp.appendChild(newLabel3);

    var newCheckbox4 = document.createElement("input");
    newCheckbox4.type = "checkbox";
    var newLabel4 = document.createElement("label");
    newLabel4.appendChild(newCheckbox4);
    newLabel4.appendChild(document.createTextNode("Scientific Name"));
    sortProp.appendChild(newLabel4);
}

/**
 * This method will use the fetch api in order to retrieve data from the youtube api. After retrieving the data, an iframe will be created
 * and be appended as a child to the div for the main content
 * @param {*} animalName to be used for the searching of animal video
 * author/s: Jan Ivan Ezra D. Paguyo
 */
function displayAnimalVideo(animalName) {
    const API_KEY = "AIzaSyDEsd-G2p4WCTGJuxuF3VCnKVQCUl5X9m8"; //10,000 queries per day, pag error 403 meaning ubos na queries Other APA Key: AIzaSyD_NEBi1gWOOxFAelbarkLbYJ2KfcmRiqI , AIzaSyDEsd-G2p4WCTGJuxuF3VCnKVQCUl5X9m8 , AIzaSyCfeJFGrQI7xMu4SwPRw0SwXfyZ-CPnbdU

    var youtubeAPIURL = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&q=${animalName}%20animal%20informative%20video&type=video&maxResults=1`;

    fetch(youtubeAPIURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            var videoID = data.items[0].id.videoId;
            var videoLink = "https://www.youtube.com/embed/" + videoID;
            var iframe = document.createElement('iframe');
            iframe.width = "420";
            iframe.height = "305";
            iframe.loading = "lazy";
            iframe.src = videoLink;
            iframe.allowfullscreen = true;
            document.getElementById(animalName + "-video").appendChild(iframe);
        })
        .catch(error => {
            console.error(error);
        });
}