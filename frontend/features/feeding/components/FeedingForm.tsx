"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LocalizationProvider } from "@mui/x-date-pickers";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { InputBase, Slider, Box } from "@mui/material";
import FormRow from "@/shared/components/FormRow";
import { FeatureTheme } from "@/lib/theme";
import {
  feedingFormSchema,
  FeedingFormValues,
} from "@/lib/schemas/feeding.schema";

interface FeedingFormProps {
  onSubmit: (data: FeedingFormValues) => void;
  initialData?: Partial<FeedingFormValues>;
  isEditing?: boolean;
}

export default function FeedingForm({
  onSubmit,
  initialData,
  isEditing = false,
}: FeedingFormProps) {
  const { control, handleSubmit, watch, reset, setValue } =
    useForm<FeedingFormValues>({
      resolver: zodResolver(feedingFormSchema),
      mode: "onChange",
      defaultValues: {
        type: "Bottle",
        leftDuration: 0,
        rightDuration: 0,
        amountMl: 0,
        note: "",
        ...initialData,
        startTime: initialData?.startTime
          ? new Date(initialData.startTime)
          : new Date(),
      },
    });

  const type = watch("type");
  const amountMl = watch("amountMl");

  useEffect(() => {
    if (initialData) {
      reset({
        type: "Nursing",
        leftDuration: 0,
        rightDuration: 0,
        amountMl: 0,
        note: "",
        ...initialData,
        startTime: initialData?.startTime
          ? new Date(initialData.startTime)
          : new Date(),
      });
    }
  }, [initialData, reset]);

  const [isNoteVisible, setIsNoteVisible] = React.useState(!!initialData?.note);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form
        id="feeding-form"
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 flex flex-col gap-6"
      >
        <Controller
          name="type"
          control={control}
          render={({ field }) => {
            if (isEditing) return <></>;
            return (
              <div className="bg-[#f3f4f6] p-[4px] rounded-full flex h-[52px]">
                <button
                  type="button"
                  className={`flex-1 rounded-full text-base font-medium transition-all h-[44px] flex items-center justify-center 
                                        ${field.value === "Nursing" ? "text-white shadow-sm" : "text-[#4a5565]"}
                                    `}
                  style={{
                    backgroundColor:
                      field.value === "Nursing"
                        ? FeatureTheme.feeding.primary
                        : "transparent",
                  }}
                  onClick={() => field.onChange("Nursing")}
                >
                  Nursing
                </button>
                <button
                  type="button"
                  className={`flex-1 rounded-full text-base font-medium transition-all h-[44px] flex items-center justify-center 
                                        ${field.value === "Bottle" ? "text-white shadow-sm" : "text-[#4a5565]"}
                                    `}
                  style={{
                    backgroundColor:
                      field.value === "Bottle"
                        ? FeatureTheme.feeding.primary
                        : "transparent",
                  }}
                  onClick={() => field.onChange("Bottle")}
                >
                  Bottle
                </button>
              </div>
            );
          }}
        />

        <div className="flex flex-col bg-white rounded-2xl overflow-hidden px-4">
          <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
              <FormRow label="Start Time" showDivider={true}>
                <ThemeProvider
                  theme={createTheme({
                    palette: {
                      primary: {
                        main: FeatureTheme.feeding.primary,
                      },
                    },
                    components: {
                      MuiPickersDay: {
                        styleOverrides: {
                          root: {
                            "&.Mui-selected": {
                              backgroundColor: FeatureTheme.feeding.primary,
                              color: "#fff",
                              "&:hover": {
                                backgroundColor: FeatureTheme.feeding.primary,
                              },
                              "&:focus": {
                                backgroundColor: FeatureTheme.feeding.primary,
                              },
                            },
                          },
                        },
                      },
                    },
                  })}
                >
                  <MobileDateTimePicker
                    value={field.value}
                    onChange={(newValue) => field.onChange(newValue)}
                    format="yyyy-MM-dd HH:mm"
                    ampm={false}
                    slotProps={{
                      textField: {
                        variant: "standard",
                        InputProps: {
                          disableUnderline: true,
                          sx: {
                            fontSize: "18px",
                            fontWeight: 500,
                            color: `${FeatureTheme.feeding.primary} !important`,
                            width: "fit-content",
                            display: "inline-flex",
                            "& .MuiInputBase-input": {
                              textAlign: "right",
                              padding: 0,
                              color: `${FeatureTheme.feeding.primary} !important`,
                              WebkitTextFillColor: `${FeatureTheme.feeding.primary} !important`,
                              cursor: "pointer",
                              width: "auto",
                            },
                            "& .MuiInputAdornment-root": {
                              marginLeft: "4px",
                            },
                            "& .MuiPickersSectionList-root": {
                              justifyContent: "flex-end",
                              flexGrow: "0 !important",
                            },
                          },
                        },
                        sx: {
                          width: "auto",
                          "& .MuiInputBase-root": {
                            width: "fit-content",
                            display: "inline-flex",
                            justifyContent: "flex-end !important",
                          },
                        },
                      },
                    }}
                  />
                </ThemeProvider>
              </FormRow>
            )}
          />

          {type === "Nursing" ? (
            <>
              <Controller
                name="leftDuration"
                control={control}
                render={({ field, fieldState }) => (
                  <FormRow
                    label="Left Breast"
                    showDivider={true}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        width: "100%",
                      }}
                    >
                      <InputBase
                        {...field}
                        type="number"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        placeholder="0"
                        sx={{
                          fontSize: "18px",
                          fontWeight: 500,
                          color: field.value
                            ? FeatureTheme.feeding.primary
                            : "text.disabled",
                          textAlign: "right",
                          "& input": { textAlign: "right", p: 0 },
                        }}
                      />
                      <Box
                        component="span"
                        sx={{
                          ml: 0.5,
                          fontSize: "18px",
                          fontWeight: 500,
                          color: FeatureTheme.feeding.primary,
                        }}
                      >
                        min
                      </Box>
                    </Box>
                  </FormRow>
                )}
              />
              <Controller
                name="rightDuration"
                control={control}
                render={({ field, fieldState }) => (
                  <FormRow
                    label="Right Breast"
                    showDivider={false}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        width: "100%",
                      }}
                    >
                      <InputBase
                        {...field}
                        type="number"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        placeholder="0"
                        sx={{
                          fontSize: "18px",
                          fontWeight: 500,
                          color: field.value
                            ? FeatureTheme.feeding.primary
                            : "text.disabled",
                          textAlign: "right",
                          "& input": { textAlign: "right", p: 0 },
                        }}
                      />
                      <Box
                        component="span"
                        sx={{
                          ml: 0.5,
                          fontSize: "18px",
                          fontWeight: 500,
                          color: FeatureTheme.feeding.primary,
                        }}
                      >
                        min
                      </Box>
                    </Box>
                  </FormRow>
                )}
              />

              {control._formState.errors.root && (
                <p className="px-5 pb-3 text-xs text-red-500 text-right -mt-2">
                  {control._formState.errors.root.message}
                </p>
              )}
            </>
          ) : (
            <>
              <Controller
                name="amountMl"
                control={control}
                render={({ field, fieldState }) => (
                  <FormRow
                    label="Amount"
                    showDivider={false}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    footer={
                      <Box sx={{ px: 1, pt: 1 }}>
                        <Slider
                          value={field.value || 0}
                          onChange={(_, newValue) =>
                            field.onChange(newValue as number)
                          }
                          min={0}
                          max={300}
                          step={5}
                          sx={{
                            color: FeatureTheme.feeding.primary,
                            height: 6,
                            "& .MuiSlider-thumb": {
                              width: 24,
                              height: 24,
                              backgroundColor: "#fff",
                              border: `2px solid ${FeatureTheme.feeding.primary}`,
                              "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible":
                                {
                                  boxShadow: `0px 0px 0px 8px ${FeatureTheme.feeding.primary}20`,
                                },
                            },
                            "& .MuiSlider-rail": {
                              opacity: 0.2,
                              backgroundColor: FeatureTheme.feeding.primary,
                            },
                          }}
                        />
                      </Box>
                    }
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        width: "100%",
                      }}
                    >
                      <InputBase
                        {...field}
                        type="number"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        placeholder="0"
                        sx={{
                          fontSize: "18px",
                          fontWeight: 500,
                          color: field.value
                            ? FeatureTheme.feeding.primary
                            : "text.disabled",
                          textAlign: "right",
                          "& input": { textAlign: "right", p: 0 },
                        }}
                      />
                      <Box
                        component="span"
                        sx={{
                          ml: 0.5,
                          fontSize: "18px",
                          fontWeight: 500,
                          color: FeatureTheme.feeding.primary,
                        }}
                      >
                        ml
                      </Box>
                    </Box>
                  </FormRow>
                )}
              />
            </>
          )}
        </div>

        <div className="bg-white rounded-2xl overflow-hidden px-4">
          <Controller
            name="note"
            control={control}
            render={({ field }) => {
              const hasValue = field.value && field.value.length > 0;

              if (isNoteVisible || hasValue) {
                return (
                  <FormRow label="Note" layout="vertical" showDivider={false}>
                    <InputBase
                      {...field}
                      placeholder="Add a note..."
                      multiline
                      minRows={3}
                      fullWidth
                      sx={{
                        fontSize: "16px",
                        color: "#101828",
                        backgroundColor: "#f9fafb",
                        borderRadius: "12px",
                        padding: "12px",
                      }}
                    />
                  </FormRow>
                );
              }

              return (
                <button
                  type="button"
                  onClick={() => {
                    setIsNoteVisible(true);
                    field.onChange("");
                  }}
                  className="text-[#99a1af] text-sm font-normal flex items-center gap-1 py-4 hover:opacity-80 transition-opacity"
                >
                  + add note
                </button>
              );
            }}
          />
        </div>
      </form>
    </LocalizationProvider>
  );
}
