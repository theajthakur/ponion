import React from "react";
import { Coffee, Loader, IceCream, Pizza } from "lucide-react";

const UserLoading = () => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-background font-sans">
      <div className="flex flex-col items-center space-y-6">
        <div className="flex space-x-6">
          <Coffee className="w-12 h-12 text-primary animate-bounce" />
          <Pizza className="w-12 h-12 text-primary animate-spin" />
          <IceCream className="w-12 h-12 text-primary animate-bounce delay-150" />
        </div>
        <p className="text-[var(--color-foreground)] text-lg text-center max-w-xs">
          "Good things take time… fetching the tastiest dishes for you!" 🍔🍦☕
        </p>
      </div>
    </div>
  );
};

export default UserLoading;
