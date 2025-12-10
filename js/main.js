var modal = document.getElementById("modal");

var contactNameInput = document.getElementById("contactNameInput");

var contactNumberInput = document.getElementById("contactNumberInput");

var contactEmailInput = document.getElementById("contactEmailInput");

var contactAddressInput = document.getElementById("contactAddressInput");

var contactGroupInput = document.getElementById("contactGroupInput");

var contactFavoriteInput = document.getElementById("contactFavoriteInput");

var contactEmergencyInput = document.getElementById("contactEmergencyInput");

var contactNoteInput = document.getElementById("contactNoteInput");

var totalcontact = document.getElementById("totalcontact");

var favcontact = document.getElementById("favcontact");

var emarcontact = document.getElementById("emarcontact");

var SearchInput = document.getElementById("Search");

var rowAdd = document.getElementById("rowAdd");

var currentEditIndex = null;

var contactList = [];

if (localStorage.getItem(`contactList`) !== null) {
  contactList = JSON.parse(localStorage.getItem(`contactList`));
  displayContacts();
  displayFavorites();
  displayEmergency();
}

document.querySelector(".open-modal").addEventListener("click", function () {
  modal.style.display = "flex";
});

document.querySelector(".close-btn").addEventListener("click", function () {
  modal.style.display = "none";
});

document.querySelector(".cancel-btn").addEventListener("click", function () {
  modal.style.display = "none";
});

document.querySelector(".save-btn").addEventListener("click", function () {
  if (!vaildation()) {
    return;
  }
  var number = contactNumberInput.value.trim();
  var exists = contactList.some((c) => c.number === number);

  if (exists) {
    Swal.fire({
      title: "Duplicate Number!",
      text: "This number already exists in your contacts.",
      icon: "warning",
    });
    return;
  }
  addContacts();
  displayContacts();
  modal.style.display = "none";
});

document.querySelector(".edit-btn").addEventListener("click", function (e) {
  e.preventDefault();
  if (!vaildation()) return;

  var number = contactNumberInput.value;
  var exists = contactList.some(
    (c, idx) => c.number === number && idx !== currentEditIndex
  );

  if (exists) {
    Swal.fire({
      title: "Duplicate Number!",
      text: "This number already exists in your contacts.",
      icon: "warning",
    });
    return;
  }

  saveContact();

  displayContacts();
  displayFavorites();
  displayEmergency();
  updateCounters();

  modal.style.display = "none";
});

