import React from 'react';
import {
  useDataGrid,
  EditButton,
  ShowButton,
  DeleteButton,
  List,
  UrlField,
  TagField,
} from '@refinedev/mui';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Stack } from '@mui/material';

interface TCategory {
  id: number;
  title: string;
  description?: string;
}
interface TPost {
  id: number;
  title: string;
  slug: string;
  category: TCategory;
}

export default function PostsList() {
  const {
    dataGridProps,
    tableQuery: { isLoading },
  } = useDataGrid<TPost>({
    sorters: { initial: [{ field: 'id', order: 'asc' }] },
    pagination: {
      pageSize: 5,
    },
    syncWithLocation: true,
  });

  const columns = React.useMemo<GridColDef<TPost>[]>(
    () => [
      { field: 'id', type: 'number',  maxWidth:50},
      { field: 'title', type: 'string', minWidth:100, display:'flex', flex:2, headerName: 'Title' },
      {
        field: 'slug',
        type: 'string',
        display: 'flex',
        headerName: 'Slug',
        minWidth: 100,
        flex: 2,
        renderCell: ({ row }) => <UrlField value={row.slug} />,
      },
      {
        field: 'category',
        align:'center',
        headerAlign:'center',
        valueGetter: (value) => {
          if (!value) return value;
          return value.title;
        },
        renderCell: ({ row }) => <TagField value={row.category.title} />,
        type: 'string',
        flex: 1,
        headerName: 'Category',
      },
      {
        field: 'actions',
        headerName: 'Actions',
        display: 'flex',
        flex:1,
        align:'right',
        headerAlign:'right',
        sortable:false,
        disableColumnMenu:true,
        renderCell: function render({ row }) {
          return (
            <Stack spacing={1} direction={'row'}>
              <ShowButton hideText recordItemId={row.id} />
              <EditButton hideText recordItemId={row.id} />
              <DeleteButton size="small" recordItemId={row.id} />
            </Stack>
          );
        },
      },
    ],
    [isLoading]
  );

  return (
    <>
      <List
        contentProps={{}}
        wrapperProps={{ elevation: 0 }}
        createButtonProps={{
          disableElevation: true,
          disableRipple: true,
        }}
      >
        <DataGrid
          columns={columns}
          pageSizeOptions={[5, 10, 25, 100]}
          {...dataGridProps}
          //pagination={paginationModel:{ pageSize: 5, page: 1 }}
        />
      </List>
    </>
  );
}
