"use client";

import { CheckCircle } from "@mui/icons-material";
import { Card, CardContent, Typography, Button } from "@mui/material";

export default function SuccessRestaurantCreation() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-50 px-4">
      <Card className="max-w-md w-full shadow-lg rounded-2xl">
        <CardContent className="flex flex-col items-center text-center p-8">
          <CheckCircle className="text-green-500 !w-20 !h-20 mb-6" />
          <Typography variant="h5" component="h1" className="font-bold mb-4">
            Request Received ✅
          </Typography>
          <Typography variant="body1" className="text-gray-600 mb-6">
            We have received your request for restaurant registration. Our team
            will review your details and verify your restaurant shortly. Please
            wait while we complete the verification process.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            className="rounded-xl px-6 py-2"
          >
            Go to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
