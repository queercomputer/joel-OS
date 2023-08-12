const panes = document.querySelectorAll(".pane")

let z = 1

panes.forEach(pane => {
  const title = pane.querySelector('.title')
  
  pane.addEventListener("mousedown", () => {
    z = z + 1
    pane.style.zIndex = z
  })
  
  title.addEventListener('mousedown', ()  => {
    pane.classList.add('is-dragging')
    
    
  })
  
})