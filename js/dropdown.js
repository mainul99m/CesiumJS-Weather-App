export function createSelectPlace(options, parentElementId){
    const parentElement  = document.getElementById(parentElementId);
    const selectElement  = document.createElement("select");

    selectElement.className = "cesium-button";
    selectElement.id = "dropdown";

    options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        selectElement.appendChild(optionElement);
    });

    parentElement.appendChild(selectElement);
    return selectElement;
 }