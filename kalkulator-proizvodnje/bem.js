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
    const timePerPiece = parseInt(document.getElementById('timePerPiece').value);
    const numberOfPieces = parseInt(document.getElementById('numberOfPieces').value);
    const startTimeInput = document.getElementById('startTimeInput').value;

    if (!timePerPiece || timePerPiece <= 0) {
        alert('Molimo unesite validno vreme po komadu!');
        return;
    }

    if (!numberOfPieces || numberOfPieces <= 0) {
        alert('Molimo unesite validan broj komada!');
        return;
    }

    let startTime;
    if (startTimeInput) {
        startTime = createDateFromTime(startTimeInput);
    } else {
        startTime = new Date();
    }

    const totalSeconds = timePerPiece * numberOfPieces;
    const endTime = new Date(startTime.getTime() + totalSeconds * 1000);

    document.getElementById('startTime').textContent = formatTime(startTime);
    document.getElementById('totalDuration').textContent = formatDuration(totalSeconds);
    document.getElementById('endTime').textContent = formatTime(endTime);
    document.getElementById('totalPieces').textContent = numberOfPieces + ' kom';

    document.getElementById('results').classList.remove('hidden');
}

document.getElementById('calculateBtn').addEventListener('click', calculate);

document.getElementById('timePerPiece').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('numberOfPieces').focus();
    }
});

document.getElementById('numberOfPieces').addEventListener('keypress', function(e) {
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