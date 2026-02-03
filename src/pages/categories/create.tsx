import { Box, Stack, TextField } from "@mui/material";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import type { FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategorySchema } from "../../types/schemas";
import type { TCategory } from "../../types";

const CategoryFormSchema = CategorySchema.pick({
  title: true,
  description: true,
});

export const CategoryCreate = () => {
  const {
    saveButtonProps,
    control,
    register,
    formState: { isLoading, errors },
    handleSubmit,
    refineCore: { onFinish },
  } = useForm<TCategory>({
    resolver: zodResolver(CategoryFormSchema),
  });

  const handleEditForm = async (values: FieldValues) => {
    await onFinish(values);
  };
  console.log(errors);
  return (
    <Create
      isLoading={isLoading}
      saveButtonProps={{
        onClick: handleSubmit(handleEditForm, (values: FieldValues) => {
          console.log("Error while saving category", values);
        }),
      }}
    >
      <Box component={"form"}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            size="small"
            variant="standard"
            label="Title"
            {...register("title")}
            error={!!errors.title}
            helperText={(errors as any)?.title?.message}
          />
          <TextField
            {...register("description")}
            size="small"
            rows={4}
            label="Description"
            multiline
            fullWidth
            variant="standard"
            error={!!errors.desciption}
            helperText={(errors as any)?.title?.desciption}
          />
        </Stack>
      </Box>
    </Create>
  );
};
