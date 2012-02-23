var URL = window.location.href

window.onload = function() {
  bindControls()
}

function bindControls() {
  $('#send').click(sendPost)
  $('#load').click(loadPosts)
}

function sendPost() {
  var last = $('.content div').last().attr('name')*1 || 0
  var data = {
    post : $('textarea').val()
  }
  $.post(URL+"/post", data, function(data) {
    if (data && data.date) {
      $('.content').append('<div class="post" name="'+(last+1)+'"><b class="user" data-id="'+USER.id+'" data-name="'+USER.name+'">'+USER.name+'</b><span class="post-post" data-date="'+data.date+'">'+data.post+'</span></div>')
    } else {
      alert('wut???')
    }
  })
}

function loadPosts() {
  var last = $('.content div').last().attr('name')*1 || 0
    , data = {
      last : last
    }
  $.post(URL+"/load", data, function(data) {
    if (data && data.length) {
      for (var i = 0; i < data.length; i++) {
        var post = data[i]
        $('.content').append('<div class="post" name="'+(last+i+1)+'"><b class="user" data-id="'+post.user.id+'" data-name="'+post.user.name+'">'+post.user.name+'</b><span class="post-post" data-date="'+post.date+'">'+post.post+'</span></div>')
      }
    } else {
      // TODO: Error handling
    }
  })
}
