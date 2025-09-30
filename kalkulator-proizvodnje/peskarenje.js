// Ažuriranje trenutnog vremena
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('sr-RS', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
    document.getElementById('currentTime').textContent = timeString;
}

// Formatiranje vremena
function formatTime(date) {
    return date.toLocaleTimeString('sr-RS', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
}

// Formatiranje trajanja
function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}min ${secs}sek`;
    } else if (minutes > 0) {
        return `${minutes}min ${secs}sek`;
    } else {
        return `${secs}sek`;
    }
}

// Glavna kalkulacija za peskarenje (2 mine odjednom)
function calculate() {
    const timePerCycle = parseInt(document.getElementById('timePerCycle').value);
    const numberOfMines = parseInt(document.getElementById('numberOfMines').value);

    // Validacija unosa
    if (!timePerCycle || timePerCycle <= 0) {
        alert('Molimo unesite validno vreme po ciklusu!');
        return;
    }

    if (!numberOfMines || numberOfMines <= 0) {
        alert('Molimo unesite validan broj mina!');
        return;
    }

    // Kalkulacija - deli broj mina sa 2 jer se rade po 2 odjednom
    const numberOfCycles = Math.ceil(numberOfMines / 2); // Zaokruži na veći broj ako je neparan broj
    const startTime = new Date();
    const totalSeconds = timePerCycle * numberOfCycles;
    const endTime = new Date(startTime.getTime() + totalSeconds * 1000);

    // Prikaz rezultata
    document.getElementById('startTime').textContent = formatTime(startTime);
    document.getElementById('totalDuration').textContent = formatDuration(totalSeconds);
    document.getElementById('endTime').textContent = formatTime(endTime);
    document.getElementById('totalCycles').textContent = numberOfCycles + ' ciklusa';
    document.getElementById('totalMines').textContent = numberOfMines + ' mina';

    // Prikaži rezultate
    document.getElementById('results').classList.remove('hidden');
}

// Event listeners
document.getElementById('calculateBtn').addEventListener('click', calculate);

// Enter key za brži unos
document.getElementById('timePerCycle').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('numberOfMines').focus();
    }
});

document.getElementById('numberOfMines').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculate();
    }
});

// Pokreni sat
updateCurrentTime();
setInterval(updateCurrentTime, 1000);
