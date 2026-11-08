var totalCountContainer = document.getElementById("totalCount");
var favoriteCountContainer = document.getElementById("favoriteCount");
var emergencyCountCoutainer = document.getElementById("emergencyCount");

var addContactDialogButton = document.getElementById("addContact");

var searchInput = document.getElementById("searchInput");
var contactList = document.getElementById("contactList");
var emptyState = document.getElementById("emptyState");
var favoriteList = document.getElementById("favoritesList");
var emergencyList = document.getElementById("emergencyList");

var contactModal = document.getElementById("exampleModal");
var modalTitle = document.getElementById("exampleModalLabel");
var cancelContact = document.getElementById("cancelContact");
var contactForm = document.getElementById("contactForm");

var photoInput = document.getElementById("contactPhoto");

var contactNameInput = document.getElementById("contactName");
var contactPhoneInput = document.getElementById("contactPhone");
var contactEmailInput = document.getElementById("contactEmail");
var contactAddressInput = document.getElementById("contactAddress");
var contactGroupInput = document.getElementById("contactGroup");
var contactNotesInput = document.getElementById("contactNotes");
var contactFavoriteInput = document.getElementById("contactFavorite");
var contactEmergencyInput = document.getElementById("contactEmergency");

var createContactButton = document.getElementById("createContactbutton");
var UpdateContactButton = document.getElementById("UpdateContactbutton");

var contacts = JSON.parse(localStorage.getItem("contacts")) || [];

displayContacts(contacts);

var idToUpdate = null;

// ربط البحث بالإنبوت عشان يشتغل تلقائي وأنتي بتكتبي
if (searchInput) {
    searchInput.addEventListener("input", search);
}

// Helpers
function getContactBYId(id) {
    var index = -1;
    for (var i = 0; i < contacts.length; i++) {
        if (contacts[i].id == id) {
            index = i;
            break;
        }
    }
    return index;
}

function openModal() {
    addContactDialogButton.click();
}

function closeModalFunction() {
    cancelContact.click();
    createContactButton.classList.remove("d-none");
    UpdateContactButton.classList.add("d-none");
}

function saveContacts() {
    localStorage.setItem("contacts", JSON.stringify(contacts));
}

function clearInputs() {
    contactNameInput.value = "";
    contactPhoneInput.value = "";
    contactEmailInput.value = "";
    contactAddressInput.value = "";
    contactGroupInput.value = "";
    contactNotesInput.value = "";
    contactFavoriteInput.checked = false;
    contactEmergencyInput.checked = false;
}

function displayContacts(arr = contacts) {
    var contactsHTML = "";
    totalCountContainer.innerHTML = arr.length;
    var favCount = 0;
    var emCount = 0;
    
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].isFav) {
            favCount++;
        }
        if (arr[i].isEmergency) {
            emCount++;
        }
    }
    favoriteCountContainer.innerHTML = favCount;
    emergencyCountCoutainer.innerHTML = emCount;

    if (arr.length == 0) {
        emptyState.classList.remove("d-none");
    } else {
        emptyState.classList.add("d-none");
    }

    for (var i = 0; i < arr.length; i++) {
        contactsHTML += `
        <div class="col-sm-6">
            <article class="contact-card d-flex flex-column" data-contact-id="${arr[i].id}">

                <div class="contact-body flex-grow-1">

                    <div class="d-flex align-items-start gap-3">

                        <div class="avatar-wrapper">

                            <span class="contact-avatar">
                                ${arr[i].name.substring(0, 2).toUpperCase()}
                            </span>

                            ${arr[i].isFav == true ? `
                            <span class="avatar-badge favorite-badge">
                                <i class="fa-solid fa-star"></i>
                            </span>` : ""}

                            ${arr[i].isEmergency == true ? `
                            <span class="avatar-badge emergency-badge">
                                <i class="fa-solid fa-heart-pulse"></i>
                            </span>` : ""}

                        </div>

                        <div class="contact-heading">

                            <h3>${arr[i].name}</h3>

                            <p class="contact-phone">
                                <span class="detail-icon phone-icon">
                                    <i class="fa-solid fa-phone"></i>
                                </span>
                                <span>${arr[i].phone}</span>
                            </p>

                        </div>

                    </div>

                    <div class="contact-details">

                        <p class="contact-detail">
                            <span class="detail-icon email-icon">
                                <i class="fa-solid fa-envelope"></i>
                            </span>
                            <span>${arr[i].email}</span>
                        </p>

                        <p class="contact-detail">
                            <span class="detail-icon address-icon">
                                <i class="fa-solid fa-location-dot"></i>
                            </span>
                            <span>${arr[i].address}</span>
                        </p>

                    </div>

                    <div class="contact-tags d-flex flex-wrap gap-2">

                        <span class="contact-tag group-tag">
                            ${arr[i].group}
                        </span>

                        ${arr[i].isEmergency == true ? `
                        <span class="contact-tag emergency-tag">
                            <i class="fa-solid fa-heart-pulse ms-1"></i>
                            Emergency
                        </span>` : ""}

                    </div>

                </div>

                <div class="contact-actions d-flex justify-content-between gap-2">

                    <div class="d-flex gap-2">

                        <a href="tel:${arr[i].phone}" class="icon-button call-button" title="Call">
                            <i class="fa-solid fa-phone"></i>
                        </a>

                        <a href="mailto:${arr[i].email}" class="icon-button email-button" title="Email">
                            <i class="fa-solid fa-envelope"></i>
                        </a>

                    </div>

                    <div class="d-flex gap-2">

                        <button type="button" class="icon-button favorite-button ${arr[i].isFav ? "favorite-active" : ""}" 
                        onclick="togglefav(${arr[i].id})"
                        aria-pressed="${arr[i].isFav}">
                            <i class="fa-solid fa-star"></i>
                        </button>

                        <button type="button" class="icon-button emergency-button ${arr[i].isEmergency ? "emergency-active" : ""}" 
                         onclick="toggleEm(${arr[i].id})"
                        aria-pressed="${arr[i].isEmergency}">
                            <i class="fa-solid fa-heart-pulse"></i>
                        </button>

                        <button type="button" class="icon-button edit-button"
                           onclick="openEditDialog(${arr[i].id})"
                        >
                            <i class="fa-solid fa-pen"></i>
                        </button>

                        <button type="button" class="icon-button delete-button"
                          onclick="deleteContact(${arr[i].id})"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>

                </div>

            </article>
        </div>
        `;
    }

    contactList.innerHTML = contactsHTML;
}



