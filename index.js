
loadPatients()

function saveData() {
    const nameValue = document.getElementById("name").value;
    const ageValue = document.getElementById("age").value;
    const addressValue = document.getElementById("adress").value;
    const phoneNumberValue = document.getElementById("phoneNumber").value;


    const patientData = {
        name: nameValue,
        age: ageValue,
        address: addressValue,
        phoneNumber: phoneNumberValue
    };



    fetch("http://localhost:8080/api/v1/patients/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(patientData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to save patient: " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            //console.log("Patient saved:", data);
            alert("Patient saved successfully!");
            loadPatients()
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Error saving patient. Check console.");
        });


    if (updatePatient) {

        fetch(`http://localhost:8080/api/v1/patients/update/${updatePatient}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patientData)
        })
            .then(res => res.json())
            .then(data => {
                alert("Patient updated successfully!");


                document.getElementById("saveBtn").innerText = "Save Data";
                updatePatient = null;

                loadPatients();
            });
        document.getElementById("name").value = "";
        document.getElementById("age").value = "";
        document.getElementById("adress").value = "";
        document.getElementById("phoneNumber").value = "";

        return;

    }
}


function loadPatients() {
    fetch("http://localhost:8080/api/v1/patients")
        .then(response => response.json())
        .then(patients => {
            const tableBody = document.querySelector("#patientTable tbody");
            tableBody.innerHTML = "";

            patients.forEach(patient => {
                const row = `
                    <tr>
                        <td>${patient.id}</td>
                        <td>${patient.name}</td>
                        <td>${patient.age}</td>
                        <td>${patient.address}</td>
                        <td>${patient.phoneNumber}</td>
                        <td>
                            <button onclick='updatePatient(${JSON.stringify(patient)})' style"justify-content:center; flex-wrap: wrap; margin-top: 2px; padding: 6px 12px; background-color: #0489f7ff; color: white;">Update</button>
                            <button onclick="deletePatient(${patient.id})" style = "justify-content:center; flex-wrap: wrap; margin-top: 2px; padding: 6px 12px; background-color: #cb3c3cff; color:white">Delete</button>
                            <button onclick="makeAppointment(${patient.id})" style = "justify-content:center; flex-wrap: wrap; margin-top: 2px; padding: 6px 12px; background-color: #a0ba65ff; color:white">Appointment</button>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        })

        .catch(error => console.error("Error:", error));
}


function updatePatient(patient) {

    //console.log(patient)
    document.getElementById("name").value = patient.name;
    document.getElementById("age").value = patient.age;
    document.getElementById("adress").value = patient.address;
    document.getElementById("phoneNumber").value = patient.phoneNumber;


    updatePatient = patient.id;


    document.getElementById("saveBtn").innerText = "Update Data";

    alert("Loaded patient data for update.");



    //alert("Update patient ID: " + patient);
}



function deletePatient(id) {

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"

    }).then((result) => {

        if (result.isConfirmed) {
            fetch(`http://localhost:8080/api/v1/patients/delete/${id}`, {
                method: "DELETE"
            })

            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
        }
    });



}

function makeAppointment(id) {
    if (id) {
        document.getElementById("appointmentPatientId").value = id;
        document.getElementById("customModal").style.display = "flex";
        loadAppointments(id);
    }


    // alert("Create appointment for patient ID: " + id);
}

function closeAppointmentModal() {
    document.getElementById("customModal").style.display = "none";

}

function saveAppointment() {
    const id = document.getElementById("appointmentPatientId").value;
    const doctorName = document.getElementById("appointmentDoctorName").value;
    const time = document.getElementById("appointmentTime").value;
    const date = document.getElementById("appointmentDate").value;
    const desc = document.getElementById("appointmentDesc").value;
    loadAppointments(id);
    if (!doctorName || !time || !date || !desc) {
        alert("Please fill all Details!");
        return;
    }

    const data = {
        doctorName: doctorName,
        description: desc,
        date: date,
        time: time,
        patient_id: id
    };

    console.log(data);

    fetch("http://localhost:8080/api/v2/appointments/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(() => {
            // alert("Appointment saved!");
            //closeAppointmentModal();
            document.getElementById("appointmentDoctorName").value = "";
            document.getElementById("appointmentTime").value = "";
            document.getElementById("appointmentDate").value = "";
            document.getElementById("appointmentDesc").value = "";
            // closeAppointmentModal();
        });
}



function loadAppointments(patientId) {
    fetch(`http://localhost:8080/api/v2/appointments/patient/${patientId}`)
        .then(res => res.json())
        .then(data => {
            const tableBody = document.querySelector("#appointmentTable tbody");
            tableBody.innerHTML = "";

            data.forEach(app => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${app.doctorName}</td>
                        <td>${app.date}</td>
                        <td>${app.time}</td>
                        <td>${app.description}</td>
                        <td>
                             <button onclick='deleteAppointment(${app.id})'
                                style="background:#d33;color:white;padding:4px 8px;border-radius:5px;">
                                Delete
                            </button>
                        </td>
                    </tr>
                `;
            });
        });
}

function deleteAppointment(appointmentId) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"

    }).then((result) => {

        if (result.isConfirmed) {
            fetch(`http://localhost:8080/api/v2/appointments/delete/${appointmentId}`, {
                method: "DELETE"
            })

            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
        }
    });


}


