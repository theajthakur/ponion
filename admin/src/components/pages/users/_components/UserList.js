import { Box, MenuItem, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { useAuth } from "@/components/Provider/AuthProvider";

export default function UserList() {
  const { token } = useAuth();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) => {
        const matchesSearch =
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase());
        const matchesStatus =
          (roleFilter === "all" || user.role === roleFilter) &&
          (statusFilter === "all" || user.status === statusFilter);
        return matchesSearch && matchesStatus;
      })
    );
  }, [users, roleFilter, statusFilter]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/superadmin/users`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setUsers(res.data.users);
    };
    fetchData();
  }, []);

  return (
    <Box className="p-6 flex flex-col gap-4">
      <Box className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/3"
        />
        <TextField
          select
          label="Status"
          variant="outlined"
          size="small"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full sm:w-1/4"
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="user">Users</MenuItem>
          <MenuItem value="admin">Admins</MenuItem>
          <MenuItem value="superadmin">Superadmin</MenuItem>
        </TextField>
        <TextField
          select
          label="Status"
          variant="outlined"
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-1/4"
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="disabled">Disabled</MenuItem>
          <MenuItem value="pending_email">Email Pending</MenuItem>
        </TextField>
      </Box>
      <UserCard users={filteredUsers} setUsers={setFilteredUsers} />
    </Box>
  );
}
