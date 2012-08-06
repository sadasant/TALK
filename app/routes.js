var TALK
  , controller

module.exports = function(_TALK) {

  TALK = _TALK
  controller = require('./controller')(TALK)

  // General Use

  TALK.server.get('/', reset, controller.index)
  TALK.server.error(controller.error)

  // Chat Routes

  TALK.server.get ('/:name'     ,        controller.chat_show)
  TALK.server.get ('/:name/rm'  ,        controller.chat_rm  )
  TALK.server.post('/new'       ,        controller.chat_new )
  TALK.server.post('/join'      , reset, controller.chat_join)
  TALK.server.post('/:name/post', reset, controller.chat_post)
  TALK.server.post('/:name/load',        controller.chat_load)

}

// Reset Main Variables
function reset(req, res, next) {
  if (req.query.reset || (new Date()).getDay() !== TALK.settings.today) {
    TALK.settings.today = (new Date()).getDay()
    TALK.collections.flush()
    TALK.stats.flush()
  }
  return next()
}
