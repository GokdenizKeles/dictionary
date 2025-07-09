const inputSearch = document.querySelector(".search-bar");
const contentArea = document.querySelector(".content");
const footerArea = document.querySelector(".footer-area");
const switchButton = document.querySelector(".switch");

const audioElement = document.createElement("audio");
audioElement.classList.add("hidden");
document.body.appendChild(audioElement);

async function getFetch() {
  const dictionaryData = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${inputSearch.value}`).then((res) => res.json());
  contentArea.innerHTML = "";
  for (const data of dictionaryData) {
    contentArea.innerHTML += `
      <div class="search-area">
        <div>
          <h2>${data.word}</h2>
          <span>${data.phonetic || "No phonetic available"}</span>
        </div>
        <div class="run">
          <button class="run-btn"><img src="assets/images/run-icon.svg"></button>
        </div>
      </div>
      `;
    for (const meaning of data.meanings) {
      contentArea.innerHTML += `
          <h6>${meaning.partOfSpeech}</h6>
          <ul>Meaning</ul>
        `;
      for (const definition of meaning.definitions) {
        contentArea.innerHTML += `<li>${definition.definition}</li>`;

        if (definition.example) {
          contentArea.innerHTML += `<p>“${definition.example}”</p>`;
        }
      }
      if (meaning.synonyms && meaning.synonyms.length > 0) {
        contentArea.innerHTML += `<div class="weird-area"><span>Synonyms:</span>`;
        for (const synonym of meaning.synonyms) {
          contentArea.innerHTML += `<a class="synonyms-btn">${synonym}</a>, </div>`;
        }

        for (const url of data.sourceUrls) {
          footerArea.innerHTML = `
            <h5>Source</h5> 
            <a href="${url}">${url}</a>`;
        }
      }
    }

    setupRunButtons(data.phonetics);
    setupSynonymButtons();
    break;
  }
}


function setupRunButtons(phonetics) {
  const runBtns = contentArea.querySelectorAll(".run-btn");
  runBtns.forEach((btn, index) => {
    btn.addEventListener("click", function () {
      const phonetic = phonetics[index];
      if (phonetic && phonetic.audio) {
        audioElement.src = phonetic.audio;
        audioElement.play().catch((error) => {
          console.error("Ses çalma hatası:", error);
        });
      } else {
        console.log("Bu butona bağlı bir ses dosyası yok.");
      }
    });
  });
}


function setupSynonymButtons() {
  const anchorBtns = contentArea.querySelectorAll(".synonyms-btn");
  anchorBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      inputSearch.value = btn.innerText;
      getFetch();
      console.log("Eş anlamlıya tıklandı");
    });
  });
}

function getFormData() {
  formId.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("Form gönderildi");
    getFetch();
    inputSearch.value = "";
  });
}

getFormData();

function changeFont() {
  const fontSelect = document.getElementById("fontSelect");
  fontSelect.addEventListener("change", function () {
    const selectedOption = fontSelect.options[fontSelect.selectedIndex];
    const font = selectedOption.getAttribute("data-font");
    document.body.style.fontFamily = font;
  });
}

changeFont();

function switchTheme() {
  switchButton.addEventListener("click", function () {
    document.querySelector("body").classList.toggle("dark-mode");
  });
}

switchTheme();