function searchContacts() {
  var term = SearchInput.value.toLowerCase();
  var filteredContacts = contactList.filter((contact) =>
    contact.name.toLowerCase().includes(term)
  );

  if (filteredContacts.length > 0) {
    document.getElementById("noData").style.display = "none";
  } else {
    document.getElementById("noData").style.display = "block";
  }

  var box = ``;

  for (var i = 0; i < filteredContacts.length; i++) {
    var words = filteredContacts[i].name.split(" ");
    var initials = words
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join("");

    var emailHTML = filteredContacts[i].Email
      ? `<div class="d-flex align-items-center mb-2">
                <i class="fa-solid fa-envelope me-2 envelopeicon"></i>
                <span class="f-14px text-gray-500">${filteredContacts[i].Email}</span>
            </div>`
      : ``;

    var addressHTML = filteredContacts[i].Address
      ? `<div class="d-flex align-items-center">
                <i class="fa-solid fa-location-dot me-2 locationicon"></i>
                <span class="f-14px text-gray-500">${filteredContacts[i].Address}</span>
            </div>`
      : ``;

    var groupHTML = filteredContacts[i].Group
      ? `<p class="spangroup m-0 mt-3">${filteredContacts[i].Group}</p>`
      : ``;

    var starBadge = filteredContacts[i].Favorite
      ? `<span class="badge star"><i class="fa-solid fa-star"></i></span>`
      : "";
    var heartBadge = filteredContacts[i].Emergency
      ? `<span class="badge heart"><i class="fa-solid fa-heart-pulse"></i></span>`
      : "";

    box += `
        <div class="col mb-3">
            <div class="bg-white rounded-4 shadow-sm overflow-hidden">
                <div class="px-3 pt-3 pb-2">
                    <div class="d-flex align-items-center gap-3 mb-3">
                        <div class="position-relative">
                            <p class="m-0 fs-5 firstcharctar">${initials}</p>
                            <div class="contact-box">
                                ${starBadge}
                                ${heartBadge}
                            </div>
                        </div>
                        <div>
                            <p class="m-1 fw-bold">${
                              filteredContacts[i].name
                            }</p>
                            <div class="d-flex align-items-center">
                                <i class="fa-solid fa-phone me-2 phoneicon"></i>
                                <p class="m-0 f-14px text-gray-500">${
                                  filteredContacts[i].number
                                }</p>
                            </div>
                        </div>
                    </div>

                    ${emailHTML}
                    ${addressHTML}
                    ${groupHTML}
                </div>

                <div class="p-3 d-flex justify-content-between bg-icons">
                    <div class="d-flex align-items-center g-3">
                        <a href="tel:${filteredContacts[i].number}">
                            <i class="fa-solid fa-phone me-2 phoneicon2"></i>
                        </a>
                        ${
                          filteredContacts[i].Email
                            ? `<a href="mailto:${filteredContacts[i].Email}">
                            <i class="fa-solid fa-envelope envelopeicon2"></i>
                            </a>`
                            : ``
                        }
                    </div>

                    <div class="d-flex align-items-center gap-2">
                        <i onclick="toggleFavorite(${i})" class="fa-regular fa-star ${
      filteredContacts[i].Favorite ? "text-warning fa-solid" : "text-gray-400"
    } iconrighthover"></i>
                        <i onclick="toggleEmergency(${i})" class="fa-regular ${
      filteredContacts[i].Emergency
        ? "text-danger fa-solid fa-heart-pulse"
        : "text-gray-400 fa-heart"
    } iconrighthover2"></i>

                        <i class="fa-solid fa-pen text-gray-400 iconrighthover3"></i>
                        <i onclick="deletElment(${i})" class="fa-solid fa-trash text-gray-400 iconrighthover4"></i>
                    </div>
                </div>
            </div>
        </div>
        `;
  }

  rowAdd.innerHTML = box;
  totalcontact.innerHTML = contactList.length;
}

function addContacts() {
  var Contacts = {
    name: contactNameInput.value,
    number: contactNumberInput.value,
    Email: contactEmailInput.value,
    Address: contactAddressInput.value,
    Group: contactGroupInput.value,
    Favorite: contactFavoriteInput.checked,
    Emergency: contactEmergencyInput.checked,
  };

  contactList.push(Contacts);

  localStorage.setItem(`contactList`, JSON.stringify(contactList));

  reamoveForm();

  displayContacts();
  displayFavorites();
  displayEmergency();
  updateCounters();

  Swal.fire({
    title: "Added",
    text: "Contact has been added successfully.",
    icon: "success",
  });

  console.log(contactList);
}

function reamoveForm() {
  contactNameInput.value = "";
  contactNumberInput.value = "";
  contactEmailInput.value = "";
  contactAddressInput.value = "";
  contactGroupInput.value = "";
  contactNoteInput.value = "";
  contactFavoriteInput.checked = false;
  contactEmergencyInput.checked = false;
}

function vaildation() {
  var namePattern = /^[a-zA-Z\u0600-\u06FF\s]{2,50}$/;

  var numberPattern = /^(\+20|0020|20)?0?1[0125][0-9]{8}$/;

  if (!namePattern.test(contactNameInput.value)) {
    Swal.fire({
      title: "Missing Name",
      text: "Please enter a name for the contact!",
      icon: "error",
    });
    return false;
  }

  if (!numberPattern.test(contactNumberInput.value)) {
    Swal.fire({
      title: "Missing Number",
      text: "Please enter a Number for the contact!",
      icon: "error",
    });
    return false;
  }
  return true;
}

