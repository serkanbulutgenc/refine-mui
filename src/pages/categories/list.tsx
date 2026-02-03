import { Stack } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  UrlField,
  useDataGrid,
} from "@refinedev/mui";
import React from "react";
import type { TCategory } from "../../types";
import { useNavigation } from "@refinedev/core";

export const CategoryList = () => {
  const { showUrl } = useNavigation();
  const {
    dataGridProps,
    tableQuery: { isLoading },
  } = useDataGrid({ resource: "categories", pagination: { pageSize: 5 } });

  const columns = React.useMemo<GridColDef<TCategory>[]>(
    () => [
      {
        field: "id",
        type: "number",
        headerName: "#",
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
        renderCell: ({ row }) => {
          return (
            <UrlField value={showUrl("categories", row.id)}>
              <span>{row.title}</span>
            </UrlField>
          );
        },
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
            <EditButton color="secondary" recordItemId={row.id} />
            <DeleteButton recordItemId={row.id} />
          </Stack>
        ),
      },
    ],
    [isLoading],
  );

  return (
    <List>
      <DataGrid
        {...dataGridProps}
        columns={columns}
        pageSizeOptions={[
          { label: "5", value: 5 },
          { label: "10", value: 10 },
          { label: "25", value: 25 },
        ]}
      />
    </List>
  );
};
