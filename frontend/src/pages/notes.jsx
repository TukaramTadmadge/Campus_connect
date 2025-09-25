// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./notes.css";

// const Notes = () => {
//   const [groupedNotes, setGroupedNotes] = useState({});

//   useEffect(() => {
//     axios.get("http://localhost:5000/api/notes")
//       .then(res => {
//         const grouped = {};
//         res.data.forEach(note => {
//           if (!grouped[note.department]) grouped[note.department] = {};
//           if (!grouped[note.department][note.yearOfStudy]) grouped[note.department][note.yearOfStudy] = {};
//           if (!grouped[note.department][note.yearOfStudy][note.subject]) grouped[note.department][note.yearOfStudy][note.subject] = [];
//           grouped[note.department][note.yearOfStudy][note.subject].push(note);
//         });
//         setGroupedNotes(grouped);
//       })
//       .catch(err => console.error(err));
//   }, []);

//   return (
//     <div className="notes-container">
//       <h2 className="notes-title">All Notes</h2>
//       {Object.keys(groupedNotes).map(dept => (
//         <div key={dept} className="department">
//           <div className="department-title">{dept}</div>
//           {Object.keys(groupedNotes[dept]).map(year => (
//             <div key={year}>
//               <div className="year">{year}</div>
//               {Object.keys(groupedNotes[dept][year]).map(subject => (
//                 <div key={subject}>
//                   <div className="subject">{subject}</div>
//                   <ul className="notes-list">
//                     {groupedNotes[dept][year][subject].map((note, index) => (
//                       <li key={index}>
//                         <a href={`http://localhost:5000${note.fileUrl}`} target="_blank" rel="noreferrer">
//                           {note.originalName}
//                         </a> (Uploaded by {note.uploader})
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Notes;
import React, { useState, useEffect } from "react";
import "./notes.css";
import axios from "axios";

export default function notes() {
  const [step, setStep] = useState("year");
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [data, setData] = useState({});
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9000/api/notes")
      .then((res) => {
        const grouped = {};
        res.data.forEach((note) => {
          if (!grouped[note.yearOfStudy]) grouped[note.yearOfStudy] = {};
          if (!grouped[note.yearOfStudy][note.department])
            grouped[note.yearOfStudy][note.department] = {};
          if (!grouped[note.yearOfStudy][note.department][note.subject])
            grouped[note.yearOfStudy][note.department][note.subject] = [];
          grouped[note.yearOfStudy][note.department][note.subject].push(note);
        });
        setData(grouped);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleYearClick = (year) => {
    setSelectedYear(year);
    setStep("dept");
  };

  const handleDeptClick = (dept) => {
    setSelectedDept(dept);
    setStep("subject");
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setNotes(data[selectedYear][selectedDept][subject]);
    setStep("notes");
  };

  const handleBack = () => {
    if (step === "notes") setStep("subject");
    else if (step === "subject") setStep("dept");
    else if (step === "dept") setStep("year");
  };

  return (
    <div className="notes-container">
      <h1>Notes</h1>
      {step !== "year" && (
        <button className="back-btn" onClick={handleBack}>
          ⬅ Back
        </button>
      )}

      {step === "year" && (
        <div className="grid">
          {Object.keys(data).map((year) => (
            <div
              key={year}
              className="card"
              onClick={() => handleYearClick(year)}
            >
              {year}
            </div>
          ))}
        </div>
      )}

      {step === "dept" && (
        <div className="grid">
          {Object.keys(data[selectedYear] || {}).map((dept) => (
            <div
              key={dept}
              className="card"
              onClick={() => handleDeptClick(dept)}
            >
              {dept}
            </div>
          ))}
        </div>
      )}

      {step === "subject" && (
        <div className="grid">
          {Object.keys(data[selectedYear][selectedDept] || {}).map((subject) => (
            <div
              key={subject}
              className="card"
              onClick={() => handleSubjectClick(subject)}
            >
              {subject}
            </div>
          ))}
        </div>
      )}

      {step === "notes" && (
        <div className="notes-list">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div key={note._id} className="note-item">
                <p>{note.originalName}</p>
                <a
                  href={`http://localhost:5173${note.fileUrl}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View / Download
                </a>
              </div>
            ))
          ) : (
            <p>No notes found for this subject.</p>
          )}
        </div>
      )}
    </div>
  );
}