import * as React from "react";
import { useRender } from "@base-ui-components/react/use-render";
import { mergeProps } from "@base-ui-components/react/merge-props";

type BaseCardProps = {
  render?: React.ReactElement | ((props: any) => React.ReactElement);
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "className">;

type CardTitleProps = BaseCardProps & {
  size?: "heading-1" | "heading-2" | "title-1" | "title-2";
};

const Card = React.forwardRef<HTMLDivElement, BaseCardProps>(
  ({ className, render, as, children, ...props }, ref) => {
    const DefaultElement = as || "div";

    const defaultProps = {
      ref,
      className: "surface high rounded-lg border-thin border-muted shadow-sm",
      children,
    };

    const element = useRender({
      render: render || React.createElement(DefaultElement),
      props: mergeProps(defaultProps, { className, ...props }),
    });

    return element;
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, BaseCardProps>(
  ({ className, render, as, children, ...props }, ref) => {
    const DefaultElement = as || "div";

    const defaultProps = {
      ref,
      className: "flex flex-col space-y-1.5 p-6",
      children,
    };

    const element = useRender({
      render: render || React.createElement(DefaultElement),
      props: mergeProps(defaultProps, { className, ...props }),
    });

    return element;
  }
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLDivElement, CardTitleProps>(
  ({ className, render, as, children, size = "heading-1", ...props }, ref) => {
    const DefaultElement = as || "div";

    const defaultProps = {
      ref,
      className: `typo ${size}`,
      children,
    };

    const element = useRender({
      render: render || React.createElement(DefaultElement),
      props: mergeProps(defaultProps, { className, ...props }),
    });

    return element;
  }
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLDivElement, BaseCardProps>(
  ({ className, render, as, children, ...props }, ref) => {
    const DefaultElement = as || "div";

    const defaultProps = {
      ref,
      className: "typo caption-1 text-secondary",
      children,
    };

    const element = useRender({
      render: render || React.createElement(DefaultElement),
      props: mergeProps(defaultProps, { className, ...props }),
    });

    return element;
  }
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, BaseCardProps>(
  ({ className, render, as, children, ...props }, ref) => {
    const DefaultElement = as || "div";

    const defaultProps = {
      ref,
      className: "p-6 pt-0",
      children,
    };

    const element = useRender({
      render: render || React.createElement(DefaultElement),
      props: mergeProps(defaultProps, { className, ...props }),
    });

    return element;
  }
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, BaseCardProps>(
  ({ className, render, as, children, ...props }, ref) => {
    const DefaultElement = as || "div";

    const defaultProps = {
      ref,
      className: "flex items-center gap-2 p-6 pt-0",
      children,
    };

    const element = useRender({
      render: render || React.createElement(DefaultElement),
      props: mergeProps(defaultProps, { className, ...props }),
    });

    return element;
  }
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
