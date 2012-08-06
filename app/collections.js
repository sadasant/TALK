var CHATS = {}
  , USERS = {}
  , TALK


module.exports = function(_TALK) {
  TALK = _TALK
  _TALK.collections = {
    chats : CHATS
  , users : USERS
  , flush : flush
  }
}

function flush(k) {
  TALK.collections.users = {}
  TALK.collections.chats = {}
}
