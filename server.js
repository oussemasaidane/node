var http=require('http');
var url=require("url");
var querystring=require('querystring');

var params= querystring.parse(url.parse(req.url).query);
    var page=url.parse(req.url).pathname
    res.writeHead(200,{"Content-Type":"text/plain"});
    if(page== '/'){
        res.write('page d\'acceuil') ;
         }else if(page == '/contrat'){
             res.write('page Contrant') ; 
         }else if(page == '/Affichage/1/user'){
     res.write('user avec id = 1 ')
         } else if(page == '/login'){
          if('id'in params && 'login' in params){
             res.write('vodre id est' + params['id'] + 
             'et votre login ' +params['login']);
            }
          else {
                 res.write('veuillez saisir votre id et login ')
               }
            }
        else {
         res.write('404 not found !')
        }


server.listen(8080);