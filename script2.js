// paramétrage localisation map + zoom initial
const map = L.map('map').setView([47.218, -1.553], 13);

// ?
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// récup API bornes / tranfo des réponses en json / récupération data dans des tableaux vides
// boucle pour récupérer les coordonnées des pins / push data dans les tableaux vides en suivant le path d'accès
fetch ("https://data.nantesmetropole.fr/api/records/1.0/search/?dataset=244400404_comptages-velo-nantes-metropole-boucles-comptage&q=&sort=boucle_num&facet=boucle_num&facet=libelle&rows=200")
    .then((resp) => resp.json())
    .then(data => {
        console.log(data)
        let long = []
        let lat = []
        for (i=0 ; i<data.records.length ; i++) {
            long.push(data['records'][i]['fields']['geolocalisation'][0])
            lat.push(data['records'][i]['fields']['geolocalisation'][1])
        }
        // place les pins sur la map
        for (i=0 ; i<long.length ; i++) {
            L.marker([long[i], lat[i]]).addTo(map);
        }
    })

// lien avec html pour emplacement graph
const ctx = document.getElementById('myChart');
const graph = document.getElementById('myChart2');

// récup API nombr passages / tranfo des réponses en json / récupération data dans des tableaux vides
// boucle pour récupérer le nombre de passages / push data dans les tableaux vides en suivant le path d'accès
fetch("https://data.nantesmetropole.fr/api/records/1.0/search/?dataset=244400404_comptages-velo-nantes-metropole&q=&rows=200&sort=jour&facet=boucle_num&facet=libelle&facet=jour&facet=jour_de_la_semaine")
    .then((resp) => resp.json())
    .then(data => {
        console.log(data)
        const years=[]
        const count=[]       
        for (i=0 ; i<data.facet_groups[2].facets.length ; i++) {
            years.push(data['facet_groups'][2]['facets'][i]['name'])
            count.push(data['facet_groups'][2]['facets'][i]['count'])
        }
        // paramétrage du graph
        new Chart(ctx, {
            // choix du type de graph
            type: 'bar',
            // récupération des data à intégrer (abscisse, ordonnée, données des tableaux "years" et "count", etc.)
            data: {
                labels: years,
                datasets: [{
                    label: 'Nombre de passages de vélos',
                    data: count,
                    borderWidth: 1
                }]
            },
            // paramétrage des options du tableau
            options: {
                scales:{
                    // y pour barres verticales ; x pour barres horizontales
                    y: {
                        beginAtZero: true 
                    }
                }
            }
        })
        
        const counterName = [];
        const countPerDay = [];

        for (i=0; i<data.records.length; i++ ){
            if(data['records'][i]['fields']['total'] > 1500){
                counterName.push(data['records'][i]['fields']['libelle']);
                countPerDay.push(data['records'][i]['fields']['total'])
            }
        }
        console.log(counterName)
        console.log(countPerDay)
        
        new Chart(graph, {
            type: 'bar',
            data: {
                labels: counterName,
                datasets:[{
                    label:'Nombre de passages de vélo par compteur et par jour',
                    data: countPerDay,
                    borderWidth: 1,
                    backgroundColor: 'red'
                }]
            },
            options:{
                indexAxis: 'y'
            }

        })
    });