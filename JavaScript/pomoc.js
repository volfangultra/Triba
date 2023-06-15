function blokiraj_izabrane(){
    for(let i = 0; i < 3; i++)
        trenutno_izabrani[i].blokiran = true;

}

function resetuj_izabrane(){
    for(let i = 0; i < 3; i++)
        trenutno_izabrani[i].izabran = false;
    
    trenutno_izabrani = [];
}


function koordinate(mis){
    var oko_misa = c.getBoundingClientRect(),
    scaleX = c.width / oko_misa.width,
    scaleY = c.height / oko_misa.height;

    return  {
                x: (mis.clientX - oko_misa.left) * scaleX,
                y: (mis.clientY - oko_misa.top) * scaleY
            }

}

function ocisti_canvas(){
    ctx.clearRect(0, 0, c.width, c.height);
}


function postavi_boje(){
    if(igra_prvi){
        boja_jaka = player1_color;
        boja_slaba = player1_color_light;
        base_of_color = player1_of_color;
    }else{
        boja_jaka = player2_color;
        boja_slaba = player2_color_light;
        base_of_color = player2_of_color;
    }
}

function hover_na_mis(koordinate_misa){
     if(trenutno_izabrani.length >= 1){
        let linija = new Linija(koordinate_misa.x, koordinate_misa.y, trenutno_izabrani[0].x, trenutno_izabrani[0].y);
        linija.nacrtaj(ctx, boja_jaka, 5);
    }
    if(trenutno_izabrani.length === 2){
        let linija = new Linija(koordinate_misa.x, koordinate_misa.y, trenutno_izabrani[1].x, trenutno_izabrani[1].y);
        linija.nacrtaj(ctx, boja_jaka, 5);
        linija = new Linija(trenutno_izabrani[1].x, trenutno_izabrani[1].y, trenutno_izabrani[0].x, trenutno_izabrani[0].y);
        linija.nacrtaj(ctx, boja_jaka, 5);
    }

}

function napravi_trouglove(){
    for(let i = 0; i < nacrtani_trokuti.length; i++)
        nacrtani_trokuti[i].nacrtaj(ctx);       
    
}

function prekrizi_krugove(trokut){
    for(let i = 0; i < matrica_krugova.length; i++)
        for(let j = 0; j < matrica_krugova[i].length; j++)
            if(trokut.sjece_krug(matrica_krugova[i][j])){
                matrica_krugova[i][j].update(ctx, base_of_color);
                matrica_krugova[i][j].blokiran = true;
            }
}

function provjeri_trokut(trokut){
    if(trokut.povrsina < epsilon)
        return false;
    for(let i = 0; i < nacrtani_trokuti.length; i++)
        if(nacrtani_trokuti[i].sjece_trokut(trokut))
            return false;


    for(let i = 0; i < matrica_krugova.length; i++)
        for(let j = 0; j < matrica_krugova[i].length; j++)
            if(matrica_krugova[i][j].blokiran == true && trokut.sjece_krug(matrica_krugova[i][j]))
                return false;


    return true;
}

function mogu_napravit_torkut(){
   for(let i1 = 0; i1 < matrica_krugova.length; i1++)
        for(let j1 = 0; j1 < matrica_krugova[i1].length; j1++)
            for(let i2 = 0; i2 < matrica_krugova.length; i2++)
                for(let j2 = 0; j2 < matrica_krugova[i2].length; j2++)
                    for(let i3 = 0; i3 < matrica_krugova.length; i3++)
                        for(let j3 = 0; j3 < matrica_krugova[i3].length; j3++){
                            if(!matrica_krugova[i1][j1].blokiran && !matrica_krugova[i2][j2].blokiran && !matrica_krugova[i3][j3].blokiran){
                                trokut = new Trokut(    matrica_krugova[i1][j1].x, matrica_krugova[i1][j1].y,
                                                        matrica_krugova[i2][j2].x, matrica_krugova[i2][j2].y,
                                                        matrica_krugova[i3][j3].x, matrica_krugova[i3][j3].y);
                                if(provjeri_trokut(trokut))
                                    return true;
                                
                            }
                    }
    return false;
}

function prikazi_pobjedu(){
    const pobjednik = document.getElementById('pobjednik')
    if(igra_prvi){
        pobjednik.innerHTML = "THE WINNER IS " + player1;
        promijeni_igraca();
    }
    else{
       pobjednik.innerHTML = "THE WINNER IS " + player2;
       promijeni_igraca();
    }

    const imena = document.getElementById("menu");
    imena.style.display = "flex";

}

function promijeni_banner(){
    const igrac = document.getElementById('igrac');
    if(igra_prvi){
        igrac.style.background=player1_of_color;
        igrac.innerHTML = player1;
        c.style.borderColor = player1_of_color;
    }
    else{
        igrac.style.background=player2_of_color;
        igrac.innerHTML = player2;
        c.style.borderColor = player2_of_color;
    }

}

function resetuj_igru(){

    ocisti_canvas();
    matrica_krugova = [];
    trenutno_izabrani = [];
    nacrtani_trokuti = [];
    prekrizeni_krugovi = [];
    igra_prvi = true;
    if(stepenica === false)
        pokreni_igru(height, width)
    else
        igra();

}

function pokupi_imena(){
    const ime_prvog = document.getElementById('player1').value;
    const ime_drugog = document.getElementById('player2').value;
    if(ime_prvog.length > 0)
        player1 = ime_prvog;
    if(ime_drugog.length > 0)
        player2 = ime_drugog;

}

function promijeni_igraca(){
    [player1_color,  player2_color] = [player2_color,  player1_color];
    [player1_color_light,  player2_color_light] = [player2_color_light,  player1_color_light];
    [player1_of_color,  player2_of_color] = [player2_of_color,  player1_of_color];
    [player1,  player2] = [player2,  player1];
}