function displayContacts() {
  if (contactList.length > 0) {
    document.getElementById("noData").style.display = "none";
  } else {
    document.getElementById("noData").style.display = "block";
  }

  var box = ``;

  for (var i = 0; i < contactList.length; i++) {
    var words = contactList[i].name.split(" ");
    var initials = words
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join("");

    var emailHTML = contactList[i].Email
      ? `<div class="d-flex align-items-center mb-2">
                <i class="fa-solid fa-envelope me-2 envelopeicon"></i>
                <span class="f-14px text-gray-500">${contactList[i].Email}</span>
            </div>`
      : ``;

    var addressHTML = contactList[i].Address
      ? `<div class="d-flex align-items-center">
                <i class="fa-solid fa-location-dot me-2 locationicon"></i>
                <span class="f-14px text-gray-500">${contactList[i].Address}</span>
            </div>`
      : ``;

    var groupHTML = contactList[i].Group
      ? `<p class="spangroup m-0 mt-3">${contactList[i].Group}</p>`
      : ``;

    var starBadge = contactList[i].Favorite
      ? `<span class="badge star"><i class="fa-solid fa-star"></i></span>`
      : "";
    var heartBadge = contactList[i].Emergency
      ? `<span class="badge heart"><i class="fa-solid fa-heart-pulse"></i></span>`
      : "";

    box += `
        <div class="col mb-3">
            <div class="bg-white rounded-4 shadow-sm overflow-hidden">
                <div class="px-3 pt-3 pb-2">
                    <div class="d-flex align-items-center gap-3 mb-3">
                        <div class="position-relative">
                            <p class="m-0 fs-5 firstcharctar">${initials}</p>
                            <div class="contact-box">
                                ${starBadge}
                                ${heartBadge}
                            </div>

                        </div>
                        <div>
                            <p class="m-1 fw-bold">${contactList[i].name}</p>
                            <div class="d-flex align-items-center">
                                <i class="fa-solid fa-phone me-2 phoneicon"></i>
                                <p class="m-0 f-14px text-gray-500">${
                                  contactList[i].number
                                }</p>
                            </div>
                        </div>
                    </div>

                    ${emailHTML}
                    ${addressHTML}
                    ${groupHTML}

                </div>

                <div class="p-3 d-flex justify-content-between bg-icons">
                    <div class="d-flex align-items-center g-3">
                        <a href="tel:${contactList[i].number}">
                            <i class="fa-solid fa-phone me-2 phoneicon2"></i>
                        </a>
                        ${
                          contactList[i].Email
                            ? `<a href="mailto:${contactList[i].Email}">
                                <i class="fa-solid fa-envelope envelopeicon2"></i>
                            </a>`
                            : ``
                        }
                    </div>

                    <div class="d-flex align-items-center gap-2">
                        <i onclick="toggleFavorite(${i})" class="fa-regular fa-star ${
      contactList[i].Favorite ? "text-warning fa-solid " : "text-gray-400"
    } iconrighthover"></i>
                        <i onclick="toggleEmergency(${i})" class="fa-regular  ${
      contactList[i].Emergency
        ? "text-danger fa-solid fa-heart-pulse"
        : "text-gray-400 fa-heart"
    } iconrighthover2"></i>

                        <i onclick="editContact(${i})" class="fa-solid fa-pen text-gray-400 iconrighthover3"></i>
                        <i onclick="deletElment(${i})" class="fa-solid fa-trash text-gray-400 iconrighthover4"></i>
                    </div>
                </div>
            </div>
        </div>
        `;
  }

  rowAdd.innerHTML = box;
  totalcontact.innerHTML = contactList.length;
}

function updateCounters() {
  var favCount = contactList.filter((c) => c.Favorite === true).length;
  favcontact.innerHTML = favCount;

  var emarCount = contactList.filter((c) => c.Emergency === true).length;
  emarcontact.innerHTML = emarCount;
}

function editContact(index) {
  modal.style.display = "flex";
  contactNameInput.value = contactList[index].name;
  contactNumberInput.value = contactList[index].number;
  contactEmailInput.value = contactList[index].Email;
  contactAddressInput.value = contactList[index].Address;
  contactGroupInput.value = contactList[index].Group;
  contactFavoriteInput.checked = contactList[index].Favorite;
  contactEmergencyInput.checked = contactList[index].Emergency;

  currentEditIndex = index;

  document.querySelector(".save-btn").style.display = "none";
  document.querySelector(".edit-btn").style.display = "block";
}

