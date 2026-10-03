export type FormState = {
  message?: string;
  errors?: Record<string, string>;
  ok?: boolean;
};

export type ActionResult = {
  ok: boolean;
  message: string;
};
