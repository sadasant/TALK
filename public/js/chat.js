// TALK / public / js / chat.js
// By Daniel R. (sadasant.com)
// License: http://opensource.org/licenses/mit-license.php

window.onload = function() {

  var last = 0
    , URL = window.location.href
    , I   = false
    , busy = false
    , sent = 0
    , $content = $('#content')
    , $textarea = $('textarea')
    , $error = $('#error')
    , $auto = $('#auto')

  bindControls()

  function bindControls() {
    $('#send').click(sendPost)
    $('#load').click(loadPosts)
    $('#auto').click(toggleInterval)
    $('#remo').click(removeChat)
    // Binding <CTRL> + <ENTER>
    $('#new_post').on('keypress', function(e) {
      e = window.event || e
      var key = e.keyCode
        , ctrl = e.ctrlKey
      if (key == 10 || (ctrl && key == 13)) {
        sendPost()
      }
    })
    loadPosts()
  }

  function sendPost() {
    var data = {
      post : $textarea.val()
    , date : new Date().toString()
    }
    $error.html('loading...')
    $.post(URL+"/post", data, function(data) {
      if (data === 'ok') {
        sent++
        $textarea.val('')
        if (!I) loadPosts()
      } else {
        if (data.error) {
          $error.html(data.error)
        }
      }
    })
  }

  function loadPosts() {
    if (busy) return
    busy = true
    last = $content.find('.post').last().attr('name')
    last = last == undefined ? -1 : last*1
    var data = {
        last : last+1
      , I    : I
      }
    if (!I) $error.html('loading...')
    $.post(URL+"/load", data, function(data) {
      if (data && (data[0] === undefined || data[0].user)) {
        var i = 0
        if (data.length && last == -1) $content.html('')
        var new_posts = data.length - sent
        document.title = (new_posts ? "("+new_posts+") " : "") + "TALK: " + CHAT.name
        sent = 0
        for (; i < data.length; i++) {
          var post = data[i]
          $content.append('<div class="post '+(USER.id == post.user.id ? 'you' : '')+'" name="'+post.pos+'"><div class="user" data-id="'+post.user.id+'" data-name="'+post.user.name+'">'+post.user.name+' <small class="date">'+post.date.split(' ')[4]+'</small></div><div class="post-post" data-date="'+post.date+'">'+post.post+'</div></div>')
        }
        last += i+1
        $error.html('')
      } else {
        window.location = "/"
      }
      busy = false
      if (I) setTimeout(loadPosts, 1000)
    }).error(function() {
      // Resend on timeout
      busy = false
      if (I) loadPosts()
    })
  }

  function toggleInterval() {
    if (I) {
      I = false
      $auto.val('Auto Load')
    } else {
      I = true
      loadPosts()
      $auto.val('Stop Auto Load')
    }
  }

  function removeChat() {
    $.get(URL+"/remo", function(data) {
      if (data == "ok") window.location = "/"
    })
  }

}
