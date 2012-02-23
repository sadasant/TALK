
module.exports = routes = {}

/* GET ROUTES
*/

// /
routes.index = function(req, res){
  res.render('index', { title: 'talk' })
};

/* POST ROUTES
*/

// /new
routes.new_chat = function(req, res){
  var body = req.body
  console.log(body)
  res.send({'ok'})
}
