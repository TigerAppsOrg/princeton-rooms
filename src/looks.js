export function dialog() {
  // brief instructions
  const dialog = document.querySelector("dialog");
  const closeButton = document.querySelector("dialog button");
  const fileInput = document.getElementById("file-input");

  // "Ok" button closes the dialog
  closeButton.addEventListener("click", () => {
    dialog.close();
  });

  // Close the dialog if file upload clicked
  fileInput.addEventListener("click", (event) => {
    dialog.close();
  });

  // hide output initially output initially
  document.getElementById("output").style.display = "none";
}

// remove site banner
export function fadeBanner() {
  let banner = document.getElementById("banner");
  if (banner) {
    banner.classList.add("opacity-0");
    setTimeout(function () {
      banner.remove();
    }, 500);
  }
}

// clear output
export function clearTableOutput() {
  const table = document.getElementById("table-div");
  table.innerHTML = `<span class="loading loading-infinity loading-lg text-warning"></span>`;
}

// clear output
export function clearStatsOutput() {
  const stats = document.getElementById("stats-div");
  stats.innerHTML = `<span class="loading loading-infinity loading-lg text-warning"></span>`;
}

// remove space evenly for main justify-evenly
export function removeSpacing() {
  document.getElementsByTagName("main")[0].classList.remove("justify-evenly");
}

// show table etc
export function showOutput() {
  document.getElementById("output").style.display = "flex";
}
