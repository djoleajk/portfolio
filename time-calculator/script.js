let intervalTajmera;
let ciljnoVreme;

// Promena između napred/nazad
document.querySelectorAll('input[name="tipKalkulacije"]').forEach((radio) => {
	radio.addEventListener("change", function () {
		document.getElementById("unosNapred").style.display =
			this.value === "napred" ? "block" : "none";
		document.getElementById("unosNazad").style.display =
			this.value === "nazad" ? "block" : "none";
		document.getElementById("sekcijaTajmera").style.display = "none";
	});
});

function izracunajVreme() {
	const tipKalkulacije = document.querySelector(
		'input[name="tipKalkulacije"]:checked'
	).value;

	if (tipKalkulacije === "napred") {
		const pocetnoVreme = document.getElementById("pocetnoVreme").value;
		const trajanje = document.getElementById("trajanje").value;

		if (!proveriVreme(pocetnoVreme) || !proveriTrajanje(trajanje)) {
			alert(
				"Neispravan format vremena! Koristite HH:MM za vreme i h:mm za trajanje."
			);
			return;
		}

		const rezultat = izracunajNapred(pocetnoVreme, trajanje);
		document.getElementById(
			"rezultat"
		).innerHTML = `Vreme završetka: <strong>${rezultat}</strong>`;
		document.getElementById("rezultat").style.display = "block";

		// Postavi ciljno vreme za tajmer
		ciljnoVreme = new Date();
		const [sati, minuti] = rezultat.split(":").map(Number);
		ciljnoVreme.setHours(sati, minuti, 0, 0);

		// Ako je vreme prošlo, dodaj 1 dan
		if (ciljnoVreme < new Date()) {
			ciljnoVreme.setDate(ciljnoVreme.getDate() + 1);
		}

		document.getElementById("sekcijaTajmera").style.display = "block";
	} else {
		const krajnjeVreme = document.getElementById("krajnjeVreme").value;
		const trajanje = document.getElementById("trajanjeNazad").value;

		if (!proveriVreme(krajnjeVreme) || !proveriTrajanje(trajanje)) {
			alert(
				"Neispravan format vremena! Koristite HH:MM za vreme i h:mm za trajanje."
			);
			return;
		}

		const rezultat = izracunajNazad(krajnjeVreme, trajanje);
		document.getElementById(
			"rezultat"
		).innerHTML = `Početno vreme: <strong>${rezultat}</strong>`;
		document.getElementById("rezultat").style.display = "block";
		document.getElementById("sekcijaTajmera").style.display = "none";
	}
}

function izracunajNapred(pocetnoVreme, trajanje) {
	const [pocSati, pocMin] = pocetnoVreme.split(":").map(Number);
	const [trajSati, trajMin] = trajanje.split(":").map(Number);
	let ukupnoMinuta = pocSati * 60 + pocMin + trajSati * 60 + trajMin;
	const krajnjiSati = Math.floor(ukupnoMinuta / 60) % 24;
	const krajnjiMin = ukupnoMinuta % 60;
	return `${krajnjiSati.toString().padStart(2, "0")}:${krajnjiMin
		.toString()
		.padStart(2, "0")}`;
}

function izracunajNazad(krajnjeVreme, trajanje) {
	const [krajnSati, krajnMin] = krajnjeVreme.split(":").map(Number);
	const [trajSati, trajMin] = trajanje.split(":").map(Number);
	let ukupnoMinuta = krajnSati * 60 + krajnMin - (trajSati * 60 + trajMin);
	if (ukupnoMinuta < 0) ukupnoMinuta += 24 * 60;
	const pocSati = Math.floor(ukupnoMinuta / 60) % 24;
	const pocMin = ukupnoMinuta % 60;
	return `${pocSati.toString().padStart(2, "0")}:${pocMin
		.toString()
		.padStart(2, "0")}`;
}

function proveriVreme(vreme) {
	return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(vreme);
}

function proveriTrajanje(trajanje) {
	return /^\d{1,2}:\d{2}$/.test(trajanje);
}

function pokreniTajmer() {
	clearInterval(intervalTajmera);
	osveziPrikazTajmera();
	intervalTajmera = setInterval(osveziPrikazTajmera, 1000);
}

function osveziPrikazTajmera() {
	const sada = new Date();
	const razlika = ciljnoVreme - sada;

	if (razlika <= 0) {
		clearInterval(intervalTajmera);
		document.getElementById("prikazTajmera").textContent = "00:00:00";
		document.getElementById("zvukAlarma").play();
		return;
	}

	const sati = Math.floor(razlika / (1000 * 60 * 60));
	const minuti = Math.floor((razlika % (1000 * 60 * 60)) / (1000 * 60));
	const sekunde = Math.floor((razlika % (1000 * 60)) / 1000);
	document.getElementById("prikazTajmera").textContent = `${sati
		.toString()
		.padStart(2, "0")}:${minuti.toString().padStart(2, "0")}:${sekunde
		.toString()
		.padStart(2, "0")}`;
}
