var player1_color_light = '#2D4263';
var player1_color = 'blue';
var player2_color_light = '#C84B31';
var player2_color = 'red';
var player1_of_color = '#00003f';
var player2_of_color = '#3f0000';
var player1 = "PLAYER 1";
var player2 = "PLAYER 2";
const base_color = 'rgba(236,219,186,0.6)';
const epsilon = 0.00001;


var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var matrica_krugova = [];
var trenutno_izabrani = [];
var nacrtani_trokuti = [];
var prekrizeni_krugovi = [];
var igra_prvi = true;
var boja_jaka = player1_color;
var boja_slaba = player1_color_light;
var base_of_color = player1_of_color;
var width;
var height;
var stepenica = false;


document.getElementById("ponovo_igrat").addEventListener("click", function(){
    event.preventDefault();
    const imena = document.getElementById("menu");
    imena.style.display = "none";
    resetuj_igru();

});



document.getElementById("start").addEventListener("click", function(){
    pokupi_imena();
    event.preventDefault();
    const imena = document.getElementById('imena_igraca');
    imena.style.display = "none";
    promijeni_banner();

});

function igra(){
    promjeni_banner();
    stepenica = true;
    let pomak = 1/10 * c.width;
    let r = 30;
    let prostor = (c.width - 2*pomak)/12;
    let y_kruga = c.height / 7;

    for(let i = 0; i < 7; i++){
        matrica_krugova.push([]);
        for(let j = 0; j < 5 + i; j++){
            let krug = new Krug(pomak + j*prostor + prostor/2,50 + y_kruga * i, r, base_color);
            matrica_krugova[i].push(krug);
            krug.nacrtaj(ctx);
        }
    }
}

function pokreni_igru(visina, sirina){
    width = sirina;
    height = visina;
    promijeni_banner();
    let pomak = 1/10 * c.width;
    let r = 30;
    let prostor = (c.width - 2*pomak)/sirina;
    let y_kruga = c.height / visina;

    for(let i = 0; i < visina; i++){
        matrica_krugova.push([]);
        for(let j = 0; j < sirina; j++){
            let krug = new Krug(pomak + j*prostor + prostor/2,50 + y_kruga * i, r, base_color);
            matrica_krugova[i].push(krug);
            krug.nacrtaj(ctx);
        }
    }
}


c.onmousemove = function(mis){
    postavi_boje();
    ocisti_canvas();

    koordinate_misa = koordinate(mis);

    document.getElementById('sve').style.cursor = 'default';
    for (let i = 0; i < matrica_krugova.length; i++){ 
        for(let j = 0; j < matrica_krugova[i].length; j++){
            if(matrica_krugova[i][j].nalazi_u(koordinate_misa.x,koordinate_misa.y)){
                matrica_krugova[i][j].update(ctx, boja_slaba);
                document.getElementById('sve').style.cursor = 'pointer';
            }
            else
                matrica_krugova[i][j].update(ctx, base_color);

            if(matrica_krugova[i][j].izabran)
                matrica_krugova[i][j].update(ctx, boja_slaba);
        }
    }

    napravi_trouglove();
    hover_na_mis(koordinate_misa);

}

canvas.addEventListener('click', function(mis) {
    koordinate_misa = koordinate(mis);

    for (let i = 0; i < matrica_krugova.length; i++)
        for(let j = 0; j < matrica_krugova[i].length; j++) 
            if(matrica_krugova[i][j].nalazi_u(koordinate_misa.x,koordinate_misa.y) && !matrica_krugova[i][j].blokiran){
                matrica_krugova[i][j].izabran = true;
                trenutno_izabrani.push(matrica_krugova[i][j]);
                
            }

    if(trenutno_izabrani.length === 3){
        let trokut = new Trokut(trenutno_izabrani[0].x, trenutno_izabrani[0].y,
                                trenutno_izabrani[1].x, trenutno_izabrani[1].y,
                                trenutno_izabrani[2].x, trenutno_izabrani[2].y,
                                boja_jaka);

        if(provjeri_trokut(trokut) === true){
	        nacrtani_trokuti.push(trokut);
	        blokiraj_izabrane();
	        prekrizi_krugove(trokut);
            if(!mogu_napravit_torkut())
                prikazi_pobjedu();
            else{
    	        igra_prvi = !igra_prvi;
                promijeni_banner();
            }
	    }

	    resetuj_izabrane();
    }
 });