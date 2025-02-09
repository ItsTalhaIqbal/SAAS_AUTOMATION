import InfoBar from "@/src/components/infobar";
import Sidbar from "@/src/components/sidebar";
import React from "react";

type Props = { children: React.ReactNode };

const layout = (props: Props) => {
  return (
    <div className="flex overflow-hidden h-screen">
      <Sidbar />
      <div className="w-full">
        <InfoBar />
        {props.children}
        </div>
      
    </div>
  );
};

export default layout;
