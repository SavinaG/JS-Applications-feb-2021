function solve() {
    const baseUrl = 'http://localhost:3030/jsonstore/bus/schedule/';
    let currentStopId = 'depot';
    let currentStop = '';

    function loadStop(data) {
        currentStop = data;
        document.querySelector('span.info').textContent = `Next stop ${currentStop.name}`;
        currentStopId = currentStop.next;

        document.getElementById('depart').setAttribute('disabled', 'true');
        document.getElementById('arrive').disabled = false;
    }

    function depart() {
        const url = baseUrl + currentStopId

        fetch(url)
            .then(request => request.json()) 
            .then((data) => loadStop(data))
            .catch(console.error);
    }

    function arrive() {
        document.querySelector('span.info').textContent = `Arriving at ${currentStop.name}`;
        currentStopId = currentStop.next;

        document.getElementById('depart').disabled = false;
        document.getElementById('arrive').disabled = true;
    }

    return {
        depart,
        arrive
    };
}

let result = solve();