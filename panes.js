const panes = document.querySelectorAll(".pane");

let z = 1;

// -----------------------------
// Dragging / resizing panes
// -----------------------------
panes.forEach((pane) => {
  const title = pane.querySelector(".title");
  const corner = pane.querySelector(".corner");

  // Bring pane to front on click
  pane.addEventListener("mousedown", () => {
    z += 1;
    pane.style.zIndex = z;
  });

  // Drag pane
  if (title) {
    title.addEventListener("mousedown", (event) => {
      pane.classList.add("is-dragging");

      const startLeft = pane.offsetLeft;
      const startTop = pane.offsetTop;
      const startX = event.pageX;
      const startY = event.pageY;

      const drag = (e) => {
        e.preventDefault();
        pane.style.left = startLeft + (e.pageX - startX) + "px";
        pane.style.top = startTop + (e.pageY - startY) + "px";
      };

      const stop = () => {
        pane.classList.remove("is-dragging");
        document.removeEventListener("mousemove", drag);
        document.removeEventListener("mouseup", stop);
      };

      document.addEventListener("mousemove", drag);
      document.addEventListener("mouseup", stop);
    });
  }

  // Resize pane
  if (corner) {
    corner.addEventListener("mousedown", (event) => {
      const startWidth = pane.clientWidth;
      const startHeight = pane.clientHeight;
      const startX = event.pageX;
      const startY = event.pageY;

      const resize = (e) => {
        e.preventDefault();
        pane.style.width = startWidth + (e.pageX - startX) + "px";
        pane.style.height = startHeight + (e.pageY - startY) + "px";
      };

      const stop = () => {
        document.removeEventListener("mousemove", resize);
        document.removeEventListener("mouseup", stop);
      };

      document.addEventListener("mousemove", resize);
      document.addEventListener("mouseup", stop);
    });
  }
});

// -----------------------------
// CV Pane open / close
// -----------------------------
(() => {
  const PDF_URL = "assets/joel_humphries_cv_2025.pdf"; // <-- MATCH THE REAL FILE NAME EXACTLY

  const openBtn = document.getElementById("open-cv");
  const cvPane = document.getElementById("cv-viewer");
  const closeBtn = cvPane?.querySelector(".close");

  const pdfContainer = document.getElementById("pdf-container");
  const zoomOutBtn = document.getElementById("pdf-zoom-out");
  const zoomInBtn = document.getElementById("pdf-zoom-in");
  const zoomLabel = document.getElementById("pdf-zoom-label");

  if (!openBtn || !cvPane || !closeBtn || !pdfContainer) return;

  let pdfDoc = null;
  let zoom = 1.2;
  let rendering = false;

  function setZoomLabel() {
    if (zoomLabel) zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
  }

  function showError(msg) {
    pdfContainer.innerHTML = `<div style="color:#fff;padding:16px;font-size:14px;">${msg}</div>`;
  }

  async function loadPdfOnce() {
    if (!window.pdfjsLib) {
      throw new Error("pdfjsLib not found. Check that pdf.min.js loads before panes.js.");
    }
    if (pdfDoc) return pdfDoc;
    pdfDoc = await pdfjsLib.getDocument(PDF_URL).promise;
    return pdfDoc;
  }

  async function renderAllPages() {
    if (rendering) return;
    rendering = true;

    try {
      const doc = await loadPdfOnce();
      pdfContainer.innerHTML = "";

      for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
        const page = await doc.getPage(pageNum);
        const viewport = page.getViewport({ scale: zoom });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        pdfContainer.appendChild(canvas);
        await page.render({ canvasContext: ctx, viewport }).promise;
      }

      setZoomLabel();
    } catch (err) {
      console.error(err);
      showError(
        `Could not load CV PDF.<br><br>
         Check the file path/case: <b>${PDF_URL}</b><br>
         Then open DevTools Console for the exact error.`
      );
    } finally {
      rendering = false;
    }
  }

  function openCV() {
    z += 1;
    cvPane.style.zIndex = z;
    cvPane.classList.remove("pane-hidden");
    cvPane.classList.add("pane-visible");
    renderAllPages();
  }

  function closeCV() {
    cvPane.classList.remove("pane-visible");
    cvPane.classList.add("pane-hidden");
  }

  openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openCV();
  });

  closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeCV();
  });

  zoomOutBtn?.addEventListener("click", () => {
    zoom = Math.max(0.6, zoom - 0.1);
    renderAllPages();
  });

  zoomInBtn?.addEventListener("click", () => {
    zoom = Math.min(2.5, zoom + 0.1);
    renderAllPages();
  });

  setZoomLabel();
})();