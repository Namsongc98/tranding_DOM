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

function formatDate(inputDate) {
  console.log(inputDate);
  var dateParts = inputDate.split("/");
  var formattedDate = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
  var day = formattedDate.getDate();
  var month = formattedDate.getMonth() + 1;
  var year = formattedDate.getFullYear();
  var formattedString =
    (day < 10 ? "0" : "") +
    day +
    "/" +
    (month < 10 ? "0" : "") +
    month +
    "/" +
    year;
  console.log(formattedString);
  return formattedString;
}

const inputDate = new Date();
const date = inputDate.getDate();
const month = inputDate.getMonth() + 1;
const year = inputDate.getFullYear();

const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${date
  .toString()
  .padStart(2, "0")}`;

const idUser = document.getElementById("idUser");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");
const completed = document.getElementById("completed");
const checkAll = document.getElementById("check-all");

startDate.value = formattedDate;
endDate.value = formattedDate;

function changedateformat(val) {
  const myArray = val.split("-");
  let year = myArray[0];
  let month = myArray[1];
  let day = myArray[2];
  let formatteddate = day + "/" + month + "/" + year;
  return formatteddate;
}

//const insbtn = document.getElementById("submit");
const updatebtn = document.getElementById("update");
const pushbtn = document.getElementById("pushGenerated");

document.addEventListener("DOMContentLoaded", () => {
  const dbRef = ref(db, "users/");
  async function getUser() {
    try {
      await onValue(dbRef, (snapshot) => {
        let listUser = ``;
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          listUser += `<tr>
                       <td><input type="checkbox" name="checkbox" id="${childKey}"  onchange="handleCheckbox(this,'${childKey}')" /></td>
                        <td>${childKey}</td>
                        <td>${childData.first_name}</td>
                        <td>${childData.last_name}</td>
                        <td>${
                          childData.start_date
                            ? childData.start_date
                            : "không có dữ liệu"
                        }</td>
                        <td>${
                          childData.end_date
                            ? childData.end_date
                            : "không có dữ liệu"
                        }</td>
                        <td> <input type="checkbox"  class="checkbox-input" ${
                          childData.completed ? "checked" : ""
                        } id="completed" /></td>
                        <td>  
                            <button  onclick="selectData('${childKey}')">select</button>
                            <button  onclick="removeUserData('${childKey}')">delete</button>
                        </td>
                    </tr>`;
        });
        document.getElementById("tablebody").innerHTML = listUser;
        const checkboxes = document.getElementsByName("checkbox");
        checkAll.addEventListener("change", () => {
          checkboxes.forEach((item) => {
            item.checked = checkAll.checked;
          });
        });
        window.handleCheckbox = (inputThis) => {

          
        };
      });
    } catch (error) {
      console.log(error);
    }
  }
  getUser();
});

// get user theo id
window.selectData = (id) => {
  const dataref = ref(db);
  get(child(dataref, "users/" + id)).then((snapshot) => {
    if (snapshot.exists()) {
      idUser.value = id;
      firstName.value = snapshot.val().first_name;
      lastName.value = snapshot.val().last_name;
    } else {
      alert("no data");
    }
  });
};
// tạo user
function writeUserData() {
  set(ref(db, "users/" + idUser.value), {
    id: idUser,
    first_name: firstName.value,
    last_name: lastName.value,
  }).catch((err) => console.log(err));
}
// tạo user auto id
function pushGenerated() {
  set(push(ref(db, "users/")), {
    first_name: firstName.value,
    last_name: lastName.value,
    start_date: changedateformat(startDate.value),
    end_date: changedateformat(endDate.value),
    completed: completed.checked,
  }).catch((err) => console.log(err));
}
// update user
const updateUserData = () => {
  update(ref(db, "users/" + idUser.value), {
    first_name: firstName.value,
    last_name: lastName.value,
    start_date: changedateformat(startDate.value),
    end_date: changedateformat(endDate.value),
    completed: completed.checked,
  }).catch((err) => console.log(err));
};
//xóa user
window.removeUserData = (id) => {
  console.log(id);
  remove(ref(db, "users/" + id)).catch((err) => console.log(err));
};

//insbtn.addEventListener("click", writeUserData);
updatebtn.addEventListener("click", updateUserData);
pushbtn.addEventListener("click", pushGenerated);
