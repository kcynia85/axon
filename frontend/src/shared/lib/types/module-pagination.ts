export type PageItem = {
  readonly number: number;
  readonly isActive: boolean;
};

export type ModulePaginationProps = {
  readonly pages: readonly PageItem[];
  readonly onPageChange?: (page: number) => void;
  readonly canGoBack: boolean;
  readonly canGoNext: boolean;
  readonly onBack: () => void;
  readonly onNext: () => void;
  readonly className?: string;
};
