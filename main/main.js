import {
  getDatabase,
  ref,
  set,
  child,
  get,
  update,
  remove,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
const firebaseConfig = {
  apiKey: "AIzaSyBLyi67O-AUbdXZK1wdM0F5Vvi_couK6u0",
  authDomain: "projectdemo-ad6dd.firebaseapp.com",
  projectId: "projectdemo-ad6dd",
  storageBucket: "projectdemo-ad6dd.appspot.com",
  messagingSenderId: "859784439972",
  appId: "1:859784439972:web:3eca7a2b5a7c32f6c85e31",
  measurementId: "G-ZPNCNV4YQN",
};
const app = initializeApp(firebaseConfig);
const db = getDatabase();

const idUser = document.getElementById("idUser");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");

const insbtn = document.getElementById("submit");
const secbtn = document.getElementById("select");
const pushbtn = document.getElementById("pushGenerated");

const dbRef = ref(db, "users/");
function logData() {
  console.log(123);
}
$(document).ready(function() {
  logData()
})

function getUser() {
  let listUser = "";
  try {
    onValue(dbRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        listUser += `<tr>
                      <td><input type="checkbox" /></td>
                      <td>${childKey}</td>
                      <td>${childData.first_name}</td>
                      <td>${childData.last_name}</td>
                      <td>  
                      <button id="add"  onclick="console.log(1233)">add</button>
                      <button id="update"  onclick="updateUserData(${childKey})">update</button>
                      <button id="remove"  onclick="removeUserData(${childKey})">delete</button>
                      </td>
                    </tr>`;
      });
      document.getElementById("tablebody").innerHTML = listUser;
    });
  } catch (error) {
    console.log(error);
  }
}
getUser();


const updateUserData = (id) => {
  console.log("id", id);
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  update(ref(db, "users/" + id), {
    first_name: firstName,
    last_name: lastName,
  }).catch((err) => console.log(err));
};

function writeUserData() {
  set(ref(db, "users/" + idUser.value), {
    id: idUser,
    first_name: firstName.value,
    last_name: lastName.value,
  }).catch((err) => console.log(err));
}

function selectData() {
  const dataref = ref(db);
  get(child(dataref, "users/" + idUser.value)).then((snapshot) => {
    if (snapshot.exists()) {
      firstName.value = snapshot.val().first_name;
      lastName.value = snapshot.val().last_name;
    } else {
      alert("no data");
    }
  });
}

function pushGenerated() {
  set(push(ref(db, "users/")), {
    first_name: firstName.value,
    last_name: lastName.value,
  }).catch((err) => console.log(err));
}

function removeUserData(id) {
  remove(ref(db, "users/" + id)).catch((err) => console.log(err));
}

insbtn.addEventListener("click", writeUserData);
secbtn.addEventListener("click", selectData);
pushbtn.addEventListener("click", pushGenerated);






