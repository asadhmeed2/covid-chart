

let myChart =null;
let region="";
async function getData() {
    let data1 = {};
    let data2 = {};
    let dataObjects = {};
    if (!(localStorage.getItem('asia') && localStorage.getItem('europe') && localStorage.getItem('africa') && localStorage.getItem('oceania') && localStorage.getItem('americas')&& localStorage.getItem('world'))) {
        try{
            data1 = await (await fetch('https://corona-api.com/countries')).json();
            data2 = await (await fetch('https://api.allorigins.win/raw?url=https://restcountries.herokuapp.com/api/v1')).json();
            console.log(data2);
 dataObjects = Array.from(data1.data).map((item, i) => {
          
            return {
                name: data2[i].name.common,
                region: data2[i].region,
                code: item.code,
                confirmed: item.latest_data.confirmed,
                critical: item.latest_data.critical,
                deaths: item.latest_data.deaths,
                recovered: item.latest_data.recovered,
                population: item.population,
                today: {
                    deaths: item.today.deaths,
                    confirmed: item.today.confirmed
                }
            }
        })

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
   
        }catch(error){
            console.log(error);

        }
    }
       

}
getData()
addEventListnerToButtons();
function addEventListnerToButtons() {
    document.querySelector('#asia-btn').addEventListener('click',() => updateChart("asia"), false);
    document.querySelector('#europe-btn').addEventListener('click',() => updateChart("europe"), false);
    document.querySelector('#americas-btn').addEventListener('click',() => updateChart("americas"), false);
    document.querySelector('#africa-btn').addEventListener('click',() => updateChart("africa"), false);
    document.querySelector('#oceania-btn').addEventListener('click',() => updateChart("oceania"), false);
    document.querySelector('#world-btn').addEventListener('click', () => updateChart("world"), false);
    updateChart("world");
    document.querySelector('#confirmed-btn').addEventListener('click', () => updateChart(region,'confirmed'))
    document.querySelector('#recovered-btn').addEventListener('click', () => updateChart(region, 'recovered'))
    document.querySelector('#critical-btn').addEventListener('click', () => updateChart(region, 'critical'))
    document.querySelector('#deaths-btn').addEventListener('click', () => updateChart(region, 'deaths'))
}

function updateChart(typeOfAddedData, typeOfCases = "confirmed") {
    let names = [];
    let numbers = [];
    region=typeOfAddedData;
     Array.from(JSON.parse(localStorage.getItem(typeOfAddedData))).map(el => {
        names = [...names, el.name];
        numbers = [...numbers, el[typeOfCases]]
    })
    setChart({ names: names, numbers: numbers }) ;
}


function setChart(covidData) {
    let ctx = document.querySelector('#myChart').getContext('2d');
    if(myChart){
        myChart.destroy();
    }
     myChart= new Chart(ctx, {
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
                    font:{
                        size:10
                    }
                }
            }
        }
    });
    return myChart;
}


function createFooter() {
let footer = document.querySelector('#footer');
    let countries = JSON.parse(localStorage.getItem(region));
let countriesString = Array.from(countries).map(el=>{
    
})
}