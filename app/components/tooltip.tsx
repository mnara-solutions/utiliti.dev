import * as React from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  useTransitionStyles,
  useMergeRefs,
  FloatingPortal,
} from "@floating-ui/react";
import type { Placement } from "@floating-ui/react";

interface TooltipOptions {
  initialOpen?: boolean;
  placement?: Placement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function useTooltip({
  initialOpen = false,
  placement = "top",
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: TooltipOptions = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;
  const arrowRef = React.useRef(null);

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        crossAxis: placement.includes("-"),
        fallbackAxisSideDirection: "start",
        padding: 5,
      }),
      shift({ padding: 5 }),
      arrow({ element: arrowRef }),
    ],
  });

  const context = data.context;
  const hover = useHover(context, {
    move: false,
    enabled: controlledOpen == null,
    delay: 100,
  });
  const focus = useFocus(context, {
    enabled: controlledOpen == null,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });
  const interactions = useInteractions([hover, focus, dismiss, role]);

  return React.useMemo(
    () => ({
      open,
      setOpen,
      arrowRef,
      ...interactions,
      ...data,
    }),
    [open, setOpen, interactions, data],
  );
}

type ContextType = ReturnType<typeof useTooltip> | null;

const TooltipContext = React.createContext<ContextType>(null);

export const useTooltipContext = () => {
  const context = React.useContext(TooltipContext);

  if (context == null) {
    throw new Error("Tooltip components must be wrapped in <Tooltip />");
  }

  return context;
};

export function Tooltip({
  children,
  ...options
}: { children: React.ReactNode } & TooltipOptions) {
  const tooltip = useTooltip(options);
  return (
    <TooltipContext.Provider value={tooltip}>
      {children}
    </TooltipContext.Provider>
  );
}

export function TooltipTrigger({
  children,
  ref,
  asChild = false,
  ...props
}: React.HTMLProps<HTMLElement> & { asChild?: boolean }) {
  const context = useTooltipContext();
  const childrenRef = (children as any).ref;
  const mergedRef = useMergeRefs([context.refs.setReference, ref, childrenRef]);

  if (asChild && React.isValidElement(children)) {
    const childElement = children as React.ReactElement<HTMLElement>;

    return React.cloneElement(
      childElement,
      context.getReferenceProps({
        ref: mergedRef,
        ...props,
        ...childElement.props,
        "data-state": context.open ? "open" : "closed",
      } as any),
    );
  }

  return (
    <button
      ref={mergedRef}
      data-state={context.open ? "open" : "closed"}
      {...context.getReferenceProps(props)}
    >
      {children}
    </button>
  );
}

export function TooltipContent({
  style,
  ref,
  ...props
}: React.HTMLProps<HTMLElement>) {
  const context = useTooltipContext();
  const mergedRef = useMergeRefs([context.refs.setFloating, ref]);
  const { isMounted, styles } = useTransitionStyles(context.context);
  const { x: arrowX, y: arrowY } = context.middlewareData.arrow ?? {};

  const staticSide =
    {
      top: "bottom",
      right: "left",
      bottom: "top",
      left: "right",
    }[context.placement.split("-")[0]] ?? "";

  if (!context.open || !isMounted) return null;

  return (
    <FloatingPortal>
      <div
        ref={mergedRef}
        style={{
          position: context.strategy,
          top: context.y ?? 0,
          left: context.x ?? 0,
          visibility: context.x == null ? "hidden" : "visible",
          ...style,
          ...styles,
        }}
        {...context.getFloatingProps(props)}
      >
        {props.children}
        <div
          ref={context.arrowRef}
          className="tooltip-arrow"
          style={{
            position: "absolute",
            width: "12px",
            height: "12px",
            background: "inherit",
            left: arrowX != null ? `${arrowX}px` : "",
            top: arrowY != null ? `${arrowY}px` : "",
            [staticSide]: "-6px",
            transform: "rotate(45deg)",
          }}
        ></div>
      </div>
    </FloatingPortal>
  );
}
