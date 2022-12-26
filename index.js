document.addEventListener("DOMContentLoaded", () => {
  function levenshtein(a, b) {
    let m = a.length;
    let n = b.length;
    let d = new Array(m + 1);
    for (let i = 0; i <= m; i++) {
      d[i] = new Array(n + 1);
      d[i][0] = i;
    }
    for (let j = 0; j <= n; j++) {
      d[0][j] = j;
    }
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        let cost = a[i - 1] === b[j - 1] ? 0 : 1;
        d[i][j] = Math.min(
          d[i - 1][j] + 1,
          d[i][j - 1] + 1,
          d[i - 1][j - 1] + cost
        );
      }
    }
    return d[m][n];
  }

  // The JavaScript to handle the search and filtering
  const searchBar = document.querySelector("#search-bar");
  const contentDiv = document.querySelector("#tool-scroll");

  searchBar.addEventListener("input", () => {
    const searchString = searchBar.value,
      articles = contentDiv.querySelectorAll("article");

    for (const article of articles) {
      const header = article.querySelector("header"),
        img = header.querySelector("img"),
        alt = img.alt;

      if (
        searchString.length > 0 &&
        levenshtein(
          searchString.toLowerCase(),
          alt.toLowerCase().slice(0, searchString.length - 1)
        ) > 3
      ) {
        article.style.opacity = "0%";
        function nullArt() {
          article.style.display = "none";
          article.removeEventListener("transitionend", nullArt);
        }
        article.addEventListener("transitionend", nullArt);
      } else {
        article.style.opacity = "100%";
        article.style.display = "inline-block";
      }
    }
  });

  roboguru.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        if (!window.location.hostname.includes("ruangguru")) {
          alert("Doesn't look like you're on a ruangguru page!");
          return;
        }
        let lockNotice = document.body.getElementsByClassName("css-1c77zrq"),
          answer = document.body.getElementsByClassName("css-zmelcr");
        if (lockNotice[0]) lockNotice[0].remove();
        [0].attributes;
        if (answer[0])
          answer[0].setAttribute(
            "style",
            "overflow: scroll; max-height: 50vh;"
          );
      },
    });
  });

  zenius.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        if (!window.location.hostname.includes("zenius")) {
          alert("Doesn't look like you're on a zenius page!");
          return;
        }
        document.body.style.removeProperty("overflow");
        let allWeirdStuff =
          document.body.getElementsByClassName("MuiDialog-root");
        Array.from(allWeirdStuff).forEach((e) => e.remove());
      },
    });
  });
});
