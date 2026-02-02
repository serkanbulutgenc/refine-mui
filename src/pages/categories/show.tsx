import { Stack, Typography } from "@mui/material";
import { useShow } from "@refinedev/core";
import { Show, TextFieldComponent } from "@refinedev/mui";
import type { TCategory } from "../../types";

export const CategoryShow = () => {
  const {
    result: category,
    query: { isLoading },
  } = useShow<TCategory>({ resource: "categories" });
  return (
    <Show
      isLoading={isLoading}
      title={
        <Typography variant="h6" color="textSecondary">
          Category
        </Typography>
      }
    >
      <Stack spacing={2}>
        <Typography variant="body1" fontWeight="bold">
          Title
        </Typography>
        <TextFieldComponent value={category?.title} />
        <Typography variant="body1" fontWeight="bold">
          Description
        </Typography>
        <TextFieldComponent value={category?.description} />
      </Stack>
    </Show>
  );
};
