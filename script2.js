const map = L.map('map').setView([47.218, -1.553], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

fetch ("https://data.nantesmetropole.fr/api/records/1.0/search/?dataset=244400404_comptages-velo-nantes-metropole-boucles-comptage&q=&sort=boucle_num&facet=boucle_num&facet=libelle&rows=200")
    .then((resp) => resp.json())
    .then(data => {
        let long = []
        let lat = []
        for (i=0 ; i<data.records.length ; i++) {
            long.push(data['records'][i]['fields']['geolocalisation'][0])
            lat.push(data['records'][i]['fields']['geolocalisation'][1])
        }
        //return [long, lat];
        for (i=0 ; i<long.length ; i++) {
            L.marker([long[i], lat[i]]).addTo(map);
        }
    })

//intégration du comptage de vélo dans un graphique

const ctx = document.getElementById('myChart');

fetch("https://data.nantesmetropole.fr/api/records/1.0/search/?dataset=244400404_comptages-velo-nantes-metropole&q=&sort=jour&facet=boucle_num&facet=libelle&facet=jour&facet=probabilite_presence_anomalie&facet=jour_de_la_semaine&facet=boucle_libelle&facet=vacances_zone_b")
    .then((resp) => resp.json())
    .then(data => {
        const years=[]
        const count=[]       
        for (i=0 ; i<data.facet_groups[2].facets.length ; i++) {
            years.push(data['facet_groups'][2]['facets'][i]['name'])
            count.push(data['facet_groups'][2]['facets'][i]['count'])
        }
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: years,
                datasets: [{
                    label: 'Nombre de passages de vélos',
                    data: count,
                    borderWidth: 1
                }]
            },
            options: {
                scales:{
                    y: {
                        beginAtZero: true 
                    }
                }
            }
        })
    });