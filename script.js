let url = "https://www.planetoscope.com/widget.php?id=274&f=1"
fetch(url)
    .then(res => {
        if(res.ok){
            console.log(res)
            
        } else {
            console.log("Erreur")
            document.getElementById("message").innerHTML = "Erreur!"
        }
    })
    .then(data => {
            document.getElementById("data").innerHTML = data
            
    })
        