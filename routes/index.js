//
//exports.index=function (req, res) {
//    displayForm(res);
//};
//
//function displayForm(res) {
//    //var dir =  app.use(express.static( __dirname + '/../views'));
//    var view = res.render('')
//    exports.index = function (err, data) {
//        res.writeHead(200, {
//            'Content-Type': 'text/html',
//            'Content-Length': data.length
//        });
//        res.write(data);
//        res.end();
//    };
//}
exports.index=function (req, res) {
   res.render('index.html');
};
exports.register=function (req, res) {
   res.render('register.html');
};

exports.contact=function (req, res) {
   res.render('contact.html');
};
exports.dashboard=function (req, res) {
   res.render('dashboard.html');
};