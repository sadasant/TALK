// TALK / public / js / chat.js
// By Daniel R. (sadasant.com)
// License: http://opensource.org/licenses/mit-license.php

window.onload = function() {

  var last = 0
    , URL = window.location.href
    , I
    , busy = false

  bindControls()

  function bindControls() {
    $('#send').click(sendPost)
    $('#load').click(loadPosts)
    $('#auto').click(toggleInterval)
    $('#remo').click(removeChat)
    loadPosts()
  }

  function sendPost() {
    var data = {
      post : $('textarea').val()
    , date : new Date().toString()
    }
    $('#error').html('loading...')
    $.post(URL+"/post", data, function(data) {
      if (data === 'ok') {
        $('textarea').val('')
        if (!I) loadPosts()
      } else {
        if (data.error) {
          $('#error').html(data.error)
        }
      }
    })
  }

  function loadPosts() {
    if (busy) return
    busy = true
    last = $('.content .post').last().attr('name')
    last = last == undefined ? -1 : last*1
    var data = {
        last : last+1
      }
    if (!I) $('#error').html('loading...')
    $.post(URL+"/load", data, function(data) {
      if (data && (data[0] === undefined || data[0].user)) {
        var i = 0
        for (; i < data.length; i++) {
          var post = data[i]
          $('.content').append('<div class="post '+(USER.id == post.user.id ? 'you' : '')+'" name="'+post.pos+'"><div class="user" data-id="'+post.user.id+'" data-name="'+post.user.name+'">'+post.user.name+' <small class="date">'+(new Date(post.date)).toString().split(' ')[4]+'</small></div><div class="post-post" data-date="'+post.date+'">'+post.post+'</div></div>')
        }
        last += i+1
        $('#error').html('')
      } else {
        window.location = "/"
      }
      busy = false
    })
  }

  function toggleInterval() {
    if (I) {
      $('#auto').val('Auto Load')
      clearInterval(I)
      I = null
    } else {
      loadPosts()
      I = setInterval(loadPosts, 1000)
      $('#auto').val('Stop Auto Load')
    }
  }

  function removeChat() {
    $.get(URL+"/remo", function(data) {
      if (data == "ok") window.location = "/"
    })
  }

}
