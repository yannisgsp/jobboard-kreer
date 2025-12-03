import React, { useEffect, useState } from "react";
import "../style/dashboard.css";
import UpdateModal from "./modal";
import CreateUserModal from "./CreateUserModal";
import CreateJobModal from "./CreateJobModal";
import CreateCompanyModal from "./CreateCompanyModal";
import UpdateJobModal from "./UpdateJobModal";

// Types
type TableName = "users" | "jobs" | "companies";
type TableRow = { [key: string]: any }; // même chose que Record<string, any>

function List() {
  // États
  const [selectedTable, setSelectedTable] = useState<TableName>("users");
  const [data, setData] = useState<TableRow[]>([]);
  const [selectedRow, setSelectedRow] = useState<TableRow | null>(null);
  const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false);
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [role, setRole] = useState<"admin" | "company">("admin");
  const [applicants, setShowApplicants] = useState(false);

  useEffect(() => {
    if (role === "company") {
      setSelectedTable("jobs");
      fetch(`/api/jobs/company`)
        .then((res) => res.json())
        .then((data) => setData(data));
    } else {
      fetchData(); // fetch toutes les tables pour admin
    }
  }, [role]);

  // Fonction qui récupère les données depuis l'API
  async function fetchData() {
    try {
      setData([]);
      const response = await fetch(`/api/${selectedTable}`);
      const json = await response.json();

      // stocke le tableau correspondant dans le state
      setData(json);
    } catch (error) {
      console.error("Erreur lors du fetch :", error);
    }
  }

  async function showApplications(row: TableRow) {
    try {
      setData([]);
      const jobId = row.job_id;
      const response = await fetch(`/api/jobs/${jobId}/applicants`);
      const json = await response.json();

      // stocke le tableau correspondant dans le state
      setData(json);
      if (!response.ok) {
        alert(json.message);
      }
    } catch (error) {
      console.error("Erreur lors du fetch :", error);
    }
  }

  // On recharge les données quand la table sélectionnée change
  useEffect(() => {
    fetchData();
  }, [selectedTable]);

  function handleUpdate(updatedRow: TableRow) {
    const newData: TableRow[] = []; // Nouveau tableau update

    for (let i = 0; i < data.length; i++) {
      const row = data[i];

      let rowId;
      if (row?.user_id) {
        rowId = row.user_id;
      } else if (row?.company_id) {
        rowId = row.company_id;
      } else if (row?.job_id) {
        rowId = row.job_id;
      } else {
        rowId = row?.id;
      }

      let updatedId;
      if (updatedRow.user_id) {
        updatedId = updatedRow.user_id;
      } else if (updatedRow.company_id) {
        updatedId = updatedRow.company_id;
      } else if (updatedRow.job_id) {
        updatedId = updatedRow.job_id;
      } else {
        updatedId = updatedRow.id;
      }

      // si c’est la ligne mise à jour, on met la nouvelle ligne, sinon on garde l’ancienne
      if (rowId === updatedId) {
        newData.push(updatedRow);
      } else {
        newData.push(row ?? []);
      }
    }

    setData(newData); // on met à jour le state

    fetchData();
  }

  async function handleDelete(rowToDelete: TableRow) {
    try {
      const idKey = Object.values(rowToDelete)[0];
      const res = await fetch(`/api/${selectedTable}/${idKey}`, {
        method: "DELETE",
      });
      setData((prev) =>
        prev.filter((r) => {
          const rowId = r.user_id || r.company_id || r.job_id || r.id;
          return rowId !== idKey;
        }),
      );
    } catch (err) {
      console.error(err);
    }
    fetchData();
  }

  function addRecord(newRow: TableRow) {
    setData((prev) => [...prev, newRow]);
  }

  return (
    <div className="main">
      <h1>Dashboard Admin</h1>
      {role === "admin" && (
        <div className="filters-btns">
          <p>Selectionner une table :</p>
          <select
            value={selectedTable}
            onChange={(e) => {
              setSelectedTable(e.target.value as TableName);
              setShowApplicants(false);
            }}
          >
            <option value="jobs">Jobs</option>
            <option value="users">Users</option>
            <option value="companies">Companies</option>
          </select>
        </div>
      )}
      {!applicants && (
        <button
          onClick={function () {
            setIsCreatePopupOpen(true);
          }}
        >
          Create record
        </button>
      )}
      {applicants && (
        <button
          onClick={function () {
            setSelectedTable("jobs");
            setShowApplicants(false);
            fetchData();
          }}
        >
          Go back to jobs
        </button>
      )}

      {/* Tableau principal */}
      {data.length > 0 ? (
        <div className="table-container">
          <table
            className={`data-table ${applicants ? "applications-table" : ""}`}
          >
            {" "}
            <thead>
              <tr>
                {Object.keys(data[0] ?? {}).map(function (key) {
                  return <th key={key}>{key}</th>;
                })}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(function (row) {
                const uniqueKey =
                  row.id || row.user_id || row.company_id || row.job_id;

                return (
                  <tr key={uniqueKey}>
                    {Object.keys(row).map(function (key) {
                      return <td key={key}>{row[key]}</td>;
                    })}
                    <td className="btns">
                      <button
                        onClick={function () {
                          setSelectedRow(row);
                          setIsUpdatePopupOpen(true);
                        }}
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => {
                          handleDelete(row);
                        }}
                      >
                        Supprimer
                      </button>
                      {selectedTable === "jobs" && (
                        <button
                          onClick={() => {
                            setSelectedRow(row);
                            setShowApplicants(true);
                            showApplications(row);
                          }}
                        >
                          Show Applications
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Aucune donnée disponible.</p>
      )}

      {/* Modale d’édition */}
      {isUpdatePopupOpen && selectedRow && selectedTable === "users" && (
        <UpdateModal
          row={selectedRow}
          tableName={selectedTable}
          onClose={function () {
            setSelectedRow(selectedRow);
            setIsUpdatePopupOpen(false);
          }}
          onUpdate={handleUpdate}
        />
      )}
      {isUpdatePopupOpen && selectedRow && selectedTable === "companies" && (
        <UpdateModal
          row={selectedRow}
          tableName={selectedTable}
          onClose={function () {
            setSelectedRow(selectedRow);
            setIsUpdatePopupOpen(false);
          }}
          onUpdate={handleUpdate}
        />
      )}
      {isUpdatePopupOpen && selectedRow && selectedTable === "jobs" && (
        <UpdateJobModal
          row={selectedRow}
          tableName={selectedTable}
          onClose={function () {
            setSelectedRow(selectedRow);
            setIsUpdatePopupOpen(false);
          }}
          onUpdate={handleUpdate}
        />
      )}
      {isUpdatePopupOpen && selectedRow && selectedTable === "users" && (
        <UpdateModal
          row={selectedRow}
          tableName={selectedTable}
          onClose={function () {
            setSelectedRow(selectedRow);
            setIsUpdatePopupOpen(false);
          }}
          onUpdate={handleUpdate}
        />
      )}
      {isCreatePopupOpen && selectedTable === "users" && (
        <CreateUserModal
          onClose={function () {
            setIsCreatePopupOpen(false);
          }}
          onCreate={addRecord}
        />
      )}
      {isCreatePopupOpen && selectedTable === "jobs" && (
        <CreateJobModal
          onClose={function () {
            setIsCreatePopupOpen(false);
          }}
          onCreate={addRecord}
        />
      )}
      {isCreatePopupOpen && selectedTable === "companies" && (
        <CreateCompanyModal
          onClose={function () {
            setIsCreatePopupOpen(false);
          }}
          onCreate={addRecord}
        />
      )}
    </div>
  );
}

export default List;
