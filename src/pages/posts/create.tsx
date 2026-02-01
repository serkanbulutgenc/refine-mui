import { useForm } from '@refinedev/react-hook-form';

import { Create, useAutocomplete } from '@refinedev/mui';
import type { HttpError } from '@refinedev/core';
import { Box, TextField, Autocomplete } from '@mui/material';
import { Controller, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PostSchema } from '../../types/schemas';
import type { TPost } from '../../types';
import { z } from 'zod';

export interface ICategory {
  id: number;
  title: string;
}

export const PostFormSchema = PostSchema.extend({
  categoryId: z.number().int().positive(),
}).partial();

export default function PostCreate() {
  const {
    //mutation,
    //saveButtonProps,
    control,
    register,
    refineCore: { onFinish, formLoading },
    handleSubmit,

    formState: { errors },
  } = useForm<TPost>({
    //redirect: 'show',
    resolver: zodResolver(PostFormSchema),
  });

  const { autocompleteProps } = useAutocomplete<ICategory>({
    resource: 'categories',
    debounce: 500,
  });

  const submitForm = async (values: FieldValues) => {
    console.log(values);
    await onFinish(values);
  };

  return (
    <Create
      isLoading={formLoading}
      saveButtonProps={{
        onClick: handleSubmit(submitForm, (values) =>
          alert(JSON.stringify(values))
        ),
      }}
    >
      <Box
        component="form"
        sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
      >
        <TextField
          variant="outlined"
          size="small"
          {...register('title')}
          error={!!errors.title}
          helperText={(errors as any)?.title?.message}
          label="Title"
        />
        <Controller
          control={control}
          name="category"
          rules={{
            required: 'This field is required',
            value: 'Value error message',
          }}
          render={({ field: { value, onChange, ...rest } }) => (
            <Autocomplete
              {...autocompleteProps}
              {...rest}
              size="small"
              autoComplete
              openOnFocus
              clearOnEscape
              includeInputInList
              selectOnFocus
              value={value ?? null}
              getOptionKey={(option) => option.id}
              onChange={(_, value) => {
                onChange(value);
              }}
              getOptionLabel={(item) => {
                return (
                  autocompleteProps?.options?.find(
                    (p) => p?.id?.toString() === item?.id?.toString()
                  )?.title ?? ''
                );
              }}
              isOptionEqualToValue={(option, value) =>
                value === undefined ||
                option?.id?.toString() === (value?.id ?? value)?.toString()
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select a category"
                  label="Category"
                  margin="normal"
                  variant="outlined"
                  error={!!errors.category}
                  helperText={(errors as any).category?.message}
                  required
                />
              )}
            />
          )}
        />

        <TextField
          variant="outlined"
          size="small"
          {...register('body')}
          error={!!errors.body}
          helperText={(errors as any)?.body?.message}
          multiline
          maxRows={10}
          minRows={3}
          label="Body"
        />
      </Box>
    </Create>
  );
}
