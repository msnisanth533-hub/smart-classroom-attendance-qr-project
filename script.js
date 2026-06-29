function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "1234") {
        document.getElementById("loginPage").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
    } else {
        document.getElementById("loginMsg").innerHTML = "Invalid Username or Password";
        document.getElementById("loginMsg").style.color = "red";
    }
}

function logout() {
    location.reload();
}

function showSection(section) {
    document.getElementById("scan").style.display = "none";
    document.getElementById("attendance").style.display = "none";

    document.getElementById(section).style.display = "block";

    if (section === "scan") {
        startScanner();
    }
}

let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

function addAttendance(roll) {

    let today = new Date();

    let date = today.toLocaleDateString();

    let time = today.toLocaleTimeString();

    let studentName = "Student " + roll;

    let already = attendance.find(
        s => s.roll === roll && s.date === date
    );

    if (already) {
        alert("Attendance Already Marked");
        return;
    }

    attendance.push({
        roll: roll,
        name: studentName,
        date: date,
        time: time,
        status: "Present"
    });

    localStorage.setItem("attendance", JSON.stringify(attendance));

    loadTable();
}
function loadTable() {
    fetch("https://script.google.com/macros/s/AKfycbyDwsXX2H-4Xq6zYGa9HcUEDtHGr5dAhT8xVg4gd5VVTuEZxDteGxNqjjzcQd5MbII0/exec")
    .then(response => response.json())
    .then(data => {
        let tbody = document.querySelector("#attendanceTable tbody");
        tbody.innerHTML = "";

        data.slice(1).forEach(student => {
            tbody.innerHTML += `
                <tr>
                    <td>${student[1]}</td>
                    <td>${student[2]}</td>
                    <td>${student[0]}</td>
                    <td>${student[3]}</td>
                    <td>Present</td>
                </tr>
            `;
        });
    })
    .catch(error => console.error(error));
}

function searchTable() {

    let input = document.getElementById("search").value.toLowerCase();

    let rows = document.querySelectorAll("#attendanceTable tbody tr");

    rows.forEach(row => {

        let text = row.innerText.toLowerCase();

        row.style.display = text.includes(input) ? "" : "none";

    });

}

function exportExcel() {

    let worksheet = XLSX.utils.json_to_sheet(attendance);

    let workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    XLSX.writeFile(workbook, "Attendance.xlsx");

}

function startScanner() {

    let scanner = new Html5Qrcode("reader");

    scanner.start(

        { facingMode: "environment" },

        { fps: 10, qrbox: 250 },

        function(decodedText) {
    window.open(decodedText, "_blank");
},

        function(error) {}

    ).catch(err => {

        console.log(err);

    });

}

window.onload = function() {

    loadTable();

};
function openAttendanceForm() {
    window.open(
        "https://docs.google.com/forms/d/e/1FAIpQLSf06WckbbPQViQm0Sk0LgEVnCxG1m-U9jX3HOApZuTMZHt34w/viewform?usp=header",
        "_blank"
    );
}
fetch("https://script.google.com/macros/s/AKfycbyDwsXX2H-4Xq6zYGa9HcUEDtHGr5dAhT8xVg4gd5VVTuEZxDteGxNqjjzcQd5MbII0/exec")
  .then(response => response.json())
  .then(data => {
      console.log(data);
  })
  .catch(error => console.error(error));
