import { Card, CardContent, CardHeader, Typography } from "@mui/material";

const Dashboard: React.ComponentType = () => {
  return (
    <Card>
      <CardHeader title="Dashboard" subheader="Admin things" />
      <CardContent>
        <Typography variant="h4" component={"p"}>
          Dashboard
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
