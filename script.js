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
    //loads names
    function LoadDataName() {
        fetch(aPI_URL + "getPeopleList")
            .then(res => {

                if (!res.ok) {
                    throw new Error(res.status);
                }

                return res.json()
            }



            )
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
    //loads drinks
    function LoadListDrinks() {
        fetch(aPI_URL + "getTypesList")
            .then(res => {

                if (!res.ok) {
                    throw new Error(res.status);
                }

                return res.json()
            })
            .then(data => {
                div_napoje.innerHTML = "";

                for (let key in data) {
                    let napoj = data[key];

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
            alert("Choose WHO");
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


                if (res.ok) {

                    SendDataFromLocal(); //should check data from local and send it with new ones
                    return alert("Sucessfuly sent");

                }

                alert("Error on server data will be saved util u will be online again");
                SaveDataFromLocalSt(dataProServer);
                return;


            })
            .catch(err => console.log(err));
    });


    function SaveDataFromLocalSt(data) {

        let dataList = JSON.parse(localStorage.getItem("dataOffline")) || [];
        dataList.push(data);
        localStorage.setItem("dataOffline", JSON.stringify(dataList));

        console.log("Data saved in localsotorage")
        return alert("data saved to local storage")

    }

    function SendDataFromLocal() {



        let getDatas = JSON.parse(localStorage.getItem("dataOffline")) || []; //if null returns emtpy list

        if (getDatas == null) {
            return;
        }

        getDatas.forEach(element => {

            let dataProServer = {
                "user": element.user,
                "drinks": element.drinks
            };



            fetch(aPI_URL + "saveDrinks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataProServer)

            })

                .then(res => {


                    if (res.ok) {


                        console.log("data sent")
                        localStorage.removeItem("dataOffline");
                        return;
                    }


                    SaveDataFromLocalSt();
                    //return alert("Chyba se serverem ukladani dokud se zase nepripojite");


                })
                .catch(err => console.log(err));

        });













    }

});