
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  useTheme,
} from "@mui/material";
import {
  Speed as SpeedIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: theme.shadows[10],
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
        <Box sx={{ mb: 2, color: theme.palette.primary.main }}>{icon}</Box>
        <Typography
          gutterBottom
          variant="h5"
          component="h2"
          color="textPrimary"
        >
          {title}
        </Typography>
        <Typography color="textSecondary">{description}</Typography>
      </CardContent>
    </Card>
  );
};

const Home: React.FC = () => {
  const theme = useTheme();
  const features = [
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: "High Performance",
      description:
        "Lightning-fast performance with optimized workflows and real-time updates.",
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: "Secure Platform",
      description:
        "Enterprise-grade security with advanced encryption and protection.",
    },
  ];
  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh" }}>
      <Paper
        sx={{
          position: "relative",
          backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
          mb: 4,
          backgroundSize: "cover",
          backgroundPosition: "center",
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                component="h1"
                variant="h2"
                color="textPrimary"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                }}
              >
                Welcome to Your Dashboard
              </Typography>
              <Typography
                variant="h5"
                color="textSecondary"
                paragraph
                sx={{ mb: 4 }}
              >
                Manage your projects, track progress, and achieve your goals
                with our powerful platform.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}></Grid>
          </Grid>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography
          variant="h3"
          align="center"
          color="textPrimary"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Key Features
        </Typography>
        <Grid
          container
          direction="row"
          spacing={4}
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
              <FeatureCard {...feature} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
