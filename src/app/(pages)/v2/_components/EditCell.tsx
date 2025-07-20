import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Company, TableMeta } from "@/types/table.types";
import { Row, Table } from "@tanstack/react-table";
import { Edit, X, Check } from "lucide-react"
import { MouseEvent, useEffect } from "react"

type EditCellProps = {
  row: Row<Company>;
  table: Table<Company>;
};

export const EditCell = ({ row, table }: EditCellProps) => {
  const meta = table.options.meta as TableMeta

  const isEditing = meta?.editedRows[row.id];
  const isRowValid = meta?.validRows[row.index];
  const disableSubmit = isRowValid ? Object.values(isRowValid).some((v) => !v) : false;

  const toggleEdit = (e: MouseEvent<HTMLButtonElement>) => {
    const action = e.currentTarget.name;
    if (action === "edit") {
      meta.setEditedRows((prev) => ({ ...prev, [row.id]: true }));
    } else if (action === "cancel") {
      meta.setEditedRows((prev) => ({ ...prev, [row.id]: false }));
      meta.revertData(row.index);
    } else if (action === "submit") {
      meta.setEditedRows((prev) => ({ ...prev, [row.id]: false }));
      meta.updateRow(row.index);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && isEditing && !disableSubmit) {
      meta?.setEditedRows((prev: any) => ({
        ...prev,
        [row.id]: false,
      }))
      meta?.updateRow(row.index)
    }
  }

  useEffect(() => {
    if (isEditing) {
      window.addEventListener("keydown", handleKeyDown)
      return () => {
        window.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [isEditing])

  return (
    <div className="edit-cell-container flex items-center gap-2">
      {isEditing ? (
        <>
          <Button
            onClick={toggleEdit}
            name="cancel"
            title="Cancel"
            className="text-red-500"
            variant="icon"
            size="icon"
          >
            <X />
          </Button>
          <Button
            onClick={toggleEdit}
            name="submit"
            title="Save"
            disabled={disableSubmit}
            className={`${
              disableSubmit ? "opacity-40 cursor-not-allowed" : "text-green-500"
            }`}
            variant="icon"
            size="icon"
          >
            <Check />
          </Button>
        </>
      ) : (
        <Button
          onClick={toggleEdit}
          name="edit"
          title="Edit"
          variant="icon"
          size="icon"
        >
          <Edit />
        </Button>
      )}

      <Input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        className="ml-2"
      />
    </div>
  )
}
