var h = require('virtual-dom/h')
var mainLoop = require('main-loop')
var Delegator = require('dom-delegator')
var isEmail = require('is-email')
var getFormData = require('get-form-data')
var xhr = require('xhr')

var state = {
  validEmail: true,
  email: '',
  loading: false
}

Delegator()

function submitEmail (ev) {
  ev.preventDefault()
  var data = getFormData(document.querySelector('.email-form'))
  if (!isEmail(data.email)) {
    state.validEmail = false
  } else {
    state.email = data.email
    state.validEmail = true
    console.log(state)
    saveEmail()
  }
  loop.update(state)
}

function saveEmail () {
  state.loading = true
  loop.update(state)
  xhr({
    method: 'POST',
    data: JSON.stringify({email: state.email}),
    uri: 'http://localhost:3200/save',
    headers: {
      'Content-Type': 'application/json'
    }
  }, function (err, resp) {
    if (err) {
      window.alert(err)
    }

    state.loading = false
    loop.update(state)
  })
}

function render () {
  return h('div', {
    style: {
      textAlign: 'center',
      width: '100%',
      paddingTop: '24px'
    }
  }, [
    h('h2', {
      style: {
        'fontFamily': 'Open Sans, sans-serif'
      }
    }, 'Email Collector'),
    h('form', {
      className: 'email-form',
      'ev-submit': submitEmail
    }, [
      h('input', {
        type: 'email',
        name: 'email',
        placeholder: 'Add Email',
        className: 'add-email',
        style: {
          borderColor: state.validEmail ? '#DDD' : 'red',
          padding: '16px',
          borderStyle: 'solid',
          marginRight: '4px',
          borderRadius: '4px',
          borderWidth: '1px',
          outline: 'none',
          fontSize: '18px'
        }
      }),
      h('button', {
        type: 'button',
        'ev-click': submitEmail,
        style: {
          padding: '16px',
          cursor: 'pointer',
          outline: 'none',
          border: '1px solid #DDD',
          backgroundColor: 'white',
          borderRadius: '4px',
          fontSize: '18px'
        }
      }, 'Submit')
    ]),
    h('small', {
      style: {
        display: state.validEmail ? 'none' : 'block',
        color: 'red',
        fontFamily: 'Open Sans, sans-serif'
      }
    }, 'Invalid Email'),
    h('div', {
      style: {
        display: state.loading ? 'block' : 'none',
        position: 'absolute',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
        backgroundColor: 'rgba(0,0,0,.8)'
      }
    }, [
      h('i', {
        className: 'ion-loading-d',
        style: {
          fontSize: '70px',
          top: '200px',
          color: 'white',
          position: 'relative'
        }
      })
    ])
  ])
}

var loop = mainLoop(state, render, {
  create: require('virtual-dom/create-element'),
  diff: require('virtual-dom/diff'),
  patch: require('virtual-dom/patch')
})

document.body.appendChild(loop.target)
