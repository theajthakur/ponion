import { CookingPot } from "lucide-react";
import React from "react";

export default function page() {
  return (
    <div className="flex min-h-[90vh] w-full justify-center items-center">
      <div>
        <CookingPot className="p-3 border-2 rounded-sm w-15 h-15 mx-auto" />
        <h3 className="">Patience, let your users placed a Order!</h3>
      </div>
    </div>
  );
}
