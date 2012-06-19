// sadasant.com/license

window.onload = function() {

  // Global Bindings
  var W = window
    , D = document
    , URL = W.location.href
    , USER = W.USER
    , CHAT = W.CHAT
    , U // undefined

  // Chat Variables
    , last = 0
    , loop = false
    , busy = { post: false, load: false }
    , sent = 0     // Number of posts sent before loading
    , received = 0 // Number of received posts before clicking the textarea
    , confirm_remove = false

  // Areas
    , $content  = S.q('#content')
    , $textarea = S.q('textarea')
    , $error    = S.q('#error')

  // Buttons
    , $send = S.q('#send')
    , $load = S.q('#load')
    , $auto = S.q('#auto')
    , $remo = S.q('#remo')

  // XHR
    , X


  // Binding all the buttons and inputs
  ~function bindControls() {
    $send.onclick = sendPost
    $load.onclick = getPosts
    $auto.onclick = autoLoad
    $remo.onclick = removeChat
    $textarea.onfocus = resetTitle
    $textarea.onkeypress = ctrl_enter
    getPosts()
  }()

  // Send with CTRL + ENTER
  function ctrl_enter (e) {
    e = window.event || e
    var key  = e.keyCode
      , ctrl = e.ctrlKey
    if (key == 10 || (ctrl && key == 13)) {
      sendPost()
    }
  }

  // Resetting the title
  function resetTitle() {
    D.title  = "TALK: " + CHAT.name
    received = 0
  }

  // Send post
  function sendPost() {
    if (busy.post) return
    busy.post = true
    var data = {
        post : $textarea.value
      , date : new Date().toString()
      }
    $error.innerHTML = 'loading...'
    S.req('POST', URL+"/post", U, data, sentPost)
  }

  // Post is sent
  function sentPost(ok, data) {
    if (ok && data === 'ok') {
      sent++
      $textarea.value  = ''
      $error.innerHTML = ''
      if (!loop) getPosts()
    } else {
      if (data.length < 3) return
      var error = JSON.parse(data).error
      if (error) {
        $error.innerHTML = error
      }
    }
    busy.post = false
  }

  // Get posts
  function getPosts() {
    if (busy.load) return
    busy.load = true
    var data = {
        last : last
      , loop : loop
      }
    if (!loop) $error.innerHTML = 'loading...'
    if (X) X.abort()
    X = S.req('POST', URL+"/load", U, data, gotPosts)
  }

  // Got posts
  function gotPosts(ok, data) {
    // Good response
    if (ok) {
      if (!data) {
        // It timed out...
        busy.load = false
        return loop && getPosts()
      }
      data = JSON.parse(data)
      // Wong response, getting out of here
      if (data.error) return goToHome()
      // Create the posts
      if (data.length >= 0) {
        for (var post, i = 0, l = data.length; i < l; i++) {
          if (data[i]) {
            post = data[i]
            received++
            createPost(post)
          }
        }
        // Cleaning the content
        if (data.length && !last) $content.removeChild($content.lastChild)
        // Updating the Title
        received -= sent
        sent = 0
        D.title = (received ? "("+received+") " : "") + "TALK: " + CHAT.name
        if (post) last = post.pos + 1 // We're on the last post
        $error.innerHTML = ''
      }
      busy.load = false
      $error.innerHTML = ''
      // Restart?
      if (loop) getPosts()
    } else {
      // Restart?
      busy.load = false
      if (loop) setTimeout(getPosts, 1000)
    }
  }

  // Create post, used in gotPosts
  function createPost(post) {
    var html = ''
      + '<div class="post '+(USER.id == post.user.id ? 'you' : '')+'" name="'+post.position+'">'
      +   '<div class="user" data-id="'+post.user.id+'" data-name="'+post.user.name+'">'
      +     post.user.name
      +     '<small class="date">'+post.client.date.split(' ')[4]+'</small>'
      +   '</div>'
      +   '<div class="post-post" data-date="'+post.date+'">'
      +     post.post
      +   '</div>'
      + '</div>'
      , first = $content.firstChild
    if (first.insertAdjacentHTML) {
      first.insertAdjacentHTML('beforeBegin', html)
    } else {
      var range = document.createRange()
        , frag  = range.createContextualFragment(html)
      $content.insertBefore(frag, first)
    }
  }

  // Toggles long-polling
  function autoLoad() {
    busy.load = false
    if (loop) {
      loop = false
      X.abort()
      X = U
      $auto.setAttribute('value', 'Auto Load')
    } else {
      loop = true
      $auto.setAttribute('value', 'Stop Auto')
      getPosts()
    }
  }

  // Removes the chat
  function removeChat() {
    if (!confirm_remove) {
      $remo.setAttribute('value', 'Are you sure?')
      confirm_remove = true
    } else {
      S.req('GET', URL+"/rm", U, U, goToHome)
    }
  }

  // Go to Home
  function goToHome() {
    W.location = "/"
  }

}
