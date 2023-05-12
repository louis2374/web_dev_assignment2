const container = document.getElementById('data-container');

let apiData = {};

async function fetchData() {
    return fetch('https://api.carbonintensity.org.uk/generation')
        .then(response => response.json())
        .then(data => {
            console.log(data);

            // data.data isn't normal, just annoying quirk of this AP
            apiData = data.data;

            container.innerHTML = ""; // reset the container

            apiData.generationmix.forEach(item => {
                const element = document.createElement('p');
                element.textContent =
                    `${item.fuel}:  ${item.perc}%`;
                container.appendChild(element);
                // change this to do something more interesting!

            });

            return data;
        })
        .catch(error => {
            console.error(error);
        });
}