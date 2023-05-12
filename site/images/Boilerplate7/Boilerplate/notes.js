
async function fetchData() {
    return fetch('https://api.carbonintensity.org.uk/generation')
      .then(response => response.json())
      .then(data => {

        const container = document.getElementById('data-container');
        container.innerHTML = ""; // reset the container 
        
        // data.data isn't normal, just annoying quirk of this API
        data.data.generationmix.forEach(item => {
            const element = document.createElement('p');
            element.textContent = `${item.fuel}:  ${item.perc}`;
            container.appendChild(element);
            // change this to do something more interesting!

        });

        return data;
      })
      .catch(error => {
        console.error(error);
      });
  }