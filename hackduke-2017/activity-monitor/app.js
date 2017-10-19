const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

let window = null

// Wait until the app is ready
app.once('ready', () => {
  // Create a new window
  window = new BrowserWindow({
    width: 500, // Set the initial width to 500px
    height: 400, // Set the initial height to 400px
    titleBarStyle: 'hidden-inset', // set the title bar style
    backgroundColor: "#111", // set the background color to black
    show: false // Don't show the window until it's ready
  })

  // load url into the window
  window.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  window.once('ready-to-show', () => window.show())
})
