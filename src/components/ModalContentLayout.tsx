import type { ReactNode } from "react";

interface ModalContentLayoutProps {
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Gives every application modal one vertical scrolling region while keeping an
 * optional action footer visible.
 */
export function ModalContentLayout({
  children,
  footer,
}: ModalContentLayoutProps) {
  return (
    <div
      style={{
        display: "flex",
        flex: "1 1 auto",
        flexDirection: "column",
        minHeight: 0,
        overflow: "clip",
        width: "100%",
      }}
    >
      <div
        data-modal-scroll-container
        style={{
          flex: "1 1 auto",
          minHeight: 0,
          overflowX: "hidden",
          overflowY: "auto",
          overscrollBehavior: "contain",
          paddingRight: "0.5rem",
        }}
      >
        {children}
      </div>

      {footer ? (
        <div style={{ flex: "0 0 auto" }}>{footer}</div>
      ) : null}
    </div>
  );
}
