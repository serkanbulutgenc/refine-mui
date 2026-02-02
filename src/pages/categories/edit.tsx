import { Box, Stack, TextField } from "@mui/material";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";

export const CategoryEdit: React.ComponentType = () => {
  const {
    saveButtonProps,
    control,
    register,
    formState: { isLoading },
  } = useForm({});
  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Box component={"form"}>
        <Stack spacing={2}>
          <TextField
            {...register("title")}
            variant="outlined"
            fullWidth
            size="small"
          />
          <TextField
            multiline
            size="small"
            {...register("description")}
            rows={10}
            fullWidth
          />
        </Stack>{" "}
      </Box>
    </Edit>
  );
};
