async function getInfo() {
    let input = document.getElementById('stopId');
    let id = input.value;

    let url = `http://localhost:3030/jsonstore/bus/businfo/${id}`;

    try {
        let ulElement = document.getElementById('buses');
        ulElement.innerHTML = ' ';

        let response = await fetch(url);
        let data = await response.json();

        document.getElementById('stopName').textContent = data.name;

        Object.entries(data.buses).map(([bus, time]) => {
            let result = document.createElement('li');
            result.textContent = `Bus ${bus} arrives in ${time}`

            ulElement.appendChild(result);
        });
        input.value = '';
    } catch {
        document.getElementById('stopName').textContent = 'Error';
    }
}