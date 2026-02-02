import { Stack } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import React from "react";
import type { TCategory } from "../../types";

export const CategoryList = () => {
  const {
    dataGridProps,
    tableQuery: { isLoading },
  } = useDataGrid({ resource: "categories", pagination: { pageSize: 5 } });

  const columns = React.useMemo<GridColDef<TCategory>[]>(
    () => [
      {
        field: "id",
        type: "number",
        headerName: "ID",
        maxWidth: 60,
        sortable: false,
        filterable: false,
      },
      {
        field: "title",
        type: "string",
        headerName: "Title",
        display: "flex",
        flex: 2,
      },
      {
        field: "actions",
        type: "actions",
        headerName: "" as string,
        display: "flex",
        sortable: false,
        filterable: false,
        align: "right",
        flex: 2,
        renderCell: ({ row }) => (
          <Stack spacing={1} direction={"row"}>
            <ShowButton hideText recordItemId={row.id} />
            <EditButton hideText recordItemId={row.id} />
            <DeleteButton hideText recordItemId={row.id} />
          </Stack>
        ),
      },
    ],
    [isLoading],
  );

  return (
    <List>
      <DataGrid {...dataGridProps} columns={columns} />
    </List>
  );
};
