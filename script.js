// =====================================================
// SIMMETRY
// Floor Plan Builder
// Sprint 3
// =====================================================


// =====================================================
// GET HTML ELEMENTS
// =====================================================

const floorPlan = document.getElementById("floorPlan");

const roomButtons = document.querySelectorAll("[data-room]");

const newPlanBtn = document.getElementById("newPlanBtn");
const saveBtn = document.getElementById("saveBtn");
const exportBtn = document.getElementById("exportBtn");

const roomNameInput = document.getElementById("roomName");
const roomWidthInput = document.getElementById("roomWidth");
const roomHeightInput = document.getElementById("roomHeight");
const roomAreaDisplay = document.getElementById("roomArea");

const updateRoomBtn = document.getElementById("updateRoomBtn");
const deleteRoomBtn = document.getElementById("deleteRoomBtn");

const roomCountDisplay = document.getElementById("roomCount");
const totalAreaDisplay = document.getElementById("totalArea");


// =====================================================
// ROOM DATA
// =====================================================

// This array stores all rooms currently on the floor plan.

let rooms = [
    {
        id: 1,
        name: "Living Room",
        width: 12,
        height: 14,
        x: 30,
        y: 30
    }
];

let nextRoomId = 2;

let selectedRoomId = null;


// =====================================================
// DEFAULT ROOM SIZES
// =====================================================

const roomSizes = {

    "Living Room": {
        width: 12,
        height: 14
    },

    "Kitchen": {
        width: 10,
        height: 12
    },

    "Bedroom": {
        width: 10,
        height: 10
    },

    "Bathroom": {
        width: 8,
        height: 8
    }

};


// =====================================================
// DISPLAY ROOMS
// =====================================================

function displayRooms() {

    // Clear the floor plan before redrawing rooms.
    floorPlan.innerHTML = "";

    rooms.forEach(function (room) {

        const roomElement = document.createElement("div");

        roomElement.classList.add("room");

        // Store room ID in the HTML element.
        roomElement.dataset.id = room.id;

        // Display room information.
        roomElement.innerHTML = `
            <strong>${room.name}</strong>
            <span>${room.width}' × ${room.height}'</span>
        `;


        // -------------------------------------------------
        // ROOM SIZE
        // -------------------------------------------------

        // Convert room dimensions into pixels.
        // This is only a visual representation.

        roomElement.style.width =
            (room.width * 10) + "px";

        roomElement.style.height =
            (room.height * 10) + "px";


        // -------------------------------------------------
        // SPRINT 3 - ROOM POSITION
        // -------------------------------------------------

        // Position comes directly from the room object.
        // This prevents rooms from bouncing back.

        roomElement.style.left =
            room.x + "px";

        roomElement.style.top =
            room.y + "px";


        // -------------------------------------------------
        // SELECTED ROOM
        // -------------------------------------------------

        if (room.id === selectedRoomId) {
            roomElement.classList.add("selected");
        }


        // -------------------------------------------------
        // SELECT ROOM
        // -------------------------------------------------

        roomElement.addEventListener("click", function () {

            selectRoom(room.id);

        });


        floorPlan.appendChild(roomElement);

    });


    updateSummary();

}


// =====================================================
// ADD ROOM
// =====================================================

function addRoom(roomType) {

    const defaultSize = roomSizes[roomType];

    if (!defaultSize) {
        return;
    }


    // Offset rooms so new rooms don't completely overlap.

    const newPosition =
        30 + (rooms.length * 35);


    const newRoom = {

        id: nextRoomId,

        name: roomType,

        width: defaultSize.width,

        height: defaultSize.height,

        // Sprint 3 position data

        x: newPosition,

        y: newPosition

    };


    rooms.push(newRoom);

    nextRoomId++;

    selectedRoomId = newRoom.id;

    displayRooms();

    loadSelectedRoom();

}


// =====================================================
// ROOM BUTTONS
// =====================================================

roomButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const roomType =
            button.dataset.room;

        addRoom(roomType);

    });

});


// =====================================================
// SELECT ROOM
// =====================================================