function validateNameInput() {
    if (/^[A-Za-z ]{3,}$/gm.test(contactNameInput.value)) {
        console.log("True");
        contactNameInput.classList.remove("is-invalid");
        return true;
    } else {
        contactNameInput.classList.add("is-invalid");
        return false;
    }
}

function validatePhoneInput() {
    if (/^01[0125][0-9]{8}$/gm.test(contactPhoneInput.value)) {
        console.log("Phone True");
        contactPhoneInput.classList.remove("is-invalid");
        return true;
    } else {
        contactPhoneInput.classList.add("is-invalid");
        return false;
    }
}

function validateEmailInput() {
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(contactEmailInput.value)) {
        console.log("Email True");
        contactEmailInput.classList.remove("is-invalid");
        return true;
    } else {
        contactEmailInput.classList.add("is-invalid");
        return false;
    }
}


function validForm(){
    return(validateEmailInput() && validateNameInput() && validatePhoneInput())
}
// Create Contact Function (تم تصحيح الأقواس هنا)
function createContact() {
    var contact = {
        id: Date.now(),
        name: contactNameInput.value,
        phone: contactPhoneInput.value,
        email: contactEmailInput.value,
        address: contactAddressInput.value,
        group: contactGroupInput.value,
        notes: contactNotesInput.value,
        isFav: contactFavoriteInput.checked,
        isEmergency: contactEmergencyInput.checked,
    };
if(!validForm()){
return;
}
    
    contacts.push(contact); // إضافة الـ contact الصح
    saveContacts();
    displayContacts();
    clearInputs();
    closeModalFunction();
    
    Swal.fire({
        title: "Success",
        text: `Contact with name ${contact.name} added successfully`,
        icon: "success",
    });
}
function togglefav(id) {
    var index = getContactBYId(id);
    contacts[index].isFav = !contacts[index].isFav;
    saveContacts();
    displayContacts();   
}

function toggleEm(id) {
    var index = getContactBYId(id);
    contacts[index].isEmergency = !contacts[index].isEmergency;
    saveContacts();
    displayContacts();   
}

function deleteContact(id) {
    var index = getContactBYId(id);
    contacts.splice(index, 1);
    saveContacts();
    displayContacts();   
    
    Swal.fire({
        title: "Success",
        text: `Contact deleted successfully`,
        icon: "success",
    });
}

function openEditDialog(id) {
    idToUpdate = id;
    var contact = contacts[getContactBYId(id)];
    contactNameInput.value = contact.name;
    contactPhoneInput.value = contact.phone;
    contactEmailInput.value = contact.email;
    contactAddressInput.value = contact.address;
    contactGroupInput.value = contact.group;
    contactNotesInput.value = contact.notes;
    contactFavoriteInput.checked = contact.isFav;
    contactEmergencyInput.checked = contact.isEmergency;
    
    createContactButton.classList.add("d-none");
    UpdateContactButton.classList.remove("d-none");
    openModal();
}

function UpdateContact() {
    var index = getContactBYId(idToUpdate);
    contacts[index] = {
        id: contacts[index].id,
        name: contactNameInput.value,
        phone: contactPhoneInput.value,
        email: contactEmailInput.value,
        address: contactAddressInput.value,
        group: contactGroupInput.value,
        notes: contactNotesInput.value,
        isFav: contactFavoriteInput.checked,
        isEmergency: contactEmergencyInput.checked,
    };
    
    saveContacts();
    displayContacts();
    clearInputs();
    closeModalFunction();
} 

function search() {
    var data = searchInput.value;
    var result = [];
    
    for (var i = 0; i < contacts.length; i++) {
        if (
            contacts[i].name.toLowerCase().includes(data.toLowerCase()) ||
            contacts[i].email.toLowerCase().includes(data.toLowerCase()) ||
            contacts[i].phone.includes(data)
        ) {
            result.push(contacts[i]);
        }
    }
    displayContacts(result);
}


