type Props = {
  children: React.ReactNode;
};

export function AuthCard({ children }: Props) {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-8 shadow-xl shadow-black/20">
          {children}
        </div>
      </div>
    </div>
  );
}
