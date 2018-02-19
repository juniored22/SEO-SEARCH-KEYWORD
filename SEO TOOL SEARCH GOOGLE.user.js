// ==UserScript==
// @name         SEO TOOL SEARCH GOOGLE
// @version      0.1
// @description  Ferramenta busca de Palavras chaves no Google
// @author       Edgard Jnuior
// @match        https://www.google.com.br/*
// @grant        none
// ==/UserScript==


(function() {
    'use strict';
    var keyword;
    var url;

    let input_Google              = document.querySelector('#lst-ib');
    let btn_search_Google         = document.querySelector("#_fZl");
    let result_search_Google      = document.querySelectorAll('._Rm');

    for(var i=0; i < result_search_Google.length;i++) {
        result_search_Google[i].innerHTML +="<span class='numero'></span> ";
    }
    let show_row_search_Google = document.querySelectorAll('.numero');
    for(var j=0 ;j< show_row_search_Google.length; j++){
        show_row_search_Google[j].innerHTML =j+1;
        show_row_search_Google[j].style.position = "absolute";
        show_row_search_Google[j].style.left = "-20px";
    }
    //------------------------------------------------------------------
    //Monta array palavrachave
    function LIST(keyword,GET,ADD,url) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                keyword    = this.responseText.replace('[','');
                keyword    = keyword.replace(']','');
                keyword    = JSON.parse(keyword);
                url        = keyword.url;
                keyword    = keyword.palavras;
                keyword    = "Palavras chaves SEO,"+keyword;
                keyword    = keyword.split(",");

                GET(keyword,ADD,url);
            }
        };
        xhttp.open("GET", "https://search-g.glitch.me/palavras", true);
        xhttp.send();
        console.log("run 1");
    }
    //------------------------------------------------------------------
    //Pega posição para busca e popula banco com resultado com a funcão ADD como callback
    function GET(palavra_posicao,ADD,url) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                //debbug
                console.log(url);
                console.log("Lista de Palavras --------------",palavra_posicao);
                //

                input_Google.value = palavra_posicao[this.responseText];
                var posi    = document.querySelectorAll('._Rm');
                for(var i = 0; i < posi.length; i++){
                    if(posi[i].innerText.indexOf(url) >= 0){
                        console.warn(palavra_posicao[this.responseText-1] + " Achou na posicao [ "+(i+1)+" ]");
                        posi[i].style.background = "#e6162540";
                        ADD(palavra_posicao[this.responseText-1],i+1 );
                        return ;
                    }
                }
                console.warn(palavra_posicao[this.responseText-1] + " Não achou ");
                ADD(palavra_posicao[this.responseText-1],"NULL" );
            }
        };
        xhttp.open("GET", "https://search-g.glitch.me/position", true);
        xhttp.send();
        console.log("run 3");
    }
    //------------------------------------------------------------------
    //Incrementa proxima posição para busca futura
    function POST() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                //console.log(this.responseText);
            }
        };
        xhttp.open("POST", "https://search-g.glitch.me/add_position", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("palavra=ok");
        console.log("run 2");
    }
    //------------------------------------------------------------------
    //Popula banco com resultado da busca no Google
    function ADD(key, value) {
        var xhttp = new XMLHttpRequest();
        var palavra = encodeURIComponent(key);
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                //console.log(this.responseText);
            }
        };
        xhttp.open("POST", "https://search-g.glitch.me/add_result", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("palavra=" + encodeURIComponent(palavra) + "&posicao=" + value);
        console.log("run 4");
        function callback () {
            return new Promise((resolve, reject)=>{ setTimeout(_=>resolve(), 5000); });
        }
        if(palavra != "undefined"){
            callback().then( result=>btn_search_Google.click() );
        }else{
            console.log(" Fim "+palavra);
            spawnNotification("SEO TOOL","Estatistica finalizada","http://tesseratoschool.16mb.com/content/uploads/2016/10/logo.png");
            return;
        }
    }
    //------------------------------------------------------------------
    //Estatistica ação final
    function ESTATISTIC() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let estati = JSON.parse(this.responseText);
                console.log(Object.keys(estati[0]).toString());
                for(var i=1;i < estati.length;i++){
                    console.log('"' + Object.values(estati[i]).toString().replace(/,/g,`","`)+'"');
                }
            }
        };
        xhttp.open("GET", "https://search-g.glitch.me/estatistica", true);
        xhttp.send();
        console.log("run 5");
    }
    LIST(keyword,GET,ADD);POST();ESTATISTIC();
})();

function notifyMe() {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("Este navegador não suporta notificações na área de trabalho");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification("Estatistica Finalizada!");
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification("Estatistica Finalizada!");
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them any more.
}

Notification.requestPermission();

function spawnNotification(titulo,corpo,icone) {
  var opcoes = {
      icon:icone,
      body: corpo
  }

  var n = new Notification(titulo,opcoes);
}
//notifyMe()
chrome.runtime.sendMessage("running");

