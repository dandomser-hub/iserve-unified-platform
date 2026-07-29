export function isRequired(value: string | undefined | null): string | null {
  if (!value || value.trim() === '') return 'This field is required.';
  return null;
}

export function isValidDate(value: string): string | null {
  if (!value) return 'Date is required.';
  const d = new Date(value);
  if (isNaN(d.getTime())) return 'Invalid date format.';
  return null;
}

export function isPositiveNumber(value: number | undefined): string | null {
  if (value === undefined || value === null) return 'Required.';
  if (value < 0) return 'Must be a positive number.';
  return null;
}

export function hasMinLength(value: string, min: number): string | null {
  if (!value || value.length < min) return `Minimum ${min} characters required.`;
  return null;
}

export function validateResidentForm(data: Record<string, string>): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.firstName) errors.firstName = 'First name is required.';
  if (!data.lastName) errors.lastName = 'Last name is required.';
  if (!data.sex) errors.sex = 'Sex is required.';
  if (!data.birthDate) errors.birthDate = 'Birth date is required.';
  if (!data.civilStatus) errors.civilStatus = 'Civil status is required.';
  if (!data.address) errors.address = 'Address is required.';
  if (!data.purok) errors.purok = 'Purok is required.';
  return errors;
}
