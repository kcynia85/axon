export type Breadcrumb = {
  readonly label: string;
  readonly href?: string;
  readonly isLast?: boolean;
};

export type BreadcrumbsProps = {
  readonly items: readonly Breadcrumb[];
  readonly className?: string;
};
