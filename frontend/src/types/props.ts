import React from "react";

export interface ProtectedRouteProps {
  children: React.ReactNode;
}

export interface LoginFormProps {
  onLoginSuccess?: () => void;
}

export interface SearchBoxProps {
  onSearch: (query: string) => Promise<void>;
  loading?: boolean;
}

export interface MovieDetailsModalProps {
  movie: any;
  onClose: () => void;
}
