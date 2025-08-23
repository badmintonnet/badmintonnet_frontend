export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-layout">
      {/* Không render Header ở đây */}
      {children}
    </div>
  );
}
