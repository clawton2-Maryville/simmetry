const newPlanButton = document.getElementById("newPlanBtn");
const floorPlan = document.getElementById("floorPlan");

newPlanButton.addEventListener("click", function () {

    const confirmNewPlan = confirm(
        "Start a new floor plan? This will clear the current plan."
    );

    if (confirmNewPlan) {
        floorPlan.innerHTML = "";
    }

});
