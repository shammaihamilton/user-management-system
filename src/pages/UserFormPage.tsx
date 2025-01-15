import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  IconButton,
  InputAdornment 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { addUser, updateUser, fetchUserById } from '../redux/thunks/usersThunk';
import { AppDispatch } from '../redux/store';

const UserFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    existingPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    existingPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      dispatch(fetchUserById(id))
        .unwrap()
        .then((data) => {
          setFormData((prev) => ({
            ...prev,
            ...data,
            existingPassword: data.password,
            newPassword: '',
            confirmPassword: '',
          }));
        })
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    }
    return () => {
      setError(null);
    };
  }, [id, dispatch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClickShowPassword = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New password and confirm password do not match!');
        setLoading(false);
        return;
      }
    }

    const submitData = {
      username: formData.username,
      fullName: formData.fullName,
      email: formData.email,
      password: formData.newPassword || formData.existingPassword,
    };

    const action = id
      ? updateUser({ id, ...submitData })
      : addUser(submitData);

    dispatch(action)
      .unwrap()
      .then(() => navigate('/users'))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  const getPasswordEndAdornment = (field: keyof typeof showPasswords) => (
    <InputAdornment position="end">
      <IconButton
        aria-label="toggle password visibility"
        onClick={() => handleClickShowPassword(field)}
        edge="end"
      >
        {showPasswords[field] ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  );

  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: 'auto',
        mt: 8,
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        {id ? 'Update User' : 'Add User'}
      </Typography>

      {error && (
        <Typography variant="body1" sx={{ marginBottom: 2, color: 'red' }}>
          {error}
        </Typography>
      )}

      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
        onSubmit={handleSubmit}
      >
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          fullWidth
        />

        {id && (
          <>
            <TextField
              label="Existing Password"
              name="existingPassword"
              type={showPasswords.existingPassword ? 'text' : 'password'}
              value={formData.existingPassword}
              InputProps={{
                readOnly: true,
                endAdornment: getPasswordEndAdornment('existingPassword'),
              }}
              fullWidth
              helperText="Current password (read-only)"
            />
            <TextField
              label="New Password"
              name="newPassword"
              type={showPasswords.newPassword ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={handleChange}
              InputProps={{
                endAdornment: getPasswordEndAdornment('newPassword'),
              }}
              fullWidth
              helperText="Enter new password (leave blank to keep existing)"
            />
            <TextField
              label="Confirm New Password"
              name="confirmPassword"
              type={showPasswords.confirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              InputProps={{
                endAdornment: getPasswordEndAdornment('confirmPassword'),
              }}
              fullWidth
              helperText="Confirm your new password"
            />
          </>
        )}

        {!id && (
          <>
            <TextField
              label="Password"
              name="newPassword"
              type={showPasswords.newPassword ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: getPasswordEndAdornment('newPassword'),
              }}
              fullWidth
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type={showPasswords.confirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: getPasswordEndAdornment('confirmPassword'),
              }}
              fullWidth
            />
          </>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            {id ? 'Update' : 'Add'} User
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/users')}
            disabled={loading}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default UserFormPage;