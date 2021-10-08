
async function getData(){
    let data1={};
    let data2={};
    let dataObjects={};
    if (!(localStorage.getItem('asia') && localStorage.getItem('europe') && localStorage.getItem('africa') && localStorage.getItem('oceania') && localStorage.getItem('americas') )){
        data1 = await (await fetch('https://corona-api.com/countries')).json();
        data2 = await (await fetch('https://cors-anywhere.herokuapp.com/https://restcountries.herokuapp.com/api/v1')).json();
    let index =0;
        dataObjects =Array.from(data1.data).map((item,i)=>{
        ++index;
        return{
            name: data2[i].name.common,
            region: data2[i].region,
            code:item.code,
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
    
    dataObjects = dataObjects.filter(el=>el.region.length>0);
    let asia = dataObjects.filter(el=>el.region==="Asia");
    let europe = dataObjects.filter(el=>el.region==="Europe");
    let africa = dataObjects.filter(el=>el.region==="Africa");
    let oceania = dataObjects.filter(el=>el.region==="Oceania");
    let americas = dataObjects.filter(el=>el.region==="Americas");
    localStorage.setItem("asia", JSON.stringify(asia))
    localStorage.setItem("europe", JSON.stringify(europe))
    localStorage.setItem("africa", JSON.stringify(africa))
    localStorage.setItem("oceania", JSON.stringify(oceania))
    localStorage.setItem("americas", JSON.stringify(americas))
    }

}
 getData()

function addEventListnerToButtons(){

}
setCart();
function setCart(covidData){
    let ctx = document.querySelector('#myChart').getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['asad', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: 'Covid 19 World Data',
            data: [12, 19,3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1,
            tension: 0.4,
            fill:true,
                responsive:true
        }]
    },
        options: {
            plugins: {
                tooltip: {
                    enabled: false
                }, title: {
                    display: true,
                    text: 'Covid 19 World Data',
                }
                
            }
        }
});
}