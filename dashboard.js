// dashboard.js
// Import the functions you need from the SDKs you need
import { getDatabase, ref, update, get, set } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

// Assuming db is defined globally
const db = getDatabase();
let UserCreds = JSON.parse(sessionStorage.getItem('user-creds'));
let UserInfo = JSON.parse(sessionStorage.getItem('user-info'));

let msgHead = document.getElementById('msg');
let greetHead = document.getElementById('greet');
let signoutButton = document.getElementById('signoutbutton');

greetHead.innerText = `Welcome ${UserInfo.firstname}`;
msgHead.innerText = `logged in with ${UserCreds.email}`;

function Signout() {
    sessionStorage.removeItem('user-creds');
    sessionStorage.removeItem('user-info');
    window.location.href = "login.html";
}

function chkCreds() {
    if (!sessionStorage.getItem('user-creds')) {
        window.location.href = "login.html";
    }
}

// function buyItem(item) {
//     const currentUserUid = UserCreds.uid;
//     const itemRef = ref(db, `items/${item}/owners/${currentUserUid}`);

//     // Check if the user already owns the item
//     get(itemRef)
//         .then((snapshot) => {
//             if (!snapshot.exists() || !snapshot.val()) {
//                 // If the user doesn't own the item, proceed with the purchase
//                 set(itemRef, true);

//                 const buyButton = document.getElementById(`buy${item}`);
//                 if (buyButton) {
//                     buyButton.innerText = "Owned";
//                     buyButton.disabled = true;
//                 }

//                 console.log(`${item} purchased by ${UserInfo.firstname}`);
//             } else {
//                 // User already owns the item, handle accordingly (optional)
//                 console.log(`${UserInfo.firstname} already owns ${item}`);
//             }
//         })
//         .catch((error) => {
//             console.error("Error checking ownership:", error.message);
//         });
// }
function buyItem(item) {
    const currentUserUid = UserCreds.uid;
    const itemRef = ref(db, `items/${item}/owners/${currentUserUid}`);

    // Check if the user already owns the item
    get(itemRef)
        .then((snapshot) => {
            if (!snapshot.exists() || !snapshot.val()) {
                // If the user doesn't own the item, proceed with the purchase
                set(itemRef, true)
                    .then(() => {
                        const buyButton = document.getElementById(`buy${item}`);
                        if (buyButton) {
                            buyButton.innerText = "Owned";
                            buyButton.disabled = true;
                        }
                        console.log(`${item} purchased by ${UserInfo.firstname}`);
                    })
                    .catch((error) => {
                        console.error("Error updating ownership:", error.message);
                    });
            } else {
                // User already owns the item, handle accordingly (optional)
                console.log(`${UserInfo.firstname} already owns ${item}`);
            }
        })
        .catch((error) => {
            console.error("Error checking ownership:", error.message);
        });
}


//////////////////////////////////////////////
function checkOwnershipAndUpdateButton(item) {
    const currentUserUid = UserCreds.uid;
    const itemRef = ref(db, `items/${item}/owners/${currentUserUid}`);

    get(itemRef)
        .then((snapshot) => {
            if (snapshot.exists() && snapshot.val()) {
                updateBuyButton(item);
            }
        })
        .catch((error) => {
            console.error("Error checking ownership:", error.message);
        });
}

// Rest of your existing code...

function updateBuyButton(item) {
    const buyButton = document.getElementById(`buy${item}`);
    if (buyButton) {
        buyButton.innerText = "Owned";
        buyButton.disabled = true;
    }
}


//////////////////////////////////////////



// window.addEventListener('load', chkCreds);
window.addEventListener('load', () => {
    chkCreds();

    // Add event listeners for buy buttons
    const buyEarlyBirdButton = document.getElementById('buyearlybird');
    if (buyEarlyBirdButton) {
        buyEarlyBirdButton.addEventListener('click', () => buyItem('earlybird'));
        checkOwnershipAndUpdateButton('earlybird');

    }

    const buyNightOwlButton = document.getElementById('buynightowl');
    if (buyNightOwlButton) {
        buyNightOwlButton.addEventListener('click', () => buyItem('nightowl'));
        checkOwnershipAndUpdateButton('nightowl');
    }

    const buyEngineerButton = document.getElementById('buyengineer');
    if (buyEngineerButton) {
        buyEngineerButton.addEventListener('click', () => buyItem('engineer'));
        checkOwnershipAndUpdateButton('engineer');
    }
});
signoutButton.addEventListener('click', Signout);
