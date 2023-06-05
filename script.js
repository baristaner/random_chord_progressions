document.addEventListener("DOMContentLoaded", function () {
  var akorDizisi;

  function jsonDosyasiniOku() {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open("GET", "chords.json", true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        akorDizisi = JSON.parse(xhr.responseText);
      }
    };
    xhr.send(null);
  }

  function generateChordProgression(ton, mod, includeDiminished, akorSayisi) {
    var progressionlar = [];

    var akorler;
    if (mod === "major") {
      akorler = akorDizisi[ton + "major"];
    } else if (mod === "minor") {
      akorler = akorDizisi[ton + "minor"];
    } else if (mod === "lydian") {
      akorler = akorDizisi[ton + "lydian"];
    } else if (mod === "locrian") {
      akorler = akorDizisi[ton + "locrian"];
    } else if (mod === "phrygian") {
      akorler = akorDizisi[ton + "phrygian"];
    } else if (mod === "dorian") {
      akorler = akorDizisi[ton + "dorian"];
    } else {
      console.error("Geçersiz ton veya mod seçimi.");
      return progressionlar;
    }

    if (!includeDiminished) {
      akorler = akorler.filter(function (akor) {
        return !akor.includes("dim");
      });
    }

    var progression = [];
    var previousChord = "";
    for (var i = 0; i < akorSayisi; i++) {
      var randomIndex = Math.floor(Math.random() * akorler.length);
      var randomAkor = akorler[randomIndex];

      while (randomAkor === previousChord) {
        randomIndex = Math.floor(Math.random() * akorler.length);
        randomAkor = akorler[randomIndex];
      }

      progression.push(randomAkor);
      previousChord = randomAkor;
    }

    progressionlar.push(progression.join(" - "));

    return progressionlar;
  }

  function olustur() {
    var tonSecimi = document.getElementById("tonSecimi");
    var secilenTon = tonSecimi.value;

    var modSecimi = document.getElementById("modSecimi");
    var secilenMod = modSecimi.value;

    var diminishedSecimi = document.getElementById("diminishedSecimi");
    var includeDiminished = diminishedSecimi.checked;

    var akorSayisiSecimi = document.getElementById("akorSayisiSecimi");
    var akorSayisi = parseInt(akorSayisiSecimi.value);

    var chordProgressions = generateChordProgression(
      secilenTon,
      secilenMod,
      includeDiminished,
      akorSayisi
    );

    var sonucDiv = document.getElementById("sonuc");
    var chordsScaleDiv = document.getElementById("chordsScale");
    sonucDiv.innerHTML = "";
    chordsScaleDiv.innerHTML = "";

    for (var i = 0; i < chordProgressions.length; i++) {
      var progression = chordProgressions[i];
      var p = document.createElement("p");
      p.textContent = progression;
      sonucDiv.appendChild(p);
    }

    var chordsScaleText = "Key: " + secilenTon + " " + secilenMod;
    var pChordsScale = document.createElement("p");
    var akorler = akorDizisi[secilenTon + secilenMod];
    var akorlerText = "Chords: " + akorler.join(", ");
    pChordsScale.textContent = akorlerText;
    chordsScaleDiv.appendChild(pChordsScale);
  }

  jsonDosyasiniOku();
  document.getElementById("olusturBtn").addEventListener("click", olustur);
});
