// get elements
//-----------------------------------
//-----------------------------------
let selectTags = document.querySelectorAll("select"),
  traFrom = document.querySelector("#traFrom"),
  traTo = document.querySelector("#traTo"),
  translate = document.querySelector("button"),
  exchange = document.querySelector(".exchange i"),
  soundFrom = document.querySelector(".fromControls .fa-volume-high"),
  soundTo = document.querySelector(".toControls .fa-volume-high"),
  copyFrom = document.querySelector(".fromControls .fa-copy"),
  copyTo = document.querySelector(".toControls .fa-copy");

// put languages in select tags
//-----------------------------------
//-----------------------------------
selectTags.forEach((select, i) => {
  for (const country in countries) {
    const selected =
      (i === 0 && country === "en-GB") || (i === 1 && country === "ar-SA")
        ? "selected"
        : "";
    select.insertAdjacentHTML(
      "beforeend",
      `<option value="${country}" ${selected}>${countries[country]}</option>`
    );
  }

  select.addEventListener("change", () => {
    if (i == 0 && traTo.value != "") {
      getData(traTo.value, selectTags[1].value, selectTags[0].value, "from");
    } else if (i == 1 && traFrom.value != "") {
      getData(traFrom.value, selectTags[0].value, selectTags[1].value, "to");
    }
  });
});

// get data fro API
//-----------------------------------
//-----------------------------------
async function getData(text, lang1, lang2, textArea) {
  let response = await fetch(
    `https://api.mymemory.translated.net/get?q=${text}&langpair=${lang1}|${lang2}`
  );

  let { responseData } = await response.json();
  if (textArea == "to") {
    traTo.value = responseData.translatedText;
  } else {
    traFrom.value = responseData.translatedText;
  }
}

// Add functionality to translate button
//-----------------------------------
//-----------------------------------
traFrom.addEventListener("keyup", (e) => {
  if (e.target.value != "") {
    getData(traFrom.value, selectTags[0].value, selectTags[1].value, "to");
  } else {
    traTo.value = traFrom.value;
  }
});

// Add functionality to exchange button
//-----------------------------------
//-----------------------------------
exchange.addEventListener("click", () => {
  const tempInput = traFrom.value;
  traFrom.value = traTo.value;
  traTo.value = tempInput;

  const tempSelect = selectTags[0].value;
  selectTags[0].value = selectTags[1].value;
  selectTags[1].value = tempSelect;
});

// Add functionality to sound icons
//-----------------------------------
//-----------------------------------
[soundFrom, soundTo].forEach((soundIcon, i) => {
  soundIcon.addEventListener("click", () => {
    let utterance;
    if (i == 0) {
      utterance = new SpeechSynthesisUtterance(traFrom.value);
      utterance.lang = selectTags[i].value;
    } else {
      utterance = new SpeechSynthesisUtterance(traTo.value);
      utterance.lang = selectTags[i].value;
    }
    speechSynthesis.speak(utterance);
  });
});

// Add functionality to copy icons
//-----------------------------------
//-----------------------------------
[copyFrom, copyTo].forEach((copyIcon, i) => {
  copyIcon.addEventListener("click", () => {
    if (i == 0) {
      navigator.clipboard.writeText(traFrom.value);
    } else {
      navigator.clipboard.writeText(traTo.value);
    }
  });
});
