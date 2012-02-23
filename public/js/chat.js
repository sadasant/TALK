// TALK / public / js / chat.js
// By Daniel R. (sadasant.com)
// License: http://opensource.org/licenses/mit-license.php

window.onload = function() {

  var last = 0
    , URL = window.location.href
    , I

  bindControls()

  function bindControls() {
    $('#send').click(sendPost)
    $('#load').click(loadPosts)
    $('#auto').click(toggleInterval)
    $('#remo').click(removeChat)
  }

  function sendPost() {
    last = $('.content .post').last().attr('name')*1 || 0
    var data = {
      post : $('textarea').val()
    }
    $.post(URL+"/post", data, function(data) {
      if (data && data.date) {
        $('.content').append('<div class="post you" name="'+(++last)+'"><b class="user" data-id="'+USER.id+'" data-name="'+USER.name+'">'+USER.name+'</b><span class="post-post" data-date="'+data.date+'">'+data.post+'</span></div>')
        $('textarea').attr('value','')
      } else {
        if (data.error == "removed") window.location = "/"
      }
    })
  }

  function loadPosts() {
    last = $('.content .post').last().attr('name')*1 || 0
    var data = {
        last : last
      }
    $.post(URL+"/load", data, function(data) {
      if (data && (data[0] === undefined || data[0].user)) {
        var i = 0
        for (; i < data.length; i++) {
          var post = data[i]
          $('.content').append('<div class="post '+(USER.id == post.user.id ? 'you' : '')+'" name="'+(last+i+1)+'"><b class="user" data-id="'+post.user.id+'" data-name="'+post.user.name+'">'+post.user.name+'</b><span class="post-post" data-date="'+post.date+'">'+post.post+'</span></div>')
        }
        last += i+1
      } else {
        window.location = "/"
      }
    })
  }

  function toggleInterval() {
    if (I) clearInterval(I)
    else {
      loadPosts()
      I = setInterval(loadPosts, 5000)
    }
  }

  function removeChat() {
    $.get(URL+"/remo", function(data) {
      if (data == "ok") window.location = "/"
    })
  }

}
