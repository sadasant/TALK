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
    loadPosts()
  }

  function sendPost() {
    var data = {
      post : $('textarea').val()
    , date : new Date().toString()
    }
    $.post(URL+"/post", data, function(data) {
      if (data === 'ok') {
        clearInterval(I)
        $('textarea').attr('value','')
        loadPosts()
        I = setInterval(loadPosts, 3000)
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
          $('.content').append('<div class="post '+(USER.id == post.user.id ? 'you' : '')+'" name="'+(last+i+1)+'"><div class="user" data-id="'+post.user.id+'" data-name="'+post.user.name+'">'+post.user.name+' <small class="date">'+(new Date(post.date)).toString().split(' ')[4]+'</small></div><div class="post-post" data-date="'+post.date+'">'+post.post+'</div></div>')
        }
        last += i+1
      } else {
        window.location = "/"
      }
    })
  }

  function toggleInterval() {
    if (I) {
      $('#auto').attr('value','Auto Load')
      clearInterval(I)
    } else {
      loadPosts()
      I = setInterval(loadPosts, 3000)
      $('#auto').attr('value','Stop Auto Load')
    }
  }

  function removeChat() {
    $.get(URL+"/remo", function(data) {
      if (data == "ok") window.location = "/"
    })
  }

}
