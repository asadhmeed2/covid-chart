

let myChart = null;
let region = "";
const DAY_MS = 86400000;//the day is 86400000 melesecond
/**
 * @param {}
 * @return
 * the function fetch the data from the API and filter the needed data and save it in the localStorage via region 
 */
async function getData() {
    let date = new Date();
    document.querySelector('.spinner').style.display = "block";
    let data1 = {};
    let data2 = {};
    let dataObjects = {};

    if (date.getTime() > JSON.parse(localStorage.getItem('date')) + DAY_MS || !(localStorage.getItem('asia') && localStorage.getItem('europe') && localStorage.getItem('africa') && localStorage.getItem('oceania') && localStorage.getItem('americas') && localStorage.getItem('world'))) {
        try {
            localStorage.clear();
            localStorage.setItem('date', JSON.stringify(date.getTime()))
            data1 = await (await fetch('https://corona-api.com/countries')).json();
            data2 = await (await fetch('https://api.allorigins.win/raw?url=https://restcountries.herokuapp.com/api/v1')).json();
            let namesAndRegionsData = {};

            Array.from(data2).map(el => {
                namesAndRegionsData[el.cca2] = {
                    name: el.name.common,
                    region: el.region
                }
            })
            Array.from(data1.data).map(el => {
                namesAndRegionsData[el.code]['confirmed'] = el.latest_data.confirmed
                namesAndRegionsData[el.code]['critical'] = el.latest_data.critical
                namesAndRegionsData[el.code]['deaths'] = el.latest_data.deaths
                namesAndRegionsData[el.code]['recovered'] = el.latest_data.recovered
                namesAndRegionsData[el.code]['population'] = el.population
                namesAndRegionsData[el.code]['confirmed'] = el.latest_data.confirmed
                namesAndRegionsData[el.code]['today'] = {
                    deaths: el.today.deaths,
                    confirmed: el.today.confirmed
                }
            })
            dataObjects = Object.values(namesAndRegionsData)
            dataObjects = dataObjects.filter(el => el.region.length > 0);
            let asia = dataObjects.filter(el => el.region === "Asia");
            let europe = dataObjects.filter(el => el.region === "Europe");
            let africa = dataObjects.filter(el => el.region === "Africa");
            let oceania = dataObjects.filter(el => el.region === "Oceania");
            let americas = dataObjects.filter(el => el.region === "Americas");
            localStorage.setItem("world", JSON.stringify(dataObjects))
            localStorage.setItem("asia", JSON.stringify(asia))
            localStorage.setItem("europe", JSON.stringify(europe))
            localStorage.setItem("africa", JSON.stringify(africa))
            localStorage.setItem("oceania", JSON.stringify(oceania))
            localStorage.setItem("americas", JSON.stringify(americas))


        } catch (error) {
            console.log(error);
        }

    }



    document.querySelector('.spinner').style.display = "none";
    addEventListnerToButtons();

}
getData()

function addEventListnerToButtons() {
    document.querySelector('#asia-btn').addEventListener('click', () => updateChart("asia"), false);
    document.querySelector('#europe-btn').addEventListener('click', () => updateChart("europe"), false);
    document.querySelector('#americas-btn').addEventListener('click', () => updateChart("americas"), false);
    document.querySelector('#africa-btn').addEventListener('click', () => updateChart("africa"), false);
    document.querySelector('#oceania-btn').addEventListener('click', () => updateChart("oceania"), false);
    document.querySelector('#world-btn').addEventListener('click', () => updateChart("world"), false);
    document.querySelector('#confirmed-btn').addEventListener('click', () => updateChart(region, 'confirmed'))
    document.querySelector('#recovered-btn').addEventListener('click', () => updateChart(region, 'recovered'))
    document.querySelector('#critical-btn').addEventListener('click', () => updateChart(region, 'critical'))
    document.querySelector('#deaths-btn').addEventListener('click', () => updateChart(region, 'deaths'))
    updateChart("world");
}

function updateChart(typeOfAddedData, typeOfCases = "confirmed") {
    let names = [];
    let numbers = [];
    document.querySelector('.country-data').style.visibility = 'hidden';
    document.querySelector('.chart-container').style.visibility = 'visible';
    region = typeOfAddedData;
    Array.from(JSON.parse(localStorage.getItem(typeOfAddedData))).map(el => {
        names = [...names, el.name];
        numbers = [...numbers, el[typeOfCases]]
    })
    setChart({ names: names, numbers: numbers });
    createFooter();
    addEventListenerToFooter();
}


function setChart(covidData) {
    let ctx = document.querySelector('#myChart').getContext('2d');
    if (myChart) {
        myChart.destroy();
    }
    Chart.defaults.font.size = 8;

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: covidData.names,
            datasets: [{
                label: 'Covid 19 World Data',
                data: covidData.numbers,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
                tension: 0.4,

            }]
        },
        options: {
            fill: true,
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    enabled: true
                }, title: {
                    display: true,
                    text: 'Covid 19 World Data',
                    font: {
                        size: 10
                    }
                }
            }
        }
    });
    return myChart;
}


function createFooter() {
    let footer = document.querySelector('#footer');
    footer.innerHTML = '';
    let countries = JSON.parse(localStorage.getItem(region));

    let countriesString = Array.from(countries).map((el, i) => {
        return `<a href="#up" class="country" id="country${i}"> ${el.name} </a>`
    })

    footer.innerHTML = countriesString.join("");

}
function addEventListenerToFooter() {
    Array.from(document.querySelectorAll('.country')).forEach(el => {
        el.addEventListener('click', handleCountry);
    })

}

function handleCountry(e) {
    e.preventDefault();
    document.querySelector("#up").scrollIntoView({
        behavior: 'smooth'
    });
    let regionCountries = JSON.parse(localStorage.getItem(region));
    let countryData = {};
    let indexOfCountry = parseInt(e.target.id.substr('country'.length - e.target.id.length));
    countryData = regionCountries[indexOfCountry];
    document.querySelector('#cases-total').textContent = countryData.confirmed;
    document.querySelector('#new-cases').textContent = countryData.today.confirmed;
    document.querySelector('#total-deaths').textContent = countryData.deaths;
    document.querySelector('#new-deaths').textContent = countryData.today.deaths;
    document.querySelector('#total-recovered').textContent = countryData.recovered;
    document.querySelector('#critical').textContent = countryData.critical;
    document.querySelector('.chart-container').style.visibility = 'hidden';
    document.querySelector('.country-data').style.visibility = 'visible';

}