function selectRoom(roomId) {

    selectedRoomId = roomId;

    displayRooms();

    loadSelectedRoom();

}


// =====================================================
// LOAD SELECTED ROOM INTO PROPERTIES PANEL
// =====================================================

function loadSelectedRoom() {

    const room = rooms.find(function (room) {

        return room.id === selectedRoomId;

    });


    if (!room) {

        roomNameInput.value = "";

        roomWidthInput.value = "";

        roomHeightInput.value = "";

        roomAreaDisplay.textContent = "0";

        return;

    }


    roomNameInput.value =
        room.name;

    roomWidthInput.value =
        room.width;

    roomHeightInput.value =
        room.height;
    
    roomAreaDisplay.textContent =
    room.width * room.height;

}

// =====================================================
// LIVE ROOM AREA CALCULATION
// Updates square footage when width or height changes
// =====================================================

function updateRoomAreaPreview() {

    const width =
        parseFloat(roomWidthInput.value) || 0;

    const height =
        parseFloat(roomHeightInput.value) || 0;

    const area =
        width * height;

    roomAreaDisplay.textContent = area;
}


roomWidthInput.addEventListener(
    "input",
    updateRoomAreaPreview
);

roomHeightInput.addEventListener(
    "input",
    updateRoomAreaPreview
);

// =====================================================
// UPDATE ROOM
// Allows the selected room's name and size to be edited
// =====================================================

if (updateRoomBtn) {

    updateRoomBtn.addEventListener("click", function () {

        // Find the room that is currently selected
        const selectedRoom = rooms.find(function (room) {
            return room.id === selectedRoomId;
        });

        // Make sure a room is selected
        if (!selectedRoom) {
            alert("Please select a room first.");
            return;
        }

        // Get the values from the Properties panel
        const newName = roomNameInput.value.trim();
        const newWidth = parseFloat(roomWidthInput.value);
        const newHeight = parseFloat(roomHeightInput.value);

        // Make sure the values are valid
        if (
            newName === "" ||
            isNaN(newWidth) ||
            isNaN(newHeight) ||
            newWidth <= 0 ||
            newHeight <= 0
        ) {
            alert("Please enter a valid room name, width, and height.");
            return;
        }

        // Update the room data
        selectedRoom.name = newName;
        selectedRoom.width = newWidth;
        selectedRoom.height = newHeight;

        // IMPORTANT:
        // We do NOT change selectedRoom.x or selectedRoom.y.
        // This allows the room to resize without moving back.

        displayRooms();

        // Reload the information into the Properties panel
        loadSelectedRoom();
    });

}


// =====================================================
// DELETE ROOM
// =====================================================

if (deleteRoomBtn) {

    deleteRoomBtn.addEventListener("click", function () {

        if (selectedRoomId === null) {

            alert("Please select a room first.");

            return;

        }


        rooms = rooms.filter(function (room) {

            return room.id !== selectedRoomId;

        });


        selectedRoomId = null;


        roomNameInput.value = "";

        roomWidthInput.value = "";

        roomHeightInput.value = "";


        displayRooms();

    });

}


// =====================================================
// SPRINT 3
// DRAG AND DROP ROOMS
// =====================================================

let draggedRoom = null;

let draggedRoomData = null;

let dragOffsetX = 0;

let dragOffsetY = 0;


// -----------------------------------------------------
// START DRAG
// -----------------------------------------------------

floorPlan.addEventListener(
    "mousedown",
    function (event) {

        const roomElement =
            event.target.closest(".room");


        if (!roomElement) {
            return;
        }


        event.preventDefault();


        const roomId =
            Number(roomElement.dataset.id);


        draggedRoomData =
            rooms.find(function (room) {

                return room.id === roomId;

            });


        if (!draggedRoomData) {
            return;
        }


        // Select the room without redrawing the canvas.

        selectedRoomId =
            roomId;


        draggedRoom =
            roomElement;


        const roomRect =
            roomElement.getBoundingClientRect();


        dragOffsetX =
            event.clientX - roomRect.left;

        dragOffsetY =
            event.clientY - roomRect.top;


        draggedRoom.classList.add("selected");

        draggedRoom.style.cursor =
            "grabbing";


        // Load room properties without calling displayRooms().
        // Calling displayRooms() here would recreate the room
        // while we're trying to drag it.

        roomNameInput.value =
            draggedRoomData.name;

        roomWidthInput.value =
            draggedRoomData.width;

        roomHeightInput.value =
            draggedRoomData.height;

    }
);


