import React from "react";
import { Coffee, Server, ChefHat, Loader } from "lucide-react";

const AdminLoading = () => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-background font-sans">
      <div className="flex flex-col items-center space-y-6">
        <div className="flex space-x-6">
          <Coffee className="w-12 h-12 text-primary animate-bounce" />
          <Server className="w-12 h-12 text-primary animate-spin" />
          <ChefHat className="w-12 h-12 text-primary animate-bounce delay-150" />
        </div>
        <p className="text-[var(--color-foreground)] text-lg text-center max-w-xs">
          "Great meals start with patience… loading your admin panel!" 🍴
        </p>
      </div>
    </div>
  );
};

export default AdminLoading;
