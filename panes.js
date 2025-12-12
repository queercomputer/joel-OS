const panes = document.querySelectorAll(".pane");
let z = 1;

// Drag + resize
panes.forEach(pane => {
  const title = pane.querySelector(".title");
  const corner = pane.querySelector(".corner");

  pane.addEventListener("mousedown", () => {
    pane.style.zIndex = ++z;
  });

  title?.addEventListener("mousedown", e => {
    const startX = e.pageX;
    const startY = e.pageY;
    const startLeft = pane.offsetLeft;
    const startTop = pane.offsetTop;

    const move = ev => {
      pane.style.left = startLeft + (ev.pageX - startX) + "px";
      pane.style.top = startTop + (ev.pageY - startY) + "px";
    };

    const stop = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", stop);
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", stop);
  });

  corner?.addEventListener("mousedown", e => {
    const startX = e.pageX;
    const startY = e.pageY;
    const startW = pane.clientWidth;
    const startH = pane.clientHeight;

    const resize = ev => {
      pane.style.width = startW + (ev.pageX - startX) + "px";
      pane.style.height = startH + (ev.pageY - startY) + "px";
    };

    const stop = () => {
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stop);
    };

    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stop);
  });
});
