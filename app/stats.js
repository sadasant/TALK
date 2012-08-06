var TALK

module.exports = function(_TALK) {
  TALK = _TALK
  _TALK.stats = {
    chats : 0
  , users : 0
  , flush : flush
  }
}


function flush() {
  TALK.stats.chats = 0
  TALK.stats.users = 0
}
