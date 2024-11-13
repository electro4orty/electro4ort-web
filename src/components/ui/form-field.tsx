import { FieldValues, UseFormGetFieldState } from 'react-hook-form';
import { Input, InputProps } from './input';
import { Label } from './label';

interface FormFieldProps<TFieldValues extends FieldValues = FieldValues> {
  label?: string;
  fieldState?: ReturnType<UseFormGetFieldState<TFieldValues>>;
  inputProps?: InputProps;
  render?: (props?: InputProps) => React.ReactNode;
}

export default function FormField({
  label,
  fieldState,
  inputProps,
  render,
}: FormFieldProps) {
  return (
    <div className="space-y-1">
      {label && <Label>{label}</Label>}
      {render ? render(inputProps) : <Input {...inputProps} />}
      {fieldState?.error?.message && (
        <p className="text-sm font-medium text-destructive">
          {fieldState.error.message}
        </p>
      )}
    </div>
  );
}
