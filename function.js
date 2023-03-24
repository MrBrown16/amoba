const url = "https://malomgame20230324103459.azurewebsites.net/api/steps/";

const xhr = new XMLHttpRequest();

const state = {
    step: null,
    finish: false,
    timer: null,
    gamers: null,
    lepes: false

}

function requestApi(method, url, fuggveny, message){
    xhr.onload = function(){fuggveny();};
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type","application/json");
    xhr.setRequestHeader("Accept","application/json");
    xhr.send(JSON.stringify(message));
}
console.log("console ki");
function GETfeldolgozo(){
    if ((xhr.status == 200)||(xhr.status == 201)) {
        state.step = JSON.parse(xhr.responseText);
        if (state.gamers==null) state.gamers = state.step.gamers;
        console.log(state.step);
        if ((state.step.finish)) {
            console.log("Játék indítása");
            clearInterval(state.timer);
            jatekIndul();
        }else{
            console.log("Várakozás a másik játékosra");
            if (!state.timer) {
                state.timer = setInterval(function(){
                    requestApi("GET", url+state.step.id, GETfeldolgozo);
                },3000);  
            }

        }

    }else{
        console.log("Hiba a kérésben", xhr.status);
    }
}
function STEPfeldolgozo(){
    if ((xhr.status == 200)||(xhr.status == 201)) {
        state.step = JSON.parse(xhr.responseText);
        if ((state.step.gamers != state.gamers)&&(state.step.sor)){
            clearInterval(state.timer);
            let field = document.getElementById("field");
            field.children[state.step.sor].children[state.step.oszlop].innerHTML="<p>O</p>";
            field.children[state.step.sor].children[state.step.oszlop].onclick = null;
            state.lepes = true;
            //TODO: jatek vege?
        }
    }else{
        console.log("Hiba a kérésben", xhr.status);
    }
}
function PUTfeldolgozo(){
    if ((xhr.status==200)||(xhr.status==201)) {
        state.timer = setInterval(function(){
            requestApi("GET", url+state.step.id, STEPfeldolgozo); //TODO: stepfeldolgozo
        },3000); 
    }
    else{
        console.log("PUT hiba");
    }
}
function jatekIndul(){
    if (state.gamers == 0) state.lepes = true;
    else{
        state.timer = setInterval(function(){
            requestApi("GET", url+state.step.id, STEPfeldolgozo); //TODO: stepfeldolgozo
        },3000);  
    }
    let field = document.getElementById("field");
    field.innerHTML = "";
    for (let i = 0; i < 10; i++) {
        let row = document.createElement("div");
        row.className = "row";
        for (let j = 0; j < 10; j++) {
            let cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.row = i;
            cell.dataset.cella = j;
            cell.onclick = click;
            row.appendChild(cell);
        }
        field.appendChild(row);
    }
}
function click(e){
    if (state.lepes) {
    e.target.innerHTML="<p>X</p>";
    state.step.sor = this.dataset.row;
    state.step.oszlop = this.dataset.cella;
    state.step.gamers = state.gamers;
    this.onclick = null;
    requestApi("PUT", url+state.step.id, PUTfeldolgozo, state.step);
    console.log("Az ellenfél lépésére vár....");
    state.lepes = false;
    //TODO:játék vége?        
    }
}
requestApi("GET", url, GETfeldolgozo);