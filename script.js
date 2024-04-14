import { getCurrentTab } from "./logic.js"

// Elements of the extension
const $toggler = document.querySelector('.toggler') // Toggler button element
const $img = document.querySelector('img') // Logo image element
let isApplied = null // Blocker is active

verifyItsYT() // Verify if hostname of current tab is www.youtube.com
injectScript(blockerIsApplied) // Set isApplied to set the html (Extension)

async function verifyItsYT() {
  const tab = await getCurrentTab()

  const tabUrl = new URL(tab.url)

  // If not youtube.com disables toggler button (Extension)
  if (tabUrl.hostname != 'www.youtube.com'){
    $img.classList.add('grayscale')
    $toggler.setAttribute('disabled', true)
    document.querySelector('h3').innerHTML = 'Go to Youtube to block Shorts Recomendations'
  }
}

function update () {
  // Updates the button and the image when isApplied Changes (Extension)
  $toggler.innerHTML = isApplied ? 'Unblock' : 'Block'
  $img.setAttribute('src', isApplied ? './images/icon-48.png' : './images/icon-48-alt.png')
}

// When onClick toggle the blocker
$toggler.addEventListener("click", ()  => injectScript(toggleShortBlocker))

function toggleShortBlocker() {
  // Toggle the class whit the remover style from body of youtube tab
  // And return true or false if body has the class or not, used to set isApplied var
  const body = document.querySelector('body')
  body.classList.toggle('shortTerminator')
  return body.classList.contains('shortTerminator')
}

function blockerIsApplied() {
  // Return true or false if body has the class or not, used to set isApplied var
  const body = document.querySelector('body')
  return body.classList.contains('shortTerminator')
}

async function injectScript (func) {
  const tab = await getCurrentTab() // Current tab

  const scriptInjection = {
    func, // The script you want inject
    target: {tabId: tab.id} // Current tab ID
  }

  chrome.scripting.executeScript(scriptInjection, r => {
    isApplied = r[0].result // set isApplied true or false
    update() // Updates the html of the extension
  })
}