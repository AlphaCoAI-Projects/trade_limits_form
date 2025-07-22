import React from "react";
import FormContent from "./_components/content";
import FormScreen from "./_components/FormScreen";


const TradeFormEditableTable = () => {
  return (
    <div className="h-auto md:m-10 m-4 flex flex-col justify-center items-center">
      <div>
        <FormScreen />
      </div>
      <div>
        <FormContent />
      </div>
    </div>
  );
};

export default TradeFormEditableTable;
