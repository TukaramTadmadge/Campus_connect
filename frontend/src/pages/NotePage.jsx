import React, { useState, useEffect } from "react";
import axios from "axios";
import "./NotePage.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://campus-connect-3x1v.onrender.com";

const NotePage = () => {
  const [step, setStep] = useState("year");
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [data, setData] = useState({});
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/notes`)
      .then((res) => {
        if (res.data.success) {
          const grouped = {};
          res.data.notes.forEach((note) => {
            if (!grouped[note.yearOfStudy]) grouped[note.yearOfStudy] = {};
            if (!grouped[note.yearOfStudy][note.department])
              grouped[note.yearOfStudy][note.department] = {};
            if (!grouped[note.yearOfStudy][note.department][note.subject])
              grouped[note.yearOfStudy][note.department][note.subject] = [];
            grouped[note.yearOfStudy][note.department][note.subject].push(note);
          });
          setData(grouped);
        }
      })
      .catch((err) => console.error("Error fetching notes:", err));
  }, []);

  const handleYearClick = (year) => { setSelectedYear(year); setStep("dept"); };
  const handleDeptClick = (dept) => { setSelectedDept(dept); setStep("subject"); };
  const handleSubjectClick = (subject) => { setSelectedSubject(subject); setNotes(data[selectedYear][selectedDept][subject]); setStep("notes"); };
  const handleBack = () => { if (step === "notes") setStep("subject"); else if (step === "subject") setStep("dept"); else if (step === "dept") setStep("year"); };

  const filteredNotes = notes.filter((note) => {
    const fullName = `${note.user?.firstName || ""} ${note.user?.lastName || ""}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="note-page">
      <h2>Uploaded Notes</h2>
      {step !== "year" && <button onClick={handleBack} className="back-button">⬅ Back</button>}

      {step === "year" && (
        <div className="grid-container">{Object.keys(data).map((year) => (<div key={year} className="card-year" onClick={() => handleYearClick(year)}>{year}</div>))}</div>
      )}

      {step === "dept" && (
        <div className="grid-container">{Object.keys(data[selectedYear] || {}).map((dept) => (<div key={dept} className="card-dept" onClick={() => handleDeptClick(dept)}>{dept}</div>))}</div>
      )}

      {step === "subject" && (
        <div className="grid-container">{Object.keys(data[selectedYear][selectedDept] || {}).map((subject) => (<div key={subject} className="card-subject" onClick={() => handleSubjectClick(subject)}>{subject}</div>))}</div>
      )}

      {step === "notes" && (
        <div className="space-y-3">
          <input type="text" placeholder="Search by uploader name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-bar"/>
          {filteredNotes.map((note) => (
            <div key={note._id} className="note-card">
              <p>
                <strong>{note.originalName}</strong> ({note.yearOfStudy}, {note.department}, {note.subject}) - Uploaded by {note.user?.firstName} {note.user?.lastName}
              </p>
              <a href={`${BACKEND_URL}/api/notes/file/${note._id}`} target="_blank" rel="noreferrer">View / Download</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotePage;
