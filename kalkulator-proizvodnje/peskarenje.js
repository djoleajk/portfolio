function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('sr-RS', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
    document.getElementById('currentTime').textContent = timeString;
}

function formatTime(date) {
    return date.toLocaleTimeString('sr-RS', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
}

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

function createDateFromTime(timeString) {
    const now = new Date();
    const [hours, minutes] = timeString.split(':');
    const customDate = new Date(now);
    customDate.setHours(parseInt(hours, 10));
    customDate.setMinutes(parseInt(minutes, 10));
    customDate.setSeconds(0);
    customDate.setMilliseconds(0);
    
    return customDate;
}

function calculate() {
    const timePerCycle = parseInt(document.getElementById('timePerCycle').value);
    const numberOfMines = parseInt(document.getElementById('numberOfMines').value);
    const startTimeInput = document.getElementById('startTimeInput').value;

    if (!timePerCycle || timePerCycle <= 0) {
        alert('Molimo unesite validno vreme po ciklusu!');
        return;
    }

    if (!numberOfMines || numberOfMines <= 0) {
        alert('Molimo unesite validan broj mina!');
        return;
    }

    let startTime;
    if (startTimeInput) {
        startTime = createDateFromTime(startTimeInput);
    } else {
        startTime = new Date();
    }

    const numberOfCycles = Math.ceil(numberOfMines / 2);
    const totalSeconds = timePerCycle * numberOfCycles;
    const endTime = new Date(startTime.getTime() + totalSeconds * 1000);

    document.getElementById('startTime').textContent = formatTime(startTime);
    document.getElementById('totalDuration').textContent = formatDuration(totalSeconds);
    document.getElementById('endTime').textContent = formatTime(endTime);
    document.getElementById('totalCycles').textContent = numberOfCycles + ' ciklusa';
    document.getElementById('totalMines').textContent = numberOfMines + ' mina';

    document.getElementById('results').classList.remove('hidden');
}

document.getElementById('calculateBtn').addEventListener('click', calculate);

document.getElementById('timePerCycle').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('numberOfMines').focus();
    }
});

document.getElementById('numberOfMines').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('startTimeInput').focus();
    }
});

document.getElementById('startTimeInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculate();
    }
});

updateCurrentTime();
setInterval(updateCurrentTime, 1000);