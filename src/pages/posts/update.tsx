import { useUpdate, useOne } from '@refinedev/core';
import { useAutocomplete, Breadcrumb } from '@refinedev/mui';
import { TextField, Autocomplete, Box, Stack, Button } from '@mui/material';
import { Edit } from '@refinedev/mui';
import { useForm } from '@refinedev/react-hook-form';
import { Controller } from 'react-hook-form';
import { PostFormSchema, type ICategory } from './create';
import type { TPost } from '../../types';
import { zodResolver } from '@hookform/resolvers/zod';

export default function PostUpdate() {
  const {
    saveButtonProps,
    refineCore: { query, autoSaveProps },
    register,
    control,

    formState: { errors },
  } = useForm<TPost>({ resolver: zodResolver(PostFormSchema) });

  const post = query?.data?.data;

  const { autocompleteProps: categoryAutocompleteProps } =
    useAutocomplete<ICategory>({
      resource: 'categories',
      defaultValue: post?.category?.id,
    });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = Object.fromEntries(
      new FormData(event.currentTarget).entries()
    );

    onFinish({
      ...data,
      price: Number(data.price).toFixed(2),
    });
  };

  return (
    <Edit
      saveButtonProps={saveButtonProps}
      autoSaveProps={autoSaveProps}
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <Button variant="contained">Custom Button</Button>
        </>
      )}
      breadcrumb={
        <div
          style={{
            padding: '3px 6px',
            border: '2px dashed cornflowerblue',
          }}
        >
          <Breadcrumb />
        </div>
      }
    >
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column' }}>
        <Stack spacing={2}>
          <TextField
            size="small"
            {...register('title')}
            defaultValue={post?.title}
            error={(errors as any)?.title}
            helperText={(errors as any)?.title?.message}
          />
          <Controller
            name="category"
            control={control}
            defaultValue={null as any}
            render={({ field }) => {
              return (
                <Autocomplete
                  {...categoryAutocompleteProps}
                  {...field}
                  onChange={(_, value) => {
                    field.onChange(value);
                  }}
                  getOptionLabel={(item) => {
                    return (
                      categoryAutocompleteProps?.options?.find(
                        (p) => p?.id?.toString() === item?.id?.toString()
                      )?.title ?? ''
                    );
                  }}
                  getOptionKey={(option) => option.id}
                  isOptionEqualToValue={(option, value) =>
                    value === undefined ||
                    option?.id?.toString() === (value?.id ?? value)?.toString()
                  }
                  renderInput={(props) => (
                    <TextField
                      {...props}
                      error={(errors as any)?.category}
                      helperText={(errors as any)?.category?.message}
                    />
                  )}
                />
              );
            }}
          />
          <TextField
            size="small"
            multiline
            {...register('body')}
            minRows={3}
            maxRows={10}
            defaultValue={post?.body}
          />
        </Stack>
      </Box>
    </Edit>
  );
}
