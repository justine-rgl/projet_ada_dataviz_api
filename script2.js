// paramétrage localisation map + zoom initial
const map = L.map('map').setView([47.218, -1.553], 13);

// paramètres de la carte
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// création icone verte
var greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

const globalCounter = [];

// récup API bornes / tranfo des réponses en json / récupération data dans des tableaux vides
// boucle pour récupérer les coordonnées des pins / push data dans les tableaux vides en suivant le path d'accès
fetch ("https://data.nantesmetropole.fr/api/records/1.0/search/?dataset=244400404_comptages-velo-nantes-metropole-boucles-comptage&q=&rows=100&sort=boucle_num&facet=boucle_num&facet=libelle&apikey=c029c3d658c1b2b76334997b7cf8798eb391e6f966c87274ad981057")
    .then((resp) => resp.json())
    .then(data => {
       console.log(data)
        const long = [];
        const lat = [];
        ;
        
        for (i=0 ; i<data['records'].length ; i++) {
            long.push(data['records'][i]['fields']['geolocalisation'][0])
            lat.push(data['records'][i]['fields']['geolocalisation'][1])
            globalCounter.push(data['records'][i]['fields'])
        }
        
        // place les pins sur la map
        for (i=0 ; i<long.length ; i++) {
            let markers = L.marker([long[i], lat[i]]).addTo(map);
            markers.bindPopup(data.records[i].fields.libelle).openPopup();
        }
        bikeCount()
    })

// lien avec html pour emplacement graph
const ctx = document.getElementById('myChart');
const graph = document.getElementById('myChart2');
const graphParHeure = document.getElementById('myChart3');

// récup API nombr passages / tranfo des réponses en json / récupération data dans des tableaux vides
// boucle pour récupérer le nombre de passages / push data dans les tableaux vides en suivant le path d'accès
function bikeCount(){
    fetch("https://data.nantesmetropole.fr/api/records/1.0/search/?dataset=244400404_comptages-velo-nantes-metropole&q=&rows=100&sort=jour&facet=boucle_num&facet=libelle&facet=jour&facet=probabilite_presence_anomalie&facet=jour_de_la_semaine&facet=boucle_libelle&facet=vacances_zone_b&apikey=c029c3d658c1b2b76334997b7cf8798eb391e6f966c87274ad981057")
        .then((resp) => resp.json())
        .then(data => {
        console.log(data)
        /*const years=[]
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
        })*/
        
        const counterName = [];
        const countPerDay = [];

        for (i=0; i<data.records.length; i++ ){
            if(data['records'][i]['fields']['total'] >= 2300){
                counterName.push(data['records'][i]['fields']['libelle']);
                countPerDay.push(data['records'][i]['fields']['total'])

            }
        }
        //console.log(counterName)
        //console.log(countPerDay)
        
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
        const longMostCounter = [];
        const latMostCounter = [];
        const counterLibelle = [];
        //console.log(globalCounter)
        for (i=0 ; i<counterName.length; i++){
            //console.log(counterName[i])
            for (j=0 ; j<globalCounter.length; j++){ 
                //console.log(globalCounter[j].libelle)   
                if (counterName[i] == globalCounter[j].libelle){
                    //console.log(counterName[i] + '=' + globalCounter[j].libelle)
                    longMostCounter.push(globalCounter[j].geolocalisation[0])
                    latMostCounter.push(globalCounter[j].geolocalisation[1])
                    counterLibelle.push(globalCounter[j].libelle)
                }
            
            }
        }
        //console.log(longMostCounter[0])
        //console.log(latMostCounter)
        for (i=0 ; i<longMostCounter.length ; i++) {
            L.marker([longMostCounter[i], latMostCounter[i]], {icon: greenIcon}).addTo(map).bindPopup(counterLibelle[i]).openPopup();
            //L.marker([47.2083580489973, -1.5497189172153978], {icon: greenIcon}).addTo(map).bindPopup("Pont Audibert vers Sud").openPopup();
        }

        // création graphe passage vélo par heure
        const heures = ["0h-1h", "1h-2h", "2h-3h", "3h-4h", "4h-5h", "5h-6h", "6h-7h", "7h-8h", "8h-9h", "9h-10h", "10h-11h", "11H-12h", "12h-13h", "13h-14h", "14h-15h", "15h-16h", "16h-17h", "17h-18h", "18h-19h", "19h-20h", "20h-21h", "21h-22h", "22h-23h", "23h-0h"]
        const totalParHeure = [];

        let total0h = 0
        let total1h = 0
        let total2h = 0
        let total3h = 0
        let total4h = 0
        let total5h = 0
        let total6h = 0
        let total7h = 0
        let total8h = 0
        let total9h = 0
        let total10h = 0
        let total11h = 0
        let total12h = 0
        let total13h = 0
        let total14h = 0
        let total15h = 0
        let total16h = 0
        let total17h = 0
        let total18h = 0
        let total19h = 0
        let total20h = 0
        let total21h = 0
        let total22h = 0
        let total23h = 0      
        
        for (i=0 ; i< data.records.length ; i++){
            if (data['records'][i]['fields']['00', '01', '02','03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'] != undefined){
                total0h += data['records'][i]['fields']['00'] 
                total1h += data['records'][i]['fields']['01']
                total2h += data['records'][i]['fields']['02']
                total3h += data['records'][i]['fields']['03']
                total4h += data['records'][i]['fields']['04']
                total5h += data['records'][i]['fields']['05']
                total6h += data['records'][i]['fields']['06']
                total7h += data['records'][i]['fields']['07']
                total8h += data['records'][i]['fields']['08']
                total9h += data['records'][i]['fields']['09']
                total10h += data['records'][i]['fields']['10']
                total11h += data['records'][i]['fields']['11']
                total12h += data['records'][i]['fields']['12']
                total13h += data['records'][i]['fields']['13']
                total14h += data['records'][i]['fields']['14']
                total15h += data['records'][i]['fields']['15']
                total16h += data['records'][i]['fields']['16']
                total17h += data['records'][i]['fields']['17']
                total18h += data['records'][i]['fields']['18']
                total19h += data['records'][i]['fields']['19']
                total20h += data['records'][i]['fields']['20']
                total21h += data['records'][i]['fields']['21']
                total22h += data['records'][i]['fields']['22']
                total23h += data['records'][i]['fields']['23']
            }
        }
        totalParHeure.push(total0h, total1h, total2h, total3h, total4h, total5h, total6h, total7h, total8h, total9h, total10h, total11h, total12h, total13h, total14h, total15h, total16h, total17h, total18h, total19h, total20h, total21h, total22h, total23h)
        console.log(totalParHeure)
    
        
        
        new Chart(graphParHeure, {
            type: "line",
            data: {
                labels: heures,
                datasets: [{
                    label: 'Nombre de passages de vélos par heure',
                    data: totalParHeure,
                    borderColor: 'orange',
                    fill: true,
                    backgroundColor: 'violet',
                    tension: 0.4
                }]
            },
            
            options: {
                responsive: true,
                scales:{
                    y: {
                        beginAtZero: true 
                    }
                }
            }
        })


    })
}