import React, { useState, useEffect } from "react";
import axios from "axios";
import "./NotePage.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:9000";

const NotePage = () => {
  const [step, setStep] = useState("year"); // year -> dept -> subject -> notes
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
        console.log("API response:", res.data);
        if (res.data.success && Array.isArray(res.data.notes)) {
          const grouped = {};
          res.data.notes.forEach((note) => {
            const year = note.yearOfStudy || "Unknown Year";
            const dept = note.department || "Unknown Dept";
            const subject = note.subject || "Unknown Subject";

            if (!grouped[year]) grouped[year] = {};
            if (!grouped[year][dept]) grouped[year][dept] = {};
            if (!grouped[year][dept][subject]) grouped[year][dept][subject] = [];

            grouped[year][dept][subject].push(note);
          });
          setData(grouped);
        }
      })
      .catch((err) => console.error("Error fetching notes:", err));
  }, []);

  const handleYearClick = (year) => { setSelectedYear(year); setStep("dept"); };
  const handleDeptClick = (dept) => { setSelectedDept(dept); setStep("subject"); };
  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setNotes(data[selectedYear][selectedDept][subject] || []);
    setStep("notes");
  };
  const handleBack = () => {
    if (step === "notes") setStep("subject");
    else if (step === "subject") setStep("dept");
    else if (step === "dept") setStep("year");
  };

  const filteredNotes = notes.filter((note) => {
    const fullName = `${note.user?.firstName || ""} ${note.user?.lastName || ""}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="note-page">
      <h2>Uploaded Notes</h2>

      {step !== "year" && (
        <button onClick={handleBack} className="back-button">
          ⬅ Back
        </button>
      )}

      {/* Step: Year */}
      {step === "year" && (
        <div className="grid-container">
          {Object.keys(data).length > 0 ? (
            Object.keys(data).map((year) => (
              <div key={year} className="card-year" onClick={() => handleYearClick(year)}>
                {year}
              </div>
            ))
          ) : (
            <p>No notes available.</p>
          )}
        </div>
      )}

      {/* Step: Department */}
      {step === "dept" && (
        <div className="grid-container">
          {Object.keys(data[selectedYear] || {}).map((dept) => (
            <div key={dept} className="card-dept" onClick={() => handleDeptClick(dept)}>
              {dept}
            </div>
          ))}
        </div>
      )}

      {/* Step: Subject */}
      {step === "subject" && (
        <div className="grid-container">
          {Object.keys(data[selectedYear][selectedDept] || {}).map((subject) => (
            <div key={subject} className="card-subject" onClick={() => handleSubjectClick(subject)}>
              {subject}
            </div>
          ))}
        </div>
      )}

      {/* Step: Notes */}
      {step === "notes" && (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Search by uploader name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <div key={note._id} className="note-card">
                <p>
                  <strong>{note.originalName}</strong> ({note.yearOfStudy}, {note.department}, {note.subject}) - Uploaded by {note.user?.firstName || "Unknown"} {note.user?.lastName || ""}
                </p>
                <a
                  href={`${BACKEND_URL}/api/notes/file/${note._id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View / Download
                </a>
              </div>
            ))
          ) : (
            <p className="no-notes">No notes found for this uploader.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotePage;
