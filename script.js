document.addEventListener('DOMContentLoaded', () => {

    const aPI_URL = "http://lmpss3.dev.spsejecna.net/procedure.php?cmd="

    let div_lide = document.getElementById("user-list");
    let div_napoje = document.getElementById("drink-list");

    let template_lidi = document.getElementById("template_lidi");
    let template_drinky = document.getElementById("template_drinky");

    let odeslatBtn = document.getElementById("submit-btn");
    let valueOFSlider = document.getElementById("valueOfSlider");

    LoadDataName();
    LoadListDrinks();

    function LoadDataName() {
        fetch(aPI_URL + "getPeopleList")
            .then(res => res.json())
            .then(data => {
                div_lide.innerHTML = "";


                for (let key in data) {
                    let clovek = data[key];



                    let copy = template_lidi.content.cloneNode(true);


                    copy.querySelector("span").innerText = clovek.name;
                    copy.querySelector("input").value = clovek.ID;


                    div_lide.appendChild(copy);
                }
            }).catch(err => console.log(err));
    }

    function LoadListDrinks() {
        fetch(aPI_URL + "getTypesList")
            .then(res => res.json())
            .then(data => {
                div_napoje.innerHTML = "";

                for (let klic in data) {
                    let napoj = data[klic];

                    let copy = template_drinky.content.cloneNode(true);
                    let valueOFSlider = copy.getElementById("valueOfSlider");
                    
                    copy.querySelector("span").innerText = napoj.typ;


                    let slider = copy.querySelector("input");
                    slider.setAttribute("data-typ", napoj.typ);




                    slider.addEventListener("input", () => {

                        valueOFSlider.innerText = slider.value;

                    });


                    div_napoje.appendChild(copy);
                }
            }).catch(err => console.log(err));
    }



    odeslatBtn.addEventListener("click", () => {

        let vybranyClovek = document.querySelector("#user-list input:checked");

        if (vybranyClovek == null) {
            alert("Musíš vybrat člověka");
            return;
        }


        let slidery = document.querySelectorAll("#drink-list input[type='range']");
        let poleNapoje = [];

        for (let i = 0; i < slidery.length; i++) {
            let aktualniSlider = slidery[i];


            let nazev = aktualniSlider.getAttribute("data-typ");
            let pocet = parseInt(aktualniSlider.value);


            let objektDrinku = {
                "type": nazev,
                "value": pocet
            };

            poleNapoje.push(objektDrinku);
        }


        let dataProServer = {
            "user": vybranyClovek.value,
            "drinks": poleNapoje
        };


        fetch(aPI_URL + "saveDrinks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataProServer)
        })
            .then(res => {
                alert("Úspěšně odesláno");
            })
            .catch(err => console.log(err));
    });

});