import { useShow, useNavigation } from '@refinedev/core';
import {
  Show,
  Breadcrumb,
  DeleteButton,
  TextFieldComponent as TextField,
} from '@refinedev/mui';
import { Typography, Stack } from '@mui/material';
export default function PostShow() {
  const {
    query: { isLoading },
    result: record,
  } = useShow();

  const { list } = useNavigation();
  return (
    <Show
      isLoading={isLoading}
      title={
        <Typography variant="subtitle2" component="span" color="secondary">
          Post : {record?.title}
        </Typography>
      }
      breadcrumb={
        <div
          style={{
            padding: '3px 6px',
            backgroundColor: '#efefef',
          }}
        >
          <Breadcrumb />
        </div>
      }
      footerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <DeleteButton
            onSuccess={() => {
              list('posts');
            }}
          />
        </>
      )}
    >
      <Stack spacing={2}>
        <Typography variant="body1" fontWeight="bold">
          Title
        </Typography>
        <TextField value={record?.title} />
        <Typography variant="body1" fontWeight="bold">
          Content
        </Typography>
        <TextField value={record?.body} aria-multiline />
      </Stack>
    </Show>
  );
}
