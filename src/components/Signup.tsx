import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Snackbar,
    Link,
    IconButton,
    InputAdornment,
    Grid,
} from "@mui/material";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import StartIcon from "@mui/icons-material/Start"; // Import the StartIcon

const Signup: React.FC = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { signup, error, successMessage, clearMessages } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateEmail(email)) {
            setErrorMessage("Invalid email address.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        if (!validatePassword(password)) {
            setErrorMessage(
                "Password must be at least 8 characters long and contain a number."
            );
            return;
        }

        await signup(username, email, password);
    };

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePassword = (password: string) => {
        return password.length >= 8 && /\d/.test(password);
    };

    const handleLoginRedirect = () => {
        navigate("/login");
    };

    return (
        <Grid
            container
            spacing={2}
            sx={{
                mt: 4,
                p: 2,
                maxWidth: "1200px",
                justifyContent: "center",
                mx: "auto",
            }}
        >
            <Grid item xs={12} md={6}>
                <Box sx={{ pr: { xs: 0, md: 2 }, mb: { xs: 4, md: 0 } }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        sx={{ color: "#6b0f0f" }} // Set color for main heading
                    >
                        Start Investing Like a PRO with Expert Cryptocurrency Analysis and
                        Tools
                    </Typography>
                    <Typography
                        variant="h6"
                        component="h2"
                        gutterBottom
                        sx={{ display: "flex", alignItems: "center", color: "#3f4c5d" }} // Set color for subheadings
                    >
                        <StartIcon sx={{ mr: 1 }} /> Crypto Screener
                    </Typography>
                    <Typography
                        variant="h6"
                        component="h2"
                        gutterBottom
                        sx={{ display: "flex", alignItems: "center", color: "#3f4c5d" }} // Set color for subheadings
                    >
                        <StartIcon sx={{ mr: 1 }} /> Sector Signals
                    </Typography>
                    <Typography
                        variant="h6"
                        component="h2"
                        gutterBottom
                        sx={{ display: "flex", alignItems: "center", color: "#3f4c5d" }} // Set color for subheadings
                    >
                        <StartIcon sx={{ mr: 1 }} /> Cryptocurrency Technical Analysis
                    </Typography>
                    <Typography
                        variant="h6"
                        component="h2"
                        gutterBottom
                        sx={{ display: "flex", alignItems: "center", color: "#3f4c5d" }} // Set color for subheadings
                    >
                        <StartIcon sx={{ mr: 1 }} /> Crypto Lists & Coin Analyzer
                    </Typography>
                    <Typography
                        variant="h6"
                        component="h2"
                        gutterBottom
                        sx={{ display: "flex", alignItems: "center", color: "#3f4c5d" }} // Set color for subheadings
                    >
                        <StartIcon sx={{ mr: 1 }} /> Portfolio X-Ray Analyzer
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={12} md={6}>
                <Box sx={{ maxWidth: 400, mx: "auto" }}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Username"
                            fullWidth
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <TextField
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            fullWidth
                            margin="normal"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            Signup
                        </Button>
                    </form>
                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        Already have an account?{" "}
                        <Link
                            component="button"
                            onClick={handleLoginRedirect}
                            color="primary"
                        >
                            Login
                        </Link>
                    </Typography>
                    {(error || errorMessage) && (
                        <Snackbar
                            open={true}
                            autoHideDuration={6000}
                            onClose={clearMessages}
                            message={error || errorMessage}
                            color="blue"
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                        />
                    )}
                    {successMessage && (
                        <Snackbar
                            open={true}
                            autoHideDuration={6000}
                            onClose={clearMessages}
                            message={successMessage}
                            color="green"
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                        />
                    )}
                </Box>
            </Grid>
        </Grid>
    );
};

export default Signup;
