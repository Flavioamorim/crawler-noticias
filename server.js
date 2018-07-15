var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
const Nightmare = require('nightmare');

var app = express();

var json = [];
var jsonUol = [];


app.get('/', function (req, res) {

    
    
    var urlUol = 'https://esporte.uol.com.br/futebol/times/atletico-mg/noticias/'; //jogos
    var url = 'https://globoesporte.globo.com/futebol/times/atletico-mg/'; //jogos

    setInterval(function () {

        console.log("iniciou ... ");

        

        request(urlUol, function (error, response, html) {    
            if (!error) {
                var $ = cheerio.load(html);
                var iUol = 0 ;
                $('a').each(function (index, element) {
                    if ($(this).hasClass('opacity-group')) {
                        if (iUol <= 15){
                            var link = $(this).attr('href');
                            var title = $(this).find('img').attr('title');
                            var imagem = $(this).find('img').attr('src');
                            var news = {
                                link: link,
                                title: title,
                                imagem: imagem
                            }
                            jsonUol.push(news);
                            iUol++;
                        }
                    }                 
                });

                fs.writeFile('../../production/public/uol.json', JSON.stringify(jsonUol, null, 4), function (err) {
                //fs.writeFile('uol.json', JSON.stringify(json, null, 4), function (err) {
                    if (err)
                        console.log('Error on updating');
                });
                iUol = 0;                
                jsonUol = [];
            } else {
                console.log("Erro ao buscar informacoes uol")
            }
        });                

        const getGlobo = function () {
            let nightmare = Nightmare({ show: true });
            nightmare
                .goto(url)
                .scrollTo(3500, 3500)
                .wait(8000)
                .evaluate(() => document.body.innerHTML)
                .end()
                .then((data) => {
                    var $ = cheerio.load(data);
                    console.log('oiiiiiiii')
                    $('a').each(function (index, element) {
                        var iGlobo = 0;
                        if ($(this).hasClass('feed-post-link') ){
                            if (iGlobo <= 15) {
                                var link = $(this).attr('href');
                                var title = $(this).text();
                                var news = {
                                    link: link,
                                    title: title
                                }
                                json.push(news);                            
                            }
                        }

                    });
                    // fs.writeFile('../../production/public/globo.json', JSON.stringify(jsonUol, null, 4), function (err) {
                    fs.writeFile('globo.json', JSON.stringify(json, null, 4), function (err) {
                        if (err)
                            console.log('Error on updating');
                    });
                    iGlobo = 0;
                    json = [];                    
                })
                .catch((error) => {
                    console.error('Search failed:', error);
                });
        } 
        
        getGlobo();
    //  }, 25000);     
    }, 30 * 60 * 1000);     

});

app.listen('8081');
console.log('Please, open your browser on http://localhost:8081 ');
exports = module.exports = app;