// -----------------------------------------------------
// MOVE ROOM
// -----------------------------------------------------

document.addEventListener(
    "mousemove",
    function (event) {

        if (
            !draggedRoom ||
            !draggedRoomData
        ) {

            return;

        }


        const floorRect =
            floorPlan.getBoundingClientRect();


        let newX =
            event.clientX -
            floorRect.left -
            dragOffsetX;


        let newY =
            event.clientY -
            floorRect.top -
            dragOffsetY;


        // ---------------------------------------------
        // KEEP ROOM INSIDE GRID
        // ---------------------------------------------

        const maxX =
            floorPlan.clientWidth -
            draggedRoom.offsetWidth;


        const maxY =
            floorPlan.clientHeight -
            draggedRoom.offsetHeight;


        newX =
            Math.max(
                0,
                Math.min(newX, maxX)
            );


        newY =
            Math.max(
                0,
                Math.min(newY, maxY)
            );


        // ---------------------------------------------
        // MOVE ROOM VISUALLY
        // ---------------------------------------------

        draggedRoom.style.left =
            newX + "px";

        draggedRoom.style.top =
            newY + "px";


        // ---------------------------------------------
        // IMPORTANT:
        // UPDATE ROOM DATA WHILE DRAGGING
        // ---------------------------------------------

        draggedRoomData.x =
            newX;

        draggedRoomData.y =
            newY;

    }
);


// -----------------------------------------------------
// STOP DRAG
// -----------------------------------------------------

document.addEventListener(
    "mouseup",
    function () {

        if (!draggedRoom) {
            return;
        }


        draggedRoom.style.cursor =
            "grab";


        // The X/Y position is already stored in the
        // rooms array, so the room will stay here.

        draggedRoom = null;

        draggedRoomData = null;

    }
);


// =====================================================
// ROOM SUMMARY
// =====================================================

// =====================================================
// UPDATE FLOOR PLAN SUMMARY
// Calculates rooms and total house square footage
// =====================================================

function updateSummary() {

    // Number of rooms currently on the floor plan
    const roomCount = rooms.length;

    // Calculate total square footage
    let totalArea = 0;

    rooms.forEach(function (room) {

        const roomArea =
            Number(room.width) * Number(room.height);

        totalArea += roomArea;
    });


    // Update room count
    if (roomCountDisplay) {
        roomCountDisplay.textContent = roomCount;
    }


    // Update total house area
    if (totalAreaDisplay) {
        totalAreaDisplay.textContent = totalArea;
    }
}


// =====================================================
// NEW PLAN
// =====================================================

if (newPlanBtn) {

    newPlanBtn.addEventListener(
        "click",
        function () {

            const confirmNewPlan =
                confirm(
                    "Start a new plan? This will remove all rooms."
                );


            if (!confirmNewPlan) {
                return;
            }


            rooms = [];

            selectedRoomId = null;

            nextRoomId = 1;


            roomNameInput.value = "";

            roomWidthInput.value = "";

            roomHeightInput.value = "";


            displayRooms();

        }
    );

}


// =====================================================
// SAVE BUTTON
// Sprint 3 preparation
// =====================================================

if (saveBtn) {

    saveBtn.addEventListener(
        "click",
        function () {

            alert(
                "Save functionality will be added next."
            );

        }
    );

}


// =====================================================
// EXPORT BUTTON
// =====================================================

if (exportBtn) {

    exportBtn.addEventListener(
        "click",
        function () {

            alert(
                "Export functionality will be added in a future update."
            );

        }
    );

}


// =====================================================
// INITIAL PAGE LOAD
// =====================================================

displayRooms();
