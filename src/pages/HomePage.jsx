import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  Typography,
  Button,
  CircularProgress,
  Fab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputBase,
  Tooltip,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { isToday, isFuture } from 'date-fns';

// Icons
import ListIcon from "@mui/icons-material/List";
import TodayIcon from "@mui/icons-material/Today";
import UpcomingIcon from "@mui/icons-material/Upcoming";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import MicIcon from '@mui/icons-material/Mic';
import TaskAltIcon from "@mui/icons-material/TaskAlt";

// Your components
import api from "../api";
import TodoList from "../components/TodoList";
import TodoForm from "../components/TodoForm";
import ThemeSwitcher from "../components/ThemeSwitcher";
import VoiceCommandButton from "../components/VoiceCommandButton";

const drawerWidth = 240;

const menuItems = [
  { name: "All Tasks", icon: <ListIcon />, filter: "all-tasks" },
  { name: "Today", icon: <TodayIcon />, filter: "today" },
  { name: "Upcoming", icon: <UpcomingIcon />, filter: "upcoming" },
  { name: "Completed", icon: <DoneAllIcon />, filter: "completed" },
  { name: "Favorites", icon: <StarBorderIcon />, filter: "favorites" }, // Placeholder
];

// Styled search bar
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: '20px',
  backgroundColor: alpha(theme.palette.text.primary, 0.05),
  "&:hover": {
    backgroundColor: alpha(theme.palette.text.primary, 0.1),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "30ch",
    },
  },
}));

export default function HomePage() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [filter, setFilter] = useState("all-tasks");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageTitle, setPageTitle] = useState("All Tasks");

  useEffect(() => {
    api.get("/todos")
      .then((response) => {
        setTodos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching todos:", error);
        setLoading(false);
      });
  }, []);

  const handleOpenForm = (todo = null) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };
  const handleCloseForm = () => setIsFormOpen(false);
  const handleSaveTodo = (todoData) => {
    const promise = todoData._id ? api.put(`/todos/${todoData._id}`, todoData) : api.post("/todos", todoData);
    promise
      .then((response) => {
        setTodos((prev) => todoData._id ? prev.map((t) => (t._id === todoData._id ? response.data : t)) : [...prev, response.data]);
      })
      .catch((error) => console.error("Error saving todo:", error));
  };
  const handleDeleteTodo = (id) => {
    api.delete(`/todos/${id}`)
      .then(() => setTodos((prev) => prev.filter((t) => t._id !== id)))
      .catch((error) => console.error("Error deleting todo:", error));
  };
  const handleToggleComplete = (todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    api.put(`/todos/${todo._id}`, updatedTodo)
      .then((response) => setTodos((prev) => prev.map((t) => (t._id === todo._id ? response.data : t))))
      .catch((error) => console.error("Error updating todo:", error));
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };
  const handleVoiceResult = (transcript) => {
    if (!transcript) return;
    handleSaveTodo({ text: transcript });
  };
  
  const handleFilterChange = (newFilter, newTitle) => {
      setFilter(newFilter);
      setPageTitle(newTitle);
  }

  const filteredTodos = useMemo(() => {
    let filtered = [...todos];

    switch (filter) {
      case "today":
        filtered = todos.filter(t => t.dueDate && isToday(new Date(t.dueDate)));
        break;
      case "upcoming":
        filtered = todos.filter(t => t.dueDate && isFuture(new Date(t.dueDate)));
        break;
      case "completed":
        filtered = todos.filter(t => t.completed);
        break;
      case "favorites":
        filtered = todos.filter(t => t.isFavorite); // Placeholder for future feature
        break;
      default:
        break;
    }

    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [todos, filter, searchQuery]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          backgroundColor: 'background.paper',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Search>
            <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
            <StyledInputBase
              placeholder="Search tasks…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Search>
          <Box>
            <IconButton onClick={() => setSettingsOpen(true)}><SettingsIcon /></IconButton>
            <Button variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout} sx={{ ml: 1 }}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{ width: drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" } }}
        variant="permanent"
        anchor="left"
      >
<Toolbar>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <TaskAltIcon />
    <Typography variant="h6" sx={{ fontWeight: 700 }}>
      TaskMaster
    </Typography>
  </Box>
</Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.name} disablePadding>
              <ListItemButton selected={filter === item.filter} onClick={() => handleFilterChange(item.filter, item.name)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}>
        <Toolbar />

            <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{pageTitle}</Typography>
            </Box>
            {loading ? (
              <Box display="flex" justifyContent="start" my={4}><CircularProgress /></Box>
            ) : (
              <TodoList
                todos={filteredTodos}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTodo}
                onEdit={handleOpenForm}
              />
            )}
      </Box>

      <Box sx={{ position: "fixed", bottom: 32, right: 32, display: "flex", flexDirection: "column", gap: 2 }}>
        <Tooltip title="Add Task with Voice">
            <VoiceCommandButton onResult={handleVoiceResult}>
                {(handleListen, isListening) => (
                    <Fab color={isListening ? "error" : "secondary"} onClick={handleListen} aria-label="voice command">
                        <MicIcon />
                    </Fab>
                )}
            </VoiceCommandButton>
        </Tooltip>
        <Tooltip title="Add New Task">
            <Fab color="primary" onClick={() => handleOpenForm()} aria-label="add task"><AddIcon /></Fab>
        </Tooltip>
      </Box>

      <TodoForm open={isFormOpen} onClose={handleCloseForm} onSave={handleSaveTodo} todo={editingTodo} />
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <DialogTitle>Theme Settings</DialogTitle>
        <DialogContent><ThemeSwitcher /></DialogContent>
        <DialogActions><Button onClick={() => setSettingsOpen(false)}>Close</Button></DialogActions>
      </Dialog>
    </Box>
  );
}