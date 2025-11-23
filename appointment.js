 
const urlParams = new URLSearchParams(window.location.search);
const patientId = urlParams.get("patientId");

document.getElementById("appointmentPatientId").value = patientId;

loadAppointments(patientId);

function goBack() {
    window.location.href = "index.html";
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


function saveAppointment() {
    const doctorName = document.getElementById("appointmentDoctorName").value;
    const time = document.getElementById("appointmentTime").value;
    const date = document.getElementById("appointmentDate").value;
    const desc = document.getElementById("appointmentDesc").value;

    if (!doctorName || !time || !date || !desc) {
        alert("Please fill all details!");
        return;
    }

    const data = {
        doctorName,
        time,
        date,
        description: desc,
        patient_id: patientId
    };

    fetch("http://localhost:8080/api/v2/appointments/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(() => {
            loadAppointments(patientId);

            document.getElementById("appointmentDoctorName").value = "";
            document.getElementById("appointmentTime").value = "";
            document.getElementById("appointmentDate").value = "";
            document.getElementById("appointmentDesc").value = "";
        });
}


function deleteAppointment(id) {
    Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33"
    }).then(result => {
        if (result.isConfirmed) {
            fetch(`http://localhost:8080/api/v2/appointments/delete/${id}`, {
                method: "DELETE"
            }).then(() => {
                loadAppointments(patientId);
            });
        }
    });
}
