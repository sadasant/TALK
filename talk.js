// TALK
// By Daniel Rodríguez
// http://sadasant.com/license

var TALK
  , settings

settings = {
  today                 : (new Date()).getDay()
, forbidden             : ['new', 'join']
, stored_posts_per_user : 3
, max_length_of_post    : 1024
, loop_initial_time     : 1000
, loop_scale_factor     : 250
, loop_limit            : 1000*60*10
, port                  : process.env['app_port'] || 1337
}

TALK = require('./app/setup')(settings)
