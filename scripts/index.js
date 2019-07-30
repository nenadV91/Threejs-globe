const app = new App({ setup, animate, preload });

window.onload = app.init;
window.onresize = app.handleResize;

const controls = {}


async function preload() {
  try {
    
  } catch(error) {
    console.log(error)
  }
}

async function setup(app) {
  app.addControlGui(gui => {})
}

function animate(app) {
  
}
