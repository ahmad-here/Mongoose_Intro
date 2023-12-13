async function addStudent() {
    const regId = document.getElementById('regId').value;
    const name = document.getElementById('name').value;
    const gender = document.getElementById('gender').value;
    const department = document.getElementById('department').value;

    try {
        const response = await fetch('http://localhost:3000/api/students/addStudent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ regId, name, gender, department }),
        });

        if (response.ok) {
            alert('Student added successfully');
            // Update the student list on success
            getStudents();
        } else {
            const errorMessage = await response.text();
            alert(`Failed to add student: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Error adding student:', error);
    }
}

async function getStudents() {
    try {
        const response = await fetch('http://localhost:3000/api/students');
        const students = await response.json();

        const studentListElement = document.getElementById('studentList');
        studentListElement.innerHTML = '';

        students.forEach(student => {
            const listItem = document.createElement('li');
            listItem.textContent = `ID: ${student.regId}, Name: ${student.name}, Gender: ${student.gender}, Department: ${student.department}`;
            const listItemButton = document.createElement('li');
            listItemButton.setAttribute('id', 'listButtons')

            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update';
            updateButton.onclick = () => updateStudent(student._id);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteStudent(student._id);

            listItemButton.appendChild(updateButton)
            listItemButton.appendChild(deleteButton)


            listItem.appendChild(listItemButton);

            studentListElement.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching students:', error);
    }
}

async function updateStudent(studentId) {
    try {
        const existingStudentResponse = await fetch(`http://localhost:3000/api/students/findStudent/${studentId}`);
        const existingStudent = await existingStudentResponse.json();

        const updatedRegId = prompt(`Enter updated regID for ${existingStudent.regId}:`, existingStudent.regId);
        const updatedName = prompt(`Enter updated name for ${existingStudent.name}:`, existingStudent.name);
        const updatedGender = prompt(`Enter updated gender for ${existingStudent.name}:`, existingStudent.gender);
        const updatedDepartment = prompt(`Enter updated department for ${existingStudent.name}:`, existingStudent.department);

        const response = await fetch(`http://localhost:3000/api/students/updateStudent/${studentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                regId: updatedRegId,
                name: updatedName,
                gender: updatedGender,
                department: updatedDepartment,
            }),
        });

        if (response.ok) {
            alert('Student updated successfully');
            getStudents();
        } else {
            const errorMessage = await response.text();
            alert(`Failed to update student: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Error updating student:', error);
    }
}


async function deleteStudent(studentId) {
    try {
        const response = await fetch(`http://localhost:3000/api/students/deleteStudent/${studentId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Student deleted successfully');
            getStudents();
        } else {
            const errorMessage = await response.text();
            alert(`Failed to delete student: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Error deleting student:', error);
    }
}

getStudents();