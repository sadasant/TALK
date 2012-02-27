// TALK / public / js / chat.js
// By Daniel R. (sadasant.com)
// License: http://opensource.org/licenses/mit-license.php

window.onload = function() {

  var last = 0
    , URL = window.location.href
    , I = false
    , busy = false
    , sent = 0 // Number of posts sent before loading
    , USER = window.USER
    , CHAT = window.CHAT
    , $content = $('#content')
    , $textarea = $('textarea')
    , $error = $('#error')
    , $auto = $('#auto')
    , $loadPost


  bindControls()

  // Binding all the buttons and inputs
  function bindControls() {
    $('#send').click(sendPost)
    $('#load').click(loadPosts)
    $('#auto').click(toggleInterval)
    $('#remo').click(removeChat)
    // Resetting the title
    $('#new_post').focus(function() {
      document.title = "TALK: " + CHAT.name
    })
    // Binding CTRL + ENTER
    .on('keypress', function(e) {
      e = window.event || e
      var key = e.keyCode
        , ctrl = e.ctrlKey
      if (key == 10 || (ctrl && key == 13)) {
        sendPost()
      }
    })
    loadPosts()
  }

  // Send post
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

  // Load posts
  function loadPosts() {
    if (busy) return
    busy = true
    var data = {
        last : last
      , I    : I
      }
    if (!I) $error.html('loading...')
    $loadPost = $.post(URL+"/load", data, function(data) {
      if (!data) return
      // Good response
      if (Array.isArray(data)) {
        // Cleaning the content
        if (data.length && !last) $content.html('')
        // Rendering the posts
        var i = 0
          , new_posts = 0 - sent
          , post
        sent = 0
        for (; i < data.length; i++) {
          if (post = data[i]) {
            new_posts++
            $content.append('<div class="post '+(USER.id == post.user.id ? 'you' : '')+'" name="'+post.pos+'"><div class="user" data-id="'+post.user.id+'" data-name="'+post.user.name+'">'+post.user.name+' <small class="date">'+post.date.split(' ')[4]+'</small></div><div class="post-post" data-date="'+post.date+'">'+post.post+'</div></div>')
          }
        }
        // Updating the Title
        document.title = (new_posts ? "("+new_posts+") " : "") + "TALK: " + CHAT.name
        // We're on the last post
        if (post) last = post.pos+1
        // No errors
        $error.html('')
      } else
      // Bad response
      if (data.error && data.error == 'removed') {
        window.location = "/"
      }
      busy = false
      // Resend
      if (I) setTimeout(loadPosts, 1000)
    }).error(function() {
      busy = false
      // Resend on timeout
      if (I) loadPosts()
    })
  }

  // Toggles long-polling's interval
  function toggleInterval() {
    if (I) {
      I = false
      $loadPost.abort()
      $auto.val('Auto Load')
    } else {
      I = true
      $auto.val('Stop Auto Load')
      loadPosts()
    }
  }

  // Removes the chat
  function removeChat() {
    $.get(URL+"/rm", function(data) {
      if (data == "ok") window.location = "/"
    })
  }
}
