import React, { useState, useEffect, useCallback } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Customers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 20;

  // Initialize AOS animation library once
  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  // Fetch users from backend API
  const fetchUsers = useCallback(
    async (searchTerm = "", pageNum = 1) => {
      setError(null);
      setLoading(true);
      try {
        const query = new URLSearchParams({
          search: searchTerm,
          page: pageNum,
          per_page: perPage,
        }).toString();

        const res = await fetch(`http://localhost:8080/app-eauto/backend/admin-customers.php?${query}`);
        if (!res.ok) throw new Error(`Failed to fetch users: ${res.statusText}`);
        const data = await res.json();
        setUsers(data.users || []);
        setTotalPages(data.total_pages || 1);
        setPage(data.page || 1);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    },
    [perPage]
  );

  // Fetch data immediately on mount
  useEffect(() => {
    fetchUsers(search.trim(), 1);
  }, [fetchUsers]);

  // Debounced fetch when search changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers(search.trim(), 1);
    });

    return () => clearTimeout(delayDebounce);
  }, [search, fetchUsers]);

  // Pagination handler
  const goToPage = (pageNum) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    fetchUsers(search.trim(), pageNum);
  };

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateStr).toLocaleDateString("en-IN", options);
  };

  return (
    <div className="container-fluid" style={{ padding: "2rem" }}>
      <h2 className="mb-4" data-aos="fade-right">
        Registered Users
      </h2>

      <form
        className="d-flex mb-4"
        data-aos="fade-down"
        onSubmit={(e) => e.preventDefault()}
        style={{ gap: "0.5rem", flexWrap: "wrap", maxWidth: "400px" }}
      >
        <input
          type="search"
          className="form-control"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search users"
        />
      </form>

      {error && (
        <div className="alert alert-danger" role="alert" data-aos="fade-up">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-5" data-aos="fade-up">
          <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
          <div>Loading users...</div>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="table-responsive" data-aos="fade-up">
            <table className="table table-bordered align-middle table-hover">
              <thead>
                <tr style={{ backgroundColor: "#1b2c7a", color: "#fff" }}>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Birthdate</th>
                  <th>Gender</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.fullname}</td>
                      <td>{user.email}</td>
                      <td>{user.contact}</td>
                      <td>{formatDate(user.birthdate)}</td>
                      <td>
                        <span
                          className={`badge bg-${
                            user.gender === "Male"
                              ? "primary"
                              : user.gender === "Female"
                              ? "danger"
                              : "secondary"
                          }`}
                        >
                          {user.gender || "-"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Customers;
