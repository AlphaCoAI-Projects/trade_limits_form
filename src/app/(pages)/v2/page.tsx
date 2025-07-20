import React from "react";
import { FormTable } from "./_components/table";
import FormHeader from "./_components/header";
import FormContent from "./_components/content";


const TradeFormEditableTable = () => {
  return (
    <div className="h-auto md:m-10 m-4 flex flex-col justify-center items-center">
      <div>
        <FormHeader />
      </div>
      <div>
        {/* <FormTable /> */}
      </div>
      <div>
        <FormContent />
      </div>
    </div>
  );
};

export default TradeFormEditableTable;