function saveContact() {
  let newContact = {
    name: contactNameInput.value,
    number: contactNumberInput.value,
    Email: contactEmailInput.value,
    Address: contactAddressInput.value,
    Group: contactGroupInput.value,
    Favorite: contactFavoriteInput.checked,
    Emergency: contactEmergencyInput.checked,
  };

  if (currentEditIndex !== null) {
    contactList[currentEditIndex] = newContact;
    currentEditIndex = null; 
  } else {

    contactList.push(newContact);
  }

  localStorage.setItem("ContactList", JSON.stringify(contactList));
  displayContacts();
  modal.style.display = "none";
    Swal.fire({
    title: "Updated!",
    text: "Contact has been updated successfully.",
    icon: "success",
  });
}

function displayFavorites() {
  var fav = contactList.filter((c) => c.Favorite === true);

  var favBox = document.getElementById("favoritesArea");

  if (fav.length === 0) {
    favBox.innerHTML = `
        <div class="p-2 text-center">
            <p class="f-14px p-32px m-0 text-gray-400">No favorites yet</p>
        </div>`;
    return;
  }

  var html = "";

  for (var i = 0; i < fav.length; i++) {
    html += `
        <div class="p-2 mt-2">
            <div class="d-flex align-items-center justify-content-between bg-green rounded-3 p-2">
                <div class="d-flex align-items-center">
                    <p class="fisrstcharctrfavourite m-0 me-2">
                        ${fav[i].name.charAt(0).toUpperCase()}
                    </p>
                    <div>
                        <span class="f-14px fw-medium">${fav[i].name}</span>
                        <p class="m-0 f-12px text-gray-400">${fav[i].number}</p>
                    </div>
                </div>

                <div>
                    <a href="tel:${fav[i].number}">
                        <i class="fa-solid fa-phone me-2 phoneicon2"></i>
                    </a>
                </div>
            </div>
        </div>`;
  }

  favBox.innerHTML = html;
}

function displayEmergency() {
  var emer = contactList.filter((c) => c.Emergency === true); // جلب كل اللي emergency = true
  var box = ``;

  if (emer.length === 0) {
    box += `
            <div class="p-2 text-center">
                <p class="f-14px p-32px m-0 text-gray-400">No emergency contacts yet</p>
            </div>`;
  } else {
    for (var i = 0; i < emer.length; i++) {
      box += `
                <div class="p-2 mt-2">
                    <div class="d-flex align-items-center justify-content-between bg-red rounded-3 p-2">
                        <div class="d-flex align-items-center">
                            <p class="fisrstcharctrfavourite m-0 me-2">
                                ${emer[i].name[0].toUpperCase()}
                            </p>
                            <div>
                                <span class="f-14px fw-medium">${
                                  emer[i].name
                                }</span>
                                <p class="m-0 f-12px text-gray-400">${
                                  emer[i].number
                                }</p>
                            </div>
                        </div>
                        <div>
                            <a href="tel:${emer[i].number}">
                                <i class="fa-solid fa-phone me-2 phoneicon2"></i>
                            </a>
                        </div>
                    </div>
                </div>`;
    }
  }
  document.getElementById("emergencyArea").innerHTML = box;
}

function deletElment(index) {
  Swal.fire({
    title: "Delete Contact?",
    text: `Are you sure you want to delete ${contactList[index].name}? This action cannot be undone.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DC2626",
    cancelButtonColor: "#606773",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      const deletedContact = contactList[index];

      contactList.splice(index, 1);
      localStorage.setItem("contactList", JSON.stringify(contactList));

      displayContacts();
      displayFavorites();
      displayEmergency();
      updateCounters();

      Swal.fire({
        title: "Deleted!",
        text: "Your contact has been deleted.",
        icon: "success",
      });
    }
  });
}

function toggleFavorite(index) {
  contactList[index].Favorite = !contactList[index].Favorite;

  localStorage.setItem("contactList", JSON.stringify(contactList));

  displayContacts();
  displayFavorites();
  updateCounters();
}

function toggleEmergency(index) {

  contactList[index].Emergency = !contactList[index].Emergency;

  localStorage.setItem("contactList", JSON.stringify(contactList));

  displayContacts();
  displayEmergency();
  updateCounters();
}
