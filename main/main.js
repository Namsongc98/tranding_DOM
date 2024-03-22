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
  query,
  orderByChild,
  startAt,
  endAt,
  limitToFirst,
  orderByKey,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";

import {
  getMessaging,
  getToken,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging.js";

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
const messaging = getMessaging();

getToken(messaging, { vapidKey: 'AIzaSyBLyi67O-AUbdXZK1wdM0F5Vvi_couK6u0' }).then((currentToken) => {
  if (currentToken) {
    console.log(currentToken)
  } else {
    console.log('No registration token available. Request permission to generate one.');
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
});

const inputDate = new Date();
const date = inputDate.getDate();
const month = inputDate.getMonth() + 1;
const year = inputDate.getFullYear();

const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${date
  .toString()
  .padStart(2, "0")}`;
// form data user
const idUser = document.getElementById("idUser");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");
const completed = document.getElementById("completed");
startDate.value = formattedDate;
endDate.value = formattedDate;

// data checkbox
const checkAll = document.getElementById("check-all");

// data input search
const inputSearch = document.getElementById("search");
const btnSearch = document.getElementById("search-btn");

// data page current
const reqPerPage = document.getElementById("req_per_page");
let lastKey = null;

// format date push realtime
function changedateformat(val) {
  const myArray = val.split("-");
  const year = myArray[0];
  const month = myArray[1];
  const day = myArray[2];
  const formatteddate = day + "/" + month + "/" + year;
  return formatteddate;
}

// format date  defaut input
function changedateformatdefault(val) {
  if (!val) return formattedDate;
  const myArray = val.split("/");
  const year = myArray[2];
  const month = myArray[1];
  const day = myArray[0];
  const formatteddate = year + "-" + month + "-" + day;
  return formatteddate;
}
// get data btn
//const insbtn = document.getElementById("submit");
const updatebtn = document.getElementById("update");
const pushbtn = document.getElementById("pushGenerated");

// render data
document.addEventListener("DOMContentLoaded", () => {
  const dbRef = ref(db, "users/");
  async function getUser() {
    try {
      await onValue(
        query(dbRef, orderByKey(), limitToFirst(+reqPerPage.value)),
        (snapshot) => {
          return renderListUser(snapshot);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  getUser();
});
// hàm render
const renderListUser = (snapshot) => {
  let listUser = ``;
  snapshot.forEach((childSnapshot) => {
    const childKey = childSnapshot.key;
    const childData = childSnapshot.val();
    lastKey = childKey;
    listUser += `<tr>
                       <td><input type="checkbox" name="checkbox"  onchange="handleCheckbox()" /></td>
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
  window.handleCheckbox = () => {
    const checkboxesArray = [...checkboxes];
    const isCheck =
      checkboxes.length ===
      checkboxesArray.filter((input) => input.checked === true).length;
    checkAll.checked = isCheck;
  };
};

// get user theo id
window.selectData = async (id) => {
  const dataref = ref(db);
  get(child(dataref, "users/" + id)).then((snapshot) => {
    if (snapshot.exists()) {
      idUser.value = id;
      firstName.value = snapshot.val().first_name;
      lastName.value = snapshot.val().last_name;
      startDate.value = changedateformatdefault(snapshot.val().start_date);
      endDate.value = changedateformatdefault(snapshot.val().end_date);
      completed.checked = snapshot.val().completed;
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
pushbtn.addEventListener("click", pushGenerated);
function pushGenerated() {
  set(push(ref(db, "users/")), {
    first_name: firstName.value,
    last_name: lastName.value,
    start_date: changedateformat(startDate.value),
    end_date: changedateformat(endDate.value),
    completed: completed.checked,
  })
    .then(() => alert("tạo thành công"))
    .catch((err) => alert(err));
}
// update user
updatebtn.addEventListener("click", updateUserData);
function updateUserData() {
  update(ref(db, "users/" + idUser.value), {
    first_name: firstName.value,
    last_name: lastName.value,
    start_date: changedateformat(startDate.value),
    end_date: changedateformat(endDate.value),
    completed: completed.checked,
  }).catch((err) => alert(err));
}
//xóa user
window.removeUserData = (id) => {
  console.log(id);
  remove(ref(db, "users/" + id)).catch((err) => alert(err));
};

// tìm kiếm
btnSearch.addEventListener("click", searchData);
function searchData() {
  const dbRef = ref(db, "users/");
  onValue(
    query(
      dbRef,
      orderByChild("first_name"),
      startAt(`${inputSearch.value}`),
      endAt(inputSearch.value + "\uf8ff")
    ),
    (snapshot) => {
      renderListUser(snapshot);
    }
  );
}

// change page
const prevPage = document.getElementById("previousPage");
const nextPage = document.getElementById("nextPage");
const currenPage = document.getElementById("currenPage");
currenPage.innerText = 1;

prevPage.addEventListener("click", handlePrevPage);
nextPage.addEventListener("click", handleNextPage);

// previous page
async function handlePrevPage() {
  if (currenPage.innerText > 1) {
    currenPage.innerText--;
    const dbRef = ref(db, "users/");
    await onValue(
      query(
        dbRef,
        orderByKey(),
        limitToFirst(+reqPerPage.value),
        endAt(lastKey)
      ),
      (snapshot) => {
        renderListUser(snapshot);
      }
    );
  }
}
// next page 
async function handleNextPage() {
  currenPage.innerText++;
  const dbRef = ref(db, "users/");
  await onValue(
    query(
      dbRef,
      orderByKey(),
      limitToFirst(+reqPerPage.value),
      startAt(lastKey)
    ),
    (snapshot) => {
      renderListUser(snapshot);
    }
  );
}
// listen select option pagination
reqPerPage.addEventListener("change", async () => {
  const dbRef = ref(db, "users/");
  await onValue(
    query(dbRef, orderByKey(), limitToFirst(+reqPerPage.value)),
    (snapshot) => {
      renderListUser(snapshot);
    }
  );
});

//insbtn.addEventListener("click", writeUserData);


